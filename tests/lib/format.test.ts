import { formatCents, formatDate, formatDateTime, shortId } from '../../src/lib/format';

// O Intl separa "R$" do número com espaço fino (U+00A0), não com espaço comum
const NBSP = ' ';

describe('formatCents', () => {
    test('converte centavos inteiros em reais com separador de milhar', () => {
        expect(formatCents(123456)).toBe(`R$${NBSP}1.234,56`);
    });

    test('mostra zero quando o valor é negativo ou não é número', () => {
        expect(formatCents(-500)).toBe(`R$${NBSP}0,00`);
        expect(formatCents(Number.NaN)).toBe(`R$${NBSP}0,00`);
        expect(formatCents(Number.POSITIVE_INFINITY)).toBe(`R$${NBSP}0,00`);
    });

    test('arredonda centavos fracionados antes de formatar', () => {
        expect(formatCents(1999.5)).toBe(`R$${NBSP}20,00`);
    });
});

describe('formatDateTime', () => {
    test('formata ISO em data e hora curtas pt-BR', () => {
        expect(formatDateTime('2026-10-26T15:30:00.000Z')).toMatch(/^\d{2}\/\d{2}\/\d{4},? \d{2}:\d{2}$/);
    });

    test('devolve vazio quando a data é inválida', () => {
        expect(formatDateTime('não é data')).toBe('');
    });
});

describe('formatDate', () => {
    test('escreve o mês por extenso', () => {
        expect(formatDate('2026-10-26T12:00:00.000Z')).toMatch(/outubro de 2026/);
    });

    test('devolve vazio quando a data é inválida', () => {
        expect(formatDate('')).toBe('');
    });
});

describe('shortId', () => {
    test('corta o prefixo e fica com os seis primeiros caracteres do ulid', () => {
        expect(shortId('ord_01J9XABCDEFGHJKMNPQRSTVWXYZ')).toBe('#01J9XA');
    });

    test('usa o id inteiro quando não há prefixo', () => {
        expect(shortId('abc')).toBe('#ABC');
    });
});
