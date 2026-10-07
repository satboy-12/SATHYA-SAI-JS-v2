import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useLenisScroll } from '../../context/SmoothScrollProvider';
import { CinematicCameraController } from './CinematicCameraController';
import { HeroArmature } from './HeroArmature';
import { CyberDefenseGrid } from './CyberDefenseGrid';
import { DataVolumetricField } from './DataVolumetricField';
import { GlobalNetworkConstellation } from './GlobalNetworkConstellation';

function SceneLighting() {
  const { scrollState } = useLenisScroll();
  const currentY = -scrollState.progress * 43.5;

  return (
    <>
      <ambientLight intensity={1.4} color="#181824" />

      {/* Primary Key Amber Volumetric Light that tracks camera height */}
      <pointLight
        position={[4, currentY + 3, 5]}
        intensity={3.2}
        distance={24}
        color="#ff7a29"
        decay={2}
      />

      {/* Secondary Cool Ice Rim Light */}
      <pointLight
        position={[-4.5, currentY - 3, 4]}
        intensity={2.0}
        distance={22}
        color="#9fc6e8"
        decay={2}
      />

      {/* Directional Sunlight from top */}
      <directionalLight position={[0, currentY + 7, 6]} intensity={0.7} color="#fff2e0" />
    </>
  );
}

function SceneAssets() {
  const { scrollState } = useLenisScroll();
  const p = scrollState.progress;

  // Lifecycle & Frustum Culling calculation:
  // Each asset is only active & rendered when close to camera view
  const heroVisibility = useMemo(() => {
    if (p < 0.25) return { visible: true, opacity: 1 - p * 3.5 };
    return { visible: false, opacity: 0 };
  }, [p]);

  const cyberVisibility = useMemo(() => {
    if (p >= 0.08 && p < 0.42) {
      const mid = 0.22;
      const dist = Math.abs(p - mid);
      const op = Math.max(0, 1 - dist * 5.5);
      return { visible: true, opacity: op };
    }
    return { visible: false, opacity: 0 };
  }, [p]);

  const networkVisibility = useMemo(() => {
    if (p >= 0.72) {
      const op = Math.min(1, (p - 0.72) * 4);
      return { visible: true, opacity: op };
    }
    return { visible: false, opacity: 0 };
  }, [p]);

  return (
    <>
      {/* 1. Hero Armature (Home section) */}
      <HeroArmature visible={heroVisibility.visible} opacity={heroVisibility.opacity} />

      {/* 2. Cyber Defense Grid (Manifesto & Capabilities transition) */}
      <CyberDefenseGrid
        visible={cyberVisibility.visible}
        opacity={cyberVisibility.opacity}
        position={[1.8, -8.5, -0.5]}
      />

      {/* 3. Global Network Constellation (Contact & Terminal section) */}
      <GlobalNetworkConstellation
        visible={networkVisibility.visible}
        opacity={networkVisibility.opacity}
        position={[0, -43.5, 0]}
      />

      {/* 4. Continuous Volumetric Particle Field across all vertical depths */}
      <DataVolumetricField count={360} opacity={0.65} />
    </>
  );
}

function LoadingFallback() {
  return null;
}

export const PortfolioSceneManager: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden w-full h-full"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 11], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 1.8)]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Smooth Controlled Camera Choreography */}
          <CinematicCameraController />

          {/* Dynamic Lighting Setup */}
          <SceneLighting />

          {/* Managed 3D Assets with Lifecycle & Frustum Culling */}
          <SceneAssets />
        </Suspense>
      </Canvas>
    </div>
  );
};
