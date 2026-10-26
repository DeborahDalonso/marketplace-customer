import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';

/** Layout comum: cabeçalho, página, rodapé, drawer do carrinho e avisos. */
export function App() {
    const { pathname } = useLocation();

    useEffect(() => window.scrollTo(0, 0), [pathname]);

    return (
        <>
            <Header />
            <main id="main">
                <Outlet />
            </main>
            <Footer />
            <CartDrawer />
            <Toast />
        </>
    );
}
