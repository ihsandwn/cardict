<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(Product $product): Response
    {
        $product->load('category');

        $related = Product::query()
            ->with('category')
            ->where('category_id', $product->category_id)
            ->whereKeyNot($product->getKey())
            ->limit(4)
            ->get()
            ->map(static fn (Product $p) => $p->toShopSummary());

        return Inertia::render('Shop/ProductShow', [
            'product' => array_merge($product->toShopSummary(), [
                'description' => $product->description,
            ]),
            'relatedProducts' => $related,
        ]);
    }
}
