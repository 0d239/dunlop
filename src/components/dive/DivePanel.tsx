'use client';

import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useSelectionStore } from '@/lib/state/useSelectionStore';
import { useCartStore } from '@/lib/state/useCartStore';
import { PRODUCTS_BY_CATEGORY } from '@/data/products';
import { CATEGORY_ORDER, CATEGORY_LABELS } from '@/lib/categories';
import {
  applyFilters,
  filtersReducer,
  initialFilters,
  isFiltered,
  type SortMode,
} from './filters';

export default function DivePanel() {
  const dive = useSelectionStore((s) => s.selected);
  const select = useSelectionStore((s) => s.select);
  const selectProduct = useSelectionStore((s) => s.selectProduct);
  const step = useSelectionStore((s) => s.step);
  const divePane = useSelectionStore((s) => s.divePane);
  const setDivePane = useSelectionStore((s) => s.setDivePane);
  const itemFocus = useSelectionStore((s) => s.itemFocus);
  const setItemFocus = useSelectionStore((s) => s.setItemFocus);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  const [filters, dispatch] = useReducer(filtersReducer, initialFilters);

  const open = dive !== null;
  const products = dive ? PRODUCTS_BY_CATEGORY[dive.category] : [];

  const filtered = useMemo(() => applyFilters(products, filters), [products, filters]);

  const brands = useMemo(
    () =>
      Array.from(
        new Set(products.map((p) => p.brand).filter((b): b is string => !!b)),
      ).sort(),
    [products],
  );

  const filtersActive = isFiltered(filters);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (dropdownOpen) {
          setDropdownOpen(false);
        } else {
          select(null);
        }
        return;
      }
      if (dropdownOpen) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      )
        return;

      // Items-pane keys are owned here because only DivePanel knows the
      // filtered list. The categories pane is driven by KeyboardController.
      if (divePane !== 'items') return;

      const len = filtered.length;
      if (len === 0) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setDivePane('categories');
        }
        return;
      }
      const cur = itemFocus ?? 0;
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setItemFocus(Math.min(len - 1, cur + 1));
          return;
        case 'ArrowUp':
          e.preventDefault();
          setItemFocus(Math.max(0, cur - 1));
          return;
        case 'ArrowLeft':
          e.preventDefault();
          setDivePane('categories');
          return;
        case 'ArrowRight': {
          e.preventDefault();
          const product = filtered[cur];
          if (product) selectProduct(product.id);
          return;
        }
        case 'Enter': {
          e.preventDefault();
          const product = filtered[cur];
          if (product) useCartStore.getState().add(product);
          return;
        }
        case 'Backspace': {
          e.preventDefault();
          const product = filtered[cur];
          if (product) useCartStore.getState().remove(product.id);
          return;
        }
        default:
          return;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    open,
    dropdownOpen,
    select,
    step,
    divePane,
    filtered,
    itemFocus,
    setDivePane,
    setItemFocus,
    selectProduct,
  ]);

  // Clamp itemFocus when the filtered list shrinks (e.g. user types in search).
  useEffect(() => {
    if (itemFocus === null) return;
    if (filtered.length === 0) {
      setItemFocus(null);
      return;
    }
    if (itemFocus >= filtered.length) setItemFocus(filtered.length - 1);
  }, [filtered, itemFocus, setItemFocus]);

  // Scroll the focused row into view when keyboard navigation moves it.
  useEffect(() => {
    if (divePane !== 'items' || itemFocus === null) return;
    const el = itemRefs.current[itemFocus];
    el?.scrollIntoView({ block: 'nearest' });
  }, [divePane, itemFocus]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const onDown = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        e.target instanceof Node &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [dropdownOpen]);

  useEffect(() => {
    setDropdownOpen(false);
  }, [dive?.category]);

  useEffect(() => {
    dispatch({ type: 'reset' });
  }, [dive?.category]);

  return (
    <aside
      aria-hidden={!open}
      className={`pointer-events-auto fixed bottom-16 right-0 top-0 z-20 flex w-[42vw] min-w-[360px] max-w-[520px] flex-col border-l border-white/15 bg-black/95 backdrop-blur transition-transform duration-300 ease-out ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <header
        onClick={() => setDivePane('categories')}
        className={`flex items-start justify-between border-b border-white/10 p-6 transition ${
          divePane === 'categories' ? 'bg-white/[0.03]' : ''
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
            Category
          </div>
          <div ref={dropdownRef} className="relative mt-1 flex items-center gap-3">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous category"
              className="text-neutral-500 transition hover:text-[#EF0000]"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
              className="flex items-center gap-2 text-2xl uppercase tracking-wide text-white transition hover:text-[#EF0000]"
            >
              {dive?.name ?? ''}
              <span aria-hidden className="text-base text-neutral-500">▾</span>
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next category"
              className="text-neutral-500 transition hover:text-[#EF0000]"
            >
              ›
            </button>

            {dropdownOpen ? (
              <ul
                role="listbox"
                className="absolute left-0 top-full z-40 mt-2 min-w-[220px] overflow-hidden rounded border border-white/15 bg-black/95 py-1 shadow-xl backdrop-blur"
              >
                {CATEGORY_ORDER.map((cat) => {
                  const count = PRODUCTS_BY_CATEGORY[cat].length;
                  const empty = count === 0;
                  const active = cat === dive?.category;
                  return (
                    <li key={cat}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() =>
                          select({ category: cat, name: CATEGORY_LABELS[cat] })
                        }
                        className={`flex w-full items-center justify-between gap-6 px-4 py-2 text-left text-[11px] uppercase tracking-[0.2em] transition ${
                          active
                            ? 'text-[#EF0000]'
                            : empty
                              ? 'italic text-neutral-600 hover:text-neutral-400'
                              : 'text-neutral-300 hover:text-white'
                        }`}
                      >
                        <span>{CATEGORY_LABELS[cat]}</span>
                        <span className="tabular-nums text-neutral-600">
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-neutral-600">
            {filtersActive
              ? `${filtered.length} of ${products.length} items`
              : `${products.length} ${products.length === 1 ? 'item' : 'items'}`}
          </div>
        </div>
        <button
          type="button"
          onClick={() => select(null)}
          aria-label="Close"
          className="rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-neutral-400 transition hover:border-[#EF0000] hover:text-[#EF0000]"
        >
          ESC
        </button>
      </header>

      {products.length > 0 ? (
        <div className="border-b border-white/10 px-5 py-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={filters.query}
              onChange={(e) =>
                dispatch({ type: 'set-query', query: e.target.value })
              }
              placeholder="Search"
              className="flex-1 rounded border border-white/10 bg-black/60 px-3 py-1.5 text-[12px] text-white placeholder:text-neutral-600 focus:border-white/30 focus:outline-none"
            />
            <select
              value={filters.sort}
              onChange={(e) =>
                dispatch({
                  type: 'set-sort',
                  sort: e.target.value as SortMode,
                })
              }
              className="rounded border border-white/10 bg-black/60 px-2 py-1.5 text-[11px] uppercase tracking-[0.15em] text-neutral-300 focus:border-white/30 focus:outline-none"
            >
              <option value="default">Sort</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="name-asc">Name A–Z</option>
            </select>
          </div>
          {brands.length > 1 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {brands.map((b) => {
                const active = filters.selectedBrands.has(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => dispatch({ type: 'toggle-brand', brand: b })}
                    className={`rounded-full border px-3 py-0.5 text-[10px] uppercase tracking-[0.15em] transition ${
                      active
                        ? 'border-[#EF0000] text-[#EF0000]'
                        : 'border-white/15 text-neutral-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        onClick={() => {
          if (filtered.length > 0) {
            setDivePane('items');
            if (itemFocus === null) setItemFocus(0);
          }
        }}
        className={`relative flex-1 overflow-y-auto transition ${
          divePane === 'items' ? 'bg-white/[0.02]' : ''
        }`}
      >
        {products.length === 0 ? (
          <div className="flex h-full items-center justify-center p-12 text-center">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-600">
                Coming soon
              </div>
              <div className="mt-3 text-sm text-neutral-500">
                Catalog for {dive?.name.toLowerCase()} hasn&apos;t been wired yet.
              </div>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-full items-center justify-center p-12 text-center">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-600">
                No matches
              </div>
              <button
                type="button"
                onClick={() => dispatch({ type: 'reset' })}
                className="mt-3 text-sm text-neutral-400 transition hover:text-[#EF0000]"
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {filtered.map((p, idx) => {
              const focused = divePane === 'items' && itemFocus === idx;
              return (
              <li
                key={p.id}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setDivePane('items');
                    setItemFocus(idx);
                    selectProduct(p.id);
                  }}
                  className={`group flex w-full items-center gap-4 border-l-2 px-5 py-3 text-left transition ${
                    focused
                      ? 'border-[#EF0000] bg-white/[0.06]'
                      : 'border-transparent hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded border border-white/10 bg-black">
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
                    <div className="truncate text-[13px] text-white group-hover:text-[#EF0000]">
                      {p.name}
                    </div>
                    {p.brand ? (
                      <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                        {p.brand}
                      </div>
                    ) : null}
                  </div>
                  <div className="text-[11px] tabular-nums text-neutral-400">
                    {p.priceFormatted}
                  </div>
                </button>
              </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
