'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task, Status, Priority } from '@/types/task';
import { taskService } from '@/services/taskService';
import TaskTable from '@/components/TaskTable';
import Link from 'next/link';

export default function MyTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr || userStr === 'undefined') {
            router.push('/login');
        } else {
            setUser(JSON.parse(userStr));
        }
    }, []);

    const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All');
    const [filterPriority, setFilterPriority] = useState<Priority | 'All'>('All');
    const [searchTerm, setSearchTerm] = useState('');

    const loadTasks = async () => {
        if (!user) return;
        try {
            const allTasks = await taskService.getTasks(searchTerm);
            // Filter by user_id
            const myTasks = allTasks.filter(t => t.user_id === user.id);
            setTasks(myTasks);
        } catch (error) {
            console.error('Error loading my tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) loadTasks();
    }, [user, searchTerm]);

    useEffect(() => {
        let result = tasks;
        if (filterStatus !== 'All') {
            result = result.filter(t => t.status === filterStatus);
        }
        if (filterPriority !== 'All') {
            result = result.filter(t => t.priority === filterPriority);
        }
        setFilteredTasks(result);
    }, [tasks, filterStatus, filterPriority]);

    const stats = {
        pending: tasks.filter(t => t.status === 'En attente').length,
        urgent: tasks.filter(t => t.priority === 'Urgente' && t.status !== 'Terminé').length,
        completedToday: tasks.filter(t => t.status === 'Terminé' && new Date(t.updated_at).toDateString() === new Date().toDateString()).length,
    };

    return (
        <div className="min-h-screen bg-brand-bg px-4 sm:px-10 py-6 sm:py-10 max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-brand-text tracking-tight">Mes tâches</h1>
                    <p className="text-brand-muted font-bold mt-1 uppercase tracking-widest text-[10px] hidden sm:block">Gérez et suivez vos assignations quotidiennes.</p>
                </div>
                <Link
                    href="/tasks/new"
                    className="bg-primary hover:bg-primary-hover text-white font-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl transition-all flex items-center gap-2 shadow-xl shadow-primary/10 active:scale-95 text-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden sm:inline">Nouvelle demande</span>
                </Link>
            </div>

            {/* Control Bar */}
            <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
                <div className="w-full lg:max-w-md relative">
                    <input
                        type="text"
                        placeholder="Filtrer par titre ou ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-brand-surface border border-transparent rounded-xl focus:bg-white focus:border-primary outline-none transition-all font-bold text-sm text-brand-text"
                    />
                    <svg className="w-5 h-5 text-brand-muted absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="bg-brand-surface border border-transparent text-brand-text text-sm font-black rounded-xl px-4 py-3 outline-none hover:bg-brand-border transition-colors cursor-pointer"
                    >
                        <option value="All">Tous les statuts</option>
                        <option value="En attente">En attente</option>
                        <option value="En cours">En cours</option>
                        <option value="Terminé">Terminé</option>
                    </select>
                    <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value as any)}
                        className="bg-brand-surface border border-transparent text-brand-text text-sm font-black rounded-xl px-4 py-3 outline-none hover:bg-brand-border transition-colors cursor-pointer"
                    >
                        <option value="All">Toutes priorités</option>
                        <option value="Basse">Basse</option>
                        <option value="Normale">Moyenne</option>
                        <option value="Urgente">Haute</option>
                    </select>
                    <button
                        onClick={() => { setFilterStatus('All'); setFilterPriority('All'); setSearchTerm(''); }}
                        className="text-xs font-black text-brand-muted hover:text-brand-text uppercase tracking-widest px-4 py-2 transition-colors"
                    >
                        Réinitialiser
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    <TaskTable tasks={filteredTasks} />

                    {/* Bottom Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10">
                        <div className="bg-white p-8 rounded-[2rem] border border-brand-border shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
                            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs font-black text-brand-muted uppercase tracking-widest mb-1">En attente</p>
                                <p className="text-3xl font-black text-brand-text">{stats.pending.toString().padStart(2, '0')}</p>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-brand-border shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
                            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs font-black text-brand-muted uppercase tracking-widest mb-1">Priorité Haute</p>
                                <p className="text-3xl font-black text-danger">{stats.urgent.toString().padStart(2, '0')}</p>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-brand-border shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs font-black text-brand-muted uppercase tracking-widest mb-1">Terminées <span className="text-[8px] opacity-70">(Aujourd'hui)</span></p>
                                <p className="text-3xl font-black text-brand-text">{stats.completedToday.toString().padStart(2, '0')}</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
