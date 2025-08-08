<?php

namespace App\Http\Controllers;

use App\Models\Students;
use App\Models\Schools;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentsController extends Controller
{
    public function index()
    {
        $students = Students::with([
            'schoolDetails' => function ($query) {
                $query->select('schoolId', 'name');
            }
        ])->get();

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
        $last = Students::orderBy('sid', 'desc')->first();
        $number = $last ? (substr($last->sid, 3) + 1) : 1;
        $sid = 'STU' . sprintf('%06d', $number);

        $request->merge([
            'sid' => $sid,
            'parentName' => $request->parentName ?? 'Unknown Parent',
            'tpNo' => $request->tpNo,
            'isActive' => $request->isActive,
            'schoolId' => $request->school,
        ]);

        if ($request->hasFile('image')) {
            $filename = $request->file('image')->getClientOriginalName();
            $request->file('image')->move(public_path('images'), $filename);
            $request->merge(['image' => $filename]);
        } else {
            $request->merge(['image' => 'default.jpg']);
        }

        Students::create($request->all());

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

    public function update(Request $request, Students $student)
    {
        if ($request->hasFile('image')) {
            $filename = $request->file('image')->getClientOriginalName();
            $request->file('image')->move(public_path('images'), $filename);
            $student->image = $filename;
        }

        $student->sname = $request->sname;
        $student->gender = $request->gender;
        $student->address = $request->address;
        $student->dob = $request->dob;
        $student->schoolId = $request->school;
        $student->parentName = $request->parentName;
        $student->tpNo = $request->tpNo;
        $student->watsapp = $request->watsapp;
        $student->isActive = $request->isActive;
        $student->save();

        return redirect()->route('students.index');
    }

    public function destroy(Students $student)
    {
        if ($student) {
            $student->delete();
        }

        return redirect()->route('students.index');
    }
}
