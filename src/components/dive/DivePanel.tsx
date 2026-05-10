'use client';

import { useEffect } from 'react';
import { useSelectionStore } from '@/lib/state/useSelectionStore';
import { PRODUCTS_BY_CATEGORY } from '@/data/products';

export default function DivePanel() {
  const dive = useSelectionStore((s) => s.selected);
  const select = useSelectionStore((s) => s.select);
  const selectProduct = useSelectionStore((s) => s.selectProduct);

  const open = dive !== null;
  const products = dive ? PRODUCTS_BY_CATEGORY[dive.category] : [];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') select(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, select]);

  return (
    <aside
      aria-hidden={!open}
      className={`pointer-events-auto fixed bottom-16 right-0 top-0 z-20 flex w-[42vw] min-w-[360px] max-w-[520px] flex-col border-l border-black/15 bg-white/95 backdrop-blur transition-transform duration-300 ease-out dark:border-white/15 dark:bg-black/95 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <header className="flex items-start justify-between border-b border-black/10 p-6 dark:border-white/10">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
            Category
          </div>
          <h2 className="mt-1 text-2xl uppercase tracking-wide text-neutral-950 dark:text-white">
            {dive?.name ?? ''}
          </h2>
          <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-600">
            {products.length} {products.length === 1 ? 'item' : 'items'}
          </div>
        </div>
        <button
          type="button"
          onClick={() => select(null)}
          aria-label="Close"
          className="rounded-full border border-black/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-neutral-600 transition hover:border-[#EF0000] hover:text-[#EF0000] dark:border-white/15 dark:text-neutral-400"
        >
          ESC
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        {products.length === 0 ? (
          <div className="flex h-full items-center justify-center p-12 text-center">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-600">
                Coming soon
              </div>
              <div className="mt-3 text-sm text-neutral-500">
                Catalog for {dive?.name.toLowerCase()} hasn&apos;t been wired yet.
              </div>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-black/5 dark:divide-white/5">
            {products.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => selectProduct(p.id)}
                  className="group flex w-full items-center gap-4 px-5 py-3 text-left transition hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded border border-black/10 bg-white dark:border-white/10 dark:bg-black">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] text-neutral-950 group-hover:text-[#EF0000] dark:text-white">
                      {p.name}
                    </div>
                    {p.brand ? (
                      <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-600">
                        {p.brand}
                      </div>
                    ) : null}
                  </div>
                  <div className="text-[11px] tabular-nums text-neutral-600 dark:text-neutral-400">
                    {p.priceFormatted}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
