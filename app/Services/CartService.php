<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class CartService
{
    private const SESSION_KEY = 'cart.lines';

    /** @return list<array{product_id: int, quantity: int}> */
    public function lines(Request $request): array
    {
        return $request->session()->get(self::SESSION_KEY, []);
    }

    public function count(Request $request): int
    {
        return collect($this->lines($request))->sum('quantity');
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function linesWithProducts(Request $request): Collection
    {
        $lines = $this->lines($request);
        if ($lines === []) {
            return collect();
        }

        $ids = array_column($lines, 'product_id');
        $products = Product::query()->whereIn('id', $ids)->get()->keyBy('id');

        return collect($lines)->map(function (array $line) use ($products) {
            $product = $products->get($line['product_id']);
            if ($product === null) {
                return null;
            }

            return [
                'product_id' => (int) $product->id,
                'quantity' => (int) $line['quantity'],
                'product' => [
                    'id' => $product->id,
                    'slug' => $product->slug,
                    'name' => $product->name,
                    'label' => $product->label,
                    'price_cents' => $product->price_cents,
                    'currency' => $product->currency,
                    'image_url' => $product->image_url,
                    'is_sold_out' => $product->is_sold_out,
                ],
                'line_total_cents' => $product->price_cents * (int) $line['quantity'],
            ];
        })->filter()->values();
    }

    public function subtotalCents(Request $request): int
    {
        return (int) $this->linesWithProducts($request)->sum('line_total_cents');
    }

    public function add(Request $request, int $productId, int $quantity): void
    {
        $lines = $this->lines($request);
        $found = false;

        foreach ($lines as &$line) {
            if ((int) $line['product_id'] === $productId) {
                $line['quantity'] = (int) $line['quantity'] + $quantity;
                $found = true;

                break;
            }
        }
        unset($line);

        if (! $found) {
            $lines[] = ['product_id' => $productId, 'quantity' => $quantity];
        }

        $request->session()->put(self::SESSION_KEY, $lines);
    }

    public function update(Request $request, int $productId, int $quantity): void
    {
        $lines = $this->lines($request);

        if ($quantity < 1) {
            $this->remove($request, $productId);

            return;
        }

        foreach ($lines as &$line) {
            if ((int) $line['product_id'] === $productId) {
                $line['quantity'] = $quantity;
                break;
            }
        }
        unset($line);

        $request->session()->put(self::SESSION_KEY, $lines);
    }

    public function remove(Request $request, int $productId): void
    {
        $lines = array_values(array_filter(
            $this->lines($request),
            static fn (array $line): bool => (int) $line['product_id'] !== $productId,
        ));

        $request->session()->put(self::SESSION_KEY, $lines);
    }

    public function clear(Request $request): void
    {
        $request->session()->forget(self::SESSION_KEY);
    }
}
