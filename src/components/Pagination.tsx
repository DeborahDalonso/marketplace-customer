import { t } from '../i18n/pt-BR';
import '../styles/components/pagination.css';

interface PaginationProps {
    page: number;
    perPage: number;
    total: number;
    onChange: (page: number) => void;
}

export function Pagination({ page, perPage, total, onChange }: PaginationProps) {
    const pages = Math.max(1, Math.ceil(total / perPage));
    if (pages <= 1) return null;

    return (
        <nav className="pagination" aria-label={t.pagination.label}>
            <button
                type="button"
                className="btn btn--ghost btn--small"
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
            >
                {t.pagination.previous}
            </button>
            <span className="pagination__summary" aria-live="polite">
                {t.pagination.summary(page, pages)}
            </span>
            <button
                type="button"
                className="btn btn--ghost btn--small"
                disabled={page >= pages}
                onClick={() => onChange(page + 1)}
            >
                {t.pagination.next}
            </button>
        </nav>
    );
}
