import type { Category } from '../types/Category';
import { t } from '../i18n/pt-BR';
import '../styles/components/category-filter.css';

interface CategoryFilterProps {
    categories: Category[];
    selected: string | undefined;
    onChange: (categoryId: string | undefined) => void;
}

export function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
    const options: Array<{ id: string | undefined; name: string }> = [
        { id: undefined, name: t.products.allCategories },
        ...categories,
    ];

    return (
        <div className="category-filter" role="group" aria-label={t.products.categoryLabel}>
            {options.map((option) => {
                const active = option.id === selected;
                return (
                    <button
                        key={option.id ?? 'all'}
                        type="button"
                        className={`category-filter__chip${active ? ' category-filter__chip--active' : ''}`}
                        aria-pressed={active}
                        onClick={() => onChange(option.id)}
                    >
                        {option.name}
                    </button>
                );
            })}
        </div>
    );
}
