'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import TaskHubLogo from './TaskHubLogo';
import { taskService } from '@/services/taskService';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Notifications state
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifs, setShowNotifs] = useState(false);
    const bellRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const getUserId = useCallback((): number | null => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr || userStr === 'undefined') return null;
            const user = JSON.parse(userStr);
            return user.id ?? null;
        } catch { return null; }
    }, []);

    const fetchNotifications = useCallback(async () => {
        const userId = getUserId();
        if (!userId) return;
        try {
            const data = await taskService.getNotifications(userId);
            setNotifications(data.notifications ?? []);
            setUnreadCount(data.unread_count ?? 0);
        } catch { /* silently fail */ }
    }, [getUserId]);

    useEffect(() => {
        if (!mounted) return;
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [mounted, fetchNotifications]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
                setShowNotifs(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAllRead = async () => {
        const userId = getUserId();
        if (!userId) return;
        await taskService.markAllNotificationsRead(userId);
        setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
        setUnreadCount(0);
    };

    const handleMarkOneRead = async (id: number) => {
        await taskService.markNotificationRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const getInitials = () => {
        if (!mounted) return 'U';
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const name = user.full_name || user.username || 'U';
            return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
        } catch { return 'U'; }
    };

    const getUserData = () => {
        if (!mounted) return { name: 'Utilisateur', role: 'Staff' };
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return { name: user.full_name || user.username || 'Utilisateur', role: user.service || 'Personnel' };
        } catch { return { name: 'Utilisateur', role: 'Staff' }; }
    };

    const user = getUserData();

    const navLinks = [
        {
            name: 'Tableau de bord', href: '/', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            name: 'Mes tâches', href: '/tasks/my', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            )
        },
        {
            name: 'Archives', href: '/tasks/archives', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
            )
        },
        {
            name: 'Pièces jointes', href: '/tasks/attachments', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13" />
                </svg>
            )
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/login');
    };

    const isAuthPage = pathname === '/login' || pathname === '/register';
    if (isAuthPage) return null;

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "à l'instant";
        if (mins < 60) return `il y a ${mins} min`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `il y a ${hours}h`;
        return `il y a ${Math.floor(hours / 24)}j`;
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 pb-8">
                <Link href="/" className="flex items-center gap-3">
                    <TaskHubLogo size={32} />
                    <span className="text-xl font-black tracking-tight text-brand-text">TaskHub</span>
                </Link>
            </div>

            <div className="flex-1 px-4 space-y-1 overflow-y-auto">
                <Link
                    href="/tasks/new"
                    className="flex items-center gap-3 px-4 py-3.5 bg-brand-surface hover:bg-gray-100 text-brand-text font-extrabold text-sm rounded-2xl transition-all mb-6 group"
                >
                    <div className="w-7 h-7 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-110 transition-transform">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    Nouvelle tâche
                </Link>

                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-brand-muted hover:text-brand-text hover:bg-brand-surface'
                                }`}
                        >
                            {link.icon}
                            {link.name}
                        </Link>
                    );
                })}
            </div>

            {/* User footer */}
            <div className="p-4 mt-auto">
                <div className="bg-brand-surface rounded-2xl p-4 border border-brand-border">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-brand-border">
                        <div className="w-9 h-9 rounded-xl bg-white border border-brand-border flex items-center justify-center font-black text-brand-text text-sm shadow-sm">
                            {getInitials()}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-sm font-black text-brand-text truncate">{user.name}</p>
                            <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">{user.role}</p>
                        </div>

                        {/* Bell */}
                        <div className="relative" ref={bellRef}>
                            <button
                                onClick={() => { setShowNotifs(v => !v); if (!showNotifs) fetchNotifications(); }}
                                className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white transition-colors text-brand-muted hover:text-primary"
                                title="Notifications"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotifs && (
                                <div className="absolute bottom-12 right-0 w-72 bg-white rounded-2xl shadow-2xl border border-brand-border z-[200] overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
                                        <span className="text-xs font-black text-brand-text uppercase tracking-widest">
                                            Notifications {unreadCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-danger text-white text-[10px] rounded-full">{unreadCount}</span>}
                                        </span>
                                        {unreadCount > 0 && (
                                            <button onClick={handleMarkAllRead} className="text-[10px] font-black text-primary hover:underline uppercase">
                                                Tout lu
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-64 overflow-y-auto divide-y divide-brand-border">
                                        {notifications.length === 0 ? (
                                            <div className="p-6 text-center">
                                                <p className="text-2xl mb-1">🔔</p>
                                                <p className="text-xs font-bold text-brand-muted">Aucune notification</p>
                                            </div>
                                        ) : notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                onClick={() => !notif.is_read && handleMarkOneRead(notif.id)}
                                                className={`px-4 py-3 flex gap-3 cursor-pointer hover:bg-brand-surface transition-colors ${!notif.is_read ? 'bg-primary/5' : ''}`}
                                            >
                                                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notif.is_read ? 'bg-primary' : 'bg-transparent'}`} />
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-xs leading-snug ${!notif.is_read ? 'font-bold text-brand-text' : 'font-medium text-brand-muted'}`}>
                                                        {notif.message}
                                                    </p>
                                                    <p className="text-[10px] text-brand-muted mt-0.5">{timeAgo(notif.created_at)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button className="w-full flex items-center gap-3 px-2 py-2 text-brand-text hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Paramètres
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-2 py-2 text-danger hover:text-red-800 transition-colors text-xs font-bold uppercase tracking-wider"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Déconnexion
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* ─── Mobile top bar ─── */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-brand-border flex items-center justify-between px-4 z-50">
                <Link href="/" className="flex items-center gap-2">
                    <TaskHubLogo size={26} />
                    <span className="text-base font-black tracking-tight text-brand-text">TaskHub</span>
                </Link>
                <div className="flex items-center gap-2">
                    {/* Bell on mobile top bar */}
                    <div className="relative" ref={bellRef}>
                        <button
                            onClick={() => setShowNotifs(v => !v)}
                            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-brand-muted hover:text-primary"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>
                        {showNotifs && (
                            <div className="absolute top-11 right-0 w-72 bg-white rounded-2xl shadow-2xl border border-brand-border z-[200] overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
                                    <span className="text-xs font-black text-brand-text uppercase tracking-widest">Notifications</span>
                                    {unreadCount > 0 && <button onClick={handleMarkAllRead} className="text-[10px] font-black text-primary hover:underline">Tout lu</button>}
                                </div>
                                <div className="max-h-64 overflow-y-auto divide-y divide-brand-border">
                                    {notifications.length === 0 ? (
                                        <div className="p-6 text-center"><p className="text-xs font-bold text-brand-muted">Aucune notification</p></div>
                                    ) : notifications.map((notif) => (
                                        <div key={notif.id} onClick={() => !notif.is_read && handleMarkOneRead(notif.id)}
                                            className={`px-4 py-3 flex gap-3 cursor-pointer hover:bg-brand-surface ${!notif.is_read ? 'bg-primary/5' : ''}`}>
                                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notif.is_read ? 'bg-primary' : 'bg-transparent'}`} />
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs leading-snug ${!notif.is_read ? 'font-bold text-brand-text' : 'font-medium text-brand-muted'}`}>{notif.message}</p>
                                                <p className="text-[10px] text-brand-muted mt-0.5">{timeAgo(notif.created_at)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Hamburger */}
                    <button
                        onClick={() => setMobileOpen(v => !v)}
                        className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-brand-surface transition-colors"
                        aria-label="Menu"
                    >
                        <span className={`block w-5 h-0.5 bg-brand-text rounded-full transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`block w-5 h-0.5 bg-brand-text rounded-full transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-5 h-0.5 bg-brand-text rounded-full transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
            </div>

            {/* ─── Mobile overlay backdrop ─── */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ─── Mobile drawer ─── */}
            <aside className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarContent />
            </aside>

            {/* ─── Desktop sidebar ─── */}
            <aside className="hidden lg:flex w-72 bg-white border-r border-brand-border flex-col fixed h-screen z-50">
                <SidebarContent />
            </aside>
        </>
    );
}
