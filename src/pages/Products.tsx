import { useSearchParams } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useCategories, useProducts } from '../hooks/useProducts';
import { useToast } from '../hooks/useToast';
import { CategoryFilter } from '../components/CategoryFilter';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { ProductGrid } from '../components/ProductGrid';
import { SearchBar } from '../components/SearchBar';
import type { Product } from '../types/Product';
import { t } from '../i18n/pt-BR';
import '../styles/pages/products.css';

const PER_PAGE = 12;

/** Busca, categoria e página vivem na URL para o link ser compartilhável e o voltar funcionar. */
export function Products() {
    const [params, setParams] = useSearchParams();
    const cart = useCart();
    const { notify } = useToast();
    const { categories } = useCategories();

    const q = params.get('q') ?? '';
    const categoryId = params.get('categoryId') ?? undefined;
    const page = Math.max(1, Number(params.get('page') ?? 1));

    const { data, loading, error, retry } = useProducts({ q, categoryId, page, perPage: PER_PAGE });

    const update = (changes: Record<string, string | undefined>) => {
        const next = new URLSearchParams(params);
        for (const [key, value] of Object.entries(changes)) {
            if (value) next.set(key, value);
            else next.delete(key);
        }
        setParams(next);
    };

    const addToCart = (product: Product) => {
        cart.add(product, 1);
        notify('success', t.productDetail.added(product.name));
    };

    const empty = !loading && !error && data?.items.length === 0;

    return (
        <section className="container products">
            <header className="products__head">
                <h1>{q ? t.products.resultsFor(q) : t.products.title}</h1>
                {data && !loading ? (
                    <span className="products__count mono">{t.products.resultCount(data.total)}</span>
                ) : null}
            </header>

            <div className="products__tools">
                <SearchBar value={q} onSearch={(value) => update({ q: value, page: undefined })} />
                <CategoryFilter
                    categories={categories}
                    selected={categoryId}
                    onChange={(id) => update({ categoryId: id, page: undefined })}
                />
            </div>

            {error ? (
                <EmptyState
                    tone="error"
                    title={t.products.loadError}
                    text={error.message}
                    action={
                        <button type="button" className="btn btn--primary" onClick={retry}>
                            {t.products.retry}
                        </button>
                    }
                />
            ) : empty ? (
                <EmptyState
                    title={t.products.emptyTitle}
                    text={t.products.emptyText}
                    action={
                        <button type="button" className="btn btn--ghost" onClick={() => setParams({})}>
                            {t.products.emptyAction}
                        </button>
                    }
                />
            ) : (
                <>
                    <ProductGrid
                        products={data?.items ?? []}
                        loading={loading}
                        skeletonCount={PER_PAGE}
                        onAdd={addToCart}
                    />
                    {data ? (
                        <Pagination
                            page={data.page}
                            perPage={data.perPage}
                            total={data.total}
                            onChange={(next) => update({ page: String(next) })}
                        />
                    ) : null}
                </>
            )}
        </section>
    );
}
