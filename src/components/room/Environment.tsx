'use client';

/**
 * Floor + two corner walls + window cut-out + lighting.
 *
 * Coordinate convention:
 *   - The camera looks toward the corner where the +X wall meets the +Z wall.
 *   - Floor occupies x: [-8, 8], z: [-8, 8].
 *   - Back wall (the user's left from camera): runs along x = -8 plane, faces +X.
 *   - Side wall (the user's right): runs along z = -8 plane, faces +Z.
 *   - Wait — to keep the camera looking INTO the corner, the two visible walls
 *     should be opposite the camera. Camera is at +X+Z, so visible walls live
 *     at -X (left wall) and -Z (back-right wall).
 */

export default function Environment() {
  return (
    <group>
      {/* Lights */}
      <hemisphereLight args={['#fff1d6', '#1a1410', 0.45]} />
      <directionalLight
        position={[6, 10, -4]}
        intensity={1.0}
        color="#ffd9a8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Warm off-screen lamp glow */}
      <pointLight
        position={[-6, 3.2, 6]}
        intensity={1.2}
        color="#ff9a55"
        distance={18}
        decay={1.4}
      />
      {/* Ambient fill so shadows don't crush */}
      <ambientLight intensity={0.18} color="#5a4030" />

      {/* Floor — warm wood tone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#8a5a32" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Left wall (runs along z axis, faces +X toward camera). */}
      <mesh position={[-8, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial color="#3a2418" roughness={0.95} metalness={0} />
      </mesh>

      {/* Back wall (runs along x axis, faces +Z toward camera). */}
      <mesh position={[0, 4, -8]} rotation={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial color="#3a2418" roughness={0.95} metalness={0} />
      </mesh>

      {/* Window cut into the back wall — emissive plane to suggest daylight.
          We don't actually carve a hole; we lay a bright plane on top. */}
      <mesh position={[3.5, 5.0, -7.95]}>
        <planeGeometry args={[3.6, 2.4]} />
        <meshStandardMaterial
          color="#ffe8b8"
          emissive="#ffe8b8"
          emissiveIntensity={1.6}
          roughness={1}
          metalness={0}
        />
      </mesh>
      {/* Window mullion cross — two thin dark planes */}
      <mesh position={[3.5, 5.0, -7.93]}>
        <planeGeometry args={[3.6, 0.08]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
      <mesh position={[3.5, 5.0, -7.93]}>
        <planeGeometry args={[0.08, 2.4]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
      {/* Window frame */}
      <mesh position={[3.5, 5.0, -7.92]}>
        <ringGeometry args={[0, 0, 0]} />
        <meshStandardMaterial visible={false} />
      </mesh>
      <mesh position={[3.5, 5.0, -7.94]}>
        <planeGeometry args={[3.9, 2.7]} />
        <meshStandardMaterial color="#241408" />
      </mesh>

      {/* Baseboard along the two visible walls */}
      <mesh position={[-7.95, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[16, 0.3]} />
        <meshStandardMaterial color="#2a1810" />
      </mesh>
      <mesh position={[0, 0.15, -7.95]}>
        <planeGeometry args={[16, 0.3]} />
        <meshStandardMaterial color="#2a1810" />
      </mesh>
    </group>
  );
}
