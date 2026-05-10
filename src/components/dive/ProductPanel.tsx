'use client';

import { useEffect } from 'react';
import { useSelectionStore } from '@/lib/state/useSelectionStore';
import { useCartStore } from '@/lib/state/useCartStore';
import { PRODUCT_BY_ID } from '@/data/products';

export default function ProductPanel() {
  const productId = useSelectionStore((s) => s.selectedProductId);
  const selectProduct = useSelectionStore((s) => s.selectProduct);
  const add = useCartStore((s) => s.add);

  const product = productId ? PRODUCT_BY_ID[productId] ?? null : null;
  const open = product !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') selectProduct(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, selectProduct]);

  return (
    <aside
      aria-hidden={!open}
      className={`pointer-events-auto fixed bottom-16 right-0 top-0 z-30 flex w-[42vw] min-w-[360px] max-w-[520px] flex-col border-l border-black/15 bg-white/95 backdrop-blur transition-transform duration-300 ease-out dark:border-white/15 dark:bg-black/95 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <header className="flex items-start justify-between border-b border-black/10 p-6 dark:border-white/10">
        <button
          type="button"
          onClick={() => selectProduct(null)}
          className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 transition hover:text-[#EF0000]"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => selectProduct(null)}
          aria-label="Close"
          className="rounded-full border border-black/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-neutral-600 transition hover:border-[#EF0000] hover:text-[#EF0000] dark:border-white/15 dark:text-neutral-400"
        >
          ESC
        </button>
      </header>

      {product ? (
        <div className="flex-1 overflow-y-auto">
          <div className="relative aspect-square w-full overflow-hidden border-b border-black/10 bg-white dark:border-white/10 dark:bg-black">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            ) : null}
          </div>

          <div className="px-6 py-5">
            {product.brand ? (
              <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                {product.brand}
              </div>
            ) : null}
            <h2 className="mt-2 text-xl uppercase tracking-wide text-neutral-950 dark:text-white">
              {product.name}
            </h2>
            <div className="mt-3 flex items-baseline gap-4">
              <div className="text-2xl tabular-nums text-neutral-950 dark:text-white">
                {product.priceFormatted}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-600">
                SKU {product.sku}
              </div>
            </div>
          </div>

          {product.description ? (
            <div className="border-t border-black/10 px-6 py-5 text-sm leading-relaxed text-neutral-700 dark:border-white/10 dark:text-neutral-300">
              {product.description}
            </div>
          ) : null}

          {product.images.length > 1 ? (
            <div className="border-t border-black/10 px-6 py-5 dark:border-white/10">
              <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-600">
                Gallery
              </div>
              <div className="grid grid-cols-3 gap-2">
                {product.images.slice(0, 6).map((src, i) => (
                  <div
                    key={`${product.id}-img-${i}`}
                    className="relative aspect-square overflow-hidden border border-black/10 bg-white dark:border-white/10 dark:bg-black"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="sticky bottom-0 mt-auto border-t border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
            <button
              type="button"
              onClick={() => add(product)}
              className="w-full rounded-full border border-black/20 py-3 text-[11px] uppercase tracking-[0.3em] text-neutral-800 transition hover:border-[#EF0000] hover:text-[#EF0000] dark:border-white/20 dark:text-neutral-200"
            >
              Add to basket
            </button>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
