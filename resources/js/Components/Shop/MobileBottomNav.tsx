import { Link, usePage } from '@inertiajs/react';

const items = [
    { href: route('home'), label: 'Home', icon: 'home', authOnly: false },
    { href: route('catalog'), label: 'Shop', icon: 'grid_view', authOnly: false },
    { href: route('orders.index'), label: 'Orders', icon: 'receipt_long', authOnly: true },
    { href: route('cart.index'), label: 'Bag', icon: 'shopping_bag', authOnly: false },
] as const;

export default function MobileBottomNav() {
    const page = usePage();
    const user = page.props.auth?.user;
    const count = page.props.cart?.count ?? 0;
    const currentUrl = page.url ?? '/';

    return (
        <nav className="fixed inset-x-0 bottom-0 z-30 rounded-t-[1.5rem] bg-surface-lowest/90 px-5 py-3 backdrop-blur lg:hidden">
            <div className="mx-auto flex max-w-md items-center justify-between">
                {items
                    .filter((item) => !item.authOnly || user)
                    .map((item) => {
                        const isActive =
                            (item.label === 'Home' && currentUrl === '/') ||
                            (item.label === 'Shop' && currentUrl.startsWith('/catalog')) ||
                            (item.label === 'Orders' && currentUrl.startsWith('/orders')) ||
                            (item.label === 'Bag' && currentUrl.startsWith('/cart'));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative flex h-11 w-11 items-center justify-center rounded-full transition ${
                                    isActive
                                        ? 'bg-primary text-white'
                                        : 'bg-surface-low text-on-surface/70'
                                }`}
                                aria-label={item.label}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {item.icon}
                                </span>
                                {item.label === 'Bag' && count > 0 ? (
                                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-tertiary px-1 text-[9px] font-bold text-white">
                                        {count > 9 ? '9+' : count}
                                    </span>
                                ) : null}
                            </Link>
                        );
                    })}
            </div>
        </nav>
    );
}

