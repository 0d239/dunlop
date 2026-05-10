# Category Navigation & Item Filters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users move between categories without closing the dive panel (chevrons + arrow keys + dropdown), and filter long item lists by search / sort / brand.

**Architecture:** Introduce a small `src/lib/categories.ts` module as the single source of truth for category order/labels/step logic. Add a `step(dir)` action to the existing zustand selection store. Rewrite the `DivePanel` header to host chevrons + a category dropdown, add a filter row above the list, and apply filters via a local `useReducer` + `useMemo`.

**Tech Stack:** Next.js 15 (App Router), React 19, Zustand 5, TailwindCSS, Bun 1.3 (test runner: `bun test`).

---

## Spec

Reference: `docs/superpowers/specs/2026-05-09-category-nav-and-filters-design.md`

## File Structure

| File                                        | Role                                                                        |
| ------------------------------------------- | --------------------------------------------------------------------------- |
| `src/lib/categories.ts` (new)               | Pure module: `CATEGORY_ORDER`, `CATEGORY_LABELS`, `stepCategory(curr, dir)` |
| `src/lib/categories.test.ts` (new)          | `bun test` — unit tests for `stepCategory`                                  |
| `src/lib/state/useSelectionStore.ts`        | Add `step(dir)` action                                                      |
| `src/lib/state/useSelectionStore.test.ts` (new) | `bun test` — unit tests for `step`                                      |
| `src/components/dive/filters.ts` (new)      | Pure: `FilterState`, `FilterAction`, `filtersReducer`, `applyFilters`, `initialFilters` |
| `src/components/dive/filters.test.ts` (new) | `bun test` — unit tests for reducer + applyFilters                          |
| `src/components/dive/DivePanel.tsx`         | Header rewrite, dropdown, filter row, list filtering                        |
| `src/components/room/Interactables.tsx`     | Replace inline names with `CATEGORY_LABELS`                                 |

Filter logic lives in its own file (`filters.ts`) so it stays testable in isolation and `DivePanel.tsx` doesn't grow unwieldy.

---

## Task 1: Categories module

**Files:**
- Create: `src/lib/categories.ts`
- Test: `src/lib/categories.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/categories.test.ts`:

```ts
import { describe, expect, test } from 'bun:test';
import {
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  stepCategory,
} from './categories';

describe('CATEGORY_ORDER', () => {
  test('contains all 9 categories in reading order', () => {
    expect(CATEGORY_ORDER).toEqual([
      'picks',
      'electronics',
      'capos',
      'slides',
      'strings',
      'cables',
      'straps',
      'apparel',
      'artists',
    ]);
  });

  test('every entry has a label', () => {
    for (const cat of CATEGORY_ORDER) {
      expect(CATEGORY_LABELS[cat]).toBeTruthy();
    }
  });
});

describe('stepCategory', () => {
  test('moves forward by one', () => {
    expect(stepCategory('picks', 1)).toBe('electronics');
    expect(stepCategory('slides', 1)).toBe('strings');
  });

  test('moves backward by one', () => {
    expect(stepCategory('electronics', -1)).toBe('picks');
    expect(stepCategory('strings', -1)).toBe('slides');
  });

  test('wraps at the end going forward', () => {
    expect(stepCategory('artists', 1)).toBe('picks');
  });

  test('wraps at the start going backward', () => {
    expect(stepCategory('picks', -1)).toBe('artists');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/lib/categories.test.ts`
