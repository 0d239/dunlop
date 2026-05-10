import type { SelectionCategory } from '@/lib/state/useSelectionStore';
import catalog from '../catalog.json';
import type { Product } from './types';

export type { Product } from './types';

type CatalogProduct = (typeof catalog.picks)[number];

function tag(category: SelectionCategory) {
  return (p: CatalogProduct): Product => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    brand: p.brand,
    priceCents: p.priceCents,
    priceFormatted: p.priceFormatted,
    image: p.image,
    images: p.images,
    description: p.description,
    path: p.path,
    category,
  });
}

export const PRODUCTS_BY_CATEGORY: Record<SelectionCategory, Product[]> = {
  picks: catalog.picks.map(tag('picks')),
  electronics: catalog.electronics.map(tag('electronics')),
  capos: catalog.capos.map(tag('capos')),
  slides: catalog.slides.map(tag('slides')),
  cables: catalog.cables.map(tag('cables')),
  straps: catalog.straps.map(tag('straps')),
  strings: [],
  apparel: [],
  artists: [],
};

export const PRODUCT_BY_ID: Record<string, Product> = Object.fromEntries(
  Object.values(PRODUCTS_BY_CATEGORY)
    .flat()
    .map((p) => [p.id, p]),
);
