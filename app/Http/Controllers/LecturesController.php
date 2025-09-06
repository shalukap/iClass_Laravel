<?php

namespace App\Http\Controllers;

use App\Models\Lectures;
use App\Models\Schools;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class LecturesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lectures = Lectures::with('school')->latest()->get([
            'lid',
            'lec_name',
            'lec_address',
            'lec_dob',
            'qualification',
            'tp_no',
            'whatsapp_no',
            'lec_email',
            'status',
            'is_employed',
            'school_id',
            'bank_account',
            'bank_name',
            'bank_branch',
            'vehicle_no',
        ]);

        return Inertia::render('lectures/index', [
            'lectures' => $lectures,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $schools = Schools::all(['schoolId', 'name']);

        return Inertia::render('lectures/CreateOrEdit', [
            'schools' => $schools,
            'isEdit' => false
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), Lectures::rules(false));

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $last = Lectures::orderBy('lid', 'desc')->first();
        $number = $last ? (substr($last->lid, 3) + 1) : 1;
        $lid = 'LEC' . sprintf('%06d', $number);

        $lecture = new Lectures();
        $lecture->lid = $lid;
        $lecture->lec_name = $request->lec_name;
        $lecture->lec_address = $request->lec_address;
        $lecture->lec_dob = $request->lec_dob;
        $lecture->qualification = $request->qualification;
        $lecture->tp_no = $request->tp_no;
        $lecture->whatsapp_no = $request->whatsapp_no;
        $lecture->lec_email = $request->lec_email;
        $lecture->status = $request->status ?? true;
        $lecture->is_employed = $request->is_employed ?? false;
        $lecture->school_id = $request->is_employed ? $request->school_id : null;
        $lecture->bank_account = $request->bank_account;
        $lecture->bank_name = $request->bank_name;
        $lecture->bank_branch = $request->bank_branch;
        $lecture->vehicle_no = $request->vehicle_no;
        $lecture->save();

        return redirect()->route('lectures.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lectures $lecture)
    {
        $schools = Schools::all(['schoolId', 'name']);

        return Inertia::render('lectures/CreateOrEdit', [
            'lecture' => $lecture->only([
                'lid',
                'lec_name',
                'lec_address',
                'lec_dob',
                'qualification',
                'tp_no',
                'whatsapp_no',
                'lec_email',
                'status',
                'is_employed',
                'school_id',
                'bank_account',
                'bank_name',
                'bank_branch',
                'vehicle_no',
            ]),
            'schools' => $schools,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Lectures $lecture)
    {
        $validator = Validator::make($request->all(), Lectures::rules(true));

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        if ($lecture) {
            $lecture->lec_name = $request->lec_name;
            $lecture->lec_address = $request->lec_address;
            $lecture->lec_dob = $request->lec_dob;
            $lecture->qualification = $request->qualification;
            $lecture->tp_no = $request->tp_no;
            $lecture->whatsapp_no = $request->whatsapp_no;
            $lecture->lec_email = $request->lec_email;
            $lecture->status = $request->status;
            $lecture->is_employed = $request->is_employed;
            $lecture->school_id = $request->is_employed ? $request->school_id : null;
            $lecture->bank_account = $request->bank_account;
            $lecture->bank_name = $request->bank_name;
            $lecture->bank_branch = $request->bank_branch;
            $lecture->vehicle_no = $request->vehicle_no;
            $lecture->save();
        }

        return redirect()->route('lectures.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lectures $lecture)
    {
        if ($lecture) {
            $lecture->delete();
        }
        return redirect()->route('lectures.index');
    }
}
