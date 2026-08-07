import type { ReactNode } from 'react';
import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import {
  FORM_FILTER_OPTIONS,
  PRICE_FILTER_OPTIONS,
  SHOP_CATEGORIES,
  SORT_OPTIONS,
  type BrowseFilters,
  type PriceBand,
  type SortId,
} from '@/lib/browse/productBrowse';

type Props = {
  filters: BrowseFilters;
  onChange: (patch: Partial<BrowseFilters>) => void;
  /** When false, Category filter group is hidden (category landing pages). */
  showCategoryFilter?: boolean;
  filtersOpen: boolean;
  onToggleFilters: () => void;
  resultCount: number;
};

function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${
        active
          ? 'bg-ink-900 text-cream-50'
          : 'bg-cream-100 text-ink-700 hover:bg-cream-200'
      }`}
    >
      {children}
    </button>
  );
}

export function ProductBrowseBar({
  filters,
  onChange,
  showCategoryFilter = true,
  filtersOpen,
  onToggleFilters,
  resultCount,
}: Props) {
  const activeFilterCount = [
    showCategoryFilter && filters.category,
    filters.form,
    filters.price !== 'any',
  ].filter(Boolean).length;

  return (
    <div className="mb-10 space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={filters.query}
            onChange={e => onChange({ query: e.target.value })}
            placeholder="Search Products"
            className="w-full rounded-2xl border border-cream-300 bg-white py-3.5 pl-12 pr-4 text-sm text-ink-900 placeholder-ink-400 shadow-sm focus:border-gold-400 focus:outline-none"
            aria-label="Search Products"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleFilters}
            className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-medium transition-colors ${
              filtersOpen || activeFilterCount > 0
                ? 'border-gold-400 bg-gold-50 text-ink-900'
                : 'border-cream-300 bg-white text-ink-800 hover:border-gold-300'
            }`}
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal size={16} />
            Filter
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-ink-900 px-2 py-0.5 text-[10px] font-semibold text-cream-50">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown size={16} className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
          </button>

          <label className="inline-flex items-center gap-2 rounded-2xl border border-cream-300 bg-white px-4 py-3.5 text-sm text-ink-800 shadow-sm">
            <span className="text-ink-400">Sort</span>
            <select
              value={filters.sort}
              onChange={e => onChange({ sort: e.target.value as SortId })}
              className="bg-transparent font-medium text-ink-900 focus:outline-none"
              aria-label="Sort"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {filtersOpen && (
        <div className="rounded-3xl border border-cream-300 bg-white/90 p-6 md:p-8 shadow-sm space-y-8 animate-fade-in">
          {showCategoryFilter && (
            <div>
              <p className="eyebrow text-gold-600 mb-3">Category</p>
              <div className="flex flex-wrap gap-2">
                <FilterChip active={!filters.category} onClick={() => onChange({ category: '' })}>
                  All Categories
                </FilterChip>
                {SHOP_CATEGORIES.map(c => (
                  <FilterChip
                    key={c.id}
                    active={filters.category === c.id}
                    onClick={() => onChange({ category: c.id })}
                  >
                    {c.label}
                  </FilterChip>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="eyebrow text-gold-600 mb-3">Form</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip active={!filters.form} onClick={() => onChange({ form: '' })}>
                Any Form
              </FilterChip>
              {FORM_FILTER_OPTIONS.map(f => (
                <FilterChip
                  key={f}
                  active={filters.form === f}
                  onClick={() => onChange({ form: f })}
                >
                  {f}
                </FilterChip>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow text-gold-600 mb-3">Price</p>
            <div className="flex flex-wrap gap-2">
              {PRICE_FILTER_OPTIONS.map(p => (
                <FilterChip
                  key={p.id}
                  active={filters.price === p.id}
                  onClick={() => onChange({ price: p.id as PriceBand })}
                >
                  {p.label}
                </FilterChip>
              ))}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => onChange({ category: '', form: '', price: 'any' })}
              className="text-sm text-gold-700 hover:text-gold-800 underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <p className="text-sm text-ink-500">{resultCount} product{resultCount !== 1 ? 's' : ''}</p>
    </div>
  );
}
