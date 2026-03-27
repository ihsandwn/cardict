import ProductCard from '@/Components/Shop/ProductCard';
import ShopLayout from '@/Layouts/ShopLayout';
import { Link, router } from '@inertiajs/react';
import type { PageProps } from '@/types';
import type { LaravelPaginator, ShopCategory, ShopProduct } from '@/types/shop';

type CatalogProps = PageProps<{
    categories: ShopCategory[];
    products: LaravelPaginator<ShopProduct>;
    filters: {
        category: string | null;
        sort: string;
    };
}>;

const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price — low' },
    { value: 'price_desc', label: 'Price — high' },
] as const;

export default function Catalog({ categories, products, filters }: CatalogProps) {
    const setSort = (sort: string) => {
        router.get(
            route('catalog'),
            { category: filters.category, sort },
            { preserveState: true, replace: true },
        );
    };

    return (
        <ShopLayout title="Collections">
            <div className="atelier-container py-8 sm:py-12">
                <p className="atelier-kicker">
                    Home / Catalog / Collections
                </p>
                <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
                    The kinetic collection
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-on-surface/65">
                    Showing {products.total} articles — editorial pacing, tonal
                    panels, and rhythm without grid lines.
                </p>
            </div>

            <div className="atelier-container grid gap-8 pb-22 lg:grid-cols-[minmax(0,14rem)_1fr] lg:gap-12">
                <aside className="hidden space-y-8 lg:sticky lg:top-28 lg:block lg:self-start">
                    <div className="rounded-[1.5rem] bg-surface-low/60 p-6">
                        <p className="text-xs font-semibold uppercase tracking-widest text-on-surface/50">
                            Category
                        </p>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link
                                    href={route('catalog')}
                                    className={
                                        filters.category
                                            ? 'text-sm text-on-surface/60 hover:text-primary'
                                            : 'text-sm font-semibold text-primary'
                                    }
                                >
                                    All
                                </Link>
                            </li>
                            {categories.map((c) => (
                                <li key={c.slug}>
                                    <Link
                                        href={route('catalog', { category: c.slug })}
                                        className={
                                            filters.category === c.slug
                                                ? 'text-sm font-semibold text-primary'
                                                : 'text-sm text-on-surface/60 hover:text-primary'
                                        }
                                    >
                                        {c.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                <div className="min-w-0 space-y-8">
                    <div className="sticky top-16 z-20 -mx-4 flex flex-nowrap gap-3 overflow-x-auto rounded-none bg-surface/90 px-4 py-3 backdrop-blur sm:relative sm:top-0 sm:mx-0 sm:flex-col sm:gap-4 sm:overflow-visible sm:rounded-[1.5rem] sm:bg-surface-low sm:px-4 sm:py-4 md:flex-row md:items-center md:justify-between md:px-6">
                        <p className="text-xs font-medium uppercase tracking-widest text-on-surface/50">
                            Showing {products.data.length} on this page
                        </p>
                        <div className="flex gap-2 lg:hidden">
                            <span className="chip-muted whitespace-nowrap">Filters</span>
                            {categories.slice(0, 2).map((c) => (
                                <Link
                                    key={c.slug}
                                    href={route('catalog', { category: c.slug })}
                                    className="chip-muted whitespace-nowrap"
                                >
                                    {c.name}
                                </Link>
                            ))}
                        </div>
                        <label className="flex items-center gap-2 text-sm text-on-surface/70">
                            <span className="sr-only">Sort by</span>
                            <span>Sort</span>
                            <select
                                value={filters.sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="rounded-full border-0 bg-surface-lowest px-4 py-2 text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                {sortOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {products.data.map((p, index) => (
                            <div
                                key={p.id}
                                className={index % 3 === 1 ? 'xl:translate-y-8' : ''}
                            >
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>

                    {products.last_page > 1 ? (
                        <nav className="flex flex-wrap justify-center gap-2 pt-6" aria-label="Pagination">
                            {products.links.map((link, i) => {
                                if (link.label === '...') {
                                    return (
                                        <span key={`ellipsis-${i}`} className="px-2 text-on-surface/40">
                                            …
                                        </span>
                                    );
                                }
                                return link.url ? (
                                    <Link
                                        key={`${link.url}-${i}`}
                                        href={link.url}
                                        className={`rounded-full px-4 py-2 text-sm ${
                                            link.active ? 'chip-active' : 'chip-muted'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={`disabled-${i}`}
                                        className="rounded-full px-4 py-2 text-sm text-on-surface/30"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </nav>
                    ) : null}
                </div>
            </div>
        </ShopLayout>
    );
}
