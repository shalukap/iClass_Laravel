<?php

namespace App\Http\Controllers;

use App\Models\Lectures;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LecturesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lectures = Lectures::latest()->get([
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
        return Inertia::render('lectures/CreateOrEdit');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $last = Lectures::orderBy('lid', 'desc')->first();
        $number = $last ? (substr($last->lid, 3) + 1) : 1;
        $lid = 'LEC' . sprintf('%06d', $number);

        $request->validate([
            'lec_name' => 'required|string|max:255',
            'lec_address' => 'required|string|max:255',
            'lec_dob' => 'required|date',
            'qualification' => 'required|string|max:255',
            'tp_no' => 'required|string|max:20',
            'whatsapp_no' => 'required|string|max:20',
            'lec_email' => 'required|email|max:255',
            'status' => 'boolean',
            'bank_account' => 'nullable|string|max:20',
            'bank_name' => 'nullable|string|max:50',
            'bank_branch' => 'nullable|string|max:50',
            'vehicle_no' => 'nullable|string|max:20',
        ]);

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
        $lecture->bank_account = $request->bank_account;
        $lecture->bank_name = $request->bank_name;
        $lecture->bank_branch = $request->bank_branch;
        $lecture->vehicle_no = $request->vehicle_no;
        $lecture->save();

        return redirect()->route('lectures.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Lectures $lecture)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lectures $lecture)
    {
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
                'bank_account',
                'bank_name',
                'bank_branch',
                'vehicle_no',
            ]),
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Lectures $lecture)
    {
        $request->validate([
            'lec_name' => 'required|string|max:255',
            'lec_address' => 'required|string|max:255',
            'lec_dob' => 'required|date',
            'qualification' => 'required|string|max:255',
            'tp_no' => 'required|string|max:20',
            'whatsapp_no' => 'required|string|max:20',
            'lec_email' => 'required|email|max:255',
            'status' => 'boolean',
            'bank_account' => 'nullable|string|max:20',
            'bank_name' => 'nullable|string|max:50',
            'bank_branch' => 'nullable|string|max:50',
            'vehicle_no' => 'nullable|string|max:20',
        ]);

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
