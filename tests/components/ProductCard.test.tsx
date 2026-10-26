import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ProductCard } from '../../src/components/ProductCard';
import { t } from '../../src/i18n/pt-BR';
import type { Product } from '../../src/types/Product';

const tabua: Product = {
    id: 'prd_01J9X00000000000000000TABUA',
    sellerId: 'usr_01J9X0000000000000000TIAGO',
    categoryId: 'cat_01J9X00000000000000COZINHA',
    name: 'Tábua de corte em jatobá',
    description: 'Madeira de manejo certificado.',
    priceCents: 15900,
    stock: 5,
    active: true,
    createdAt: '2026-10-03T12:00:00.000Z',
};

function renderCard(product: Product, onAdd?: (product: Product) => void) {
    return render(
        <MemoryRouter>
            <ProductCard product={product} onAdd={onAdd} />
        </MemoryRouter>,
    );
}

describe('ProductCard', () => {
    test('mostra nome com link para o detalhe, descrição e preço em reais', () => {
        renderCard(tabua);

        const link = screen.getByRole('link', { name: t.products.viewProduct(tabua.name) });
        expect(link).toHaveAttribute('href', `/produtos/${tabua.id}`);
        expect(screen.getByText(tabua.description)).toBeInTheDocument();
        // getByText normaliza o espaço fino do Intl para espaço comum, por isso a regex
        expect(screen.getByText(/R\$\s159,00/)).toBeInTheDocument();
    });

    test('indica estoque normal, baixo e esgotado', () => {
        const { rerender } = renderCard(tabua);
        expect(screen.getByText(t.products.inStock)).toBeInTheDocument();

        rerender(
            <MemoryRouter>
                <ProductCard product={{ ...tabua, stock: 1 }} />
            </MemoryRouter>,
        );
        expect(screen.getByText(t.products.lowStock(1))).toBeInTheDocument();

        rerender(
            <MemoryRouter>
                <ProductCard product={{ ...tabua, stock: 0 }} />
            </MemoryRouter>,
        );
        expect(screen.getByText(t.products.outOfStock)).toBeInTheDocument();
    });

    test('chama onAdd com o produto ao clicar em adicionar', async () => {
        const added: Product[] = [];
        renderCard(tabua, (product) => added.push(product));

        await userEvent.click(screen.getByRole('button', { name: t.products.quickAdd }));

        expect(added).toEqual([tabua]);
    });

    test('desabilita o botão quando o produto está esgotado', () => {
        renderCard({ ...tabua, stock: 0 }, () => undefined);

        expect(screen.getByRole('button', { name: t.products.outOfStock })).toBeDisabled();
    });

    test('não mostra botão quando não há onAdd', () => {
        renderCard(tabua);

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});
