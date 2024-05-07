<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use App\Models\State;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class StateController extends Controller
{
    // Función para mostrar todos los estados
    public function index()
    {
        $states = State::all();
        return ApiResponse::success('Lista de estados', 200, $states);
    }

    // Función para guardar un nuevo estado en la base de datos
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required',
            ]);

            $state = State::create($request->all());
            return ApiResponse::success('Estado creado exitosamente', 201, $state);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }

    // Función para mostrar un estado específico
    public function show($id)
    {
        try {
            // Encuentra el estado por su ID
            $state = State::findOrFail($id);
            return ApiResponse::success('Estado obtenido', 200, $state);
        } catch (ModelNotFoundException $e) {
            // Maneja la excepción si no se encuentra el estado
            return ApiResponse::error('Estado no encontrado', 404);
        }
    }

    // Función para actualizar un estado en la base de datos
    public function update(Request $request, State $state)
    {
        $request->validate([
            'name' => 'required',
        ]);

        $state->update($request->all());

        return ApiResponse::success('Estado actualizado exitosamente', 200, $state);
    }

    // Función para eliminar un estado de la base de datos
    public function destroy(State $state)
    {
        $state->delete();

        return ApiResponse::success('Estado borrado', 200, $state);
    }
}
