import ShopLayout from '@/Layouts/ShopLayout';
import { formatMoney } from '@/lib/money';
import type { PageProps } from '@/types';
import type { LaravelPaginator } from '@/types/shop';
import { Link } from '@inertiajs/react';

type OrderListItem = {
    id: number;
    order_number: string;
    status: string;
    currency: string;
    total_cents: number;
    placed_at: string | null;
    items_count: number;
};

type OrdersIndexProps = PageProps<{
    orders: LaravelPaginator<OrderListItem>;
}>;

export default function OrdersIndex({ orders }: OrdersIndexProps) {
    return (
        <ShopLayout title="Your orders">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="font-display text-4xl font-bold text-on-surface">Your orders</h1>
                <p className="mt-3 text-sm text-on-surface/65">Track every placed order and its status.</p>

                <div className="mt-8 space-y-4">
                    {orders.data.length === 0 ? (
                        <div className="rounded-xl bg-surface-low p-8 text-sm text-on-surface/70">
                            No orders yet.
                        </div>
                    ) : (
                        orders.data.map((order) => (
                            <Link
                                key={order.id}
                                href={route('orders.show', order.id)}
                                className="block rounded-xl bg-surface-lowest p-6 transition hover:shadow-ambient"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="font-display text-lg font-semibold text-on-surface">
                                        {order.order_number}
                                    </p>
                                    <span className="chip-muted">{order.status}</span>
                                </div>
                                <p className="mt-2 text-xs text-on-surface/50">
                                    {order.items_count} item(s)
                                    {order.placed_at ? ` • ${new Date(order.placed_at).toLocaleString()}` : ''}
                                </p>
                                <p className="mt-3 text-sm font-semibold text-primary">
                                    {formatMoney(order.total_cents, order.currency)}
                                </p>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </ShopLayout>
    );
}

