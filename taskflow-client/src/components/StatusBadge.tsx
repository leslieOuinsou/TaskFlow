import { Status } from '@/types/task';

interface StatusBadgeProps {
    status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const bgColor = {
        'En attente': 'bg-status-pending/10 text-status-pending border-status-pending/20',
        'En cours': 'bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20',
        'Terminé': 'bg-status-complete/10 text-status-complete border-status-complete/20',
    }[status];

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${bgColor}`}>
            {status}
        </span>
    );
}
