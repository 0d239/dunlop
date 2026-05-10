'use client';

import { Edges } from '@react-three/drei';
import {
  useInteractable,
  type InteractableProps,
} from '../useInteractable';

/** Small wall shelf with three flat string-pack boxes stacked. */
export default function StringsShelf(props: InteractableProps) {
  const { handlers, Label, edge: c, fill } = useInteractable(props, [0, 0.7, 0]);

  return (
    <group {...handlers}>
      {/* Shelf plank */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 0.06, 0.4]} />
        <meshBasicMaterial color={fill} />
        <Edges color={c} />
      </mesh>
      {/* Brackets */}
      <mesh position={[-0.7, -0.15, -0.15]}>
        <boxGeometry args={[0.04, 0.25, 0.04]} />
        <meshBasicMaterial color={fill} />
        <Edges color={c} />
      </mesh>
      <mesh position={[0.7, -0.15, -0.15]}>
        <boxGeometry args={[0.04, 0.25, 0.04]} />
        <meshBasicMaterial color={fill} />
        <Edges color={c} />
      </mesh>
      {/* Three thin packages stacked */}
      {[0.07, 0.15, 0.23].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[1.2, 0.06, 0.3]} />
          <meshBasicMaterial color={fill} />
          <Edges color={c} />
        </mesh>
      ))}
      {Label}
    </group>
  );
}
