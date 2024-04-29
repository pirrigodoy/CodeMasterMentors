<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Responses\ApiResponse;
use App\Models\AdvertisementFavouriteList;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AdvertisementFavouriteListController extends Controller
{
    // Función para mostrar todos los elementos de la relación entre anuncios y listas de favoritos
    public function index()
    {
        $advertisementFavouriteLists = AdvertisementFavouriteList::all();
        return ApiResponse::success('Lista de elementos de la relación entre anuncios y listas de favoritos', 200, $advertisementFavouriteLists);
    }

    // Función para agregar un anuncio a una lista de favoritos
    public function store(Request $request)
    {
        try {
            $request->validate([
                'advertisement_id' => 'required',
                'favourite_list_id' => 'required',
            ]);

            $advertisementFavouriteList = AdvertisementFavouriteList::create($request->all());
            return ApiResponse::success('Elemento de relación creado exitosamente', 201, $advertisementFavouriteList);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }

    // Función para mostrar un elemento de la relación entre anuncios y listas de favoritos específico
    public function show($id)
    {
        try {
            $advertisementFavouriteList = AdvertisementFavouriteList::findOrFail($id);
            return ApiResponse::success('Elemento de relación obtenido', 200, $advertisementFavouriteList);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Elemento de relación no encontrado', 404);
        }
    }

    // Función para eliminar un elemento de la relación entre anuncios y listas de favoritos
    public function destroy(AdvertisementFavouriteList $advertisementFavouriteList)
    {
        $advertisementFavouriteList->delete();

        return ApiResponse::success('Elemento de relación eliminado', 200, $advertisementFavouriteList);
    }
}
