<?php

namespace Database\Factories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Student::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'course' => $this->faker->sentence, // Genera un curso aleatorio
            'user_id' => function () {
                return \App\Models\User::factory()->create()->id;
            },
        ];
    }
}
