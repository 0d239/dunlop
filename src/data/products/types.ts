import type { SelectionCategory } from '@/lib/state/useSelectionStore';

export type Product = {
  id: string;
  sku: string;
  name: string;
  brand: string | null;
  priceCents: number;
  priceFormatted: string;
  image: string;
  images: string[];
  description: string;
  path: string;
  category: SelectionCategory;
};
