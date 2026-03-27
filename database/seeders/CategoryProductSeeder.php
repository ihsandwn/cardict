<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class CategoryProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['slug' => 'apparel', 'name' => 'Apparel', 'sort_order' => 10],
            ['slug' => 'accessories', 'name' => 'Accessories', 'sort_order' => 20],
            ['slug' => 'footwear', 'name' => 'Footwear', 'sort_order' => 30],
            ['slug' => 'knitwear', 'name' => 'Knitwear', 'sort_order' => 40],
        ];

        $categoryIds = [];
        foreach ($categories as $row) {
            $category = Category::query()->updateOrCreate(
                ['slug' => $row['slug']],
                ['name' => $row['name'], 'sort_order' => $row['sort_order']],
            );
            $categoryIds[$row['slug']] = $category->id;
        }

        $items = [
            [
                'slug' => 'kinetic-silk-overcoat',
                'category' => 'apparel',
                'name' => 'Kinetic Silk Overcoat',
                'label' => 'Technical outerwear',
                'description' => 'A fluid silhouette cut from weighted silk-blend with concealed placket and engineered articulation through the sleeve.',
                'price_cents' => 845_00,
                'image_url' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
                'is_new' => true,
                'is_sold_out' => false,
            ],
            [
                'slug' => 'aero-kinetic-parka',
                'category' => 'apparel',
                'name' => 'Aero-Kinetic Parka',
                'label' => 'Winter atelier',
                'description' => 'Modular thermal lining, storm cuffs, and a sculpted hood for city-to-alpine transitions.',
                'price_cents' => 920_00,
                'image_url' => 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80',
                'is_new' => true,
                'is_sold_out' => false,
            ],
            [
                'slug' => 'kinetic-shield-01',
                'category' => 'apparel',
                'name' => 'Kinetic Shield-01',
                'label' => 'Technical outerwear',
                'description' => 'Ripstop shell with bonded seams and magnetic closure points for a quiet, precise fit.',
                'price_cents' => 1100_00,
                'image_url' => 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=80',
                'is_new' => false,
                'is_sold_out' => true,
            ],
            [
                'slug' => 'stride-v2-footwear',
                'category' => 'footwear',
                'name' => 'Stride V2',
                'label' => 'Continental gum sole',
                'description' => 'Light-strike midsole, calfskin lining, and asymmetric lacing for a tuned stride.',
                'price_cents' => 420_00,
                'image_url' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
                'is_new' => false,
                'is_sold_out' => false,
            ],
            [
                'slug' => 'linear-suede-sneaker',
                'category' => 'footwear',
                'name' => 'Linear Suede Sneaker',
                'label' => 'Atelier selects',
                'description' => 'Hand-burnished suede with micro-perforated toe box and memory foam footbed.',
                'price_cents' => 395_00,
                'image_url' => 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80',
                'is_new' => true,
                'is_sold_out' => false,
            ],
            [
                'slug' => 'tension-commuter-bag',
                'category' => 'accessories',
                'name' => 'Tension Commuter Bag',
                'label' => 'Carry',
                'description' => 'Sculpted cylinder form with magnetic snap bridge and interior laptop sleeve.',
                'price_cents' => 560_00,
                'image_url' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
                'is_new' => false,
                'is_sold_out' => false,
            ],
            [
                'slug' => 'kinetic-leather-carryall',
                'category' => 'accessories',
                'name' => 'Kinetic Leather Carryall',
                'label' => 'Carry',
                'description' => 'Vegetable-tanned leather with floating pocket wall and matte gunmetal hardware.',
                'price_cents' => 780_00,
                'image_url' => 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
                'is_new' => false,
                'is_sold_out' => false,
            ],
            [
                'slug' => 'midnight-merino-crew',
                'category' => 'knitwear',
                'name' => 'Midnight Merino Crew',
                'label' => 'Knit studio',
                'description' => 'Ribbed collar, saddle shoulder, and traceable merino with natural stretch recovery.',
                'price_cents' => 285_00,
                'image_url' => 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80',
                'is_new' => false,
                'is_sold_out' => false,
            ],
            [
                'slug' => 'architectural-technical-blazer',
                'category' => 'apparel',
                'name' => 'Architectural Technical Blazer',
                'label' => 'New arrival',
                'description' => 'Soft-structured shoulder, hidden stretch vents, and interior phone slip with cable pass-through.',
                'price_cents' => 845_00,
                'image_url' => 'https://images.unsplash.com/photo-1594938298603-c8148c407dae?auto=format&fit=crop&w=900&q=80',
                'is_new' => true,
                'is_sold_out' => false,
            ],
            [
                'slug' => 'kinetic-oversized-trench',
                'category' => 'apparel',
                'name' => 'Kinetic Oversized Trench',
                'label' => 'Atelier series — stone',
                'description' => 'Water-repellent cotton twill with exaggerated storm flap and tonal belt hardware.',
                'price_cents' => 890_00,
                'image_url' => 'https://images.unsplash.com/photo-1594938291221-94c7f3a098a3?auto=format&fit=crop&w=900&q=80',
                'is_new' => false,
                'is_sold_out' => false,
            ],
            [
                'slug' => 'obsidian-run-trainer',
                'category' => 'footwear',
                'name' => 'Obsidian Run Trainer',
                'label' => 'Performance line',
                'description' => 'Engineered mesh with fused overlays and a dual-density outsole mapped for urban pacing.',
                'price_cents' => 340_00,
                'image_url' => 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&q=80',
                'is_new' => false,
                'is_sold_out' => false,
            ],
            [
                'slug' => 'signal-frame-eyewear',
                'category' => 'accessories',
                'name' => 'Signal Frame Eyewear',
                'label' => 'Optics',
                'description' => 'Beta-titanium temples with liquid ceramic lenses tuned for clarity at golden hour.',
                'price_cents' => 325_00,
                'image_url' => 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80',
                'is_new' => true,
                'is_sold_out' => false,
            ],
        ];

        foreach ($items as $item) {
            Product::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'category_id' => $categoryIds[$item['category']],
                    'name' => $item['name'],
                    'label' => $item['label'],
                    'description' => $item['description'],
                    'price_cents' => $item['price_cents'],
                    'currency' => 'USD',
                    'image_url' => $item['image_url'],
                    'is_new' => $item['is_new'],
                    'is_sold_out' => $item['is_sold_out'],
                    'stock_quantity' => $item['is_sold_out'] ? 0 : 20,
                ],
            );
        }
    }
}
