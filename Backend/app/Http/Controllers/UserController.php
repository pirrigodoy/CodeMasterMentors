<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Responses\ApiResponse;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return ApiResponse::success('Lista de usuarios', 200, $users);
    }


    public function store(Request $request)
    {
        try {
            $request->validate([
                'role_id' => 'required',
                'username' => 'required|unique:users',
                'password' => 'required|min:8',
                'name' => 'required|string',
                'email' => 'required|email|unique:users',
                'born_date' => 'required|string',
                'area' => 'required|string',
                'img' =>'required|string'
            ]);

            $user = User::create($request->all());
            return ApiResponse::success('Usuario creado exitosamente', 201, $user);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }

    public function show($id)
    {
        try {
            $user = User::findOrFail($id);
            return ApiResponse::success('Usuario obtenido', 200, $user);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Usuario no encontrado', 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);
            $request->validate([
                'username' => 'required|unique:users,username,' . $id,
                'name' => 'required|string',
                'email' => 'required|email|unique:users,email,' . $id,
                'born_date' => 'required|string',
                'area' => 'required|string',
                // 'img' =>'required|string'
            ]);
            $user->update($request->all());
            return ApiResponse::success('Usuario actualizado exitosamente', 200, $user);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Usuario no encontrado', 404);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();
            return ApiResponse::success('Usuario eliminado exitosamente', 200);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Usuario no encontrado', 404);
        }
    }

    public function uploadImage(Request $request)
    {
        // Valida la solicitud
        $request->validate([
            'image' => 'required', // Ajusta las reglas de validación según tus necesidades
        ]);

        // Obtiene el archivo de imagen
        $image = $request->file('image');

        // Genera un nombre único para la imagen
        $imageName = time() . '.' . $image->getClientOriginalExtension();

        // Mueve la imagen a la carpeta public/images
        $image->move(public_path('images'), $imageName);

        // Retorna la URL de la imagen para que Angular pueda acceder a ella
        return response()->json(['url' => asset('images/' . $imageName)]);
    }



}
