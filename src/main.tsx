import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import { installMocks, useMocks } from './services/mock';
import './styles/tokens.css';
import './styles/base.css';

if (useMocks) installMocks();

createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <ToastProvider>
            <AuthProvider>
                <CartProvider>
                    <RouterProvider router={router} />
                </CartProvider>
            </AuthProvider>
        </ToastProvider>
    </StrictMode>,
);
