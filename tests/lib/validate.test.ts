import { isEmail, validateCredentials } from '../../src/lib/validate';
import { t } from '../../src/i18n/pt-BR';

describe('isEmail', () => {
    test('aceita endereço com usuário, arroba e domínio', () => {
        expect(isEmail('ana@varal.dev')).toBe(true);
        expect(isEmail('  ana@varal.dev  ')).toBe(true);
    });

    test('rejeita endereço sem arroba, sem domínio ou com espaço', () => {
        expect(isEmail('ana.varal.dev')).toBe(false);
        expect(isEmail('ana@')).toBe(false);
        expect(isEmail('ana @varal.dev')).toBe(false);
    });
});

describe('validateCredentials', () => {
    test('devolve objeto vazio quando está tudo preenchido', () => {
        expect(validateCredentials({ name: 'Ana', email: 'ana@varal.dev', password: 'varal123' })).toEqual({});
    });

    test('marca campo obrigatório vazio, inclusive só com espaços', () => {
        const errors = validateCredentials({ name: '   ', email: '', password: '' });
        expect(errors).toEqual({ name: t.auth.required, email: t.auth.required, password: t.auth.required });
    });

    test('aponta e-mail inválido e senha curta com mensagens próprias', () => {
        const errors = validateCredentials({ email: 'ana', password: '123' });
        expect(errors.email).toBe(t.auth.invalidEmail);
        expect(errors.password).toBe(t.auth.shortPassword);
    });

    test('ignora o nome quando ele não faz parte do formulário', () => {
        const errors = validateCredentials({ email: 'ana@varal.dev', password: 'varal123' });
        expect(errors.name).toBeUndefined();
    });
});
