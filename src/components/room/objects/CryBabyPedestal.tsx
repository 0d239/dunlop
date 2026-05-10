'use client';

import { Edges } from '@react-three/drei';
import {
  useInteractable,
  type InteractableProps,
} from '../useInteractable';

/** Small column with a vintage Cry Baby on top. */
export default function CryBabyPedestal(props: InteractableProps) {
  const { handlers, Label, edge: c, fill } = useInteractable(props, [0, 2.7, 0]);

  return (
    <group {...handlers}>
      {/* Base */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[1.0, 0.12, 1.0]} />
        <meshBasicMaterial color={fill} />
        <Edges color={c} />
      </mesh>
      {/* Column */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.7, 1.5, 0.7]} />
        <meshBasicMaterial color={fill} />
        <Edges color={c} />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, 1.65, 0]}>
        <boxGeometry args={[0.85, 0.08, 0.85]} />
        <meshBasicMaterial color={fill} />
        <Edges color={c} />
      </mesh>
      {/* Cry Baby pedal */}
      <group position={[0, 1.95, 0]} rotation={[0, 0, 0.18]}>
        <mesh>
          <boxGeometry args={[0.55, 0.5, 0.85]} />
          <meshBasicMaterial color={fill} />
          <Edges color={c} />
        </mesh>
        {/* Treadle plate */}
        <mesh position={[0, 0.27, 0]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[0.5, 0.04, 0.85]} />
          <meshBasicMaterial color={fill} />
          <Edges color={c} />
        </mesh>
      </group>
      {Label}
    </group>
  );
}
