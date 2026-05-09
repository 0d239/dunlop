'use client';

import { useState, useCallback, useMemo } from 'react';
import { Html } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import {
  useSelectionStore,
  type SelectionCategory,
} from '@/lib/state/useSelectionStore';

export type InteractableProps = {
  name: string;
  category: SelectionCategory;
  onSelect?: (name: string) => void;
};

export const EDGE_DEFAULT = '#ffffff';
export const EDGE_ACTIVE = '#EF0000';

/**
 * Shared hover/click hook for every interactable object.
 *
 * Returns event handlers, a `hovered` flag, an `active` flag (true when this
 * object is the current selection), and a <Label /> element to render on
 * hover.
 */
export function useInteractable(
  { name, category, onSelect }: InteractableProps,
  labelOffset: [number, number, number] = [0, 1.4, 0],
) {
  const [hovered, setHovered] = useState(false);
  const select = useSelectionStore((s) => s.select);
  const setStoreHover = useSelectionStore((s) => s.setHovered);
  const active = useSelectionStore((s) => s.selected?.name === name);

  const onPointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(true);
      setStoreHover(name);
      document.body.style.cursor = 'pointer';
    },
    [name, setStoreHover],
  );

  const onPointerOut = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(false);
      setStoreHover(null);
      document.body.style.cursor = '';
    },
    [setStoreHover],
  );

  const onClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      select({ name, category });
      onSelect?.(name);
    },
    [name, category, select, onSelect],
  );

  const handlers = useMemo(
    () => ({ onPointerOver, onPointerOut, onClick }),
    [onPointerOver, onPointerOut, onClick],
  );

  const Label = hovered ? (
    <Html
      position={labelOffset}
      center
      zIndexRange={[100, 0]}
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      <div
        style={{
          background: 'rgba(0,0,0,0.78)',
          color: '#f5f1ea',
          padding: '3px 8px',
          borderRadius: 3,
          fontSize: 10,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          border: `1px solid ${EDGE_ACTIVE}`,
          transform: 'translateY(-4px)',
        }}
      >
        {name}
      </div>
    </Html>
  ) : null;

  return { hovered, active, handlers, Label };
}

/** Pick the edge color for an object based on hover/selection state. */
export function edgeColor(hovered: boolean, active: boolean) {
  return hovered || active ? EDGE_ACTIVE : EDGE_DEFAULT;
}
