'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Task, Status } from '@/types/task';
import { taskService } from '@/services/taskService';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';

function TaskDetailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [task, setTask] = useState<Task | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ title: '', description: '' });

    const loadAll = async () => {
        if (!id) return;
        try {
            const [t, c, h] = await Promise.all([
                taskService.getTask(Number(id)),
                taskService.getComments(Number(id)),
                taskService.getHistory(Number(id))
            ]);
            setTask(t);
            setComments(c);
            setHistory(h);
            setEditData({ title: t.title, description: t.description || '' });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
    }, [id]);

    const handleUpdateStatus = async (status: Status) => {
        if (!task) return;
        try {
            await taskService.updateTask({ id: task.id, status });
            loadAll();
        } catch (err) {
            alert('Erreur lors de la mise à jour du statut');
        }
    };

    const handleSaveEdit = async () => {
        if (!task) return;
        try {
            await taskService.updateTask({
                id: task.id,
                title: editData.title,
                description: editData.description
            });
            setIsEditing(false);
            loadAll();
        } catch (err) {
            alert('Erreur lors de la sauvegarde');
        }
    };

    const handleDeleteTask = async () => {
        if (!task || !confirm('Supprimer définitivement cette tâche ?')) return;
        try {
            await taskService.deleteTask(task.id);
            router.push('/');
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !task) return;

        setIsSubmitting(true);
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            router.push('/login');
            return;
        }

        try {
            const user = JSON.parse(userStr);
            await taskService.addComment(task.id, user.id, newComment);
            setNewComment('');
            loadAll();
        } catch (err) {
            alert('Erreur lors de l’ajout du commentaire');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-brand-bg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (!task) return <div className="p-20 text-center">Tâche introuvable</div>;

    return (
        <div className="min-h-screen bg-brand-bg py-6 sm:py-10">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

                {/* Top bar with Status and Back */}
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        href="/"
                        className="p-2 bg-white border border-brand-border rounded-lg shadow-elevation-1 text-brand-muted hover:text-brand-text transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <StatusBadge status={task.status} />
                </div>

                {/* Path breadcrumb */}
                <div className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span>Tableau de bord</span>
                    <span>/</span>
                    <span className="text-brand-text">TK-{1000 + task.id}</span>
                </div>

                <div className="flex items-start sm:items-center justify-between mb-6 sm:mb-10 gap-3">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editData.title}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            className="text-xl sm:text-3xl font-extrabold text-brand-text bg-white border border-primary/20 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none w-full max-w-2xl shadow-elevation-1"
                        />
                    ) : (
                        <h1 className="text-xl sm:text-3xl font-extrabold text-brand-text leading-tight">{task.title}</h1>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">

                        <div className="bg-white rounded-2xl border border-brand-border shadow-elevation-1 p-8">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-surface">
                                <h2 className="text-lg font-bold text-brand-text">Description</h2>
                                <div className="flex items-center gap-2 text-xs font-bold text-brand-muted">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                    Pièces jointe (0)
                                </div>
                            </div>
                            {isEditing ? (
                                <textarea
                                    value={editData.description}
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                    className="w-full bg-white border border-primary/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-elevation-1 resize-none min-h-[200px] text-brand-text"
                                />
                            ) : (
                                <p className="text-brand-text leading-relaxed whitespace-pre-wrap">{task.description || "Aucune description fournie."}</p>
                            )}
                        </div>

                        {/* Comments Area */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <h2 className="text-xl font-bold text-brand-text">Commentaires</h2>
                            </div>

                            {/* Comment list */}
                            <div className="space-y-6">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-4 group">
                                        <div className="w-10 h-10 rounded-full bg-brand-surface flex-shrink-0 flex items-center justify-center text-sm font-bold text-brand-text border border-brand-border">
                                            {comment.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-bold text-brand-text">{comment.full_name || comment.username}</span>
                                                <span className="text-[10px] font-bold text-brand-muted">{new Date(comment.created_at).toLocaleString('fr-FR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className="bg-white p-4 rounded-xl border border-brand-border shadow-elevation-1 text-sm text-brand-text">
                                                {comment.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* New Comment Form */}
                                <div className="flex gap-4 pt-4 border-t border-brand-border">
                                    <div className="w-10 h-10 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-primary/10">
                                        {(() => {
                                            const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
                                            const name = user.full_name || user.username || 'U';
                                            return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
                                        })()}
                                    </div>
                                    <form onSubmit={handleAddComment} className="flex-1 space-y-3">
                                        <textarea
                                            placeholder="Écrivez un commentaire ou mentionnez quelqu'un..."
                                            className="w-full bg-white border border-brand-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-elevation-1 resize-none text-brand-text"
                                            rows={4}
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                        />
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting || !newComment.trim()}
                                                className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold px-6 py-2 rounded-lg text-sm transition-all shadow-lg shadow-primary/10"
                                            >
                                                {isSubmitting ? 'Envoi...' : 'Publier le commentaire'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">

                        {/* Action & Status Card */}
                        <div className="bg-white rounded-2xl border border-brand-border shadow-elevation-1 p-6">
                            <h3 className="text-[10px] font-extrabold text-brand-muted uppercase tracking-widest mb-4">Action & Statut</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[11px] font-bold text-brand-muted mb-2 block">Modifier le statut</label>
                                    <select
                                        value={task.status}
                                        onChange={(e) => handleUpdateStatus(e.target.value as Status)}
                                        className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer text-brand-text"
                                    >
                                        <option value="En attente">En attente</option>
                                        <option value="En cours">En cours</option>
                                        <option value="Terminé">Terminé</option>
                                    </select>
                                </div>
                                {isEditing ? (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleSaveEdit}
                                            className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white font-extrabold rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-primary/10"
                                        >
                                            Enregistrer
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditData({ title: task.title, description: task.description || '' });
                                            }}
                                            className="flex-1 py-3 bg-white border border-brand-border text-brand-text font-extrabold rounded-xl text-[10px] uppercase tracking-widest hover:bg-brand-surface transition-all"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="py-3 bg-primary/10 hover:bg-primary/20 text-primary font-extrabold rounded-xl text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-primary/20"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Modifier
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (confirm('Archiver cette demande ?')) {
                                                    await taskService.archiveTask(task.id);
                                                    router.push('/tasks/archives');
                                                }
                                            }}
                                            className="py-3 bg-brand-surface hover:bg-gray-100 text-brand-text font-extrabold rounded-xl text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-brand-border"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                            </svg>
                                            Archiver
                                        </button>
                                        <button
                                            onClick={handleDeleteTask}
                                            className="col-span-2 py-3.5 bg-danger/10 hover:bg-danger hover:text-white text-danger font-extrabold rounded-xl text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-danger/20 shadow-sm"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Supprimer définitivement
                                        </button>
                                    </div>
                                )}
                                <div className="flex items-center justify-between py-3 border-t border-brand-surface">
                                    <div className="flex items-center gap-2 text-xs font-bold text-brand-muted">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 11h.01M7 15h.01M13 7h.01M13 11h.01M13 15h.01M17 7h.01M17 11h.01M17 15h.01" />
                                        </svg>
                                        Priorité
                                    </div>
                                    <PriorityBadge priority={task.priority} />
                                </div>
                                <div className="flex items-center justify-between py-3 border-t border-brand-surface">
                                    <div className="flex items-center gap-2 text-xs font-bold text-brand-muted">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Service
                                    </div>
                                    <span className="text-sm font-bold text-brand-text">{task.service || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Informations Card */}
                        <div className="bg-white rounded-2xl border border-brand-border shadow-elevation-1 p-6">
                            <h3 className="text-[10px] font-extrabold text-brand-muted uppercase tracking-widest mb-6">Informations</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-0.5">Créateur</p>
                                        <p className="text-sm font-bold text-brand-text">Utilisateur #{task.user_id}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-0.5">Date de création</p>
                                        <p className="text-sm font-bold text-brand-text">{new Date(task.created_at).toLocaleString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Historique Card */}
                        <div className="bg-white rounded-2xl border border-brand-border shadow-elevation-1 p-6 pb-2">
                            <h3 className="text-[10px] font-extrabold text-brand-muted uppercase tracking-widest mb-6">Historique d'activité</h3>
                            <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-0 before:w-0.5 before:bg-brand-surface">
                                {history.map((h, idx) => (
                                    <div key={h.id} className="flex gap-4 relative">
                                        <div className="w-8 h-8 rounded-full bg-white border-2 border-primary/20 flex items-center justify-center z-10">
                                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div className="pb-6">
                                            <p className="text-sm font-bold text-brand-text leading-tight">{h.action_type}</p>
                                            {h.description && <p className="text-xs text-brand-muted mt-1">{h.description}</p>}
                                            <p className="text-[10px] font-bold text-brand-muted mt-1 uppercase">{new Date(h.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                ))}
                                {history.length === 0 && (
                                    <div className="flex gap-4 relative">
                                        <div className="w-8 h-8 rounded-full bg-white border-2 border-brand-border flex items-center justify-center z-10">
                                            <svg className="w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="pb-6">
                                            <p className="text-sm font-bold text-brand-muted">Aucune activité enregistrée.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TaskDetailPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-screen bg-brand-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        }>
            <TaskDetailContent />
        </Suspense>
    );
}
