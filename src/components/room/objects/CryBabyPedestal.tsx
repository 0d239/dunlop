'use client';

import {
  useInteractable,
  hoverEmissive,
  hoverEmissiveIntensity,
  type InteractableProps,
} from '../useInteractable';

/** Small column with a vintage Cry Baby on top — separate from the pedalboard. */
export default function CryBabyPedestal(props: InteractableProps) {
  const { hovered, handlers, Label } = useInteractable(props, [0, 2.5, 0]);
  const emissive = hoverEmissive(hovered);
  const intensity = hoverEmissiveIntensity(hovered);

  return (
    <group position={[5.5, 0, -3.5]} {...handlers}>
      {/* Base */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <boxGeometry args={[1.0, 0.12, 1.0]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
      {/* Column */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[0.7, 1.5, 0.7]} />
        <meshStandardMaterial
          color="#2a1a10"
          roughness={0.85}
          emissive={emissive}
          emissiveIntensity={intensity * 0.4}
        />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, 1.65, 0]} castShadow>
        <boxGeometry args={[0.85, 0.08, 0.85]} />
        <meshStandardMaterial color="#3a2410" />
      </mesh>
      {/* Cry Baby pedal (slanted black wedge) */}
      <group position={[0, 1.95, 0]} rotation={[0, 0, 0.18]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.5, 0.85]} />
          <meshStandardMaterial
            color="#0a0a0a"
            roughness={0.4}
            metalness={0.3}
            emissive={emissive}
            emissiveIntensity={intensity}
          />
        </mesh>
        {/* Treadle plate (a tilted top face) */}
        <mesh position={[0, 0.27, 0]} rotation={[-0.25, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.04, 0.85]} />
          <meshStandardMaterial color="#1f1f1f" metalness={0.4} roughness={0.3} />
        </mesh>
      </group>
      {Label}
    </group>
  );
}
