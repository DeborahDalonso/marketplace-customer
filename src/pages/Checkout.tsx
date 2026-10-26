import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createOrder } from '../services/orders';
import { ApiError } from '../services/http';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { EmptyState } from '../components/EmptyState';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { Price } from '../components/Price';
import type { Order, PaymentMethod } from '../types/Order';
import { shortId } from '../lib/format';
import { t } from '../i18n/pt-BR';
import '../styles/pages/checkout.css';

const methods: Array<{ value: PaymentMethod; label: string; hint: string }> = [
    { value: 'pix', label: t.checkout.pix, hint: t.checkout.pixHint },
    { value: 'card', label: t.checkout.card, hint: t.checkout.cardHint },
];

export function Checkout() {
    const cart = useCart();
    const { notify } = useToast();
    const [method, setMethod] = useState<PaymentMethod>('pix');
    const [submitting, setSubmitting] = useState(false);
    const [created, setCreated] = useState<Order | null>(null);

    if (created) {
        return (
            <section className="container checkout">
                <div className="checkout__done">
                    <p className="eyebrow">{t.checkout.createdTitle}</p>
                    <h1>{t.orders.detailTitle(shortId(created.id))}</h1>
                    <OrderStatusBadge status={created.status} />
                    <p className="checkout__done-text">{t.checkout.createdText}</p>
                    <div className="checkout__done-total">
                        <span>{t.checkout.total}</span>
                        <Price cents={created.totalCents} size="large" />
                    </div>
                    <Link className="btn btn--primary" to={`/pedidos/${created.id}`}>
                        {t.checkout.trackOrder}
                    </Link>
                </div>
            </section>
        );
    }

    if (cart.items.length === 0) {
        return (
            <section className="container checkout">
                <h1>{t.checkout.title}</h1>
                <EmptyState
                    title={t.cart.empty}
                    text={t.checkout.emptyCart}
                    action={
                        <Link className="btn btn--primary" to="/produtos">
                            {t.cart.browse}
                        </Link>
                    }
                />
            </section>
        );
    }

    const submit = async () => {
        setSubmitting(true);
        try {
            const order = await createOrder({
                paymentMethod: method,
                items: cart.items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
            });
            cart.clear();
            setCreated(order);
            notify('success', t.checkout.createdTitle);
        } catch (caught) {
            notify('error', caught instanceof ApiError && caught.status !== 0 ? caught.message : t.checkout.error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="container checkout">
            <h1>{t.checkout.title}</h1>

            <div className="checkout__grid">
                <div className="checkout__payment">
                    <h2>{t.checkout.payment}</h2>
                    <div className="payment-options" role="radiogroup" aria-label={t.checkout.payment}>
                        {methods.map((option) => (
                            <label
                                key={option.value}
                                className={`payment-option${method === option.value ? ' payment-option--active' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={option.value}
                                    checked={method === option.value}
                                    onChange={() => setMethod(option.value)}
                                />
                                <span className="payment-option__label">{option.label}</span>
                                <span className="payment-option__hint">{option.hint}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <aside className="checkout__summary">
                    <h2>{t.checkout.summary}</h2>
                    <ul className="checkout__items">
                        {cart.items.map((item) => (
                            <li key={item.productId}>
                                <span>
                                    <span className="mono">{item.quantity}x</span> {item.name}
                                </span>
                                <Price cents={item.priceCents * item.quantity} size="small" />
                            </li>
                        ))}
                    </ul>
                    <div className="checkout__total">
                        <span>{t.checkout.total}</span>
                        <Price cents={cart.totalCents} size="large" />
                    </div>
                    <button type="button" className="btn btn--accent btn--block" onClick={submit} disabled={submitting}>
                        {submitting ? t.checkout.submitting : t.checkout.confirm}
                    </button>
                </aside>
            </div>
        </section>
    );
}
