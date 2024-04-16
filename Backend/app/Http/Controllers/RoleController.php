<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Responses\ApiResponse;

class RoleController extends Controller
{
    public function index()
    {
        try {
            $roles = Role::all(['name','id']); // Obtener solo el campo 'name'
            return ApiResponse::success('Lista de roles', 200, $roles);
        } catch (\Exception $e) {
            return ApiResponse::error('Error al obtener la lista de roles', 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required',
                // Puedes agregar más reglas de validación según tus necesidades
            ]);
            $role = Role::create($request->only('name')); // Crear el rol con solo el campo 'name'
            return ApiResponse::success('Rol creado exitosamente', 201, $role);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }

    // Métodos show(), update() y destroy() similares al ProgrammingLanguageController
    // Pero trabajando solo con el campo 'name' en lugar de todo el modelo Role
}
