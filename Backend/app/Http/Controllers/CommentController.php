<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Responses\ApiResponse;

class CommentController extends Controller
{
    public function index()
    {
        $comments = Comment::all();
        return ApiResponse::success('Lista de comentarios', 200, $comments);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'transmitter' => 'required',
                'receiver' => 'required',
                'rating' => 'required|integer|min:1|max:5',
                'content' => 'required|string',
                'date' => 'required|date_format:Y-m-d',
            ]);

            $comment = Comment::create($request->all());
            return ApiResponse::success('Comentario creado exitosamente', 201, $comment);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }

    public function show($id)
    {
        try {
            $comment = Comment::findOrFail($id);
            return ApiResponse::success('Comentario obtenido', 200, $comment);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Comentario no encontrado', 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $comment = Comment::findOrFail($id);
            $request->validate([
                'rating' => 'required|integer|min:1|max:5',
                'content' => 'required|string',
                'date' => 'required|date_format:Y-m-d',
            ]);
            $comment->update($request->all());
            return ApiResponse::success('Comentario actualizado exitosamente', 200, $comment);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Comentario no encontrado', 404);
        }
    }

    public function destroy($id)
    {
        try {
            $comment = Comment::findOrFail($id);
            $comment->delete();
            return ApiResponse::success('Comentario eliminado exitosamente', 200);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Comentario no encontrado', 404);
        }
    }
}
