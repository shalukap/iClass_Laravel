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
        return Inertia::render('schools/index');
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Schools $schools)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Schools $schools)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Schools $schools)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Schools $schools)
    {
        //
    }
}
