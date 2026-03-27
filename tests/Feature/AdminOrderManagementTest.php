<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use App\Notifications\OrderStatusUpdatedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AdminOrderManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_admin_orders(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);

        $this->actingAs($user)
            ->get(route('admin.orders.index'))
            ->assertForbidden();
    }

    public function test_admin_can_access_and_update_order_status(): void
    {
        Notification::fake();

        $admin = User::factory()->create([
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);
        $customer = User::factory()->create();

        $order = Order::query()->create([
            'user_id' => $customer->id,
            'order_number' => 'AK-ADMIN-000001',
            'status' => Order::STATUS_PENDING,
            'currency' => 'USD',
            'subtotal_cents' => 10000,
            'tax_cents' => 800,
            'shipping_cents' => 0,
            'total_cents' => 10800,
            'payment_method' => 'manual_test',
            'shipping_name' => 'John',
            'shipping_phone' => '081',
            'shipping_address_line1' => 'Jl. A',
            'shipping_city' => 'B',
            'shipping_postal_code' => '123',
            'shipping_country' => 'ID',
            'idempotency_key' => 'admin-order-1',
            'placed_at' => now(),
        ]);

        $this->actingAs($admin)
            ->get(route('admin.orders.index'))
            ->assertOk();

        $this->actingAs($admin)
            ->patch(route('admin.orders.update', $order), [
                'status' => Order::STATUS_FULFILLED,
            ])
            ->assertRedirect();

        $this->assertSame(Order::STATUS_FULFILLED, $order->fresh()->status);
        Notification::assertSentTo($customer, OrderStatusUpdatedNotification::class);
        $this->assertDatabaseHas('audit_logs', [
            'event' => 'admin.order.status_updated',
            'entity_id' => $order->id,
        ]);
    }
}
