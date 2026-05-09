'use client';

import {
  useInteractable,
  hoverEmissive,
  hoverEmissiveIntensity,
  type InteractableProps,
} from '../useInteractable';

/** Flat box on the floor with 5–6 pedals on top (one taller = wah). */
export default function Pedalboard(props: InteractableProps) {
  const { hovered, handlers, Label } = useInteractable(props, [0, 1.0, 0]);
  const emissive = hoverEmissive(hovered);
  const intensity = hoverEmissiveIntensity(hovered);

  // pedal positions on the board (x, z)
  const pedals: Array<{
    pos: [number, number, number];
    size: [number, number, number];
    color: string;
    cyl?: boolean;
  }> = [
    { pos: [-0.9, 0.32, -0.2], size: [0.5, 0.2, 0.7], color: '#1f6e3a' },
    { pos: [-0.3, 0.32, -0.2], size: [0.5, 0.2, 0.7], color: '#cf7e1f' },
    { pos: [0.3, 0.32, -0.2], size: [0.5, 0.2, 0.7], color: '#2a4ea0' },
    { pos: [0.9, 0.32, -0.2], size: [0.5, 0.2, 0.7], color: '#7b1fa2' },
    // Cry Baby silhouette — taller and angled
    { pos: [0, 0.5, 0.45], size: [0.6, 0.55, 0.95], color: '#0a0a0a' },
    // small cylindrical "tuner" pedal
    { pos: [-0.9, 0.32, 0.45], size: [0.32, 0.2, 0.32], color: '#202020', cyl: true },
  ];

  return (
    <group position={[3.5, 0, 1]} {...handlers}>
      {/* Board */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.18, 1.7]} />
        <meshStandardMaterial
          color="#181210"
          roughness={0.8}
          emissive={emissive}
          emissiveIntensity={intensity * 0.5}
        />
      </mesh>
      {/* Pedals */}
      {pedals.map((p, i) =>
        p.cyl ? (
          <mesh key={i} position={p.pos} castShadow>
            <cylinderGeometry args={[p.size[0] / 2, p.size[0] / 2, p.size[1], 16]} />
            <meshStandardMaterial
              color={p.color}
              roughness={0.5}
              metalness={0.3}
              emissive={emissive}
              emissiveIntensity={intensity}
            />
          </mesh>
        ) : (
          <mesh key={i} position={p.pos} castShadow>
            <boxGeometry args={p.size} />
            <meshStandardMaterial
              color={p.color}
              roughness={0.5}
              metalness={0.2}
              emissive={emissive}
              emissiveIntensity={intensity}
            />
          </mesh>
        ),
      )}
      {Label}
    </group>
  );
}
