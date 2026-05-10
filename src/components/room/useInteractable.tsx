'use client';

import { useState, useCallback, useMemo } from 'react';
import { Html } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import {
  useSelectionStore,
  type SelectionCategory,
} from '@/lib/state/useSelectionStore';
import { useThemeStore } from '@/lib/state/useThemeStore';

export type InteractableProps = {
  name: string;
  category: SelectionCategory;
  onSelect?: (name: string) => void;
};

export const EDGE_ACTIVE = '#EF0000';
const EDGE_DARK = '#ffffff';
const EDGE_LIGHT = '#0a0a0a';
const FILL_DARK = '#000000';
const FILL_LIGHT = '#ffffff';

/**
 * Shared hover/click hook for every interactable object.
 *
 * Returns event handlers, hover/active flags, the themed `edge` stroke color
 * (red on hover/active, otherwise theme-default), the themed `fill` color
 * for body meshes, and a <Label /> rendered on hover.
 */
export function useInteractable(
  { name, category, onSelect }: InteractableProps,
  labelOffset: [number, number, number] = [0, 1.4, 0],
) {
  const [hovered, setHovered] = useState(false);
  const select = useSelectionStore((s) => s.select);
  const setStoreHover = useSelectionStore((s) => s.setHovered);
  const active = useSelectionStore((s) => s.selected?.name === name);
  const theme = useThemeStore((s) => s.theme);

  const edgeBase = theme === 'dark' ? EDGE_DARK : EDGE_LIGHT;
  const edge = hovered || active ? EDGE_ACTIVE : edgeBase;
  const fill = theme === 'dark' ? FILL_DARK : FILL_LIGHT;
  const labelBg =
    theme === 'dark' ? 'rgba(0,0,0,0.78)' : 'rgba(255,255,255,0.85)';
  const labelFg = theme === 'dark' ? '#f5f1ea' : '#0a0a0a';

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
          background: labelBg,
          color: labelFg,
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

  return { hovered, active, handlers, Label, edge, fill };
}
