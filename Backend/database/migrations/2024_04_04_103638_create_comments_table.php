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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('advertisement_id');
            $table->foreign('advertisement_id')
                ->references('id')
                ->on('advertisements')
                ->cascadeOnDelete();
            $table->unsignedBigInteger('transmitter');
            $table->foreign('transmitter')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();
            $table->unsignedBigInteger('receiver');
            $table->foreign('receiver')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();

            $table->integer('rating');
            $table->string('comment');
            $table->date('fecha');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
