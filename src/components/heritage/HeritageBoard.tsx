'use client';

import { useEffect, useRef } from 'react';
import { Text, Edges } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useSelectionStore } from '@/lib/state/useSelectionStore';

/** Where the board lives when hidden (above the visible frame). */
const REST_Y = 20;
/** Where the board lands when editorial is open. */
const ACTIVE_Y = 8.5;
const WIDTH = 11;
const HEIGHT = 5.5;

/**
 * 3D heritage board. Slides down from above the logo when the user clicks the
 * Dunlop neon sign, holding a short blurb + hero story. Clicking anywhere
 * (including the board itself) or pressing ESC returns to the grid.
 */
export default function HeritageBoard() {
  const groupRef = useRef<THREE.Group>(null!);
  const editorial = useSelectionStore((s) => s.editorial);
  const close = useSelectionStore((s) => s.closeEditorial);

  useEffect(() => {
    if (!editorial) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editorial, close]);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const targetY = editorial ? ACTIVE_Y : REST_Y;
    const targetScale = editorial ? 1 : 0.6;
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 6, delta);
    const s = THREE.MathUtils.damp(g.scale.x, targetScale, 6, delta);
    g.scale.setScalar(s);
    g.visible = g.position.y < REST_Y - 0.3;
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    close();
  };

  return (
    <group ref={groupRef} position={[0, REST_Y, 0]} scale={0.6}>
      {/* Backing plane with red wireframe edges */}
      <mesh onClick={handleClick}>
        <planeGeometry args={[WIDTH, HEIGHT]} />
        <meshBasicMaterial color="#000" transparent opacity={0.92} />
        <Edges color="#EF0000" />
      </mesh>

      {/* Title */}
      <Text
        position={[0, HEIGHT / 2 - 0.6, 0.01]}
        fontSize={0.42}
        color="#EF0000"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
      >
        DUNLOP. SINCE 1965.
      </Text>
      {/* Title underline */}
      <mesh position={[0, HEIGHT / 2 - 0.95, 0.01]}>
        <planeGeometry args={[1.6, 0.025]} />
        <meshBasicMaterial color="#EF0000" />
      </mesh>

      {/* Left column — short blurb */}
      <Text
        position={[-WIDTH / 4, 0.4, 0.01]}
        fontSize={0.2}
        color="#dcd6c8"
        anchorX="center"
        anchorY="middle"
        maxWidth={WIDTH / 2 - 0.8}
        textAlign="left"
        lineHeight={1.5}
      >
        Founded 1965 in Benicia, California. Family-owned. Cry Baby, Tortex,
        Univibe, Echoplex — names that started here, on machines still running.
      </Text>

      {/* Right column — hero story */}
      <Text
        position={[WIDTH / 4, 0.4, 0.01]}
        fontSize={0.2}
        color="#dcd6c8"
        anchorX="center"
        anchorY="middle"
        maxWidth={WIDTH / 2 - 0.8}
        textAlign="left"
        lineHeight={1.5}
      >
        Hendrix wired a Cry Baby into the back of the Strat in &apos;67 and
        the wah pedal stopped being a gimmick. Sixty years on, every one still
        ships from Benicia.
      </Text>

      {/* Tagline */}
      <Text
        position={[0, -HEIGHT / 2 + 1.0, 0.01]}
        fontSize={0.26}
        color="#f5f1ea"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
      >
        PERFORMANCE IS EVERYTHING.
      </Text>

      {/* Close hint */}
      <Text
        position={[0, -HEIGHT / 2 + 0.42, 0.01]}
        fontSize={0.11}
        color="#666"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.25}
      >
        CLICK ANYWHERE OR PRESS ESC TO RETURN
      </Text>
    </group>
  );
}
