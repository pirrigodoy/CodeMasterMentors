<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;

class MessageController extends Controller
{

    //-----------------------------------------------------------------------------------

    /**
     * Send a message.
     *
     * This function validates the data from the message sending form and sends a message with the provided data.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing message data.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating success or failure.
     */
    public function sendMessage(Request $request)
    {
        // Validate the message sending form data
        $request->validate([
            'remitente' => 'required|integer',
            'destinatario' => 'required|integer',
            'content' => 'required|string',
            'date' => 'required', // Ensure date field is present
            'estado' => 'required', // Ensure estado field is present
        ]);

        try {
            // Create a new message with the provided data
            $message = new Message();
            $message->remitente = $request->remitente;
            $message->destinatario = $request->destinatario;
            $message->content = $request->content;
            $message->date = $request->date;
            $message->estado = $request->estado;

            $message->save();

            // Return a success response
            return response()->json(['message' => 'Message sent successfully'], 200);
        } catch (QueryException $e) {
            // If an error occurs while saving the message, log the error and return an error response
            Log::error('Error al enviar el mensaje: ' . $e->getMessage());
            return response()->json(['error' => 'Error al enviar el mensaje'], 500);
        }
    }

    //-----------------------------------------------------------------------------------



    //-----------------------------------------------------------------------------------

    /**
     * Get messages between two users.
     *
     * This function retrieves messages exchanged between two users identified by their IDs.
     *
     * @param  int  $senderId
     *     The ID of the message sender.
     * @param  int  $recipientId
     *     The ID of the message recipient.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response containing messages exchanged between the specified users.
     */
    public function getMessages($senderId, $recipientId)
    {
        try {
            // Retrieve messages between two users
            $messages = Message::where(function ($query) use ($senderId, $recipientId) {
                $query->where('remitente', $senderId)
                    ->where('destinatario', $recipientId);
            })->orWhere(function ($query) use ($senderId, $recipientId) {
                $query->where('remitente', $recipientId)
                    ->where('destinatario', $senderId);
            })->orderBy('created_at', 'asc')->get();

            // Return the messages
            return response()->json($messages, 200);
        } catch (QueryException $e) {
            // If an error occurs while retrieving messages, log the error and return an error response
            Log::error('Error al obtener los mensajes: ' . $e->getMessage());
            return response()->json(['error' => 'Error al obtener los mensajes'], 500);
        }
    }

    //-----------------------------------------------------------------------------------



    //-----------------------------------------------------------------------------------

    /**
     * Get unique message recipients for a given sender.
     *
     * This function retrieves unique message recipients for a given sender identified by their ID.
     *
     * @param  int  $senderId
     *     The ID of the message sender.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response containing unique message recipients for the specified sender.
     */
    public function getUniqueRecipients($senderId)
    {
        // Retrieve unique recipients for the given sender
        $recipients = Message::where('remitente', $senderId)
            ->groupBy('destinatario')
            ->select('destinatario')
            ->get();

        // Log retrieved data for analysis
        Log::info('Recipients: ' . $recipients);

        // Extract unique recipient IDs
        $uniqueRecipients = $recipients->pluck('destinatario');

        // Log unique recipient IDs for analysis
        Log::info('Unique Recipients: ' . $uniqueRecipients);

        // If no unique recipients found, return an empty response
        if ($uniqueRecipients->isEmpty()) {
            return response()->json([]);
        }

        // Return the unique recipients
        return response()->json($uniqueRecipients)->header('Access-Control-Allow-Origin', '*');
    }

    //-----------------------------------------------------------------------------------



    //-----------------------------------------------------------------------------------

    /**
     * Get unique message senders for a given recipient.
     *
     * This function retrieves unique message senders for a given recipient identified by their ID.
     *
     * @param  int  $recipientId
     *     The ID of the message recipient.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response containing unique message senders for the specified recipient.
     */
    public function getUniqueSenders($recipientId)
    {
        // Retrieve unique senders for the given recipient
        $senders = Message::where('destinatario', $recipientId)
            ->groupBy('remitente')
            ->select('remitente')
            ->get();

        // Extract unique sender IDs
        $uniqueSenders = $senders->pluck('remitente');

        // If no unique senders found, return an empty response
        if ($uniqueSenders->isEmpty()) {
            return response()->json([]);
        }

        // Return the unique senders
        return response()->json($uniqueSenders, 200)->header('Access-Control-Allow-Origin', '*');
    }

    //-----------------------------------------------------------------------------------

}