Expected: FAIL — `Cannot find module './categories'`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/categories.ts`:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test src/lib/categories.test.ts`
Expected: PASS — 6 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/categories.ts src/lib/categories.test.ts
git commit -m "feat: category order/labels/step helpers"
```

---

## Task 2: Use CATEGORY_LABELS in Interactables

**Files:**
- Modify: `src/components/room/Interactables.tsx:30-40`

This is a no-op refactor (same strings) but locks `Interactables` and the new dropdown to one source of truth.

- [ ] **Step 1: Edit `GRID` to use the labels**

Add to imports near the top:

```ts
import { CATEGORY_LABELS } from '@/lib/categories';
```

Replace lines 30–40 (the `GRID` array) with:

```ts
const GRID: Slot[] = [
  { Comp: Pick,         col: 0, row: 2, name: CATEGORY_LABELS.picks,       category: 'picks' },
  { Comp: Pedalboard,   col: 1, row: 2, name: CATEGORY_LABELS.electronics, category: 'electronics' },
  { Comp: CapoHook,     col: 2, row: 2, name: CATEGORY_LABELS.capos,       category: 'capos' },
  { Comp: SlideTray,    col: 0, row: 1, name: CATEGORY_LABELS.slides,      category: 'slides' },
  { Comp: StringsShelf, col: 1, row: 1, name: CATEGORY_LABELS.strings,     category: 'strings' },
  { Comp: CableCoil,    col: 2, row: 1, name: CATEGORY_LABELS.cables,      category: 'cables' },
  { Comp: StrapDrape,   col: 0, row: 0, name: CATEGORY_LABELS.straps,      category: 'straps' },
  { Comp: Tshirt,       col: 1, row: 0, name: CATEGORY_LABELS.apparel,     category: 'apparel' },
  { Comp: Bookshelf,    col: 2, row: 0, name: CATEGORY_LABELS.artists,     category: 'artists' },
];
```

- [ ] **Step 2: Type-check**

Run: `bun run lint` (project's only static-check command)
Expected: PASS — no errors.

- [ ] **Step 3: Smoke-test in dev**

Run: `bun run dev` and visit `http://localhost:3000`. Click each of the 9 grid icons; the panel header should still show the right name. Stop the dev server when done.

- [ ] **Step 4: Commit**

```bash
git add src/components/room/Interactables.tsx
git commit -m "refactor: use CATEGORY_LABELS in Interactables grid"
```

---

## Task 3: Add `step` action to selection store

**Files:**
- Modify: `src/lib/state/useSelectionStore.ts`
- Test: `src/lib/state/useSelectionStore.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/state/useSelectionStore.test.ts`:

```ts
import { beforeEach, describe, expect, test } from 'bun:test';
import { useSelectionStore } from './useSelectionStore';

function reset() {
  useSelectionStore.setState({
    selected: null,
    selectedProductId: null,
    hovered: null,
    editorial: false,
  });
}

describe('useSelectionStore.step', () => {
  beforeEach(reset);

  test('no-op when nothing is selected', () => {
    useSelectionStore.getState().step(1);
    expect(useSelectionStore.getState().selected).toBeNull();
  });

  test('moves forward and updates name + category', () => {
    useSelectionStore.getState().select({ category: 'picks', name: 'Picks' });
    useSelectionStore.getState().step(1);
    const sel = useSelectionStore.getState().selected;
    expect(sel).toEqual({ category: 'electronics', name: 'Electronics' });
  });

  test('wraps at the end', () => {
    useSelectionStore.getState().select({ category: 'artists', name: 'Artists' });
    useSelectionStore.getState().step(1);
    expect(useSelectionStore.getState().selected?.category).toBe('picks');
  });

  test('clears selectedProductId on step', () => {
    useSelectionStore.getState().select({ category: 'picks', name: 'Picks' });
    useSelectionStore.getState().selectProduct('some-id');
    useSelectionStore.getState().step(1);
    expect(useSelectionStore.getState().selectedProductId).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/lib/state/useSelectionStore.test.ts`
Expected: FAIL — `step is not a function`.

- [ ] **Step 3: Add the action**

Edit `src/lib/state/useSelectionStore.ts`:

In the `SelectionStore` type, add:

```ts
  step: (dir: 1 | -1) => void;
```

In the `create<SelectionStore>(...)` call, add (anywhere in the returned object — placing it after `select` reads naturally):

```ts
  step: (dir) => {
    const current = get().selected;
    if (!current) return;
    const next = stepCategory(current.category, dir);
    set({
      selected: { category: next, name: CATEGORY_LABELS[next] },
      selectedProductId: null,
    });
  },
```

Update the imports at the top:

```ts
import { create } from 'zustand';
import { CATEGORY_LABELS, stepCategory } from '@/lib/categories';
```

The store creator signature changes from `(set) =>` to `(set, get) =>` so `step` can read current state.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test src/lib/state/useSelectionStore.test.ts`
Expected: PASS — 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/state/useSelectionStore.ts src/lib/state/useSelectionStore.test.ts
git commit -m "feat: step action on selection store"
```

