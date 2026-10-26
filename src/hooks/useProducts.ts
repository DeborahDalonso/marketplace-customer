import { useCallback, useEffect, useState } from 'react';
import { listCategories, listProducts } from '../services/catalog';
import type { Paginated } from '../types/ApiResponse';
import type { Product, ProductQuery } from '../types/Product';
import type { Category } from '../types/Category';

interface ProductsState {
    data: Paginated<Product> | null;
    loading: boolean;
    error: Error | null;
}

/** Lista paginada que refaz a busca sempre que algum parâmetro muda. */
export function useProducts(query: ProductQuery) {
    const [state, setState] = useState<ProductsState>({ data: null, loading: true, error: null });
    const [attempt, setAttempt] = useState(0);
    const { q, categoryId, page, perPage } = query;

    useEffect(() => {
        let cancelled = false;
        setState((current) => ({ ...current, loading: true, error: null }));

        const load = async () => {
            try {
                const data = await listProducts({ q, categoryId, page, perPage });
                if (!cancelled) setState({ data, loading: false, error: null });
            } catch (caught) {
                const error = caught instanceof Error ? caught : new Error(String(caught));
                if (!cancelled) setState((current) => ({ ...current, loading: false, error }));
            }
        };

        void load();

        // Resposta de uma busca antiga não pode sobrescrever a atual
        return () => {
            cancelled = true;
        };
    }, [q, categoryId, page, perPage, attempt]);

    const retry = useCallback(() => setAttempt((n) => n + 1), []);

    return { ...state, retry };
}

let categoriesCache: Category[] | null = null;

/** Categorias mudam raramente; uma carga por sessão basta. */
export function useCategories() {
    const [categories, setCategories] = useState<Category[]>(categoriesCache ?? []);
    const [loading, setLoading] = useState(categoriesCache === null);

    useEffect(() => {
        if (categoriesCache) return;
        let cancelled = false;

        const load = async () => {
            try {
                const data = await listCategories();
                categoriesCache = data;
                if (!cancelled) setCategories(data);
            } catch {
                /* sem categorias a vitrine segue, só sem o filtro */
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, []);

    return { categories, loading };
}
