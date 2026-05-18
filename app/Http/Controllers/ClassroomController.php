<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassroomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $classrooms = Classroom::latest()->get();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['classrooms' => $classrooms]);
        }

        return Inertia::render('classrooms/index', [
            'classrooms' => $classrooms
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('classrooms/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $last = Classroom::orderBy('classroomId', 'desc')->first();
        $number = $last ? intval(substr($last->classroomId, 3)) + 1 : 1;
        $classroomId = 'CR' . str_pad($number, 6, '0', STR_PAD_LEFT);

        $classroom = new Classroom();
        $classroom->classroomId = $classroomId;
        $classroom->name = $request->name;
        $classroom->save();

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Classroom created successfully', 'classroom' => $classroom]);
        }

        return redirect()->route('classrooms.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Classroom $classroom)
    {
        if ($request->wantsJson()) {
            return response()->json(['classroom' => $classroom]);
        }

        return Inertia::render('classrooms/create', [
            'classroomItem' => $classroom,
            'isEdit' => true
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Classroom $classroom)
    {
        if ($classroom) {
            $classroom->name = $request->name;
            $classroom->save();
        }

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Classroom updated successfully', 'classroom' => $classroom]);
        }

        return redirect()->route('classrooms.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Classroom $classroom)
    {
        if ($classroom) {
            $classroom->delete();
        }

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Classroom deleted successfully']);
        }

        return redirect()->route('classrooms.index');
    }
}
