<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;




class CityController extends Controller
{
    //
    public function index()
    {
        try {
            $cities = City::all(['name','id']); // Obtener solo el campo 'name'
            return ApiResponse::success('Lista de cities', 200, $cities);
        } catch (\Exception $e) {
            return ApiResponse::error('Error al obtener la lista de cities', 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required',
                // Puedes agregar más reglas de validación según tus necesidades
            ]);
            $city= City::create($request->only('name')); // Crear el city con solo el campo 'name'
            return ApiResponse::success('City creado exitosamente', 201, $city);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }

}
