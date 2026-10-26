export type OrderStatus = 'pending' | 'confirmed' | 'paid' | 'cancelled';

export type PaymentMethod = 'pix' | 'card';

export interface OrderItem {
    productId: string;
    name: string;
    quantity: number;
    priceCents: number;
}

export interface Order {
    id: string;
    buyerId: string;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    items: OrderItem[];
    totalCents: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderInput {
    paymentMethod: PaymentMethod;
    items: Array<{ productId: string; quantity: number }>;
}
