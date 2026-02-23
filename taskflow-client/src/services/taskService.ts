import { Task, CreateTaskData, UpdateTaskData } from '../types/task';

const API_URL = 'http://127.0.0.1:8000/api/tasks';
const AUTH_URL = 'http://127.0.0.1:8000/api/auth.php';

export const taskService = {
    async getTasks(search = ''): Promise<Task[]> {
        const url = search ? `${API_URL}/index.php?search=${encodeURIComponent(search)}` : `${API_URL}/index.php`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    },

    async getTask(id: number): Promise<Task> {
        const response = await fetch(`${API_URL}/index.php?id=${id}`);
        if (!response.ok) throw new Error('Failed to fetch task');
        return response.json();
    },

    async createTask(data: CreateTaskData): Promise<void> {
        const response = await fetch(`${API_URL}/index.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create task');
    },

    async updateTask(data: UpdateTaskData): Promise<void> {
        const response = await fetch(`${API_URL}/update.php`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update task');
    },

    async archiveTask(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/archive.php?id=${id}&action=archive`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to archive task');
    },

    async restoreTask(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/archive.php?id=${id}&action=restore`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to restore task');
    },

    async deleteArchivedTask(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/archive.php?id=${id}&action=delete`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete task');
    },

    async deleteTask(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/index.php?id=${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete task');
    },

    async getArchivedTasks(): Promise<Task[]> {
        const response = await fetch(`${API_URL}/archive.php`);
        if (!response.ok) throw new Error('Failed to fetch archived tasks');
        return response.json();
    },

    async getAttachments(taskId: number): Promise<any[]> {
        const response = await fetch(`${API_URL}/attachments.php?task_id=${taskId}`);
        if (!response.ok) throw new Error('Failed to fetch attachments');
        return response.json();
    },

    async uploadAttachment(taskId: number, file: File): Promise<void> {
        const formData = new FormData();
        formData.append('task_id', taskId.toString());
        formData.append('file', file);
        const response = await fetch(`${API_URL}/attachments.php`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error('Failed to upload file');
    },

    async deleteAttachment(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/attachments.php?id=${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete attachment');
    },

    getAttachmentUrl(filePath: string): string {
        return `http://127.0.0.1:8000/uploads/${filePath}`;
    },

    getExportUrl(taskId: number): string {
        return `${API_URL}/export.php?task_id=${taskId}`;
    },

    async getComments(taskId: number): Promise<any[]> {
        const response = await fetch(`${API_URL}/comments.php?task_id=${taskId}`);
        if (!response.ok) throw new Error('Failed to fetch comments');
        return response.json();
    },

    async addComment(taskId: number, userId: number, content: string): Promise<void> {
        const response = await fetch(`${API_URL}/comments.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task_id: taskId, user_id: userId, content }),
        });
        if (!response.ok) throw new Error('Failed to add comment');
    },

    async getHistory(taskId: number): Promise<any[]> {
        const response = await fetch(`${API_URL}/history.php?task_id=${taskId}`);
        if (!response.ok) throw new Error('Failed to fetch history');
        return response.json();
    },

    async login(email: string, password: string): Promise<any> {
        const response = await fetch(`${AUTH_URL}?action=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },

    async register(full_name: string, email: string, username: string, password: string, service: string): Promise<void> {
        const response = await fetch(`${AUTH_URL}?action=register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name, email, username, password, service }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }
    },

    async getNotifications(userId: number): Promise<{ notifications: any[]; unread_count: number }> {
        const response = await fetch(`${API_URL}/notifications.php?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch notifications');
        return response.json();
    },

    async markAllNotificationsRead(userId: number): Promise<void> {
        await fetch(`${API_URL}/notifications.php`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, mark_all: true }),
        });
    },

    async markNotificationRead(id: number): Promise<void> {
        await fetch(`${API_URL}/notifications.php`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
    },
};
