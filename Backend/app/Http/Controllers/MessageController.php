<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;

class MessageController extends Controller
{
    public function sendMessage(Request $request)
    {
        // Valida los datos del formulario de envío de mensajes
        $request->validate([
            'remitente' => 'required|integer',
            'destinatario' => 'required|integer',
            'comment' => 'required|string', // Añadido: Validación del contenido del mensaje
        ]);

        try {
            // Crea un nuevo mensaje con los datos proporcionados
            $message = new Message();
            $message->remitente = $request->remitente;
            $message->destinatario = $request->destinatario;
            $message->comment = $request->comment;
            $message->date = $request->date;
            $message->estado = $request->estado;

            $message->save();

            // Devuelve una respuesta de éxito
            return response()->json(['message' => 'Message sent successfully'], 200);
        } catch (QueryException $e) {
            // Si ocurre un error al guardar el mensaje, registra un error y devuelve una respuesta de error
            Log::error('Error al enviar el mensaje: ' . $e->getMessage());
            return response()->json(['error' => 'Error al enviar el mensaje'], 500);
        }
    }

    public function getMessages($senderId, $recipientId)
    {
        try {
            // Obtén los mensajes entre dos usuarios
            $messages = Message::where(function ($query) use ($senderId, $recipientId) {
                $query->where('remitente', $senderId)
                    ->where('destinatario', $recipientId);
            })->orWhere(function ($query) use ($senderId, $recipientId) {
                $query->where('remitente', $recipientId)
                    ->where('destinatario', $senderId);
            })->orderBy('created_at', 'asc')->get();

            // Devuelve los mensajes
            return response()->json($messages, 200);
        } catch (QueryException $e) {
            // Si ocurre un error al obtener los mensajes, registra un error y devuelve una respuesta de error
            Log::error('Error al obtener los mensajes: ' . $e->getMessage());
            return response()->json(['error' => 'Error al obtener los mensajes'], 500);
        }
    }
    public function getUniqueRecipients($senderId)
    {
        $recipients = Message::where('remitente', $senderId)
            ->groupBy('destinatario')
            ->select('destinatario')
            ->get();

        // Agrega una declaración de registro para ver los datos recuperados
        Log::info('Recipients: ' . $recipients);

        $uniqueRecipients = $recipients->pluck('destinatario');

        // Agrega otra declaración de registro para ver los destinatarios únicos
        Log::info('Unique Recipients: ' . $uniqueRecipients);

        if ($uniqueRecipients->isEmpty()) {
            return response()->json(['error' => 'No recipients found for the sender.'], 404);
        }

        return response()->json($uniqueRecipients)->header('Access-Control-Allow-Origin', '*');
    }

    public function getUniqueSenders($recipientId)
    {
        $senders = Message::where('destinatario', $recipientId)
            ->groupBy('remitente')
            ->select('remitente')
            ->get();

        $uniqueSenders = $senders->pluck('remitente');

        if ($uniqueSenders->isEmpty()) {
            return response()->json(['error' => 'No senders found for the recipient.'], 404);
        }

        return response()->json($uniqueSenders, 200)->header('Access-Control-Allow-Origin', '*');
    }
}
