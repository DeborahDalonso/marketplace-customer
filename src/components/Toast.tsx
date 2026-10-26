import { useToast } from '../hooks/useToast';
import { t } from '../i18n/pt-BR';
import '../styles/components/toast.css';

export function Toast() {
    const { toasts, dismiss } = useToast();

    return (
        <div className="toast-stack" aria-live="polite" aria-atomic="false">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`toast toast--${toast.kind}`}
                    role={toast.kind === 'error' ? 'alert' : 'status'}
                >
                    <span className="toast__text">{toast.text}</span>
                    <button
                        type="button"
                        className="toast__close"
                        onClick={() => dismiss(toast.id)}
                        aria-label={t.toast.close}
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                            <path
                                d="M2 2l10 10M12 2L2 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
}
