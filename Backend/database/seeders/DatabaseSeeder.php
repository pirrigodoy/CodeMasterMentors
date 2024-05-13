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

        // Ciudades sin comunidad autónoma
        $cities = [
            'Sevilla', 'Málaga', 'Granada', 'Córdoba',
            'Zaragoza', 'Huesca', 'Teruel',
            'Oviedo', 'Gijón', 'Avilés',
            'Palma de Mallorca', 'Ibiza', 'Manacor',
            'Las Palmas de Gran Canaria', 'Santa Cruz de Tenerife', 'San Cristóbal de La Laguna',
            'Santander', 'Torrelavega',
            'Toledo', 'Albacete', 'Ciudad Real', 'Guadalajara',
            'Valladolid', 'León', 'Salamanca', 'Burgos',
            'Barcelona', 'Lleida', 'Girona', 'Tarragona',
            'Valencia', 'Alicante', 'Castellón de la Plana',
            'Mérida', 'Badajoz', 'Cáceres',
            'Santiago de Compostela', 'Vigo', 'A Coruña', 'Ourense',
            'Logroño',
            'Madrid',
            'Murcia', 'Cartagena',
            'Pamplona', 'Tudela',
            'Bilbao', 'Vitoria-Gasteiz', 'San Sebastián',
            'Ceuta',
            'Melilla'
        ];

        foreach ($cities as $city) {
            City::create(['name' => $city]);
        }


        // Crear usuarios junto con un rol aleatorio
        User::factory(10)->create();
        ProgrammingLanguage::factory()->count(10)->create();
    }
}
