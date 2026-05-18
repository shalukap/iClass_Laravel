<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use App\Models\Students;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EnrollmentController extends Controller
{
    public function index(Request $request)
    {
        $classes = Classes::select('cid', 'name', 'medium', 'syllabus')->get();

        if ($request->wantsJson()) {
            return response()->json(['allClasses' => $classes]);
        }

        return Inertia::render('enrollments/enrollments', [
            'allClasses' => $classes
        ]);
    }

    public function createEnrollment(Request $request)
    {
        $classes = Classes::select('cid', 'name', 'medium', 'syllabus')->get();

        if ($request->wantsJson()) {
            return response()->json(['allClasses' => $classes]);
        }

        return inertia('enrollments/enrollments', [
            'allClasses' => $classes
        ]);
    }

    public function searchStudent(Request $request)
    {
        $term = trim($request->query('name') ?? $request->query('sid') ?? $request->query('query'));

        if (!$term) {
            return response()->json(['message' => 'Search term required'], 400);
        }

        // 1. Try Exact SID Match First (returns full student with classes)
        $student = Students::with([
            'classes' => function ($query) {
                $query->select('classes.cid', 'classes.name', 'classes.medium', 'classes.syllabus');
            }
        ])->where('sid', $term)->first();

        if ($student) {
            return response()->json([
                'student' => $student,
                'allClasses' => Classes::select('cid', 'name', 'medium', 'syllabus')->get(),
            ]);
        }

        // 2. Try Partial Name/SID Match (returns list for dropdown)
        $students = Students::where('sname', 'LIKE', '%' . $term . '%')
            ->orWhere('sid', 'LIKE', '%' . $term . '%')
            ->select('sid', 'sname')
            ->limit(10)
            ->get();

        return response()->json([
            'students' => $students
        ]);
    }

    public function storeEnrollment(Request $request)
    {
        $request->validate([
            'sid' => 'required|exists:students,sid',
            'cid' => 'required|exists:classes,cid',
        ]);

        $exists = DB::table('class_student')
            ->where('sid', $request->sid)
            ->where('cid', $request->cid)
            ->exists();

        if ($exists) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Student is already enrolled in this class'], 422);
            }
            return back()->with('error', 'Student is already enrolled in this class');
        }

        $class = Classes::find($request->cid);
        $dueAmount = $class->fee;

        DB::table('class_student')->insert([
            'sid' => $request->sid,
            'cid' => $request->cid,
            'due_amount' => $dueAmount,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Student enrolled successfully']);
        }

        return redirect()->route('enrollments.create')->with('success', 'Student enrolled successfully');
    }
}
