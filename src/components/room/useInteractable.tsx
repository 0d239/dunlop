'use client';

import { useState, useCallback, useMemo } from 'react';
import { Html } from '@react-three/drei';
import {
  useSelectionStore,
  type SelectionCategory,
} from '@/lib/state/useSelectionStore';

export type InteractableProps = {
  name: string;
  category: SelectionCategory;
  onSelect?: (name: string) => void;
};

/**
 * Shared hover/click hook for every interactable object.
 *
 * Returns event handlers to spread onto a <group>, plus a `hovered` flag
 * the consumer can use to drive emissive/outline state on its meshes.
 *
 * Also returns a <Label /> element the consumer should render so the
 * floating tooltip appears above the object on hover.
 */
export function useInteractable(
  { name, category, onSelect }: InteractableProps,
  labelOffset: [number, number, number] = [0, 1.4, 0],
) {
  const [hovered, setHovered] = useState(false);
  const select = useSelectionStore((s) => s.select);
  const setStoreHover = useSelectionStore((s) => s.setHovered);

  const onPointerOver = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setHovered(true);
      setStoreHover(name);
      document.body.style.cursor = 'pointer';
    },
    [name, setStoreHover],
  );

  const onPointerOut = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setHovered(false);
      setStoreHover(null);
      document.body.style.cursor = 'auto';
    },
    [setStoreHover],
  );

  const onClick = useCallback(
    (e: { stopPropagation: () => void }) => {
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
      distanceFactor={8}
      style={{ pointerEvents: 'none' }}
    >
      <div
        style={{
          background: 'rgba(0,0,0,0.78)',
          color: '#f5f1ea',
          padding: '4px 10px',
          borderRadius: 4,
          fontSize: 11,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          border: '1px solid rgba(239,0,0,0.5)',
        }}
      >
        {name}
      </div>
    </Html>
  ) : null;

  return { hovered, handlers, Label };
}

/** Helper: pick an emissive color based on hover state. */
export function hoverEmissive(hovered: boolean, base = '#000000') {
  return hovered ? '#EF0000' : base;
}

export function hoverEmissiveIntensity(hovered: boolean) {
  return hovered ? 0.55 : 0;
}
