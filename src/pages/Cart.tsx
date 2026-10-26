import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { CartLines } from '../components/CartLines';
import { EmptyState } from '../components/EmptyState';
import { Price } from '../components/Price';
import { t } from '../i18n/pt-BR';
import '../styles/pages/cart.css';

export function Cart() {
    const cart = useCart();

    return (
        <section className="container cart-page">
            <h1>{t.cart.title}</h1>

            {cart.items.length === 0 ? (
                <EmptyState
                    title={t.cart.empty}
                    text={t.cart.emptyText}
                    action={
                        <Link className="btn btn--primary" to="/produtos">
                            {t.cart.browse}
                        </Link>
                    }
                />
            ) : (
                <div className="cart-page__grid">
                    <div className="cart-page__lines">
                        <CartLines items={cart.items} onQuantity={cart.setQuantity} onRemove={cart.remove} />
                        <button type="button" className="btn btn--link cart-page__clear" onClick={cart.clear}>
                            {t.cart.clear}
                        </button>
                    </div>
                    <aside className="cart-page__summary">
                        <div className="cart-page__total">
                            <span>
                                {t.cart.subtotal} <span className="muted">({t.cart.itemsCount(cart.count)})</span>
                            </span>
                            <Price cents={cart.totalCents} size="large" />
                        </div>
                        <Link className="btn btn--accent btn--block" to="/checkout">
                            {t.cart.checkout}
                        </Link>
                        <Link className="btn btn--ghost btn--block" to="/produtos">
                            {t.cart.continue}
                        </Link>
                    </aside>
                </div>
            )}
        </section>
    );
}
