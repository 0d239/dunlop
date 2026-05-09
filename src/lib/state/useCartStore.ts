import { create } from 'zustand';
import type { Product } from '@/data/products/types';

export type CartLine = {
  product: Product;
  qty: number;
};

type CartStore = {
  lines: CartLine[];
  add: (product: Product) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  lines: [],
  add: (product) =>
    set((s) => {
      const existing = s.lines.find((l) => l.product.id === product.id);
      if (existing) {
        return {
          lines: s.lines.map((l) =>
            l.product.id === product.id ? { ...l, qty: l.qty + 1 } : l,
          ),
        };
      }
      return { lines: [...s.lines, { product, qty: 1 }] };
    }),
  remove: (productId) =>
    set((s) => ({ lines: s.lines.filter((l) => l.product.id !== productId) })),
  setQty: (productId, qty) =>
    set((s) => ({
      lines: qty <= 0
        ? s.lines.filter((l) => l.product.id !== productId)
        : s.lines.map((l) =>
            l.product.id === productId ? { ...l, qty } : l,
          ),
    })),
  clear: () => set({ lines: [] }),
}));

export const selectItemCount = (s: CartStore) =>
  s.lines.reduce((sum, l) => sum + l.qty, 0);

export const selectSubtotalCents = (s: CartStore) =>
  s.lines.reduce((sum, l) => sum + l.product.priceCents * l.qty, 0);
