'use client';

import { useCallback, useRef } from 'react';
import type { ComponentType } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
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
const LAMBDA = 6;

/**
 * Wheel layout when a category is open. All 9 cells park on a circle in the
 * XY plane around DIVE_TARGET. Selected sits at angle 0 (top); ±1 step lands
 * at ±(2π/9), curving down on either side. |offset| > 1 stays parked at
 * scale 0 so it slides naturally back into view as the wheel turns.
 */
const WHEEL_RADIUS = 4;
const WHEEL_FADED_SCALE = 0.4;
const WHEEL_VISIBLE_OFFSET = 1;

/**
 * Invisible click panels behind each visible cell. Bigger than the icons
 * themselves so users can hit them reliably without aiming at the small
 * geometry. Sizes are tuned so adjacent panels meet at the seam (no
 * dead space between the wheel cells), and grid panels don't overlap their
 * 4.5-unit neighbors.
 */
const GRID_PANEL_SIZE = 3.6;
const PRIME_PANEL_SIZE = 3.4;
const SIDE_PANEL_SIZE = 2.0;

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
  const posRef = useRef<THREE.Group>(null!);
  const scaleRef = useRef<THREE.Group>(null!);
  const dive = useSelectionStore((s) => s.selected);
  const editorial = useSelectionStore((s) => s.editorial);
  const select = useSelectionStore((s) => s.select);
  const isAnyDive = dive !== null;

  // Compute wheel offset once per render so JSX can branch on it.
  let offset: number | null = null;
  if (isAnyDive && dive) {
    const N = GRID.length;
    const myIdx = GRID.findIndex((s) => s.category === slot.category);
    const selIdx = GRID.findIndex((s) => s.category === dive.category);
    if (myIdx >= 0 && selIdx >= 0) {
      offset = (((myIdx - selIdx) % N) + N) % N;
      if (offset > N / 2) offset -= N;
    }
  }

  const isPrime = offset === 0;
  const isSidePanel =
    offset !== null && Math.abs(offset) === WHEEL_VISIBLE_OFFSET;

  // Hit panel is rendered when:
  //   - grid mode (no dive): every cell, full grid panel size
  //   - wheel mode prime / side: visible cells only
  //   - editorial: never
  const showPanel = !editorial && (!isAnyDive || isPrime || isSidePanel);
  const panelSize = isAnyDive
    ? isPrime
      ? PRIME_PANEL_SIZE
      : SIDE_PANEL_SIZE
    : GRID_PANEL_SIZE;

  useFrame((_, delta) => {
    const p = posRef.current;
    const s = scaleRef.current;
    if (!p || !s) return;

    let tx = gridX;
    let ty = gridY;
    let tz = 0;
    let ts = GRID_SCALE;

    if (editorial) {
      ts = 0;
    } else if (isAnyDive && offset !== null) {
      const angle = offset * ((2 * Math.PI) / GRID.length);
      tx = DIVE_TARGET[0] + WHEEL_RADIUS * Math.sin(angle);
      ty = DIVE_TARGET[1] - WHEEL_RADIUS * (1 - Math.cos(angle));
      tz = DIVE_TARGET[2];

      if (isPrime) ts = DIVE_SCALE;
      else if (isSidePanel) ts = WHEEL_FADED_SCALE;
      else ts = 0;
    }

    p.position.x = THREE.MathUtils.damp(p.position.x, tx, LAMBDA, delta);
    p.position.y = THREE.MathUtils.damp(p.position.y, ty, LAMBDA, delta);
    p.position.z = THREE.MathUtils.damp(p.position.z, tz, LAMBDA, delta);
    const sc = THREE.MathUtils.damp(s.scale.x, ts, LAMBDA, delta);
    s.scale.setScalar(sc);
    s.visible = sc > 0.02;
  });

  const onPanelClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // Wheel prime is a no-op so misclicks on the active card don't bounce
    // out of the dive. Every other panel selects this category — opening the
    // dive (grid mode) or rotating the wheel (wheel mode side).
    if (isPrime) return;
    select({ name: slot.name, category: slot.category });
  };

  const { Comp, name, category } = slot;
  return (
    <group ref={posRef} position={[gridX, gridY, 0]}>
      {showPanel ? (
        <mesh position={[0, 0, -0.4]} onClick={onPanelClick}>
          <planeGeometry args={[panelSize, panelSize]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      ) : null}
      <group ref={scaleRef} scale={GRID_SCALE}>
        <Comp name={name} category={category} onSelect={onSelect} />
      </group>
    </group>
  );
}
