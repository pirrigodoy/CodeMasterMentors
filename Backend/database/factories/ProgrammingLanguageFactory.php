<?php

namespace Database\Factories;

use App\Models\ProgrammingLanguage;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProgrammingLanguageFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ProgrammingLanguage::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $languages = ['JavaScript', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Swift', 'TypeScript', 'Go', 'Kotlin'];

        return [
            'name' => $this->faker->unique()->randomElement($languages),
        ];
    }
}
