'use client';

import { Edges } from '@react-three/drei';
import {
  useInteractable,
  type InteractableProps,
} from '../useInteractable';

/** Flat board on the floor with 5–6 pedals on top (one taller = wah). */
export default function Pedalboard(props: InteractableProps) {
  const { handlers, Label, edge: c, fill, bodyOpacity } = useInteractable(props, [0, 1.4, 0]);

  const pedals: Array<{
    pos: [number, number, number];
    size: [number, number, number];
    cyl?: boolean;
  }> = [
    { pos: [-0.9, 0.32, -0.2], size: [0.5, 0.2, 0.7] },
    { pos: [-0.3, 0.32, -0.2], size: [0.5, 0.2, 0.7] },
    { pos: [0.3, 0.32, -0.2], size: [0.5, 0.2, 0.7] },
    { pos: [0.9, 0.32, -0.2], size: [0.5, 0.2, 0.7] },
    { pos: [0, 0.5, 0.45], size: [0.6, 0.55, 0.95] },
    { pos: [-0.9, 0.32, 0.45], size: [0.32, 0.2, 0.32], cyl: true },
  ];

  return (
    <group {...handlers}>
      {/* Board */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[2.6, 0.18, 1.7]} />
        <meshBasicMaterial color={fill} transparent opacity={bodyOpacity} />
        <Edges color={c} />
      </mesh>
      {pedals.map((p, i) =>
        p.cyl ? (
          <mesh key={i} position={p.pos}>
            <cylinderGeometry args={[p.size[0] / 2, p.size[0] / 2, p.size[1], 8]} />
            <meshBasicMaterial color={fill} transparent opacity={bodyOpacity} />
            <Edges color={c} />
          </mesh>
        ) : (
          <mesh key={i} position={p.pos}>
            <boxGeometry args={p.size} />
            <meshBasicMaterial color={fill} transparent opacity={bodyOpacity} />
            <Edges color={c} />
          </mesh>
        ),
      )}
      {Label}
    </group>
  );
}
