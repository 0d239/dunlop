'use client';

import { Edges } from '@react-three/drei';
import {
  useInteractable,
  type InteractableProps,
} from '../useInteractable';

/** Vertical board with a few pegs sticking out. */
export default function Pegboard(props: InteractableProps) {
  const { handlers, Label, edge: c, fill, bodyOpacity } = useInteractable(props, [0, 1.2, 0]);

  return (
    <group {...handlers}>
      {/* Board (thin box, presented as a face) */}
      <mesh>
        <boxGeometry args={[2.6, 1.4, 0.06]} />
        <meshBasicMaterial color={fill} transparent opacity={bodyOpacity} />
        <Edges color={c} />
      </mesh>
      {/* Pegs */}
      {[
        [-0.9, 0.2],
        [-0.3, 0.2],
        [0.3, 0.2],
        [0.9, 0.2],
        [-0.6, -0.3],
        [0.6, -0.3],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 6]} />
          <meshBasicMaterial color={fill} transparent opacity={bodyOpacity} />
          <Edges color={c} />
        </mesh>
      ))}
      {Label}
    </group>
  );
}
