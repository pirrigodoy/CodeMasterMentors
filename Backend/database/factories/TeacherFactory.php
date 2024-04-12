<?php

namespace Database\Factories;

use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

class TeacherFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Teacher::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $lenguajes_programacion = [
            'PHP',
            'Java',
            'Python',
            'JavaScript',
            'C++',
            'C#',
            'Ruby',
            'Swift',
            'Kotlin',
            'Go',
            'Rust',
            'TypeScript',
            'Scala',
            'Perl',
            'Haskell',
            'Objective-C',
            'Lua',
            'Dart',
            'R',
            'Assembly'
        ];

        // Convertir el array de lenguajes en un string separado por comas
        $languages = implode(', ', $this->faker->randomElements($lenguajes_programacion, 3));

        return [
            'user_id' => function () {
                return \App\Models\User::factory()->create()->id;
            },
            'price_hour' => $this->faker->randomFloat(2, 10, 50),
            'experience' => $this->faker->sentence,
            'languages' => $languages, // Insertar el string de lenguajes
            'disponibility' => $this->faker->sentence,
        ];
    }
}
