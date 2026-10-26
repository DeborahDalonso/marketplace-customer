import type { HttpReply, HttpRequest, Transport } from '../http';
import type { Paginated } from '../../types/ApiResponse';
import type { CreateOrderInput, Order, OrderItem, OrderStatus } from '../../types/Order';
import type { LoginInput, RegisterInput, User } from '../../types/User';
import { mockCategories, mockPassword, mockProducts, mockUser } from './data';

// Imita os três serviços REST com o mesmo envelope e os mesmos status do CONTRATOS.
// Pedidos vivem em memória e avançam na saga sozinhos, para a tela de polling ter o que mostrar.

const SAGA_STEP_MS = 4000;

const users = new Map<string, { user: User; password: string }>([
    [mockUser.email, { user: mockUser, password: mockPassword }],
]);
const orders: Order[] = [];
const sagaTimers = new Set<ReturnType<typeof setTimeout>>();

function ok<T>(data: T, status = 200): HttpReply {
    return { status, body: { success: true, message: null, data } };
}

function fail(status: number, message: string, errors?: Array<{ field: string; message: string }>): HttpReply {
    return { status, body: { success: false, message, errors } };
}

function newId(prefix: string): string {
    const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    let ulid = '';
    for (let i = 0; i < 26; i += 1) ulid += alphabet[Math.floor(Math.random() * alphabet.length)];
    return `${prefix}_${ulid}`;
}

function paginate<T>(items: T[], params: URLSearchParams): Paginated<T> {
    const page = Math.max(1, Number(params.get('page') ?? 1));
    const perPage = Math.min(50, Math.max(1, Number(params.get('perPage') ?? 20)));
    const start = (page - 1) * perPage;
    return { items: items.slice(start, start + perPage), page, perPage, total: items.length };
}

function userFromToken(token: string | null): User | null {
    if (!token?.startsWith('mock.')) return null;
    const email = atob(token.slice('mock.'.length));
    return users.get(email)?.user ?? null;
}

function session(user: User): HttpReply {
    return ok({ accessToken: `mock.${btoa(user.email)}`, refreshToken: newId('rt'), user });
}

function normalize(text: string): string {
    return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// ==== Catalog ====

function listProducts(params: URLSearchParams): HttpReply {
    const q = normalize(params.get('q') ?? '').trim();
    const categoryId = params.get('categoryId');
    const filtered = mockProducts.filter((product) => {
        if (categoryId && product.categoryId !== categoryId) return false;
        if (q && !normalize(`${product.name} ${product.description}`).includes(q)) return false;
        return true;
    });
    return ok(paginate(filtered, params));
}

function getProduct(id: string): HttpReply {
    const product = mockProducts.find((item) => item.id === id);
    return product ? ok(product) : fail(404, 'Produto não encontrado');
}

// ==== Orders ====

function advance(order: Order, status: OrderStatus): void {
    order.status = status;
    order.updatedAt = new Date().toISOString();
}

function scheduleSaga(order: Order): void {
    const confirm = setTimeout(() => {
        advance(order, 'confirmed');
        const pay = setTimeout(() => {
            advance(order, 'paid');
            sagaTimers.delete(pay);
        }, SAGA_STEP_MS);
        sagaTimers.add(pay);
        sagaTimers.delete(confirm);
    }, SAGA_STEP_MS);
    sagaTimers.add(confirm);
}

function createOrder(user: User, input: CreateOrderInput): HttpReply {
    if (!Array.isArray(input.items) || input.items.length === 0) {
        return fail(422, 'Pedido sem itens', [{ field: 'items', message: 'obrigatório' }]);
    }
    if (input.paymentMethod !== 'pix' && input.paymentMethod !== 'card') {
        return fail(422, 'Forma de pagamento inválida', [{ field: 'paymentMethod', message: 'pix ou card' }]);
    }

    const items: OrderItem[] = [];
    for (const line of input.items) {
        const product = mockProducts.find((item) => item.id === line.productId);
        if (!product) return fail(422, 'Produto não encontrado', [{ field: 'items', message: line.productId }]);
        items.push({
            productId: product.id,
            name: product.name,
            quantity: line.quantity,
            priceCents: product.priceCents,
        });
    }

    const now = new Date().toISOString();
    const order: Order = {
        id: newId('ord'),
        buyerId: user.id,
        status: 'pending',
        paymentMethod: input.paymentMethod,
        items,
        totalCents: items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0),
        createdAt: now,
        updatedAt: now,
    };
    orders.unshift(order);
    scheduleSaga(order);
    return ok(order, 201);
}

// ==== Auth ====

function login(input: LoginInput): HttpReply {
    const found = users.get(input.email?.toLowerCase() ?? '');
    if (!found || found.password !== input.password) return fail(401, 'E-mail ou senha não conferem');
    return session(found.user);
}

function register(input: RegisterInput): HttpReply {
    const errors: Array<{ field: string; message: string }> = [];
    if (!input.name?.trim()) errors.push({ field: 'name', message: 'obrigatório' });
    if (!input.email?.includes('@')) errors.push({ field: 'email', message: 'e-mail inválido' });
    if (!input.password || input.password.length < 6)
        errors.push({ field: 'password', message: 'mínimo de 6 caracteres' });
    if (errors.length) return fail(422, 'Dados inválidos', errors);

    const email = input.email.toLowerCase();
    if (users.has(email)) return fail(409, 'Já existe uma conta com este e-mail');

    const user: User = { id: newId('usr'), email, name: input.name.trim(), role: 'buyer' };
    users.set(email, { user, password: input.password });
    return session(user);
}

// ==== Roteamento ====

function route({ method, url, body, token }: HttpRequest): HttpReply {
    const { pathname, searchParams } = new URL(url);
    const parts = pathname.split('/').filter(Boolean);
    const [resource, id, action] = parts;

    if (resource === 'products') {
        if (method === 'GET' && !id) return listProducts(searchParams);
        if (method === 'GET' && id) return getProduct(id);
        if (method === 'POST' && id && action === 'views') return ok(null, 202);
    }

    if (resource === 'categories' && method === 'GET') return ok(mockCategories);

    if (resource === 'auth' && method === 'POST') {
        if (id === 'login') return login(body as LoginInput);
        if (id === 'register') return register(body as RegisterInput);
    }

    if (resource === 'orders') {
        const user = userFromToken(token);
        if (!user) return fail(401, 'Entre na sua conta para continuar');
        if (method === 'POST' && !id) return createOrder(user, body as CreateOrderInput);
        if (method === 'GET' && id === 'mine') {
            return ok(
                paginate(
                    orders.filter((order) => order.buyerId === user.id),
                    searchParams,
                ),
            );
        }
        if (method === 'GET' && id) {
            const order = orders.find((item) => item.id === id && item.buyerId === user.id);
            return order ? ok(order) : fail(404, 'Pedido não encontrado');
        }
    }

    return fail(404, 'Rota não encontrada');
}

export const mockTransport: Transport = async (request) => {
    // Uma latência pequena deixa skeleton e estados de carregamento visíveis
    await new Promise((resolve) => setTimeout(resolve, 150));
    return route(request);
};

/** Limpa pedidos e timers entre testes. */
export function resetMockState(): void {
    orders.length = 0;
    for (const timer of sagaTimers) clearTimeout(timer);
    sagaTimers.clear();
}
