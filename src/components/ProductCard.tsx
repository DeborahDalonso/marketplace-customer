import { Link } from 'react-router-dom';
import type { Product } from '../types/Product';
import { Price } from './Price';
import { t } from '../i18n/pt-BR';
import '../styles/components/product-card.css';

interface ProductCardProps {
    product: Product;
    onAdd?: (product: Product) => void;
    hanging?: boolean;
}

const LOW_STOCK = 3;

function stockLabel(stock: number): { text: string; tone: 'out' | 'low' | 'ok' } {
    if (stock <= 0) return { text: t.products.outOfStock, tone: 'out' };
    if (stock <= LOW_STOCK) return { text: t.products.lowStock(stock), tone: 'low' };
    return { text: t.products.inStock, tone: 'ok' };
}

/** Uma etiqueta de papel: furo em cima, preço amarelo embaixo. Com hanging, ganha o prendedor do varal. */
export function ProductCard({ product, onAdd, hanging = false }: ProductCardProps) {
    const stock = stockLabel(product.stock);
    const soldOut = product.stock <= 0;

    return (
        <article
            className={`product-card${hanging ? ' product-card--hanging' : ''}${soldOut ? ' product-card--out' : ''}`}
        >
            {hanging ? <span className="product-card__peg" aria-hidden="true" /> : null}
            <span className="product-card__hole" aria-hidden="true" />
            <p className={`product-card__stock product-card__stock--${stock.tone}`}>{stock.text}</p>
            <h3 className="product-card__name">
                <Link
                    to={`/produtos/${product.id}`}
                    className="product-card__link"
                    aria-label={t.products.viewProduct(product.name)}
                >
                    {product.name}
                </Link>
            </h3>
            <p className="product-card__desc">{product.description}</p>
            <div className="product-card__foot">
                <Price cents={product.priceCents} tag />
                {onAdd ? (
                    <button
                        type="button"
                        className="btn btn--ghost btn--small product-card__add"
                        disabled={soldOut}
                        onClick={() => onAdd(product)}
                    >
                        {soldOut ? t.products.outOfStock : t.products.quickAdd}
                    </button>
                ) : null}
            </div>
        </article>
    );
}
