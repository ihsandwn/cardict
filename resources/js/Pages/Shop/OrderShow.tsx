import ShopLayout from '@/Layouts/ShopLayout';
import { formatMoney } from '@/lib/money';
import type { PageProps } from '@/types';
import type { OrderSummary } from '@/types/shop';
import { Link } from '@inertiajs/react';

type OrderShowProps = PageProps<{
    order: OrderSummary;
}>;

export default function OrderShow({ order }: OrderShowProps) {
    return (
        <ShopLayout title={`Order ${order.order_number}`}>
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="rounded-xl bg-surface-lowest p-8 shadow-ambient">
                    <p className="text-xs uppercase tracking-[0.3em] text-on-surface/45">
                        Order confirmed
                    </p>
                    <h1 className="font-display mt-3 text-3xl font-bold text-on-surface">
                        {order.order_number}
                    </h1>
                    <p className="mt-2 text-sm text-on-surface/65">
                        Status: {order.status}
                    </p>
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-2">
                    <section className="rounded-xl bg-surface-lowest p-8">
                        <h2 className="font-display text-xl font-semibold">Items</h2>
                        <div className="mt-6 space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-start justify-between gap-4">
                                    <div>
                                        {item.product_slug ? (
                                            <Link
                                                href={route('products.show', item.product_slug)}
                                                className="font-medium text-on-surface hover:text-primary"
                                            >
                                                {item.product_name}
                                            </Link>
                                        ) : (
                                            <p className="font-medium text-on-surface">{item.product_name}</p>
                                        )}
                                        <p className="text-xs text-on-surface/50">
                                            Qty {item.quantity} x{' '}
                                            {formatMoney(item.unit_price_cents, order.currency)}
                                        </p>
                                    </div>
                                    <p className="font-semibold text-primary">
                                        {formatMoney(item.line_total_cents, order.currency)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="rounded-xl bg-surface-lowest p-8">
                            <h2 className="font-display text-xl font-semibold">Shipping</h2>
                            <p className="mt-4 text-sm text-on-surface/70">
                                {order.shipping.name}
                                <br />
                                {order.shipping.phone}
                                <br />
                                {order.shipping.address_line1}
                                {order.shipping.address_line2 ? (
                                    <>
                                        <br />
                                        {order.shipping.address_line2}
                                    </>
                                ) : null}
                                <br />
                                {order.shipping.city}
                                {order.shipping.state ? `, ${order.shipping.state}` : ''}{' '}
                                {order.shipping.postal_code}
                                <br />
                                {order.shipping.country}
                            </p>
                        </div>
                        <div className="rounded-xl bg-surface-lowest p-8">
                            <h2 className="font-display text-xl font-semibold">Totals</h2>
                            <dl className="mt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-on-surface/70">
                                    <dt>Subtotal</dt>
                                    <dd>{formatMoney(order.subtotal_cents, order.currency)}</dd>
                                </div>
                                <div className="flex justify-between text-on-surface/70">
                                    <dt>Tax</dt>
                                    <dd>{formatMoney(order.tax_cents, order.currency)}</dd>
                                </div>
                                <div className="flex justify-between text-on-surface/70">
                                    <dt>Shipping</dt>
                                    <dd>{formatMoney(order.shipping_cents, order.currency)}</dd>
                                </div>
                                <div className="flex justify-between pt-3 text-base font-bold text-primary">
                                    <dt>Total</dt>
                                    <dd>{formatMoney(order.total_cents, order.currency)}</dd>
                                </div>
                            </dl>
                        </div>
                    </section>
                </div>
            </div>
        </ShopLayout>
    );
}

