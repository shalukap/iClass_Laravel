<?php

namespace App\Http\Controllers;

use App\Models\Lectures;
use App\Models\Classes;
use App\Models\StudentPayment;
use App\Models\LecturePayment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use DB;

class LecturePaymentController extends Controller
{
    public function index()
    {
        $lectures = Lectures::with(['classes', 'payments'])->get()->map(function ($lecture) {
            // Calculate total earned (75% of all student payments for their classes)
            $totalEarned = $lecture->classes->sum(function ($class) {
                $totalStudentPayments = 0;
                if ($class->students) {
                    foreach ($class->students as $student) {
                        if ($student->payments) {
                            $totalStudentPayments += $student->payments->where('cid', $class->cid)->sum('amount');
                        }
                    }
                }
                return $totalStudentPayments * 0.75;
            });


            $totalPaid = $lecture->payments->sum('amount');

            return [
                'lid' => $lecture->lid,
                'lec_name' => $lecture->lec_name,
                'total_earned' => $totalEarned,
                'total_paid' => $totalPaid,
                'due_amount' => $totalEarned - $totalPaid,
            ];
        });

        return Inertia::render('lecturePayments/index', [
            'lectures' => $lectures,
        ]);
    }

    public function create(Request $request)
    {
        $lid = $request->route('lid') ?? $request->query('lid');

        if (!$lid) {
            return redirect()->route('lecture-payments.index')
                ->with('error', 'Lecture ID is required');
        }

        $lecture = Lectures::where('lid', $lid)->firstOrFail();

        $classes = $lecture->classes()->withCount('students')->get()->map(function ($class) {
            $totalStudentPayments = $class->students->sum(function ($student) use ($class) {
                return $student->payments->where('cid', $class->cid)->sum('amount');
            });

            $totalEarned = $totalStudentPayments * 0.75;
            $totalPaid = $class->lecturePayments->sum('amount');

            return [
                'cid' => $class->cid,
                'name' => $class->name,
                'student_count' => $class->students_count,
                'total_earned' => $totalEarned,
                'total_paid' => $totalPaid,
                'due_amount' => $totalEarned - $totalPaid,
            ];
        });

        $last_payment = LecturePayment::where('lid', $lid)
            ->latest('payment_date')
            ->first();

        return Inertia::render('lecturePayments/form', [
            'lecture' => [
                'lid' => $lecture->lid,
                'lec_name' => $lecture->lec_name,
            ],
            'classes' => $classes,
            'last_payment_date' => $last_payment?->payment_date?->toDateString(),
            'current_year' => now()->year,
            'current_month' => now()->month,
        ]);
    }

    public function store(Request $request)
    {
        $lid = $request->input('lid');

        $request->validate([
            'cid' => 'required|string',
            'year' => 'required|integer|min:2000|max:2100',
            'month' => 'required|integer|min:1|max:12',
            'amount' => 'required|numeric|min:0',
        ]);

        $existingPayment = LecturePayment::where([
            'lid' => $lid,
            'cid' => $request->cid,
            'year' => $request->year,
            'month' => $request->month,
        ])->first();

        if ($existingPayment) {
            return back()->withErrors([
                'payment' => 'A payment already exists for this lecture, class, and period.',
            ]);
        }

        $last = LecturePayment::orderBy('lpid', 'desc')->first();
        $number = $last ? (int) (substr($last->lpid, 3)) + 1 : 1;
        $lpid = 'LPY' . str_pad($number, 6, '0', STR_PAD_LEFT);

        LecturePayment::create([
            'lpid' => $lpid,
            'lid' => $lid,
            'cid' => $request->cid,
            'year' => $request->year,
            'month' => $request->month,
            'amount' => $request->amount,
            'payment_date' => now(),
        ]);

        return redirect()->route('lecture-payments.index');
    }

    public function classes(Request $request)
    {
        $classes = Classes::select('cid', 'name', 'medium', 'syllabus')->get();
        return Inertia::render('lecturePayments/classes', [
            'allClasses' => $classes
        ]);
    }

    public function searchLecture(Request $request)
    {
        $lid = trim($request->query('lid'));

        $lecture = Lectures::with([
            'classes' => function ($query) {
                $query->select('classes.cid', 'classes.name', 'classes.medium', 'classes.syllabus');
            }
        ])
            ->where('lid', $lid)
            ->first();

        if (!$lecture) {
            return response()->json(['message' => 'Lecture not found'], 404);
        }

        $formattedClasses = $lecture->classes->map(function ($class) {
            $totalStudentPayments = $class->students->sum(function ($student) use ($class) {
                return $student->payments()->where('cid', $class->cid)->sum('amount');
            });

            $totalEarned = $totalStudentPayments * 0.75;
            $totalPaid = $class->lecturePayments()->sum('amount');
            $dueAmount = $totalEarned - $totalPaid;

            return [
                'cid' => $class->cid,
                'name' => $class->name,
                'medium' => $class->medium,
                'syllabus' => $class->syllabus,
                'student_count' => $class->students_count,
                'total_earned' => $totalEarned,
                'total_paid' => $totalPaid,
                'due_amount' => $dueAmount,
            ];
        });

        $students = [];
        foreach ($lecture->classes as $class) {
            foreach ($class->students as $student) {
                $paid = $student->payments()
                    ->where('cid', $class->cid)
                    ->exists();

                $students[] = [
                    'sid' => $student->sid,
                    'sname' => $student->sname,
                    'cid' => $class->cid,
                    'paid' => $paid,
                ];
            }
        }

        return response()->json([
            'lecture' => [
                'lid' => $lecture->lid,
                'lec_name' => $lecture->lec_name,
                'classes' => $formattedClasses,
            ],
            'students' => $students,
        ]);
    }
}
