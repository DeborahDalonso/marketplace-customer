import { baseUrls, request } from './http';
import type { PageQuery, Paginated } from '../types/ApiResponse';
import type { CreateOrderInput, Order } from '../types/Order';

export function createOrder(input: CreateOrderInput): Promise<Order> {
    return request<Order>(baseUrls.orders, '/orders', { method: 'POST', body: input });
}

export function listMyOrders(query: PageQuery = {}): Promise<Paginated<Order>> {
    return request<Paginated<Order>>(baseUrls.orders, '/orders/mine', {
        query: { page: query.page, perPage: query.perPage },
    });
}

export function getOrder(id: string): Promise<Order> {
    return request<Order>(baseUrls.orders, `/orders/${id}`);
}
