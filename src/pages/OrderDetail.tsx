import { useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOrder } from '../hooks/useOrder';
import { useToast } from '../hooks/useToast';
import { EmptyState } from '../components/EmptyState';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { Price } from '../components/Price';
import { Skeleton } from '../components/Skeleton';
import type { OrderStatus } from '../types/Order';
import { formatDateTime, shortId } from '../lib/format';
import { t } from '../i18n/pt-BR';
import '../styles/pages/orders.css';

// A saga do CONTRATOS 4.4: pendente, confirmado, pago. Cancelado sai da trilha.
const HAPPY_PATH: OrderStatus[] = ['pending', 'confirmed', 'paid'];

export function OrderDetail() {
    const { id } = useParams<{ id: string }>();
    const { logout } = useAuth();
    const { notify } = useToast();
    const navigate = useNavigate();

    const onUnauthorized = useCallback(() => {
        logout();
        notify('error', t.toast.sessionExpired);
        navigate(`/entrar?next=/pedidos/${id ?? ''}`, { replace: true });
    }, [logout, notify, navigate, id]);

    const { order, loading, error } = useOrder(id, onUnauthorized);

    if (loading) {
        return (
            <section className="container orders" aria-busy="true">
                <Skeleton width="40%" height="2rem" />
                <Skeleton width="25%" height="1rem" />
            </section>
        );
    }

    if (error || !order) {
        return (
            <section className="container orders">
                <EmptyState
                    tone={error?.isNotFound ? 'neutral' : 'error'}
                    title={t.orders.notFound}
                    text={error && !error.isNotFound ? error.message : ''}
                    action={
                        <Link className="btn btn--primary" to="/pedidos">
                            {t.orders.back}
                        </Link>
                    }
                />
            </section>
        );
    }

    const polling = order.status === 'pending' || order.status === 'confirmed';
    const reached = HAPPY_PATH.indexOf(order.status);

    return (
        <section className="container orders order-detail">
            <Link to="/pedidos" className="order-detail__back">
                {t.orders.back}
            </Link>

            <header className="order-detail__head">
                <div>
                    <h1>{t.orders.detailTitle(shortId(order.id))}</h1>
                    <p className="muted">
                        {t.orders.placedAt} {formatDateTime(order.createdAt)}
                    </p>
                </div>
                <OrderStatusBadge status={order.status} />
            </header>

            <div className={`order-detail__status order-detail__status--${order.status}`} aria-live="polite">
                {polling ? <span className="order-detail__pulse" aria-hidden="true" /> : null}
                <p>{t.orders.statusHint[order.status]}</p>
            </div>

            {order.status !== 'cancelled' ? (
                <ol className="saga">
                    {HAPPY_PATH.map((status, index) => (
                        <li
                            key={status}
                            className={`saga__step${index <= reached ? ' saga__step--done' : ''}${index === reached ? ' saga__step--current' : ''}`}
                        >
                            {t.orders.status[status]}
                        </li>
                    ))}
                </ol>
            ) : null}

            <div className="order-detail__grid">
                <div className="order-detail__card">
                    <h2>{t.orders.itemsLabel}</h2>
                    <ul className="order-detail__items">
                        {order.items.map((item) => (
                            <li key={item.productId}>
                                <span>
                                    <span className="mono">{item.quantity}x</span> {item.name}
                                </span>
                                <Price cents={item.priceCents * item.quantity} size="small" />
                            </li>
                        ))}
                    </ul>
                    <div className="order-detail__total">
                        <span>{t.orders.total}</span>
                        <Price cents={order.totalCents} size="large" />
                    </div>
                </div>

                <dl className="order-detail__card order-detail__meta">
                    <div>
                        <dt>{t.orders.paymentLabel}</dt>
                        <dd>{t.orders.payment[order.paymentMethod]}</dd>
                    </div>
                    <div>
                        <dt>{t.orders.statusLabel}</dt>
                        <dd>{t.orders.status[order.status]}</dd>
                    </div>
                    <div>
                        <dt>{t.orders.updatedAt}</dt>
                        <dd>{formatDateTime(order.updatedAt)}</dd>
                    </div>
                </dl>
            </div>
        </section>
    );
}
