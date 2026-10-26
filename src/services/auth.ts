import { baseUrls, request } from './http';
import type { AuthSession, LoginInput, RegisterInput } from '../types/User';

export function login(input: LoginInput): Promise<AuthSession> {
    return request<AuthSession>(baseUrls.auth, '/auth/login', { method: 'POST', body: input });
}

export function register(input: RegisterInput): Promise<AuthSession> {
    return request<AuthSession>(baseUrls.auth, '/auth/register', { method: 'POST', body: input });
}
