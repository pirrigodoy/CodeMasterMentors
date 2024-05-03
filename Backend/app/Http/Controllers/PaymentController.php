<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Exception;

class PaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        // Configurar la clave secreta de Stripe
        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            // Crear un PaymentIntent con los detalles del pago
            $paymentIntent = PaymentIntent::create([
                'amount' => $request->input('amount'), // El monto del pago en centavos
                'currency' => 'usd', // La moneda del pago (en este caso, dólares estadounidenses)
            ]);

            // Aquí podrías realizar cualquier otra acción necesaria, como guardar el ID del PaymentIntent en tu base de datos

            // Devolver una respuesta exitosa al cliente
            return response()->json([
                'success' => true,
                'client_secret' => $paymentIntent->client_secret, // Devolver el client secret para autenticar el pago en el cliente
            ]);
        } catch (Exception $e) {
            // Manejar cualquier error que ocurra durante la creación del PaymentIntent
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(), // Devolver el mensaje de error al cliente
            ], 500); // Devolver un código de estado HTTP 500 para indicar un error interno del servidor
        }
    }
}

?>
