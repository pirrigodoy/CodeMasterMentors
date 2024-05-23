<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use App\Models\Advertisement;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;



class AdvertisementController extends Controller
{

    //------------------------------------------------------------------------------------------------
    /**
     * Display a listing of advertisements.
     *
     * @return \App\Http\Responses\ApiResponse
     */
    public function index()
    {
        $advertisements = Advertisement::all();
        return ApiResponse::success('Lista de anuncios', 200, $advertisements);
    }
    //------------------------------------------------------------------------------------------------



    //------------------------------------------------------------------------------------------------
    /**
     * Store a newly created advertisement in the database.
     *
     * This function validates the incoming request data and creates a new advertisement
     * in the database if validation passes.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing advertisement data.
     * @return \App\Http\Responses\ApiResponse
     *     Returns an API response indicating success or validation errors.
     */
    public function store(Request $request)
    {
        try {
            // Validate the incoming request data
            $request->validate([
                'user_id' => 'required',
                // 'programmingLanguage_id' => 'required',
                'title' => 'required',
                'class' => 'required',
                'about_me' => 'required',
                'description' => 'required',
                'price_hour' => 'required',
                'disponibility' => 'required',
                'experience' => 'required'
            ]);

            // Create a new advertisement with the validated data
            $advertisement = Advertisement::create($request->all());

            // Return a success response with the newly created advertisement
            return ApiResponse::success('Anuncio creado exitosamente', 201, $advertisement);
        } catch (ValidationException $e) {
            // Handle validation errors and return appropriate response
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }

    //------------------------------------------------------------------------------------------------



    //------------------------------------------------------------------------------------------------
    /**
     * Display the specified advertisement.
     *
     * This function retrieves and displays a specific advertisement by its ID.
     * It also fetches the name of the user associated with the advertisement
     * and includes it in the response.
     *
     * @param  int  $id
     *     The ID of the advertisement to be displayed.
     * @return \App\Http\Responses\ApiResponse
     *     Returns an API response containing the advertisement details, including the user's name.
     */
    public function show($id)
    {
        try {
            // Find the advertisement by its ID
            $advertisement = Advertisement::findOrFail($id);

            // Get the name of the user associated with the advertisement
            $userName = DB::table('users')->where('id', $advertisement->user_id)->value('name');

            // Add the user's name to the advertisement response
            $advertisement->user_name = $userName;

            // Return a successful response with the advertisement details, including the user's name
            return ApiResponse::success('Anuncio obtenido', 200, $advertisement);
        } catch (ModelNotFoundException $e) {
            // Handle the exception if the advertisement is not found
            return ApiResponse::error('Anuncio no encontrado', 404);
        }
    }
    //------------------------------------------------------------------------------------------------


    //------------------------------------------------------------------------------------------------
    /**
     * Show the form for editing the specified advertisement.
     *
     * This function displays a form for editing a specific advertisement.
     *
     * @param  \App\Models\Advertisement  $advertisement
     *     The advertisement instance to be edited.
     * @return \Illuminate\Contracts\View\View
     *     Returns a view for editing the advertisement.
     */    public function edit(Advertisement $advertisement)
    {
        return view('advertisements.edit', compact('advertisement'));
    }
    //------------------------------------------------------------------------------------------------



    //------------------------------------------------------------------------------------------------
    /**
     * Update the specified advertisement in the database.
     *
     * This function validates the incoming request data and updates the specified advertisement
     * in the database if validation passes.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing updated advertisement data.
     * @param  \App\Models\Advertisement  $advertisement
     *     The advertisement instance to be updated.
     * @return \App\Http\Responses\ApiResponse
     *     Returns an API response indicating success or validation errors.
     */
    public function update(Request $request, Advertisement $advertisement)
    {
        $request->validate([
            // 'user_id' => 'required',
            'programmingLanguage_id' => 'required',
            'title' => 'required',
            'class' => 'required',
            'about_me' => 'required',
            'description' => 'required',
            'price_hour' => 'required',
            'disponibility' => 'required',
            'experience' => 'required'
        ]);

        // Update the advertisement with the validated data
        $advertisement->update($request->all());

        // Return a success response indicating the advertisement was updated successfully
        return ApiResponse::success('Anuncio actualizado exitosamente', 200, $advertisement);
    }
    //------------------------------------------------------------------------------------------------


    //------------------------------------------------------------------------------------------------
    /**
     * Remove the specified advertisement from the database.
     *
     * This function deletes the specified advertisement from the database.
     *
     * @param  \App\Models\Advertisement  $advertisement
     *     The advertisement instance to be deleted.
     * @return \App\Http\Responses\ApiResponse
     *     Returns an API response indicating success after deleting the advertisement.
     */
    public function destroy(Advertisement $advertisement)
    {
        // Delete the advertisement from the database
        $advertisement->delete();

        // Return a success response indicating the advertisement was deleted successfully
        return ApiResponse::success('Anuncio borrado', 200, $advertisement);
    }
    //------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------

    /**
     * Get user ID by Advertisement ID.
     *
     * This function retrieves the user ID associated with the specified advertisement ID.
     *
     * @param  int  $advertisementId
     *     The ID of the advertisement.
     * @return \App\Http\Responses\ApiResponse
     *     Returns an API response containing the user ID associated with the advertisement ID.
     */
    public function getUserIdByAdvertisementId($advertisementId)
    {
        try {
            // Find the advertisement by its ID
            $advertisement = Advertisement::findOrFail($advertisementId);

            // Return a success response with the user ID associated with the advertisement
            return ApiResponse::success('User ID obtenido', 200, $advertisement->user_id);
        } catch (ModelNotFoundException $e) {
            // Handle the exception if the advertisement ID does not exist
            return ApiResponse::error('El ID del anuncio no existe', 404);
        } catch (\Exception $e) {
            // Handle other exceptions and return an error response
            return ApiResponse::error('Error al obtener el user_id', 500);
        }
    }

    //------------------------------------------------------------------------------------------------

}
