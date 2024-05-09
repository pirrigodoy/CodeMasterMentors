<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Permitir acceso desde cualquier origen
        $headers = [
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'PUT, POST, DELETE, GET, OPTIONS',
            'Access-Control-Allow-Headers' => 'Accept, Authorization, Content-Type',
        ];

        // Si es una solicitud de tipo OPTIONS, devolver solo los encabezados CORS y no continuar con la ejecución del middleware
        if ($request->isMethod('OPTIONS')) {
            return response()->json('OK', 200, $headers);
        }

        // Si no es una solicitud OPTIONS, continuar con la ejecución del middleware
        $response = $next($request);

        // Agregar los encabezados CORS a la respuesta
        foreach ($headers as $key => $value) {
            $response->header($key, $value);
        }

        return $response;
    }
}
