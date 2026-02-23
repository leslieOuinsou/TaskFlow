'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { taskService } from '@/services/taskService';
import Link from 'next/link';
import TaskHubLogo from '@/components/TaskHubLogo';

export default function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [service, setService] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        setIsLoading(true);
        try {
            await taskService.register(fullName, email, username, password, service);
            alert('Compte créé avec succès ! Veuillez vous connecter.');
            router.push('/login');
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l’inscription');
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
            <main className="flex-1 flex items-center justify-center p-6 py-12">
                <div className="bg-white p-10 rounded-2xl shadow-elevation-1 max-w-lg w-full border border-brand-border flex flex-col items-center">

                    <div className="w-12 h-12 flex items-center justify-center mb-6">
                        <TaskHubLogo size={48} />
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-extrabold text-brand-text mb-2">Inscription Staff</h1>
                        <p className="text-brand-muted text-sm font-black max-w-[280px] mx-auto">
                            Rejoignez la plateforme interne TaskHub. Veuillez remplir vos informations professionnelles.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full space-y-5">
                        {error && (
                            <div className="p-4 bg-danger/10 border-l-4 border-danger text-danger text-sm rounded-r-lg font-medium">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-brand-text mb-2">Nom complet</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-3.5 text-black/50">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Jean Dupont"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-brand-surface border border-brand-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-brand-muted font-medium text-brand-text"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-brand-text mb-2">Email professionnel</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-3.5 text-black/50">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        placeholder="j.dupont@taskhub.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-brand-surface border border-brand-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-brand-muted font-medium text-brand-text"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-brand-text mb-2">Service</label>
                                <select
                                    required
                                    value={service}
                                    onChange={(e) => setService(e.target.value)}
                                    className="w-full px-4 py-3 bg-brand-surface border border-brand-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-bold appearance-none cursor-pointer text-brand-text"
                                >
                                    <option value="" disabled>Sélectionner un service</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Informatique">Informatique</option>
                                    <option value="Logistique">Logistique</option>
                                    <option value="Sécurité">Sécurité</option>
                                    <option value="RH">RH</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-brand-text mb-2">Mot de passe</label>
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
                                            <div className="flex gap-0.5 flex-1">
                                                {[...Array(12)].map((_, i) => (
                                                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < password.length ? (password.length < 8 ? 'bg-danger' : password.length < 12 ? 'bg-warning' : 'bg-status-complete') : 'bg-brand-border'
                                                        }`} />
                                                ))}
                                            </div>
                                            <span className={`text-[10px] font-black ${password.length < 8 ? 'text-danger' : password.length < 12 ? 'text-warning' : 'text-status-complete'
                                                }`}>{password.length}/12</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-text mb-2">Confirmer le mot de passe</label>
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
                                            placeholder="••••••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`w-full pl-11 pr-4 py-3 bg-brand-surface border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-brand-muted font-medium text-brand-text ${confirmPassword.length > 0 && confirmPassword !== password
                                                ? 'border-danger focus:ring-danger'
                                                : 'border-brand-border'
                                                }`}
                                        />
                                    </div>
                                    {confirmPassword.length > 0 && confirmPassword !== password && (
                                        <p className="text-[10px] text-danger font-black mt-1 px-1">⚠ Les mots de passe ne correspondent pas</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <p className="text-[10px] font-bold text-brand-muted italic">
                            * Votre compte sera soumis à validation par l'administrateur de votre service avant activation complète.
                        </p>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm shadow-xl shadow-primary/10 transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div> : (
                                <>
                                    Créer un compte
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </button>

                        <div className="text-center pt-2 border-t border-gray-50 mt-6">
                            <p className="text-xs font-bold text-brand-muted uppercase tracking-wide">
                                Vous avez déjà un compte ?
                                <Link href="/login" className="ml-1 text-primary hover:underline">Se connecter</Link>
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
