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
import Star from './objects/Star';
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
  { Comp: Star,         col: 2, row: 0, name: 'Artists',     category: 'artists' },
];

const CELL = 4.5;
const GRID_SCALE = 0.55;
const DIVE_SCALE = 1.0;
const DIVE_TARGET: [number, number, number] = [-6, 4.5, 1];
const LAMBDA = 6;

/**
 * Wheel layout when a category is open. Cells orbit a horizontal axle
 * through the wheel center; the orbit plane is then tilted around the
 * vertical Y-axis so the front of the orbit lands toward the LEFT of the
 * scene and the back recedes toward the RIGHT. Active (theta=0) sits at
 * the front of the orbit and is back-solved to land exactly at
 * DIVE_TARGET regardless of tilt.
 */
const WHEEL_RADIUS = 6.5;
const WHEEL_VISIBLE_OFFSET = 2;
const WHEEL_TILT_Y = (Math.PI / 180) * 32;
// Scale by |offset|. Active is large; ±1 reads clearly; ±2 is weak.
const WHEEL_SCALE_FALLOFF = [1.5, 0.7, 0.22];

const GRID_PANEL_SIZE = 3.6;
const PRIME_PANEL_SIZE = 4.4;
const SIDE_PANEL_SIZE = 2.4;
const FAR_PANEL_SIZE = 1.0;

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
  const gridFocus = useSelectionStore((s) => s.gridFocus);
  const isAnyDive = dive !== null;
  const myIndex = GRID.findIndex((s) => s.category === slot.category);
  const isFocused = !isAnyDive && !editorial && gridFocus === myIndex;

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

  const absOffset = offset !== null ? Math.abs(offset) : null;
  const isPrime = offset === 0;
  const isVisibleWheel =
    absOffset !== null && absOffset <= WHEEL_VISIBLE_OFFSET;

  // Hit panel is rendered when:
  //   - grid mode (no dive): every cell, full grid panel size
  //   - wheel mode: any cell within WHEEL_VISIBLE_OFFSET, sized by depth
  //   - editorial: never
  const showPanel = !editorial && (!isAnyDive || isVisibleWheel);
  const panelSize = isAnyDive
    ? absOffset === 0
      ? PRIME_PANEL_SIZE
      : absOffset === 1
        ? SIDE_PANEL_SIZE
        : FAR_PANEL_SIZE
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
      const ao = Math.abs(offset);
      const angle = offset * ((2 * Math.PI) / GRID.length);
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const cosB = Math.cos(WHEEL_TILT_Y);
      const sinB = Math.sin(WHEEL_TILT_Y);

      // Orbit in YZ plane (X-axis axle), then rotated around the vertical
      // Y-axis through the wheel center so the front of the orbit lands
      // toward -X (left, close) and the back toward +X (right, far). Center
      // is back-solved so theta=0 stays exactly at DIVE_TARGET.
      tx = DIVE_TARGET[0] + sinB * WHEEL_RADIUS * (1 - cosA);
      ty = DIVE_TARGET[1] + WHEEL_RADIUS * sinA;
      tz = DIVE_TARGET[2] + cosB * WHEEL_RADIUS * (cosA - 1);

      ts =
        ao <= WHEEL_VISIBLE_OFFSET ? (WHEEL_SCALE_FALLOFF[ao] ?? 0) : 0;
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
        <Comp
          name={name}
          category={category}
          onSelect={onSelect}
          focused={isFocused}
        />
      </group>
    </group>
  );
}