---

## Task 4: Filter state module

**Files:**
- Create: `src/components/dive/filters.ts`
- Test: `src/components/dive/filters.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/components/dive/filters.test.ts`:

```ts
import { describe, expect, test } from 'bun:test';
import {
  applyFilters,
  filtersReducer,
  initialFilters,
  type FilterState,
} from './filters';
import type { Product } from '@/data/products';

const P = (
  id: string,
  name: string,
  brand: string | null,
  priceCents: number,
  description = '',
): Product => ({
  id,
  sku: id,
  name,
  brand,
  priceCents,
  priceFormatted: `$${(priceCents / 100).toFixed(2)}`,
  image: '',
  images: [],
  description,
  path: '',
  category: 'picks',
});

const products: Product[] = [
  P('1', 'Nylon Pick',     'Dunlop', 200, 'soft tone'),
  P('2', 'Tortex Pick',    'Dunlop', 150, 'bright attack'),
  P('3', 'Brass Slide',    null,     900, 'heavy sustain'),
  P('4', 'Cry Baby Wah',   'Cry Baby', 18000, 'classic wah'),
];

describe('filtersReducer', () => {
  test('set-query updates query', () => {
    const next = filtersReducer(initialFilters, {
      type: 'set-query',
      query: 'pick',
    });
    expect(next.query).toBe('pick');
  });

  test('toggle-brand adds then removes', () => {
    const a = filtersReducer(initialFilters, {
      type: 'toggle-brand',
      brand: 'Dunlop',
    });
    expect(a.selectedBrands.has('Dunlop')).toBe(true);
    const b = filtersReducer(a, { type: 'toggle-brand', brand: 'Dunlop' });
    expect(b.selectedBrands.has('Dunlop')).toBe(false);
  });

  test('reset returns initial state', () => {
    const dirty: FilterState = {
      query: 'foo',
      sort: 'price-asc',
      selectedBrands: new Set(['Dunlop']),
    };
    const next = filtersReducer(dirty, { type: 'reset' });
    expect(next).toEqual(initialFilters);
  });
});

describe('applyFilters', () => {
  test('default state returns input unchanged', () => {
    expect(applyFilters(products, initialFilters)).toEqual(products);
  });

  test('query matches name (case-insensitive)', () => {
    const out = applyFilters(products, { ...initialFilters, query: 'PICK' });
    expect(out.map((p) => p.id)).toEqual(['1', '2']);
  });

  test('query matches description', () => {
    const out = applyFilters(products, { ...initialFilters, query: 'sustain' });
    expect(out.map((p) => p.id)).toEqual(['3']);
  });

  test('brand filter is OR across selected brands', () => {
    const out = applyFilters(products, {
      ...initialFilters,
      selectedBrands: new Set(['Dunlop', 'Cry Baby']),
    });
    expect(out.map((p) => p.id)).toEqual(['1', '2', '4']);
  });

  test('brand filter excludes products with null brand', () => {
    const out = applyFilters(products, {
      ...initialFilters,
      selectedBrands: new Set(['Dunlop']),
    });
    expect(out.map((p) => p.id)).toEqual(['1', '2']);
  });

  test('sort price-asc', () => {
    const out = applyFilters(products, { ...initialFilters, sort: 'price-asc' });
    expect(out.map((p) => p.id)).toEqual(['2', '1', '3', '4']);
  });

  test('sort price-desc', () => {
    const out = applyFilters(products, { ...initialFilters, sort: 'price-desc' });
    expect(out.map((p) => p.id)).toEqual(['4', '3', '1', '2']);
  });

  test('sort name-asc', () => {
    const out = applyFilters(products, { ...initialFilters, sort: 'name-asc' });
    expect(out.map((p) => p.name)).toEqual([
      'Brass Slide',
      'Cry Baby Wah',
      'Nylon Pick',
      'Tortex Pick',
    ]);
  });

  test('does not mutate input array', () => {
    const copy = products.slice();
    applyFilters(products, { ...initialFilters, sort: 'price-asc' });
    expect(products).toEqual(copy);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/components/dive/filters.test.ts`
Expected: FAIL — `Cannot find module './filters'`.

