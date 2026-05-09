'use client';

import { Edges } from '@react-three/drei';
import {
  useInteractable,
  edgeColor,
  type InteractableProps,
} from '../useInteractable';

/** Centerpiece: long thin body on a Y-shaped stand. */
export default function Guitar(props: InteractableProps) {
  const { hovered, active, handlers, Label } = useInteractable(props, [0, 4.4, 0]);
  const c = edgeColor(hovered, active);

  return (
    <group {...handlers}>
      {/* Tripod base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.08, 8]} />
        <meshBasicMaterial color="#000" />
        <Edges color={c} />
      </mesh>
      {/* Stand pole */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.7, 6]} />
        <meshBasicMaterial color="#000" />
        <Edges color={c} />
      </mesh>
      {/* Y arms */}
      <mesh position={[-0.18, 1.7, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} />
        <meshBasicMaterial color="#000" />
        <Edges color={c} />
      </mesh>
      <mesh position={[0.18, 1.7, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} />
        <meshBasicMaterial color="#000" />
        <Edges color={c} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1.95, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.18, 12]} />
        <meshBasicMaterial color="#000" />
        <Edges color={c} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[0.12, 2.1, 0.08]} />
        <meshBasicMaterial color="#000" />
        <Edges color={c} />
      </mesh>
      {/* Headstock */}
      <mesh position={[0, 4.25, 0]}>
        <boxGeometry args={[0.28, 0.4, 0.06]} />
        <meshBasicMaterial color="#000" />
        <Edges color={c} />
      </mesh>
      {/* Sound hole — render as a thin ring */}
      <mesh position={[0, 1.95, 0.092]}>
        <torusGeometry args={[0.13, 0.005, 4, 16]} />
        <meshBasicMaterial color={c} />
      </mesh>

      {Label}
    </group>
  );
}
