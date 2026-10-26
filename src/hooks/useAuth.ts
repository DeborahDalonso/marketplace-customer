import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { AuthContextValue } from '../contexts/AuthContext';

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth precisa estar dentro de AuthProvider');
    return context;
}