- [ ] **Step 3: Write the implementation**

Create `src/components/dive/filters.ts`:

```ts
import type { Product } from '@/data/products';

export type SortMode = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

export type FilterState = {
  query: string;
  sort: SortMode;
  selectedBrands: Set<string>;
};

export type FilterAction =
  | { type: 'set-query'; query: string }
  | { type: 'set-sort'; sort: SortMode }
  | { type: 'toggle-brand'; brand: string }
  | { type: 'reset' };

export const initialFilters: FilterState = {
  query: '',
  sort: 'default',
  selectedBrands: new Set(),
};

export function filtersReducer(
  state: FilterState,
  action: FilterAction,
): FilterState {
  switch (action.type) {
    case 'set-query':
      return { ...state, query: action.query };
    case 'set-sort':
      return { ...state, sort: action.sort };
    case 'toggle-brand': {
      const next = new Set(state.selectedBrands);
      if (next.has(action.brand)) next.delete(action.brand);
      else next.add(action.brand);
      return { ...state, selectedBrands: next };
    }
    case 'reset':
      return initialFilters;
  }
}

export function isFiltered(state: FilterState): boolean {
  return (
    state.query !== '' ||
    state.sort !== 'default' ||
    state.selectedBrands.size > 0
  );
}

export function applyFilters(
  products: Product[],
  state: FilterState,
): Product[] {
  let out = products;

  if (state.query) {
    const q = state.query.toLowerCase();
    out = out.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }

  if (state.selectedBrands.size > 0) {
    out = out.filter(
      (p) => p.brand !== null && state.selectedBrands.has(p.brand),
    );
  }

  if (state.sort !== 'default') {
    out = out.slice();
    if (state.sort === 'price-asc') out.sort((a, b) => a.priceCents - b.priceCents);
    else if (state.sort === 'price-desc') out.sort((a, b) => b.priceCents - a.priceCents);
    else if (state.sort === 'name-asc') out.sort((a, b) => a.name.localeCompare(b.name));
  }

  return out;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test src/components/dive/filters.test.ts`
Expected: PASS — 13 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/dive/filters.ts src/components/dive/filters.test.ts
git commit -m "feat: filter state reducer + applyFilters"
```

---

## Task 5: DivePanel — header rewrite (chevrons + arrow keys)

**Files:**
- Modify: `src/components/dive/DivePanel.tsx`

This task adds chevrons and arrow-key handling but keeps the static title (no dropdown yet) so each task is independently verifiable.

- [ ] **Step 1: Replace the header and keydown effect**

Replace the entire contents of `src/components/dive/DivePanel.tsx` with:

```tsx
'use client';

import { useEffect } from 'react';
import { useSelectionStore } from '@/lib/state/useSelectionStore';
import { PRODUCTS_BY_CATEGORY } from '@/data/products';

