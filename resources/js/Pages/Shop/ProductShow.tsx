import ProductCard from '@/Components/Shop/ProductCard';
import ShopLayout from '@/Layouts/ShopLayout';
import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import type { PageProps } from '@/types';
import type { ShopProduct, ShopProductDetail } from '@/types/shop';
import { formatMoney } from '@/lib/money';

type ProductShowProps = PageProps<{
    product: ShopProductDetail;
    relatedProducts: ShopProduct[];
}>;

export default function ProductShow({ product, relatedProducts }: ProductShowProps) {
    const form = useForm({
        product_id: product.id,
        quantity: 1,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.post(route('cart.store'));
    };

    return (
        <ShopLayout title={product.name} hideMobileNav>
            <div className="atelier-container py-8 sm:py-12">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                    <div className="space-y-4 lg:sticky lg:top-32 lg:self-start">
                        <div className="relative overflow-hidden rounded-[2rem] bg-surface-low">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt=""
                                    className="aspect-[3/4] w-full object-cover"
                                />
                            ) : null}
                            {product.is_new ? (
                                <span className="absolute left-4 top-4 rounded-full bg-tertiary px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                                    New in
                                </span>
                            ) : null}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="overflow-hidden rounded-[1.25rem] bg-surface-low">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt=""
                                        className="aspect-[4/5] w-full object-cover"
                                    />
                                ) : null}
                            </div>
                            <div className="translate-y-8 overflow-hidden rounded-[1.25rem] bg-surface-low">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt=""
                                        className="aspect-[4/5] w-full object-cover"
                                    />
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className="pb-28 lg:pb-0">
                        {product.category ? (
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-on-surface/45">
                                {product.category.name}
                            </p>
                        ) : null}
                        <h1 className="font-display mt-3 text-3xl font-bold uppercase tracking-tight text-on-surface sm:text-4xl">
                            {product.name}
                        </h1>
                        <p className="mt-4 text-2xl font-semibold text-primary">
                            {formatMoney(product.price_cents, product.currency)}
                        </p>
                        {product.description ? (
                            <p className="mt-8 text-sm leading-relaxed text-on-surface/70">
                                {product.description}
                            </p>
                        ) : null}

                        {product.is_sold_out ? (
                            <p className="mt-10 text-sm font-semibold text-tertiary">
                                Currently unavailable
                            </p>
                        ) : (
                            <form onSubmit={submit} className="mt-10 space-y-6">
                                <div className="flex flex-wrap items-end gap-4">
                                    <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface/50">
                                        Quantity
                                        <input
                                            type="number"
                                            min={1}
                                            max={99}
                                            value={form.data.quantity}
                                            onChange={(e) =>
                                                form.setData(
                                                    'quantity',
                                                    Number.parseInt(e.target.value, 10) || 1,
                                                )
                                            }
                                            className="atelier-input mt-2 block w-24 rounded-xl px-3 py-2"
                                        />
                                    </label>
                                </div>
                                <div className="hidden flex-wrap gap-4 lg:flex">
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={form.processing}
                                    >
                                        Add to bag
                                    </button>
                                    <button type="button" className="btn-secondary">
                                        Add to wishlist
                                    </button>
                                </div>
                            </form>
                        )}
                        <div className="mt-10 divide-y divide-on-surface/10 border-y border-on-surface/10">
                            <details className="group py-4">
                                <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-widest">
                                    Sustainability & origin
                                </summary>
                                <p className="mt-3 text-sm text-on-surface/70">
                                    Ethically sourced materials and low-impact production flow.
                                </p>
                            </details>
                            <details className="group py-4">
                                <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-widest">
                                    Details & care
                                </summary>
                                <p className="mt-3 text-sm text-on-surface/70">
                                    Professional care recommended for longest product lifecycle.
                                </p>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
            {!product.is_sold_out ? (
                <div className="fixed inset-x-0 bottom-0 z-40 bg-surface-lowest/90 px-4 py-4 backdrop-blur lg:hidden">
                    <button
                        type="button"
                        className="btn-primary w-full"
                        onClick={() => form.post(route('cart.store'))}
                        disabled={form.processing}
                    >
                        Add to bag
                    </button>
                </div>
            ) : null}

            {relatedProducts.length > 0 ? (
                <section className="atelier-section bg-surface-low/80">
                    <div className="atelier-container">
                        <h2 className="font-display text-2xl font-bold text-on-surface">
                            Complete the look
                        </h2>
                        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}
        </ShopLayout>
    );
}
