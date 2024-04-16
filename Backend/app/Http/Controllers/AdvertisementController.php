<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use App\Models\Advertisement;

class AdvertisementController extends Controller
{
    // Función para mostrar todos los anuncios
    public function index()
    {
        $advertisements = Advertisement::all();
        return ApiResponse::success('Lista de anuncios', 200, $advertisements);
    }

    // Función para mostrar un formulario para crear un nuevo anuncio
    public function create()
    {
        return view('advertisements.create');
    }

    // Función para guardar un nuevo anuncio en la base de datos
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'programming_languages_id' => 'required',
            'title' => 'required',
            'class' => 'required',
            'about_me' => 'required',
            'description' => 'required',
            'price_hour' => 'required',
            'disponibility' => 'required',
            'experience' => 'required'
        ]);

        Advertisement::create($request->all());

        return redirect()->route('advertisements.index')
            ->with('success', 'Advertisement created successfully.');
    }

    // Función para mostrar un anuncio específico
    public function show(Advertisement $advertisement)
    {
        return view('advertisements.show', compact('advertisement'));
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
            'user_id' => 'required',
            'programming_languages_id' => 'required',
            'title' => 'required',
            'class' => 'required',
            'about_me' => 'required',
            'description' => 'required',
            'price_hour' => 'required',
            'disponibility' => 'required',
            'experience' => 'required'
        ]);

        $advertisement->update($request->all());

        return redirect()->route('advertisements.index')
            ->with('success', 'Advertisement updated successfully');
    }

    // Función para eliminar un anuncio de la base de datos
    public function destroy(Advertisement $advertisement)
    {
        $advertisement->delete();

        return redirect()->route('advertisements.index')
            ->with('success', 'Advertisement deleted successfully');
    }
}
