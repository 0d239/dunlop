import { describe, expect, test } from 'bun:test';
import {
  applyFilters,
  filtersReducer,
  initialFilters,
  type FilterState,
} from './filters';
import type { Product } from '@/data/products';

const P = (
  id: string,
  name: string,
  brand: string | null,
  priceCents: number,
  description = '',
): Product => ({
  id,
  sku: id,
  name,
  brand,
  priceCents,
  priceFormatted: `$${(priceCents / 100).toFixed(2)}`,
  image: '',
  images: [],
  description,
  path: '',
  category: 'picks',
});

const products: Product[] = [
  P('1', 'Nylon Pick',     'Dunlop', 200, 'soft tone'),
  P('2', 'Tortex Pick',    'Dunlop', 150, 'bright attack'),
  P('3', 'Brass Slide',    null,     900, 'heavy sustain'),
  P('4', 'Cry Baby Wah',   'Cry Baby', 18000, 'classic wah'),
];

describe('filtersReducer', () => {
  test('set-query updates query', () => {
    const next = filtersReducer(initialFilters, {
      type: 'set-query',
      query: 'pick',
    });
    expect(next.query).toBe('pick');
  });

  test('toggle-brand adds then removes', () => {
    const a = filtersReducer(initialFilters, {
      type: 'toggle-brand',
      brand: 'Dunlop',
    });
    expect(a.selectedBrands.has('Dunlop')).toBe(true);
    const b = filtersReducer(a, { type: 'toggle-brand', brand: 'Dunlop' });
    expect(b.selectedBrands.has('Dunlop')).toBe(false);
  });

  test('reset returns initial state', () => {
    const dirty: FilterState = {
      query: 'foo',
      sort: 'price-asc',
      selectedBrands: new Set(['Dunlop']),
    };
    const next = filtersReducer(dirty, { type: 'reset' });
    expect(next).toEqual(initialFilters);
  });
});

describe('applyFilters', () => {
  test('default state returns input unchanged', () => {
    expect(applyFilters(products, initialFilters)).toEqual(products);
  });

  test('query matches name (case-insensitive)', () => {
    const out = applyFilters(products, { ...initialFilters, query: 'PICK' });
    expect(out.map((p) => p.id)).toEqual(['1', '2']);
  });

  test('query matches description', () => {
    const out = applyFilters(products, { ...initialFilters, query: 'sustain' });
    expect(out.map((p) => p.id)).toEqual(['3']);
  });

  test('brand filter is OR across selected brands', () => {
    const out = applyFilters(products, {
      ...initialFilters,
      selectedBrands: new Set(['Dunlop', 'Cry Baby']),
    });
    expect(out.map((p) => p.id)).toEqual(['1', '2', '4']);
  });

  test('brand filter excludes products with null brand', () => {
    const out = applyFilters(products, {
      ...initialFilters,
      selectedBrands: new Set(['Dunlop']),
    });
    expect(out.map((p) => p.id)).toEqual(['1', '2']);
  });

  test('sort price-asc', () => {
    const out = applyFilters(products, { ...initialFilters, sort: 'price-asc' });
    expect(out.map((p) => p.id)).toEqual(['2', '1', '3', '4']);
  });

  test('sort price-desc', () => {
    const out = applyFilters(products, { ...initialFilters, sort: 'price-desc' });
    expect(out.map((p) => p.id)).toEqual(['4', '3', '1', '2']);
  });

  test('sort name-asc', () => {
    const out = applyFilters(products, { ...initialFilters, sort: 'name-asc' });
    expect(out.map((p) => p.name)).toEqual([
      'Brass Slide',
      'Cry Baby Wah',
      'Nylon Pick',
      'Tortex Pick',
    ]);
  });

  test('does not mutate input array', () => {
    const copy = products.slice();
    applyFilters(products, { ...initialFilters, sort: 'price-asc' });
    expect(products).toEqual(copy);
  });
});
