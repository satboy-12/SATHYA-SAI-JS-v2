import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ArrowRight, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface CinematicOpeningSequenceProps {
  onComplete: () => void;
  isReplay?: boolean;
}

export const CinematicOpeningSequence: React.FC<CinematicOpeningSequenceProps> = ({
  onComplete,
  isReplay = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  // Animation state driven by requestAnimationFrame
  const [progress, setProgress] = useState(0); // 0.0 to 1.0 (corresponds to 0s to 9.2s)
  const [isSkipping, setIsSkipping] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // References for the WebGL & animation loop
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const totalDurationRef = useRef<number>(9.2); // Total seconds for master timeline
  const skipSpeedRef = useRef<number>(1);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Storyboard Milestones (Time in seconds)
  // Shot 01: 0.0 - 1.0s (Black Screen + Title)
  // Shot 02: 1.0 - 2.2s (Line + Secure / Build / Analyze)
  // Shot 03: 2.2 - 3.6s (Back Character Reveal in warm rim light)
  // Shot 04: 3.6 - 4.8s (Continuous turn to side and 3/4)
  // Shot 05: 4.8 - 5.8s (Front view character + push in)
  // Shot 06: 5.6 - 6.8s (Giant SATHYA SAI JS typography behind character)
  // Shot 07: 6.4 - 7.5s (Roles: Web & App Dev, Cyber Security, Data Analyst)
  // Shot 08: 7.2 - 8.2s ("I build things that work." terracotta statement)
  // Shot 09: 8.0 - 9.0s (Camera pulls back, amber workspace screens fade in, "Scroll to Explore")
  // Shot 10: 9.0 - 9.2s (Seamless handoff into portfolio)

  const handleSkip = useCallback(() => {
    if (isSkipping) return;
    setIsSkipping(true);
    skipSpeedRef.current = 6.0; // Rapidly accelerate timeline to finish smoothly in ~350ms
  }, [isSkipping]);

  // Audio Ambience Synthesis (Subtle warm cinematic drone using Web Audio API when unmuted)
  const toggleAudio = () => {
    if (isAudioMuted) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        // Warm cinematic sub-bass rumble & gentle chord
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 note
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(110, ctx.currentTime); // A2 note

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(180, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 1.2);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
      } catch {
        // Audio synthesis fallback
      }
      setIsAudioMuted(false);
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      setIsAudioMuted(true);
    }
  };

  // Main WebGL and Master Timeline Initialization
  useEffect(() => {
    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && !isReplay) {
      sessionStorage.setItem('sathya_cinematic_intro_seen', 'true');
      onComplete();
      return;
    }

    const container = canvasContainerRef.current;
    if (!container) return;

    // 1. Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d0a09, 0.035);

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    // Initial camera position for Shot 01-03
    camera.position.set(0, 1.25, 4.6);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      // Fallback: Skip if WebGL unsupported
      onComplete();
      return;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Lighting System (Storyboard: Warm Amber + Terracotta + Soft Rim)
    const ambientLight = new THREE.AmbientLight(0x181210, 1.0);
    scene.add(ambientLight);

    // Dynamic Back Rim Light (Warm golden orange illuminating hair & shoulders)
    const backRimLight = new THREE.PointLight(0xff8c3b, 0, 18);
    backRimLight.position.set(0, 2.2, -2.5);
    scene.add(backRimLight);

    // Dynamic Front Key Light (Amber Studio Light)
    const frontKeyLight = new THREE.PointLight(0xffa866, 0, 20);
    frontKeyLight.position.set(2.4, 2.0, 3.8);
    scene.add(frontKeyLight);

    // Subtle Cool Charcoal Fill Light
    const fillLight = new THREE.PointLight(0x738290, 0.4, 15);
    fillLight.position.set(-3.2, 1.0, 2.0);
    scene.add(fillLight);

    // 3. Volumetric Floating Amber Particles System
    const particleCount = 380;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8 + 1.2;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      particleScales[i] = Math.random() * 0.8 + 0.4;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle texture generator (soft radial glowing amber dust speck)
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 175, 95, 1)');
      grad.addColorStop(0.3, 'rgba(215, 110, 50, 0.6)');
      grad.addColorStop(1, 'rgba(13, 10, 9, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.065,
      map: particleTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4. Texture Loader & Character Staging
    const textureLoader = new THREE.TextureLoader();
    
    // Front Texture: High detail 3D render of Sathya Sai JS in beige shirt & dark pants
    const frontTex = textureLoader.load('/images/sathya_3d_front.jpg');
    frontTex.colorSpace = THREE.SRGBColorSpace;
    frontTex.generateMipmaps = true;

    // Side Profile Texture
    const sideTex = textureLoader.load('/images/sathya_3d_side.jpg');
    sideTex.colorSpace = THREE.SRGBColorSpace;

    // Back Silhouette Texture
    const backTex = textureLoader.load('/images/sathya_3d_back.jpg');
    backTex.colorSpace = THREE.SRGBColorSpace;

    // 3D Character Multi-Layer Planar Mesh Rig
    // Allows physically smooth rotation from Back (180deg) -> Side (90deg) -> Front (0deg)
    const characterGroup = new THREE.Group();
    characterGroup.position.set(0, 0, 0);
    scene.add(characterGroup);

    // Character Mesh with Double-Sided Curvature & Materials
    const charGeo = new THREE.PlaneGeometry(1.75, 3.1, 16, 16);

    const charFrontMat = new THREE.MeshStandardMaterial({
      map: frontTex,
      transparent: true,
      opacity: 0,
      roughness: 0.65,
      metalness: 0.15,
      side: THREE.FrontSide,
    });

    const charBackMat = new THREE.MeshStandardMaterial({
      map: backTex,
      transparent: true,
      opacity: 0,
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.BackSide,
    });

    const frontMesh = new THREE.Mesh(charGeo, charFrontMat);
    const backMesh = new THREE.Mesh(charGeo, charBackMat);
    characterGroup.add(frontMesh);
    characterGroup.add(backMesh);

    // Background Architectural Light Pillars (from Storyboard Shot 06 & 09)
    const pillarGroup = new THREE.Group();
    scene.add(pillarGroup);

    const pillarGeo = new THREE.BoxGeometry(0.08, 9, 0.08);
    const pillarMat = new THREE.MeshBasicMaterial({
      color: 0xc06a4b,
      transparent: true,
      opacity: 0,
    });

    const pillarPositions = [-3.8, -2.2, 2.2, 3.8];
    pillarPositions.forEach((px) => {
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(px, 1.5, -2.8);
      pillarGroup.add(pillar);
    });

    // 5. Mouse Parallax Handler
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 6. Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 7. Master Timeline Execution Loop (60 FPS requestAnimationFrame)
    let elapsedVirtualSeconds = 0;
    let lastTimestamp = performance.now();

    const animate = (timestamp: number) => {
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      elapsedVirtualSeconds += delta * skipSpeedRef.current;
      const t = Math.min(elapsedVirtualSeconds / totalDurationRef.current, 1.0);
      setProgress(t);

      // Smooth mouse lerping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      // -------------------------------------------------------------
      // MASTER CHOREOGRAPHY INTERPOLATION (Continuous, no snapping)
      // -------------------------------------------------------------
      const sec = elapsedVirtualSeconds;

      // Subtle breathing motion for character
      const breath = Math.sin(sec * 1.8) * 0.012;
      characterGroup.position.y = breath;

      // SHOT 01 & 02: 0.0s - 2.2s (Black -> Expanding Line -> Text)
      if (sec < 2.2) {
        charFrontMat.opacity = 0;
        charBackMat.opacity = 0;
        particleMat.opacity = Math.max(0, (sec - 1.2) * 0.15);
        backRimLight.intensity = Math.max(0, (sec - 1.0) * 1.2);
        frontKeyLight.intensity = 0;

        // Camera holds steady with subtle float
        camera.position.set(mouseX * 0.1, 1.25 + mouseY * 0.05, 4.6);
        camera.lookAt(0, 1.2, 0);
      }
      // SHOT 03: 2.2s - 3.6s (Back Character Reveal in warm rim light)
      else if (sec >= 2.2 && sec < 3.6) {
        const u = (sec - 2.2) / (3.6 - 2.2); // 0 to 1
        // Smooth emergence of back view
        charBackMat.opacity = THREE.MathUtils.lerp(0.0, 0.95, u);
        charFrontMat.opacity = 0;
        characterGroup.rotation.y = Math.PI; // 180 degrees (Facing away)

        // Back rim light swells warmly
        backRimLight.intensity = THREE.MathUtils.lerp(1.5, 4.5, u);
        frontKeyLight.intensity = 0.2 * u;
        particleMat.opacity = THREE.MathUtils.lerp(0.15, 0.55, u);

        // Camera slowly pushes toward back view
        const camZ = THREE.MathUtils.lerp(4.6, 3.8, u);
        camera.position.set(mouseX * 0.15, 1.25 + mouseY * 0.08, camZ);
        camera.lookAt(0, 1.3, 0);
      }
      // SHOT 04: 3.6s - 4.8s (Continuous turn to side -> 3/4 -> front)
      else if (sec >= 3.6 && sec < 4.8) {
        const u = (sec - 3.6) / (4.8 - 3.6); // 0 to 1
        // Continuous smooth rotation: from PI (180deg) down to 0 (0deg front)
        const rotY = THREE.MathUtils.lerp(Math.PI, 0, Math.sin((u * Math.PI) / 2));
        characterGroup.rotation.y = rotY;

        // Cross-blend back material and front material smoothly
        if (rotY > Math.PI / 2) {
          charBackMat.opacity = 0.95;
          charFrontMat.opacity = Math.max(0, (Math.PI - rotY) / (Math.PI / 2));
        } else {
          charBackMat.opacity = Math.max(0, rotY / (Math.PI / 2));
          charFrontMat.opacity = 1.0;
        }

        // Lighting transitions from back rim to front key light
        backRimLight.intensity = THREE.MathUtils.lerp(4.5, 2.2, u);
        frontKeyLight.intensity = THREE.MathUtils.lerp(0.2, 3.2, u);
        particleMat.opacity = 0.65;

        // Camera orbits smoothly around
        const camX = Math.sin(u * 0.6) * 0.6 + mouseX * 0.2;
        camera.position.set(camX, 1.25 + mouseY * 0.08, 3.6);
        camera.lookAt(0, 1.25, 0);
      }
      // SHOT 05 - 08: 4.8s - 7.8s (Front View + Huge Typography + Roles + Statement)
      else if (sec >= 4.8 && sec < 7.8) {
        const u = (sec - 4.8) / (7.8 - 4.8); // 0 to 1
        characterGroup.rotation.y = Math.sin(sec * 0.5) * 0.03; // Gentle micro-sway
        charFrontMat.opacity = 1.0;
        charBackMat.opacity = 0;

        // Warm studio lighting balances key and rim
        backRimLight.intensity = 2.4;
        frontKeyLight.intensity = 3.6;
        fillLight.intensity = 0.8;
        particleMat.opacity = 0.75;
        pillarMat.opacity = THREE.MathUtils.lerp(0, 0.28, Math.min(1, u * 2));

        // Slow cinematic push-in toward Sathya
        const camZ = THREE.MathUtils.lerp(3.6, 2.95, u);
        camera.position.set(mouseX * 0.25, 1.28 + mouseY * 0.1, camZ);
        camera.lookAt(0, 1.28, 0);
      }
      // SHOT 09 - 10: 7.8s - 9.2s (Transition to existing portfolio hero)
      else {
        const u = Math.min(1.0, (sec - 7.8) / (9.2 - 7.8)); // 0 to 1
        characterGroup.rotation.y = 0;
        charFrontMat.opacity = 1.0;
        charBackMat.opacity = 0;

        // Camera slowly pulls back to reveal the full composition and match hero scale
        const camZ = THREE.MathUtils.lerp(2.95, 4.3, u);
        const camY = THREE.MathUtils.lerp(1.28, 1.15, u);
        camera.position.set(mouseX * 0.15, camY + mouseY * 0.05, camZ);
        camera.lookAt(0, 1.18, 0);

        backRimLight.intensity = THREE.MathUtils.lerp(2.4, 1.6, u);
        frontKeyLight.intensity = THREE.MathUtils.lerp(3.6, 2.0, u);
        pillarMat.opacity = THREE.MathUtils.lerp(0.28, 0.05, u);
      }

      // Rotate particles continuously
      particles.rotation.y = sec * 0.03;
      particles.rotation.x = Math.sin(sec * 0.2) * 0.04;

      renderer.render(scene, camera);

      // Check if timeline completed
      if (t >= 1.0) {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        sessionStorage.setItem('sathya_cinematic_intro_seen', 'true');
        onComplete();
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
      charGeo.dispose();
      charFrontMat.dispose();
      charBackMat.dispose();
      pillarGeo.dispose();
      pillarMat.dispose();
      renderer.dispose();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [onComplete, isReplay]);

  // Derived keyframe milestones for DOM typography layers
  // t is between 0.0 and 1.0 (0s to 9.2s)
  const currentSec = progress * 9.2;

  // Shot 01: 0.0s - 1.4s
  const showShot01 = currentSec >= 0.0 && currentSec < 2.0;
  const shot01Opacity = Math.max(0, Math.min(1, currentSec < 1.4 ? (currentSec - 0.2) * 1.5 : (2.0 - currentSec) * 2));

  // Shot 02: 1.0s - 2.5s (Expanding line + SECURE | BUILD | ANALYZE)
  const showShot02 = currentSec >= 0.9 && currentSec < 2.8;
  const lineExpandProgress = Math.max(0, Math.min(1, (currentSec - 0.9) / 0.8)); // 0% to 100% width
  const wordsOpacity = Math.max(0, Math.min(1, (currentSec - 1.2) * 1.6));

  // Shot 06: 5.2s - 9.0s (Giant SATHYA SAI JS typography behind character)
  const showGiantName = currentSec >= 5.1;
  const giantNameOpacity = Math.max(0, Math.min(1, (currentSec - 5.1) * 1.8));
  const giantNameScale = Math.max(0.96, Math.min(1.05, 1.04 - (currentSec - 5.1) * 0.015));

  // Shot 07: 6.0s - 9.0s (Roles: WEB & APP DEVELOPER / CYBER SECURITY ENGINEER / DATA ANALYST)
  const showRoles = currentSec >= 5.8;
  const rolesOpacity = Math.max(0, Math.min(1, (currentSec - 5.8) * 1.6));

  // Shot 08: 6.8s - 8.9s (Personal Statement: "I build things that work.")
  const showStatement = currentSec >= 6.8 && currentSec < 9.0;
  const statementOpacity = Math.max(0, Math.min(1, currentSec < 8.4 ? (currentSec - 6.8) * 1.8 : (9.0 - currentSec) * 2));

  // Shot 09: 8.0s - 9.2s (Transition: Ambient workspace holographic panels + "Scroll to explore")
  const showTransitionHint = currentSec >= 8.0;
  const transitionHintOpacity = Math.max(0, Math.min(1, (currentSec - 8.0) * 1.5));

  // Overall sequence container fade-out in final 0.4s
  const containerFade = currentSec >= 8.8 ? Math.max(0, (9.2 - currentSec) / 0.4) : 1;

  return (
    <div
      ref={containerRef}
      style={{ opacity: containerFade }}
      className="fixed inset-0 z-50 bg-[#0D0A09] text-[#E8D4C5] overflow-hidden select-none transition-opacity duration-300"
      aria-label="Cinematic Portfolio Opening Sequence"
    >
      {/* 3D WebGL Canvas Layer (Character, Dynamic Lighting, Depth Particles) */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Background Ambience Texture & Dark Vignette */}
      <div
        className="absolute inset-0 z-0 bg-radial from-transparent via-[#0D0A09]/60 to-[#0D0A09] pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle Warm Film Grain Overlay */}
      <div
        className="absolute inset-0 z-20 pointer-events-none opacity-40 mix-blend-overlay"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(192, 106, 75, 0.08) 0%, rgba(13, 10, 9, 0.95) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ========================================================= */}
      {/* STORYBOARD KEYFRAME 01 (0.0s – 1.0s): BLACK SCREEN + TITLE */}
      {/* ========================================================= */}
      {showShot01 && (
        <div
          style={{ opacity: shot01Opacity }}
          className="absolute bottom-10 left-8 sm:bottom-16 sm:left-16 z-30 transition-opacity duration-500"
        >
          <div className="font-serif-editorial text-xl sm:text-2xl text-[#E8D4C5] tracking-tight">
            SATHYA SAI JS
          </div>
          <div className="text-[11px] font-mono-code uppercase tracking-[0.28em] text-[#C7B0A1]/70 mt-1">
            PERSONAL PORTFOLIO
          </div>
          <div className="text-[11px] font-mono-code text-[#A84C35] mt-1 flex items-center gap-2">
            <span>2026</span>
            <span className="w-6 h-[1px] bg-[#A84C35]" />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STORYBOARD KEYFRAME 02 (1.0s – 2.0s): LINE + WORDS       */}
      {/* ========================================================= */}
      {showShot02 && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-6">
          {/* Thin expanding warm-orange line */}
          <div className="relative w-full max-w-2xl flex items-center justify-center">
            <div
              style={{
                width: `${lineExpandProgress * 100}%`,
                boxShadow: '0 0 16px rgba(255, 122, 41, 0.8), 0 0 32px rgba(168, 76, 53, 0.4)',
              }}
              className="h-[1.5px] bg-gradient-to-r from-transparent via-[#ff8c3b] to-transparent transition-all duration-100 ease-out"
            />
            {/* Center flare spark */}
            <div
              style={{
                opacity: lineExpandProgress > 0.1 && lineExpandProgress < 0.95 ? 1 : 0,
                transform: `scale(${lineExpandProgress * 1.5})`,
              }}
              className="absolute w-3 h-3 rounded-full bg-white blur-[2px] transition-all"
            />
          </div>

          {/* Words: SECURE. | BUILD. | ANALYZE. */}
          <div
            style={{ opacity: wordsOpacity }}
            className="mt-6 flex items-center gap-4 sm:gap-8 font-serif-editorial text-sm sm:text-lg tracking-[0.25em] text-[#E8D4C5] transition-opacity duration-300"
          >
            <span className="text-[#E8D4C5]">SECURE.</span>
            <span className="text-[#A84C35]/60 text-xs font-mono-code">|</span>
            <span className="text-[#E8D4C5]">BUILD.</span>
            <span className="text-[#A84C35]/60 text-xs font-mono-code">|</span>
            <span className="text-[#E8D4C5]">ANALYZE.</span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STORYBOARD KEYFRAME 06 (5.2s – 9.0s): GIANT NAME BEHIND   */}
      {/* True 3D Depth Layer: Placed behind the 3D character (z-2) */}
      {/* ========================================================= */}
      {showGiantName && (
        <div
          style={{
            opacity: giantNameOpacity,
            transform: `scale(${giantNameScale}) translate(-50%, -50%)`,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-5 w-full text-center pointer-events-none select-none transition-all duration-300 flex items-center justify-between px-4 sm:px-12 md:px-20"
        >
          {/* Left Word: SATHYA */}
          <h1 className="font-serif-editorial text-7xl sm:text-9xl md:text-[11rem] lg:text-[14rem] font-normal leading-none tracking-[-0.03em] text-[#E8D4C5]/85 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
            SATHYA
          </h1>

          {/* Right Word: SAI JS */}
          <h1 className="font-serif-editorial text-7xl sm:text-9xl md:text-[11rem] lg:text-[14rem] font-normal leading-none tracking-[-0.03em] text-[#E8D4C5]/85 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
            SAI JS
          </h1>
        </div>
      )}

      {/* ========================================================= */}
      {/* STORYBOARD KEYFRAME 07 (6.0s – 9.0s): ROLES AROUND HIM    */}
      {/* ========================================================= */}
      {showRoles && (
        <div
          style={{ opacity: rolesOpacity }}
          className="absolute left-6 sm:left-14 md:left-20 top-1/3 z-25 max-w-xs space-y-4 pointer-events-none transition-opacity duration-500"
        >
          <div className="space-y-1">
            <div className="text-xs sm:text-sm uppercase tracking-[0.2em] font-medium text-[#E8D4C5]">
              WEB & APP DEVELOPER
            </div>
            <div className="w-8 h-[1px] bg-[#A84C35]/60" />
          </div>

          <div className="space-y-1">
            <div className="text-xs sm:text-sm uppercase tracking-[0.2em] font-medium text-[#E8D4C5]">
              CYBER SECURITY ENGINEER
            </div>
            <div className="w-8 h-[1px] bg-[#A84C35]/60" />
          </div>

          <div className="space-y-1">
            <div className="text-xs sm:text-sm uppercase tracking-[0.2em] font-medium text-[#E8D4C5]">
              DATA ANALYST
            </div>
            <div className="w-8 h-[1px] bg-[#A84C35]/60" />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STORYBOARD KEYFRAME 08 (6.8s – 8.8s): PERSONAL STATEMENT */}
      {/* ========================================================= */}
      {showStatement && (
        <div
          style={{ opacity: statementOpacity }}
          className="absolute right-6 sm:right-16 md:right-24 top-1/2 -translate-y-1/2 z-25 max-w-sm pointer-events-none transition-opacity duration-500 text-right sm:text-left"
        >
          <p className="font-serif-reading text-2xl sm:text-3xl md:text-4xl text-[#C06A4B] italic leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            “I build things that work.”
          </p>
          <div className="mt-3 flex items-center justify-end sm:justify-start gap-3">
            <span className="w-8 h-[1px] bg-[#C06A4B]" />
            <span className="text-[11px] font-mono-code uppercase tracking-[0.2em] text-[#C7B0A1]/80">
              Sathya Sai JS
            </span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STORYBOARD KEYFRAME 09 (8.0s – 9.2s): TRANSITION TO HERO */}
      {/* ========================================================= */}
      {showTransitionHint && (
        <div
          style={{ opacity: transitionHintOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-2 transition-opacity duration-300"
        >
          <span className="text-xs font-mono-code uppercase tracking-[0.28em] text-[#C7B0A1]">
            SCROLL TO EXPLORE
          </span>
          <span className="text-sm text-[#A84C35] animate-bounce">∨</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* CINEMATIC HUD CONTROLS (Top-Right: SKIP INTRO & SOUND)   */}
      {/* ========================================================= */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-10 z-40 flex items-center gap-3">
        {/* Optional Sound Ambience Toggle (Silent by default) */}
        <button
          type="button"
          onClick={toggleAudio}
          className="p-2.5 rounded-full bg-[#14100E]/80 border border-[#E8D4C5]/15 text-[#C7B0A1] hover:text-[#E8D4C5] hover:border-[#A84C35] transition-colors cursor-pointer"
          title={isAudioMuted ? 'Unmute cinematic audio' : 'Mute audio'}
          aria-label={isAudioMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-[#A84C35]" />}
        </button>

        {/* Skip Intro Button */}
        <button
          type="button"
          onClick={handleSkip}
          disabled={isSkipping}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#14100E]/85 hover:bg-[#A84C35] border border-[#E8D4C5]/20 hover:border-[#A84C35] text-[#E8D4C5] hover:text-white text-xs font-mono-code uppercase tracking-[0.18em] transition-all cursor-pointer backdrop-blur-sm"
          aria-label="Skip cinematic introduction"
        >
          <span>{isSkipping ? 'Entering...' : 'SKIP INTRO'}</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Bottom Timeline Indicator (Fine hairline progress bar) */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E8D4C5]/10 z-40">
        <div
          style={{ width: `${progress * 100}%` }}
          className="h-full bg-[#A84C35] transition-all duration-75"
        />
      </div>
    </div>
  );
};