export default function DivePanel() {
  const dive = useSelectionStore((s) => s.selected);
  const select = useSelectionStore((s) => s.select);
  const selectProduct = useSelectionStore((s) => s.selectProduct);
  const step = useSelectionStore((s) => s.step);

  const open = dive !== null;
  const products = dive ? PRODUCTS_BY_CATEGORY[dive.category] : [];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        select(null);
        return;
      }
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, select, step]);

  return (
    <aside
      aria-hidden={!open}
      className={`pointer-events-auto fixed bottom-16 right-0 top-0 z-20 flex w-[42vw] min-w-[360px] max-w-[520px] flex-col border-l border-white/15 bg-black/95 backdrop-blur transition-transform duration-300 ease-out ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <header className="flex items-start justify-between border-b border-white/10 p-6">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
            Category
          </div>
          <div className="mt-1 flex items-center gap-3">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous category"
              className="text-neutral-500 transition hover:text-[#EF0000]"
            >
              ‹
            </button>
            <h2 className="text-2xl uppercase tracking-wide text-white">
              {dive?.name ?? ''}
            </h2>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next category"
              className="text-neutral-500 transition hover:text-[#EF0000]"
            >
              ›
            </button>
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-neutral-600">
            {products.length} {products.length === 1 ? 'item' : 'items'}
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

      <div className="flex-1 overflow-y-auto">
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
        ) : (
          <ul className="divide-y divide-white/5">
            {products.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => selectProduct(p.id)}
                  className="group flex w-full items-center gap-4 px-5 py-3 text-left transition hover:bg-white/[0.03]"
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
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `bun run lint`
Expected: PASS.

- [ ] **Step 3: Manual verify in dev**

Run: `bun run dev` and visit `http://localhost:3000`.
1. Open any category from the room.
2. Click `‹` and `›` — should cycle through categories.
3. Press `←` and `→` — should also cycle.
4. Press `→` from Artists — should wrap to Picks.
5. Land on Strings/Apparel/Artists — should still show "Coming soon" page; chevrons keep working.
6. Press `Esc` — should close the panel.

Stop the dev server when verified.

- [ ] **Step 4: Commit**

```bash
git add src/components/dive/DivePanel.tsx
git commit -m "feat: chevrons + arrow keys for category nav in dive panel"
```

---

## Task 6: DivePanel — category dropdown

**Files:**
- Modify: `src/components/dive/DivePanel.tsx`

Replaces the static `<h2>` with a button that opens a dropdown listing all 9 categories with item counts.

- [ ] **Step 1: Edit the imports**

In `src/components/dive/DivePanel.tsx`, expand the imports:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useSelectionStore } from '@/lib/state/useSelectionStore';
import { PRODUCTS_BY_CATEGORY } from '@/data/products';
import { CATEGORY_ORDER, CATEGORY_LABELS } from '@/lib/categories';
```

- [ ] **Step 2: Add dropdown state and refs**

Inside `DivePanel`, just below the existing `step` selector and above `const open = …`, add:

```tsx
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
```

- [ ] **Step 3: Update the keydown effect**

Replace the existing keydown `useEffect` body with:

```tsx
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
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, dropdownOpen, select, step]);
```

- [ ] **Step 4: Add an outside-click effect**

Below the keydown effect, add:

```tsx
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
```

- [ ] **Step 5: Close dropdown when category changes**

Below the outside-click effect, add:

```tsx
  useEffect(() => {
    setDropdownOpen(false);
  }, [dive?.category]);
```

- [ ] **Step 6: Replace the title block**

In the header JSX, replace the inner `<div className="mt-1 flex items-center gap-3">…</div>` (the chevrons + `<h2>`) with:

```tsx
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
```

- [ ] **Step 7: Type-check**

Run: `bun run lint`
Expected: PASS.

- [ ] **Step 8: Manual verify in dev**

Run: `bun run dev` and visit `http://localhost:3000`.
1. Open any category. Click the category name — dropdown opens listing all 9 with counts on the right; the active one is red; empty ones are dim/italic.
2. Click an entry — panel jumps to that category, dropdown closes.
3. Open dropdown, click outside the dropdown — closes without closing panel.
4. Open dropdown, press `Esc` — dropdown closes; panel stays open. Press `Esc` again — panel closes.
5. Open dropdown, press `←`/`→` — should NOT step (no-op while open).
6. Close dropdown, press `←`/`→` — steps as before.
7. Click an empty category (Strings/Apparel/Artists) — "Coming soon" view; chevrons + dropdown still work.

Stop the dev server when verified.

- [ ] **Step 9: Commit**

```bash
git add src/components/dive/DivePanel.tsx
git commit -m "feat: category dropdown in dive panel header"
```

---

## Task 7: DivePanel — filter row + filtered list

**Files:**
- Modify: `src/components/dive/DivePanel.tsx`

- [ ] **Step 1: Expand the imports**

In `src/components/dive/DivePanel.tsx`, update the imports:

```tsx
'use client';

import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useSelectionStore } from '@/lib/state/useSelectionStore';
import { PRODUCTS_BY_CATEGORY } from '@/data/products';
import { CATEGORY_ORDER, CATEGORY_LABELS } from '@/lib/categories';
import {
  applyFilters,
  filtersReducer,
  initialFilters,
  isFiltered,
  type SortMode,
} from './filters';
```

- [ ] **Step 2: Add filter state inside `DivePanel`**

Inside `DivePanel`, just below the existing `dropdownOpen` / `dropdownRef` lines, add:

```tsx
  const [filters, dispatch] = useReducer(filtersReducer, initialFilters);
```

