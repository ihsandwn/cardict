<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class OrderHistoryController extends Controller
{
    public function __invoke(): Response
    {
        $orders = Order::query()
            ->where('user_id', request()->user()->id)
            ->latest('id')
            ->with('items')
            ->paginate(12)
            ->through(static function (Order $order): array {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'currency' => $order->currency,
                    'total_cents' => $order->total_cents,
                    'placed_at' => optional($order->placed_at)->toIso8601String(),
                    'items_count' => $order->items->count(),
                ];
            });

        return Inertia::render('Shop/OrdersIndex', [
            'orders' => $orders,
        ]);
    }
}
