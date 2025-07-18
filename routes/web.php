<?php

use App\Http\Controllers\ClassesController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\StudentsController;
use App\Http\Controllers\SchoolsController;
use App\Http\Controllers\LecturesController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('students', StudentsController::class);
    Route::resource('schools', SchoolsController::class);
    Route::resource('lectures', LecturesController::class);
    Route::resource('classes', ClassesController::class);

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
