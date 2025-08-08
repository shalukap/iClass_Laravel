<?php

namespace App\Http\Controllers;

use App\Models\Students;
use App\Models\Classes;
use App\Models\StudentPayment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class StudentPaymentController extends Controller
{
    public function index()
    {
        $students = Students::with(['classes', 'payments'])->get()->map(function ($student) {
            $totalDue = $student->classes->sum('pivot.due_amount');
            $totalPaid = $student->payments->sum('amount');
            return [
                'sid' => $student->sid,
                'sname' => $student->sname,
                'image' => $student->image,
                'due_amount' => $totalDue - $totalPaid,
            ];
        });

        return Inertia::render('studentPayments/index', [
            'students' => $students,
        ]);
    }

    public function create(Request $request)
    {
        $sid = $request->route('sid') ?? $request->query('sid');

        if (!$sid) {
            return redirect()->route('student-payments.index')
                ->with('error', 'Student ID is required');
        }

        $student = Students::where('sid', $sid)->firstOrFail();

        $classes = $student->classes()
            ->select([
                'classes.cid',
                'classes.name',
                'class_student.due_amount'
            ])
            ->get();

        $last_payment = StudentPayment::where('sid', $sid)
            ->latest('payment_date')
            ->first();

        return Inertia::render('studentPayments/form', [
            'student' => [
                'sid' => $student->sid,
                'sname' => $student->sname,
            ],
            'classes' => $classes,
            'last_payment_date' => $last_payment?->payment_date?->toDateString(),
            'current_year' => now()->year,
            'current_month' => now()->month,
        ]);
    }

    public function store(Request $request)
    {
        $sid = $request->input('sid');

        $request->validate([
            'cid' => 'required|string',
            'year' => 'required|integer|min:2000|max:2100',
            'month' => 'required|integer|min:1|max:12',
            'amount' => 'required|numeric|min:0',
        ]);

        $existingPayment = StudentPayment::where([
            'sid' => $sid,
            'cid' => $request->cid,
            'year' => $request->year,
            'month' => $request->month,
        ])->first();

        if ($existingPayment) {
            return back()->withErrors([
                'payment' => 'A payment already exists for this student, class, and period.',
            ]);
        }

        $last = StudentPayment::orderBy('pid', 'desc')->first();
        $number = $last ? (int) (substr($last->pid, 3)) + 1 : 1;
        $pid = 'PAY' . str_pad($number, 6, '0', STR_PAD_LEFT);

        StudentPayment::create([
            'pid' => $pid,
            'sid' => $sid,
            'cid' => $request->cid,
            'year' => $request->year,
            'month' => $request->month,
            'amount' => $request->amount,
            'payment_date' => now(),
        ]);

        return redirect()->route('student-payments.index');
    }
}
