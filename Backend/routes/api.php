<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProgrammingLanguageController;
use App\Http\Controllers\AdvertisementController;
use App\Http\Controllers\AdvertisementFavouriteListController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FavouriteListController;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('logout', [AuthController::class, 'logout']);
});
Route::apiResource('roles', RoleController::class);
Route::apiResource('users', UserController::class);
Route::apiResource('advertisements', AdvertisementController::class);
Route::apiResource('programminglanguages', ProgrammingLanguageController::class);
Route::apiResource('comments', CommentController::class);
Route::post('uploadimage', [UserController::class, 'uploadimage']);
Route::apiResource('advertisement_favourite_lists', AdvertisementFavouriteListController::class);
Route::apiResource('favourite_lists', FavouriteListController::class);

Route::post('process-payment', [PaymentController::class, 'processPayment']);
