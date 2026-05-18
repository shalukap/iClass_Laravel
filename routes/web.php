<?php

use Illuminate\Http\Request;

use App\Http\Controllers\ClassesController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\LectureEnrollmentController;
use App\Http\Controllers\LecturePaymentController;
use App\Http\Controllers\StudentPaymentController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentsController;
use App\Http\Controllers\SchoolsController;
use App\Http\Controllers\LecturesController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return view('app');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/api/user', function (Request $request) {
        return $request->user();
    });
    Route::get('dashboard', function () {
        return view('app');
    })->name('dashboard');
    
    // API Routes for SPA data
    Route::prefix('api')->group(function () {
        Route::get('user', function (Request $request) {
            return $request->user();
        });
        
        Route::get('students', [StudentsController::class, 'index']);
        Route::post('students', [StudentsController::class, 'store']);
        Route::get('students/{student}/edit', [StudentsController::class, 'edit']);
        Route::patch('students/{student}', [StudentsController::class, 'update']);
        Route::delete('students/{student}', [StudentsController::class, 'destroy']);
        
        Route::get('schools', [SchoolsController::class, 'index']);
        Route::post('schools', [SchoolsController::class, 'store']);
        Route::get('schools/{school}/edit', [SchoolsController::class, 'edit']);
        Route::patch('schools/{school}', [SchoolsController::class, 'update']);
        Route::delete('schools/{school}', [SchoolsController::class, 'destroy']);

        Route::get('lectures', [LecturesController::class, 'index']);
        Route::post('lectures', [LecturesController::class, 'store']);
        Route::get('lectures/{lecture}/edit', [LecturesController::class, 'edit']);
        Route::patch('lectures/{lecture}', [LecturesController::class, 'update']);
        Route::delete('lectures/{lecture}', [LecturesController::class, 'destroy']);

        Route::get('classes', [ClassesController::class, 'index']);
        Route::post('classes', [ClassesController::class, 'store']);
        Route::get('classes/{class}/edit', [ClassesController::class, 'edit']);
        Route::patch('classes/{class}', [ClassesController::class, 'update']);
        Route::delete('classes/{class}', [ClassesController::class, 'destroy']);

        Route::get('classrooms', [ClassroomController::class, 'index']);
        Route::post('classrooms', [ClassroomController::class, 'store']);
        Route::get('classrooms/{classroom}/edit', [ClassroomController::class, 'edit']);
        Route::patch('classrooms/{classroom}', [ClassroomController::class, 'update']);
        Route::delete('classrooms/{classroom}', [ClassroomController::class, 'destroy']);

        Route::get('student-payments', [StudentPaymentController::class, 'index']);
        Route::get('student-payments/create', [StudentPaymentController::class, 'create']);
        Route::post('student-payments', [StudentPaymentController::class, 'store']);
        Route::post('student-payments/bulk', [StudentPaymentController::class, 'bulkStore']);
        Route::delete('student-payments/{pid}', [StudentPaymentController::class, 'destroy']);

        Route::get('lecture-payments', [LecturePaymentController::class, 'index']);
        Route::get('lecture-payments/create', [LecturePaymentController::class, 'create']);
        Route::post('lecture-payments', [LecturePaymentController::class, 'store']);
        Route::get('lecture-payments/search', [LecturePaymentController::class, 'searchLecture']);
        Route::get('lecture-payments/classes', [LecturePaymentController::class, 'classes']);

        Route::get('lecture-enrollments', [LectureEnrollmentController::class, 'index']);
        Route::get('lecture-enrollments/search', [LectureEnrollmentController::class, 'searchLecture']);
        Route::post('lecture-enrollments', [LectureEnrollmentController::class, 'storeEnrollment']);
        Route::get('lecture-enrollments/{lid}', [LectureEnrollmentController::class, 'getLectureById']);

        Route::get('enrollments', [EnrollmentController::class, 'index']);
        Route::get('enrollments/search', [EnrollmentController::class, 'searchStudent']);
        Route::post('enrollments', [EnrollmentController::class, 'storeEnrollment']);

        Route::get('reports/collection', [ReportController::class, 'collectionReport']);
        Route::get('reports/collection/pdf', [ReportController::class, 'exportCollectionPdf']);

        Route::get('users', [UserController::class, 'index']);
        Route::post('users', [UserController::class, 'store']);
        Route::get('users/{user}/edit', [UserController::class, 'edit']);
        Route::put('users/{user}', [UserController::class, 'update']);
        Route::delete('users/{user}', [UserController::class, 'destroy']);
    });

    // Frontend Routes (all return the same app view)
    Route::get('users/{any?}', function () { return view('app'); })->where('any', '.*');
    Route::get('students/{any?}', function () { return view('app'); })->where('any', '.*');
    Route::get('schools/{any?}', function () { return view('app'); })->where('any', '.*');
    Route::get('lectures/{any?}', function () { return view('app'); })->where('any', '.*');
    Route::get('classes/{any?}', function () { return view('app'); })->where('any', '.*');
    Route::get('student-payments/{any?}', function () { return view('app'); })->where('any', '.*');
    Route::get('classrooms/{any?}', function () { return view('app'); })->where('any', '.*');
    Route::get('enrollments/{any?}', function () { return view('app'); })->where('any', '.*');
    Route::get('lecture-payments/{any?}', function () { return view('app'); })->where('any', '.*');
    Route::get('lecture-enrollments/{any?}', function () { return view('app'); })->where('any', '.*');
    Route::get('reports/{any?}', function () { return view('app'); })->where('any', '.*');
});

// Fallback for SPA
Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api|storage).*');


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
