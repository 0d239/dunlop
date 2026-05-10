'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { Edges } from '@react-three/drei';
import {
  useInteractable,
  type InteractableProps,
} from '../useInteractable';

/**
 * A single guitar pick — the classic Dunlop 351 silhouette.
 * Extruded a shallow depth so the camera reads it as a flat token from the front.
 */
export default function Pick(props: InteractableProps) {
  const { handlers, Label, edge: c, fill, bodyOpacity } = useInteractable(props, [0, 1.6, 0]);

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.95);
    s.bezierCurveTo(0.45, -0.78, 0.88, 0.0, 0.66, 0.55);
    s.bezierCurveTo(0.5, 0.88, -0.5, 0.88, -0.66, 0.55);
    s.bezierCurveTo(-0.88, 0.0, -0.45, -0.78, 0, -0.95);
    return s;
  }, []);

  const extrudeSettings = useMemo(
    () => ({ depth: 0.12, bevelEnabled: false, curveSegments: 24 }),
    [],
  );

  return (
    <group {...handlers}>
      <mesh position={[0, 1.0, 0]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshBasicMaterial color={fill} transparent opacity={bodyOpacity} />
        <Edges color={c} threshold={1} />
      </mesh>
      {Label}
    </group>
  );
}
