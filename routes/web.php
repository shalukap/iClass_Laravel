<?php

use App\Http\Controllers\ClassesController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\LectureEnrollmentController;
use App\Http\Controllers\LecturePaymentController;
use App\Http\Controllers\StudentPaymentController;
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
    Route::resource('student-payments', StudentPaymentController::class);
    Route::resource('classrooms', ClassroomController::class);
    Route::get('/enrollments/create', [EnrollmentController::class, 'createEnrollment'])
        ->name('enrollments.create');

    Route::post('/enrollments', [EnrollmentController::class, 'storeEnrollment'])
        ->name('enrollments.store');

    Route::get('/enrollments/search', [EnrollmentController::class, 'searchStudent'])
        ->name('enrollments.search');

    Route::get('/enrollments', [EnrollmentController::class, 'index']);

    Route::resource('lecture-payments', LecturePaymentController::class)->only(['index', 'create', 'store']);
    Route::get('lecture-payments/classes', [LecturePaymentController::class, 'classes'])->name('lecture-payments.classes');
    Route::get('lecture-payments/search', [LecturePaymentController::class, 'searchLecture'])->name('lecture-payments.search');

    Route::get('/lecture-enrollments', [LectureEnrollmentController::class, 'index']);
    Route::get('/lecture-enrollments/search', [LectureEnrollmentController::class, 'searchLecture']);
    Route::post('/lecture-enrollments', [LectureEnrollmentController::class, 'storeEnrollment']);
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
