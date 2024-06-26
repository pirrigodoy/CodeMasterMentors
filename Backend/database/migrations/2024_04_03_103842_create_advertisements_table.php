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
        Schema::create('advertisements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();
                $table->unsignedBigInteger('programmingLanguage_id');
                $table->foreign('programmingLanguage_id')
                    ->references('id')
                    ->on('programming_languages')
                    ->cascadeOnDelete();
            $table->string('title');
            $table->string('class');
            $table->string('about_me');
            $table->string('description');
            $table->string('price_hour');
            $table->string('disponibility'); //poner un campor de disponibilidad horaria
            $table->string('experience'); //implementar en las tablas de modelo relacional.


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advertisements');
    }
};
