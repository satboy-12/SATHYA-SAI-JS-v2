import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DataVolumetricFieldProps {
  count?: number;
  opacity?: number;
}

export const DataVolumetricField: React.FC<DataVolumetricFieldProps> = ({
  count = 380,
  opacity = 0.75,
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const amber = new THREE.Color('#ff7a29');
    const cool = new THREE.Color('#9fc6e8');
    const dim = new THREE.Color('#383844');

    for (let i = 0; i < count; i++) {
      // Spread across vertical scroll space (from y = 5 down to y = -50)
      const x = (Math.random() - 0.5) * 18;
      const y = 8 - Math.random() * 58;
      const z = (Math.random() - 0.5) * 12;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const rand = Math.random();
      const c = rand > 0.75 ? amber : (rand > 0.55 ? cool : dim);

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
