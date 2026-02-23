'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task, Priority } from '@/types/task';
import { taskService } from '@/services/taskService';
import PriorityBadge from '@/components/PriorityBadge';
import StatusBadge from '@/components/StatusBadge';

export default function ArchivesPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const loadArchives = async () => {
        try {
            const data = await taskService.getArchivedTasks();
            setTasks(data);
        } catch (error) {
            console.error('Error loading archives:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArchives();
    }, []);

    const handleRestore = async (id: number) => {
        try {
            await taskService.restoreTask(id);
            loadArchives();
        } catch (error) {
            alert('Erreur lors de la restauration');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Supprimer définitivement cette tâche ? Cette action est irréversible.')) return;
        try {
            await taskService.deleteArchivedTask(id);
            loadArchives();
        } catch (error) {
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg px-4 sm:px-10 py-6 sm:py-10 max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-brand-text tracking-tight">Archives</h1>
                    <p className="text-brand-muted font-bold mt-1 uppercase tracking-widest text-[10px] hidden sm:block">
                        Consultez et gérez l'historique de vos demandes traitées ou annulées.
                    </p>
                </div>
                <div className="flex gap-2 sm:gap-3">
                    <button
                        onClick={() => {
                            if (confirm('Vider totalement les archives ?')) { }
                        }}
                        className="bg-danger/10 border border-danger/20 text-danger font-extrabold px-3 sm:px-6 py-2.5 sm:py-3 rounded-2xl flex items-center gap-2 shadow-sm hover:bg-danger hover:text-white transition-all text-xs sm:text-sm group"
                    >
                        <svg className="w-4 h-4 text-danger group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="hidden sm:inline">Vider les archives</span>
                    </button>
                </div>
            </div>

            {/* Control Bar (Mock) */}
            <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-sm flex flex-wrap items-center gap-4 mb-8">
                <span className="text-[10px] font-black text-brand-text uppercase tracking-widest px-2">Filtrer par :</span>
                <select className="bg-gray-50 border-none text-gray-700 text-sm font-black rounded-xl px-4 py-3 outline-none cursor-pointer">
                    <option>Date d'archivage</option>
                </select>
                <select className="bg-gray-50 border-none text-gray-700 text-sm font-black rounded-xl px-4 py-3 outline-none cursor-pointer">
                    <option>Tous les services</option>
                </select>
                <select className="bg-gray-50 border-none text-gray-700 text-sm font-black rounded-xl px-4 py-3 outline-none cursor-pointer">
                    <option>Statut d'origine</option>
                </select>
                <button className="text-[10px] font-black text-brand-muted hover:text-brand-text uppercase tracking-widest ml-auto px-4">Réinitialiser</button>
                <span className="px-4 py-2 bg-primary/10 rounded-xl text-primary text-[10px] font-black uppercase tracking-widest">{tasks.length} résultats trouvés</span>
            </div>

            {/* Mobile card list */}
            <div className="lg:hidden bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden mb-8 divide-y divide-brand-border">
                {loading ? (
                    <div className="p-10 text-center text-brand-muted font-bold">Chargement...</div>
                ) : tasks.length === 0 ? (
                    <div className="p-10 text-center text-brand-muted font-bold">Aucune tâche archivée.</div>
                ) : tasks.map((task) => (
                    <div key={task.id} className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black text-brand-muted">ARCH-{1000 + task.id}</p>
                                <p className="text-sm font-black text-brand-text truncate">{task.title}</p>
                            </div>
                            <StatusBadge status={task.status} />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                            <PriorityBadge priority={task.priority} />
                            {task.service && <span className="text-[10px] font-bold text-brand-muted bg-brand-surface px-2 py-0.5 rounded-lg border border-brand-border">{task.service}</span>}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleRestore(task.id)}
                                className="flex-1 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20 transition-all flex items-center justify-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                Restaurer
                            </button>
                            <button onClick={() => handleDelete(task.id)}
                                className="p-2 bg-danger/10 text-danger hover:bg-danger hover:text-white border border-danger/20 rounded-xl transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block bg-white rounded-[2rem] border border-brand-border shadow-sm overflow-hidden mb-10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-brand-surface border-b border-brand-border">
                            <th className="p-6 text-[10px] font-black text-brand-text uppercase tracking-widest">Titre de la tâche</th>
                            <th className="p-6 text-[10px] font-black text-brand-text uppercase tracking-widest">Service</th>
                            <th className="p-6 text-[10px] font-black text-brand-text uppercase tracking-widest">Priorité</th>
                            <th className="p-6 text-[10px] font-black text-brand-text uppercase tracking-widest text-center">Statut Final</th>
                            <th className="p-6 text-[10px] font-black text-brand-text uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border">
                        {loading ? (
                            <tr><td colSpan={5} className="p-20 text-center text-brand-muted font-bold uppercase tracking-widest">Chargement...</td></tr>
                        ) : tasks.length === 0 ? (
                            <tr><td colSpan={5} className="p-20 text-center text-brand-muted font-bold uppercase tracking-widest">Aucune tâche archivée.</td></tr>
                        ) : tasks.map((task) => (
                            <tr key={task.id} className="group hover:bg-brand-surface transition-colors">
                                <td className="p-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-brand-text">{task.title}</span>
                                        <span className="text-[10px] font-bold text-brand-muted mt-0.5">ARCH-{1000 + task.id}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className="px-3 py-1 bg-brand-surface text-brand-muted rounded-lg text-[10px] font-black uppercase tracking-wider border border-brand-border">
                                        {task.service || 'N/A'}
                                    </span>
                                </td>
                                <td className="p-6"><PriorityBadge priority={task.priority} /></td>
                                <td className="p-6 text-center"><StatusBadge status={task.status} /></td>
                                <td className="p-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleRestore(task.id)}
                                            className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest border border-primary/20 shadow-sm">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                            Restaurer
                                        </button>
                                        <button onClick={() => handleDelete(task.id)}
                                            className="p-2 bg-danger/10 text-danger hover:bg-danger hover:text-white border border-danger/20 rounded-lg transition-all shadow-sm">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Info Guide */}
            <div className="bg-primary/5 p-8 rounded-[2rem] border-2 border-dashed border-primary/20 flex items-start gap-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-sm font-black text-brand-text mb-2 uppercase tracking-widest">Guide de restauration</h3>
                    <p className="text-xs text-brand-muted font-bold leading-relaxed opacity-80 uppercase tracking-wide">
                        Toute tâche restaurée apparaîtra immédiatement dans votre onglet "Mes tâches". Les pièces jointes associées seront conservées, mais le statut reviendra à l'état "À traiter" par défaut pour une nouvelle révision. Les tâches supprimées ici sont irrécupérables.
                    </p>
                </div>
            </div>
        </div>
    );
}
