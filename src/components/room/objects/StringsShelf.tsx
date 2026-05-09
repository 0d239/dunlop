'use client';

import {
  useInteractable,
  hoverEmissive,
  hoverEmissiveIntensity,
  type InteractableProps,
} from '../useInteractable';

/** Small wall shelf with three string-pack boxes. */
export default function StringsShelf(props: InteractableProps) {
  const { hovered, handlers, Label } = useInteractable(props, [0, 0.7, 0]);
  const emissive = hoverEmissive(hovered);
  const intensity = hoverEmissiveIntensity(hovered);

  return (
    <group position={[-7.85, 2.6, -2.5]} rotation={[0, Math.PI / 2, 0]} {...handlers}>
      {/* Shelf plank */}
      <mesh position={[0, 0, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.06, 0.4]} />
        <meshStandardMaterial
          color="#5a3a22"
          roughness={0.7}
          emissive={emissive}
          emissiveIntensity={intensity * 0.4}
        />
      </mesh>
      {/* Brackets */}
      <mesh position={[-0.7, -0.15, 0.05]}>
        <boxGeometry args={[0.04, 0.25, 0.04]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
      <mesh position={[0.7, -0.15, 0.05]}>
        <boxGeometry args={[0.04, 0.25, 0.04]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
      {/* Three thin packages stacked, slightly offset */}
      {[
        { y: 0.13, color: '#1a3a6a' },
        { y: 0.21, color: '#a23018' },
        { y: 0.29, color: '#1f6e3a' },
      ].map((p, i) => (
        <mesh key={i} position={[0, p.y, 0.2]} castShadow>
          <boxGeometry args={[1.2, 0.06, 0.3]} />
          <meshStandardMaterial
            color={p.color}
            roughness={0.6}
            emissive={emissive}
            emissiveIntensity={intensity}
          />
        </mesh>
      ))}
      {Label}
    </group>
  );
}
