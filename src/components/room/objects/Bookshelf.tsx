'use client';

import {
  useInteractable,
  hoverEmissive,
  hoverEmissiveIntensity,
  type InteractableProps,
} from '../useInteractable';

/** Tall box with 3 horizontal shelves; each shelf holds 5–8 record sleeves. */
export default function Bookshelf(props: InteractableProps) {
  const { hovered, handlers, Label } = useInteractable(props, [0, 4.2, 0]);
  const emissive = hoverEmissive(hovered);
  const intensity = hoverEmissiveIntensity(hovered);

  const sleeveColors = [
    '#a23018',
    '#f5b820',
    '#1f6e3a',
    '#2a4ea0',
    '#7b1fa2',
    '#e8e8e8',
    '#101010',
    '#cf7e1f',
  ];

  // Three shelf Y positions inside the bookcase frame
  const shelfYs = [0.9, 2.05, 3.2];

  return (
    <group position={[6.5, 0, -3]} {...handlers}>
      {/* Outer frame: back panel */}
      <mesh position={[0, 1.95, -0.32]}>
        <boxGeometry args={[2.0, 3.9, 0.04]} />
        <meshStandardMaterial
          color="#3a2410"
          roughness={0.85}
          emissive={emissive}
          emissiveIntensity={intensity * 0.35}
        />
      </mesh>
      {/* Sides */}
      <mesh position={[-1.0, 1.95, 0]} castShadow>
        <boxGeometry args={[0.08, 3.9, 0.7]} />
        <meshStandardMaterial color="#5a3a22" roughness={0.8} />
      </mesh>
      <mesh position={[1.0, 1.95, 0]} castShadow>
        <boxGeometry args={[0.08, 3.9, 0.7]} />
        <meshStandardMaterial color="#5a3a22" roughness={0.8} />
      </mesh>
      {/* Top + bottom */}
      <mesh position={[0, 3.9, 0]} castShadow>
        <boxGeometry args={[2.08, 0.08, 0.7]} />
        <meshStandardMaterial color="#5a3a22" />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.08, 0.08, 0.7]} />
        <meshStandardMaterial color="#5a3a22" />
      </mesh>
      {/* Shelves */}
      {shelfYs.map((y, i) => (
        <mesh key={`shelf-${i}`} position={[0, y, 0]} castShadow>
          <boxGeometry args={[1.92, 0.05, 0.6]} />
          <meshStandardMaterial color="#5a3a22" />
        </mesh>
      ))}
      {/* Records on each shelf — thin upright planes */}
      {shelfYs.map((shelfY, sIdx) =>
        Array.from({ length: 7 }).map((_, j) => {
          const x = -0.84 + j * 0.24;
          return (
            <mesh
              key={`r-${sIdx}-${j}`}
              position={[x, shelfY + 0.5, 0]}
              rotation={[0, 0, (j % 2) * 0.04]}
              castShadow
            >
              <boxGeometry args={[0.18, 0.95, 0.04]} />
              <meshStandardMaterial
                color={sleeveColors[(sIdx * 3 + j) % sleeveColors.length]}
                roughness={0.8}
                emissive={emissive}
                emissiveIntensity={intensity}
              />
            </mesh>
          );
        }),
      )}
      {Label}
    </group>
  );
}
