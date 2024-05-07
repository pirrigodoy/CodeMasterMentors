<?php

namespace App\Http\Controllers;

use App\Models\Advertisement;
use Illuminate\Http\Request;
use App\Models\Receipt;

class ReceiptController extends Controller
{
    /**
     * Obtiene todos los recibos.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Obtiene todos los recibos de la base de datos
        $receipts = Receipt::all();

        // Devuelve los recibos en formato JSON
        return response()->json($receipts);
    }

    /**
     * Crea un nuevo recibo.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        // Valida los datos del formulario
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'advertisement_id' => 'required|exists:advertisements,id',
        ]);

        // Recupera el anuncio asociado y su precio por hora
        $advertisement = Advertisement::findOrFail($request->advertisement_id);
        $priceHour = $advertisement->price_hour;

        // Crea una nueva instancia de Receipt
        $receipt = new Receipt();

        // Asigna los valores del recibo
        $receipt->user_id = $request->user_id;
        $receipt->advertisement_id = $request->advertisement_id;
        $receipt->price_hour = $priceHour;

        // Guarda el recibo en la base de datos
        $receipt->save();

        // Devuelve una respuesta JSON indicando éxito
        return response()->json(['message' => 'Recibo creado exitosamente'], 201);
    }
}
