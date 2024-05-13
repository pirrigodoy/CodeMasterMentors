<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Validar los datos del formulario
        $validator = Validator::make($request->all(), [
            'role_id' => 'required',
            'username' => 'required|string|max:255',
            'password' => 'required|string|min:8',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'born_date' => 'required|string',
            'city' => 'required|string',
            'img' =>'required|string'
        ]);

        // Si la validación falla, devolver los errores
        if ($validator->fails()) {
            return response()->json($validator->errors(), Response::HTTP_BAD_REQUEST);
        }

        // Crear un nuevo usuario
        $user = User::create([
            'role_id' => $request->role_id,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'name' => $request->name,
            'email' => $request->email,
            'born_date' => $request->born_date,
            'city' => $request->city,
            'img' => $request->img
        ]);

        // Generar un token JWT para el nuevo usuario
        $token = JWTAuth::fromUser($user);

        // Devolver la respuesta con el usuario y el token
        return response()->json([
            'data' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function login(Request $request)
    {
        // Validar las credenciales del usuario
        $credentials = $request->only('email', 'password');

        // Si las credenciales son inválidas, devolver un error
        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        // Obtener el usuario autenticado
        $user = Auth::user();

        // Generar un token JWT para el usuario autenticado
        $token = JWTAuth::fromUser($user);

        // Devolver la respuesta con el usuario y el token
        return response()->json([
            'message' => 'Hi ' . $user->name,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        try {
            // Intentar revocar el token JWT del usuario autenticado
            JWTAuth::parseToken()->invalidate();

            // Retornar un mensaje de éxito
            return response()->json(['message' => 'Logout successful'], Response::HTTP_OK);
        } catch (\Exception $e) {
            // Capturar excepciones y devolver un mensaje de error
            return response()->json(['message' => 'Logout failed', 'error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
