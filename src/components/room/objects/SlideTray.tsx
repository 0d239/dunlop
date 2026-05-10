'use client';

import { Edges } from '@react-three/drei';
import {
  useInteractable,
  type InteractableProps,
} from '../useInteractable';

/** Shallow box with three or four glass/metal slide cylinders. */
export default function SlideTray(props: InteractableProps) {
  const { handlers, Label, edge: c, fill } = useInteractable(props, [0, 0.6, 0]);

  return (
    <group {...handlers}>
      {/* Tray base */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.95, 0.08, 0.45]} />
        <meshBasicMaterial color={fill} />
        <Edges color={c} />
      </mesh>
      {/* Tray rims */}
      <mesh position={[0, 0.1, 0.215]}>
        <boxGeometry args={[0.95, 0.06, 0.02]} />
        <meshBasicMaterial color={fill} />
        <Edges color={c} />
      </mesh>
      <mesh position={[0, 0.1, -0.215]}>
        <boxGeometry args={[0.95, 0.06, 0.02]} />
        <meshBasicMaterial color={fill} />
        <Edges color={c} />
      </mesh>
      <mesh position={[0.475, 0.1, 0]}>
        <boxGeometry args={[0.02, 0.06, 0.45]} />
        <meshBasicMaterial color={fill} />
        <Edges color={c} />
      </mesh>
      <mesh position={[-0.475, 0.1, 0]}>
        <boxGeometry args={[0.02, 0.06, 0.45]} />
        <meshBasicMaterial color={fill} />
        <Edges color={c} />
      </mesh>
      {/* Slides — small horizontal cylinders */}
      {[-0.32, -0.08, 0.18, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 0.14, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.32, 8]} />
          <meshBasicMaterial color={fill} />
          <Edges color={c} />
        </mesh>
      ))}
      {Label}
    </group>
  );
}
