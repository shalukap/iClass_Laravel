<?php

namespace App\Http\Controllers;

use App\Models\Students;
use App\Models\Schools;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class StudentsController extends Controller
{
    public function index()
    {
        $students = Students::with('schoolDetails')->get();

        if (request()->wantsJson() || request()->is('api/*')) {
            return response()->json(['students' => $students]);
        }

        return view('app');
    }

    public function create()
    {
        $schools = Schools::all(['schoolId', 'name']);

        if (request()->wantsJson() || request()->is('api/*')) {
            return response()->json([
                'schools' => $schools,
                'isEdit' => false
            ]);
        }

        return view('app');
    }

    public function store(Request $request)
    {
        $validated = $request->validate(Students::rules(false));

        $last = Students::orderBy('sid', 'desc')->first();
        $number = $last ? (intval(substr($last->sid, 3)) + 1) : 1;
        $sid = 'STU' . sprintf('%06d', $number);

        if ($request->hasFile('image')) {
            $filename = time() . '_' . $request->file('image')->getClientOriginalName();
            $request->file('image')->move(public_path('images'), $filename);
            $validated['image'] = '/images/' . $filename;
        } else {
            $validated['image'] = '/images/default.jpg';
        }

        $validated['sid'] = $sid;
        $validated['schoolId'] = $request->school;

        $student = Students::create($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'Student created successfully', 'student' => $student]);
        }

        return redirect()->route('students.index');
    }

    public function update(Request $request, Students $student)
    {
        $validated = $request->validate(Students::rules(true));

        if ($request->hasFile('image')) {
            $filename = time() . '_' . $request->file('image')->getClientOriginalName();
            $request->file('image')->move(public_path('images'), $filename);
            $validated['image'] = '/images/' . $filename;
        }

        $validated['schoolId'] = $request->school;

        $student->update($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'Student updated successfully', 'student' => $student]);
        }

        return redirect()->route('students.index');
    }

    public function edit(Students $student)
    {
        $schools = Schools::all(['schoolId', 'name']);

        if (request()->wantsJson() || request()->is('api/*')) {
            return response()->json([
                'student' => [
                    ...$student->toArray(),
                    'school' => $student->schoolId
                ],
                'schools' => $schools,
                'isEdit' => true
            ]);
        }

        return view('app');
    }

    public function destroy(Students $student)
    {
        if ($student) {
            $student->delete();
        }

        if (request()->wantsJson() || request()->is('api/*')) {
            return response()->json(['message' => 'Student deleted successfully']);
        }

        return redirect()->route('students.index');
    }
}
