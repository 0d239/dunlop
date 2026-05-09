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
  hovered: string | null;
  select: (selection: Selection | null) => void;
  setHovered: (name: string | null) => void;
};

export const useSelectionStore = create<SelectionStore>((set) => ({
  selected: null,
  hovered: null,
  select: (selection) => set({ selected: selection }),
  setHovered: (name) => set({ hovered: name }),
}));
