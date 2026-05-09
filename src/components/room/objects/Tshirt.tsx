'use client';

import {
  useInteractable,
  hoverEmissive,
  hoverEmissiveIntensity,
  type InteractableProps,
} from '../useInteractable';

/** Folded t-shirt suggestion: small flat box draped over chair back. */
export default function Tshirt(props: InteractableProps) {
  const { hovered, handlers, Label } = useInteractable(props, [0, 0.6, 0]);
  const emissive = hoverEmissive(hovered);
  const intensity = hoverEmissiveIntensity(hovered);

  return (
    <group position={[-2.5, 2.55, -3.95]} {...handlers}>
      {/* Main body */}
      <mesh castShadow>
        <boxGeometry args={[1.05, 0.18, 0.38]} />
        <meshStandardMaterial
          color="#000000"
          roughness={0.95}
          emissive={emissive}
          emissiveIntensity={intensity}
        />
      </mesh>
      {/* Drape over the back of the chair: a strip falling on the back side */}
      <mesh position={[0, -0.18, 0.18]}>
        <boxGeometry args={[1.05, 0.4, 0.04]} />
        <meshStandardMaterial color="#000000" roughness={0.95} />
      </mesh>
      {/* Tiny red Dunlop spot */}
      <mesh position={[0, 0.1, 0.0]}>
        <boxGeometry args={[0.18, 0.02, 0.06]} />
        <meshStandardMaterial color="#EF0000" emissive="#EF0000" emissiveIntensity={0.4} />
      </mesh>
      {Label}
    </group>
  );
}
