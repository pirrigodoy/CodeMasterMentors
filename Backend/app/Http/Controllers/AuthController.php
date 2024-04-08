<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use \stdClass;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'role_id' => 'required',
            'username' => 'required|string|max:255',
            'password' => 'required|string|min:8',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'role_id' => $request->role_id,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'name' => $request->name,
            'email' => $request->email
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()
            ->json(['data' => $user, 'access_token' => $token, 'token_type' => 'Bearer',]);
    }

    public function login(Request $request)
    {

        if (Auth::attempt($request->only('email', 'password'))) {

            return response()
                ->json(['message' => 'Unauthorized'], 401);
        }

        $user = User::where('email', $request['email'])->firstOrFail();

        $token = $user->createToken('auth_token')->plainTextToken;


        return response()
            ->json([
                'message' => 'Hi ' . $user->name,
                'accessToken' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
            ]);
    }


    public function logout()
    {
        // Verificar si el usuario está autenticado
        if (auth()->check()) {
            // Eliminar todos los tokens de acceso del usuario
            auth()->user()->tokens()->delete();

            // Retornar un mensaje de éxito
            return ['message' => 'Has cerrado sesión exitosamente y todos los tokens han sido eliminados.'];
        } else {
            // Si el usuario no está autenticado, retornar un mensaje de error
            return ['message' => 'No hay ningún usuario autenticado actualmente.'];
        }
    }
}
