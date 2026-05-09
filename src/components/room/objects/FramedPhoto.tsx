'use client';

import {
  useInteractable,
  hoverEmissive,
  hoverEmissiveIntensity,
  type InteractableProps,
} from '../useInteractable';

/** Gold-record vibe: rectangle frame with a circle inside. On the back wall. */
export default function FramedPhoto(props: InteractableProps) {
  const { hovered, handlers, Label } = useInteractable(props, [0, 1.0, 0]);
  const emissive = hoverEmissive(hovered);
  const intensity = hoverEmissiveIntensity(hovered);

  return (
    <group position={[0.5, 5.2, -7.85]} {...handlers}>
      {/* Outer frame */}
      <mesh>
        <planeGeometry args={[1.6, 1.6]} />
        <meshStandardMaterial
          color="#c2a060"
          metalness={0.7}
          roughness={0.3}
          emissive={emissive}
          emissiveIntensity={intensity}
        />
      </mesh>
      {/* Inner mat (dark) */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[1.4, 1.4]} />
        <meshStandardMaterial color="#0a0604" />
      </mesh>
      {/* Gold record disk */}
      <mesh position={[0, 0, 0.02]}>
        <circleGeometry args={[0.55, 32]} />
        <meshStandardMaterial color="#d4b878" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Center label */}
      <mesh position={[0, 0, 0.03]}>
        <circleGeometry args={[0.16, 24]} />
        <meshStandardMaterial color="#EF0000" />
      </mesh>
      {/* Spindle hole */}
      <mesh position={[0, 0, 0.04]}>
        <circleGeometry args={[0.02, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      {Label}
    </group>
  );
}
