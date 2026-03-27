<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('X-XSS-Protection', '0');

        $isLocal = app()->isLocal();

        $scriptSources = ["'self'", "'unsafe-inline'"];
        $connectSources = ["'self'"];

        if ($isLocal) {
            $scriptSources = array_merge($scriptSources, [
                'http://localhost:5173',
                'http://127.0.0.1:5173',
            ]);

            $connectSources = array_merge($connectSources, [
                'http://localhost:5173',
                'http://127.0.0.1:5173',
                'ws://localhost:5173',
                'ws://127.0.0.1:5173',
                // Reverb local websocket endpoints.
                'ws://localhost:8080',
                'ws://127.0.0.1:8080',
            ]);
        }

        $scriptSrc = 'script-src '.implode(' ', $scriptSources);
        $connectSrc = 'connect-src '.implode(' ', $connectSources);

        $response->headers->set(
            'Content-Security-Policy',
            "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https:; font-src 'self' data: https:; {$scriptSrc}; {$connectSrc}; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
        );

        return $response;
    }
}
