'use client';

import { useEffect, useState } from 'react';
import { taskService } from '@/services/taskService';

interface HistoryModalProps {
    taskId: number;
    taskTitle: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function HistoryModal({ taskId, taskTitle, isOpen, onClose }: HistoryModalProps) {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            taskService.getHistory(taskId)
                .then(setHistory)
                .finally(() => setLoading(false));
        }
    }, [isOpen, taskId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Historique d'activité</h2>
                        <p className="text-sm text-gray-500">{taskTitle}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Chargement...</div>
                    ) : history.length > 0 ? (
                        <div className="space-y-4">
                            {history.map((item) => (
                                <div key={item.id} className="border-l-2 border-blue-500 pl-4 py-2">
                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                        <span className="font-semibold uppercase">{item.action_type}</span>
                                        <span>{new Date(item.created_at).toLocaleString('fr-FR')}</span>
                                    </div>
                                    <p className="text-gray-700 text-sm">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-10 text-gray-500">Aucun historique pour cette tâche.</p>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                    Fermer
                </button>
            </div>
        </div>
    );
}
