import { Priority } from '@/types/task';

interface PriorityBadgeProps {
    priority: Priority;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
    const styles = {
        'Basse': 'bg-brand-surface text-brand-muted border-brand-border',
        'Normale': 'bg-primary-variant/10 text-primary-variant border-primary-variant/20',
        'Urgente': 'bg-danger/10 text-danger border-danger/20',
    }[priority];

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wide ${styles}`}>
            {priority === 'Normale' ? 'Moyenne' : priority}
        </span>
    );
}
