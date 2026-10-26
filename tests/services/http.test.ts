import { ApiError, request, setAccessToken, setTransport } from '../../src/services/http';
import type { HttpRequest } from '../../src/services/http';
import { t } from '../../src/i18n/pt-BR';

const BASE = 'http://catalog.test';

interface FetchCall {
    url: string;
    init: RequestInit;
}

// Substitui o fetch do jsdom por um que grava a chamada e devolve o que o teste mandar
function fakeFetch(status: number, body: unknown): FetchCall[] {
    const calls: FetchCall[] = [];
    globalThis.fetch = async (input, init) => {
        calls.push({ url: String(input), init: init ?? {} });
        // Response recusa corpo em 204, por isso null em vez de string vazia
        const text = body === undefined ? null : JSON.stringify(body);
        return new Response(text, { status, headers: { 'Content-Type': 'application/json' } });
    };
    return calls;
}

const originalFetch = globalThis.fetch;

afterEach(() => {
    globalThis.fetch = originalFetch;
    setAccessToken(null);
    setTransport(null);
});

describe('request', () => {
    test('abre o envelope e devolve só o data', async () => {
        fakeFetch(200, { success: true, message: null, data: { id: 'prd_1' } });

        await expect(request<{ id: string }>(BASE, '/products/prd_1')).resolves.toEqual({ id: 'prd_1' });
    });

    test('anexa o Bearer quando há token em memória e omite quando não há', async () => {
        const calls = fakeFetch(200, { success: true, message: null, data: null });

        await request(BASE, '/orders/mine');
        setAccessToken('token-123');
        await request(BASE, '/orders/mine');

        const [anonymous, authenticated] = calls;
        expect(new Headers(anonymous?.init.headers).get('Authorization')).toBeNull();
        expect(new Headers(authenticated?.init.headers).get('Authorization')).toBe('Bearer token-123');
    });

    test('monta a query ignorando valores vazios e indefinidos', async () => {
        const calls = fakeFetch(200, { success: true, message: null, data: [] });

        await request(BASE, '/products', { query: { q: 'caneca', page: 2, categoryId: undefined, perPage: '' } });

        expect(calls[0]?.url).toBe(`${BASE}/products?q=caneca&page=2`);
    });

    test('serializa o corpo como JSON e marca o content-type', async () => {
        const calls = fakeFetch(201, { success: true, message: null, data: null });

        await request(BASE, '/orders', { method: 'POST', body: { paymentMethod: 'pix' } });

        expect(calls[0]?.init.method).toBe('POST');
        expect(calls[0]?.init.body).toBe('{"paymentMethod":"pix"}');
        expect(new Headers(calls[0]?.init.headers).get('Content-Type')).toBe('application/json');
    });

    test('envelope com success false vira ApiError com status, mensagem e erros por campo', async () => {
        fakeFetch(422, {
            success: false,
            message: 'Dados inválidos',
            errors: [{ field: 'email', message: 'e-mail inválido' }],
        });

        const failure = await request(BASE, '/auth/register', { method: 'POST', body: {} }).catch(
            (caught: unknown) => caught,
        );

        expect(failure).toBeInstanceOf(ApiError);
        const error = failure as ApiError;
        expect(error.status).toBe(422);
        expect(error.message).toBe('Dados inválidos');
        expect(error.fieldMessage('email')).toBe('e-mail inválido');
        expect(error.fieldMessage('name')).toBeUndefined();
    });

    test('expõe atalhos para 401 e 404', async () => {
        fakeFetch(404, { success: false, message: 'Produto não encontrado' });

        const error = (await request(BASE, '/products/x').catch((caught: unknown) => caught)) as ApiError;

        expect(error.isNotFound).toBe(true);
        expect(error.isUnauthorized).toBe(false);
        expect(error.errors).toEqual([]);
    });

    test('resposta fora do envelope vira erro genérico com o status HTTP', async () => {
        fakeFetch(502, { html: '<h1>Bad Gateway</h1>' });

        const error = (await request(BASE, '/products').catch((caught: unknown) => caught)) as ApiError;

        expect(error).toBeInstanceOf(ApiError);
        expect(error.status).toBe(502);
        expect(error.message).toBe(t.toast.genericError);
    });

    test('falha de rede vira ApiError com status zero', async () => {
        globalThis.fetch = async () => {
            throw new TypeError('Failed to fetch');
        };

        const error = (await request(BASE, '/products').catch((caught: unknown) => caught)) as ApiError;

        expect(error.status).toBe(0);
        expect(error.message).toBe(t.toast.networkError);
    });

    test('corpo vazio com 204 conta como sucesso sem dados', async () => {
        fakeFetch(204, undefined);

        await expect(request(BASE, '/products/prd_1/views', { method: 'POST' })).resolves.toBeNull();
    });

    test('um transport alternativo recebe método, url, corpo e token', async () => {
        const received: HttpRequest[] = [];
        setTransport(async (input) => {
            received.push(input);
            return { status: 200, body: { success: true, message: null, data: 'ok' } };
        });
        setAccessToken('abc');

        await request(BASE, '/orders', { method: 'POST', body: { items: [] } });

        expect(received[0]).toEqual({ method: 'POST', url: `${BASE}/orders`, body: { items: [] }, token: 'abc' });
    });
});
