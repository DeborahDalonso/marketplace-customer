import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { listMyOrders } from '../services/orders';
import { ApiError } from '../services/http';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { EmptyState } from '../components/EmptyState';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { Pagination } from '../components/Pagination';
import { Price } from '../components/Price';
import { Skeleton } from '../components/Skeleton';
import type { Paginated } from '../types/ApiResponse';
import type { Order } from '../types/Order';
import { formatDateTime, shortId } from '../lib/format';
import { t } from '../i18n/pt-BR';
import '../styles/pages/orders.css';

const PER_PAGE = 10;

export function MyOrders() {
    const { logout } = useAuth();
    const { notify } = useToast();
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();
    const [data, setData] = useState<Paginated<Order> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const page = Math.max(1, Number(params.get('page') ?? 1));

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        const load = async () => {
            try {
                const result = await listMyOrders({ page, perPage: PER_PAGE });
                if (!cancelled) setData(result);
            } catch (caught) {
                if (cancelled) return;
                if (caught instanceof ApiError && caught.isUnauthorized) {
                    logout();
                    notify('error', t.toast.sessionExpired);
                    navigate('/entrar?next=/pedidos', { replace: true });
                    return;
                }
                setError(caught instanceof ApiError ? caught.message : t.orders.loadError);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, [page, logout, notify, navigate]);

    return (
        <section className="container orders">
            <h1>{t.orders.title}</h1>

            {loading ? (
                <div className="orders__list" aria-busy="true">
                    {Array.from({ length: 3 }, (_, index) => (
                        <div key={index} className="order-row">
                            <Skeleton width="30%" height="1.2rem" />
                            <Skeleton width="20%" height="0.9rem" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <EmptyState tone="error" title={t.orders.loadError} text={error} />
            ) : !data || data.items.length === 0 ? (
                <EmptyState
                    title={t.orders.emptyTitle}
                    text={t.orders.emptyText}
                    action={
                        <Link className="btn btn--primary" to="/produtos">
                            {t.orders.emptyAction}
                        </Link>
                    }
                />
            ) : (
                <>
                    <ul className="orders__list">
                        {data.items.map((order) => (
                            <li key={order.id}>
                                <Link to={`/pedidos/${order.id}`} className="order-row order-row--link">
                                    <div className="order-row__main">
                                        <span className="order-row__id">
                                            {t.orders.orderLabel} <span className="mono">{shortId(order.id)}</span>
                                        </span>
                                        <span className="order-row__meta">
                                            {t.orders.placedAt} {formatDateTime(order.createdAt)}{' '}
                                            <span aria-hidden="true">/</span> {t.orders.items(order.items.length)}
                                        </span>
                                    </div>
                                    <OrderStatusBadge status={order.status} />
                                    <Price cents={order.totalCents} />
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Pagination
                        page={data.page}
                        perPage={data.perPage}
                        total={data.total}
                        onChange={(next) => setParams({ page: String(next) })}
                    />
                </>
            )}
        </section>
    );
}
