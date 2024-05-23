<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Responses\ApiResponse;

class UserController extends Controller
{
    //-----------------------------------------------------------------------------------

    /**
     * Retrieve a list of all users.
     *
     * This function retrieves a list of all users from the database and returns it as a JSON response.
     *
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response containing the list of users and a success message.
     */
    public function index()
    {
        // Retrieve all users from the database
        $users = User::all();

        // Return a successful response with the list of users
        return ApiResponse::success('Lista de usuarios', 200, $users);
    }

    //-----------------------------------------------------------------------------------



    
    //-----------------------------------------------------------------------------------

    /**
     * Store a newly created user in the database.
     *
     * This function validates the request data, creates a new user with the provided data, and stores it in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing the user data.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating whether the user was successfully created or not.
     */
    public function store(Request $request)
    {
        try {
            // Validate the request data
            $request->validate([
                'role_id' => 'required',
                'username' => 'required|unique:users',
                'password' => 'required|min:8',
                'name' => 'required|string',
                'email' => 'required|email|unique:users',
                'born_date' => 'required|string',
                'city_id' => 'required',
                'img' => 'required|string'
            ]);

            // Create a new user with the provided data
            $user = User::create($request->all());

            // Return a successful response indicating the user was created
            return ApiResponse::success('Usuario creado exitosamente', 201, $user);
        } catch (ValidationException $e) {
            // If validation fails, return an error response with validation errors
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }

    //-----------------------------------------------------------------------------------




    //-----------------------------------------------------------------------------------
    /**
     * Display the specified user.
     *
     * This function retrieves a user from the database based on the provided ID.
     *
     * @param  int  $id
     *     The ID of the user to retrieve.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response containing the retrieved user or an error message if the user is not found.
     */
    public function show($id)
    {
        try {
            // Attempt to find the user by ID
            $user = User::findOrFail($id);

            // Return a successful response with the retrieved user
            return ApiResponse::success('Usuario obtenido', 200, $user);
        } catch (ModelNotFoundException $e) {
            // Handle the case where the user is not found and return an error response
            return ApiResponse::error('Usuario no encontrado', 404);
        }
    }

    //-----------------------------------------------------------------------------------




    //-----------------------------------------------------------------------------------

    /**
     * Update the specified user.
     *
     * This function updates the details of a user in the database based on the provided ID.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing the updated user data.
     * @param  int  $id
     *     The ID of the user to update.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating success or failure of the update operation.
     */
    public function update(Request $request, $id)
    {
        try {
            // Attempt to find the user by ID
            $user = User::findOrFail($id);

            // Validate the request data
            $request->validate([
                'username' => 'required|unique:users,username,' . $id,
                'name' => 'required|string',
                'email' => 'required|email|unique:users,email,' . $id,
                'born_date' => 'required|string',
                'city_id' => 'required',
                // 'img' =>'required|string'
            ]);

            // Update the user details
            $user->update($request->all());

            // Return a successful response with the updated user
            return ApiResponse::success('Usuario actualizado exitosamente', 200, $user);
        } catch (ValidationException $e) {
            // Handle validation errors and return an error response
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        } catch (ModelNotFoundException $e) {
            // Handle the case where the user is not found and return an error response
            return ApiResponse::error('Usuario no encontrado', 404);
        }
    }

    //-----------------------------------------------------------------------------------



    //-----------------------------------------------------------------------------------

    /**
     * Delete the specified user.
     *
     * This function deletes a user from the database based on the provided ID.
     *
     * @param  int  $id
     *     The ID of the user to delete.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating success or failure of the delete operation.
     */
    public function destroy($id)
    {
        try {
            // Attempt to find the user by ID
            $user = User::findOrFail($id);

            // Delete the user
            $user->delete();

            // Return a successful response
            return ApiResponse::success('Usuario eliminado exitosamente', 200);
        } catch (ModelNotFoundException $e) {
            // Handle the case where the user is not found and return an error response
            return ApiResponse::error('Usuario no encontrado', 404);
        }
    }

    //-----------------------------------------------------------------------------------




    //-----------------------------------------------------------------------------------

    /**
     * Upload an image file.
     *
     * This function handles the upload of an image file. It validates the request to ensure that the image file is present. It generates a unique name for the image file, moves the image to the 'public/images' folder, and returns the URL of the uploaded image for access by the client application.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request object containing the uploaded image file.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response containing the URL of the uploaded image.
     */
    public function uploadImage(Request $request)
    {
        // Validate the request
        $request->validate([
            'image' => 'required|image', // Adjust validation rules as needed
        ]);

        // Get the image file
        $image = $request->file('image');

        // Generate a unique name for the image
        $imageName = time() . '.' . $image->getClientOriginalExtension();

        // Move the image to the public/images folder
        $image->move(public_path('images'), $imageName);

        // Return the URL of the uploaded image for client access
        return response()->json(['url' => asset('images/' . $imageName)]);
    }

    //-----------------------------------------------------------------------------------



}
