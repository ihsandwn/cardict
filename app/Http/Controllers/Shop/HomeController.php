<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $categories = Category::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(static fn (Category $c) => $c->toShopSummary());

        $curationSlugs = [
            'kinetic-silk-overcoat',
            'stride-v2-footwear',
            'tension-commuter-bag',
        ];

        $curationBySlug = Product::query()
            ->with('category')
            ->whereIn('slug', $curationSlugs)
            ->get()
            ->keyBy('slug');

        $curationProducts = collect($curationSlugs)
            ->map(static fn (string $slug) => $curationBySlug->get($slug))
            ->filter()
            ->values()
            ->map(static fn (Product $p) => $p->toShopSummary());

        $featured = Product::query()
            ->with('category')
            ->where('is_sold_out', false)
            ->latest('id')
            ->limit(6)
            ->get()
            ->map(static fn (Product $p) => $p->toShopSummary());

        return Inertia::render('Shop/Home', [
            'categories' => $categories,
            'curationProducts' => $curationProducts,
            'featuredProducts' => $featured,
        ]);
    }
}
