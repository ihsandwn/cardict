<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\StoreCartItemRequest;
use App\Http\Requests\Shop\UpdateCartItemRequest;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(
        private readonly CartService $cart,
    ) {}

    public function index(): Response
    {
        $lines = $this->cart->linesWithProducts(request());
        $subtotal = $this->cart->subtotalCents(request());

        $taxCents = (int) round($subtotal * 0.08);
        $shippingCents = 0;
        $totalCents = $subtotal + $taxCents + $shippingCents;

        return Inertia::render('Shop/Cart', [
            'lines' => $lines,
            'subtotal_cents' => $subtotal,
            'tax_cents' => $taxCents,
            'shipping_cents' => $shippingCents,
            'shipping_is_free' => true,
            'total_cents' => $totalCents,
        ]);
    }

    public function store(StoreCartItemRequest $request): RedirectResponse
    {
        $product = Product::query()->findOrFail((int) $request->validated('product_id'));

        if ($product->is_sold_out) {
            return back()->with('error', 'This piece is sold out.');
        }

        $this->cart->add(
            $request,
            $product->id,
            (int) $request->validated('quantity'),
        );

        return back()->with('success', 'Added to your bag.');
    }

    public function update(UpdateCartItemRequest $request, Product $product): RedirectResponse
    {
        $this->cart->update(
            $request,
            $product->id,
            (int) $request->validated('quantity'),
        );

        return back();
    }

    public function destroy(Request $request, Product $product): RedirectResponse
    {
        $this->cart->remove($request, $product->id);

        return back();
    }
}
