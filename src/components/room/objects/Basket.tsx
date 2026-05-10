'use client';

import { Edges } from '@react-three/drei';
import {
  useInteractable,
  type InteractableProps,
} from '../useInteractable';

/** Tapered cylinder with a rim and three weave bands — the cart. */
export default function Basket(props: InteractableProps) {
  const { handlers, Label, edge: c, fill, bodyOpacity } = useInteractable(props, [0, 1.1, 0]);

  return (
    <group {...handlers}>
      {/* Body */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.6, 0.5, 0.8, 12]} />
        <meshBasicMaterial color={fill} transparent opacity={bodyOpacity} />
        <Edges color={c} />
      </mesh>
      {/* Rim lip */}
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.06, 12]} />
        <meshBasicMaterial color={fill} transparent opacity={bodyOpacity} />
        <Edges color={c} />
      </mesh>
      {/* Weave bands */}
      {[0.18, 0.42, 0.66].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55 + i * 0.02, 0.015, 4, 12]} />
          <meshBasicMaterial color={fill} transparent opacity={bodyOpacity} />
          <Edges color={c} />
        </mesh>
      ))}
      {Label}
    </group>
  );
}
