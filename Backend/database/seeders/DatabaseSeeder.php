<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Student;
use App\Models\Teacher;
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

        // Crear usuarios junto con un rol aleatorio
        User::factory(10)->create();
        ProgrammingLanguage::factory()->count(10)->create();
        Student::factory(10)->create();

        Teacher::factory(5)->create();
    }
}
