<?php
// app/Http/Controllers/ReceiptController.php

namespace App\Http\Controllers;

use App\Models\Advertisement;
use Illuminate\Http\Request;
use App\Models\Receipt;

class ReceiptController extends Controller
{
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

        // Crea el recibo
        $receipt = new Receipt();
        $receipt->user_id = $request->user_id;
        $receipt->advertisement_id = $request->advertisement_id;
        $receipt->price_hour = $priceHour;
        $receipt->save();

        // Redirige o muestra un mensaje de éxito
    }
}
