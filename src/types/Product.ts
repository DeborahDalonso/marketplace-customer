export interface Product {
    id: string;
    sellerId: string;
    categoryId: string;
    name: string;
    description: string;
    priceCents: number;
    stock: number;
    active: boolean;
    createdAt: string;
}

export interface ProductQuery {
    q?: string;
    categoryId?: string;
    page?: number;
    perPage?: number;
}
