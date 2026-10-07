import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CyberDefenseGridProps {
  visible: boolean;
  opacity?: number;
  position?: [number, number, number];
}

export const CyberDefenseGrid: React.FC<CyberDefenseGridProps> = ({
  visible,
  opacity = 1,
  position = [1.8, -6.5, -0.5],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const dodecaRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!visible || !groupRef.current) return;
    const time = state.clock.getElapsedTime();

    if (dodecaRef.current) {
      dodecaRef.current.rotation.y += delta * 0.2;
      dodecaRef.current.rotation.x += delta * 0.15;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.28;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x -= delta * 0.22;
    }

    // Subtle floating breath
    groupRef.current.position.y = position[1] + Math.sin(time * 1.2) * 0.18;
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* 3D Encrypted Dodecahedron Shield */}
      <mesh ref={dodecaRef}>
        <dodecahedronGeometry args={[2.2, 1]} />
        <meshStandardMaterial
          color="#161622"
          wireframe
          emissive="#ff7a29"
          emissiveIntensity={0.35}
          roughness={0.25}
          metalness={0.85}
          transparent
          opacity={opacity * 0.45}
        />
      </mesh>

      {/* Cryptographic Hash Ring */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2.8, 0, 0]}>
        <torusGeometry args={[3.2, 0.02, 16, 80]} />
        <meshBasicMaterial
          color="#ff7a29"
          transparent
          opacity={opacity * 0.65}
        />
      </mesh>

      {/* Secondary Cool Telemetry Ring */}
      <mesh ref={ring2Ref} rotation={[0, Math.PI / 3, Math.PI / 6]}>
        <torusGeometry args={[2.7, 0.015, 16, 70]} />
        <meshBasicMaterial
          color="#9fc6e8"
          transparent
          opacity={opacity * 0.55}
        />
      </mesh>

      {/* Orbiting Integrity Nodes */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 3.2;
        const z = Math.sin(angle) * 3.2;
        return (
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial
              color="#ff7a29"
              transparent
              opacity={opacity * 0.85}
            />
          </mesh>
        );
      })}
    </group>
  );
};
