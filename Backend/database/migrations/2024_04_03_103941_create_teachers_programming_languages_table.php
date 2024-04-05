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
        Schema::create('teachers_programming_languages', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('teacher_id');
            $table->foreign('teacher_id')
                ->references('id')
                ->on('teachers')
                ->cascadeOnDelete();

            $table->unsignedBigInteger('programingLanguage_id');
            $table->foreign('programingLanguage_id')
                ->references('id')
                ->on('programming_languages')
                ->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachers_programming_languages');
    }
};
