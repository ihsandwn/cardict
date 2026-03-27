<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\PlaceOrderRequest;
use App\Notifications\OrderPlacedNotification;
use App\Services\AuditLogService;
use App\Services\CartService;
use App\Services\CheckoutService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly CartService $cart,
        private readonly CheckoutService $checkout,
        private readonly AuditLogService $auditLog,
    ) {}

    public function create(Request $request): Response|RedirectResponse
    {
        $lines = $this->cart->linesWithProducts($request);

        if ($lines->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your bag is empty.');
        }

        return Inertia::render('Shop/Checkout', [
            'lines' => $lines,
            'subtotal_cents' => $this->cart->subtotalCents($request),
            'idempotency_key' => (string) str()->uuid(),
            'user' => [
                'name' => (string) $request->user()->name,
                'email' => (string) $request->user()->email,
            ],
        ]);
    }

    public function store(PlaceOrderRequest $request): RedirectResponse
    {
        $order = $this->checkout->place(
            user: $request->user(),
            payload: $request->validated(),
            cartLines: $this->cart->lines($request),
        );

        if ($order->wasRecentlyCreated) {
            $this->cart->clear($request);

            $request->user()->notify(new OrderPlacedNotification($order));

            $this->auditLog->record(
                event: 'checkout.order.placed',
                actorId: $request->user()->id,
                entityType: 'order',
                entityId: $order->id,
                context: ['order_number' => $order->order_number],
                request: $request,
            );
        } else {
            $this->auditLog->record(
                event: 'checkout.order.idempotent_replay',
                actorId: $request->user()->id,
                entityType: 'order',
                entityId: $order->id,
                context: ['order_number' => $order->order_number],
                request: $request,
            );
        }

        return redirect()
            ->route('orders.show', $order)
            ->with('success', "Order {$order->order_number} placed.");
    }
}
