<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id('sid'); // student ID (Primary Key)
            $table->string('sname'); // student name
            $table->enum('gender', ['male', 'female']);
            $table->string('address');
            $table->date('dob');

            // Assuming 'school' is a foreign key to a schools table
            $table->unsignedBigInteger('school')->nullable();
            $table->foreign('school')->references('id')->on('schools')->onDelete('set null');

            $table->string('parentName');
            $table->string('tpNo');
            $table->string('watsapp');
            $table->boolean('isActive')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
