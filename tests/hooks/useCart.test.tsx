import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { CartProvider } from '../../src/contexts/CartContext';
import { useCart } from '../../src/hooks/useCart';
import type { Product } from '../../src/types/Product';

const STORAGE_KEY = 'varal.cart';

const caneca: Product = {
    id: 'prd_01J9X0000000000000000CANECA',
    sellerId: 'usr_01J9X000000000000000MARINA',
    categoryId: 'cat_01J9X00000000000000COZINHA',
    name: 'Caneca de cerâmica esmaltada',
    description: 'Torneada à mão.',
    priceCents: 6800,
    stock: 3,
    active: true,
    createdAt: '2026-10-02T12:00:00.000Z',
};

const caderno: Product = {
    ...caneca,
    id: 'prd_01J9X000000000000000CADERNO',
    name: 'Caderno costurado A5',
    priceCents: 4900,
    stock: 30,
};

function wrapper({ children }: { children: ReactNode }) {
    return <CartProvider>{children}</CartProvider>;
}

function savedCart(): unknown {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
}

describe('useCart', () => {
    test('começa vazio quando não há nada salvo', () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        expect(result.current.items).toEqual([]);
        expect(result.current.count).toBe(0);
        expect(result.current.totalCents).toBe(0);
    });

    test('adiciona um produto e soma quantidade e total', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => result.current.add(caneca, 2));
        act(() => result.current.add(caderno));

        expect(result.current.count).toBe(3);
        expect(result.current.totalCents).toBe(6800 * 2 + 4900);
        expect(result.current.items.map((item) => item.productId)).toEqual([caneca.id, caderno.id]);
    });

    test('junta o mesmo produto numa linha só, sem passar do estoque', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => result.current.add(caneca, 2));
        act(() => result.current.add(caneca, 5));

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0]?.quantity).toBe(caneca.stock);
    });

    test('remove a linha e zera o total', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => result.current.add(caneca));
        act(() => result.current.remove(caneca.id));

        expect(result.current.items).toEqual([]);
        expect(result.current.totalCents).toBe(0);
    });

    test('quantidade zero tira a linha; quantidade maior atualiza', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => result.current.add(caneca));
        act(() => result.current.add(caderno));
        act(() => result.current.setQuantity(caderno.id, 4));
        act(() => result.current.setQuantity(caneca.id, 0));

        expect(result.current.items).toEqual([expect.objectContaining({ productId: caderno.id, quantity: 4 })]);
    });

    test('persiste cada mudança no localStorage', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => result.current.add(caneca, 2));
        expect(savedCart()).toEqual([expect.objectContaining({ productId: caneca.id, quantity: 2 })]);

        act(() => result.current.clear());
        expect(savedCart()).toEqual([]);
    });

    test('recupera o carrinho salvo ao montar', () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify([
                { productId: caderno.id, name: caderno.name, priceCents: caderno.priceCents, quantity: 3 },
            ]),
        );

        const { result } = renderHook(() => useCart(), { wrapper });

        expect(result.current.count).toBe(3);
        expect(result.current.totalCents).toBe(4900 * 3);
    });

    test('abre e fecha o drawer', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        expect(result.current.isOpen).toBe(false);
        act(() => result.current.open());
        expect(result.current.isOpen).toBe(true);
        act(() => result.current.close());
        expect(result.current.isOpen).toBe(false);
    });
});
