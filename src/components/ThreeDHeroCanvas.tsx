import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeDHeroCanvasProps {
  className?: string;
}

export const ThreeDHeroCanvas: React.FC<ThreeDHeroCanvasProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0e, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 11);

    // 2. WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      // Fallback if WebGL unavailable
      return;
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 3. Lighting (Volumetric 3-Point Studio + Amber Accent)
    const ambientLight = new THREE.AmbientLight(0x1a1a24, 1.4);
    scene.add(ambientLight);

    const keyOrangeLight = new THREE.PointLight(0xff7a29, 3.2, 25);
    keyOrangeLight.position.set(4, 3, 5);
    scene.add(keyOrangeLight);

    const coolRimLight = new THREE.PointLight(0x9fc6e8, 2.0, 20);
    coolRimLight.position.set(-5, -3, 3);
    scene.add(coolRimLight);

    const topFillLight = new THREE.DirectionalLight(0xfff4e6, 0.8);
    topFillLight.position.set(0, 6, 4);
    scene.add(topFillLight);

    // 4. 3D Engineering Gimbal Structure (Concentric Metallic & Wireframe Rings)
    const gimbalGroup = new THREE.Group();
    scene.add(gimbalGroup);

    // Ring 1: Outer Technical Ring
    const ring1Geo = new THREE.TorusGeometry(3.6, 0.025, 16, 120);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x4a4a58,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x111116,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    gimbalGroup.add(ring1);

    // Ring 2: Mid Amber Tilted Ring
    const ring2Geo = new THREE.TorusGeometry(3.1, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xff7a29,
      metalness: 0.8,
      roughness: 0.3,
      emissive: 0x441b00,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3.2;
    ring2.rotation.y = Math.PI / 6;
    gimbalGroup.add(ring2);

    // Ring 3: Inner Fast Gyro Ring with Segments
    const ring3Geo = new THREE.TorusGeometry(2.6, 0.018, 12, 80);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x9fc6e8,
      metalness: 0.7,
      roughness: 0.4,
      emissive: 0x081522,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = -Math.PI / 4;
    ring3.rotation.z = Math.PI / 5;
    gimbalGroup.add(ring3);

    // 5. Floating Geodesic Wireframe Polyhedron
    const icosaGeo = new THREE.IcosahedronGeometry(1.85, 1);
    const icosaWireMat = new THREE.MeshBasicMaterial({
      color: 0xff7a29,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const icosahedron = new THREE.Mesh(icosaGeo, icosaWireMat);
    gimbalGroup.add(icosahedron);

    // Inner subtle glow core
    const coreGeo = new THREE.SphereGeometry(1.0, 24, 24);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x15151e,
      roughness: 0.6,
      metalness: 0.5,
      transparent: true,
      opacity: 0.4,
    });
    const innerCore = new THREE.Mesh(coreGeo, coreMat);
    gimbalGroup.add(innerCore);

    // 6. 3D Data Particle Matrix
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const orangeColor = new THREE.Color(0xff7a29);
    const coolColor = new THREE.Color(0x9fc6e8);
    const dimColor = new THREE.Color(0x4a4a58);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      // Color variation: 60% dim, 25% orange, 15% cool
      const rand = Math.random();
      let chosenColor = dimColor;
      if (rand > 0.75) chosenColor = orangeColor;
      else if (rand > 0.6) chosenColor = coolColor;

      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Mouse & Scroll Interaction with Smooth Damping
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = 0;
    let targetScrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouse.targetX = x * 2;
      mouse.targetY = y * 2;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 8. Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      scrollY += (targetScrollY - scrollY) * 0.06;

      if (!prefersReducedMotion) {
        // Continuous gentle rotation of gimbal rings
        ring1.rotation.z += 0.003;
        ring2.rotation.x += 0.005;
        ring2.rotation.y += 0.004;
        ring3.rotation.y -= 0.006;
        ring3.rotation.z += 0.003;

        // Icosahedron breathing & rotation
        icosahedron.rotation.x += 0.004;
        icosahedron.rotation.y += 0.006;
        const scale = 1 + Math.sin(time * 1.5) * 0.03;
        icosahedron.scale.set(scale, scale, scale);

        // Particle field rotation
        particles.rotation.y += 0.001;
        particles.rotation.x = Math.sin(time * 0.2) * 0.05;

        // Dynamic light orbit
        keyOrangeLight.position.x = Math.sin(time * 0.7) * 4.5 + mouse.x * 2;
        keyOrangeLight.position.y = Math.cos(time * 0.5) * 3.5 - mouse.y * 2;
        coolRimLight.position.x = -Math.cos(time * 0.6) * 4.5;
        coolRimLight.position.y = -Math.sin(time * 0.8) * 3.5;
      }

      // Gimbal reacts to mouse tilt & scroll depth
      gimbalGroup.rotation.y = mouse.x * 0.55 + (scrollY * 0.0006);
      gimbalGroup.rotation.x = -mouse.y * 0.45;
      gimbalGroup.position.z = -scrollY * 0.003;

      renderer.render(scene, camera);
    };

    animate();

    // 10. WebGL Context Loss Handling
    const canvasEl = renderer.domElement;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(animId);
    };
    const handleContextRestored = () => {
      animate();
    };

    canvasEl.addEventListener('webglcontextlost', handleContextLost, false);
    canvasEl.addEventListener('webglcontextrestored', handleContextRestored, false);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      canvasEl.removeEventListener('webglcontextlost', handleContextLost);
      canvasEl.removeEventListener('webglcontextrestored', handleContextRestored);

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries & materials
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      icosaGeo.dispose();
      icosaWireMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none w-full h-full overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};
