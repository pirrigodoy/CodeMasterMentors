<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\City;
use Illuminate\Validation\ValidationException;
use App\Http\Responses\ApiResponse;

class CityController extends Controller
{

    //-----------------------------------------------------------------------------------
    /**
     * Retrieve a list of cities.
     *
     * This function retrieves a list of cities from the database.
     *
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response containing a list of cities.
     */
    public function index()
    {
        try {
            // Retrieve all cities with only the 'name' and 'id' fields
            $cities = City::all(['name', 'id']);

            // Return a success response with the list of cities
            return ApiResponse::success('Lista de ciudades', 200, $cities);
        } catch (\Exception $e) {
            // Handle exceptions and return an error response
            return ApiResponse::error('Error al obtener la lista de ciudades', 500);
        }
    }
    //-----------------------------------------------------------------------------------


    //-----------------------------------------------------------------------------------
    /**
     * Create a new city.
     *
     * This function validates the incoming request data and creates a new city
     * with only the 'name' field.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing city data.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating success or validation errors.
     */
    public function store(Request $request)
    {
        try {
            // Validate the incoming request data
            $request->validate([
                'name' => 'required',
                // You can add more validation rules according to your needs
            ]);

            // Create the city with only the 'name' field
            $city = City::create($request->only('name'));

            // Return a success response indicating the city was created successfully
            return ApiResponse::success('Ciudad creada exitosamente', 201, $city);
        } catch (ValidationException $e) {
            // Handle validation errors and return appropriate response
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }
    //-----------------------------------------------------------------------------------


    //-----------------------------------------------------------------------------------
    /**
     * Display a specific city.
     *
     * This function retrieves and displays a specific city by its ID.
     * It only returns the 'name' field of the city.
     *
     * @param  int  $id
     *     The ID of the city to be displayed.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response containing the details of the city.
     */
    public function show($id)
    {
        // Similar to RoleController's show() method, but working with only the 'name' field
    }
    //-----------------------------------------------------------------------------------


    //-----------------------------------------------------------------------------------
    /**
     * Update a city in the database.
     *
     * This function validates the incoming request data and updates the specified city
     * in the database if validation passes.
     * It only updates the 'name' field of the city.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing updated city data.
     * @param  \App\Models\City  $city
     *     The city instance to be updated.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating success or validation errors.
     */
    public function update(Request $request, City $city)
    {
        // Similar to RoleController's update() method, but working with only the 'name' field
    }
    //-----------------------------------------------------------------------------------


    //-----------------------------------------------------------------------------------
    /**
     * Remove a city from the database.
     *
     * This function deletes the specified city from the database.
     *
     * @param  \App\Models\City  $city
     *     The city instance to be deleted.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating success after deleting the city.
     */
    public function destroy(City $city)
    {
        // Similar to RoleController's destroy() method, but working with only the 'name' field
    }
    //-----------------------------------------------------------------------------------

}
