import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GlobalNetworkConstellationProps {
  visible: boolean;
  opacity?: number;
  position?: [number, number, number];
}

export const GlobalNetworkConstellation: React.FC<GlobalNetworkConstellationProps> = ({
  visible,
  opacity = 1,
  position = [0, -43.5, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!visible || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.15;
    groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* Geodesic Wireframe Sphere */}
      <mesh ref={sphereRef}>
        <icosahedronGeometry args={[2.5, 2]} />
        <meshBasicMaterial
          color="#383848"
          wireframe
          transparent
          opacity={opacity * 0.28}
        />
      </mesh>

      {/* Latitudinal Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.015, 12, 64]} />
        <meshBasicMaterial color="#ff7a29" transparent opacity={opacity * 0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.5, 0.015, 12, 64]} />
        <meshBasicMaterial color="#9fc6e8" transparent opacity={opacity * 0.3} />
      </mesh>

      {/* Chennai Node Highlight (warm pulsing amber) */}
      <mesh position={[1.4, 0.8, 1.8]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#ff7a29" transparent opacity={opacity * 0.95} />
      </mesh>
    </group>
  );
};
