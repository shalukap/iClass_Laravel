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
        $lecture = Lectures::with([
            'classes' => function ($query) {
                $query->select('classes.cid', 'classes.name', 'classes.medium', 'classes.syllabus');
            }
        ])->where('lid', $lid)->first();

        if (!$lecture) {
            return response()->json(['message' => 'Lecture not found'], 404);
        }

        return response()->json([
            'lecture' => $lecture,
            'allClasses' => Classes::select('cid', 'name', 'medium', 'syllabus')->get(),
        ]);
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
