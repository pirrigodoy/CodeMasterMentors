<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Responses\ApiResponse;

class RoleController extends Controller
{
    //-----------------------------------------------------------------------------------

    /**
     * Retrieve all roles.
     *
     * This function retrieves a list of all roles from the system.
     *
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response containing a list of roles with their names and IDs.
     */
    public function index()
    {
        try {
            // Retrieve all roles with only the 'name' and 'id' fields
            $roles = Role::all(['name', 'id']);

            // Return a successful response with the list of roles
            return ApiResponse::success('Lista de roles', 200, $roles);
        } catch (\Exception $e) {
            // Handle any exceptions and return an error response
            return ApiResponse::error('Error al obtener la lista de roles', 500);
        }
    }

    //-----------------------------------------------------------------------------------


    
    //-----------------------------------------------------------------------------------
    /**
     * Store a new role.
     *
     * This function creates a new role in the system based on the provided name.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing the role details.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating the success or failure of the operation.
     */
    public function store(Request $request)
    {
        try {
            // Validate the request data
            $request->validate([
                'name' => 'required',
                // Additional validation rules can be added here as needed
            ]);

            // Create a new role with the provided name
            $role = Role::create($request->only('name'));

            // Return a successful response indicating the role creation
            return ApiResponse::success('Rol creado exitosamente', 201, $role);
        } catch (ValidationException $e) {
            // If validation fails, return an error response with validation errors
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }

    //-----------------------------------------------------------------------------------

}
