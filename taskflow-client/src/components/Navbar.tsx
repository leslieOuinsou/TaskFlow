'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const getInitials = () => {
        if (typeof window === 'undefined') return 'U';
        const userStr = localStorage.getItem('user');
        if (!userStr || userStr === 'undefined') return 'U';
        try {
            const user = JSON.parse(userStr);
            const name = user.full_name || user.username || 'U';
            return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
        } catch {
            return 'U';
        }
    };

    const getUserName = () => {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem('user');
        if (!userStr || userStr === 'undefined') return null;
        try {
            const user = JSON.parse(userStr);
            return user.full_name || user.username;
        } catch {
            return null;
        }
    };

    const navLinks = [
        { name: 'Tableau de bord', href: '/' },
        { name: 'Mes tâches', href: '#' },
        { name: 'Archives', href: '#' },
    ];

    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('user') && localStorage.getItem('user') !== 'undefined';

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">TaskHub</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-semibold transition-colors ${pathname === link.href ? 'text-blue-600' : 'text-black/60 hover:text-gray-900'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <>
                            <Link
                                href="/tasks/new"
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2 rounded-lg transition-all flex items-center gap-2 shadow-sm shadow-blue-100"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nouvelle demande
                            </Link>

                            <button className="text-black/50 hover:text-black transition-colors p-1.5 rounded-full hover:bg-gray-50">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>

                            <div className="flex items-center gap-3 pl-2 border-l border-gray-100">
                                <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                                    <span className="text-sm font-bold text-gray-700">{getInitials()}</span>
                                </div>
                                <div className="hidden lg:block text-right">
                                    <button
                                        onClick={() => { localStorage.removeItem('user'); window.location.href = '/login'; }}
                                        className="text-[10px] text-red-500 hover:underline font-bold uppercase tracking-wider"
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <Link href="/login" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                            Se connecter
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
