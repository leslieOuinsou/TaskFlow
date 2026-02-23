'use client';

import { useEffect, useState, useRef } from 'react';
import { taskService } from '@/services/taskService';

export default function AttachmentsPage() {
    const [attachments, setAttachments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<any>(null);

    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadAttachments = async () => {
        try {
            const data = await taskService.getAttachments(0); // 0 for all for now
            setAttachments(data);
        } catch (error) {
            console.error('Error loading attachments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAttachments();
    }, []);

    const handleDeleteAttachment = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;
        try {
            await taskService.deleteAttachment(id);
            if (selectedFile?.id === id) setSelectedFile(null);
            loadAttachments();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const handleDownloadAttachment = (file: any) => {
        const url = taskService.getAttachmentUrl(file.file_path);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // Pour le bien de la démo, nous récupérons la première tâche disponible
            // ou utilisons une valeur par défaut. Dans un cas réel, taskId serait dynamique.
            const tasks = await taskService.getTasks();
            const taskId = tasks.length > 0 ? tasks[0].id : 1;

            await taskService.uploadAttachment(taskId, file);
            loadAttachments();
            alert('Fichier importé avec succès');
        } catch (error) {
            console.error('Upload error:', error);
            alert('Erreur lors de l\'importation');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const totalSize = attachments.reduce((acc, curr) => acc + curr.file_size, 0);
    const limitSize = 2000 * 1024 * 1024; // 2000 Mo
    const usagePercent = Math.min((totalSize / limitSize) * 100, 100);

    const handleExportAll = () => {
        if (attachments.length === 0) {
            alert('Aucun fichier à exporter');
            return;
        }
        window.location.href = taskService.getExportUrl(0); // 0 pour tout
    };

    return (
        <div className="min-h-screen bg-brand-bg px-4 sm:px-10 py-6 sm:py-10 max-w-[1400px] mx-auto">
            <div className="flex flex-col mb-6 sm:mb-8">
                <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">
                    <span>Demande #DEMO</span>
                    <span>/</span>
                    <span>Pièces jointes</span>
                </div>
                <div className="flex items-start sm:items-center justify-between gap-3">
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Gestion des Documents</h1>
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            onClick={handleExportAll}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-3 sm:px-6 py-2.5 sm:py-3 rounded-2xl transition-all flex items-center gap-2 shadow-xl shadow-blue-100 text-xs sm:text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span className="hidden sm:inline">Exporter tout (.zip)</span>
                            <span className="sm:hidden">Export</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* Storage Bar */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Espace de stockage utilisé</span>
                                <span className="text-xs font-bold text-black uppercase tracking-widest">
                                    {(totalSize / (1024 * 1024)).toFixed(0)} Mo / 2000 Mo ({usagePercent.toFixed(0)}%)
                                </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-500 rounded-full"
                                    style={{ width: `${usagePercent}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Upload Box */}
                    <div className="bg-white p-12 rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6 border-4 border-white shadow-lg shadow-blue-50">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-widest">Glissez-déposez vos fichiers ici</h3>
                        <p className="text-xs text-black font-bold max-w-sm mb-8 uppercase tracking-wide opacity-80">
                            Ou cliquez pour parcourir vos documents. Supporte PDF, JPG, PNG et XLSX jusqu'à 20 Mo par fichier.
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? 'Importation...' : 'Ajouter un fichier'}
                        </button>
                    </div>

                    {/* Recent Files Table */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Fichiers récents <span className="ml-2 text-blue-600 opacity-30">{attachments.length} éléments</span></h3>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="p-6 text-[10px] font-black text-black uppercase tracking-widest">Nom du fichier</th>
                                    <th className="p-6 text-[10px] font-black text-black uppercase tracking-widest">Type</th>
                                    <th className="p-6 text-[10px] font-black text-black uppercase tracking-widest">Taille</th>
                                    <th className="p-6 text-[10px] font-black text-black uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {attachments.map((file) => (
                                    <tr
                                        key={file.id}
                                        onClick={() => setSelectedFile(file)}
                                        className={`group cursor-pointer transition-all ${selectedFile?.id === file.id ? 'bg-blue-50/50' : 'hover:bg-gray-50/50'}`}
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-gray-900">{file.file_name}</span>
                                                    <span className="text-[10px] font-bold text-black uppercase">{file.file_type.split('/')[1] || 'FILE'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 uppercase">
                                            <span className="px-2 py-1 bg-gray-50 text-black/60 rounded-lg text-[10px] font-black border border-gray-100">
                                                {file.file_name.split('.').pop()}
                                            </span>
                                        </td>
                                        <td className="p-6 text-xs text-black font-bold uppercase tracking-widest">
                                            {(file.file_size / (1024 * 1024)).toFixed(1)} MB
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedFile(file); }}
                                                    className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-sm"
                                                    title="Aperçu"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDownloadAttachment(file); }}
                                                    className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all shadow-sm"
                                                    title="Télécharger"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteAttachment(file.id); }}
                                                    className="p-2 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm"
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
                                {attachments.length === 0 && (
                                    <tr><td colSpan={4} className="p-20 text-center text-black/50 font-bold uppercase tracking-widest">Aucun document importé.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Preview Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden sticky top-8">
                        <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                            <h3 className="text-xs font-black text-black/50 uppercase tracking-widest">Aperçu du fichier</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDownloadAttachment(selectedFile)}
                                    className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDeleteAttachment(selectedFile.id)}
                                    className="p-2 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-10 flex flex-col items-center">
                            {selectedFile ? (
                                <>
                                    <div className="w-full aspect-video bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center mb-8 overflow-hidden shadow-inner relative group/preview">
                                        {selectedFile.file_type.includes('image') ? (
                                            <img
                                                src={taskService.getAttachmentUrl(selectedFile.file_path)}
                                                alt={selectedFile.file_name}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : selectedFile.file_type.includes('pdf') ? (
                                            <iframe
                                                src={taskService.getAttachmentUrl(selectedFile.file_path)}
                                                className="w-full h-full border-none"
                                                title="PDF Preview"
                                            />
                                        ) : (
                                            <div className="text-center flex flex-col items-center gap-4">
                                                <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-blue-600">
                                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <span className="text-gray-400 font-black uppercase tracking-widest text-[10px]">
                                                    Aperçu non disponible pour ce type de fichier
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => window.open(taskService.getAttachmentUrl(selectedFile.file_path), '_blank')}
                                                className="bg-white/90 backdrop-blur text-gray-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-white transition-all active:scale-95"
                                            >
                                                Ouvrir plein écran
                                            </button>
                                        </div>
                                    </div>
                                    <div className="w-full space-y-6">
                                        <h4 className="text-[10px] font-black text-black/50 uppercase tracking-wider">Métadonnées</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Format</p>
                                                <p className="text-xs font-black text-gray-700 uppercase">{selectedFile.file_type.split('/')[1] || selectedFile.file_name.split('.').pop()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Taille</p>
                                                <p className="text-xs font-black text-gray-700">{(selectedFile.file_size / (1024 * 1024)).toFixed(1)} MB</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Importé le</p>
                                                <p className="text-xs font-black text-gray-700">{new Date(selectedFile.created_at).toLocaleString('fr-FR')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="py-20 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-6 border-2 border-dashed border-gray-100">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Sélectionnez un fichier pour voir les détails</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
