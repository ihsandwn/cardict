import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatMoney } from '@/lib/money';
import type { PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';

type AdminOrderDetail = {
    id: number;
    order_number: string;
    status: string;
    currency: string;
    subtotal_cents: number;
    tax_cents: number;
    shipping_cents: number;
    total_cents: number;
    placed_at: string | null;
    customer: {
        id: number;
        name: string | null;
        email: string | null;
    };
    items: Array<{
        id: number;
        product_name: string;
        quantity: number;
        unit_price_cents: number;
        line_total_cents: number;
    }>;
};

type AdminOrderShowProps = PageProps<{ order: AdminOrderDetail }>;

export default function AdminOrderShow({ order }: AdminOrderShowProps) {
    const form = useForm({
        status: order.status,
    });

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Order detail</h2>}
        >
            <Head title={`Admin ${order.order_number}`} />
            <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">{order.order_number}</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                        {order.customer.name} ({order.customer.email})
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                        {order.placed_at ? new Date(order.placed_at).toLocaleString() : 'N/A'}
                    </p>

                    <form
                        className="mt-4 flex items-center gap-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.patch(route('admin.orders.update', order.id));
                        }}
                    >
                        <select
                            value={form.data.status}
                            onChange={(e) => form.setData('status', e.target.value)}
                            className="rounded border-gray-300 text-sm"
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="fulfilled">Fulfilled</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <button type="submit" className="rounded bg-indigo-600 px-3 py-2 text-sm text-white">
                            Update status
                        </button>
                    </form>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h3 className="text-base font-semibold text-gray-900">Items</h3>
                    <div className="mt-4 space-y-3">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <p className="text-gray-700">
                                    {item.product_name} x {item.quantity}
                                </p>
                                <p className="font-medium text-gray-900">
                                    {formatMoney(item.line_total_cents, order.currency)}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5 space-y-1 border-t border-gray-100 pt-4 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatMoney(order.subtotal_cents, order.currency)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax</span>
                            <span>{formatMoney(order.tax_cents, order.currency)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>{formatMoney(order.shipping_cents, order.currency)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-gray-900">
                            <span>Total</span>
                            <span>{formatMoney(order.total_cents, order.currency)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

