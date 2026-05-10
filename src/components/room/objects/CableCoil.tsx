'use client';

import { Edges } from '@react-three/drei';
import {
  useInteractable,
  type InteractableProps,
} from '../useInteractable';

/** A coiled cable on a hook with a plug end. */
export default function CableCoil(props: InteractableProps) {
  const { handlers, Label, edge: c, fill } = useInteractable(props, [0, 0.8, 0]);

  return (
    <group {...handlers}>
      {/* Wall hook */}
      <mesh position={[0, 0.45, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 6]} />
        <meshBasicMaterial color={fill} />
        <Edges color={c} />
      </mesh>
      {/* Coiled cable */}
      <mesh position={[0, 0, 0.15]}>
        <torusGeometry args={[0.45, 0.07, 6, 16]} />
        <meshBasicMaterial color={fill} />
        <Edges color={c} />
      </mesh>
      {/* Plug end */}
      <mesh position={[0.45, 0, 0.15]}>
        <cylinderGeometry args={[0.05, 0.05, 0.16, 6]} />
        <meshBasicMaterial color={fill} />
        <Edges color={c} />
      </mesh>
      {Label}
    </group>
  );
}
