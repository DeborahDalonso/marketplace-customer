import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { CartLines } from './CartLines';
import { Price } from './Price';
import { t } from '../i18n/pt-BR';
import '../styles/components/cart-drawer.css';

export function CartDrawer() {
    const cart = useCart();
    const navigate = useNavigate();
    const closeButton = useRef<HTMLButtonElement>(null);
    const { isOpen, close } = cart;

    useEffect(() => {
        if (!isOpen) return;
        closeButton.current?.focus();
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') close();
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [isOpen, close]);

    const goTo = (path: string) => {
        close();
        navigate(path);
    };

    return (
        <div className={`cart-drawer${isOpen ? ' cart-drawer--open' : ''}`} aria-hidden={!isOpen}>
            <div className="cart-drawer__backdrop" onClick={close} />
            <aside className="cart-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
                <header className="cart-drawer__head">
                    <h2 id="cartTitle">
                        {t.cart.title} <span className="cart-drawer__count">{t.cart.itemsCount(cart.count)}</span>
                    </h2>
                    <button
                        ref={closeButton}
                        type="button"
                        className="cart-drawer__close"
                        onClick={close}
                        aria-label={t.cart.close}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                            <path
                                d="M3 3l10 10M13 3L3 13"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </header>

                {cart.items.length === 0 ? (
                    <div className="cart-drawer__empty">
                        <h3>{t.cart.empty}</h3>
                        <p className="muted">{t.cart.emptyText}</p>
                        <button type="button" className="btn btn--primary" onClick={() => goTo('/produtos')}>
                            {t.cart.browse}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="cart-drawer__list">
                            <CartLines items={cart.items} onQuantity={cart.setQuantity} onRemove={cart.remove} />
                        </div>
                        <footer className="cart-drawer__foot">
                            <div className="cart-drawer__total">
                                <span>{t.cart.subtotal}</span>
                                <Price cents={cart.totalCents} size="large" />
                            </div>
                            <button
                                type="button"
                                className="btn btn--accent btn--block"
                                onClick={() => goTo('/checkout')}
                            >
                                {t.cart.checkout}
                            </button>
                            <button type="button" className="btn btn--ghost btn--block" onClick={close}>
                                {t.cart.continue}
                            </button>
                        </footer>
                    </>
                )}
            </aside>
        </div>
    );
}
