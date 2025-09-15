<?php
namespace App\Http\Controllers;

use App\Models\Lectures;
use App\Models\Classes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LectureEnrollmentController extends Controller
{
    public function index()
    {
        return Inertia::render('lecture-enrollments/index');
    }

    public function searchLecture(Request $request)
    {
        $lid = trim($request->query('lid'));
        $name = trim($request->query('name'));

        // Search by Lecture ID
        if ($lid) {
            $lecture = Lectures::with([
                'classes' => function ($query) {
                    $query->select('classes.cid', 'classes.name', 'classes.medium', 'classes.syllabus');
                }
            ])->where('lid', $lid)->first();

            if (!$lecture) {
                return response()->json(['message' => 'Lecture not found'], 404);
            }

            return $this->getLectureDetails($lecture);
        }

        // Search by Lecture Name
        if ($name) {
            $lectures = Lectures::whereRaw('LOWER(lec_name) LIKE ?', ['%' . strtolower($name) . '%'])
                ->select('lid', 'lec_name')
                ->get();

            if ($lectures->isEmpty()) {
                return response()->json(['message' => 'No lectures found'], 404);
            }

            return response()->json([
                'lectures' => $lectures
            ]);
        }

        return response()->json(['message' => 'Please provide either LID or lecture name'], 400);
    }

    private function getLectureDetails($lecture)
    {
        // Get additional class information with student counts and payment details
        $classesWithDetails = DB::table('lecture_class')
            ->where('lecture_class.lid', $lecture->lid)
            ->join('classes', 'lecture_class.cid', '=', 'classes.cid')
            ->leftJoin('class_student', 'classes.cid', '=', 'class_student.cid')
            ->leftJoin('lecture_payments', function($join) use ($lecture) {
                $join->on('classes.cid', '=', 'lecture_payments.cid')
                     ->where('lecture_payments.lid', $lecture->lid);
            })
            ->select(
                'classes.cid',
                'classes.name',
                'classes.medium',
                'classes.syllabus',
                DB::raw('COUNT(DISTINCT class_student.sid) as student_count'),
                DB::raw('SUM(class_student.due_amount * 0.75) as total_earned'),
                // FIXED: Use actual lecture payments instead of student payments
                DB::raw('COALESCE(SUM(lecture_payments.amount), 0) as total_paid'),
                // FIXED: Calculate due amount based on actual payments to lecture
                DB::raw('GREATEST(SUM(class_student.due_amount * 0.75) - COALESCE(SUM(lecture_payments.amount), 0), 0) as due_amount')
            )
            ->groupBy('classes.cid', 'classes.name', 'classes.medium', 'classes.syllabus')
            ->get();

        // Get students with payment status
        $students = DB::table('lecture_class')
            ->where('lecture_class.lid', $lecture->lid)
            ->join('class_student', 'lecture_class.cid', '=', 'class_student.cid')
            ->join('students', 'class_student.sid', '=', 'students.sid')
            ->leftJoin('student_payments', function($join) {
                $join->on('class_student.sid', '=', 'student_payments.sid')
                     ->on('class_student.cid', '=', 'student_payments.cid');
            })
            ->select(
                'students.sid',
                'students.sname',
                'class_student.cid',
                DB::raw('CASE WHEN student_payments.sid IS NOT NULL THEN true ELSE false END as paid')
            )
            ->get();

        return response()->json([
            'lecture' => array_merge($lecture->toArray(), ['classes' => $classesWithDetails]),
            'students' => $students,
            'allClasses' => Classes::select('cid', 'name', 'medium', 'syllabus')->get(),
        ]);
    }

    public function getLectureById($lid)
    {
        $lecture = Lectures::with([
            'classes' => function ($query) {
                $query->select('classes.cid', 'classes.name', 'classes.medium', 'classes.syllabus');
            }
        ])->where('lid', $lid)->first();

        if (!$lecture) {
            return response()->json(['message' => 'Lecture not found'], 404);
        }

        return $this->getLectureDetails($lecture);
    }

    public function storeEnrollment(Request $request)
    {
        $request->validate([
            'lid' => 'required|exists:lectures,lid',
            'cid' => 'required|exists:classes,cid',
        ]);

        $exists = DB::table('lecture_class')
            ->where('lid', $request->lid)
            ->where('cid', $request->cid)
            ->exists();

        if ($exists) {
            return back()->with('error', 'Lecture is already assigned to this class');
        }

        DB::table('lecture_class')->insert([
            'lid' => $request->lid,
            'cid' => $request->cid,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->route('lecture-enrollments.index')
            ->with('success', 'Lecture assigned to class successfully');
    }
}
