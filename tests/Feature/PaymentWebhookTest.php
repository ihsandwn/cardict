<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentWebhookTest extends TestCase
{
    use RefreshDatabase;

    public function test_webhook_rejects_invalid_signature(): void
    {
        $response = $this->postJson(route('webhooks.payments.manual_test'), [
            'provider_reference' => 'manual-AK-1',
            'status' => 'captured',
        ]);

        $response->assertUnauthorized();
        $this->assertDatabaseHas('audit_logs', [
            'event' => 'payment.webhook.invalid_signature',
        ]);
    }

    public function test_webhook_updates_payment_and_order_status_idempotently(): void
    {
        $user = User::factory()->create();
        $order = Order::query()->create([
            'user_id' => $user->id,
            'order_number' => 'AK-TEST-100001',
            'status' => Order::STATUS_PENDING,
            'currency' => 'USD',
            'subtotal_cents' => 10000,
            'tax_cents' => 800,
            'shipping_cents' => 0,
            'total_cents' => 10800,
            'payment_method' => 'manual_test',
            'shipping_name' => 'Jane Doe',
            'shipping_phone' => '081234',
            'shipping_address_line1' => 'Jl. Example',
            'shipping_city' => 'Bandung',
            'shipping_postal_code' => '40111',
            'shipping_country' => 'ID',
            'idempotency_key' => 'webhook-order-1',
            'placed_at' => now(),
        ]);

        Payment::query()->create([
            'order_id' => $order->id,
            'provider' => 'manual_test',
            'provider_reference' => 'manual-'.$order->order_number,
            'status' => Payment::STATUS_AUTHORIZED,
            'amount_cents' => 10800,
            'currency' => 'USD',
            'paid_at' => now(),
        ]);

        $payload = [
            'provider_reference' => 'manual-'.$order->order_number,
            'status' => Payment::STATUS_CAPTURED,
        ];
        $rawPayload = json_encode($payload, JSON_THROW_ON_ERROR);
        $signature = hash_hmac('sha256', $rawPayload, config('services.manual_payment.webhook_secret'));

        $this->call(
            'POST',
            route('webhooks.payments.manual_test'),
            [],
            [],
            [],
            [
                'HTTP_X_PAYMENT_SIGNATURE' => $signature,
                'CONTENT_TYPE' => 'application/json',
            ],
            $rawPayload,
        )->assertOk();

        $this->call(
            'POST',
            route('webhooks.payments.manual_test'),
            [],
            [],
            [],
            [
                'HTTP_X_PAYMENT_SIGNATURE' => $signature,
                'CONTENT_TYPE' => 'application/json',
            ],
            $rawPayload,
        )->assertOk();

        $this->assertSame(Order::STATUS_PAID, $order->fresh()->status);
        $this->assertSame(Payment::STATUS_CAPTURED, $order->payments()->first()->status);
        $this->assertDatabaseHas('audit_logs', [
            'event' => 'payment.webhook.processed',
            'entity_id' => $order->id,
        ]);
    }

    public function test_failed_webhook_restores_stock_once(): void
    {
        $user = User::factory()->create();
        $category = Category::query()->create([
            'slug' => 'webhook-cat',
            'name' => 'Webhook',
            'sort_order' => 1,
        ]);
        $product = Product::query()->create([
            'category_id' => $category->id,
            'slug' => 'webhook-product',
            'name' => 'Webhook Product',
            'price_cents' => 10000,
            'currency' => 'USD',
            'is_new' => false,
            'is_sold_out' => false,
            'stock_quantity' => 8,
        ]);
        $order = Order::query()->create([
            'user_id' => $user->id,
            'order_number' => 'AK-TEST-100002',
            'status' => Order::STATUS_PENDING,
            'currency' => 'USD',
            'subtotal_cents' => 20000,
            'tax_cents' => 1600,
            'shipping_cents' => 0,
            'total_cents' => 21600,
            'payment_method' => 'manual_test',
            'shipping_name' => 'Jane Doe',
            'shipping_phone' => '081234',
            'shipping_address_line1' => 'Jl. Example',
            'shipping_city' => 'Bandung',
            'shipping_postal_code' => '40111',
            'shipping_country' => 'ID',
            'idempotency_key' => 'webhook-order-2',
            'placed_at' => now(),
        ]);
        OrderItem::query()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'unit_price_cents' => 10000,
            'quantity' => 2,
            'line_total_cents' => 20000,
        ]);
        Payment::query()->create([
            'order_id' => $order->id,
            'provider' => 'manual_test',
            'provider_reference' => 'manual-'.$order->order_number,
            'status' => Payment::STATUS_AUTHORIZED,
            'amount_cents' => 21600,
            'currency' => 'USD',
            'paid_at' => now(),
        ]);

        $payload = [
            'provider_reference' => 'manual-'.$order->order_number,
            'status' => Payment::STATUS_FAILED,
        ];
        $rawPayload = json_encode($payload, JSON_THROW_ON_ERROR);
        $signature = hash_hmac('sha256', $rawPayload, config('services.manual_payment.webhook_secret'));

        $this->call(
            'POST',
            route('webhooks.payments.manual_test'),
            [],
            [],
            [],
            [
                'HTTP_X_PAYMENT_SIGNATURE' => $signature,
                'CONTENT_TYPE' => 'application/json',
            ],
            $rawPayload,
        )->assertOk();

        $this->call(
            'POST',
            route('webhooks.payments.manual_test'),
            [],
            [],
            [],
            [
                'HTTP_X_PAYMENT_SIGNATURE' => $signature,
                'CONTENT_TYPE' => 'application/json',
            ],
            $rawPayload,
        )->assertOk();

        $this->assertSame(10, $product->fresh()->stock_quantity);
    }
}
