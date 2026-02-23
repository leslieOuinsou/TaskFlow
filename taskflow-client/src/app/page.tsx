'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task, Status, Priority } from '@/types/task';
import { taskService } from '@/services/taskService';
import StatsCards from '@/components/StatsCards';
import TaskTable from '@/components/TaskTable';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    }
  }, []);

  // Filters
  const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All');
  const [filterPriority, setFilterPriority] = useState<Priority | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const loadTasks = async () => {
    try {
      const data = await taskService.getTasks(searchTerm);
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [searchTerm]);

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
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'En attente').length,
    urgent: tasks.filter(t => t.priority === 'Urgente' && t.status !== 'Terminé').length,
    completed: tasks.filter(t => t.status === 'Terminé').length,
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Title Section */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text tracking-tight">Tableau de bord</h1>
            <p className="text-brand-text mt-1 font-bold italic text-sm hidden sm:block">Gérez et suivez l'avancement des demandes internes.</p>
          </div>
          <button
            onClick={() => router.push('/tasks/new')}
            className="bg-primary hover:bg-primary-hover text-white font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary/10 active:scale-95 text-sm"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="hidden sm:inline">Nouvelle demande</span>
          </button>
        </div>

        {/* Stats Section */}
        <StatsCards {...stats} />

        {/* Control Section (Search & Tabs) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
          <div className="w-full lg:max-w-md relative">
            <input
              type="text"
              placeholder="Rechercher une tâche..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-brand-border rounded-xl focus:ring-2 focus:ring-primary outline-none shadow-elevation-1 transition-all font-bold placeholder:text-brand-muted text-brand-text"
            />
            <svg className="w-6 h-6 text-brand-muted absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full justify-start lg:justify-end">
            {/* Status Tabs */}
            <div className="bg-white p-1 rounded-xl border border-brand-border flex shadow-elevation-1">
              {['All', 'En attente', 'En cours', 'Terminé'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s as any)}
                  className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${filterStatus === s
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-brand-muted hover:text-brand-text'
                    }`}
                >
                  {s === 'All' ? 'Tous' : s}
                </button>
              ))}
            </div>

            {/* Service & Priority Filter */}
            <div className="flex items-center gap-3">
              <select className="bg-white border border-brand-border text-brand-text text-sm font-bold rounded-xl px-4 py-3 outline-none shadow-elevation-1 hover:border-brand-muted transition-colors">
                <option>Tous les services</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="bg-white border border-brand-border text-brand-text text-sm font-bold rounded-xl px-4 py-3 outline-none shadow-elevation-1 hover:border-brand-muted transition-colors"
              >
                <option value="All">Toutes les priorités</option>
                <option value="Basse">Basse</option>
                <option value="Normale">Moyenne</option>
                <option value="Urgente">Haute</option>
              </select>
              <button className="p-3 bg-white border border-brand-border rounded-xl shadow-elevation-1 text-brand-muted hover:text-brand-text hover:border-brand-muted transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Task Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <TaskTable tasks={filteredTasks} />
        )}
      </div>
    </div>
  );
}
