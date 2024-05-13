<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Array de ciudades
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

        // Crear un registro para cada ciudad
        foreach ($cities as $cityName) {
            City::create(['name' => $cityName]);
        }
    }
}
