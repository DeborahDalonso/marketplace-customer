export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

export interface AuthSession {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
}
