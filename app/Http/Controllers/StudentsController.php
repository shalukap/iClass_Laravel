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


    // dd($students->toArray());

    return Inertia::render('students/index', [
        'students' => $students
    ]);
}




    public function create()
    {
        $schools = Schools::all(['schoolId', 'name']);

        return Inertia::render('students/create', [
            'schools' => $schools,
            'isEdit' => false
        ]);
    }

   public function store(Request $request)
{
    $validated = $request->validate(Students::rules(false));

    $last = Students::orderBy('sid', 'desc')->first();
    $number = $last ? (substr($last->sid, 3) + 1) : 1;
    $sid = 'STU' . sprintf('%06d', $number);

    if ($request->hasFile('image')) {
        $filename = $request->file('image')->getClientOriginalName();
        $request->file('image')->move(public_path('images'), $filename);
        $validated['image'] = $filename;
    } else {
        $validated['image'] = 'default.jpg';
    }

    $validated['sid'] = $sid;
    $validated['schoolId'] = $request->school; // map correctly

    Students::create($validated);

    return redirect()->route('students.index');
}

public function update(Request $request, Students $student)
{
    $validated = $request->validate(Students::rules(true));

    if ($request->hasFile('image')) {
        $filename = $request->file('image')->getClientOriginalName();
        $request->file('image')->move(public_path('images'), $filename);
        $validated['image'] = $filename;
    }

    $validated['schoolId'] = $request->school;

    $student->update($validated);

    return redirect()->route('students.index');
}

public function edit(Students $student)
{
    $schools = Schools::all(['schoolId', 'name']);

    return Inertia::render('students/create', [
        'student' => [
            ...$student->toArray(),
            'school' => $student->schoolId
        ],
        'schools' => $schools,
        'isEdit' => true
    ]);
}


    public function destroy(Students $student)
    {
        if ($student) {
            $student->delete();
        }

        return redirect()->route('students.index');
    }
}
