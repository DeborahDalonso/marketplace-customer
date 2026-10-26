import type { OrderStatus } from '../types/Order';
import { t } from '../i18n/pt-BR';

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
    return <span className={`badge badge--${status}`}>{t.orders.status[status]}</span>;
}
