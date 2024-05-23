<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use App\Models\State;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class StateController extends Controller
{

    //-----------------------------------------------------------------------------------

    /**
     * Retrieve all states.
     *
     * This function retrieves a list of all states from the database.
     *
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response containing the list of states or an error message.
     */
    public function index()
    {
        try {
            // Retrieve all states from the database
            $states = State::all();

            // Return a successful response with the list of states
            return ApiResponse::success('Lista de estados', 200, $states);
        } catch (\Exception $e) {
            // If an error occurs, return an error response
            return ApiResponse::error('Error al obtener la lista de estados', 500);
        }
    }

    //-----------------------------------------------------------------------------------



    
    //-----------------------------------------------------------------------------------

    /**
     * Store a new state in the database.
     *
     * This function creates and stores a new state in the database based on the provided request data.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing the data for the new state.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating the success or failure of the operation.
     */
    public function store(Request $request)
    {
        try {
            // Validate the request data
            $request->validate([
                'name' => 'required',
            ]);

            // Create and store the new state
            $state = State::create($request->all());

            // Return a successful response with the created state
            return ApiResponse::success('Estado creado exitosamente', 201, $state);
        } catch (ValidationException $e) {
            // If a validation error occurs, return an error response with validation errors
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }

    //-----------------------------------------------------------------------------------




    //-----------------------------------------------------------------------------------

    /**
     * Display the specified state.
     *
     * This function retrieves a specific state from the database based on the provided ID.
     *
     * @param  int  $id
     *     The ID of the state to retrieve.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response containing the retrieved state if found, or an error response if not found.
     */
    public function show($id)
    {
        try {
            // Find the state by its ID
            $state = State::findOrFail($id);

            // Return a successful response with the retrieved state
            return ApiResponse::success('Estado obtenido', 200, $state);
        } catch (ModelNotFoundException $e) {
            // If the state is not found, return an error response
            return ApiResponse::error('Estado no encontrado', 404);
        }
    }

    //-----------------------------------------------------------------------------------





    //-----------------------------------------------------------------------------------

    /**
     * Update a state in the database.
     *
     * This function updates an existing state in the database based on the provided state model instance.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing the updated state data.
     * @param  \App\Models\State  $state
     *     The state model instance to be updated.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating the success or failure of the update operation.
     */
    public function update(Request $request, State $state)
    {
        // Validate the request data
        $request->validate([
            'name' => 'required',
        ]);

        // Update the state with the provided data
        $state->update($request->all());

        // Return a successful response
        return ApiResponse::success('Estado actualizado exitosamente', 200, $state);
    }

    //-----------------------------------------------------------------------------------



    //-----------------------------------------------------------------------------------

    /**
     * Delete a state from the database.
     *
     * This function deletes an existing state from the database based on the provided state model instance.
     *
     * @param  \App\Models\State  $state
     *     The state model instance to be deleted.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating the success or failure of the deletion operation.
     */
    public function destroy(State $state)
    {
        // Delete the state from the database
        $state->delete();

        // Return a successful response
        return ApiResponse::success('Estado borrado', 200, $state);
    }

    //-----------------------------------------------------------------------------------

}
