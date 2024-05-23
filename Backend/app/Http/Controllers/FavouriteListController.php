<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use App\Models\FavouriteList;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class FavouriteListController extends Controller
{

    //-----------------------------------------------------------------------------------

    /**
     * Retrieve a list of favorite lists.
     *
     * This function retrieves a list of all favorite lists from the database.
     *
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response containing a list of favorite lists.
     */
    public function index()
    {
        // Retrieve all favorite lists from the database
        $favouriteLists = FavouriteList::all();

        // Return a success response with the list of favorite lists
        return ApiResponse::success('Lista de listas de favoritos', 200, $favouriteLists);
    }

    //-----------------------------------------------------------------------------------


    //-----------------------------------------------------------------------------------

    /**
     * Store a new favorite list.
     *
     * This function validates the incoming request data and creates a new favorite list if validation passes.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing favorite list data.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating success or validation errors.
     */
    public function store(Request $request)
    {
        try {
            // Validate the incoming request data
            $request->validate([
                'name' => 'required',
                'user_id' => 'required',
            ]);

            // Create a new favorite list with the provided data
            $favouriteList = FavouriteList::create($request->all());

            // Return a success response indicating the favorite list was created successfully
            return ApiResponse::success('Lista de favoritos creada exitosamente', 201, $favouriteList);
        } catch (ValidationException $e) {
            // Handle validation errors and return appropriate response
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }

    //-----------------------------------------------------------------------------------


    //-----------------------------------------------------------------------------------

    /**
     * Retrieve a specific favorite list.
     *
     * This function retrieves and displays a specific favorite list by its ID.
     *
     * @param  int  $id
     *     The ID of the favorite list to be displayed.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response containing the details of the favorite list.
     */
    public function show($id)
    {
        try {
            // Retrieve the favorite list by its ID
            $favouriteList = FavouriteList::findOrFail($id);

            // Return a success response with the details of the favorite list
            return ApiResponse::success('Lista de favoritos obtenida', 200, $favouriteList);
        } catch (ModelNotFoundException $e) {
            // Handle the exception if the favorite list is not found
            return ApiResponse::error('Lista de favoritos no encontrada', 404);
        }
    }

    //-----------------------------------------------------------------------------------



    //-----------------------------------------------------------------------------------

    /**
     * Update a favorite list.
     *
     * This function updates a specific favorite list with the provided data.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing updated favorite list data.
     * @param  \App\Models\FavouriteList  $favouriteList
     *     The favorite list to be updated.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating success or validation errors.
     */
    public function update(Request $request, FavouriteList $favouriteList)
    {
        // Validate the incoming request data
        $request->validate([
            'name' => 'required',
            'user_id' => 'required',
        ]);

        // Update the favorite list with the provided data
        $favouriteList->update($request->all());

        // Return a success response indicating the favorite list was updated successfully
        return ApiResponse::success('Lista de favoritos actualizada exitosamente', 200, $favouriteList);
    }

    //-----------------------------------------------------------------------------------


    //-----------------------------------------------------------------------------------

    /**
     * Delete a favorite list.
     *
     * This function deletes a specific favorite list from the database.
     *
     * @param  \App\Models\FavouriteList  $favouriteList
     *     The favorite list to be deleted.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating success or failure.
     */
    public function destroy(FavouriteList $favouriteList)
    {
        // Delete the favorite list
        $favouriteList->delete();

        // Return a success response indicating the favorite list was deleted successfully
        return ApiResponse::success('Lista de favoritos borrada', 200, $favouriteList);
    }

    //-----------------------------------------------------------------------------------

}
