import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';

interface CinematicOpeningSequenceProps {
  onComplete: () => void;
  isReplay?: boolean;
}

const INTRO_DURATION = 9.4;
const PORTRAIT_SRC = '/images/sathya-portfolio-photo.jpg';

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
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const skipRequestedRef = useRef(false);
  const skipStartedAtRef = useRef<number | null>(null);
  const skipFromTimeRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
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
        gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 1);

        oscillatorA.connect(lowPass);
        oscillatorB.connect(lowPass);
        lowPass.connect(gain);
        gain.connect(context.destination);
        oscillatorA.start();
        oscillatorB.start();
        setIsAudioMuted(false);
      } catch {
        // Audio is optional; the visual intro continues without it.
      }
      return;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsAudioMuted(true);
  }, [isAudioMuted]);

  useEffect(() => {
    if (!isLoaded) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && !isReplay) {
      onCompleteRef.current();
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    let rafId = 0;
    let elapsedSeconds = 0;
    let lastTimestamp = 0;
    let lastUiUpdate = 0;
    let isDisposed = false;

    const finish = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      onCompleteRef.current();
    };

    const animate = (timestamp: number) => {
      if (isDisposed) return;
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

      const normalizedProgress = clamp01(elapsedSeconds / INTRO_DURATION);
      if (timestamp - lastUiUpdate >= 42 || normalizedProgress >= 1) {
        lastUiUpdate = timestamp;
        setProgress(normalizedProgress);
      }

      if (normalizedProgress >= 1) {
        window.cancelAnimationFrame(rafId);
        finish();
      }
    };

    rafId = window.requestAnimationFrame(animate);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      isDisposed = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', handleKeyDown);
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isLoaded, isReplay, handleSkip]);

  const currentSec = progress * INTRO_DURATION;
  const titleOpacity = clamp01((currentSec - 0.12) / 0.35) * clamp01((2.0 - currentSec) / 0.4);
  const lineProgress = clamp01((currentSec - 0.82) / 0.95);
  const wordsOpacity = clamp01((currentSec - 1.22) / 0.35) * clamp01((2.75 - currentSec) / 0.45);
  const portraitReveal =
    clamp01((currentSec - 1.85) / 1.15) *
    (currentSec < 8.75 ? 1 : clamp01((9.4 - currentSec) / 0.65));
  const portraitScale =
    currentSec < 4.8
      ? lerp(1.035, 1, clamp01((currentSec - 1.85) / 2.95))
      : currentSec < 7.8
        ? lerp(1, 1.045, (currentSec - 4.8) / 3)
        : lerp(1.045, 1.015, (currentSec - 7.8) / 1.6);
  const portraitShiftX = currentSec < 3.1 ? lerp(5, 0, (currentSec - 1.85) / 1.25) : 0;
  const giantNameOpacity =
    clamp01((currentSec - 4.7) / 0.55) *
    (currentSec < 8.55 ? 1 : clamp01((9.4 - currentSec) / 0.85));
  const giantNameScale = lerp(1.04, 0.94, clamp01((currentSec - 5) / 4.1));
  const rolesOpacity =
    clamp01((currentSec - 5.45) / 0.5) *
    (currentSec < 8.65 ? 1 : clamp01((9.2 - currentSec) / 0.55));
  const statementOpacity =
    clamp01((currentSec - 6.45) / 0.45) * clamp01((8.75 - currentSec) / 0.6);
  const hintOpacity =
    clamp01((currentSec - 8.15) / 0.45) * clamp01((9.35 - currentSec) / 0.35);
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
        className="absolute inset-0 z-0 scale-110 pointer-events-none"
        style={{
          backgroundImage: `url("${PORTRAIT_SRC}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 23%',
          filter: 'blur(26px) saturate(0.75)',
          opacity: 0.26,
          transform: 'scale(1.12)',
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 72% 38%, rgba(110,68,47,0.12) 0%, rgba(13,10,9,0.12) 32%, rgba(13,10,9,0.84) 100%), linear-gradient(90deg, rgba(13,10,9,0.98) 0%, rgba(13,10,9,0.82) 28%, rgba(13,10,9,0.32) 58%, rgba(13,10,9,0.20) 100%), linear-gradient(0deg, rgba(13,10,9,0.82) 0%, transparent 42%, rgba(13,10,9,0.38) 100%)',
        }}
        aria-hidden="true"
      />

      <img
        src={PORTRAIT_SRC}
        alt="Sathya Sai JS"
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
        draggable={false}
        className="absolute inset-y-0 right-0 z-10 h-full w-full object-cover object-[50%_18%] sm:w-[62vw] sm:object-cover md:w-[58vw] md:max-w-[920px] md:object-[50%_20%] pointer-events-none"
        style={{
          opacity: portraitReveal,
          transform: `translateX(${portraitShiftX}%) scale(${portraitScale})`,
          transformOrigin: 'center center',
          maskImage:
            'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.55) 12%, black 29%, black 84%, rgba(0,0,0,0.8) 100%)',
          WebkitMaskImage:
            'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.55) 12%, black 29%, black 84%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      <div
        className="absolute inset-0 z-[11] pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(13,10,9,0.48) 0%, rgba(13,10,9,0.14) 39%, transparent 68%), linear-gradient(0deg, rgba(13,10,9,0.55) 0%, transparent 36%, transparent 82%, rgba(13,10,9,0.18) 100%)',
          opacity: 0.72,
        }}
        aria-hidden="true"
      />

      {!isLoaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#0D0A09]">
          <div className="font-serif-editorial text-xl sm:text-2xl tracking-tight text-[#E8D4C5]">
            SATHYA SAI JS
          </div>
          <div className="text-[10px] font-mono-code uppercase tracking-[0.28em] text-[#A84C35]">
            PREPARING THE EXPERIENCE
          </div>
          <div className="h-px w-40 overflow-hidden bg-[#E8D4C5]/10">
            <div className="h-full w-1/3 animate-pulse bg-[#C06A4B]" />
          </div>
        </div>
      )}

      <div
        className="absolute inset-0 z-[12] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 48%, transparent 23%, rgba(13,10,9,0.22) 70%, rgba(13,10,9,0.72) 100%)',
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

      {currentSec >= 0.82 && currentSec < 2.9 && (
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
                transform: 'scale(' + lineProgress * 1.4 + ')',
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

      {currentSec >= 4.7 && (
        <div
          style={{
            opacity: giantNameOpacity,
            transform: 'translate(-50%, -50%) scale(' + giantNameScale + ')',
          }}
          className="absolute left-1/2 top-1/2 z-[20] flex w-full items-center justify-between gap-2 px-4 sm:px-10 md:px-16 pointer-events-none"
        >
          <h1 className="font-serif-editorial text-[clamp(2.35rem,7.4vw,10rem)] font-normal leading-none tracking-[-0.045em] text-[#E8D4C5]/90">
            SATHYA
          </h1>
          <h1 className="font-serif-editorial text-[clamp(2.35rem,7.4vw,10rem)] font-normal leading-none tracking-[-0.045em] text-[#E8D4C5]/90">
            SAI JS
          </h1>
        </div>
      )}

      {currentSec >= 5.45 && (
        <div
          style={{ opacity: rolesOpacity }}
          className="absolute left-6 sm:left-12 md:left-16 top-[28%] z-30 max-w-[18rem] space-y-4 pointer-events-none"
        >
          {['WEB & APP DEVELOPER', 'CYBER SECURITY ENGINEER', 'DATA ANALYST'].map((role) => (
            <div key={role} className="space-y-1.5">
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.2em] font-medium text-[#E8D4C5]">
                {role}
              </div>
              <div className="h-px w-8 bg-[#A84C35]/75" />
            </div>
          ))}
        </div>
      )}

      {currentSec >= 6.45 && currentSec < 9.25 && (
        <div
          style={{ opacity: statementOpacity }}
          className="absolute left-6 right-6 sm:left-12 sm:right-auto md:left-20 top-[72%] sm:top-1/2 z-30 max-w-xs sm:max-w-sm -translate-y-1/2 pointer-events-none"
        >
          <p className="font-serif-reading text-2xl sm:text-3xl md:text-4xl italic leading-tight text-[#C06A4B] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            “I build things that work.”
          </p>
          <div className="mt-3 flex items-center gap-3">
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
        <div style={{ width: progress * 100 + '%' }} className="h-full bg-[#A84C35]" />
      </div>
    </div>
  );
};

export default CinematicOpeningSequence;
