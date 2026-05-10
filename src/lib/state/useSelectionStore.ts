import { create } from 'zustand';

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

type SelectionStore = {
  selected: Selection | null;
  selectedProductId: string | null;
  hovered: string | null;
  editorial: boolean;
  select: (selection: Selection | null) => void;
  selectProduct: (id: string | null) => void;
  setHovered: (name: string | null) => void;
  openEditorial: () => void;
  closeEditorial: () => void;
};

export const useSelectionStore = create<SelectionStore>((set) => ({
  selected: null,
  selectedProductId: null,
  hovered: null,
  editorial: false,
  select: (selection) =>
    set({ selected: selection, selectedProductId: null }),
  selectProduct: (id) => set({ selectedProductId: id }),
  setHovered: (name) => set({ hovered: name }),
  openEditorial: () =>
    set({ editorial: true, selected: null, selectedProductId: null }),
  closeEditorial: () => set({ editorial: false }),
}));
