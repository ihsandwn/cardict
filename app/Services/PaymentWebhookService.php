<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Notifications\OrderStatusUpdatedNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PaymentWebhookService
{
    public function __construct(
        private readonly AuditLogService $auditLog,
    ) {}

    /**
     * @param  array<string, mixed>  $payload
     */
    public function handle(array $payload): void
    {
        $reference = (string) ($payload['provider_reference'] ?? '');
        $status = (string) ($payload['status'] ?? '');

        if ($reference === '' || ! in_array($status, [Payment::STATUS_CAPTURED, Payment::STATUS_FAILED], true)) {
            throw ValidationException::withMessages([
                'payload' => 'Invalid payment webhook payload.',
            ]);
        }

        DB::transaction(function () use ($reference, $status): void {
            $payment = Payment::query()
                ->where('provider_reference', $reference)
                ->lockForUpdate()
                ->first();

            if (! $payment) {
                throw ValidationException::withMessages([
                    'payload' => 'Payment reference not found.',
                ]);
            }

            if ($payment->status === $status) {
                return;
            }

            $previousStatus = $payment->status;

            $payment->update([
                'status' => $status,
                'paid_at' => now(),
            ]);

            $order = $payment->order()->with(['items', 'user'])->first();
            if (! $order) {
                throw ValidationException::withMessages([
                    'payload' => 'Order for payment not found.',
                ]);
            }

            $previousOrderStatus = $order->status;

            $payment->order()->update([
                'status' => $status === Payment::STATUS_CAPTURED
                    ? Order::STATUS_PAID
                    : Order::STATUS_CANCELLED,
            ]);

            if ($status === Payment::STATUS_FAILED && $previousStatus !== Payment::STATUS_FAILED) {
                foreach ($order->items as $item) {
                    Product::query()
                        ->whereKey($item->product_id)
                        ->increment('stock_quantity', (int) $item->quantity);
                }
            }

            $order->refresh();

            if ($order->user && $previousOrderStatus !== $order->status) {
                $order->user->notify(new OrderStatusUpdatedNotification($order, $previousOrderStatus));
            }

            $this->auditLog->record(
                event: 'payment.webhook.processed',
                actorId: null,
                entityType: 'order',
                entityId: $order->id,
                context: [
                    'order_number' => $order->order_number,
                    'provider_reference' => $reference,
                    'previous_payment_status' => $previousStatus,
                    'new_payment_status' => $status,
                    'order_status' => $order->status,
                ],
            );
        });
    }
}
