import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct, registerView } from '../services/catalog';
import { ApiError } from '../services/http';
import { useCart } from '../hooks/useCart';
import { useCategories } from '../hooks/useProducts';
import { useToast } from '../hooks/useToast';
import { EmptyState } from '../components/EmptyState';
import { Price } from '../components/Price';
import { Skeleton } from '../components/Skeleton';
import type { Product } from '../types/Product';
import { t } from '../i18n/pt-BR';
import '../styles/pages/product-detail.css';

export function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const cart = useCart();
    const { notify } = useToast();
    const { categories } = useCategories();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        setLoading(true);
        setQuantity(1);

        const load = async () => {
            try {
                const data = await getProduct(id);
                if (cancelled) return;
                setProduct(data);
                setError(null);
                registerView(id);
            } catch (caught) {
                if (!cancelled) setError(caught instanceof ApiError ? caught : new ApiError(t.toast.genericError, 500));
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, [id]);

    if (loading) {
        return (
            <section className="container product-detail" aria-busy="true">
                <Skeleton width="30%" height="0.9rem" />
                <Skeleton width="70%" height="2.5rem" />
                <Skeleton width="100%" height="4rem" />
            </section>
        );
    }

    if (error || !product) {
        return (
            <section className="container product-detail">
                <EmptyState
                    tone={error?.isNotFound ? 'neutral' : 'error'}
                    title={t.productDetail.notFound}
                    text={error?.isNotFound ? '' : (error?.message ?? '')}
                    action={
                        <Link className="btn btn--primary" to="/produtos">
                            {t.productDetail.back}
                        </Link>
                    }
                />
            </section>
        );
    }

    const category = categories.find((item) => item.id === product.categoryId);
    const soldOut = product.stock <= 0;
    const max = Math.min(product.stock, 99);

    const add = () => {
        cart.add(product, quantity);
        notify('success', t.productDetail.added(product.name));
        cart.open();
    };

    return (
        <section className="container product-detail">
            <Link to="/produtos" className="product-detail__back">
                {t.productDetail.back}
            </Link>

            <div className="product-detail__grid">
                <article className="product-detail__tag">
                    <span className="product-detail__hole" aria-hidden="true" />
                    {category ? <p className="eyebrow">{category.name}</p> : null}
                    <h1>{product.name}</h1>
                    <p className="product-detail__desc">{product.description}</p>
                    <dl className="product-detail__meta">
                        <div>
                            <dt>{t.productDetail.seller}</dt>
                            <dd>{t.productDetail.sellerIndependent}</dd>
                        </div>
                        <div>
                            <dt>{t.productDetail.stockLabel}</dt>
                            <dd className={soldOut ? 'product-detail__out' : ''}>
                                {soldOut
                                    ? t.products.outOfStock
                                    : product.stock <= 3
                                      ? t.products.lowStock(product.stock)
                                      : t.products.inStock}
                            </dd>
                        </div>
                    </dl>
                </article>

                <aside className="product-detail__buy">
                    <span className="product-detail__price-label">{t.productDetail.priceLabel}</span>
                    <Price cents={product.priceCents} size="large" tag />

                    <div className="product-detail__qty">
                        <span id="qtyLabel" className="field__label">
                            {t.productDetail.quantity}
                        </span>
                        <div className="stepper" role="group" aria-labelledby="qtyLabel">
                            <button
                                type="button"
                                onClick={() => setQuantity((n) => Math.max(1, n - 1))}
                                disabled={soldOut || quantity <= 1}
                                aria-label={t.productDetail.decrease}
                            >
                                -
                            </button>
                            <output className="mono">{quantity}</output>
                            <button
                                type="button"
                                onClick={() => setQuantity((n) => Math.min(max, n + 1))}
                                disabled={soldOut || quantity >= max}
                                aria-label={t.productDetail.increase}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button type="button" className="btn btn--accent btn--block" onClick={add} disabled={soldOut}>
                        {soldOut ? t.products.outOfStock : t.productDetail.addToCart}
                    </button>
                </aside>
            </div>
        </section>
    );
}
