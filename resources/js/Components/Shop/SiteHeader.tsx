import { Link, usePage } from '@inertiajs/react';

const nav = [
    { href: route('catalog'), label: 'Collections' },
    { href: route('home') + '#curation', label: 'Curation' },
];

export default function SiteHeader() {
    const page = usePage();
    const count = page.props.cart?.count ?? 0;
    const user = page.props.auth?.user;

    return (
        <header className="glass-nav sticky top-0 z-50">
            <div className="atelier-container flex items-center justify-between gap-6 py-4">
                <Link
                    href={route('home')}
                    className="font-display text-sm font-bold uppercase tracking-[0.24em] text-on-surface sm:text-base"
                >
                    Cardict Atelier
                </Link>
                <nav className="hidden items-center gap-10 md:flex">
                    {nav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-medium text-on-surface/70 transition hover:text-primary"
                        >
                            {item.label}
                        </Link>
                    ))}
                    {user ? (
                        <Link
                            href={route('orders.index')}
                            className="text-sm font-medium text-on-surface/70 transition hover:text-primary"
                        >
                            Orders
                        </Link>
                    ) : null}
                    {user ? (
                        <Link
                            href={route('live-chat.index')}
                            className="text-sm font-medium text-on-surface/70 transition hover:text-primary"
                        >
                            Live Chat
                        </Link>
                    ) : null}
                    {user?.is_admin ? (
                        <Link
                            href={route('admin.orders.index')}
                            className="text-sm font-medium text-on-surface/70 transition hover:text-primary"
                        >
                            Admin
                        </Link>
                    ) : null}
                </nav>
                <div className="flex items-center gap-6">
                    <Link
                        href={route('catalog')}
                        className="rounded-full bg-surface-low/70 px-4 py-2 text-sm font-medium text-on-surface/70 md:hidden"
                    >
                        Shop
                    </Link>
                    <Link
                        href={route('cart.index')}
                        className="relative rounded-full bg-surface-low/70 px-4 py-2 text-sm font-semibold text-on-surface"
                    >
                        Bag
                        {count > 0 ? (
                            <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                                {count > 99 ? '99+' : count}
                            </span>
                        ) : null}
                    </Link>
                </div>
            </div>
        </header>
    );
}
