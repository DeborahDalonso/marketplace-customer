import { createContext, useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export type ToastKind = 'success' | 'error' | 'info';

export interface ToastMessage {
    id: number;
    kind: ToastKind;
    text: string;
}

export interface ToastContextValue {
    toasts: ToastMessage[];
    notify: (kind: ToastKind, text: string) => void;
    dismiss: (id: number) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 4500;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const sequence = useRef(0);

    const dismiss = useCallback((id: number) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const notify = useCallback(
        (kind: ToastKind, text: string) => {
            sequence.current += 1;
            const id = sequence.current;
            // No máximo três avisos na tela; o mais antigo sai
            setToasts((current) => [...current.slice(-2), { id, kind, text }]);
            setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
        },
        [dismiss],
    );

    const value = useMemo(() => ({ toasts, notify, dismiss }), [toasts, notify, dismiss]);

    return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
