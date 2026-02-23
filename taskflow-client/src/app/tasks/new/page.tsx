'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { taskService } from '@/services/taskService';
import Link from 'next/link';

export default function NewTaskPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        service: '',
        priority: 'Normale',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            router.push('/login');
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const userStr = localStorage.getItem('user');
        if (!userStr) {
            router.push('/login');
            return;
        }

        try {
            const user = JSON.parse(userStr);
            await taskService.createTask({
                ...formData,
                user_id: user.id,
            });
            router.push('/');
        } catch (error) {
            alert('Erreur lors de la création');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg py-6 sm:py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm font-black text-brand-text hover:text-primary transition-colors mb-8"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour au tableau de bord
                </Link>

                <div className="bg-white rounded-2xl border border-brand-border shadow-elevation-1 overflow-hidden">
                    <div className="p-5 sm:p-8 border-b border-gray-50">
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-extrabold text-brand-text">Nouvelle demande</h1>
                                <p className="text-brand-muted font-bold text-xs sm:text-sm mt-1">Veuillez remplir les informations ci-dessous pour créer une nouvelle tâche.</p>
                            </div>
                            <div className="bg-info/10 p-2 rounded-full">
                                <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6 sm:space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[11px] font-extrabold text-brand-text uppercase tracking-widest mb-2">Titre de la demande</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Problème d'imprimante accueil"
                                    className="w-full px-4 py-3 bg-brand-surface border border-brand-border rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-black placeholder:text-brand-muted"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[11px] font-extrabold text-brand-text uppercase tracking-widest mb-2">Service concerné</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold appearance-none cursor-pointer"
                                        value={formData.service}
                                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                    >
                                        <option value="" disabled>Sélectionner un service</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Informatique">Informatique</option>
                                        <option value="Logistique">Logistique</option>
                                        <option value="Sécurité">Sécurité</option>
                                        <option value="RH">RH</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-extrabold text-brand-text uppercase tracking-widest mb-2">Priorité</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold appearance-none cursor-pointer"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        <option value="Basse">Niveau Bas</option>
                                        <option value="Normale">Niveau Moyen</option>
                                        <option value="Urgente">Niveau Haut</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-extrabold text-brand-text uppercase tracking-widest mb-2">Description détaillée</label>
                                <textarea
                                    required
                                    rows={6}
                                    placeholder="Décrivez précisément votre besoin ou le problème rencontré..."
                                    className="w-full px-4 py-3 bg-brand-surface border border-brand-border rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-black placeholder:text-brand-muted resize-none text-brand-text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                                <p className="mt-2 text-[11px] text-brand-muted font-black italic">Soyez le plus précis possible pour aider nos équipes à intervenir rapidement.</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => router.push('/')}
                                className="px-8 py-3 rounded-xl text-sm font-bold text-brand-muted hover:text-brand-text transition-colors bg-white border border-brand-border"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/10 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                )}
                                Créer la demande
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-info/10 p-6 rounded-2xl border border-info/20 flex gap-4">
                    <div className="text-info pt-0.5">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-info mb-1">Délai d'intervention estimé</h4>
                        <p className="text-xs text-info/70 font-medium">Une fois votre demande soumise, un technicien sera assigné dans un délai de 2 heures ouvrées pour les priorités hautes et 24 heures pour les autres niveaux.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
