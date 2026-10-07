import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HeroArmatureProps {
  visible: boolean;
  opacity?: number;
}

export const HeroArmature: React.FC<HeroArmatureProps> = ({ visible, opacity = 1 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const icosaRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!visible || !groupRef.current) return;

    const time = state.clock.getElapsedTime();

    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.25;
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x += delta * 0.35;
      ring2Ref.current.rotation.y += delta * 0.28;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y -= delta * 0.42;
      ring3Ref.current.rotation.z += delta * 0.22;
    }
    if (icosaRef.current) {
      icosaRef.current.rotation.x += delta * 0.3;
      icosaRef.current.rotation.y += delta * 0.45;
      const pulse = 1 + Math.sin(time * 1.8) * 0.04;
      icosaRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Outer Metallic Gimbal Ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.6, 0.024, 16, 100]} />
        <meshStandardMaterial
          color="#3a3a48"
          metalness={0.9}
          roughness={0.2}
          emissive="#111116"
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Mid Amber Tilted Ring */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3.2, Math.PI / 6, 0]}>
        <torusGeometry args={[3.1, 0.02, 16, 90]} />
        <meshStandardMaterial
          color="#ff7a29"
          metalness={0.8}
          roughness={0.3}
          emissive="#ff5500"
          emissiveIntensity={0.6}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Inner Cool Gyro Ring */}
      <mesh ref={ring3Ref} rotation={[-Math.PI / 4, 0, Math.PI / 5]}>
        <torusGeometry args={[2.6, 0.016, 16, 80]} />
        <meshStandardMaterial
          color="#9fc6e8"
          metalness={0.7}
          roughness={0.4}
          emissive="#0d2438"
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Glowing Geodesic Wireframe Polyhedron */}
      <mesh ref={icosaRef}>
        <icosahedronGeometry args={[1.85, 1]} />
        <meshBasicMaterial
          color="#ff7a29"
          wireframe
          transparent
          opacity={opacity * 0.32}
        />
      </mesh>

      {/* Inner Absorbing Core Sphere */}
      <mesh>
        <sphereGeometry args={[1.1, 24, 24]} />
        <meshStandardMaterial
          color="#101016"
          roughness={0.7}
          metalness={0.4}
          transparent
          opacity={opacity * 0.55}
        />
      </mesh>
    </group>
  );
};
