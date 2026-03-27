import ShopLayout from '@/Layouts/ShopLayout';
import { Link, router } from '@inertiajs/react';
import type { PageProps } from '@/types';
import type { CartLine } from '@/types/shop';
import { formatMoney } from '@/lib/money';

type CartProps = PageProps<{
    lines: CartLine[];
    subtotal_cents: number;
    tax_cents: number;
    shipping_cents: number;
    shipping_is_free: boolean;
    total_cents: number;
}>;

export default function Cart({
    lines,
    subtotal_cents,
    tax_cents,
    shipping_cents,
    shipping_is_free,
    total_cents,
}: CartProps) {
    const currency = lines[0]?.product.currency ?? 'USD';

    const updateQty = (productId: number, quantity: number) => {
        if (quantity < 1) {
            return;
        }
        router.patch(route('cart.update', productId), { quantity });
    };

    const remove = (productId: number) => {
        router.delete(route('cart.destroy', productId));
    };

    return (
        <ShopLayout title="Shopping bag" hideMobileNav>
            <div className="atelier-container py-8 sm:py-12">
                <h1 className="font-display text-3xl font-bold text-on-surface sm:text-4xl">
                    Shopping bag
                    <span className="ml-3 text-lg font-normal text-on-surface/45">
                        ({lines.reduce((n, l) => n + l.quantity, 0)} items)
                    </span>
                </h1>
            </div>

            <div className="atelier-container grid gap-8 pb-28 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-16">
                <div className="space-y-6">
                    {lines.length === 0 ? (
                        <div className="rounded-[2rem] bg-surface-low px-8 py-16 text-center">
                            <p className="text-on-surface/65">Your bag is empty.</p>
                            <Link
                                href={route('catalog')}
                                className="btn-primary mt-8 inline-flex"
                            >
                                Browse collections
                            </Link>
                        </div>
                    ) : (
                        lines.map((line) => (
                            <div
                                key={line.product_id}
                                className="flex flex-col gap-6 rounded-[1.5rem] bg-surface-lowest/95 p-6 sm:flex-row"
                            >
                                <Link
                                    href={route('products.show', line.product.slug)}
                                    className="shrink-0"
                                >
                                    {line.product.image_url ? (
                                        <img
                                            src={line.product.image_url}
                                            alt=""
                                            className="h-36 w-28 rounded-lg object-cover sm:h-40 sm:w-32"
                                        />
                                    ) : (
                                        <div className="h-36 w-28 rounded-lg bg-surface-low sm:h-40 sm:w-32" />
                                    )}
                                </Link>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <Link
                                                href={route('products.show', line.product.slug)}
                                                className="font-display text-lg font-semibold text-on-surface hover:text-primary"
                                            >
                                                {line.product.name}
                                            </Link>
                                            {line.product.label ? (
                                                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-on-surface/45">
                                                    {line.product.label}
                                                </p>
                                            ) : null}
                                        </div>
                                        <p className="text-sm font-semibold text-primary">
                                            {formatMoney(
                                                line.product.price_cents,
                                                line.product.currency,
                                            )}
                                        </p>
                                    </div>
                                    <div className="mt-6 flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-3 rounded-full bg-surface-low px-2 py-1">
                                            <button
                                                type="button"
                                                className="flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-surface-high"
                                                onClick={() =>
                                                    updateQty(
                                                        line.product_id,
                                                        line.quantity - 1,
                                                    )
                                                }
                                                aria-label="Decrease quantity"
                                            >
                                                −
                                            </button>
                                            <span className="min-w-8 text-center text-sm font-medium">
                                                {line.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                className="flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-surface-high"
                                                onClick={() =>
                                                    updateQty(
                                                        line.product_id,
                                                        line.quantity + 1,
                                                    )
                                                }
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            className="text-[11px] font-semibold uppercase tracking-widest text-on-surface/50 hover:text-tertiary"
                                            onClick={() => remove(line.product_id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
                    <div className="rounded-[2rem] bg-surface-lowest p-8 shadow-ambient">
                        <h2 className="font-display text-lg font-bold text-on-surface">
                            Order summary
                        </h2>
                        <dl className="mt-6 space-y-3 text-sm">
                            <div className="flex justify-between text-on-surface/70">
                                <dt>Subtotal</dt>
                                <dd className="font-medium text-on-surface">
                                    {formatMoney(subtotal_cents, currency)}
                                </dd>
                            </div>
                            <div className="flex justify-between text-on-surface/70">
                                <dt>Estimated tax</dt>
                                <dd className="font-medium text-on-surface">
                                    {formatMoney(tax_cents, currency)}
                                </dd>
                            </div>
                            <div className="flex justify-between text-on-surface/70">
                                <dt>Shipping</dt>
                                <dd
                                    className={`font-medium ${
                                        shipping_is_free ? 'text-tertiary' : 'text-on-surface'
                                    }`}
                                >
                                    {shipping_is_free
                                        ? 'Free'
                                        : formatMoney(shipping_cents, currency)}
                                </dd>
                            </div>
                            <div className="flex justify-between pt-6 text-base">
                                <dt className="font-semibold text-on-surface">Total</dt>
                                <dd className="text-xl font-bold text-primary">
                                    {formatMoney(total_cents, currency)}
                                </dd>
                            </div>
                        </dl>
                        <div className="mt-6">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface/45">
                                Promo code
                            </p>
                            <div className="mt-2 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    className="atelier-input mt-0 min-w-0 flex-1"
                                />
                                <button type="button" className="btn-secondary px-4">
                                    Apply
                                </button>
                            </div>
                        </div>
                        {lines.length === 0 ? (
                            <button type="button" className="btn-primary mt-8 w-full" disabled>
                                Proceed to checkout
                            </button>
                        ) : (
                            <Link
                                href={route('checkout.create')}
                                className="btn-primary mt-8 w-full"
                            >
                                Proceed to checkout
                            </Link>
                        )}
                        <p className="mt-4 text-center text-xs text-on-surface/45">
                            Complimentary returns within 30 days.
                        </p>
                    </div>
                </aside>
            </div>
            <div className="fixed inset-x-0 bottom-0 z-40 rounded-t-[1.5rem] bg-surface-lowest/95 px-4 py-4 backdrop-blur lg:hidden">
                <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="font-medium text-on-surface/70">Total</span>
                    <span className="font-display text-xl font-bold text-primary">
                        {formatMoney(total_cents, currency)}
                    </span>
                </div>
                {lines.length === 0 ? (
                    <button type="button" className="btn-primary w-full" disabled>
                        Proceed to checkout
                    </button>
                ) : (
                    <Link href={route('checkout.create')} className="btn-primary w-full">
                        Proceed to checkout
                    </Link>
                )}
            </div>
        </ShopLayout>
    );
}
