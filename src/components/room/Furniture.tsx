'use client';

import { Text } from '@react-three/drei';

/**
 * Static, non-interactable furniture: desk, chair, door, wall signage.
 *
 * Desk sits along the back wall (-Z side), chair pulled out in front of it.
 * Door is on the left wall (-X side), with the basket nearby.
 * Signage is mounted on the back wall, above and left of the window.
 */
export default function Furniture() {
  return (
    <group>
      {/* ───── Desk ───── */}
      <group position={[-2.5, 0, -6.4]}>
        {/* Desk top */}
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[5, 0.12, 1.8]} />
          <meshStandardMaterial color="#5a3a22" roughness={0.7} />
        </mesh>
        {/* Four legs */}
        {[
          [-2.3, -0.7],
          [2.3, -0.7],
          [-2.3, 0.7],
          [2.3, 0.7],
        ].map(([x, z], i) => (
          <mesh
            key={i}
            position={[x, 0.8, z]}
            castShadow
          >
            <boxGeometry args={[0.12, 1.6, 0.12]} />
            <meshStandardMaterial color="#3a2414" roughness={0.8} />
          </mesh>
        ))}
        {/* Apron */}
        <mesh position={[0, 1.4, -0.8]}>
          <boxGeometry args={[4.6, 0.2, 0.06]} />
          <meshStandardMaterial color="#3a2414" />
        </mesh>
      </group>

      {/* ───── Chair ───── */}
      <group position={[-2.5, 0, -4.4]} rotation={[0, Math.PI, 0]}>
        {/* Seat */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.0, 0.1, 1.0]} />
          <meshStandardMaterial color="#2a1a10" roughness={0.6} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 1.7, 0.45]} castShadow>
          <boxGeometry args={[1.0, 1.4, 0.08]} />
          <meshStandardMaterial color="#2a1a10" roughness={0.6} />
        </mesh>
        {/* Four legs */}
        {[
          [-0.42, -0.42],
          [0.42, -0.42],
          [-0.42, 0.42],
          [0.42, 0.42],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.45, z]} castShadow>
            <boxGeometry args={[0.08, 0.9, 0.08]} />
            <meshStandardMaterial color="#1a0f08" />
          </mesh>
        ))}
      </group>

      {/* ───── Door (on left wall) ───── */}
      <group position={[-7.9, 0, 4]}>
        {/* Door panel — flush against the left wall */}
        <mesh position={[0.05, 1.85, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.6, 3.7]} />
          <meshStandardMaterial color="#221208" roughness={0.9} />
        </mesh>
        {/* Door handle */}
        <mesh position={[0.1, 1.8, 0.65]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#c2a060" roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Door frame top */}
        <mesh position={[0.04, 3.75, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.9, 0.16]} />
          <meshStandardMaterial color="#1a0f08" />
        </mesh>
      </group>

      {/* ───── Wall signage on back wall ───── */}
      <group position={[-3.5, 5.6, -7.9]}>
        <mesh>
          <planeGeometry args={[4.4, 1.2]} />
          <meshStandardMaterial color="#0e0805" roughness={0.9} />
        </mesh>
        <Text
          position={[0, 0.2, 0.02]}
          fontSize={0.48}
          color="#f5f1ea"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
        >
          DUNLOP.
        </Text>
        <Text
          position={[0, -0.32, 0.02]}
          fontSize={0.22}
          color="#EF0000"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.18}
        >
          SINCE 1965.
        </Text>
      </group>
    </group>
  );
}
