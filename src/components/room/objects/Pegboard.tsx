'use client';

import {
  useInteractable,
  hoverEmissive,
  hoverEmissiveIntensity,
  type InteractableProps,
} from '../useInteractable';

/** Vertical plane on the back wall above the desk, with a few pegs. */
export default function Pegboard(props: InteractableProps) {
  const { hovered, handlers, Label } = useInteractable(props, [0, 1.1, 0]);
  const emissive = hoverEmissive(hovered);
  const intensity = hoverEmissiveIntensity(hovered);

  return (
    <group position={[-2.5, 3.6, -7.85]} {...handlers}>
      {/* Board (slightly proud of wall) */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2.6, 1.4]} />
        <meshStandardMaterial
          color="#c9a058"
          roughness={0.7}
          emissive={emissive}
          emissiveIntensity={intensity * 0.5}
        />
      </mesh>
      {/* Frame edges */}
      <mesh position={[0, 0.71, 0.01]}>
        <planeGeometry args={[2.6, 0.04]} />
        <meshStandardMaterial color="#3a2410" />
      </mesh>
      <mesh position={[0, -0.71, 0.01]}>
        <planeGeometry args={[2.6, 0.04]} />
        <meshStandardMaterial color="#3a2410" />
      </mesh>
      {/* Cylindrical pegs */}
      {[
        [-0.9, 0.2],
        [-0.3, 0.2],
        [0.3, 0.2],
        [0.9, 0.2],
        [-0.6, -0.3],
        [0.6, -0.3],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 12]} />
          <meshStandardMaterial color="#1a1208" />
        </mesh>
      ))}
      {Label}
    </group>
  );
}
