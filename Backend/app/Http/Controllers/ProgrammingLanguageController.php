<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProgrammingLanguage;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Responses\ApiResponse;

class ProgrammingLanguageController extends Controller
{
    public function index()
    {
        try {
            $languages = ProgrammingLanguage::all();
            return ApiResponse::success('Lista de lenguajes de programación', 200, $languages);
        } catch (\Exception $e) {
            return ApiResponse::error('Error al obtener la lista de lenguajes de programación', 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'languageName' => 'required',
                // Aquí puedes agregar más reglas de validación según tus necesidades
            ]);
            $language = ProgrammingLanguage::create($request->all());
            return ApiResponse::success('Lenguaje de programación creado exitosamente', 201, $language);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }

    public function show($id)
    {
        try {
            $language = ProgrammingLanguage::findOrFail($id);
            return ApiResponse::success('Lenguaje de programación obtenido', 200, $language);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Lenguaje de programación no encontrado', 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $language = ProgrammingLanguage::findOrFail($id);
            $request->validate([
                'languageName' => 'required',
                // Aquí puedes agregar más reglas de validación según tus necesidades
            ]);
            $language->update($request->all());
            return ApiResponse::success('Lenguaje de programación actualizado exitosamente', 200, $language);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Lenguaje de programación no encontrado', 404);
        }
    }

    public function destroy($id)
    {
        try {
            $language = ProgrammingLanguage::findOrFail($id);
            $language->delete();
            return ApiResponse::success('Lenguaje de programación eliminado exitosamente', 200);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Lenguaje de programación no encontrado', 404);
        }
    }
}
