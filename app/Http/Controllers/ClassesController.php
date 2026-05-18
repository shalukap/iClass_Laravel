<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use App\Models\Classroom;
use App\Models\Lectures;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassesController extends Controller
{
    public function index(Request $request)
    {
        $classes = Classes::with(['classroom', 'lecturer'])->latest()->get();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['classes' => $classes]);
        }

        return Inertia::render('classes/index', [
            'classes' => $classes
        ]);
    }

    public function create(Request $request)
    {
        $classrooms = Classroom::all();
        $lectures = Lectures::all();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['classrooms' => $classrooms, 'lectures' => $lectures]);
        }

        return Inertia::render('classes/create', [
            'classrooms' => $classrooms,
            'lectures' => $lectures,
        ]);
    }

    public function store(Request $request)
    {
        $last = Classes::orderBy('cid', 'desc')->first();
        $number = $last ? intval(substr($last->cid, 3)) + 1 : 1;
        $cid = 'CLS' . str_pad($number, 6, '0', STR_PAD_LEFT);

        $class = new Classes();
        $class->cid = $cid;
        $class->name = $request->name;
        $class->day = $request->day;
        $class->time_start = $request->time_start;
        $class->time_end = $request->time_end;
        $class->grade = $request->grade;
        $class->classroom_id = $request->classroom_id;
        $class->lid = $request->lid;
        $class->fee = $request->fee ?? 2000.00;
        $class->recurring_months = $request->recurring_months ?? 1;
        $class->medium = $request->medium ?? 'english';
        $class->syllabus = $request->syllabus ?? 'local';
        $class->color_code = $request->color_code ?? 'indigo';
        $class->save();

        $lecture = Lectures::find($request->lid);
        if ($lecture) {
            $lecture->classes()->attach($class->cid);
        }

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'Class created successfully', 'class' => $class]);
        }

        return redirect()->route('classes.index');
    }

    public function edit(Request $request, Classes $class)
    {
        $classrooms = Classroom::all();
        $lectures = Lectures::all();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'classItem' => $class,
                'classrooms' => $classrooms,
                'lectures' => $lectures
            ]);
        }

        return Inertia::render('classes/create', [
            'classItem' => $class,
            'isEdit' => true,
            'classrooms' => $classrooms,
            'lectures' => $lectures,
        ]);
    }

    public function update(Request $request, Classes $class)
    {
        if ($class) {
            $class->name = $request->name;
            $class->day = $request->day;
            $class->time_start = $request->time_start;
            $class->time_end = $request->time_end;
            $class->grade = $request->grade;
            $class->classroom_id = $request->classroom_id;
            $class->lid = $request->lid;
            $class->fee = $request->fee ?? 2000.00;
            $class->recurring_months = $request->recurring_months ?? 1;
            $class->medium = $request->medium;
            $class->syllabus = $request->syllabus;
            $class->color_code = $request->color_code;
            $class->save();
        }

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'Class updated successfully', 'class' => $class]);
        }

        return redirect()->route('classes.index');
    }

    public function destroy(Request $request, Classes $class)
    {
        if ($class) {
            $class->delete();
        }

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'Class deleted successfully']);
        }

        return redirect()->route('classes.index');
    }
}
