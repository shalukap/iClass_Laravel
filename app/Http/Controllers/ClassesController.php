<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use App\Models\Classroom;
use App\Models\Lectures;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassesController extends Controller
{
    public function index()
    {
        $classes = Classes::with(['classroom', 'lecturer'])->latest()->get();

        return Inertia::render('classes/index', [
            'classes' => $classes
        ]);
    }

    public function create()
    {
        $classrooms = Classroom::all();
        $lectures = Lectures::all();

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
        $class->time_start = $request->time_start;
        $class->time_end = $request->time_end;
        $class->grade = $request->grade;
        $class->classroom_id = $request->classroom_id;
        $class->lid = $request->lid;
        $class->fee = $request->fee ?? 2000.00;
        $class->save();

        return redirect()->route('classes.index');
    }

    public function edit(Classes $class)
    {
        $classrooms = Classroom::all();
        $lectures = Lectures::all();

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
            $class->time_start = $request->time_start;
            $class->time_end = $request->time_end;
            $class->grade = $request->grade;
            $class->classroom_id = $request->classroom_id;
            $class->lid = $request->lid;
            $class->fee = $request->fee ?? 2000.00;
            $class->save();
        }

        return redirect()->route('classes.index');
    }

    public function destroy(Classes $class)
    {
        if ($class) {
            $class->delete();
        }

        return redirect()->route('classes.index');
    }
}
