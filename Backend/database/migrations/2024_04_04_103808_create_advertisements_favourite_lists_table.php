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
        Schema::create('advertisements_favourite_lists', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('advertisement_id');
            $table->foreign('advertisement_id')
                ->references('id')
                ->on('advertisements')
                ->cascadeOnDelete();
            $table->unsignedBigInteger('favouriteList_id');
            $table->foreign('favouriteList_id')
                ->references('id')
                ->on('favourite_lists')
                ->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teacher_favourite_lists');
    }
};