Right after `const products = dive ? PRODUCTS_BY_CATEGORY[dive.category] : [];`, add:

```tsx
  const filtered = useMemo(() => applyFilters(products, filters), [products, filters]);

  const brands = useMemo(
    () =>
      Array.from(
        new Set(products.map((p) => p.brand).filter((b): b is string => !!b)),
      ).sort(),
    [products],
  );

  const filtersActive = isFiltered(filters);
```

- [ ] **Step 3: Reset filters on category change**

Below the existing `useEffect(() => { setDropdownOpen(false); }, [dive?.category])`, add:

```tsx
  useEffect(() => {
    dispatch({ type: 'reset' });
  }, [dive?.category]);
```

- [ ] **Step 4: Update the count line**

Replace the existing count `<div>` (the `mt-1 text-[10px] uppercase tracking-[0.2em] text-neutral-600` block right below the dropdown wrapper) with:

```tsx
          <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-neutral-600">
            {filtersActive
              ? `${filtered.length} of ${products.length} items`
              : `${products.length} ${products.length === 1 ? 'item' : 'items'}`}
          </div>
```

- [ ] **Step 5: Insert the filter row**

Between the closing `</header>` tag and the `<div className="flex-1 overflow-y-auto">` block, insert:

```tsx
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
```

- [ ] **Step 6: Render the filtered list**

Replace `products.map((p) => …` (inside the `<ul>`) with `filtered.map((p) => …`. Update the empty-list condition: change `products.length === 0` to keep the existing "Coming soon" view, but add a separate empty-results case for when the category has products but filters yield nothing.

Replace the `<div className="flex-1 overflow-y-auto">…</div>` block with:

```tsx
      <div className="flex-1 overflow-y-auto">
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
            {filtered.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => selectProduct(p.id)}
                  className="group flex w-full items-center gap-4 px-5 py-3 text-left transition hover:bg-white/[0.03]"
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
            ))}
          </ul>
        )}
      </div>
```

- [ ] **Step 7: Type-check**

Run: `bun run lint`
Expected: PASS.

- [ ] **Step 8: Run all unit tests**

Run: `bun test`
Expected: PASS — all tests from Tasks 1, 3, and 4 (23 tests total).

- [ ] **Step 9: Manual verify in dev**

Run: `bun run dev` and visit `http://localhost:3000`.
1. Open Picks. Filter row is visible. Type "tortex" — list narrows; subtitle reads `N of 434 items`.
2. Clear search; pick a Sort option — order changes; subtitle reads `434 of 434 items`.
3. Switch to Electronics with `→`. Filters reset (search clears, sort returns to "Sort").
4. Open Capos. Brand chips visible if ≥2 distinct brands; click a chip — list narrows; chip is red.
5. Open Strings. Filter row is hidden (no products), "Coming soon" view shows. Switch back via dropdown.
6. Type a search that matches nothing — "No matches" view with "Clear filters" button. Click it — filters reset, full list returns.
7. Focus the search input; press `←`/`→` — caret moves inside the input, does NOT step categories.
8. Click outside the search input; press `←`/`→` — steps categories, filters reset.

Stop the dev server when verified.

- [ ] **Step 10: Commit**

```bash
git add src/components/dive/DivePanel.tsx
git commit -m "feat: search/sort/brand filters in dive panel"
```

---

## Final verification

- [ ] **All unit tests pass:** `bun test` — 23 tests across 3 files.
- [ ] **Lint passes:** `bun run lint`.
- [ ] **Manual checklist** (one final pass through the spec's testing section):
  - Open each category from the room.
  - Cycle all 9 with `→`, wrap from Artists → Picks.
  - Cycle all 9 with `←`, wrap from Picks → Artists.
  - Dropdown lists 9 entries with counts; jumps directly.
  - Dropdown dismisses on outside-click and Escape (without closing panel).
  - Search reduces list, count line updates.
  - Sort reorders; default preserves catalog order.
  - Brand chips multi-select; chip row hidden on Picks (mostly null brand).
  - Switching category resets filters.
  - Arrow keys inside search input move caret instead of stepping.
  - "No matches" empty state appears when filters yield 0; "Clear filters" works.
