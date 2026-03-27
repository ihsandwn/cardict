<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $validated = $request->validate([
            'category' => ['nullable', 'string', 'exists:categories,slug'],
            'sort' => ['nullable', 'in:newest,price_asc,price_desc'],
        ]);

        $categories = Category::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(static fn (Category $c) => $c->toShopSummary());

        $query = Product::query()->with('category');

        if (! empty($validated['category'])) {
            $query->whereHas('category', static fn ($q) => $q->where('slug', $validated['category']));
        }

        match ($validated['sort'] ?? 'newest') {
            'price_asc' => $query->orderBy('price_cents'),
            'price_desc' => $query->orderByDesc('price_cents'),
            default => $query->latest('id'),
        };

        $products = $query
            ->paginate(12)
            ->withQueryString()
            ->through(static fn (Product $p) => $p->toShopSummary());

        return Inertia::render('Shop/Catalog', [
            'categories' => $categories,
            'products' => $products,
            'filters' => [
                'category' => $validated['category'] ?? null,
                'sort' => $validated['sort'] ?? 'newest',
            ],
        ]);
    }
}
