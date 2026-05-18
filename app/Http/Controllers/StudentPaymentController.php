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
    public function index(Request $request)
    {
        $now = now();
        $year = $now->year;
        $month = $now->month;

        $students = Students::with(['classes', 'payments' => function ($query) use ($year, $month) {
            $query->where('year', $year)->where('month', $month);
        }])->get()->map(function ($student) {
            $totalDue = $student->classes->sum('pivot.due_amount');
            $totalPaid = $student->payments->sum('amount');
            return [
                'sid' => $student->sid,
                'sname' => $student->sname,
                'image' => $student->image,
                'due_amount' => max(0, $totalDue - $totalPaid),
            ];
        });

        if ($request->wantsJson()) {
            return response()->json(['students' => $students]);
        }

        return Inertia::render('studentPayments/index', [
            'students' => $students,
        ]);
    }

    public function create(Request $request)
    {
        $sid = $request->route('sid') ?? $request->query('sid');

        if (!$sid) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Student ID is required'], 400);
            }
            return redirect()->route('student-payments.index')
                ->with('error', 'Student ID is required');
        }

        $student = Students::where('sid', $sid)->firstOrFail();

        $year = $request->query('year', now()->year);
        $month = $request->query('month', now()->month);

        $classes = $student->classes()
            ->select(['classes.cid', 'classes.name', 'class_student.due_amount'])
            ->get()
            ->map(function ($class) use ($student, $year, $month) {
                $paidForClass = $student->payments()
                    ->where('cid', $class->cid)
                    ->where('year', $year)
                    ->where('month', $month)
                    ->sum('amount');

                return [
                    'cid' => $class->cid,
                    'name' => $class->name,
                    'initial_fee' => $class->due_amount,
                    'due_amount' => max(0, $class->due_amount - $paidForClass),
                ];
            });

        $last_payment = StudentPayment::where('sid', $sid)
            ->latest('payment_date')
            ->first();

        $existing_payments = StudentPayment::where('sid', $sid)
            ->get(['cid', 'year', 'month']);

        $history = StudentPayment::where('sid', $sid)
            ->with('class')
            ->latest('payment_date')
            ->get()
            ->map(function ($pay) {
                return [
                    'pid' => $pay->pid,
                    'class_name' => $pay->class->name ?? 'Unknown',
                    'amount' => $pay->amount,
                    'date' => $pay->payment_date->toDateTimeString(),
                    'period' => $pay->month . '/' . $pay->year
                ];
            });

        // Calculate overall outstanding balances across all months (last 24 months for discovery)
        // Calculate overall outstanding balances across all months starting from registration
        $outstanding_summary = [];
        $discovery_start = $student->created_at ? $student->created_at->copy()->startOfMonth() : now()->subMonths(12);
        $discovery_end = now()->endOfMonth();
        
        $current = $discovery_start->copy()->startOfMonth();
        while ($current <= $discovery_end) {
            $y = $current->year;
            $m = $current->month;
            
            foreach ($student->classes as $class) {
                $initial = $class->pivot->due_amount;
                $paid = $student->payments()
                    ->where('cid', $class->cid)
                    ->where('year', $y)
                    ->where('month', $m)
                    ->sum('amount');
                
                if ($paid < $initial) {
                    $outstanding_summary[] = [
                        'cid' => $class->cid,
                        'class_name' => $class->name,
                        'year' => $y,
                        'month' => $m,
                        'month_name' => $current->format('F'),
                        'due' => $initial - $paid
                    ];
                }
            }
            $current->addMonth();
        }

        $data = [
            'student' => [
                'sid' => $student->sid,
                'sname' => $student->sname,
            ],
            'classes' => $classes,
            'existing_payments' => $existing_payments,
            'history' => $history,
            'outstanding_summary' => $outstanding_summary,
            'last_payment_date' => $last_payment?->payment_date?->toDateString(),
            'current_year' => (int)$year,
            'current_month' => (int)$month,
        ];

        if ($request->wantsJson()) {
            return response()->json($data);
        }

        return Inertia::render('studentPayments/form', $data);
    }

    public function store(Request $request)
    {
        $sid = $request->input('sid');

        $request->validate([
            'sid' => 'required|string|exists:students,sid',
            'cid' => 'required|string',
            'year' => 'required|integer|min:2000|max:2100',
            'month' => 'required|integer|min:1|max:12',
            'amount' => 'required|numeric|min:0',
        ]);

        // Allowed multiple payments for partial settlement

        $last = StudentPayment::orderBy('pid', 'desc')->first();
        $number = $last ? (int) (substr($last->pid, 3)) + 1 : 1;
        $pid = 'PAY' . str_pad($number, 6, '0', STR_PAD_LEFT);

        $payment = StudentPayment::create([
            'pid' => $pid,
            'sid' => $sid,
            'cid' => $request->cid,
            'year' => $request->year,
            'month' => $request->month,
            'amount' => $request->amount,
            'payment_date' => now(),
        ]);

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Payment recorded successfully', 'payment' => $payment]);
        }

        return redirect()->route('student-payments.index');
    }
    public function bulkStore(Request $request)
    {
        $sid = $request->input('sid');
        $payments = $request->input('payments'); // Array of {cid, year, month, amount}

        if (!$sid || !is_array($payments)) {
            return response()->json(['message' => 'Invalid data provided.'], 400);
        }

        $recordedPayments = [];
        $lastPid = StudentPayment::orderBy('pid', 'desc')->first();
        $number = $lastPid ? (int) (substr($lastPid->pid, 3)) : 0;

        foreach ($payments as $pay) {
            $number++;
            $pid = 'PAY' . str_pad($number, 6, '0', STR_PAD_LEFT);

            $recordedPayments[] = StudentPayment::create([
                'pid' => $pid,
                'sid' => $sid,
                'cid' => $pay['cid'],
                'year' => $pay['year'],
                'month' => $pay['month'],
                'amount' => $pay['amount'],
                'payment_date' => now(),
            ]);
        }

        return response()->json([
            'message' => count($recordedPayments) . ' payments recorded successfully',
            'payments' => $recordedPayments
        ]);
    }

    public function destroy(Request $request, $pid)
    {
        $payment = StudentPayment::where('pid', $pid)->firstOrFail();
        
        if ($request->has('reason')) {
            $payment->delete_reason = $request->input('reason');
            $payment->save();
        }

        $payment->delete();

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Receipt deleted successfully']);
        }

        return back()->with('success', 'Receipt deleted successfully');
    }
}
