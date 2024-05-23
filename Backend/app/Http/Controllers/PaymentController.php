<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Exception;

class PaymentController extends Controller
{


    /**
     * Process a payment request.
     *
     * This function creates a PaymentIntent with the payment details and returns the client secret for authentication.
     *
     * @param  \Illuminate\Http\Request  $request
     *     The HTTP request containing the payment details.
     * @return \Illuminate\Http\JsonResponse
     *     Returns a JSON response indicating the success or failure of the payment request and the client secret for authentication.
     */
    public function processPayment(Request $request)
    {
        // Set the Stripe secret key
        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            // Create a PaymentIntent with payment details
            $paymentIntent = PaymentIntent::create([
                'amount' => $request->input('amount'), // Payment amount in cents
                'currency' => 'usd', // Payment currency (in this case, US dollars)
            ]);

            // Perform any other necessary actions, such as saving the PaymentIntent ID in your database

            // Return a successful response to the client
            return response()->json([
                'success' => true,
                'client_secret' => $paymentIntent->client_secret, // Return the client secret for payment authentication
            ]);
        } catch (Exception $e) {
            // Handle any errors that occur during PaymentIntent creation
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(), // Return the error message to the client
            ], 500); // Return an HTTP status code 500 to indicate an internal server error
        }
    }
}
