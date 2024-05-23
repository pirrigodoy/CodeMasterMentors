<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Responses\ApiResponse;

class CommentController extends Controller
{
    //-----------------------------------------------------------------------------------
    /**
     * Retrieve a list of comments.
     *
     * This function retrieves a list of all comments from the database.
     *
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response containing a list of comments.
     */
    public function index()
    {
        // Retrieve all comments from the database
        $comments = Comment::all();

        // Return a success response with the list of comments
        return ApiResponse::success('Lista de comentarios', 200, $comments);
    }
    //-----------------------------------------------------------------------------------


    //-----------------------------------------------------------------------------------
    /**
     * Store a new comment.
     *
     * This function validates the incoming request data and creates a new comment if validation passes.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing comment data.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating success or validation errors.
     */
    public function store(Request $request)
    {
        try {
            // Validate the incoming request data
            $request->validate([
                'advertisement_id' => 'required|integer|exists:advertisements,id', // Validate advertisement_id
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'required|string',
                'fecha' => 'required|date_format:Y-m-d',
                'receiver' => 'required|integer|exists:users,id' // Validate the 'receiver' field as an integer
            ]);

            // Create a new comment instance
            $comment = new Comment();
            $comment->transmitter = $request->transmitter;
            $comment->advertisement_id = $request->advertisement_id; // Assign advertisement_id
            $comment->receiver = $request->receiver;
            $comment->rating = $request->rating;
            $comment->comment = $request->comment;
            $comment->fecha = $request->fecha;
            $comment->save();

            // Return a success response indicating the comment was created successfully
            return ApiResponse::success('Comentario creado exitosamente', 201, $comment);
        } catch (ValidationException $e) {
            // Handle validation errors and return appropriate response
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        }
    }
    //-----------------------------------------------------------------------------------


    //-----------------------------------------------------------------------------------
    /**
     * Retrieve a specific comment.
     *
     * This function retrieves and displays a specific comment by its ID.
     *
     * @param  int  $id
     *     The ID of the comment to be displayed.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response containing the details of the comment.
     */
    public function show($id)
    {
        try {
            // Retrieve the comment by its ID
            $comment = Comment::findOrFail($id);

            // Return a success response with the details of the comment
            return ApiResponse::success('Comentario obtenido', 200, $comment);
        } catch (ModelNotFoundException $e) {
            // Handle the exception if the comment is not found
            return ApiResponse::error('Comentario no encontrado', 404);
        }
    }
    //-----------------------------------------------------------------------------------


    //-----------------------------------------------------------------------------------
    /**
     * Update a comment.
     *
     * This function updates a specific comment by its ID with the provided data.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing updated comment data.
     * @param  int  $id
     *     The ID of the comment to be updated.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating success or validation errors.
     */
    public function update(Request $request, $id)
    {
        try {
            // Find the comment by its ID
            $comment = Comment::findOrFail($id);

            // Validate the incoming request data
            $request->validate([
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'required|string',
                'date' => 'required|date_format:Y-m-d',
            ]);

            // Update the comment with the provided data
            $comment->update($request->all());

            // Return a success response indicating the comment was updated successfully
            return ApiResponse::success('Comentario actualizado exitosamente', 200, $comment);
        } catch (ValidationException $e) {
            // Handle validation errors and return appropriate response
            $errors = $e->validator->errors()->toArray();
            return ApiResponse::error('Error de validación', 422, $errors);
        } catch (ModelNotFoundException $e) {
            // Handle the exception if the comment is not found
            return ApiResponse::error('Comentario no encontrado', 404);
        }
    }

    //-----------------------------------------------------------------------------------



    //-----------------------------------------------------------------------------------
    /**
     * Delete a comment.
     *
     * This function deletes a specific comment by its ID.
     *
     * @param  int  $id
     *     The ID of the comment to be deleted.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating success or failure.
     */
    public function destroy($id)
    {
        try {
            // Find the comment by its ID
            $comment = Comment::findOrFail($id);

            // Delete the comment
            $comment->delete();

            // Return a success response indicating the comment was deleted successfully
            return ApiResponse::success('Comentario eliminado exitosamente', 200);
        } catch (ModelNotFoundException $e) {
            // Handle the exception if the comment is not found
            return ApiResponse::error('Comentario no encontrado', 404);
        }
    }

    //-----------------------------------------------------------------------------------

}
