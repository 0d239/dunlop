'use client';

import { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSelectionStore } from '@/lib/state/useSelectionStore';

const REST_POS: [number, number, number] = [0, 13, 0];
const REST_SCALE = 1.0;
const EDITORIAL_SCALE = 1.4;

/**
 * Red neon-style Dunlop logo at the top of the scene.
 *
 * The white logo PNG is used as a CSS mask on a red div, then drop-shadows
 * fake the neon-glow halo. Click triggers editorial mode (camera dollies +
 * heritage panel slides in).
 */
export default function LogoSign() {
  const groupRef = useRef<THREE.Group>(null!);
  const editorial = useSelectionStore((s) => s.editorial);
  const dive = useSelectionStore((s) => s.selected);
  const openEditorial = useSelectionStore((s) => s.openEditorial);
  const closeEditorial = useSelectionStore((s) => s.closeEditorial);
  const toggle = () => (editorial ? closeEditorial() : openEditorial());

  // When a dive is open, the logo retreats slightly so it doesn't compete with
  // the focused product panel.
  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const targetScale = editorial
      ? EDITORIAL_SCALE
      : dive
        ? 0.8
        : REST_SCALE;
    const s = THREE.MathUtils.damp(g.scale.x, targetScale, 8, delta);
    g.scale.setScalar(s);
  });

  return (
    <group ref={groupRef} position={REST_POS}>
      <Html
        center
        zIndexRange={[10, 0]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <button
          type="button"
          onClick={toggle}
          aria-label="Dunlop heritage"
          className="pointer-events-auto block cursor-pointer border-0 bg-transparent p-0"
          style={{
            width: 320,
            height: 76,
            backgroundColor: '#EF0000',
            WebkitMaskImage: 'url(/dunlop-logo-white.png)',
            WebkitMaskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskImage: 'url(/dunlop-logo-white.png)',
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            filter:
              'drop-shadow(0 0 6px #EF0000) drop-shadow(0 0 18px rgba(239,0,0,0.7)) drop-shadow(0 0 36px rgba(239,0,0,0.45))',
            transition: 'filter 220ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter =
              'drop-shadow(0 0 8px #EF0000) drop-shadow(0 0 22px rgba(239,0,0,0.9)) drop-shadow(0 0 50px rgba(239,0,0,0.6))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter =
              'drop-shadow(0 0 6px #EF0000) drop-shadow(0 0 18px rgba(239,0,0,0.7)) drop-shadow(0 0 36px rgba(239,0,0,0.45))';
          }}
        />
      </Html>
    </group>
  );
}
