import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { ApiError } from '../services/http';
import { useMocks } from '../services/mock';
import { validateCredentials } from '../lib/validate';
import { t } from '../i18n/pt-BR';

export function Login() {
    const { login } = useAuth();
    const { notify } = useToast();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const next = params.get('next') ?? '/';

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        const found = validateCredentials({ email, password });
        setErrors(found);
        if (Object.keys(found).length) return;

        setSubmitting(true);
        try {
            const user = await login({ email: email.trim(), password });
            notify('success', t.auth.loginSuccess(user.name));
            navigate(next, { replace: true });
        } catch (caught) {
            notify('error', caught instanceof ApiError ? caught.message : t.toast.genericError);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="container auth">
            <form className="auth__card" onSubmit={submit} noValidate>
                <h1>{t.auth.loginTitle}</h1>
                <p className="muted">{t.auth.loginSubtitle}</p>

                <div className="field">
                    <label className="field__label" htmlFor="email">
                        {t.auth.email}
                    </label>
                    <input
                        id="email"
                        className="input"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'emailError' : undefined}
                    />
                    {errors.email ? (
                        <span id="emailError" className="field__error">
                            {errors.email}
                        </span>
                    ) : null}
                </div>

                <div className="field">
                    <label className="field__label" htmlFor="password">
                        {t.auth.password}
                    </label>
                    <input
                        id="password"
                        className="input"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={errors.password ? 'passwordError' : undefined}
                    />
                    {errors.password ? (
                        <span id="passwordError" className="field__error">
                            {errors.password}
                        </span>
                    ) : null}
                </div>

                <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
                    {submitting ? t.auth.loggingIn : t.auth.loginButton}
                </button>

                <p className="auth__switch">
                    {t.auth.noAccount}{' '}
                    <Link to={`/cadastro${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`}>
                        {t.auth.goRegister}
                    </Link>
                </p>

                {useMocks ? <p className="auth__demo">{t.auth.mockHint}</p> : null}
            </form>
        </section>
    );
}
