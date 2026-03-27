import InputError from '@/Components/InputError';
import ShopLayout from '@/Layouts/ShopLayout';
import { formatMoney } from '@/lib/money';
import type { PageProps } from '@/types';
import type { CartLine, CheckoutUserPreview } from '@/types/shop';
import { useForm } from '@inertiajs/react';

type CheckoutProps = PageProps<{
    lines: CartLine[];
    subtotal_cents: number;
    idempotency_key: string;
    user: CheckoutUserPreview;
}>;

export default function Checkout({
    lines,
    subtotal_cents,
    idempotency_key,
    user,
}: CheckoutProps) {
    const currency = lines[0]?.product.currency ?? 'USD';
    const tax = Math.round(subtotal_cents * 0.08);
    const shipping = 0;
    const total = subtotal_cents + tax + shipping;

    const form = useForm({
        shipping_name: user.name ?? '',
        shipping_phone: '',
        shipping_address_line1: '',
        shipping_address_line2: '',
        shipping_city: '',
        shipping_state: '',
        shipping_postal_code: '',
        shipping_country: 'ID',
        payment_method: 'manual_test',
        idempotency_key,
    });

    return (
        <ShopLayout title="Checkout" hideMobileNav>
            <div className="atelier-container grid gap-8 py-8 lg:grid-cols-[1fr_minmax(0,24rem)] lg:gap-10 lg:py-12">
                <section className="pb-28 lg:pb-0">
                    <h1 className="font-display text-3xl font-bold text-on-surface sm:text-4xl">
                        Checkout
                    </h1>
                    <p className="mt-3 text-sm text-on-surface/65">
                        Secure placement with server-side validation and stock lock.
                    </p>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.post(route('checkout.store'));
                        }}
                        className="mt-10 grid gap-5 rounded-[2rem] bg-surface-lowest p-6 sm:grid-cols-2"
                    >
                        <label className="text-sm font-medium text-on-surface">
                            Full name
                            <input
                                className="atelier-input"
                                value={form.data.shipping_name}
                                onChange={(e) => form.setData('shipping_name', e.target.value)}
                            />
                            <InputError className="mt-2" message={form.errors.shipping_name} />
                        </label>
                        <label className="text-sm font-medium text-on-surface">
                            Phone
                            <input
                                className="atelier-input"
                                value={form.data.shipping_phone}
                                onChange={(e) => form.setData('shipping_phone', e.target.value)}
                            />
                            <InputError className="mt-2" message={form.errors.shipping_phone} />
                        </label>
                        <label className="text-sm font-medium text-on-surface sm:col-span-2">
                            Address line 1
                            <input
                                className="atelier-input"
                                value={form.data.shipping_address_line1}
                                onChange={(e) =>
                                    form.setData('shipping_address_line1', e.target.value)
                                }
                            />
                            <InputError
                                className="mt-2"
                                message={form.errors.shipping_address_line1}
                            />
                        </label>
                        <label className="text-sm font-medium text-on-surface sm:col-span-2">
                            Address line 2
                            <input
                                className="atelier-input"
                                value={form.data.shipping_address_line2}
                                onChange={(e) =>
                                    form.setData('shipping_address_line2', e.target.value)
                                }
                            />
                        </label>
                        <label className="text-sm font-medium text-on-surface">
                            City
                            <input
                                className="atelier-input"
                                value={form.data.shipping_city}
                                onChange={(e) => form.setData('shipping_city', e.target.value)}
                            />
                            <InputError className="mt-2" message={form.errors.shipping_city} />
                        </label>
                        <label className="text-sm font-medium text-on-surface">
                            State
                            <input
                                className="atelier-input"
                                value={form.data.shipping_state}
                                onChange={(e) => form.setData('shipping_state', e.target.value)}
                            />
                        </label>
                        <label className="text-sm font-medium text-on-surface">
                            Postal code
                            <input
                                className="atelier-input"
                                value={form.data.shipping_postal_code}
                                onChange={(e) =>
                                    form.setData('shipping_postal_code', e.target.value)
                                }
                            />
                            <InputError
                                className="mt-2"
                                message={form.errors.shipping_postal_code}
                            />
                        </label>
                        <label className="text-sm font-medium text-on-surface">
                            Country (ISO2)
                            <input
                                className="atelier-input uppercase"
                                value={form.data.shipping_country}
                                maxLength={2}
                                onChange={(e) =>
                                    form.setData('shipping_country', e.target.value.toUpperCase())
                                }
                            />
                            <InputError className="mt-2" message={form.errors.shipping_country} />
                        </label>
                        <div className="hidden sm:col-span-2 lg:block">
                            <button
                                type="submit"
                                className="btn-primary w-full"
                                disabled={form.processing || lines.length === 0}
                            >
                                Place order
                            </button>
                        </div>
                    </form>
                </section>

                <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
                    <div className="rounded-[2rem] bg-surface-lowest p-8 shadow-ambient">
                        <h2 className="font-display text-lg font-bold text-on-surface">
                            Summary
                        </h2>
                        <div className="mt-6 space-y-3 text-sm">
                            {lines.map((line) => (
                                <div key={line.product_id} className="flex justify-between gap-3">
                                    <p className="text-on-surface/70">
                                        {line.product.name} x {line.quantity}
                                    </p>
                                    <p className="font-medium text-on-surface">
                                        {formatMoney(line.line_total_cents, currency)}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <dl className="mt-8 space-y-2 text-sm">
                            <div className="flex justify-between text-on-surface/70">
                                <dt>Subtotal</dt>
                                <dd>{formatMoney(subtotal_cents, currency)}</dd>
                            </div>
                            <div className="flex justify-between text-on-surface/70">
                                <dt>Tax</dt>
                                <dd>{formatMoney(tax, currency)}</dd>
                            </div>
                            <div className="flex justify-between text-on-surface/70">
                                <dt>Shipping</dt>
                                <dd>Free</dd>
                            </div>
                            <div className="flex justify-between pt-4 text-base font-bold text-primary">
                                <dt>Total</dt>
                                <dd>{formatMoney(total, currency)}</dd>
                            </div>
                        </dl>
                    </div>
                </aside>
            </div>
            <div className="fixed inset-x-0 bottom-0 z-40 rounded-t-[1.5rem] bg-surface-lowest/95 px-4 py-4 backdrop-blur lg:hidden">
                <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="font-medium text-on-surface/70">Total</span>
                    <span className="font-display text-xl font-bold text-primary">
                        {formatMoney(total, currency)}
                    </span>
                </div>
                <button
                    type="button"
                    className="btn-primary w-full"
                    disabled={form.processing || lines.length === 0}
                    onClick={() => form.post(route('checkout.store'))}
                >
                    Place order
                </button>
            </div>
        </ShopLayout>
    );
}

