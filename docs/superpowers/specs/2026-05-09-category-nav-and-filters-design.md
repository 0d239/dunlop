# Category Navigation & Item Filters

**Date:** 2026-05-09
**Status:** Approved for planning
**Scope:** `src/components/dive/DivePanel.tsx` + supporting state/lib modules

## Goal

Make it easy to move between categories once the dive panel is open, and start filtering long item lists. Today the panel is one-way: open a category from the room, browse, close, open another. With 6 populated categories (some with hundreds of items) and 3 placeholders, browsing is friction-heavy.

## Non-goals (v1)

- Up/down arrow key navigation between items, Enter-to-add-to-cart.
- Price range filter.
- Category-specific filters (pick gauge, cable length, capo style) — these require richer scraped metadata.
- Persisting filter state across category switches.
- Changes to `ProductPanel`.

## Components

### 1. Canonical category order

New module `src/lib/categories.ts` exports the single source of truth for category ordering, labels, and step helpers. Order matches the room's reading flow (top-left to bottom-right of the 3×3 grid in `Interactables.tsx`):

```
picks → electronics → capos → slides → strings → cables → straps → apparel → artists
```

Exports:

- `CATEGORY_ORDER: readonly SelectionCategory[]` — the 9-entry array above.
- `CATEGORY_LABELS: Record<SelectionCategory, string>` — display strings (`'Picks'`, `'Electronics'`, …) lifted from `Interactables.tsx`.
- `stepCategory(current: SelectionCategory, dir: 1 | -1): SelectionCategory` — wraps at both ends.

`Interactables.tsx` should import `CATEGORY_LABELS` rather than duplicating the names inline, so the dropdown and the room cannot drift.

### 2. Selection store

`useSelectionStore` gains a single new action:

```ts
step: (dir: 1 | -1) => void;
```

Behavior: if `selected` is null, no-op. Otherwise compute the neighbor via `stepCategory`, set `selected = { category: next, name: CATEGORY_LABELS[next] }`, and clear `selectedProductId` (existing `select` already does this — `step` should call `select` internally to inherit that reset).

### 3. Dive panel header

Replaces the current static header in `DivePanel.tsx`. Layout:

```
┌───────────────────────────────────────┐
│ CATEGORY                         ESC  │
│ ‹  PICKS ▾                    ›       │
│ 434 items                             │
├───────────────────────────────────────┤
```

- **`‹` / `›` buttons**: call `step(-1)` / `step(+1)`. Same red hover treatment (`#EF0000`) as the existing close button.
- **`PICKS ▾` button**: opens a dropdown menu anchored under the button. Lists all 9 categories with item counts on the right (`PICKS … 434`). Empty categories render dimmed/italic but remain selectable, landing on the "Coming soon" view. Selecting an item dispatches `select({ category, name: CATEGORY_LABELS[category] })`.
- **Dropdown dismiss**: outside-click, Escape, or selection. While the dropdown is open, Escape closes the dropdown (not the panel). Implementation: a local `dropdownOpen` state; the keydown handler checks `dropdownOpen` first.
- **Item count line**: see filter behavior below — switches between `"434 items"` and `"23 of 434 items"`.

### 4. Keyboard

The existing `Esc` listener in `DivePanel` is extended into a single keydown handler:

| Key       | When dropdown closed         | When dropdown open |
| --------- | ---------------------------- | ------------------ |
| `Escape`  | Close panel                  | Close dropdown     |
| `←`       | `step(-1)`                   | (no-op)            |
| `→`       | `step(+1)`                   | (no-op)            |

Arrow keys are ignored when focus is inside the search input (so users can move the caret normally). Easiest check: `if (e.target instanceof HTMLInputElement) return;` for the arrow branches.

### 5. Filter row

Sits between the header and the items list. Always visible (no collapse).

```
├───────────────────────────────────────┤
│ [search input             ] [sort ▾]  │
│ [Dunlop] [MXR] [Cry Baby]             │
├───────────────────────────────────────┤
```

Filter state is local to `DivePanel` (a single `useReducer` to keep resets atomic):

- `query: string`
- `sort: 'default' | 'price-asc' | 'price-desc' | 'name-asc'`
- `selectedBrands: Set<string>` (empty set = no brand filter)

Behaviors:

- **Search**: case-insensitive substring match on `name + ' ' + description`. Re-derived via `useMemo` keyed on `[products, query, sort, selectedBrands]`. No async or external debounce; React's render is fast enough for ~500-item arrays.
- **Sort**: applied after filter. `'default'` preserves the catalog's existing order.
- **Brand chips**: derived from `Array.from(new Set(products.map(p => p.brand).filter(Boolean)))`, sorted alphabetically. The whole chip row is hidden if the derived list has ≤1 entry. Selection is multi-select with OR semantics (a product passes if `selectedBrands.size === 0 || selectedBrands.has(p.brand)`).
- **Reset on category change**: a `useEffect` keyed on `dive?.category` dispatches a `RESET` action to the reducer. This is the only cross-category coupling.
- **Counted item line**: when `query`, `sort !== 'default'`, or `selectedBrands.size > 0`, the header subtitle reads `"{filtered} of {total} items"`. Otherwise `"{total} items"`.

### 6. Files touched

| File                                        | Change                                       |
| ------------------------------------------- | -------------------------------------------- |
| `src/lib/categories.ts`                     | New. Order, labels, step helpers.            |
| `src/lib/state/useSelectionStore.ts`        | Add `step(dir)` action.                      |
| `src/components/dive/DivePanel.tsx`         | Header rewrite, filter row, list filtering.  |
| `src/components/room/Interactables.tsx`     | Import `CATEGORY_LABELS` instead of inline.  |

No data shape changes. `ProductPanel` is untouched.

## Testing

Manual verification (no automated test infra yet in this repo):

- Open each category from the room; chevrons + arrow keys cycle through all 9 in order, wrapping at both ends.
- Land on `strings` / `apparel` / `artists`: "Coming soon" view renders, chevrons + dropdown still work.
- Dropdown: outside-click closes; Escape closes the dropdown without closing the panel; selecting jumps to the chosen category.
- Search reduces the visible list and updates the count line; sort reorders; brand chips toggle multi-select.
- Switch categories with active filters → filters reset; brand chip row hides on categories with ≤1 brand.
- Arrow keys inside the search field move the caret instead of stepping categories.
