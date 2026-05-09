'use client';

import { Edges } from '@react-three/drei';
import {
  useInteractable,
  edgeColor,
  type InteractableProps,
} from '../useInteractable';

/** Short wide cylinder with a narrower lip and a couple of picks suggested inside. */
export default function PickJar(props: InteractableProps) {
  const { hovered, active, handlers, Label } = useInteractable(props, [0, 1.0, 0]);
  const c = edgeColor(hovered, active);

  return (
    <group {...handlers}>
      {/* Body */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.35, 0.32, 0.6, 12]} />
        <meshBasicMaterial color="#000" />
        <Edges color={c} />
      </mesh>
      {/* Narrow lip */}
      <mesh position={[0, 0.66, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.08, 12]} />
        <meshBasicMaterial color="#000" />
        <Edges color={c} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 12]} />
        <meshBasicMaterial color="#000" />
        <Edges color={c} />
      </mesh>
      {/* Two pick disks suggested inside */}
      <mesh position={[0.05, 0.45, 0]} rotation={[0.4, 0.2, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.01, 8]} />
        <meshBasicMaterial color="#000" />
        <Edges color={c} />
      </mesh>
      <mesh position={[-0.08, 0.4, 0.05]} rotation={[-0.3, 0.5, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.01, 8]} />
        <meshBasicMaterial color="#000" />
        <Edges color={c} />
      </mesh>
      {Label}
    </group>
  );
}
