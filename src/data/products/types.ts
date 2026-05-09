import type { SelectionCategory } from '@/lib/state/useSelectionStore';

export type Product = {
  id: string;
  sku: string;
  name: string;
  brand?: string;
  priceCents: number;
  priceFormatted: string;
  image: string;
  category: SelectionCategory;
};
