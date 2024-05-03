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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('remitente');
            $table->foreign('remitente')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();
            $table->unsignedBigInteger('destinatario');
            $table->foreign('destinatario')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();
            $table->text('content');
            $table->timestamp('date');
            $table->unsignedBigInteger('estado');
            $table->foreign('estado')
                ->references('id')
                ->on('states')
                ->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }

};
