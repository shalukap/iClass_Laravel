<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lectures', function (Blueprint $table) {
            $table->string('lid')->primary();
            $table->string('lec_name');
            $table->string('lec_address');
            $table->date('lec_dob');
            $table->string('qualification');
            $table->string('tp_no', 20);
            $table->string('whatsapp_no', 20);
            $table->string('lec_email');
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lectures');
    }
};
