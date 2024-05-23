<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Responses\ApiResponse;
use App\Models\AdvertisementFavouriteList;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class AdvertisementFavouriteListController extends Controller
{

    //------------------------------------------------------------------------------------------------
    /**
     * Display all elements of the relationship between advertisements and favorite lists.
     *
     * This function retrieves all elements of the relationship between advertisements and favorite lists.
     *
     * @return \App\Http\Responses\ApiResponse
     *     Returns an API response containing all elements of the relationship between advertisements and favorite lists.
     */
    public function index()
    {
        // Retrieve all elements of the relationship between advertisements and favorite lists
        $advertisementFavouriteLists = AdvertisementFavouriteList::all();

        // Return a success response with all elements of the relationship
        return ApiResponse::success('Lista de elementos de la relación entre anuncios y listas de favoritos', 200, $advertisementFavouriteLists);
    }
    //------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------

    /**
     * Add an advertisement to a favorite list.
     *
     * This function validates the incoming request data and creates a new element in the relationship
     * between advertisements and favorite lists by adding an advertisement to a favorite list.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing data to create the relationship.
     * @return \App\Http\Responses\ApiResponse
     *     Returns an API response indicating success or validation errors.
     */
    public function store(Request $request)
    {
        try {
            // Validate the incoming request data
            $request->validate([
                'advertisement_id' => 'required',
                'favouriteList_id' => 'required',
            ]);

            // Create a new element in the relationship
            $advertisementFavouriteList = AdvertisementFavouriteList::create($request->all());

            // Return a success response indicating the relationship was created successfully
            return ApiResponse::success('Elemento de relación creado exitosamente', 201, $advertisementFavouriteList);
        } catch (ValidationException $e) {
            // Handle validation errors and return appropriate response
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }
    //------------------------------------------------------------------------------------------------



    //------------------------------------------------------------------------------------------------
    /**
     * Display a specific element of the relationship between advertisements and favorite lists.
     *
     * This function retrieves and displays a specific element of the relationship
     * between advertisements and favorite lists by its ID.
     *
     * @param  int  $id
     *     The ID of the element in the relationship.
     * @return \App\Http\Responses\ApiResponse
     *     Returns an API response containing the details of the element in the relationship.
     */
    public function show($id)
    {
        try {
            // Find the element in the relationship by its ID
            $advertisementFavouriteList = AdvertisementFavouriteList::findOrFail($id);

            // Return a success response with the details of the element in the relationship
            return ApiResponse::success('Elemento de relación obtenido', 200, $advertisementFavouriteList);
        } catch (ModelNotFoundException $e) {
            // Handle the exception if the element in the relationship is not found
            return ApiResponse::error('Elemento de relación no encontrado', 404);
        }
    }
    //------------------------------------------------------------------------------------------------


    //------------------------------------------------------------------------------------------------
    /**
     * Remove an element from the relationship between advertisements and favorite lists.
     *
     * This function deletes the specified element from the relationship
     * between advertisements and favorite lists.
     *
     * @param  \App\Models\AdvertisementFavouriteList  $advertisementFavouriteList
     *     The element in the relationship to be deleted.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating the element was deleted successfully.
     */
    public function destroy(AdvertisementFavouriteList $advertisementFavouriteList)
    {
        // Delete the element from the relationship
        $advertisementFavouriteList->delete();

        // Return a JSON response indicating the element was deleted successfully
        return response()->json(['message' => 'El elemento de relación ha sido eliminado correctamente.'], 200);
    }

    //------------------------------------------------------------------------------------------------

}
