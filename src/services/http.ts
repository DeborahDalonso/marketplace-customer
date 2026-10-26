import type { ApiResponse, FieldError } from '../types/ApiResponse';
import { t } from '../i18n/pt-BR';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface HttpRequest {
    method: HttpMethod;
    url: string;
    body?: unknown;
    token: string | null;
}

export interface HttpReply {
    status: number;
    body: unknown;
}

/** Quem de fato fala com a rede. O modo mock troca só esta função; o envelope é tratado aqui. */
export type Transport = (request: HttpRequest) => Promise<HttpReply>;

export class ApiError extends Error {
    readonly status: number;
    readonly errors: FieldError[];

    constructor(message: string, status: number, errors: FieldError[] = []) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.errors = errors;
    }

    get isUnauthorized(): boolean {
        return this.status === 401;
    }

    get isNotFound(): boolean {
        return this.status === 404;
    }

    fieldMessage(field: string): string | undefined {
        return this.errors.find((error) => error.field === field)?.message;
    }
}

// ==== Token em memória ====
// O AuthContext persiste no localStorage; aqui só fica a cópia que vai no header.

let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
    accessToken = token;
}

export function getAccessToken(): string | null {
    return accessToken;
}

// ==== Transport ====

async function fetchTransport({ method, url, body, token }: HttpRequest): Promise<HttpReply> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    // 204 e corpos vazios não têm JSON; o envelope é reconstruído como sucesso sem dados
    const text = await response.text();
    const parsed: unknown = text ? JSON.parse(text) : { success: response.ok, message: null, data: null };
    return { status: response.status, body: parsed };
}

let transport: Transport = fetchTransport;

export function setTransport(next: Transport | null): void {
    transport = next ?? fetchTransport;
}

// ==== Request ====

function isEnvelope(value: unknown): value is ApiResponse<unknown> {
    return typeof value === 'object' && value !== null && 'success' in value;
}

function buildUrl(baseUrl: string, path: string, query?: Record<string, string | number | undefined>): string {
    const url = new URL(path, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
    for (const [key, value] of Object.entries(query ?? {})) {
        if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
    }
    return url.toString();
}

export interface RequestOptions {
    method?: HttpMethod;
    body?: unknown;
    query?: Record<string, string | number | undefined>;
}

/**
 * Faz a chamada, abre o envelope { success, message, data } e devolve só o data.
 * Qualquer resposta com success false, ou fora do envelope, vira ApiError.
 */
export async function request<T>(baseUrl: string, path: string, options: RequestOptions = {}): Promise<T> {
    const url = buildUrl(baseUrl, path.replace(/^\//, ''), options.query);

    let reply: HttpReply;
    try {
        reply = await transport({ method: options.method ?? 'GET', url, body: options.body, token: accessToken });
    } catch {
        throw new ApiError(t.toast.networkError, 0);
    }

    if (!isEnvelope(reply.body)) throw new ApiError(t.toast.genericError, reply.status || 500);
    if (!reply.body.success) throw new ApiError(reply.body.message, reply.status, reply.body.errors ?? []);

    return reply.body.data as T;
}

export const baseUrls = {
    catalog: import.meta.env.VITE_CATALOG_URL ?? 'http://localhost:3001',
    orders: import.meta.env.VITE_ORDERS_URL ?? 'http://localhost:3002',
    auth: import.meta.env.VITE_AUTH_URL ?? 'http://localhost:3003',
};
