import ProductCard from '@/Components/Shop/ProductCard';
import ShopLayout from '@/Layouts/ShopLayout';
import { Link } from '@inertiajs/react';
import type { PageProps } from '@/types';
import type { ShopProduct, ShopCategory } from '@/types/shop';

type HomeProps = PageProps<{
    categories: ShopCategory[];
    curationProducts: ShopProduct[];
    featuredProducts: ShopProduct[];
}>;

export default function Home({
    categories,
    curationProducts,
    featuredProducts,
}: HomeProps) {
    const [spotlight, ...curationSecondary] = curationProducts;

    return (
        <ShopLayout
            title="Home"
            hero={
                <section className="relative min-h-[620px] overflow-hidden pt-16 lg:min-h-[860px]">
                    {spotlight?.image_url ? (
                        <div className="absolute inset-0">
                            <img
                                src={spotlight.image_url}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-surface/85 via-surface/35 to-transparent" />
                        </div>
                    ) : null}
                    <div className="atelier-container relative z-10 flex min-h-[520px] items-end pb-10 pt-10 lg:min-h-[680px] lg:items-center lg:pb-0">
                        <div className="max-w-2xl">
                            <p className="atelier-kicker">
                                Winter atelier 2025
                            </p>
                            <h1 className="font-display mt-4 text-4xl font-black uppercase leading-[0.9] tracking-[-0.03em] text-on-surface sm:text-6xl lg:text-7xl">
                                Kinetic
                                <br />
                                <span className="text-transparent [-webkit-text-stroke:1.5px_#0846ed]">
                                    Movement
                                </span>
                            </h1>
                            <p className="mt-6 max-w-md text-base leading-relaxed text-on-surface/70">
                                Curated technical layers and fluid tailoring —
                                the screen as an atelier wall, not a spreadsheet.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link href={route('catalog')} className="btn-primary">
                                    Explore collection
                                </Link>
                                <button type="button" className="btn-secondary hidden sm:inline-flex">
                                    View film
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            }
        >
            <section id="curation" className="atelier-section scroll-mt-28">
                <div className="atelier-container flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
                    <h2 className="font-display text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
                        Our curation
                    </h2>
                    <p className="max-w-md text-right text-sm leading-relaxed text-on-surface/65 md:text-left">
                        Apparel, accessories, and footwear staged as editorial
                        stills — layered surfaces instead of catalog dividers.
                    </p>
                </div>
                <div className="atelier-container mt-14 grid gap-6 lg:grid-cols-12 lg:[grid-auto-rows:minmax(240px,auto)]">
                    <div className="lg:col-span-7">
                        {spotlight ? <ProductCard product={spotlight} /> : null}
                    </div>
                    <div className="flex flex-col gap-6 lg:col-span-5">
                        {curationSecondary.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="atelier-section bg-surface-low/80">
                <div className="atelier-container">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                                Atelier selects
                            </p>
                            <h2 className="font-display mt-2 text-3xl font-bold text-on-surface">
                                The new standard
                            </h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.slice(0, 4).map((c) => (
                                <Link
                                    key={c.slug}
                                    href={route('catalog', { category: c.slug })}
                                    className="chip-muted hover:bg-surface-high"
                                >
                                    {c.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="mt-10 flex gap-6 overflow-x-auto pb-2 sm:mt-14 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
                        {featuredProducts.map((p) => (
                            <div key={p.id} className="w-[16rem] shrink-0 sm:w-auto sm:shrink">
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="atelier-section">
                <div className="mx-auto max-w-3xl rounded-[2rem] bg-surface-high/60 px-8 py-14 text-center sm:px-12">
                    <h2 className="font-display text-2xl font-bold text-on-surface">
                        Join the atelier
                    </h2>
                    <p className="mt-3 text-sm text-on-surface/65">
                        Private drops and invitations — no noise, only signal.
                    </p>
                    <form className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                        <label htmlFor="newsletter-email" className="sr-only">
                            Email
                        </label>
                        <input
                            id="newsletter-email"
                            type="email"
                            placeholder="Email address"
                            className="atelier-input min-h-12 flex-1 bg-surface-lowest"
                        />
                        <button type="button" className="btn-primary sm:px-10">
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </ShopLayout>
    );
}
