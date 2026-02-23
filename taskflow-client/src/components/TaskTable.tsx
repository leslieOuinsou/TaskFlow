'use client';

import { Task } from '@/types/task';
import { taskService } from '@/services/taskService';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import Link from 'next/link';

interface TaskTableProps {
    tasks: Task[];
}

export default function TaskTable({ tasks }: TaskTableProps) {
    const handleDelete = async (taskId: number) => {
        if (confirm('Supprimer définitivement cette tâche ?')) {
            try {
                await taskService.deleteTask(taskId);
                window.location.reload();
            } catch {
                alert('Erreur lors de la suppression');
            }
        }
    };

    if (tasks.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-brand-border shadow-elevation-1 p-12 text-center">
                <p className="text-brand-muted font-bold">Aucune tâche trouvée.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-brand-border shadow-elevation-1 overflow-hidden">

            {/* ── Mobile: card list ── */}
            <div className="lg:hidden divide-y divide-brand-border">
                {tasks.map((task) => (
                    <div key={task.id} className="p-4 hover:bg-brand-surface transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-0.5">
                                    TK-{1000 + task.id}
                                </p>
                                <p className="text-sm font-black text-brand-text truncate">{task.title}</p>
                                {task.description && (
                                    <p className="text-xs text-brand-muted mt-0.5 line-clamp-1">{task.description}</p>
                                )}
                            </div>
                            <StatusBadge status={task.status} />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                            <PriorityBadge priority={task.priority} />
                            {task.service && (
                                <span className="text-[10px] font-bold text-brand-muted bg-brand-surface px-2 py-0.5 rounded-lg border border-brand-border">
                                    {task.service}
                                </span>
                            )}
                            <span className="text-[10px] font-bold text-brand-muted ml-auto">
                                {new Date(task.created_at).toLocaleDateString('fr-FR')}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={`/tasks/${task.id}`}
                                className="flex-1 text-center py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-primary/20"
                            >
                                Détails
                            </Link>
                            <button
                                onClick={() => handleDelete(task.id)}
                                className="p-2 bg-danger/10 text-danger hover:bg-danger hover:text-white border border-danger/20 rounded-xl transition-all"
                                title="Supprimer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Desktop: table ── */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-brand-surface border-b border-brand-border">
                            <th className="px-6 py-4 text-xs font-bold text-brand-text uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-brand-text uppercase tracking-wider">Titre de la tâche</th>
                            <th className="px-6 py-4 text-xs font-bold text-brand-text uppercase tracking-wider">Service</th>
                            <th className="px-6 py-4 text-xs font-bold text-brand-text uppercase tracking-wider">Priorité</th>
                            <th className="px-6 py-4 text-xs font-bold text-brand-text uppercase tracking-wider text-center">Statut</th>
                            <th className="px-6 py-4 text-xs font-bold text-brand-text uppercase tracking-wider text-right">Création</th>
                            <th className="px-6 py-4 text-xs font-bold text-brand-text uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {tasks.map((task) => (
                            <tr key={task.id} className="hover:bg-brand-surface transition-colors group">
                                <td className="px-6 py-4 text-sm font-semibold text-brand-text">
                                    TK-{1000 + task.id}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-brand-text group-hover:text-primary transition-colors">
                                            {task.title}
                                        </span>
                                        <span className="text-xs text-brand-text mt-0.5 font-bold truncate max-w-[200px]">
                                            {task.description}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-black text-brand-text">{task.service || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <PriorityBadge priority={task.priority} />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <StatusBadge status={task.status} />
                                </td>
                                <td className="px-6 py-4 text-sm text-brand-muted font-black text-right">
                                    {new Date(task.created_at).toLocaleDateString('fr-FR')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/tasks/${task.id}`}
                                            className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-primary/20 shadow-sm"
                                        >
                                            Détails
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="p-2 bg-danger/10 text-danger hover:bg-danger hover:text-white border border-danger/20 rounded-xl transition-all shadow-sm"
                                            title="Supprimer"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-4 sm:px-6 py-4 border-t border-brand-border bg-brand-surface flex items-center justify-between">
                <p className="text-sm text-brand-muted font-bold">
                    <span className="font-black text-brand-text">{tasks.length}</span> tâche{tasks.length > 1 ? 's' : ''}
                </p>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-sm font-bold text-brand-muted bg-white border border-brand-border rounded-lg cursor-not-allowed">Préc.</button>
                    <button className="px-3 py-1.5 text-sm font-bold text-brand-text bg-white border border-brand-border rounded-lg hover:bg-brand-surface transition-colors">Suiv.</button>
                </div>
            </div>
        </div>
    );
}
