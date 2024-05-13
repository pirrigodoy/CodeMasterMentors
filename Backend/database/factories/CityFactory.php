<?php

namespace Database\Factories;

use App\Models\City;
use Illuminate\Database\Eloquent\Factories\Factory;

class CityFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = City::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $cities = [
            'A Coruña', 'Alicante', 'Albacete', 'Avilés', 'Badajoz', 'Barcelona', 'Bilbao', 'Burgos', 'Cáceres', 'Córdoba',
            'Castellón de la Plana', 'Cartagena', 'Ceuta', 'Ciudad Real', 'Gijón', 'Girona', 'Granada', 'Guadalajara', 'Huesca',
            'Ibiza', 'Jerez de la Frontera', 'León', 'Logroño', 'Lleida', 'Las Palmas de Gran Canaria', 'Lugo', 'Madrid', 'Málaga',
            'Manacor', 'Mérida', 'Murcia', 'Ourense', 'Oviedo', 'Palma de Mallorca', 'Pamplona', 'Salamanca', 'San Cristóbal de La Laguna',
            'San Sebastián', 'Santander', 'Santa Cruz de Tenerife', 'Santiago de Compostela', 'Sevilla', 'Tarragona', 'Teruel', 'Toledo',
            'Torrelavega', 'Tudela', 'Valencia', 'Valladolid', 'Vigo', 'Vitoria-Gasteiz', 'Zaragoza'
        ];


        return [
            'city' => $this->faker->unique()->randomElement($cities),
        ];
    }
}
