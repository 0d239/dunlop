'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { Edges } from '@react-three/drei';
import {
  useInteractable,
  type InteractableProps,
} from '../useInteractable';

/** Flat 5-pointed star extruded with crisp outline edges. */
export default function Star(props: InteractableProps) {
  const { handlers, Label, edge: c, fill, bodyOpacity } = useInteractable(
    props,
    [0, 1.4, 0],
  );

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const points = 5;
    const outer = 1.0;
    const inner = 0.42;
    // Point-up star. Shift y so the bounding box matches the previous
    // point-down build (apex sat at -outer, flat top at outer*sin(54°)).
    const yOffset = outer * (Math.sin((3 * Math.PI) / 10) - 1);
    for (let i = 0; i < points * 2; i++) {
      const angle = Math.PI / 2 + (i * Math.PI) / points;
      const r = i % 2 === 0 ? outer : inner;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r + yOffset;
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    }
    s.closePath();
    return s;
  }, []);

  return (
    <group {...handlers}>
      <mesh>
        <extrudeGeometry
          args={[shape, { depth: 0.18, bevelEnabled: false, curveSegments: 1 }]}
        />
        <meshBasicMaterial color={fill} transparent opacity={bodyOpacity} />
        <Edges color={c} threshold={1} />
      </mesh>
      {Label}
    </group>
  );
}
