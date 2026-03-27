<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class Product extends Model
{
    use Searchable;

    protected $fillable = [
        'category_id',
        'slug',
        'name',
        'label',
        'description',
        'price_cents',
        'currency',
        'image_url',
        'is_new',
        'is_sold_out',
        'stock_quantity',
    ];

    protected function casts(): array
    {
        return [
            'price_cents' => 'integer',
            'is_new' => 'boolean',
            'is_sold_out' => 'boolean',
            'stock_quantity' => 'integer',
        ];
    }

    /** @return BelongsTo<Category, $this> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function toShopSummary(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'label' => $this->label,
            'price_cents' => $this->price_cents,
            'currency' => $this->currency,
            'image_url' => $this->image_url,
            'is_new' => $this->is_new,
            'is_sold_out' => $this->is_sold_out,
            'category' => $this->relationLoaded('category') && $this->category
                ? [
                    'slug' => $this->category->slug,
                    'name' => $this->category->name,
                ]
                : null,
        ];
    }

    /** @return array<string, mixed> */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'label' => $this->label,
            'description' => $this->description,
        ];
    }
}
