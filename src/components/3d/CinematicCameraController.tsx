import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useLenisScroll } from '../../context/SmoothScrollProvider';

export const CinematicCameraController: React.FC = () => {
  const { camera } = useThree();
  const { scrollState } = useLenisScroll();

  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const currentPosRef = useRef(new THREE.Vector3(0, 0, 11));
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = x * 0.8;
      mouseRef.current.targetY = y * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    // Smooth mouse lerp
    mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
    mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

    // Calculate target camera position based on scroll progress and section
    // Total vertical span is mapped to y = 0 (hero) down to y = -43.5 (contact)
    const progress = Math.min(Math.max(scrollState.progress, 0), 1);
    
    // Non-linear cinematic path with subtle horizontal drifts at key checkpoints
    const targetY = -progress * 43.5;
    
    // Subtle lateral sway depending on section
    let targetX = mouseRef.current.x * 0.75;
    if (progress > 0.12 && progress < 0.32) {
      // Manifesto: slight offset to the right
      targetX += 0.8;
    } else if (progress >= 0.32 && progress < 0.55) {
      // 3D Lab / Capabilities: centered / slight left
      targetX -= 0.6;
    }

    const targetZ = 10.5 + Math.sin(progress * Math.PI) * 1.5;

    const targetPos = new THREE.Vector3(targetX, targetY, targetZ);
    const targetLookAt = new THREE.Vector3(targetX * 0.3, targetY, 0);

    // Smooth dampening to eliminate jitter and give controlled camera feel
    currentPosRef.current.lerp(targetPos, Math.min(delta * 4.5, 1));
    currentLookAtRef.current.lerp(targetLookAt, Math.min(delta * 4.5, 1));

    camera.position.copy(currentPosRef.current);
    camera.lookAt(currentLookAtRef.current);
  });

  return null;
};
