'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/register';

    return (
        <>
            <Sidebar />
            <main className={`min-h-screen bg-brand-bg pt-14 lg:pt-0 ${isAuthPage ? '' : 'lg:ml-72'}`}>
                {children}
            </main>
        </>
    );
}
