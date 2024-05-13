<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\ProgrammingLanguage;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear roles predefinidos
        Role::factory()->create(['name' => 'Student']);
        Role::factory()->create(['name' => 'Teacher']);
        Role::factory()->create(['name' => 'Admin']);


        // Crear lenguajes de programación
        ProgrammingLanguage::factory()->count(10)->create();
    }
}
