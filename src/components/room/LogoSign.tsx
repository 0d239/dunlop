'use client';

import { useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useSelectionStore } from '@/lib/state/useSelectionStore';
import { useThemeStore } from '@/lib/state/useThemeStore';

const REST_POS: [number, number, number] = [0, 13, 0];
const REST_SCALE = 1.0;
/** When a category dive is open the camera zoom factor is 1.18, so a 0.85
 *  scale (≈ 1/1.18) keeps the logo's pixel size approximately the same as at
 *  rest. Editorial leaves the camera untouched, so no editorial-specific
 *  override is needed — the logo doesn't need to compensate for anything. */
const DIVE_SCALE = 0.85;

/** Logo PNG aspect — 284 × 68 px from the BigCommerce theme bundle. */
const LOGO_WIDTH = 7.5;
const LOGO_ASPECT = 68 / 284;

/**
 * Dunlop logo at the top of the scene as a textured plane in world space.
 * The shipped PNG is white-on-transparent; we tint it via meshBasicMaterial
 * `color`, multiplying with the texture so it renders white in dark mode and
 * black in light mode without needing a second asset.
 */
export default function LogoSign() {
  const groupRef = useRef<THREE.Group>(null!);
  const editorial = useSelectionStore((s) => s.editorial);
  const dive = useSelectionStore((s) => s.selected);
  const openEditorial = useSelectionStore((s) => s.openEditorial);
  const closeEditorial = useSelectionStore((s) => s.closeEditorial);
  const theme = useThemeStore((s) => s.theme);

  const tex = useTexture('/dunlop-logo-white.png');
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 8;

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const targetScale = dive ? DIVE_SCALE : REST_SCALE;
    const s = THREE.MathUtils.damp(g.scale.x, targetScale, 6, delta);
    g.scale.setScalar(s);
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (editorial) closeEditorial();
    else openEditorial();
  };

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
  };

  const handleOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = '';
  };

  const tint = theme === 'dark' ? '#ffffff' : '#000000';

  return (
    <group ref={groupRef} position={REST_POS}>
      <mesh onClick={handleClick} onPointerOver={handleOver} onPointerOut={handleOut}>
        <planeGeometry args={[LOGO_WIDTH, LOGO_WIDTH * LOGO_ASPECT]} />
        <meshBasicMaterial map={tex} color={tint} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}
