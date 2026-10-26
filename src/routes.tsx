import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { App } from './App';
import { useAuth } from './hooks/useAuth';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MyOrders } from './pages/MyOrders';
import { OrderDetail } from './pages/OrderDetail';
import { NotFound } from './pages/NotFound';

/** Rota só para quem está logado. Guarda o destino em next para voltar depois do login. */
export function RequireAuth({ children }: { children: ReactNode }) {
    const { user, ready } = useAuth();
    const location = useLocation();

    // Antes de ler o localStorage não dá para saber se existe sessão
    if (!ready) return null;
    if (!user) return <Navigate to={`/entrar?next=${encodeURIComponent(location.pathname)}`} replace />;
    return <>{children}</>;
}

export const routes = [
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: 'produtos', element: <Products /> },
            { path: 'produtos/:id', element: <ProductDetail /> },
            { path: 'carrinho', element: <Cart /> },
            { path: 'entrar', element: <Login /> },
            { path: 'cadastro', element: <Register /> },
            {
                path: 'checkout',
                element: (
                    <RequireAuth>
                        <Checkout />
                    </RequireAuth>
                ),
            },
            {
                path: 'pedidos',
                element: (
                    <RequireAuth>
                        <MyOrders />
                    </RequireAuth>
                ),
            },
            {
                path: 'pedidos/:id',
                element: (
                    <RequireAuth>
                        <OrderDetail />
                    </RequireAuth>
                ),
            },
            { path: '*', element: <NotFound /> },
        ],
    },
];

export const router = createBrowserRouter(routes);
