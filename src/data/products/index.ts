import type { SelectionCategory } from '@/lib/state/useSelectionStore';
import { PICKS } from './picks';
import type { Product } from './types';

export type { Product } from './types';

/**
 * Mock catalog. Picks is the only seeded category for the M1 demo loop;
 * other categories return an empty list and the panel will show a placeholder.
 */
export const PRODUCTS_BY_CATEGORY: Record<SelectionCategory, Product[]> = {
  picks: PICKS,
  electronics: [],
  capos: [],
  slides: [],
  straps: [],
  cables: [],
  strings: [],
  apparel: [],
  artists: [],
};
