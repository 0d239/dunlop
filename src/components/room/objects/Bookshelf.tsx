'use client';

import { Edges } from '@react-three/drei';
import {
  useInteractable,
  type InteractableProps,
} from '../useInteractable';

/** Tall box with three horizontal shelves, each holding a row of records. */
export default function Bookshelf(props: InteractableProps) {
  const { handlers, Label, edge: c, fill } = useInteractable(props, [0, 4.2, 0]);

  const shelfYs = [0.9, 2.05, 3.2];

  return (
    <group {...handlers}>
      {/* Sides */}
      <mesh position={[-1.0, 1.95, 0]}>
        <boxGeometry args={[0.08, 3.9, 0.7]} />
        <meshBasicMaterial color={fill} />
        <Edges color={c} />
      </mesh>
      <mesh position={[1.0, 1.95, 0]}>
        <boxGeometry args={[0.08, 3.9, 0.7]} />
        <meshBasicMaterial color={fill} />
        <Edges color={c} />
      </mesh>
      {/* Top + bottom */}
      <mesh position={[0, 3.9, 0]}>
        <boxGeometry args={[2.08, 0.08, 0.7]} />
        <meshBasicMaterial color={fill} />
        <Edges color={c} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.08, 0.08, 0.7]} />
        <meshBasicMaterial color={fill} />
        <Edges color={c} />
      </mesh>
      {/* Shelves */}
      {shelfYs.map((y, i) => (
        <mesh key={`shelf-${i}`} position={[0, y, 0]}>
          <boxGeometry args={[1.92, 0.05, 0.6]} />
          <meshBasicMaterial color={fill} />
          <Edges color={c} />
        </mesh>
      ))}
      {/* Records on each shelf */}
      {shelfYs.map((shelfY, sIdx) =>
        Array.from({ length: 7 }).map((_, j) => {
          const x = -0.84 + j * 0.24;
          return (
            <mesh
              key={`r-${sIdx}-${j}`}
              position={[x, shelfY + 0.5, 0]}
              rotation={[0, 0, (j % 2) * 0.04]}
            >
              <boxGeometry args={[0.18, 0.95, 0.04]} />
              <meshBasicMaterial color={fill} />
              <Edges color={c} />
            </mesh>
          );
        }),
      )}
      {Label}
    </group>
  );
}
