const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
const dateOnly = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' });

/** Centavos inteiros viram "R$ 1.234,56". Valores negativos e não finitos viram "R$ 0,00". */
export function formatCents(cents: number): string {
    if (!Number.isFinite(cents) || cents < 0) return brl.format(0);
    return brl.format(Math.round(cents) / 100);
}

export function formatDateTime(iso: string): string {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? '' : dateTime.format(date);
}

export function formatDate(iso: string): string {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? '' : dateOnly.format(date);
}

/** Id público "ord_01J9X..." vira "#01J9X" para caber em títulos e badges. */
export function shortId(id: string): string {
    const [, ulid = id] = id.split('_');
    return `#${ulid.slice(0, 6).toUpperCase()}`;
}
