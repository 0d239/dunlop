'use client';

import { Edges } from '@react-three/drei';
import {
  useInteractable,
  edgeColor,
  type InteractableProps,
} from '../useInteractable';

/** Folded t-shirt suggestion: a flat folded body with a small drape. */
export default function Tshirt(props: InteractableProps) {
  const { hovered, active, handlers, Label } = useInteractable(props, [0, 0.6, 0]);
  const c = edgeColor(hovered, active);

  return (
    <group {...handlers}>
      <mesh>
        <boxGeometry args={[1.05, 0.18, 0.38]} />
        <meshBasicMaterial color="#000" />
        <Edges color={c} />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[1.05, 0.4, 0.04]} />
        <meshBasicMaterial color="#000" />
        <Edges color={c} />
      </mesh>
      {Label}
    </group>
  );
}
