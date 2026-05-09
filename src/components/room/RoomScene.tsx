'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

import Environment from './Environment';
import Furniture from './Furniture';
import Interactables from './Interactables';

export default function RoomScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color('#1a1410');
        scene.fog = new THREE.Fog('#1a1410', 18, 40);
      }}
    >
      <OrthographicCamera
        makeDefault
        position={[14, 12, 14]}
        zoom={45}
        near={-50}
        far={100}
      />
      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 2.6}
        minAzimuthAngle={-Math.PI / 1.6}
        maxAzimuthAngle={Math.PI / 1.6}
        minZoom={28}
        maxZoom={80}
        target={[0, 1.2, 0]}
      />

      <Suspense fallback={null}>
        <Environment />
        <Furniture />
        <Interactables />
      </Suspense>
    </Canvas>
  );
}
