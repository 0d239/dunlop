'use client';

import { useEffect } from 'react';
import { useSelectionStore } from '@/lib/state/useSelectionStore';
import { useCartStore } from '@/lib/state/useCartStore';
import { PRODUCTS_BY_CATEGORY } from '@/data/products';

export default function DivePanel() {
  const dive = useSelectionStore((s) => s.selected);
  const select = useSelectionStore((s) => s.select);
  const add = useCartStore((s) => s.add);

  const open = dive !== null;
  const products = dive ? PRODUCTS_BY_CATEGORY[dive.category] : [];

  // ESC closes the dive
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
      className={`pointer-events-auto fixed bottom-16 right-0 top-0 z-20 flex w-[42vw] min-w-[360px] max-w-[520px] flex-col border-l border-white/15 bg-black/95 backdrop-blur transition-transform duration-300 ease-out ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <header className="flex items-start justify-between border-b border-white/10 p-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
            Category
          </div>
          <h2 className="mt-1 text-2xl uppercase tracking-wide text-white">
            {dive?.name ?? ''}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => select(null)}
          aria-label="Close"
          className="rounded-full border border-white/15 px-3 py-1 text-xs text-neutral-400 transition hover:border-[#EF0000] hover:text-[#EF0000]"
        >
          ESC
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        {products.length === 0 ? (
          <div className="flex h-full items-center justify-center p-12 text-center">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-neutral-600">
                Coming soon
              </div>
              <div className="mt-3 text-sm text-neutral-500">
                Catalog for {dive?.name.toLowerCase()} hasn&apos;t been wired yet.
              </div>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {products.map((p) => (
              <li key={p.id} className="flex items-center gap-4 p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-white/10 bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm text-white">{p.name}</div>
                  <div className="text-xs text-neutral-500">
                    {p.priceFormatted}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => add(p)}
                  className="rounded-full border border-white/20 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-neutral-300 transition hover:border-[#EF0000] hover:text-[#EF0000]"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
