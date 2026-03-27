<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function show(Order $order): Response
    {
        $this->authorize('view', $order);

        $order->load(['items.product', 'payments']);

        return Inertia::render('Shop/OrderShow', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'currency' => $order->currency,
                'subtotal_cents' => $order->subtotal_cents,
                'tax_cents' => $order->tax_cents,
                'shipping_cents' => $order->shipping_cents,
                'total_cents' => $order->total_cents,
                'placed_at' => optional($order->placed_at)->toIso8601String(),
                'shipping' => [
                    'name' => $order->shipping_name,
                    'phone' => $order->shipping_phone,
                    'address_line1' => $order->shipping_address_line1,
                    'address_line2' => $order->shipping_address_line2,
                    'city' => $order->shipping_city,
                    'state' => $order->shipping_state,
                    'postal_code' => $order->shipping_postal_code,
                    'country' => $order->shipping_country,
                ],
                'items' => $order->items->map(static function ($item) {
                    return [
                        'id' => $item->id,
                        'product_slug' => optional($item->product)->slug,
                        'product_name' => $item->product_name,
                        'unit_price_cents' => $item->unit_price_cents,
                        'quantity' => $item->quantity,
                        'line_total_cents' => $item->line_total_cents,
                    ];
                })->values(),
            ],
        ]);
    }
}
