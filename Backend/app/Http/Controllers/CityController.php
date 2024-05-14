<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\City;
use Illuminate\Validation\ValidationException;
use App\Http\Responses\ApiResponse;

class CityController extends Controller
{
    public function index()
    {
        try {
            $cities = City::all(['name', 'id']); // Obtener solo el campo 'name'
            return ApiResponse::success('Lista de ciudades', 200, $cities);
        } catch (\Exception $e) {
            return ApiResponse::error('Error al obtener la lista de ciudades', 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required',
                // Puedes agregar más reglas de validación según tus necesidades
            ]);
            $city = City::create($request->only('name')); // Crear la ciudad con solo el campo 'name'
            return ApiResponse::success('Ciudad creada exitosamente', 201, $city);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }

    // Métodos show(), update() y destroy() similares al RoleController
    // Pero trabajando solo con el campo 'name' en lugar de todo el modelo City
}
