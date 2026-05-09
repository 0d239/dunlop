'use client';

import {
  useInteractable,
  hoverEmissive,
  hoverEmissiveIntensity,
  type InteractableProps,
} from '../useInteractable';

/** Tapered cylinder near the door — the cart. */
export default function Basket(props: InteractableProps) {
  const { hovered, handlers, Label } = useInteractable(props, [0, 0.9, 0]);
  const emissive = hoverEmissive(hovered);
  const intensity = hoverEmissiveIntensity(hovered);

  return (
    <group position={[-6, 0, 5.5]} {...handlers}>
      {/* Body — slight taper (top wider than bottom) */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.5, 0.8, 24]} />
        <meshStandardMaterial
          color="#8a5a32"
          roughness={0.8}
          emissive={emissive}
          emissiveIntensity={intensity}
        />
      </mesh>
      {/* Rim lip */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.06, 24]} />
        <meshStandardMaterial color="#5a3a22" roughness={0.7} />
      </mesh>
      {/* Suggest a weave — three thin horizontal bands */}
      {[0.18, 0.42, 0.66].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.55 + i * 0.02, 0.015, 6, 24]} />
          <meshStandardMaterial color="#3a2414" />
        </mesh>
      ))}
      {Label}
    </group>
  );
}
