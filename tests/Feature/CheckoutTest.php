<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Notifications\OrderPlacedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_checkout_requires_authentication(): void
    {
        $response = $this->get(route('checkout.create'));

        $response->assertRedirect(route('login'));
    }

    public function test_user_can_place_order_from_cart(): void
    {
        Notification::fake();

        $user = User::factory()->create();
        $category = Category::query()->create([
            'slug' => 'test-cat',
            'name' => 'Test',
            'sort_order' => 1,
        ]);
        $product = Product::query()->create([
            'category_id' => $category->id,
            'slug' => 'test-product',
            'name' => 'Test Product',
            'price_cents' => 15000,
            'currency' => 'USD',
            'is_new' => false,
            'is_sold_out' => false,
            'stock_quantity' => 10,
        ]);

        $this->actingAs($user)
            ->withSession([
                'cart.lines' => [
                    ['product_id' => $product->id, 'quantity' => 2],
                ],
            ])
            ->post(route('checkout.store'), [
                'shipping_name' => 'Jane Doe',
                'shipping_phone' => '08123456789',
                'shipping_address_line1' => 'Jl. Merdeka 1',
                'shipping_city' => 'Bandung',
                'shipping_postal_code' => '40111',
                'shipping_country' => 'ID',
                'payment_method' => 'manual_test',
                'idempotency_key' => 'test-checkout-1',
            ])
            ->assertRedirect();

        $order = Order::query()->first();

        $this->assertNotNull($order);
        $this->assertSame($user->id, $order->user_id);
        $this->assertSame(30000, $order->subtotal_cents);
        $this->assertSame(32400, $order->total_cents);
        $this->assertCount(1, $order->items);

        $this->assertSame(8, $product->fresh()->stock_quantity);
        Notification::assertSentTo($user, OrderPlacedNotification::class);
        $this->assertDatabaseHas('audit_logs', [
            'event' => 'checkout.order.placed',
            'entity_id' => $order->id,
        ]);
    }

    public function test_user_cannot_view_other_users_order(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $order = Order::query()->create([
            'user_id' => $userA->id,
            'order_number' => 'AK-TEST-000001',
            'status' => Order::STATUS_PENDING,
            'currency' => 'USD',
            'subtotal_cents' => 10000,
            'tax_cents' => 800,
            'shipping_cents' => 0,
            'total_cents' => 10800,
            'payment_method' => 'manual_test',
            'shipping_name' => 'A',
            'shipping_phone' => '1',
            'shipping_address_line1' => 'X',
            'shipping_city' => 'Y',
            'shipping_postal_code' => '1',
            'shipping_country' => 'ID',
            'idempotency_key' => 'policy-order-1',
            'placed_at' => now(),
        ]);

        $this->actingAs($userB)
            ->get(route('orders.show', $order))
            ->assertForbidden();
    }
}
