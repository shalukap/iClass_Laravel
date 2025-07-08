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
       return Inertia::render('lectures/index');
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Lectures $lectures)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lectures $lectures)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Lectures $lectures)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lectures $lectures)
    {
        //
    }
}
