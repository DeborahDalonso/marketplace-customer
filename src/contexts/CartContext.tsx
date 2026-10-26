import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem } from '../types/Cart';
import type { Product } from '../types/Product';

const STORAGE_KEY = 'varal.cart';
const MAX_QUANTITY = 99;

export interface CartContextValue {
    items: CartItem[];
    count: number;
    totalCents: number;
    isOpen: boolean;
    add: (product: Product, quantity?: number) => void;
    remove: (productId: string) => void;
    setQuantity: (productId: string, quantity: number) => void;
    clear: () => void;
    open: () => void;
    close: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed: unknown = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
    } catch {
        return [];
    }
}

function clampQuantity(quantity: number, stock: number): number {
    return Math.max(1, Math.min(MAX_QUANTITY, stock, Math.floor(quantity)));
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(readCart);
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            /* carrinho só em memória quando o storage está bloqueado */
        }
    }, [items]);

    const add = useCallback((product: Product, quantity = 1) => {
        setItems((current) => {
            const existing = current.find((item) => item.productId === product.id);
            if (existing) {
                const next = clampQuantity(existing.quantity + quantity, product.stock);
                return current.map((item) => (item.productId === product.id ? { ...item, quantity: next } : item));
            }
            const line: CartItem = {
                productId: product.id,
                name: product.name,
                priceCents: product.priceCents,
                quantity: clampQuantity(quantity, product.stock),
            };
            return [...current, line];
        });
    }, []);

    const remove = useCallback((productId: string) => {
        setItems((current) => current.filter((item) => item.productId !== productId));
    }, []);

    const setQuantity = useCallback((productId: string, quantity: number) => {
        setItems((current) => {
            if (quantity < 1) return current.filter((item) => item.productId !== productId);
            const next = Math.min(MAX_QUANTITY, Math.floor(quantity));
            return current.map((item) => (item.productId === productId ? { ...item, quantity: next } : item));
        });
    }, []);

    const clear = useCallback(() => setItems([]), []);
    const open = useCallback(() => setOpen(true), []);
    const close = useCallback(() => setOpen(false), []);

    const value = useMemo<CartContextValue>(() => {
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalCents = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
        return { items, count, totalCents, isOpen, add, remove, setQuantity, clear, open, close };
    }, [items, isOpen, add, remove, setQuantity, clear, open, close]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
