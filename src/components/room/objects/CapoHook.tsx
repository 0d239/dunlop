'use client';

import {
  useInteractable,
  hoverEmissive,
  hoverEmissiveIntensity,
  type InteractableProps,
} from '../useInteractable';

/** A peg on the wall with 3 capo-shaped objects (torus segment + small box). */
export default function CapoHook(props: InteractableProps) {
  const { hovered, handlers, Label } = useInteractable(props, [0, 0.8, 0]);
  const emissive = hoverEmissive(hovered);
  const intensity = hoverEmissiveIntensity(hovered);

  return (
    <group position={[-7.85, 3.4, 1.5]} rotation={[0, Math.PI / 2, 0]} {...handlers}>
      {/* Wall peg */}
      <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 12]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
      {/* Three capos hanging — each is a small torus + box */}
      {[
        { x: -0.4, color: '#202020' },
        { x: 0.0, color: '#a5a5a5' },
        { x: 0.4, color: '#EF0000' },
      ].map((c, i) => (
        <group key={i} position={[c.x, -0.35, 0.18]}>
          {/* C-clamp shape (torus segment) */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.14, 0.04, 8, 16, Math.PI * 1.4]} />
            <meshStandardMaterial
              color={c.color}
              metalness={0.5}
              roughness={0.4}
              emissive={emissive}
              emissiveIntensity={intensity}
            />
          </mesh>
          {/* Small lever box */}
          <mesh position={[0, -0.18, 0.14]}>
            <boxGeometry args={[0.06, 0.18, 0.08]} />
            <meshStandardMaterial color={c.color} metalness={0.4} roughness={0.4} />
          </mesh>
        </group>
      ))}
      {Label}
    </group>
  );
}
