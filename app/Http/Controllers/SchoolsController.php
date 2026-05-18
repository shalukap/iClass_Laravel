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

        if (request()->wantsJson() || request()->is('api/*')) {
            return response()->json(['schools' => $schools]);
        }

        return view('app');
    }

    public function create()
    {
        if (request()->wantsJson() || request()->is('api/*')) {
            return response()->json([
                'isEdit' => false
            ]);
        }

        return view('app');
    }

    public function store(Request $request)
    {
        $last = Schools::orderBy('schoolId', 'desc')->first();
        $number = $last ? (intval(substr($last->schoolId, 3)) + 1) : 1;
        $schoolId = 'SCH' . sprintf('%06d', $number);

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $school = new Schools();
        $school->schoolId = $schoolId;
        $school->name = $request->name;
        $school->save();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'School created successfully', 'school' => $school]);
        }

        return redirect()->route('schools.index');
    }

    public function edit(Schools $school)
    {
        if (request()->wantsJson() || request()->is('api/*')) {
            return response()->json([
                'school' => $school->only(['schoolId', 'name']),
                'isEdit' => true
            ]);
        }

        return view('app');
    }

    public function update(Request $request, Schools $school)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        if ($school) {
            $school->name = $request->name;
            $school->save();
        }

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'School updated successfully', 'school' => $school]);
        }

        return redirect()->route('schools.index');
    }

    public function destroy(Schools $school)
    {
        if ($school) {
            $school->delete();
        }

        if (request()->wantsJson() || request()->is('api/*')) {
            return response()->json(['message' => 'School deleted successfully']);
        }

        return redirect()->route('schools.index');
    }
}
