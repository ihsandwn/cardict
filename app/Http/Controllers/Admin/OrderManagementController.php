<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Notifications\OrderStatusUpdatedNotification;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderManagementController extends Controller
{
    public function __construct(
        private readonly AuditLogService $auditLog,
    ) {}

    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();

        $query = Order::query()->with('user')->latest('id');
        if ($status !== '') {
            $query->where('status', $status);
        }

        $orders = $query->paginate(20)->withQueryString()->through(static function (Order $order): array {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'total_cents' => $order->total_cents,
                'currency' => $order->currency,
                'placed_at' => optional($order->placed_at)->toIso8601String(),
                'customer' => [
                    'id' => $order->user_id,
                    'name' => optional($order->user)->name,
                    'email' => optional($order->user)->email,
                ],
            ];
        });

        return Inertia::render('Admin/OrdersIndex', [
            'orders' => $orders,
            'filters' => ['status' => $status ?: null],
        ]);
    }

    public function show(Order $order): Response
    {
        $this->authorize('view', $order);

        $order->load(['user', 'items.product', 'payments']);

        return Inertia::render('Admin/OrderShow', [
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
                'customer' => [
                    'id' => $order->user_id,
                    'name' => optional($order->user)->name,
                    'email' => optional($order->user)->email,
                ],
                'items' => $order->items->map(static function ($item): array {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product_name,
                        'quantity' => $item->quantity,
                        'unit_price_cents' => $item->unit_price_cents,
                        'line_total_cents' => $item->line_total_cents,
                    ];
                })->values(),
            ],
        ]);
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $this->authorize('update', $order);

        $validated = $request->validate([
            'status' => ['required', 'in:pending,paid,fulfilled,cancelled'],
        ]);

        $previousStatus = $order->status;

        $order->update([
            'status' => $validated['status'],
        ]);

        if ($previousStatus !== $order->status && $order->user) {
            $order->user->notify(new OrderStatusUpdatedNotification($order, $previousStatus));
        }

        $this->auditLog->record(
            event: 'admin.order.status_updated',
            actorId: $request->user()->id,
            entityType: 'order',
            entityId: $order->id,
            context: [
                'order_number' => $order->order_number,
                'previous_status' => $previousStatus,
                'new_status' => $order->status,
            ],
            request: $request,
        );

        return back()->with('success', "Order {$order->order_number} updated.");
    }
}
