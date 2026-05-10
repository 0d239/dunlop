import type { Product } from '@/data/products';

export type SortMode = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

export type FilterState = {
  query: string;
  sort: SortMode;
  selectedBrands: Set<string>;
};

export type FilterAction =
  | { type: 'set-query'; query: string }
  | { type: 'set-sort'; sort: SortMode }
  | { type: 'toggle-brand'; brand: string }
  | { type: 'reset' };

export const initialFilters: FilterState = {
  query: '',
  sort: 'default',
  selectedBrands: new Set(),
};

export function filtersReducer(
  state: FilterState,
  action: FilterAction,
): FilterState {
  switch (action.type) {
    case 'set-query':
      return { ...state, query: action.query };
    case 'set-sort':
      return { ...state, sort: action.sort };
    case 'toggle-brand': {
      const next = new Set(state.selectedBrands);
      if (next.has(action.brand)) next.delete(action.brand);
      else next.add(action.brand);
      return { ...state, selectedBrands: next };
    }
    case 'reset':
      return initialFilters;
  }
}

export function isFiltered(state: FilterState): boolean {
  return (
    state.query !== '' ||
    state.sort !== 'default' ||
    state.selectedBrands.size > 0
  );
}

export function applyFilters(
  products: Product[],
  state: FilterState,
): Product[] {
  let out = products;

  if (state.query) {
    const q = state.query.toLowerCase();
    out = out.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }

  if (state.selectedBrands.size > 0) {
    out = out.filter(
      (p) => p.brand !== null && state.selectedBrands.has(p.brand),
    );
  }

  if (state.sort !== 'default') {
    out = out.slice();
    if (state.sort === 'price-asc') out.sort((a, b) => a.priceCents - b.priceCents);
    else if (state.sort === 'price-desc') out.sort((a, b) => b.priceCents - a.priceCents);
    else if (state.sort === 'name-asc') out.sort((a, b) => a.name.localeCompare(b.name));
  }

  return out;
}
