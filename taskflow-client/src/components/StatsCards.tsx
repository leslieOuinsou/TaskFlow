'use client';

interface StatsCardsProps {
    total: number;
    pending: number;
    urgent: number;
    completed: number;
}

export default function StatsCards({ total, pending, urgent, completed }: StatsCardsProps) {
    const stats = [
        {
            label: 'Total des tâches',
            value: total,
            icon: (
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            bgColor: 'bg-primary/10',
        },
        {
            label: 'En attente',
            value: pending,
            icon: (
                <svg className="w-5 h-5 text-status-pending" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'bg-status-pending/10',
        },
        {
            label: 'Urgences',
            value: urgent.toString().padStart(2, '0'),
            icon: (
                <svg className="w-5 h-5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            bgColor: 'bg-danger/10',
        },
        {
            label: 'Complétées',
            value: completed,
            icon: (
                <svg className="w-5 h-5 text-status-complete" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'bg-status-complete/10',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-brand-border shadow-elevation-1 flex items-center gap-4">
                    <div className={`${stat.bgColor} p-3 rounded-xl`}>
                        {stat.icon}
                    </div>
                    <div>
                        <p className="text-xs font-black text-brand-muted uppercase tracking-wider mb-0.5">{stat.label}</p>
                        <p className="text-2xl font-black text-brand-text">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
