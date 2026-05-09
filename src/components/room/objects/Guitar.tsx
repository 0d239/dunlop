'use client';

import {
  useInteractable,
  hoverEmissive,
  hoverEmissiveIntensity,
  type InteractableProps,
} from '../useInteractable';

/** Centerpiece: long thin body on a Y-shaped stand. */
export default function Guitar(props: InteractableProps) {
  const { hovered, handlers, Label } = useInteractable(props, [0, 4.0, 0]);
  const emissive = hoverEmissive(hovered);
  const intensity = hoverEmissiveIntensity(hovered);

  return (
    <group position={[1.5, 0, -3]} {...handlers}>
      {/* Y-shaped stand: tripod base */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.08, 16]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
      {/* Stand pole */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.7, 8]} />
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Y arms */}
      <mesh position={[-0.18, 1.7, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} />
        <meshStandardMaterial color="#222" metalness={0.6} />
      </mesh>
      <mesh position={[0.18, 1.7, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} />
        <meshStandardMaterial color="#222" metalness={0.6} />
      </mesh>

      {/* Guitar body (rounded rectangle approximated with a tall capsule-ish stack) */}
      {/* Body */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.18, 24]} />
        <meshStandardMaterial
          color="#a23018"
          roughness={0.45}
          metalness={0.15}
          emissive={emissive}
          emissiveIntensity={intensity}
        />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 3.0, 0]} castShadow>
        <boxGeometry args={[0.12, 2.1, 0.08]} />
        <meshStandardMaterial
          color="#3a2412"
          roughness={0.7}
          emissive={emissive}
          emissiveIntensity={intensity}
        />
      </mesh>
      {/* Headstock */}
      <mesh position={[0, 4.15, 0]} castShadow>
        <boxGeometry args={[0.28, 0.4, 0.06]} />
        <meshStandardMaterial
          color="#2a1808"
          emissive={emissive}
          emissiveIntensity={intensity}
        />
      </mesh>
      {/* Sound hole */}
      <mesh position={[0, 1.85, 0.091]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.16, 24]} />
        <meshStandardMaterial color="#0a0604" side={2} />
      </mesh>

      {Label}
    </group>
  );
}
