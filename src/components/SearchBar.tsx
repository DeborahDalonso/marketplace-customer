import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { t } from '../i18n/pt-BR';
import '../styles/components/search-bar.css';

interface SearchBarProps {
    value?: string;
    placeholder?: string;
    size?: 'default' | 'hero';
    onSearch: (q: string) => void;
}

export function SearchBar({
    value = '',
    placeholder = t.products.searchPlaceholder,
    size = 'default',
    onSearch,
}: SearchBarProps) {
    const [text, setText] = useState(value);

    // A URL manda: se a query mudar por navegação, o campo acompanha
    useEffect(() => setText(value), [value]);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        onSearch(text.trim());
    };

    return (
        <form className={`search-bar search-bar--${size}`} role="search" onSubmit={submit}>
            <label className="visually-hidden" htmlFor="searchInput">
                {t.products.searchLabel}
            </label>
            <input
                id="searchInput"
                className="input search-bar__input"
                type="search"
                placeholder={placeholder}
                value={text}
                onChange={(event) => setText(event.target.value)}
                autoComplete="off"
            />
            <button type="submit" className="btn btn--primary search-bar__button">
                {t.home.searchButton}
            </button>
        </form>
    );
}
