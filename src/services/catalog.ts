import { baseUrls, request } from './http';
import type { Paginated } from '../types/ApiResponse';
import type { Product, ProductQuery } from '../types/Product';
import type { Category } from '../types/Category';

export function listProducts(query: ProductQuery = {}): Promise<Paginated<Product>> {
    return request<Paginated<Product>>(baseUrls.catalog, '/products', {
        query: { q: query.q, categoryId: query.categoryId, page: query.page, perPage: query.perPage },
    });
}

export function getProduct(id: string): Promise<Product> {
    return request<Product>(baseUrls.catalog, `/products/${id}`);
}

export function listCategories(): Promise<Category[]> {
    return request<Category[]>(baseUrls.catalog, '/categories');
}

/** Fire and forget: o catalog publica product.viewed; a vitrine não espera nem reporta falha. */
export function registerView(id: string): void {
    void request<null>(baseUrls.catalog, `/products/${id}/views`, { method: 'POST' }).catch(() => undefined);
}
