import { t } from '../i18n/pt-BR';

export const MIN_PASSWORD = 6;

export function isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Valida os campos de login e cadastro no cliente. Devolve mensagem por campo; vazio quando está tudo certo. */
export function validateCredentials(fields: {
    name?: string;
    email: string;
    password: string;
}): Record<string, string> {
    const errors: Record<string, string> = {};
    if (fields.name !== undefined && !fields.name.trim()) errors.name = t.auth.required;
    if (!fields.email.trim()) errors.email = t.auth.required;
    else if (!isEmail(fields.email)) errors.email = t.auth.invalidEmail;
    if (!fields.password) errors.password = t.auth.required;
    else if (fields.password.length < MIN_PASSWORD) errors.password = t.auth.shortPassword;
    return errors;
}
