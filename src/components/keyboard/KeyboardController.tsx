'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/state/useCartStore';
import {
  useSelectionStore,
  type SelectionCategory,
} from '@/lib/state/useSelectionStore';
import { CATEGORY_LABELS } from '@/lib/categories';

type GridSlot = {
  col: 0 | 1 | 2;
  row: 0 | 1 | 2;
  category: SelectionCategory;
  name: string;
};

// Mirrors GRID in Interactables.tsx. Index 4 (row 1, col 1) = Strings, the
// default focus when arrow keys wake up the grid.
const GRID_LAYOUT: GridSlot[] = [
  { col: 0, row: 2, category: 'picks',       name: 'Picks' },
  { col: 1, row: 2, category: 'electronics', name: 'Electronics' },
  { col: 2, row: 2, category: 'capos',       name: 'Capos' },
  { col: 0, row: 1, category: 'slides',      name: 'Slides' },
  { col: 1, row: 1, category: 'strings',     name: 'Strings' },
  { col: 2, row: 1, category: 'cables',      name: 'Cables' },
  { col: 0, row: 0, category: 'straps',      name: 'Straps' },
  { col: 1, row: 0, category: 'apparel',     name: 'Apparel' },
  { col: 2, row: 0, category: 'artists',     name: 'Artists' },
];

const CENTER_INDEX = 4;

function findSlot(col: number, row: number) {
  return GRID_LAYOUT.findIndex((s) => s.col === col && s.row === row);
}

function moveGridFocus(currentIdx: number, key: string): number {
  const slot = GRID_LAYOUT[currentIdx];
  if (!slot) return CENTER_INDEX;
  let { col, row } = slot;
  // Screen-up = visually higher row. Visual top of grid = row 2 in scene
  // coords, so ArrowUp increments row.
  if (key === 'ArrowUp') row = Math.min(2, row + 1) as 0 | 1 | 2;
  else if (key === 'ArrowDown') row = Math.max(0, row - 1) as 0 | 1 | 2;
  else if (key === 'ArrowLeft') col = Math.max(0, col - 1) as 0 | 1 | 2;
  else if (key === 'ArrowRight') col = Math.min(2, col + 1) as 0 | 1 | 2;
  const next = findSlot(col, row);
  return next >= 0 ? next : currentIdx;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}

export default function KeyboardController() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const cart = useCartStore.getState();
      const sel = useSelectionStore.getState();

      // Spacebar toggles the cart from anywhere — except while typing in an
      // input, where space must reach the field as a real character.
      if (e.code === 'Space' || e.key === ' ') {
        if (isTypingTarget(e.target)) return;
        e.preventDefault();
        cart.toggleOpen();
        return;
      }

      // Cart open: let CartPanel handle Escape; suppress arrow keys so they
      // don't leak into grid/dive nav while the cart has the user's attention.
      if (cart.open) {
        if (
          e.key === 'ArrowUp' ||
          e.key === 'ArrowDown' ||
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight'
        ) {
          // No-op intentionally.
        }
        return;
      }

      // Skip when typing.
      if (isTypingTarget(e.target)) return;

      // ── Dive open: drive the wheel from the categories pane. The items
      //    pane lives in DivePanel because only it knows the filtered list.
      if (sel.selected) {
        if (sel.divePane === 'items') return; // DivePanel handles these keys
        switch (e.key) {
          case 'ArrowUp':
            // The cell above active represents the "next" category in the
            // wheel (it descends Ferris-wheel-style into the active slot).
            e.preventDefault();
            sel.step(1);
            return;
          case 'ArrowDown':
            e.preventDefault();
            sel.step(-1);
            return;
          case 'ArrowRight':
          case 'Enter':
            e.preventDefault();
            sel.setDivePane('items');
            sel.setItemFocus(0);
            return;
          case 'ArrowLeft':
            e.preventDefault();
            sel.select(null);
            return;
          default:
            return;
        }
      }

      // ── Base page (no dive): arrow keys move grid focus, Enter dives.
      if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        e.preventDefault();
        const current = sel.gridFocus;
        if (current === null) {
          sel.setGridFocus(CENTER_INDEX);
        } else {
          sel.setGridFocus(moveGridFocus(current, e.key));
        }
        return;
      }

      if (e.key === 'Enter') {
        const idx = sel.gridFocus;
        if (idx === null) return;
        const slot = GRID_LAYOUT[idx];
        if (!slot) return;
        e.preventDefault();
        sel.select({ category: slot.category, name: slot.name });
        return;
      }

      if (e.key === 'Escape') {
        if (sel.gridFocus !== null) {
          e.preventDefault();
          sel.setGridFocus(null);
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return null;
}

export { GRID_LAYOUT, CATEGORY_LABELS };
