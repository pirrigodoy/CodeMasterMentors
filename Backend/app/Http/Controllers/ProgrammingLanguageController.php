<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProgrammingLanguage;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Responses\ApiResponse;

class ProgrammingLanguageController extends Controller
{
    //-----------------------------------------------------------------------------------

    /**
     * Retrieve a list of programming languages.
     *
     * This function retrieves all programming languages available in the system.
     *
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response containing the list of programming languages.
     */
    public function index()
    {
        try {
            // Retrieve all programming languages
            $languages = ProgrammingLanguage::all();

            // Return a successful response with the list of programming languages
            return ApiResponse::success('Lista de lenguajes de programación', 200, $languages);
        } catch (\Exception $e) {
            // Handle any exceptions and return an error response
            return ApiResponse::error('Error al obtener la lista de lenguajes de programación', 500);
        }
    }

    //-----------------------------------------------------------------------------------



    //-----------------------------------------------------------------------------------

    /**
     * Store a new programming language.
     *
     * This function stores a new programming language in the system based on the provided request data.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing the data of the new programming language.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating the success or failure of the operation.
     */
    public function store(Request $request)
    {
        try {
            // Validate the request data
            $request->validate([
                'languageName' => 'required',
                // You can add more validation rules as needed
            ]);

            // Create a new programming language
            $language = ProgrammingLanguage::create($request->all());

            // Return a successful response with the newly created programming language
            return ApiResponse::success('Lenguaje de programación creado exitosamente', 201, $language);
        } catch (ValidationException $e) {
            // Handle validation errors and return an error response
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }

    //-----------------------------------------------------------------------------------



    //-----------------------------------------------------------------------------------

    /**
     * Retrieve a specific programming language.
     *
     * This function retrieves a specific programming language from the system based on its ID.
     *
     * @param  int  $id
     *     The ID of the programming language to retrieve.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response containing the requested programming language if found, or an error response if not found.
     */
    public function show($id)
    {
        try {
            // Find the programming language by its ID
            $language = ProgrammingLanguage::findOrFail($id);

            // Return a successful response with the requested programming language
            return ApiResponse::success('Lenguaje de programación obtenido', 200, $language);
        } catch (ModelNotFoundException $e) {
            // Handle the case where the programming language is not found and return an error response
            return ApiResponse::error('Lenguaje de programación no encontrado', 404);
        }
    }

    //-----------------------------------------------------------------------------------



    //-----------------------------------------------------------------------------------

    /**
     * Update an existing programming language.
     *
     * This function updates an existing programming language in the system based on the provided ID and request data.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing the updated data of the programming language.
     * @param  int  $id
     *     The ID of the programming language to update.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating the success or failure of the operation.
     */
    public function update(Request $request, $id)
    {
        try {
            // Find the programming language by its ID
            $language = ProgrammingLanguage::findOrFail($id);

            // Validate the request data
            $request->validate([
                'languageName' => 'required',
                // You can add more validation rules as needed
            ]);

            // Update the programming language with the provided data
            $language->update($request->all());

            // Return a successful response with the updated programming language
            return ApiResponse::success('Lenguaje de programación actualizado exitosamente', 200, $language);
        } catch (ValidationException $e) {
            // Handle validation errors and return an error response
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        } catch (ModelNotFoundException $e) {
            // Handle the case where the programming language is not found and return an error response
            return ApiResponse::error('Lenguaje de programación no encontrado', 404);
        }
    }

    //-----------------------------------------------------------------------------------



    //-----------------------------------------------------------------------------------

    /**
     * Delete a programming language.
     *
     * This function deletes a programming language from the system based on the provided ID.
     *
     * @param  int  $id
     *     The ID of the programming language to delete.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating the success or failure of the operation.
     */
    public function destroy($id)
    {
        try {
            // Find the programming language by its ID
            $language = ProgrammingLanguage::findOrFail($id);

            // Delete the programming language
            $language->delete();

            // Return a successful response
            return ApiResponse::success('Lenguaje de programación eliminado exitosamente', 200);
        } catch (ModelNotFoundException $e) {
            // Handle the case where the programming language is not found and return an error response
            return ApiResponse::error('Lenguaje de programación no encontrado', 404);
        }
    }

    //-----------------------------------------------------------------------------------

}
