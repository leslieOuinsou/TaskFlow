export type Priority = 'Basse' | 'Normale' | 'Urgente';
export type Status = 'En attente' | 'En cours' | 'Terminé';

export interface Task {
    id: number;
    user_id: number;
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    service: string;
    created_at: string;
    updated_at: string;
}

export interface CreateTaskData {
    title: string;
    description: string;
    priority: string;
    service: string;
    user_id: number;
}

export interface UpdateTaskData {
    id: number;
    status?: Status;
    comment?: string;
    title?: string;
    description?: string;
}
