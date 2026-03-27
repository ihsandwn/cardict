<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Services\AuditLogService;
use App\Services\PaymentWebhookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PaymentWebhookController extends Controller
{
    public function __construct(
        private readonly PaymentWebhookService $service,
        private readonly AuditLogService $auditLog,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $signature = (string) $request->header('X-Payment-Signature', '');
        $expected = hash_hmac('sha256', $request->getContent(), config('services.manual_payment.webhook_secret'));

        if ($signature === '' || ! hash_equals($expected, $signature)) {
            $this->auditLog->record(
                event: 'payment.webhook.invalid_signature',
                context: [
                    'path' => $request->path(),
                ],
                request: $request,
            );

            return response()->json(['message' => 'Invalid signature.'], Response::HTTP_UNAUTHORIZED);
        }

        $validated = $request->validate([
            'provider_reference' => ['required', 'string', 'max:255'],
            'status' => ['required', 'in:captured,failed'],
        ]);

        $this->service->handle($validated);

        return response()->json(['message' => 'Webhook accepted.']);
    }
}
