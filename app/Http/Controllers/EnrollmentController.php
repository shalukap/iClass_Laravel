<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use App\Models\Students;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;



class EnrollmentController extends Controller
{

    public function index()
    {
        return Inertia::render('enrollments/enrollments');
    }

    public function createEnrollment()
    {
        $classes = Classes::select('cid', 'name', 'medium', 'syllabus')->get();
        return inertia('enrollments/enrollments', [
            'allClasses' => $classes
        ]);
    }

    public function searchStudent(Request $request)
    {
        $sid = trim($request->query('sid'));
        $student = Students::with([
            'classes' => function ($query) {
                $query->select('classes.cid', 'classes.name', 'classes.medium', 'classes.syllabus');
            }
        ])->where('sid', $sid)->first();

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        return response()->json([
            'student' => $student,
            'allClasses' => Classes::select('cid', 'name', 'medium', 'syllabus')->get(),
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

        return redirect()->route('enrollments.create')->with('success', 'Student enrolled successfully');
    }
}
