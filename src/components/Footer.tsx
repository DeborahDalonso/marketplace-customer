import { Link } from 'react-router-dom';
import { t } from '../i18n/pt-BR';
import '../styles/components/footer.css';

const GITHUB_URL = 'https://github.com/deborahdalonso';

export function Footer() {
    return (
        <footer className="footer">
            <div className="container footer__inner">
                <div className="footer__brand">
                    <span className="footer__name">{t.brand.name}</span>
                    <span className="footer__tagline">{t.brand.tagline}</span>
                    <p className="footer__note">{t.brand.portfolioNote}</p>
                </div>

                <nav className="footer__links" aria-label={t.footer.links}>
                    <Link to="/">{t.nav.home}</Link>
                    <Link to="/produtos">{t.nav.products}</Link>
                    <Link to="/pedidos">{t.nav.orders}</Link>
                    <Link to="/entrar">{t.nav.login}</Link>
                </nav>

                <div className="footer__author">
                    <span className="muted">{t.footer.madeBy}</span>
                    <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                        {t.brand.author}
                    </a>
                    <span className="footer__stack">{t.footer.stack}</span>
                </div>
            </div>
        </footer>
    );
}
