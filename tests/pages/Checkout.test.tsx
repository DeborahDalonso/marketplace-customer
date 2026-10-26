import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { CartProvider } from '../../src/contexts/CartContext';
import { ToastProvider } from '../../src/contexts/ToastContext';
import { RequireAuth } from '../../src/routes';
import { Checkout } from '../../src/pages/Checkout';
import { setAccessToken, setTransport } from '../../src/services/http';
import { mockProducts, mockTransport, mockUser, resetMockState } from '../../src/services/mock';
import { t } from '../../src/i18n/pt-BR';

const caneca = mockProducts[0]!;

function signIn(): void {
    // Mesmo formato de token que o mock transport reconhece
    const session = { accessToken: `mock.${btoa(mockUser.email)}`, refreshToken: 'rt_test', user: mockUser };
    localStorage.setItem('varal.session', JSON.stringify(session));
}

function fillCart(quantity: number): void {
    const line = { productId: caneca.id, name: caneca.name, priceCents: caneca.priceCents, quantity };
    localStorage.setItem('varal.cart', JSON.stringify([line]));
}

function renderCheckout() {
    return render(
        <ToastProvider>
            <AuthProvider>
                <CartProvider>
                    <MemoryRouter initialEntries={['/checkout']}>
                        <Routes>
                            <Route
                                path="/checkout"
                                element={
                                    <RequireAuth>
                                        <Checkout />
                                    </RequireAuth>
                                }
                            />
                            <Route path="/entrar" element={<p>tela de login</p>} />
                        </Routes>
                    </MemoryRouter>
                </CartProvider>
            </AuthProvider>
        </ToastProvider>,
    );
}

beforeEach(() => setTransport(mockTransport));

afterEach(() => {
    setTransport(null);
    setAccessToken(null);
    resetMockState();
});

describe('Checkout', () => {
    test('sem login redireciona para a tela de entrar', async () => {
        fillCart(1);
        renderCheckout();

        expect(await screen.findByText('tela de login')).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: t.checkout.title })).not.toBeInTheDocument();
    });

    test('com carrinho vazio orienta a escolher produtos', async () => {
        signIn();
        renderCheckout();

        expect(await screen.findByText(t.checkout.emptyCart)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: t.checkout.confirm })).not.toBeInTheDocument();
    });

    test('com login envia o pedido, mostra pendente e esvazia o carrinho', async () => {
        signIn();
        fillCart(2);
        renderCheckout();

        await userEvent.click(await screen.findByRole('radio', { name: /Cartão/ }));
        await userEvent.click(screen.getByRole('button', { name: t.checkout.confirm }));

        expect(await screen.findByRole('link', { name: t.checkout.trackOrder })).toBeInTheDocument();
        expect(screen.getByText(t.orders.status.pending)).toBeInTheDocument();
        expect(screen.getByText(t.checkout.createdText)).toBeInTheDocument();
        await waitFor(() => expect(JSON.parse(localStorage.getItem('varal.cart') ?? 'x')).toEqual([]));
    });
});
