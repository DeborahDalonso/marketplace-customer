import type { Category } from '../../types/Category';
import type { Product } from '../../types/Product';
import type { User } from '../../types/User';

// Dados fixos para desenvolver e testar sem backend. Ids seguem o formato prefixo + ULID do CONTRATOS.

export const mockCategories: Category[] = [
    { id: 'cat_01J9X0000000000000000CASA', name: 'Casa', slug: 'casa' },
    { id: 'cat_01J9X00000000000000COZINHA', name: 'Cozinha', slug: 'cozinha' },
    { id: 'cat_01J9X000000000000PAPELARIA', name: 'Papelaria', slug: 'papelaria' },
    { id: 'cat_01J9X00000000000000VESTIR', name: 'Vestir', slug: 'vestir' },
];

const sellers = {
    marina: 'usr_01J9X000000000000000MARINA',
    tiago: 'usr_01J9X0000000000000000TIAGO',
    helena: 'usr_01J9X000000000000000HELENA',
};

const [casa, cozinha, papelaria, vestir] = mockCategories as [Category, Category, Category, Category];

function product(partial: Omit<Product, 'active' | 'createdAt'>, createdAt: string): Product {
    return { ...partial, active: true, createdAt };
}

export const mockProducts: Product[] = [
    product(
        {
            id: 'prd_01J9X0000000000000000CANECA',
            sellerId: sellers.marina,
            categoryId: cozinha.id,
            name: 'Caneca de cerâmica esmaltada',
            description:
                'Torneada à mão em grés, com esmalte verde-garrafa que escorre de um jeito diferente em cada peça. Vai ao micro-ondas e à lava-louças. 300 ml.',
            priceCents: 6800,
            stock: 14,
        },
        '2026-10-02T12:00:00.000Z',
    ),
    product(
        {
            id: 'prd_01J9X00000000000000000TABUA',
            sellerId: sellers.tiago,
            categoryId: cozinha.id,
            name: 'Tábua de corte em jatobá',
            description:
                'Madeira de manejo certificado, acabamento em óleo mineral. 40 x 25 cm, com canaleta para sucos e alça recortada.',
            priceCents: 15900,
            stock: 5,
        },
        '2026-10-03T12:00:00.000Z',
    ),
    product(
        {
            id: 'prd_01J9X000000000000000CADERNO',
            sellerId: sellers.helena,
            categoryId: papelaria.id,
            name: 'Caderno costurado A5',
            description:
                'Costura copta exposta, 160 páginas de papel pólen 90 g sem pauta. Abre totalmente plano. Capa em cartão kraft 2 mm.',
            priceCents: 4900,
            stock: 30,
        },
        '2026-10-04T12:00:00.000Z',
    ),
    product(
        {
            id: 'prd_01J9X00000000000000CAMISETA',
            sellerId: sellers.helena,
            categoryId: vestir.id,
            name: 'Camiseta de algodão orgânico',
            description:
                'Malha 30.1 penteada, tingimento natural com casca de cebola. A cor amadurece com as lavagens. Tamanhos P ao GG.',
            priceCents: 8900,
            stock: 22,
        },
        '2026-10-05T12:00:00.000Z',
    ),
    product(
        {
            id: 'prd_01J9X00000000000000000VELA',
            sellerId: sellers.marina,
            categoryId: casa.id,
            name: 'Vela de soja com lavanda',
            description:
                'Cera de soja, pavio de algodão e óleo essencial de lavanda. 45 horas de queima. Vidro reaproveitável.',
            priceCents: 4200,
            stock: 0,
        },
        '2026-10-06T12:00:00.000Z',
    ),
    product(
        {
            id: 'prd_01J9X0000000000000000CESTO',
            sellerId: sellers.tiago,
            categoryId: casa.id,
            name: 'Cesto de fibra de bananeira',
            description:
                'Trançado por artesãs do Vale do Ribeira. 35 cm de diâmetro, serve para roupa, lenha ou plantas.',
            priceCents: 12500,
            stock: 3,
        },
        '2026-10-07T12:00:00.000Z',
    ),
    product(
        {
            id: 'prd_01J9X00000000000000000PANOS',
            sellerId: sellers.marina,
            categoryId: cozinha.id,
            name: 'Jogo de panos de prato bordados',
            description: 'Três panos de sacaria 100% algodão com bordado de ponto cruz: pimenta, limão e alho.',
            priceCents: 5600,
            stock: 18,
        },
        '2026-10-08T12:00:00.000Z',
    ),
    product(
        {
            id: 'prd_01J9X0000000000000000LAPIS',
            sellerId: sellers.helena,
            categoryId: papelaria.id,
            name: 'Estojo de lápis de cor em cedro',
            description:
                'Doze lápis de mina macia em caixa de cedro com tampa deslizante. Cores pensadas para aquarela seca.',
            priceCents: 7400,
            stock: 9,
        },
        '2026-10-09T12:00:00.000Z',
    ),
    product(
        {
            id: 'prd_01J9X00000000000000000BONE',
            sellerId: sellers.helena,
            categoryId: vestir.id,
            name: 'Boné de sarja com aba curta',
            description: 'Sarja de algodão, forro de viscose e fecho de fivela em metal. Bordado discreto na lateral.',
            priceCents: 7900,
            stock: 1,
        },
        '2026-10-10T12:00:00.000Z',
    ),
    product(
        {
            id: 'prd_01J9X0000000000000LUMINARIA',
            sellerId: sellers.tiago,
            categoryId: casa.id,
            name: 'Luminária de mesa em bambu',
            description:
                'Cúpula de ripas de bambu que projeta sombras na parede. Lâmpada E27 não inclusa. Cabo de tecido de 1,5 m.',
            priceCents: 21900,
            stock: 6,
        },
        '2026-10-11T12:00:00.000Z',
    ),
    product(
        {
            id: 'prd_01J9X000000000000000MOEDOR',
            sellerId: sellers.tiago,
            categoryId: cozinha.id,
            name: 'Moedor de pimenta em freijó',
            description:
                'Mecanismo de cerâmica com regulagem de moagem. 20 cm. Vem com 50 g de pimenta-do-reino preta.',
            priceCents: 13900,
            stock: 11,
        },
        '2026-10-12T12:00:00.000Z',
    ),
    product(
        {
            id: 'prd_01J9X0000000000000000MEIAS',
            sellerId: sellers.helena,
            categoryId: vestir.id,
            name: 'Meias de lã merino',
            description:
                'Tricotadas em tear manual, lã merino sem mulesing. Cano médio, não apertam. Tamanhos 35 a 44.',
            priceCents: 5900,
            stock: 25,
        },
        '2026-10-13T12:00:00.000Z',
    ),
];

export const mockUser: User = {
    id: 'usr_01J9X000000000000000000ANA',
    email: 'ana@varal.dev',
    name: 'Ana Ribeiro',
    role: 'buyer',
};

export const mockPassword = 'varal123';
