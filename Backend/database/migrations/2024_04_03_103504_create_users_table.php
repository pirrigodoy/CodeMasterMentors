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
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            $table->string('username');
            $table->string('password');
            $table->unsignedBigInteger('role_id');
            $table->foreign('role_id')
                ->references('id')
                ->on('roles')
                ->cascadeOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('born_date')->nullable(); // implementar en las tablas.
            $table->unsignedBigInteger('city');
            $table->foreign('city')
                ->references('id')
                ->on('cities')
                ->cascadeOnDelete();
            $table->binary('img')->nullable(); // Cambio de 'string' a 'binary'

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
