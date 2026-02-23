'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { taskService } from '@/services/taskService';
import Link from 'next/link';
import TaskHubLogo from '@/components/TaskHubLogo';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password.length < 12) {
            setError('Le mot de passe doit contenir au moins 12 caractères.');
            return;
        }
        setIsLoading(true);
        try {
            const data = await taskService.login(email, password);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Identifiants invalides');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col">
            {/* Header */}
            <header className="h-16 bg-white border-b border-brand-border flex items-center justify-between px-8">
                <div className="flex items-center gap-2">
                    <TaskHubLogo size={28} />
                    <span className="text-lg font-bold tracking-tight text-brand-text leading-none">TaskHub</span>
                </div>
                <span className="text-[10px] font-black text-black uppercase tracking-widest">Internal Access</span>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="bg-white p-10 rounded-2xl shadow-elevation-1 max-w-md w-full border border-brand-border">
                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-extrabold text-brand-text mb-2">Se connecter</h1>
                        <p className="text-brand-muted text-sm font-black">Entrez vos identifiants pour accéder à TaskHub</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-danger/10 border-l-4 border-danger text-danger text-sm rounded-r-lg font-medium">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-brand-text mb-2">Adresse e-mail</label>
                            <div className="relative">
                                <div className="absolute left-4 top-3.5 text-black/50">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    required
                                    placeholder="nom@entreprise.fr"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-brand-surface border border-brand-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-brand-muted font-medium text-brand-text"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-bold text-brand-text">Mot de passe</label>
                                <button type="button" className="text-[10px] font-black text-brand-muted hover:text-primary transition-colors">Mot de passe oublié ?</button>
                            </div>
                            <div className="relative">
                                <div className="absolute left-4 top-3.5 text-black/50">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    required
                                    minLength={12}
                                    autoComplete="current-password"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full pl-11 pr-4 py-3 bg-brand-surface border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-brand-muted font-medium text-brand-text ${password.length > 0 && password.length < 12
                                        ? 'border-danger focus:ring-danger'
                                        : 'border-brand-border'
                                        }`}
                                />
                            </div>
                            {password.length > 0 && (
                                <div className="flex items-center gap-2 mt-1.5 px-1">
                                    <div className="flex gap-1 flex-1">
                                        {[...Array(12)].map((_, i) => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < password.length ? (password.length < 8 ? 'bg-danger' : password.length < 12 ? 'bg-warning' : 'bg-status-complete') : 'bg-brand-border'
                                                }`} />
                                        ))}
                                    </div>
                                    <span className={`text-[10px] font-black ${password.length < 8 ? 'text-danger' : password.length < 12 ? 'text-warning' : 'text-status-complete'
                                        }`}>
                                        {password.length}/12
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-brand-border text-primary focus:ring-primary cursor-pointer" />
                            <label htmlFor="remember" className="text-xs font-black text-brand-text cursor-pointer">Se souvenir de moi</label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/10 transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center"
                        >
                            {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div> : 'Se connecter'}
                        </button>

                        <div className="text-center pt-2">
                            <p className="text-xs font-black text-brand-text">
                                Vous n'avez pas de compte ?
                                <Link href="/register" className="ml-1 text-primary hover:underline">S'inscrire</Link>
                            </p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-brand-surface flex items-start gap-3 p-4 bg-info/5 rounded-xl border-dashed border border-info/20">
                            <div className="text-info pt-0.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-[10px] font-bold text-info/70 leading-relaxed uppercase tracking-wide">
                                Cet accès est réservé uniquement aux employés autorisés de TaskHub.
                            </p>
                        </div>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <footer className="px-8 py-6 flex flex-col items-center justify-between border-t border-brand-border lg:flex-row gap-4">
                <div className="flex items-center gap-8">
                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">© 2026 TaskHub. All rights reserved.</span>
                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest hidden sm:block">Version 1.0.4</span>
                </div>
                <div className="flex items-center gap-6">
                    <button className="text-[10px] font-bold text-brand-muted hover:text-brand-text uppercase tracking-widest transition-colors">Support</button>
                    <button className="text-[10px] font-bold text-brand-muted hover:text-brand-text uppercase tracking-widest transition-colors">Confidentialité</button>
                    <button className="text-[10px] font-bold text-brand-muted hover:text-brand-text uppercase tracking-widest transition-colors">CGU</button>
                </div>
            </footer>
        </div>
    );
}
