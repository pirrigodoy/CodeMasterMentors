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
            $table->string('area')->nullable(); //code  postal para la ubicacion o poblacion, mejorar el campo que lo ubique mejor
            $table->string('img')->nullable();


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
