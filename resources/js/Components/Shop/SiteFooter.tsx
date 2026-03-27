import { Link } from '@inertiajs/react';

const columns = [
    {
        title: 'Shop',
        links: [
            { href: route('catalog'), label: 'Collections' },
            { href: route('catalog', { category: 'apparel' }), label: 'Apparel' },
            { href: route('catalog', { category: 'footwear' }), label: 'Footwear' },
        ],
    },
    {
        title: 'Client service',
        links: [
            { href: '#', label: 'Concierge' },
            { href: '#', label: 'Shipping' },
            { href: '#', label: 'Returns' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { href: '#', label: 'Privacy' },
            { href: '#', label: 'Terms' },
        ],
    },
];

export default function SiteFooter() {
    return (
        <footer className="bg-surface-low/70 px-4 py-22 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-14 rounded-[2rem] bg-surface-lowest/70 p-10 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-4">
                    <p className="font-display text-lg font-bold uppercase tracking-[0.15em]">
                        Cardict Atelier
                    </p>
                    <p className="max-w-sm text-sm leading-relaxed text-on-surface/70">
                        Editorial luxury commerce — tonal layers, no harsh lines,
                        every surface considered.
                    </p>
                </div>
                {columns.map((col) => (
                    <div key={col.title} className="space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-on-surface/50">
                            {col.title}
                        </p>
                        <ul className="space-y-3">
                            {col.links.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-on-surface/80 transition hover:text-primary"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <p className="mx-auto mt-16 max-w-7xl text-center text-xs text-on-surface/40">
                © {new Date().getFullYear()} Cardict Atelier. All rights reserved.
            </p>
        </footer>
    );
}
