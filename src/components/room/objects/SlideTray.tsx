'use client';

import {
  useInteractable,
  hoverEmissive,
  hoverEmissiveIntensity,
  type InteractableProps,
} from '../useInteractable';

/** Shallow box on the desk holding 3–4 slide cylinders. */
export default function SlideTray(props: InteractableProps) {
  const { hovered, handlers, Label } = useInteractable(props, [0, 0.6, 0]);
  const emissive = hoverEmissive(hovered);
  const intensity = hoverEmissiveIntensity(hovered);

  return (
    <group position={[-1.0, 1.66, -6.4]} {...handlers}>
      {/* Tray base */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.08, 0.45]} />
        <meshStandardMaterial
          color="#3a2410"
          roughness={0.7}
          emissive={emissive}
          emissiveIntensity={intensity * 0.5}
        />
      </mesh>
      {/* Tray rim */}
      <mesh position={[0, 0.1, 0.215]}>
        <boxGeometry args={[0.95, 0.06, 0.02]} />
        <meshStandardMaterial color="#2a1808" />
      </mesh>
      <mesh position={[0, 0.1, -0.215]}>
        <boxGeometry args={[0.95, 0.06, 0.02]} />
        <meshStandardMaterial color="#2a1808" />
      </mesh>
      <mesh position={[0.475, 0.1, 0]}>
        <boxGeometry args={[0.02, 0.06, 0.45]} />
        <meshStandardMaterial color="#2a1808" />
      </mesh>
      <mesh position={[-0.475, 0.1, 0]}>
        <boxGeometry args={[0.02, 0.06, 0.45]} />
        <meshStandardMaterial color="#2a1808" />
      </mesh>
      {/* Slides — small horizontal cylinders */}
      {[
        { x: -0.32, color: '#cfcfcf', metal: 0.9 },
        { x: -0.08, color: '#c2a060', metal: 0.7 },
        { x: 0.18, color: '#e8e8e8', metal: 0.95 },
        { x: 0.4, color: '#7a4a22', metal: 0.2 },
      ].map((s, i) => (
        <mesh
          key={i}
          position={[s.x, 0.14, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.06, 0.06, 0.32, 16]} />
          <meshStandardMaterial
            color={s.color}
            metalness={s.metal}
            roughness={0.3}
            emissive={emissive}
            emissiveIntensity={intensity}
          />
        </mesh>
      ))}
      {Label}
    </group>
  );
}
