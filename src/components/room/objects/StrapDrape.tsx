'use client';

import {
  useInteractable,
  hoverEmissive,
  hoverEmissiveIntensity,
  type InteractableProps,
} from '../useInteractable';

/** A curved plane "draped" over the guitar's neck. We approximate with two
 * angled tube segments meeting at a peak. */
export default function StrapDrape(props: InteractableProps) {
  const { hovered, handlers, Label } = useInteractable(props, [0, 1.2, 0]);
  const emissive = hoverEmissive(hovered);
  const intensity = hoverEmissiveIntensity(hovered);

  return (
    <group position={[1.5, 2.95, 0]} {...handlers}>
      {/* Drape down-front */}
      <mesh position={[-0.3, -0.4, 0.1]} rotation={[0, 0, -0.6]}>
        <boxGeometry args={[0.12, 1.4, 0.02]} />
        <meshStandardMaterial
          color="#2a4ea0"
          roughness={0.85}
          emissive={emissive}
          emissiveIntensity={intensity}
        />
      </mesh>
      {/* Drape over neck (peak) */}
      <mesh position={[0, 0.05, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.6, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#2a4ea0"
          roughness={0.85}
          emissive={emissive}
          emissiveIntensity={intensity}
        />
      </mesh>
      {/* Drape down-back */}
      <mesh position={[0.32, -0.4, -0.1]} rotation={[0, 0, 0.6]}>
        <boxGeometry args={[0.12, 1.4, 0.02]} />
        <meshStandardMaterial
          color="#2a4ea0"
          roughness={0.85}
          emissive={emissive}
          emissiveIntensity={intensity}
        />
      </mesh>
      {Label}
    </group>
  );
}
