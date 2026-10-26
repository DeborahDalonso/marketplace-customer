import type { ReactNode } from 'react';
import '../styles/components/empty-state.css';

interface EmptyStateProps {
    title: string;
    text: string;
    action?: ReactNode;
    tone?: 'neutral' | 'error';
}

export function EmptyState({ title, text, action, tone = 'neutral' }: EmptyStateProps) {
    return (
        <div className={`empty-state empty-state--${tone}`} role={tone === 'error' ? 'alert' : undefined}>
            <span className="empty-state__peg" aria-hidden="true" />
            <h3>{title}</h3>
            <p>{text}</p>
            {action ? <div className="empty-state__action">{action}</div> : null}
        </div>
    );
}
