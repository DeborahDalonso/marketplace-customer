import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'varal.theme';

function currentTheme(): Theme {
    const forced = document.documentElement.dataset.theme;
    if (forced === 'light' || forced === 'dark') return forced;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Tema do sistema por padrão; o toggle grava data-theme e persiste a escolha. */
export function useTheme() {
    const [theme, setTheme] = useState<Theme>(currentTheme);

    useEffect(() => {
        const media = window.matchMedia?.('(prefers-color-scheme: dark)');
        if (!media) return;
        const onChange = () => {
            if (!document.documentElement.dataset.theme) setTheme(media.matches ? 'dark' : 'light');
        };
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, []);

    const toggle = useCallback(() => {
        const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            /* sem storage, vale só nesta visita */
        }
        setTheme(next);
    }, []);

    return { theme, toggle };
}
