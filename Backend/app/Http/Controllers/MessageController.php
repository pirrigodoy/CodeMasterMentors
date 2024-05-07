<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;

class MessageController extends Controller
{
    public function sendMessage(Request $request)
    {
        // Valida los datos del formulario de envío de mensajes
        $request->validate([
            'remitente' => 'required|integer',
            'destinatario' => 'required|integer',
           // 'content' => 'required|string',
        ]);

        // Crea un nuevo mensaje con los datos proporcionados
        $message = new Message();
        $message->remitente = $request->remitente;
        $message->destinatario = $request->destinatario;
        $message->content = $request->content;
        $message->date = $request->date;
        $message->estado = $request->estado;

        $message->save();

        // Devuelve una respuesta de éxito
        return response()->json(['message' => 'Message sent successfully'], 200);
    }

    public function getMessages($senderId, $recipientId)
{
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
}

public function getUniqueRecipients($senderId)
{
    $recipients = Message::where('remitente', $senderId)
        ->distinct('destinatario')
        ->pluck('destinatario');

    return response()->json($recipients)->header('Access-Control-Allow-Origin', '*');
}




   
}
