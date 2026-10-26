import type { CartItem } from '../types/Cart';
import { Price } from './Price';
import { t } from '../i18n/pt-BR';
import '../styles/components/cart-lines.css';

interface CartLinesProps {
    items: CartItem[];
    onQuantity: (productId: string, quantity: number) => void;
    onRemove: (productId: string) => void;
}

/** Linhas do carrinho com controle de quantidade. Usado no drawer e na página do carrinho. */
export function CartLines({ items, onQuantity, onRemove }: CartLinesProps) {
    return (
        <ul className="cart-lines">
            {items.map((item) => (
                <li key={item.productId} className="cart-line">
                    <div className="cart-line__info">
                        <span className="cart-line__name">{item.name}</span>
                        <span className="cart-line__unit">
                            <Price cents={item.priceCents} size="small" /> {t.cart.unitPrice}
                        </span>
                    </div>
                    <div className="cart-line__qty" role="group" aria-label={t.cart.quantityOf(item.name)}>
                        <button
                            type="button"
                            onClick={() => onQuantity(item.productId, item.quantity - 1)}
                            aria-label={t.productDetail.decrease}
                        >
                            -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                            type="button"
                            onClick={() => onQuantity(item.productId, item.quantity + 1)}
                            aria-label={t.productDetail.increase}
                        >
                            +
                        </button>
                    </div>
                    <Price cents={item.priceCents * item.quantity} />
                    <button
                        type="button"
                        className="cart-line__remove"
                        onClick={() => onRemove(item.productId)}
                        aria-label={t.cart.remove(item.name)}
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                            <path
                                d="M2 2l10 10M12 2L2 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </li>
            ))}
        </ul>
    );
}
