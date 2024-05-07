<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use App\Models\Application;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;


class ApplicationController extends Controller
{
    // Función para mostrar todos las aplicaciones
    public function index()
    {
        $applications = Application::all();
        return ApiResponse::success('Lista de aplicaciones', 200, $applications);
    }

    // Función para guardar una nueva aplicación en la base de datos
    public function store(Request $request)
    {
        try {
            $request->validate([
                'state' => 'required',
                'transmitter' => 'required',
                'receiver' => 'required'
            ]);

            $application = Application::create($request->all());
            return ApiResponse::success('Aplicación creada exitosamente', 201, $application);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }

    // Función para mostrar una aplicación específica
    public function show($id)
    {
        try {
            // Encuentra la aplicación por su ID
            $application = Application::findOrFail($id);

            // Retorna la respuesta exitosa con la aplicación
            return ApiResponse::success('Aplicación obtenida', 200, $application);
        } catch (ModelNotFoundException $e) {
            // Maneja la excepción si no se encuentra la aplicación
            return ApiResponse::error('Aplicación no encontrada', 404);
        }
    }

    // Función para actualizar una aplicación en la base de datos
    public function update(Request $request, Application $application)
    {
        $request->validate([
            'state' => 'required',
            'transmitter' => 'required',
            'receiver' => 'required'
        ]);

        $application->update($request->all());

        return ApiResponse::success('Aplicación actualizada exitosamente', 200, $application);
    }

    // Función para eliminar una aplicación de la base de datos
    public function destroy(Application $application)
    {
        $application->delete();

        return ApiResponse::success('Aplicación borrada', 200, $application);
    }
}
