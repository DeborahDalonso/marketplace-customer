import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthSession, LoginInput, RegisterInput, User } from '../types/User';
import * as authService from '../services/auth';
import { setAccessToken } from '../services/http';

const STORAGE_KEY = 'varal.session';

export interface AuthContextValue {
    user: User | null;
    ready: boolean;
    login: (input: LoginInput) => Promise<User>;
    register: (input: RegisterInput) => Promise<User>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): AuthSession | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as AuthSession) : null;
    } catch {
        return null;
    }
}

function writeSession(session: AuthSession | null): void {
    try {
        if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        else localStorage.removeItem(STORAGE_KEY);
    } catch {
        /* sem localStorage a sessão dura só até o reload */
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [ready, setReady] = useState(false);

    // O token volta para a memória antes da primeira chamada autenticada
    useEffect(() => {
        const session = readSession();
        if (session) {
            setAccessToken(session.accessToken);
            setUser(session.user);
        }
        setReady(true);
    }, []);

    const apply = useCallback((session: AuthSession): User => {
        setAccessToken(session.accessToken);
        writeSession(session);
        setUser(session.user);
        return session.user;
    }, []);

    const login = useCallback(async (input: LoginInput) => apply(await authService.login(input)), [apply]);
    const register = useCallback(async (input: RegisterInput) => apply(await authService.register(input)), [apply]);

    const logout = useCallback(() => {
        setAccessToken(null);
        writeSession(null);
        setUser(null);
    }, []);

    const value = useMemo(() => ({ user, ready, login, register, logout }), [user, ready, login, register, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
