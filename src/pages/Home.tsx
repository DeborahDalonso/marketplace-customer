import type { CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useCategories, useProducts } from '../hooks/useProducts';
import { useToast } from '../hooks/useToast';
import { ProductCard } from '../components/ProductCard';
import { ProductGrid } from '../components/ProductGrid';
import { SearchBar } from '../components/SearchBar';
import { ProductCardSkeleton } from '../components/Skeleton';
import type { Product } from '../types/Product';
import { t } from '../i18n/pt-BR';
import '../styles/pages/home.css';

const HANGING = 3;
const FEATURED = 4;

// Cada etiqueta do varal pende com inclinação e balanço próprios, como se tivesse sido pendurada à mão
const tags = [
    { tilt: '-2deg', delay: '0s', drop: '0px' },
    { tilt: '1.5deg', delay: '-2.3s', drop: '26px' },
    { tilt: '-1deg', delay: '-4.1s', drop: '8px' },
];

export function Home() {
    const navigate = useNavigate();
    const cart = useCart();
    const { notify } = useToast();
    const { categories } = useCategories();
    const { data, loading } = useProducts({ perPage: HANGING + FEATURED });

    const items = data?.items ?? [];
    const hanging = items.slice(0, HANGING);
    const featured = items.slice(HANGING, HANGING + FEATURED);

    const addToCart = (product: Product) => {
        cart.add(product, 1);
        notify('success', t.productDetail.added(product.name));
    };

    return (
        <>
            <section className="hero">
                <div className="container hero__inner">
                    <div className="hero__copy">
                        <p className="eyebrow">{t.home.eyebrow}</p>
                        <h1>{t.home.title}</h1>
                        <p className="hero__subtitle">{t.home.subtitle}</p>
                        <SearchBar
                            size="hero"
                            placeholder={t.home.searchPlaceholder}
                            onSearch={(q) => navigate(q ? `/produtos?q=${encodeURIComponent(q)}` : '/produtos')}
                        />
                    </div>

                    <div className="varal" aria-label={t.home.lineLabel}>
                        <svg className="varal__rope" viewBox="0 0 800 40" preserveAspectRatio="none" aria-hidden="true">
                            <path
                                d="M0 6 Q 400 40 800 6"
                                fill="none"
                                stroke="var(--rope)"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="varal__tags">
                            {loading
                                ? tags.map((tag, index) => (
                                      <div key={index} className="varal__slot" style={{ marginTop: tag.drop }}>
                                          <ProductCardSkeleton />
                                      </div>
                                  ))
                                : hanging.map((product, index) => {
                                      const tag = tags[index % tags.length] as (typeof tags)[number];
                                      const style = {
                                          marginTop: tag.drop,
                                          animationDelay: tag.delay,
                                          '--tilt': tag.tilt,
                                      } as CSSProperties;
                                      return (
                                          <div key={product.id} className="varal__slot" style={style}>
                                              <ProductCard product={product} onAdd={addToCart} hanging />
                                          </div>
                                      );
                                  })}
                        </div>
                    </div>
                </div>
            </section>

            <section className="section categories">
                <div className="container">
                    <div className="section__head">
                        <h2>{t.home.categoriesTitle}</h2>
                        <Link to="/produtos">{t.home.categoriesAll}</Link>
                    </div>
                    <ul className="categories__list">
                        {categories.map((category) => (
                            <li key={category.id}>
                                <Link className="categories__item" to={`/produtos?categoryId=${category.id}`}>
                                    {category.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section__head">
                        <h2>{t.home.featuredTitle}</h2>
                        <Link to="/produtos">{t.home.featuredLink}</Link>
                    </div>
                    <ProductGrid products={featured} loading={loading} skeletonCount={FEATURED} onAdd={addToCart} />
                </div>
            </section>

            <section className="section how">
                <div className="container">
                    <h2>{t.home.howTitle}</h2>
                    <p className="how__intro">{t.home.howIntro}</p>
                    <ol className="how__steps">
                        {t.home.steps.map((step, index) => (
                            <li key={step.title} className="how__step">
                                <span className="how__number">{index + 1}</span>
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>
        </>
    );
}
