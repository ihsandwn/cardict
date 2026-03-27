import { Head, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';
import SiteFooter from '@/Components/Shop/SiteFooter';
import SiteHeader from '@/Components/Shop/SiteHeader';
import MobileBottomNav from '@/Components/Shop/MobileBottomNav';

type ShopLayoutProps = PropsWithChildren<{
    title?: string;
    hero?: ReactNode;
    hideMobileNav?: boolean;
}>;

export default function ShopLayout({
    title,
    hero,
    children,
    hideMobileNav = false,
}: ShopLayoutProps) {
    const page = usePage();
    const flash = page.props.flash ?? {};

    return (
        <>
            {title ? <Head title={title} /> : null}
            <div className="atelier-shell min-h-screen flex flex-col">
                <SiteHeader />
                {flash.success ? (
                    <div
                        className="bg-surface-low px-4 py-3 text-center text-sm font-medium text-on-surface"
                        role="status"
                    >
                        {flash.success}
                    </div>
                ) : null}
                {flash.error ? (
                    <div
                        className="bg-tertiary/10 px-4 py-3 text-center text-sm font-medium text-tertiary"
                        role="alert"
                    >
                        {flash.error}
                    </div>
                ) : null}
                {hero}
                <main className={`relative z-10 flex-1 ${hideMobileNav ? '' : 'pb-20 lg:pb-0'}`}>
                    {children}
                </main>
                <SiteFooter />
                {hideMobileNav ? null : <MobileBottomNav />}
            </div>
        </>
    );
}
