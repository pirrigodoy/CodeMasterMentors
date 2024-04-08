<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Responses\ApiResponse;

class StudentController extends Controller
{
    public function index()
    {
        try {
            $students = Student::all();
            return ApiResponse::success('Lista de estudiantes', 200, $students);
        } catch (\Exception $e) {
            return ApiResponse::error('Error al obtener la lista de estudiantes', 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required',
                'course' => 'required',
                // Aquí puedes agregar más reglas de validación según tus necesidades
            ]);
            $student = Student::create($request->all());
            return ApiResponse::success('Estudiante creado exitosamente', 201, $student);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }

    public function show($id)
    {
        try {
            $student = Student::findOrFail($id);
            return ApiResponse::success('Estudiante obtenido', 200, $student);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Estudiante no encontrado', 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $student = Student::findOrFail($id);
            $request->validate([
                'user_id' => 'required',
                'course' => 'required',
                // Aquí puedes agregar más reglas de validación según tus necesidades
            ]);
            $student->update($request->all());
            return ApiResponse::success('Estudiante actualizado exitosamente', 200, $student);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Estudiante no encontrado', 404);
        }
    }

    public function destroy($id)
    {
        try {
            $student = Student::findOrFail($id);
            $student->delete();
            return ApiResponse::success('Estudiante eliminado exitosamente', 200);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Estudiante no encontrado', 404);
        }
    }
}
