'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';

import Environment from './Environment';
import Interactables from './Interactables';
import LogoSign from './LogoSign';
import HeritageBoard from '@/components/heritage/HeritageBoard';
import { useSelectionStore } from '@/lib/state/useSelectionStore';
import { useThemeStore } from '@/lib/state/useThemeStore';

const GRID_WIDTH = 13;
const GRID_HEIGHT = 16;
const GRID_CENTER_Y = 6.5;
const EDITORIAL_CENTER_Y = 10.5;
const EDITORIAL_ZOOM_FACTOR = 1.25;
const DIVE_ZOOM_FACTOR = 1.18;
const DIVE_CENTER_Y = 4.5;

export default function RoomScene() {
  const select = useSelectionStore((s) => s.select);
  const closeEditorial = useSelectionStore((s) => s.closeEditorial);
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true }}
      onPointerMissed={() => {
        select(null);
        closeEditorial();
      }}
    >
      <OrthographicCamera
        makeDefault
        position={[0, GRID_CENTER_Y, 12]}
        zoom={50}
        near={-50}
        far={100}
      />
      <CameraDriver
        worldWidth={GRID_WIDTH}
        worldHeight={GRID_HEIGHT}
        restCenterY={GRID_CENTER_Y}
        editorialCenterY={EDITORIAL_CENTER_Y}
        diveCenterY={DIVE_CENTER_Y}
      />
      <ThemedSceneBackground />

      <Suspense fallback={null}>
        <Environment />
        <Interactables />
        <LogoSign />
        <HeritageBoard />
      </Suspense>
    </Canvas>
  );
}

/**
 * Drives the orthographic camera:
 *   - Computes a fit zoom whenever the canvas resizes.
 *   - Lerps zoom and camera Y to "dolly" toward the logo when editorial mode
 *     is open, then back to the grid center when closed.
 */
function CameraDriver({
  worldWidth,
  worldHeight,
  restCenterY,
  editorialCenterY,
  diveCenterY,
  padding = 1.1,
}: {
  worldWidth: number;
  worldHeight: number;
  restCenterY: number;
  editorialCenterY: number;
  diveCenterY: number;
  padding?: number;
}) {
  const { size, camera } = useThree();
  const fitZoomRef = useRef(50);
  const editorial = useSelectionStore((s) => s.editorial);
  const dive = useSelectionStore((s) => s.selected);

  useLayoutEffect(() => {
    const zoomX = size.width / (worldWidth * padding);
    const zoomY = size.height / (worldHeight * padding);
    fitZoomRef.current = Math.min(zoomX, zoomY);
  }, [size.width, size.height, worldWidth, worldHeight, padding]);

  useFrame((_, delta) => {
    const ortho = camera as THREE.OrthographicCamera;
    const targetZoom = editorial
      ? fitZoomRef.current * EDITORIAL_ZOOM_FACTOR
      : dive
        ? fitZoomRef.current * DIVE_ZOOM_FACTOR
        : fitZoomRef.current;
    const targetY = editorial
      ? editorialCenterY
      : dive
        ? diveCenterY
        : restCenterY;

    ortho.zoom = THREE.MathUtils.damp(ortho.zoom, targetZoom, 6, delta);
    ortho.position.y = THREE.MathUtils.damp(
      ortho.position.y,
      targetY,
      6,
      delta,
    );
    ortho.updateProjectionMatrix();
  });

  return null;
}

/** Drives scene.background from the theme store so light/dark flips swap it. */
function ThemedSceneBackground() {
  const { scene } = useThree();
  const theme = useThemeStore((s) => s.theme);
  useEffect(() => {
    scene.background = new THREE.Color(theme === 'dark' ? '#000000' : '#ffffff');
  }, [scene, theme]);
  return null;
}
