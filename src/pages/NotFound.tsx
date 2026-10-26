import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { t } from '../i18n/pt-BR';

export function NotFound() {
    return (
        <section className="container section">
            <EmptyState
                title={t.notFound.title}
                text={t.notFound.text}
                action={
                    <Link className="btn btn--primary" to="/">
                        {t.notFound.action}
                    </Link>
                }
            />
        </section>
    );
}
