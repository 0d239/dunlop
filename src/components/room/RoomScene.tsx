'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { Suspense, useLayoutEffect } from 'react';
import * as THREE from 'three';

import Environment from './Environment';
import Interactables from './Interactables';
import { useSelectionStore } from '@/lib/state/useSelectionStore';

/** Bounds of the 3×3 grid laid out by Interactables, in world units. */
const GRID_WIDTH = 13;
const GRID_HEIGHT = 13;
const GRID_CENTER_Y = 5.5;

export default function RoomScene() {
  const select = useSelectionStore((s) => s.select);
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color('#000000');
      }}
      onPointerMissed={() => select(null)}
    >
      <OrthographicCamera
        makeDefault
        position={[0, GRID_CENTER_Y, 12]}
        zoom={50}
        near={-50}
        far={100}
      />
      <FitOrthoCamera
        worldWidth={GRID_WIDTH}
        worldHeight={GRID_HEIGHT}
        padding={1.1}
      />

      <Suspense fallback={null}>
        <Environment />
        <Interactables />
      </Suspense>
    </Canvas>
  );
}

/**
 * Sizes the orthographic camera so a worldWidth × worldHeight rectangle fits
 * the canvas with a uniform padding factor. Re-runs on canvas resize.
 */
function FitOrthoCamera({
  worldWidth,
  worldHeight,
  padding = 1.1,
}: {
  worldWidth: number;
  worldHeight: number;
  padding?: number;
}) {
  const { size, camera } = useThree();
  useLayoutEffect(() => {
    const zoomX = size.width / (worldWidth * padding);
    const zoomY = size.height / (worldHeight * padding);
    const ortho = camera as THREE.OrthographicCamera;
    ortho.zoom = Math.min(zoomX, zoomY);
    ortho.updateProjectionMatrix();
  }, [size.width, size.height, camera, worldWidth, worldHeight, padding]);
  return null;
}
