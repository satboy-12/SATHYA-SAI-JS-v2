import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Shield, Cpu, Database, RotateCcw, Play, Pause, Eye } from 'lucide-react';

type LabMode = 'cyber' | 'software' | 'data';

export const ThreeDLabInspector: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<LabMode>('cyber');
  const [isWireframe, setIsWireframe] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [activeTelemetry, setActiveTelemetry] = useState({
    latency: '1.2ms',
    entropy: '256-Bit SHA-3',
    nodes: '38 Districts Active',
    integrity: 'Verified 100%',
  });

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const currentObjectGroupRef = useRef<THREE.Group | null>(null);
  const autoRotateRef = useRef<boolean>(true);
  const wireframeRef = useRef<boolean>(true);
  const modeRef = useRef<LabMode>('cyber');

  // Keep refs in sync with state
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    wireframeRef.current = isWireframe;
  }, [isWireframe]);

  useEffect(() => {
    modeRef.current = activeMode;
    rebuildModel(activeMode, isWireframe);

    // Update telemetry state
    if (activeMode === 'cyber') {
      setActiveTelemetry({
        latency: '0.8ms',
        entropy: '256-Bit SHA-3',
        nodes: 'Kali & Wireshark Inspection',
        integrity: 'Zero-Trust Enforced',
      });
    } else if (activeMode === 'software') {
      setActiveTelemetry({
        latency: '3.4ms TTFB',
        entropy: 'Python / Streamlit AST',
        nodes: '38 Districts Automated',
        integrity: '100% Rules Sanitized',
      });
    } else {
      setActiveTelemetry({
        latency: 'Sub-Second OLAP',
        entropy: 'SQL Star Schema',
        nodes: 'Power BI KPI Pipelines',
        integrity: 'DAX Measures Validated',
      });
    }
  }, [activeMode, isWireframe]);

  const rebuildModel = (mode: LabMode, wireframe: boolean) => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (currentObjectGroupRef.current) {
      scene.remove(currentObjectGroupRef.current);
      // Traverse and dispose
      currentObjectGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }

    const group = new THREE.Group();
    currentObjectGroupRef.current = group;

    if (mode === 'cyber') {
      // 1. Cyber Security: Encrypted Polyhedral Shield + Cryptographic Orbital Rings
      const polyGeo = new THREE.DodecahedronGeometry(2.1, 1);
      const polyMat = new THREE.MeshStandardMaterial({
        color: 0x14141e,
        emissive: 0xff7a29,
        emissiveIntensity: 0.25,
        roughness: 0.2,
        metalness: 0.9,
        wireframe: wireframe,
      });
      const polyMesh = new THREE.Mesh(polyGeo, polyMat);
      group.add(polyMesh);

      // Outer Cryptographic Orbital Ring
      const ringGeo = new THREE.TorusGeometry(3.2, 0.03, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xff7a29, wireframe: true });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.5;
      group.add(ring);

      // Second inclined ring
      const ring2Geo = new THREE.TorusGeometry(2.8, 0.02, 16, 80);
      const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x9fc6e8 });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.y = Math.PI / 3;
      group.add(ring2);

      // Node spheres at vertices
      const nodeGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xff7a29 });
      for (let i = 0; i < 8; i++) {
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        const angle = (i / 8) * Math.PI * 2;
        node.position.set(Math.cos(angle) * 3.2, Math.sin(angle) * 3.2 * Math.cos(Math.PI / 2.5), Math.sin(angle) * 3.2 * Math.sin(Math.PI / 2.5));
        group.add(node);
      }
    } else if (mode === 'software') {
      // 2. Software Systems: Interconnected Modular Torus Knot Lattice
      const knotGeo = new THREE.TorusKnotGeometry(1.6, 0.45, 128, 32, 2, 3);
      const knotMat = new THREE.MeshStandardMaterial({
        color: 0x151c28,
        emissive: 0x3d7cb8,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.8,
        wireframe: wireframe,
      });
      const knotMesh = new THREE.Mesh(knotGeo, knotMat);
      group.add(knotMesh);

      // Surrounding cube bounding grid
      const boxGeo = new THREE.BoxGeometry(4.2, 4.2, 4.2);
      const boxMat = new THREE.MeshBasicMaterial({
        color: 0x4a4a58,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      const boxMesh = new THREE.Mesh(boxGeo, boxMat);
      group.add(boxMesh);
    } else {
      // 3. Data Analytics: Multi-Dimensional Point Cloud / Vector Matrix
      const ptCount = 650;
      const ptGeo = new THREE.BufferGeometry();
      const pos = new Float32Array(ptCount * 3);
      const colors = new Float32Array(ptCount * 3);

      const amber = new THREE.Color(0xff7a29);
      const cool = new THREE.Color(0x9fc6e8);
      const dim = new THREE.Color(0x3a3a46);

      for (let i = 0; i < ptCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * 2.6;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;

        const c = Math.random() > 0.6 ? amber : (Math.random() > 0.4 ? cool : dim);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      ptGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      ptGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const ptMat = new THREE.PointsMaterial({
        size: wireframe ? 0.055 : 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(ptGeo, ptMat);
      group.add(points);

      // Central core cluster
      const centerGeo = new THREE.OctahedronGeometry(1.2, 2);
      const centerMat = new THREE.MeshBasicMaterial({
        color: 0xff7a29,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      const centerMesh = new THREE.Mesh(centerGeo, centerMat);
      group.add(centerMesh);
    }

    scene.add(group);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    // 3. Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Lights
    const amb = new THREE.AmbientLight(0x22222e, 1.6);
    scene.add(amb);

    const orangeLight = new THREE.PointLight(0xff7a29, 3.5, 20);
    orangeLight.position.set(4, 3, 5);
    scene.add(orangeLight);

    const blueLight = new THREE.PointLight(0x9fc6e8, 2.2, 18);
    blueLight.position.set(-4, -3, 4);
    scene.add(blueLight);

    // 5. Initial Model
    rebuildModel(modeRef.current, wireframeRef.current);

    // 6. Mouse Drag Interaction (360 Rotation with Inertia)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0.003, y: 0.004 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !currentObjectGroupRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      currentObjectGroupRef.current.rotation.y += deltaX * 0.008;
      currentObjectGroupRef.current.rotation.x += deltaY * 0.008;

      rotationVelocity = { x: deltaY * 0.001, y: deltaX * 0.001 };
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !currentObjectGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      currentObjectGroupRef.current.rotation.y += deltaX * 0.008;
      currentObjectGroupRef.current.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 7. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (currentObjectGroupRef.current) {
        if (!isDragging && autoRotateRef.current) {
          currentObjectGroupRef.current.rotation.y += 0.006;
          currentObjectGroupRef.current.rotation.x += 0.002;
        } else if (!isDragging) {
          // Apply gentle damping inertia
          currentObjectGroupRef.current.rotation.y += rotationVelocity.y;
          currentObjectGroupRef.current.rotation.x += rotationVelocity.x;
          rotationVelocity.x *= 0.94;
          rotationVelocity.y *= 0.94;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);

      if (container && domEl.parentNode === container) {
        container.removeChild(domEl);
      }
      renderer.dispose();
    };
  }, []);

  const handleResetCamera = () => {
    if (currentObjectGroupRef.current) {
      currentObjectGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className="w-full bg-[var(--panel)] border border-[var(--line)] rounded-sm overflow-hidden flex flex-col lg:flex-row shadow-2xl relative">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] bg-gradient-to-b from-[#0a0a0f] to-[#121219] flex items-center justify-center cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Ambient Top Subtle Grid Indicator */}
        <div className="absolute top-4 left-5 flex items-center gap-3 font-mono-code text-[0.68rem] tracking-[0.2em] text-[var(--mut)] uppercase pointer-events-none z-10">
          <span className="w-2 h-2 rounded-full bg-[#ff7a29] animate-pulse" />
          <span>3D SIMULATION // {activeMode.toUpperCase()}_DISCIPLINE</span>
        </div>

        {/* Interactive Floating Canvas HUD Controls */}
        <div className="absolute bottom-4 right-5 flex items-center gap-2 z-10">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2.5 rounded-sm border transition-colors ${
              autoRotate
                ? 'bg-[#ff7a29]/15 border-[#ff7a29] text-[#ff7a29]'
                : 'bg-[var(--bg)]/80 border-[var(--line2)] text-[var(--mut)] hover:text-[var(--txt)]'
            }`}
            title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
            aria-label="Toggle Auto Rotate"
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`p-2.5 rounded-sm border transition-colors ${
              isWireframe
                ? 'bg-[#ff7a29]/15 border-[#ff7a29] text-[#ff7a29]'
                : 'bg-[var(--bg)]/80 border-[var(--line2)] text-[var(--mut)] hover:text-[var(--txt)]'
            }`}
            title="Toggle Wireframe / Solid Geometry"
            aria-label="Toggle Wireframe"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleResetCamera}
            className="p-2.5 rounded-sm border bg-[var(--bg)]/80 border-[var(--line2)] text-[var(--mut)] hover:text-[#ff7a29] hover:border-[#ff7a29] transition-colors"
            title="Reset Orientation"
            aria-label="Reset Orientation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Drag Helper Cue */}
        <div className="absolute bottom-4 left-5 font-mono-code text-[0.62rem] text-[var(--dim)] tracking-[0.16em] uppercase pointer-events-none hidden sm:block">
          Drag to inspect geometry · 360°
        </div>
      </div>

      {/* Control & Telemetry Sidebar */}
      <div className="w-full lg:w-[380px] p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[var(--line)] bg-[var(--panel2)]">
        {/* Discipline Mode Switchers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
            <span className="font-mono-code text-[0.68rem] tracking-[0.2em] uppercase text-[#ff7a29]">
              Engineering Discipline
            </span>
            <span className="font-mono-code text-[0.65rem] text-[var(--dim)]">
              Interactive 3D
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Mode 1: Cyber Security */}
            <button
              onClick={() => setActiveMode('cyber')}
              className={`p-3.5 rounded-sm text-left transition-all border flex items-start gap-3.5 ${
                activeMode === 'cyber'
                  ? 'border-[#ff7a29] bg-[#ff7a29]/10 text-[var(--txt)] shadow-sm'
                  : 'border-[var(--line)] bg-[var(--panel)] text-[var(--mut)] hover:border-[var(--line2)] hover:text-[var(--txt)]'
              }`}
            >
              <div
                className={`p-2 rounded-sm ${
                  activeMode === 'cyber' ? 'bg-[#ff7a29] text-[#0b0b0e]' : 'bg-[var(--bg)] text-[var(--mut)]'
                }`}
              >
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-disp font-semibold text-sm tracking-wide text-[var(--txt)]">
                  01. Cyber Security Core
                </div>
                <div className="text-xs text-[var(--dim)] mt-0.5 leading-snug">
                  Zero-trust encryption, threat mitigation, vulnerability testing.
                </div>
              </div>
            </button>

            {/* Mode 2: Software Development */}
            <button
              onClick={() => setActiveMode('software')}
              className={`p-3.5 rounded-sm text-left transition-all border flex items-start gap-3.5 ${
                activeMode === 'software'
                  ? 'border-[#ff7a29] bg-[#ff7a29]/10 text-[var(--txt)] shadow-sm'
                  : 'border-[var(--line)] bg-[var(--panel)] text-[var(--mut)] hover:border-[var(--line2)] hover:text-[var(--txt)]'
              }`}
            >
              <div
                className={`p-2 rounded-sm ${
                  activeMode === 'software' ? 'bg-[#ff7a29] text-[#0b0b0e]' : 'bg-[var(--bg)] text-[var(--mut)]'
                }`}
              >
                <Cpu className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-disp font-semibold text-sm tracking-wide text-[var(--txt)]">
                  02. Software Architecture
                </div>
                <div className="text-xs text-[var(--dim)] mt-0.5 leading-snug">
                  Python automation, Streamlit dashboards, modular backends.
                </div>
              </div>
            </button>

            {/* Mode 3: Data Analytics */}
            <button
              onClick={() => setActiveMode('data')}
              className={`p-3.5 rounded-sm text-left transition-all border flex items-start gap-3.5 ${
                activeMode === 'data'
                  ? 'border-[#ff7a29] bg-[#ff7a29]/10 text-[var(--txt)] shadow-sm'
                  : 'border-[var(--line)] bg-[var(--panel)] text-[var(--mut)] hover:border-[var(--line2)] hover:text-[var(--txt)]'
              }`}
            >
              <div
                className={`p-2 rounded-sm ${
                  activeMode === 'data' ? 'bg-[#ff7a29] text-[#0b0b0e]' : 'bg-[var(--bg)] text-[var(--mut)]'
                }`}
              >
                <Database className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-disp font-semibold text-sm tracking-wide text-[var(--txt)]">
                  03. Data Analytics Matrix
                </div>
                <div className="text-xs text-[var(--dim)] mt-0.5 leading-snug">
                  Power BI modeling, SQL pipelines, executive KPI intelligence.
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Real Domain Telemetry Display */}
        <div className="mt-6 pt-5 border-t border-[var(--line)] space-y-3 font-mono-code text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[var(--dim)] uppercase tracking-wider text-[0.68rem]">Pipeline Protocol</span>
            <span className="text-[var(--txt)] font-medium tabular-nums">{activeTelemetry.entropy}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--dim)] uppercase tracking-wider text-[0.68rem]">Response Velocity</span>
            <span className="text-[#ff7a29] font-medium tabular-nums">{activeTelemetry.latency}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--dim)] uppercase tracking-wider text-[0.68rem]">Coverage Scope</span>
            <span className="text-[var(--txt)] tabular-nums truncate max-w-[180px]">{activeTelemetry.nodes}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--dim)] uppercase tracking-wider text-[0.68rem]">Defense Status</span>
            <span className="text-emerald-400 font-medium tabular-nums">{activeTelemetry.integrity}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
