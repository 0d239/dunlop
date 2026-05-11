'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { Edges } from '@react-three/drei';
import {
  useInteractable,
  type InteractableProps,
} from '../useInteractable';

/** Front-facing t-shirt silhouette: body with shoulders, sleeves, and V-neck. */
export default function Tshirt(props: InteractableProps) {
  const { handlers, Label, edge: c, fill, bodyOpacity } = useInteractable(
    props,
    [0, 0.85, 0],
  );

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.18, 0.55);
    s.lineTo(0, 0.32);
    s.lineTo(0.18, 0.55);
    s.lineTo(0.4, 0.55);
    s.lineTo(0.78, 0.45);
    s.lineTo(0.78, 0.15);
    s.lineTo(0.45, 0.22);
    s.lineTo(0.45, -0.6);
    s.lineTo(-0.45, -0.6);
    s.lineTo(-0.45, 0.22);
    s.lineTo(-0.78, 0.15);
    s.lineTo(-0.78, 0.45);
    s.lineTo(-0.4, 0.55);
    s.closePath();
    return s;
  }, []);

  return (
    <group {...handlers}>
      <mesh>
        <extrudeGeometry
          args={[shape, { depth: 0.08, bevelEnabled: false, curveSegments: 1 }]}
        />
        <meshBasicMaterial color={fill} transparent opacity={bodyOpacity} />
        <Edges color={c} threshold={1} />
      </mesh>
      {Label}
    </group>
  );
}
