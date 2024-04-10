<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Teacher;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Responses\ApiResponse;

class TeacherController extends Controller
{
    public function index()
    {
        try {
            $teachers = Teacher::all();
            return ApiResponse::success('Lista de profesores', 200, $teachers);
        } catch (\Exception $e) {
            return ApiResponse::error('Error al obtener la lista de profesores', 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required',
                'price_per_hour' => 'required',
                'experience' => 'required',
                'languages' => 'required',
                'availability' => 'required',
            ]);
            $teacher = Teacher::create($request->all());
            return ApiResponse::success('Profesor creado exitosamente', 201, $teacher);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }

    public function show($id)
    {
        try {
            $teacher = Teacher::findOrFail($id);
            return ApiResponse::success('Profesor obtenido', 200, $teacher);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Profesor no encontrado', 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $teacher = Teacher::findOrFail($id);
            $request->validate([
                'user_id' => 'required',
                'price_per_hour' => 'required',
                'experience' => 'required',
                'languages' => 'required',
                'availability' => 'required',
            ]);
            $teacher->update($request->all());
            return ApiResponse::success('Profesor actualizado exitosamente', 200, $teacher);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Profesor no encontrado', 404);
        }
    }

    public function destroy($id)
    {
        try {
            $teacher = Teacher::findOrFail($id);
            $teacher->delete();
            return ApiResponse::success('Profesor eliminado exitosamente', 200);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Profesor no encontrado', 404);
        }
    }
}
