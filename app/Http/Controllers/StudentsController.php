<?php

namespace App\Http\Controllers;

use App\Models\Students;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $students = Students::latest()->get();



        return Inertia::render('students/index', [
            'students' => $students
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('students/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $last = Students::orderBy('sid', 'desc')->first();
        $number = $last ? (substr($last->sid, 3) + 1) : 1;
        $sid = 'STU' . sprintf('%06d', $number);
        $request->merge(['sid' => $sid]);


        $request->merge([
            'parentName' => $request->parent ?? 'Unknown Parent',
            'tpNo' => $request->tpNo,
            'isActive' => $request->isActive,
            'school' => $request->school ?? 'SCH000',
        ]);


        if ($request->hasFile('image')) {
            $filename = $request->file('image')->getClientOriginalName();
            $request->file('image')->move(public_path('images'), $filename);
            $request->merge(['image' => $filename]);
        } else {
            $request->merge(['image' => 'default.jpg']);
        }

        $student = new Students($request->all());
        $student->save();

        return redirect()->route('students.index');
    }


    /**
     * Display the specified resource.
     */
    public function show(Students $students)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Students $student)
    {

        return Inertia::render('students/create', [
            'student' => $student,
            'isEdit' => true
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Students $student)
    {
        if ($request->hasFile('image')) {
            $request->file('image')->move(public_path('images'), $request->file('image')->getClientOriginalName());
            $request->merge(['image' => $request->file('image')->getClientOriginalName()]);
        }

        if ($student) {
            $student->sid = $request->sid;
            $student->sname = $request->sname;
            $student->gender = $request->gender;
            $student->address = $request->address;
            $student->dob = $request->dob;
            $student->school = $request->school;
            $student->parentName = $request->parentName;
            $student->tpNo = $request->tpNo;
            $student->watsapp = $request->watsapp;
            $student->isActive = $request->isActive;
            $student->save();
        }

        return redirect()->route('students.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Students $student)
    {

        if ($student) {
            $student->delete();
        }
        return redirect()->route('students.index');
    }

}
