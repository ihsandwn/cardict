<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CheckoutService
{
    /**
     * @param  array<string, mixed>  $payload
     */
    public function place(User $user, array $payload, array $cartLines): Order
    {
        if ($cartLines === []) {
            throw ValidationException::withMessages([
                'cart' => 'Your bag is empty.',
            ]);
        }

        return DB::transaction(function () use ($user, $payload, $cartLines): Order {
            $productIds = array_column($cartLines, 'product_id');

            $productsById = Product::query()
                ->whereIn('id', $productIds)
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $subtotal = 0;
            $itemRows = [];

            foreach ($cartLines as $line) {
                $product = $productsById->get((int) $line['product_id']);
                $quantity = (int) $line['quantity'];

                if (! $product || $product->is_sold_out || $quantity < 1) {
                    throw ValidationException::withMessages([
                        'cart' => 'One or more pieces in your bag are unavailable.',
                    ]);
                }

                if ($product->stock_quantity < $quantity) {
                    throw ValidationException::withMessages([
                        'cart' => "Insufficient stock for {$product->name}.",
                    ]);
                }

                $lineTotal = $product->price_cents * $quantity;
                $subtotal += $lineTotal;

                $itemRows[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit_price_cents' => $product->price_cents,
                    'quantity' => $quantity,
                    'line_total_cents' => $lineTotal,
                ];
            }

            $tax = (int) round($subtotal * 0.08);
            $shipping = 0;
            $total = $subtotal + $tax + $shipping;

            $idempotencyKey = (string) ($payload['idempotency_key'] ?? Str::uuid()->toString());

            $order = Order::query()->firstOrCreate(
                ['idempotency_key' => $idempotencyKey],
                [
                    'user_id' => $user->id,
                    'order_number' => $this->newOrderNumber(),
                    'status' => Order::STATUS_PENDING,
                    'currency' => 'USD',
                    'subtotal_cents' => $subtotal,
                    'tax_cents' => $tax,
                    'shipping_cents' => $shipping,
                    'total_cents' => $total,
                    'payment_method' => (string) $payload['payment_method'],
                    'shipping_name' => (string) $payload['shipping_name'],
                    'shipping_phone' => (string) $payload['shipping_phone'],
                    'shipping_address_line1' => (string) $payload['shipping_address_line1'],
                    'shipping_address_line2' => Arr::get($payload, 'shipping_address_line2'),
                    'shipping_city' => (string) $payload['shipping_city'],
                    'shipping_state' => Arr::get($payload, 'shipping_state'),
                    'shipping_postal_code' => (string) $payload['shipping_postal_code'],
                    'shipping_country' => strtoupper((string) $payload['shipping_country']),
                    'placed_at' => now(),
                ],
            );

            if ($order->wasRecentlyCreated) {
                foreach ($itemRows as $row) {
                    $order->items()->create($row);
                }

                $order->payments()->create([
                    'provider' => 'manual_test',
                    'provider_reference' => 'manual-'.$order->order_number,
                    'status' => Payment::STATUS_AUTHORIZED,
                    'amount_cents' => $order->total_cents,
                    'currency' => $order->currency,
                    'paid_at' => now(),
                ]);

                foreach ($itemRows as $row) {
                    Product::query()
                        ->whereKey($row['product_id'])
                        ->decrement('stock_quantity', (int) $row['quantity']);
                }
            }

            return $order->load(['items', 'payments']);
        });
    }

    private function newOrderNumber(): string
    {
        return 'AK-'.now()->format('Ymd').'-'.str_pad((string) random_int(1, 999999), 6, '0', STR_PAD_LEFT);
    }
}
