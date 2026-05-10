import type { SelectionCategory } from './state/useSelectionStore';

export const CATEGORY_ORDER: readonly SelectionCategory[] = [
  'picks',
  'electronics',
  'capos',
  'slides',
  'strings',
  'cables',
  'straps',
  'apparel',
  'artists',
] as const;

export const CATEGORY_LABELS: Record<SelectionCategory, string> = {
  picks: 'Picks',
  electronics: 'Electronics',
  capos: 'Capos',
  slides: 'Slides',
  strings: 'Strings',
  cables: 'Cables',
  straps: 'Straps',
  apparel: 'Apparel',
  artists: 'Artists',
};

export function stepCategory(
  current: SelectionCategory,
  dir: 1 | -1,
): SelectionCategory {
  const idx = CATEGORY_ORDER.indexOf(current);
  const len = CATEGORY_ORDER.length;
  const next = (idx + dir + len) % len;
  return CATEGORY_ORDER[next];
}
