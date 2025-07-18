<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classes = Classes::latest()->get();

        return Inertia::render('classes/index', [
            'classes' => $classes
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('classes/create');
    }

    /**
     * Store a newly created resource in storage.
     */
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
        $class->save();

        return redirect()->route('classes.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Classes $class)
    {
        return Inertia::render('classes/create', [
            'classItem' => $class,
            'isEdit' => true
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Classes $class)
    {
        if ($class) {
            // $class->cid = $request->cid;
            $class->name = $request->name;
            $class->time_start = $request->time_start;
            $class->time_end = $request->time_end;
            $class->save();
        }

        return redirect()->route('classes.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Classes $class)
    {
        if ($class) {
            $class->delete();
        }

        return redirect()->route('classes.index');
    }
}
