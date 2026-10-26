import { useEffect, useState } from 'react';
import { getOrder } from '../services/orders';
import { ApiError } from '../services/http';
import type { Order } from '../types/Order';

const POLL_MS = 5000;

/** Carrega o pedido e, enquanto a saga não terminar, consulta de novo a cada 5 s. */
export function useOrder(id: string | undefined, onUnauthorized: () => void) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        let timer: ReturnType<typeof setTimeout> | undefined;

        const load = async () => {
            try {
                const next = await getOrder(id);
                if (cancelled) return;
                setOrder(next);
                setError(null);
                if (next.status === 'pending' || next.status === 'confirmed') timer = setTimeout(load, POLL_MS);
            } catch (caught) {
                if (cancelled) return;
                const failure = caught instanceof ApiError ? caught : new ApiError('', 500);
                if (failure.isUnauthorized) onUnauthorized();
                setError(failure);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void load();

        return () => {
            cancelled = true;
            if (timer) clearTimeout(timer);
        };
    }, [id, onUnauthorized]);

    return { order, loading, error };
}
