<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use App\Models\Advertisement;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;



class AdvertisementController extends Controller
{
    // Función para mostrar todos los anuncios
    public function index()
    {
        $advertisements = Advertisement::all();
        return ApiResponse::success('Lista de anuncios', 200, $advertisements);
    }

    // Función para mostrar un formulario para crear un nuevo anuncio
    // public function create()
    // {
    //     return view('advertisements.create');
    // }

    // Función para guardar un nuevo anuncio en la base de datos
    public function store(Request $request)
    {
        try {
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

            $advertisement = Advertisement::create($request->all());
            return ApiResponse::success('Anuncio creado exitosamente', 201, $advertisement);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }

    // Función para mostrar un anuncio específico
    public function show($id)
    {
        try {
            $advertisement = Advertisement::findOrFail($id);
            return ApiResponse::success('Anuncio obtenido', 200, $advertisement);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Anuncio no encontrado', 404);
        }
    }

    // Función para mostrar un formulario para editar un anuncio
    public function edit(Advertisement $advertisement)
    {
        return view('advertisements.edit', compact('advertisement'));
    }

    // Función para actualizar un anuncio en la base de datos
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

        $advertisement->update($request->all());

        return ApiResponse::success('Anuncio actualizado exitosamente', 200, $advertisement);
    }

    // Función para eliminar un anuncio de la base de datos
    public function destroy(Advertisement $advertisement)
    {
        $advertisement->delete();

        return ApiResponse::success('Anuncio borrado', 200, $advertisement);

    }
}
