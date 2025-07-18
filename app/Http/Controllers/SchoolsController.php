<?php

namespace App\Http\Controllers;

use App\Models\Schools;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $schools = Schools::latest()->get(['schoolId', 'name']);

        return Inertia::render('schools/index', [
            'schools' => $schools
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('schools/CreateOrEdit');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $last = Schools::orderBy('schoolId', 'desc')->first();
        $number = $last ? (substr($last->schoolId, 3) + 1) : 1;
        $schoolId = 'SCH' . sprintf('%06d', $number);

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $school = new Schools();
        $school->schoolId = $schoolId;
        $school->name = $request->name;
        $school->save();

        return redirect()->route('schools.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Schools $school)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Schools $school)
    {
        return Inertia::render('schools/CreateOrEdit', [
            'school' => $school->only(['schoolId', 'name']),
            'isEdit' => true
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Schools $school)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        if ($school) {
            $school->name = $request->name;
            $school->save();
        }

        return redirect()->route('schools.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Schools $school)
    {
        if ($school) {
            $school->delete();
        }
        return redirect()->route('schools.index');
    }
}
