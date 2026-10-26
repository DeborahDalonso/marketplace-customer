import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { ApiError } from '../services/http';
import { validateCredentials } from '../lib/validate';
import { t } from '../i18n/pt-BR';

export function Register() {
    const { register } = useAuth();
    const { notify } = useToast();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const next = params.get('next') ?? '/';

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        const found = validateCredentials({ name, email, password });
        setErrors(found);
        if (Object.keys(found).length) return;

        setSubmitting(true);
        try {
            await register({ name: name.trim(), email: email.trim(), password });
            notify('success', t.auth.registerSuccess);
            navigate(next, { replace: true });
        } catch (caught) {
            if (caught instanceof ApiError && caught.errors.length) {
                // Erro 422 do auth: a mensagem vai para o campo, não para o toast
                setErrors(Object.fromEntries(caught.errors.map((error) => [error.field, error.message])));
                return;
            }
            notify('error', caught instanceof ApiError ? caught.message : t.toast.genericError);
        } finally {
            setSubmitting(false);
        }
    };

    const field = (
        id: 'name' | 'email' | 'password',
        label: string,
        type: string,
        value: string,
        onChange: (v: string) => void,
        autoComplete: string,
    ) => (
        <div className="field">
            <label className="field__label" htmlFor={id}>
                {label}
            </label>
            <input
                id={id}
                className="input"
                type={type}
                autoComplete={autoComplete}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                aria-invalid={Boolean(errors[id])}
                aria-describedby={errors[id] ? `${id}Error` : id === 'password' ? 'passwordHint' : undefined}
            />
            {id === 'password' && !errors[id] ? (
                <span id="passwordHint" className="field__hint">
                    {t.auth.passwordHint}
                </span>
            ) : null}
            {errors[id] ? (
                <span id={`${id}Error`} className="field__error">
                    {errors[id]}
                </span>
            ) : null}
        </div>
    );

    return (
        <section className="container auth">
            <form className="auth__card" onSubmit={submit} noValidate>
                <h1>{t.auth.registerTitle}</h1>
                <p className="muted">{t.auth.registerSubtitle}</p>

                {field('name', t.auth.name, 'text', name, setName, 'name')}
                {field('email', t.auth.email, 'email', email, setEmail, 'email')}
                {field('password', t.auth.password, 'password', password, setPassword, 'new-password')}

                <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
                    {submitting ? t.auth.registering : t.auth.registerButton}
                </button>

                <p className="auth__switch">
                    {t.auth.hasAccount}{' '}
                    <Link to={`/entrar${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`}>
                        {t.auth.goLogin}
                    </Link>
                </p>
            </form>
        </section>
    );
}
