import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatMoney } from '@/lib/money';
import type { PageProps } from '@/types';
import type { LaravelPaginator } from '@/types/shop';
import { Head, Link, router } from '@inertiajs/react';

type AdminOrderRow = {
    id: number;
    order_number: string;
    status: string;
    total_cents: number;
    currency: string;
    placed_at: string | null;
    customer: {
        id: number;
        name: string | null;
        email: string | null;
    };
};

type AdminOrdersProps = PageProps<{
    orders: LaravelPaginator<AdminOrderRow>;
    filters: { status: string | null };
}>;

export default function AdminOrdersIndex({ orders, filters }: AdminOrdersProps) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Admin orders</h2>}
        >
            <Head title="Admin Orders" />
            <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                    <label className="text-sm text-gray-600">
                        Status filter
                        <select
                            value={filters.status ?? ''}
                            onChange={(e) =>
                                router.get(route('admin.orders.index'), { status: e.target.value || undefined })
                            }
                            className="ml-3 rounded border-gray-300 text-sm"
                        >
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="fulfilled">Fulfilled</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </label>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Order</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Customer</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.data.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-4 py-3">
                                        <Link
                                            href={route('admin.orders.show', order.id)}
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                        >
                                            {order.order_number}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {order.customer.name} ({order.customer.email})
                                    </td>
                                    <td className="px-4 py-3">{order.status}</td>
                                    <td className="px-4 py-3">
                                        {formatMoney(order.total_cents, order.currency)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

