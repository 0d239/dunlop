'use client';

import {
  useInteractable,
  hoverEmissive,
  hoverEmissiveIntensity,
  type InteractableProps,
} from '../useInteractable';

/** A torus on a wall hook. */
export default function CableCoil(props: InteractableProps) {
  const { hovered, handlers, Label } = useInteractable(props, [0, 0.7, 0]);
  const emissive = hoverEmissive(hovered);
  const intensity = hoverEmissiveIntensity(hovered);

  return (
    <group position={[-7.85, 4.4, -2.5]} rotation={[0, Math.PI / 2, 0]} {...handlers}>
      {/* Wall hook */}
      <mesh position={[0, 0.05, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 12]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
      {/* Coiled cable */}
      <mesh position={[0, -0.3, 0.18]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.45, 0.07, 12, 28]} />
        <meshStandardMaterial
          color="#101010"
          roughness={0.9}
          emissive={emissive}
          emissiveIntensity={intensity}
        />
      </mesh>
      {/* Plug end */}
      <mesh position={[0.45, -0.3, 0.18]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.16, 8]} />
        <meshStandardMaterial color="#c2a060" metalness={0.7} roughness={0.3} />
      </mesh>
      {Label}
    </group>
  );
}
