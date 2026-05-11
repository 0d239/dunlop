import { create } from 'zustand';
import { CATEGORY_LABELS, stepCategory } from '@/lib/categories';

export type SelectionCategory =
  | 'picks'
  | 'electronics'
  | 'capos'
  | 'slides'
  | 'straps'
  | 'cables'
  | 'strings'
  | 'apparel'
  | 'artists';

export type Selection = {
  name: string;
  category: SelectionCategory;
};

export type DivePane = 'categories' | 'items';

type SelectionStore = {
  selected: Selection | null;
  selectedProductId: string | null;
  hovered: string | null;
  editorial: boolean;
  gridFocus: number | null;
  divePane: DivePane;
  itemFocus: number | null;
  select: (selection: Selection | null) => void;
  selectProduct: (id: string | null) => void;
  setHovered: (name: string | null) => void;
  openEditorial: () => void;
  closeEditorial: () => void;
  step: (dir: 1 | -1) => void;
  setGridFocus: (idx: number | null) => void;
  setDivePane: (pane: DivePane) => void;
  setItemFocus: (idx: number | null) => void;
};

export const useSelectionStore = create<SelectionStore>((set, get) => ({
  selected: null,
  selectedProductId: null,
  hovered: null,
  editorial: false,
  gridFocus: null,
  divePane: 'categories',
  itemFocus: null,
  select: (selection) =>
    set({
      selected: selection,
      selectedProductId: null,
      divePane: 'categories',
      itemFocus: null,
    }),
  step: (dir) => {
    const current = get().selected;
    if (!current) return;
    const next = stepCategory(current.category, dir);
    set({
      selected: { category: next, name: CATEGORY_LABELS[next] },
      selectedProductId: null,
      divePane: 'categories',
      itemFocus: null,
    });
  },
  selectProduct: (id) => set({ selectedProductId: id }),
  setHovered: (name) => set({ hovered: name }),
  openEditorial: () =>
    set({ editorial: true, selected: null, selectedProductId: null }),
  closeEditorial: () => set({ editorial: false }),
  setGridFocus: (idx) => set({ gridFocus: idx }),
  setDivePane: (pane) => set({ divePane: pane }),
  setItemFocus: (idx) => set({ itemFocus: idx }),
}));
