import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';

interface CinematicOpeningSequenceProps {
  onComplete: () => void;
  isReplay?: boolean;
}

const INTRO_DURATION = 9.4;
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const easeInOut = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp01(t);

export const CinematicOpeningSequence: React.FC<CinematicOpeningSequenceProps> = ({
  onComplete,
  isReplay = false,
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const skipRequestedRef = useRef(false);
  const skipStartedAtRef = useRef<number | null>(null);
  const skipFromTimeRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [isSkipping, setIsSkipping] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    if (skipRequestedRef.current || completedRef.current) return;
    skipRequestedRef.current = true;
    setIsSkipping(true);
  }, []);

  const toggleAudio = useCallback(() => {
    if (isAudioMuted) {
      try {
        const AudioContextConstructor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextConstructor) {
          setIsAudioMuted(false);
          return;
        }

        const context = new AudioContextConstructor();
        audioContextRef.current = context;

        const oscillatorA = context.createOscillator();
        const oscillatorB = context.createOscillator();
        const lowPass = context.createBiquadFilter();
        const gain = context.createGain();

        oscillatorA.type = 'sine';
        oscillatorA.frequency.setValueAtTime(55, context.currentTime);
        oscillatorB.type = 'triangle';
        oscillatorB.frequency.setValueAtTime(110, context.currentTime);
        lowPass.type = 'lowpass';
        lowPass.frequency.setValueAtTime(170, context.currentTime);
        gain.gain.setValueAtTime(0.001, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 1.0);

        oscillatorA.connect(lowPass);
        oscillatorB.connect(lowPass);
        lowPass.connect(gain);
        gain.connect(context.destination);
        oscillatorA.start();
        oscillatorB.start();
      } catch {
        // Audio is optional; the visual intro continues without it.
      }
      setIsAudioMuted(false);
      return;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsAudioMuted(true);
  }, [isAudioMuted]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && !isReplay) {
      try {
        sessionStorage.setItem('sathya_cinematic_intro_seen', 'true');
      } catch {
        // Storage can be unavailable in private browsing.
      }
      onCompleteRef.current();
      return;
    }

    const container = canvasContainerRef.current;
    if (!container) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    let renderer: THREE.WebGLRenderer | null = null;
    let rafId = 0;
    let elapsedSeconds = 0;
    let lastTimestamp = 0;
    let lastUiUpdate = 0;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const finish = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      try {
        sessionStorage.setItem('sathya_cinematic_intro_seen', 'true');
      } catch {
        // Storage is optional.
      }
      onCompleteRef.current();
    };

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0a09);
    scene.fog = new THREE.FogExp2(0x0d0a09, 0.025);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / Math.max(1, window.innerHeight),
      0.1,
      100
    );
    camera.position.set(0, 1.2, 4.8);

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: !isMobile,
        powerPreference: 'high-performance',
      });
    } catch {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      finish();
      return;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Warm, restrained studio lighting. The character views are pre-rendered images;
    // lights animate the environment while the views cross-fade to create a turn illusion.
    const ambientLight = new THREE.AmbientLight(0x4b2c20, 0.9);
    scene.add(ambientLight);

    const rimLight = new THREE.PointLight(0xff8a3d, 0, 18);
    rimLight.position.set(0, 2.4, -2.7);
    scene.add(rimLight);

    const keyLight = new THREE.PointLight(0xffb27a, 0, 18);
    keyLight.position.set(2.2, 2.0, 3.5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x7c6257, 0.25, 16);
    fillLight.position.set(-3.0, 1.1, 2.0);
    scene.add(fillLight);

    // Keep the particle count modest so the intro remains smooth on mobile devices.
    const particleCount = isMobile ? 80 : 220;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 13;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 7 + 1.0;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 64;
    particleCanvas.height = 64;
    const particleContext = particleCanvas.getContext('2d');
    if (particleContext) {
      const gradient = particleContext.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 185, 112, 0.95)');
      gradient.addColorStop(0.3, 'rgba(192, 106, 75, 0.45)');
      gradient.addColorStop(1, 'rgba(13, 10, 9, 0)');
      particleContext.fillStyle = gradient;
      particleContext.fillRect(0, 0, 64, 64);
    }

    const particleTexture = new THREE.CanvasTexture(particleCanvas);
    const particleMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.045 : 0.06,
      map: particleTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Three pre-rendered views allow a continuous blended turn without the old
    // "paper-thin plane" effect that happened when a single image rotated edge-on.
    const textureLoader = new THREE.TextureLoader();
    const frontTexture = textureLoader.load('/images/sathya_3d_front.jpg');
    const sideTexture = textureLoader.load('/images/sathya_3d_side.jpg');
    const backTexture = textureLoader.load('/images/sathya_3d_back.jpg');

    [frontTexture, sideTexture, backTexture].forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer?.capabilities.getMaxAnisotropy() ?? 1;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
    });

    const characterGroup = new THREE.Group();
    scene.add(characterGroup);

    const characterGeometry = new THREE.PlaneGeometry(1.82, 3.05, 1, 1);
    const makeViewMaterial = (map: THREE.Texture) =>
      new THREE.MeshBasicMaterial({
        map,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
        toneMapped: false,
      });

    const frontMaterial = makeViewMaterial(frontTexture);
    const sideMaterial = makeViewMaterial(sideTexture);
    const backMaterial = makeViewMaterial(backTexture);

    const frontView = new THREE.Mesh(characterGeometry, frontMaterial);
    const sideView = new THREE.Mesh(characterGeometry, sideMaterial);
    const backView = new THREE.Mesh(characterGeometry, backMaterial);

    frontView.position.z = 0.012;
    sideView.position.z = 0.006;
    backView.position.z = 0;
    frontView.renderOrder = 3;
    sideView.renderOrder = 2;
    backView.renderOrder = 1;

    characterGroup.add(backView, sideView, frontView);
    characterGroup.position.set(0, 0, 0);

    // Fine architectural light pillars create depth without turning this into a HUD.
    const pillarGeometry = new THREE.BoxGeometry(0.055, 8.2, 0.055);
    const pillarMaterial = new THREE.MeshBasicMaterial({
      color: 0xc06a4b,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const pillarGroup = new THREE.Group();
    [-3.9, -2.45, 2.45, 3.9].forEach((x) => {
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
      pillar.position.set(x, 1.2, -2.6);
      pillarGroup.add(pillar);
    });
    scene.add(pillarGroup);

    const handleMouseMove = (event: MouseEvent) => {
      if (reduceMotion || isMobile) return;
      mouse.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const handleResize = () => {
      if (!renderer) return;
      camera.aspect = window.innerWidth / Math.max(1, window.innerHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1 : 1.5));
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleSkip();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    const animate = (timestamp: number) => {
      rafId = window.requestAnimationFrame(animate);

      if (lastTimestamp === 0) lastTimestamp = timestamp;
      const delta = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
      lastTimestamp = timestamp;

      if (skipRequestedRef.current) {
        if (skipStartedAtRef.current === null) {
          skipStartedAtRef.current = timestamp;
          skipFromTimeRef.current = elapsedSeconds;
        }
        const skipProgress = easeInOut((timestamp - skipStartedAtRef.current) / 420);
        elapsedSeconds = lerp(skipFromTimeRef.current, INTRO_DURATION, skipProgress);
      } else {
        elapsedSeconds = Math.min(INTRO_DURATION, elapsedSeconds + delta);
      }

      const sec = elapsedSeconds;
      const normalizedProgress = clamp01(sec / INTRO_DURATION);

      mouse.x += (mouse.targetX - mouse.x) * 0.07;
      mouse.y += (mouse.targetY - mouse.y) * 0.07;

      // 0.0–2.2s: black, line, and words.
      if (sec < 2.2) {
        backMaterial.opacity = 0;
        sideMaterial.opacity = 0;
        frontMaterial.opacity = 0;
        particleMaterial.opacity = clamp01((sec - 1.15) * 0.13);
        rimLight.intensity = Math.max(0, (sec - 1.05) * 1.25);
        keyLight.intensity = 0;
        pillarMaterial.opacity = 0;
      }
      // 2.2–3.6s: back view gradually appears from darkness.
      else if (sec < 3.6) {
        const t = easeInOut((sec - 2.2) / 1.4);
        backMaterial.opacity = lerp(0, 1, t);
        sideMaterial.opacity = 0;
        frontMaterial.opacity = 0;
        particleMaterial.opacity = lerp(0.14, 0.42, t);
        rimLight.intensity = lerp(1.3, 3.2, t);
        keyLight.intensity = lerp(0.1, 0.35, t);
        pillarMaterial.opacity = 0;
      }
      // 3.6–4.8s: smoothly blend back -> side -> front views.
      else if (sec < 4.8) {
        const t = clamp01((sec - 3.6) / 1.2);
        if (t < 0.5) {
          const blend = easeInOut(t * 2);
          backMaterial.opacity = 1 - blend;
          sideMaterial.opacity = blend;
          frontMaterial.opacity = 0;
        } else {
          const blend = easeInOut((t - 0.5) * 2);
          backMaterial.opacity = 0;
          sideMaterial.opacity = 1 - blend;
          frontMaterial.opacity = blend;
        }
        particleMaterial.opacity = 0.5;
        rimLight.intensity = lerp(3.2, 2.0, t);
        keyLight.intensity = lerp(0.35, 2.2, t);
        pillarMaterial.opacity = lerp(0, 0.08, t);
      }
      // 4.8–7.8s: front view, title, and portfolio identity.
      else if (sec < 7.8) {
        const t = easeInOut((sec - 4.8) / 3.0);
        backMaterial.opacity = 0;
        sideMaterial.opacity = 0;
        frontMaterial.opacity = 1;
        particleMaterial.opacity = 0.5;
        rimLight.intensity = 2.1;
        keyLight.intensity = 2.4;
        fillLight.intensity = 0.65;
        pillarMaterial.opacity = lerp(0.08, 0.22, t);
      }
      // 7.8–9.4s: pull back, then let the real portfolio hero take over.
      else {
        const t = easeInOut((sec - 7.8) / 1.6);
        backMaterial.opacity = 0;
        sideMaterial.opacity = 0;
        frontMaterial.opacity = 1;
        particleMaterial.opacity = lerp(0.5, 0.08, t);
        rimLight.intensity = lerp(2.1, 1.0, t);
        keyLight.intensity = lerp(2.4, 1.35, t);
        pillarMaterial.opacity = lerp(0.22, 0.03, t);
      }

      // Keep the image panels front-facing; their cross-fade, camera drift, and
      // lighting create the turn illusion without the collapsing "thin card" look.
      characterGroup.position.y = Math.sin(sec * 1.7) * 0.012;
      characterGroup.position.x = Math.sin(sec * 0.45) * 0.025;

      let cameraZ = 4.8;
      if (sec < 2.2) {
        cameraZ = 4.8;
      } else if (sec < 3.6) {
        cameraZ = lerp(4.8, 4.4, easeInOut((sec - 2.2) / 1.4));
      } else if (sec < 4.8) {
        cameraZ = lerp(4.4, 4.2, easeInOut((sec - 3.6) / 1.2));
      } else if (sec < 7.8) {
        cameraZ = lerp(4.2, 3.75, easeInOut((sec - 4.8) / 3.0));
      } else {
        cameraZ = lerp(3.75, 4.65, easeInOut((sec - 7.8) / 1.6));
      }

      const turnWindow = sec >= 3.6 && sec < 4.8
        ? Math.sin(((sec - 3.6) / 1.2) * Math.PI) * 0.22
        : 0;
      camera.position.set(mouse.x * 0.08 + turnWindow, 1.2 + mouse.y * 0.035, cameraZ);
      camera.lookAt(0, 1.2, 0);

      particles.rotation.y = sec * 0.025;
      particles.rotation.x = Math.sin(sec * 0.18) * 0.025;
      renderer?.render(scene, camera);

      // Update React/DOM overlay at 24 fps. The WebGL scene itself renders every frame.
      // This avoids triggering a full React render on every requestAnimationFrame.
      if (timestamp - lastUiUpdate >= 42 || normalizedProgress >= 1) {
        lastUiUpdate = timestamp;
        setProgress(normalizedProgress);
      }

      if (normalizedProgress >= 1) {
        if (rafId) window.cancelAnimationFrame(rafId);
        finish();
      }
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);

      [frontTexture, sideTexture, backTexture, particleTexture].forEach((texture) => texture.dispose());
      particleGeometry.dispose();
      particleMaterial.dispose();
      characterGeometry.dispose();
      frontMaterial.dispose();
      sideMaterial.dispose();
      backMaterial.dispose();
      pillarGeometry.dispose();
      pillarMaterial.dispose();

      if (renderer) {
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
        renderer.forceContextLoss();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }

      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isReplay, handleSkip]);

  const currentSec = progress * INTRO_DURATION;

  const titleOpacity = clamp01((currentSec - 0.12) / 0.35) * clamp01((2.0 - currentSec) / 0.4);
  const lineProgress = clamp01((currentSec - 0.9) / 0.95);
  const wordsOpacity = clamp01((currentSec - 1.22) / 0.35) * clamp01((2.75 - currentSec) / 0.45);
  const giantNameOpacity = clamp01((currentSec - 4.85) / 0.45) * (currentSec < 8.55 ? 1 : clamp01((9.4 - currentSec) / 0.85));
  const giantNameScale = lerp(1.04, 0.94, clamp01((currentSec - 5.0) / 4.1));
  const rolesOpacity = clamp01((currentSec - 5.75) / 0.5) * (currentSec < 8.65 ? 1 : clamp01((9.2 - currentSec) / 0.55));
  const statementOpacity = clamp01((currentSec - 6.65) / 0.45) * clamp01((8.75 - currentSec) / 0.6);
  const hintOpacity = clamp01((currentSec - 8.15) / 0.45) * clamp01((9.35 - currentSec) / 0.35);
  const containerFade = currentSec >= 8.82 ? clamp01((9.4 - currentSec) / 0.58) : 1;

  return (
    <div
      style={{ opacity: containerFade }}
      className="fixed inset-0 z-[100] overflow-hidden bg-[#0D0A09] text-[#E8D4C5] select-none"
      aria-label="Cinematic portfolio opening sequence"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 42%, rgba(115, 53, 32, 0.22) 0%, rgba(13, 10, 9, 0.35) 40%, #0D0A09 78%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-20 pointer-events-none mix-blend-screen"
        style={{
          opacity: 0.25,
          background:
            'radial-gradient(ellipse at 50% 48%, transparent 25%, rgba(13,10,9,0.75) 100%)',
        }}
        aria-hidden="true"
      />

      {currentSec < 2.2 && (
        <div
          style={{ opacity: titleOpacity }}
          className="absolute bottom-10 left-6 sm:bottom-16 sm:left-16 z-30 pointer-events-none"
        >
          <div className="font-serif-editorial text-xl sm:text-2xl tracking-tight text-[#E8D4C5]">
            SATHYA SAI JS
          </div>
          <div className="mt-1 text-[10px] sm:text-[11px] font-mono-code uppercase tracking-[0.28em] text-[#C7B0A1]/75">
            PERSONAL PORTFOLIO
          </div>
          <div className="mt-2 flex items-center gap-2 text-[10px] font-mono-code text-[#A84C35]">
            <span>2026</span>
            <span className="h-px w-6 bg-[#A84C35]" />
          </div>
        </div>
      )}

      {currentSec >= 0.9 && currentSec < 2.9 && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-5">
          <div className="relative flex w-full max-w-2xl items-center justify-center">
            <div
              style={{
                width: lineProgress * 100 + '%',
                boxShadow: '0 0 12px rgba(192, 106, 75, 0.4)',
              }}
              className="h-px bg-gradient-to-r from-transparent via-[#C06A4B] to-transparent"
            />
            <span
              style={{
                opacity: lineProgress > 0.08 && lineProgress < 0.98 ? 1 : 0,
                transform: 'scale(' + (lineProgress * 1.4) + ')',
              }}
              className="absolute h-2.5 w-2.5 rounded-full bg-[#E8D4C5] blur-[1px]"
            />
          </div>
          <div
            style={{ opacity: wordsOpacity }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8 gap-y-2 text-center font-serif-editorial text-sm sm:text-lg tracking-[0.2em] sm:tracking-[0.25em] text-[#E8D4C5]"
          >
            <span>SECURE.</span>
            <span className="text-xs font-mono-code text-[#A84C35]/70">/</span>
            <span>BUILD.</span>
            <span className="text-xs font-mono-code text-[#A84C35]/70">/</span>
            <span>ANALYZE.</span>
          </div>
        </div>
      )}

      {currentSec >= 4.85 && (
        <div
          style={{
            opacity: giantNameOpacity,
            transform: 'translate(-50%, -50%) scale(' + giantNameScale + ')',
          }}
          className="absolute left-1/2 top-1/2 z-[5] flex w-full items-center justify-between gap-2 px-3 sm:px-10 md:px-16 pointer-events-none"
        >
          <h1 className="font-serif-editorial text-[clamp(3rem,10.5vw,13rem)] font-normal leading-none tracking-[-0.045em] text-[#E8D4C5]/90">
            SATHYA
          </h1>
          <h1 className="font-serif-editorial text-[clamp(3rem,10.5vw,13rem)] font-normal leading-none tracking-[-0.045em] text-[#E8D4C5]/90">
            SAI JS
          </h1>
        </div>
      )}

      {currentSec >= 5.75 && (
        <div
          style={{ opacity: rolesOpacity }}
          className="absolute left-6 sm:left-12 md:left-16 top-[28%] z-30 max-w-[18rem] space-y-4 pointer-events-none"
        >
          {[
            'WEB & APP DEVELOPER',
            'CYBER SECURITY ENGINEER',
            'DATA ANALYST',
          ].map((role) => (
            <div key={role} className="space-y-1.5">
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.2em] font-medium text-[#E8D4C5]">
                {role}
              </div>
              <div className="h-px w-8 bg-[#A84C35]/75" />
            </div>
          ))}
        </div>
      )}

      {currentSec >= 6.65 && currentSec < 9.25 && (
        <div
          style={{ opacity: statementOpacity }}
          className="absolute right-6 sm:right-12 md:right-20 top-[66%] sm:top-1/2 z-30 max-w-xs sm:max-w-sm -translate-y-1/2 text-right pointer-events-none"
        >
          <p className="font-serif-reading text-2xl sm:text-3xl md:text-4xl italic leading-tight text-[#C06A4B] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            “I build things that work.”
          </p>
          <div className="mt-3 flex items-center justify-end gap-3">
            <span className="h-px w-8 bg-[#C06A4B]" />
            <span className="text-[10px] font-mono-code uppercase tracking-[0.2em] text-[#C7B0A1]/80">
              Sathya Sai JS
            </span>
          </div>
        </div>
      )}

      {currentSec >= 8.15 && (
        <div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-9 left-1/2 z-30 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-[10px] sm:text-xs font-mono-code uppercase tracking-[0.25em] text-[#C7B0A1]">
            ENTERING PORTFOLIO
          </span>
          <span className="text-sm text-[#A84C35]">↓</span>
        </div>
      )}

      <div className="absolute right-4 top-4 sm:right-8 sm:top-8 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleAudio}
          className="inline-flex h-10 w-10 items-center justify-center border border-[#E8D4C5]/15 bg-[#14100E]/80 text-[#C7B0A1] transition-colors hover:border-[#A84C35] hover:text-[#E8D4C5]"
          title={isAudioMuted ? 'Enable optional cinematic ambience' : 'Mute cinematic ambience'}
          aria-label={isAudioMuted ? 'Enable audio' : 'Mute audio'}
        >
          {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-[#C06A4B]" />}
        </button>
        <button
          type="button"
          onClick={handleSkip}
          disabled={isSkipping}
          className="inline-flex min-h-10 items-center gap-2 border border-[#E8D4C5]/20 bg-[#14100E]/85 px-3.5 py-2 text-[10px] sm:text-xs font-mono-code uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[#E8D4C5] transition-colors hover:border-[#A84C35] hover:bg-[#A84C35] disabled:opacity-70"
          aria-label="Skip cinematic introduction"
        >
          <span>{isSkipping ? 'Entering…' : 'SKIP INTRO'}</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-40 h-[2px] bg-[#E8D4C5]/10">
        <div
          style={{ width: progress * 100 + '%' }}
          className="h-full bg-[#A84C35]"
        />
      </div>
    </div>
  );
};

export default CinematicOpeningSequence;
