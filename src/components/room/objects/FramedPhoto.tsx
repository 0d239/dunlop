'use client';

import { Edges } from '@react-three/drei';
import {
  useInteractable,
  type InteractableProps,
} from '../useInteractable';

/** Square frame with a record disc and center label inside. */
export default function FramedPhoto(props: InteractableProps) {
  const { handlers, Label, edge: c, fill, bodyOpacity } = useInteractable(props, [0, 1.0, 0]);

  return (
    <group {...handlers}>
      {/* Outer frame (thin box) */}
      <mesh>
        <boxGeometry args={[1.6, 1.6, 0.06]} />
        <meshBasicMaterial color={fill} transparent opacity={bodyOpacity} />
        <Edges color={c} />
      </mesh>
      {/* Inner mat */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[1.4, 1.4, 0.02]} />
        <meshBasicMaterial color={fill} transparent opacity={bodyOpacity} />
        <Edges color={c} />
      </mesh>
      {/* Record disc — axis along Z so it reads as a circle from the camera */}
      <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.01, 24]} />
        <meshBasicMaterial color={fill} transparent opacity={bodyOpacity} />
        <Edges color={c} />
      </mesh>
      {/* Center label */}
      <mesh position={[0, 0, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.005, 16]} />
        <meshBasicMaterial color={fill} transparent opacity={bodyOpacity} />
        <Edges color={c} />
      </mesh>
      {Label}
    </group>
  );
}
