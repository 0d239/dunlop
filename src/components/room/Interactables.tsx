'use client';

import { useCallback, useRef } from 'react';
import type { ComponentType } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Pick from './objects/Pick';
import Pedalboard from './objects/Pedalboard';
import CapoHook from './objects/CapoHook';
import SlideTray from './objects/SlideTray';
import StringsShelf from './objects/StringsShelf';
import CableCoil from './objects/CableCoil';
import StrapDrape from './objects/StrapDrape';
import Tshirt from './objects/Tshirt';
import Bookshelf from './objects/Bookshelf';
import type { InteractableProps } from './useInteractable';
import {
  useSelectionStore,
  type SelectionCategory,
} from '@/lib/state/useSelectionStore';

type Slot = {
  Comp: ComponentType<InteractableProps>;
  col: 0 | 1 | 2;
  row: 0 | 1 | 2;
  name: string;
  category: SelectionCategory;
};

const GRID: Slot[] = [
  { Comp: Pick,         col: 0, row: 2, name: 'Picks',       category: 'picks' },
  { Comp: Pedalboard,   col: 1, row: 2, name: 'Electronics', category: 'electronics' },
  { Comp: CapoHook,     col: 2, row: 2, name: 'Capos',       category: 'capos' },
  { Comp: SlideTray,    col: 0, row: 1, name: 'Slides',      category: 'slides' },
  { Comp: StringsShelf, col: 1, row: 1, name: 'Strings',     category: 'strings' },
  { Comp: CableCoil,    col: 2, row: 1, name: 'Cables',      category: 'cables' },
  { Comp: StrapDrape,   col: 0, row: 0, name: 'Straps',      category: 'straps' },
  { Comp: Tshirt,       col: 1, row: 0, name: 'Apparel',     category: 'apparel' },
  { Comp: Bookshelf,    col: 2, row: 0, name: 'Artists',     category: 'artists' },
];

const CELL = 4.5;
const GRID_SCALE = 0.55;
const DIVE_SCALE = 1.0;
const DIVE_TARGET: [number, number, number] = [-6, 4.5, 1];
const LAMBDA = 8;

export default function Interactables() {
  const onSelect = useCallback((name: string) => {
    if (typeof window !== 'undefined') {
      console.log('[room] selected:', name);
    }
  }, []);

  return (
    <group>
      {GRID.map((slot) => {
        const x = (slot.col - 1) * CELL;
        const y = slot.row * CELL;
        return (
          <GridCell
            key={slot.name}
            slot={slot}
            gridX={x}
            gridY={y}
            onSelect={onSelect}
          />
        );
      })}
    </group>
  );
}

function GridCell({
  slot,
  gridX,
  gridY,
  onSelect,
}: {
  slot: Slot;
  gridX: number;
  gridY: number;
  onSelect: (name: string) => void;
}) {
  const ref = useRef<THREE.Group>(null!);
  const dive = useSelectionStore((s) => s.selected);
  const isSelected = dive?.name === slot.name;
  const isAnyDive = dive !== null;

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    const tx = isSelected ? DIVE_TARGET[0] : gridX;
    const ty = isSelected ? DIVE_TARGET[1] : gridY;
    const tz = isSelected ? DIVE_TARGET[2] : 0;
    const ts = isSelected ? DIVE_SCALE : isAnyDive ? 0 : GRID_SCALE;

    g.position.x = THREE.MathUtils.damp(g.position.x, tx, LAMBDA, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, ty, LAMBDA, delta);
    g.position.z = THREE.MathUtils.damp(g.position.z, tz, LAMBDA, delta);
    const s = THREE.MathUtils.damp(g.scale.x, ts, LAMBDA, delta);
    g.scale.setScalar(s);
    g.visible = s > 0.02;
  });

  const { Comp, name, category } = slot;
  return (
    <group ref={ref} position={[gridX, gridY, 0]} scale={GRID_SCALE}>
      <Comp name={name} category={category} onSelect={onSelect} />
    </group>
  );
}
