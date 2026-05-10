'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Text, Edges } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useSelectionStore } from '@/lib/state/useSelectionStore';
import { useThemeStore } from '@/lib/state/useThemeStore';

const REST_Y = 20;
const ACTIVE_Y = 8.5;
const WIDTH = 11;
const HEIGHT = 5.5;

function useHeritagePalette() {
  const theme = useThemeStore((s) => s.theme);
  if (theme === 'dark') {
    return {
      edge: '#f5f1ea',
      text: '#f5f1ea',
      body: '#dcd6c8',
      hint: '#5a5a5a',
      backing: '#000000',
      backingOpacity: 0.92,
    };
  }
  return {
    edge: '#0a0a0a',
    text: '#0a0a0a',
    body: '#3a3a3a',
    hint: '#9a9a9a',
    backing: '#ffffff',
    backingOpacity: 0,
  };
}

// Entry tilt: damped cosine on rotation.x.
// Tipped forward ~16°, single ~5° overshoot past flat, settles by ~1s.
const ENTRY_TILT = -0.28;
const ENTRY_DECAY = 3.0;
const ENTRY_OMEGA = 7.5;

/**
 * 3D heritage board. Slides down from above when the user clicks the logo,
 * with a short blurb on the left and wireframe accessories on the right.
 * Click anywhere or press ESC to return.
 */
export default function HeritageBoard() {
  const groupRef = useRef<THREE.Group>(null!);
  const enteredAt = useRef<number | null>(null);
  const prevEditorial = useRef(false);
  const editorial = useSelectionStore((s) => s.editorial);
  const close = useSelectionStore((s) => s.closeEditorial);
  const palette = useHeritagePalette();

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

    if (editorial && !prevEditorial.current) {
      enteredAt.current = performance.now();
    } else if (!editorial && prevEditorial.current) {
      enteredAt.current = null;
    }
    prevEditorial.current = editorial;

    const targetY = editorial ? ACTIVE_Y : REST_Y;
    const targetScale = editorial ? 1 : 0.6;
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 6, delta);
    const s = THREE.MathUtils.damp(g.scale.x, targetScale, 6, delta);
    g.scale.setScalar(s);

    if (editorial && enteredAt.current !== null) {
      const t = (performance.now() - enteredAt.current) / 1000;
      g.rotation.x =
        ENTRY_TILT * Math.exp(-ENTRY_DECAY * t) * Math.cos(ENTRY_OMEGA * t);
    } else {
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0, 6, delta);
    }

    g.visible = g.position.y < REST_Y - 0.3;
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    close();
  };

  return (
    <group ref={groupRef} position={[0, REST_Y, 0]} scale={0.6}>
      {/* Backing plane — filled in dark, transparent (wireframe-only) in light */}
      <mesh onClick={handleClick}>
        <planeGeometry args={[WIDTH, HEIGHT]} />
        <meshBasicMaterial
          color={palette.backing}
          transparent
          opacity={palette.backingOpacity}
        />
        <Edges color={palette.edge} />
      </mesh>

      {/* Title */}
      <Text
        position={[-WIDTH / 4, HEIGHT / 2 - 0.6, 0.01]}
        fontSize={0.4}
        color={palette.text}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
      >
        DUNLOP. SINCE 1965.
      </Text>
      {/* Title underline */}
      <mesh position={[-WIDTH / 4, HEIGHT / 2 - 0.95, 0.01]}>
        <planeGeometry args={[1.6, 0.02]} />
        <meshBasicMaterial color={palette.edge} />
      </mesh>

      {/* Body — left column */}
      <Text
        position={[-WIDTH / 4, 0.6, 0.01]}
        fontSize={0.2}
        color={palette.body}
        anchorX="center"
        anchorY="middle"
        maxWidth={WIDTH / 2 - 0.8}
        textAlign="left"
        lineHeight={1.5}
      >
        Founded 1965 in Benicia, California. Family-owned. Cry Baby, Tortex,
        Univibe, Echoplex — names that started here, on machines still running.
      </Text>

      {/* Hero story — left column lower */}
      <Text
        position={[-WIDTH / 4, -1.0, 0.01]}
        fontSize={0.18}
        color={palette.body}
        anchorX="center"
        anchorY="middle"
        maxWidth={WIDTH / 2 - 0.8}
        textAlign="left"
        lineHeight={1.5}
      >
        Hendrix wired a Cry Baby into the back of the Strat in &apos;67 and
        the wah pedal stopped being a gimmick.
      </Text>

      {/* Wireframe decorations — right side */}
      <HeritageDecorations edgeColor={palette.edge} />

      {/* Tagline */}
      <Text
        position={[0, -HEIGHT / 2 + 0.95, 0.01]}
        fontSize={0.24}
        color={palette.text}
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
        color={palette.hint}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.25}
      >
        CLICK ANYWHERE OR PRESS ESC TO RETURN
      </Text>
    </group>
  );
}

/** A single Dunlop 351 pick that spins around its Y axis. */
function HeritageDecorations({ edgeColor }: { edgeColor: string }) {
  const pickRef = useRef<THREE.Group>(null!);

  const edgesGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.95);
    shape.bezierCurveTo(0.45, -0.78, 0.88, 0.0, 0.66, 0.55);
    shape.bezierCurveTo(0.5, 0.88, -0.5, 0.88, -0.66, 0.55);
    shape.bezierCurveTo(-0.88, 0.0, -0.45, -0.78, 0, -0.95);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.05,
      bevelEnabled: false,
      curveSegments: 24,
    });
    return new THREE.EdgesGeometry(geo, 1);
  }, []);

  useFrame((_, delta) => {
    if (pickRef.current) {
      pickRef.current.rotation.y += delta * 1.0;
    }
  });

  return (
    <group ref={pickRef} position={[3.0, 0, 0.05]} scale={1.15}>
      <lineSegments geometry={edgesGeo} raycast={() => null}>
        <lineBasicMaterial color={edgeColor} transparent opacity={0.85} />
      </lineSegments>
    </group>
  );
}
