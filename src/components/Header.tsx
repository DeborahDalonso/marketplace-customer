import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { t } from '../i18n/pt-BR';
import '../styles/components/header.css';

function Logo() {
    return (
        <Link to="/" className="brand" aria-label={t.brand.name}>
            <span className="brand__name">{t.brand.name}</span>
            <svg className="brand__line" viewBox="0 0 80 10" width="80" height="10" aria-hidden="true">
                <path d="M1 2 Q 40 9 79 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <rect x="22" y="1" width="3" height="7" rx="1" fill="var(--peg)" />
                <rect x="54" y="1" width="3" height="7" rx="1" fill="var(--peg)" />
            </svg>
        </Link>
    );
}

export function Header() {
    const { user, logout } = useAuth();
    const cart = useCart();
    const { theme, toggle } = useTheme();
    const { notify } = useToast();
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        notify('info', t.auth.logoutSuccess);
        navigate('/');
    };

    return (
        <header className="header">
            <a className="skip-link" href="#main">
                {t.nav.skipToContent}
            </a>
            <div className="container header__inner">
                <Logo />

                <nav className="header__nav" aria-label={t.nav.products}>
                    <NavLink to="/produtos">{t.nav.products}</NavLink>
                    {user ? <NavLink to="/pedidos">{t.nav.orders}</NavLink> : null}
                </nav>

                <div className="header__actions">
                    <button
                        type="button"
                        className="icon-btn"
                        onClick={toggle}
                        aria-label={t.theme.toggle}
                        title={theme === 'dark' ? t.theme.light : t.theme.dark}
                    >
                        {theme === 'dark' ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="12" cy="12" r="4.5" fill="currentColor" />
                                <path
                                    d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="currentColor" />
                            </svg>
                        )}
                    </button>

                    {user ? (
                        <div className="header__user">
                            <span className="header__greeting">{t.nav.greeting(user.name)}</span>
                            <button type="button" className="btn btn--link" onClick={onLogout}>
                                {t.nav.logout}
                            </button>
                        </div>
                    ) : (
                        <Link to="/entrar" className="btn btn--ghost btn--small">
                            {t.nav.login}
                        </Link>
                    )}

                    <button
                        type="button"
                        className="cart-btn"
                        onClick={cart.open}
                        aria-label={`${t.nav.openCart}, ${t.cart.itemsCount(cart.count)}`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                d="M4 6h2l2.2 10.2a1 1 0 0 0 1 .8h8.4a1 1 0 0 0 1-.8L20 9H7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <circle cx="10" cy="20" r="1.3" fill="currentColor" />
                            <circle cx="17" cy="20" r="1.3" fill="currentColor" />
                        </svg>
                        {cart.count > 0 ? <span className="cart-btn__count">{cart.count}</span> : null}
                    </button>
                </div>
            </div>
        </header>
    );
}
