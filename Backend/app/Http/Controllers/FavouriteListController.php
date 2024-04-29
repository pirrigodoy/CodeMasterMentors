<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use App\Models\FavouriteList;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class FavouriteListController extends Controller
{
    // Función para mostrar todas las listas de favoritos
    public function index()
    {
        $favouriteLists = FavouriteList::all();
        return ApiResponse::success('Lista de listas de favoritos', 200, $favouriteLists);
    }

    // Función para guardar una nueva lista de favoritos en la base de datos
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required',
                'user_id' => 'required',
            ]);

            $favouriteList = FavouriteList::create($request->all());
            return ApiResponse::success('Lista de favoritos creada exitosamente', 201, $favouriteList);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }

    // Función para mostrar una lista de favoritos específica
    public function show($id)
    {
        try {
            $favouriteList = FavouriteList::findOrFail($id);
            return ApiResponse::success('Lista de favoritos obtenida', 200, $favouriteList);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Lista de favoritos no encontrada', 404);
        }
    }

    // Función para actualizar una lista de favoritos en la base de datos
    public function update(Request $request, FavouriteList $favouriteList)
    {
        $request->validate([
            'name' => 'required',
            'user_id' => 'required',
        ]);

        $favouriteList->update($request->all());

        return ApiResponse::success('Lista de favoritos actualizada exitosamente', 200, $favouriteList);
    }

    // Función para eliminar una lista de favoritos de la base de datos
    public function destroy(FavouriteList $favouriteList)
    {
        $favouriteList->delete();

        return ApiResponse::success('Lista de favoritos borrada', 200, $favouriteList);
    }
}
