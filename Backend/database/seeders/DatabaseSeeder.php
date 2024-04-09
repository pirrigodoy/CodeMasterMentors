<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;

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
    }
}
