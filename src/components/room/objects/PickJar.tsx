'use client';

import {
  useInteractable,
  hoverEmissive,
  hoverEmissiveIntensity,
  type InteractableProps,
} from '../useInteractable';

/** Short wide cylinder on the desk with a narrower lip. */
export default function PickJar(props: InteractableProps) {
  const { hovered, handlers, Label } = useInteractable(props, [0, 0.9, 0]);
  const emissive = hoverEmissive(hovered);
  const intensity = hoverEmissiveIntensity(hovered);

  return (
    <group position={[-3.6, 1.66, -6.4]} {...handlers}>
      {/* Body */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.32, 0.6, 24]} />
        <meshStandardMaterial
          color="#d4b878"
          roughness={0.2}
          metalness={0.05}
          transparent
          opacity={0.85}
          emissive={emissive}
          emissiveIntensity={intensity}
        />
      </mesh>
      {/* Narrow lip */}
      <mesh position={[0, 0.66, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.08, 24]} />
        <meshStandardMaterial color="#b89858" roughness={0.3} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.74, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 24]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
      {/* Picks suggestion: two thin disks visible inside */}
      <mesh position={[0.05, 0.45, 0]} rotation={[0.4, 0.2, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.01, 16]} />
        <meshStandardMaterial color="#EF0000" />
      </mesh>
      <mesh position={[-0.08, 0.4, 0.05]} rotation={[-0.3, 0.5, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.01, 16]} />
        <meshStandardMaterial color="#f5b820" />
      </mesh>
      {Label}
    </group>
  );
}
