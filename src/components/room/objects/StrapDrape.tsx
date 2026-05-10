'use client';

import { Edges } from '@react-three/drei';
import {
  useInteractable,
  type InteractableProps,
} from '../useInteractable';

/** A folded strap hanging on a hook — peak band with two falls. */
export default function StrapDrape(props: InteractableProps) {
  const { handlers, Label, edge: c, fill, bodyOpacity } = useInteractable(props, [0, 1.0, 0]);

  return (
    <group {...handlers}>
      {/* Hook at the top */}
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.2, 6]} />
        <meshBasicMaterial color={fill} transparent opacity={bodyOpacity} />
        <Edges color={c} />
      </mesh>
      {/* Peak band */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.6, 0.08, 0.08]} />
        <meshBasicMaterial color={fill} transparent opacity={bodyOpacity} />
        <Edges color={c} />
      </mesh>
      {/* Front fall */}
      <mesh position={[-0.22, -0.3, 0.05]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.12, 1.4, 0.02]} />
        <meshBasicMaterial color={fill} transparent opacity={bodyOpacity} />
        <Edges color={c} />
      </mesh>
      {/* Back fall */}
      <mesh position={[0.22, -0.3, -0.05]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.12, 1.4, 0.02]} />
        <meshBasicMaterial color={fill} transparent opacity={bodyOpacity} />
        <Edges color={c} />
      </mesh>
      {Label}
    </group>
  );
}
