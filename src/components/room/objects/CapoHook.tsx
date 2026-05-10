'use client';

import { Edges } from '@react-three/drei';
import {
  useInteractable,
  type InteractableProps,
} from '../useInteractable';

/** A peg on the wall with three capos hanging off it. */
export default function CapoHook(props: InteractableProps) {
  const { handlers, Label, edge: c, fill } = useInteractable(props, [0, 0.6, 0]);

  return (
    <group {...handlers}>
      {/* Peg sticking forward toward the camera */}
      <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 6]} />
        <meshBasicMaterial color={fill} />
        <Edges color={c} />
      </mesh>
      {/* Three capos hanging — torus segment + lever box */}
      {[-0.4, 0.0, 0.4].map((x, i) => (
        <group key={i} position={[x, -0.35, 0.15]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.14, 0.04, 6, 12, Math.PI * 1.4]} />
            <meshBasicMaterial color={fill} />
            <Edges color={c} />
          </mesh>
          <mesh position={[0, -0.18, 0.0]}>
            <boxGeometry args={[0.06, 0.18, 0.08]} />
            <meshBasicMaterial color={fill} />
            <Edges color={c} />
          </mesh>
        </group>
      ))}
      {Label}
    </group>
  );
}
