import { formatCents } from '../lib/format';
import '../styles/components/price.css';

interface PriceProps {
    cents: number;
    size?: 'small' | 'medium' | 'large';
    tag?: boolean;
}

/** Preço em BRL. Com tag, vira a etiqueta amarela que identifica a vitrine. */
export function Price({ cents, size = 'medium', tag = false }: PriceProps) {
    const className = ['price', `price--${size}`, tag ? 'price--tag' : ''].filter(Boolean).join(' ');
    return <span className={className}>{formatCents(cents)}</span>;
}
