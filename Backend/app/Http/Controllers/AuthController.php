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
    //-----------------------------------------------------------------------------------
    /**
     * Register a new user.
     *
     * This function validates the form data for user registration and creates a new user if validation passes.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing user registration data.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response containing the new user and access token if registration is successful.
     */
    public function register(Request $request)
    {
        // Validate the form data for user registration
        $validator = Validator::make($request->all(), [
            'role_id' => 'required',
            'username' => 'required|string|max:255',
            'password' => 'required|string|min:8',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'born_date' => 'required|string',
            'city_id' => 'required',
            'img' => 'required|string'
        ]);

        // If validation fails, return the errors
        if ($validator->fails()) {
            return response()->json($validator->errors(), Response::HTTP_BAD_REQUEST);
        }

        // Create a new user
        $user = User::create([
            'role_id' => $request->role_id,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'name' => $request->name,
            'email' => $request->email,
            'born_date' => $request->born_date,
            'city_id' => $request->city_id,
            'img' => $request->img
        ]);

        // Generate a JWT token for the new user
        $token = JWTAuth::fromUser($user);

        // Return the response with the new user and token
        return response()->json([
            'data' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
    //-----------------------------------------------------------------------------------



    //-----------------------------------------------------------------------------------
    /**
     * Authenticate a user and generate JWT token.
     *
     * This function validates the user credentials and generates a JWT token if authentication is successful.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing user credentials.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response containing the JWT token and authenticated user if successful.
     */
    public function login(Request $request)
    {
        // Validate the user credentials
        $credentials = $request->only('email', 'password');

        // If the credentials are invalid, return an error
        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        // Get the authenticated user
        $user = Auth::user();

        // Generate a JWT token for the authenticated user
        $token = JWTAuth::fromUser($user);

        // Return the response with the JWT token and authenticated user
        return response()->json([
            'message' => 'Hi ' . $user->name,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }
    //-----------------------------------------------------------------------------------



    //-----------------------------------------------------------------------------------
    /**
     * Revoke JWT token and log out the authenticated user.
     *
     * This function attempts to revoke the JWT token of the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating success or failure of logout.
     */
    public function logout(Request $request)
    {
        try {
            // Attempt to revoke the JWT token of the authenticated user
            JWTAuth::parseToken()->invalidate();

            // Return a success message
            return response()->json(['message' => 'Logout successful'], Response::HTTP_OK);
        } catch (\Exception $e) {
            // Catch exceptions and return an error message
            return response()->json(['message' => 'Logout failed', 'error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    //-----------------------------------------------------------------------------------

}
