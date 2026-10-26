import '../styles/components/skeleton.css';

interface SkeletonProps {
    width?: string;
    height?: string;
    className?: string;
}

export function Skeleton({ width = '100%', height = '1em', className = '' }: SkeletonProps) {
    return <span className={`skeleton ${className}`.trim()} style={{ width, height }} aria-hidden="true" />;
}

/** Esqueleto no formato de um ProductCard, para a grade não pular enquanto carrega. */
export function ProductCardSkeleton() {
    return (
        <div className="skeleton-card" aria-hidden="true">
            <Skeleton width="40%" height="0.75rem" />
            <Skeleton width="85%" height="1.4rem" />
            <Skeleton width="100%" height="0.9rem" />
            <Skeleton width="70%" height="0.9rem" />
            <div className="skeleton-card__foot">
                <Skeleton width="35%" height="1.5rem" />
                <Skeleton width="30%" height="2.2rem" />
            </div>
        </div>
    );
}
