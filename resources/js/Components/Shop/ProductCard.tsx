import { Link } from '@inertiajs/react';
import { formatMoney } from '@/lib/money';
import type { ShopProduct } from '@/types/shop';

export default function ProductCard({ product }: { product: ShopProduct }) {
    return (
        <Link
            href={route('products.show', product.slug)}
            className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
            <div className="overflow-hidden rounded-[1.75rem] bg-surface-lowest/95 shadow-none transition duration-300 hover:-translate-y-1 hover:shadow-ambient">
                <div className="relative -m-1 overflow-hidden rounded-lg">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt=""
                            className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                            loading="lazy"
                        />
                    ) : (
                        <div className="aspect-[3/4] w-full bg-surface-low" />
                    )}
                    <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2">
                        {product.is_new ? (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                                New in
                            </span>
                        ) : null}
                        {product.is_sold_out ? (
                            <span className="rounded-full bg-tertiary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                                Sold out
                            </span>
                        ) : null}
                    </div>
                </div>
                <div className="space-y-1 p-7">
                    {product.label ? (
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-on-surface/45">
                            {product.label}
                        </p>
                    ) : null}
                    <p className="font-display text-base font-semibold leading-snug text-on-surface">
                        {product.name}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                        {formatMoney(product.price_cents, product.currency)}
                    </p>
                </div>
            </div>
        </Link>
    );
}
