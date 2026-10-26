import type { Product } from '../types/Product';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './Skeleton';
import '../styles/components/product-grid.css';

interface ProductGridProps {
    products: Product[];
    loading?: boolean;
    skeletonCount?: number;
    onAdd?: (product: Product) => void;
}

export function ProductGrid({ products, loading = false, skeletonCount = 8, onAdd }: ProductGridProps) {
    if (loading) {
        return (
            <div className="product-grid" aria-busy="true">
                {Array.from({ length: skeletonCount }, (_, index) => (
                    <ProductCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={onAdd} />
            ))}
        </div>
    );
}
