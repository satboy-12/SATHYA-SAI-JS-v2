import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Radio } from 'lucide-react';
import { useLenisScroll } from '../context/SmoothScrollProvider';

export const AudioController: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.35);
  const { scrollState } = useLenisScroll();
  const prevSectionRef = useRef<string>(scrollState.activeSection);

  // Web Audio API internal nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const droneOsc1Ref = useRef<OscillatorNode | null>(null);
  const droneOsc2Ref = useRef<OscillatorNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Initialize and play ambient laboratory hum
  const startAudio = async () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // 1. Master Gain Node
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 1.2);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // 2. Low-Pass Resonant Filter for Cinematic Sub-Hum
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);
      filter.Q.setValueAtTime(3.2, ctx.currentTime);
      filter.connect(masterGain);
      filterNodeRef.current = filter;

      // 3. Sub-Bass Oscillator 1 (48Hz deep warm fundamental)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(48, ctx.currentTime);
      const osc1Gain = ctx.createGain();
      osc1Gain.gain.setValueAtTime(0.45, ctx.currentTime);
      osc1.connect(osc1Gain);
      osc1Gain.connect(filter);
      osc1.start();
      droneOsc1Ref.current = osc1;

      // 4. Detuned Oscillator 2 (55Hz for slow acoustic phasing beat)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(55.2, ctx.currentTime);
      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc2.connect(osc2Gain);
      osc2Gain.connect(filter);
      osc2.start();
      droneOsc2Ref.current = osc2;

      // 5. Subtle Filtered White Noise for Laboratory Atmosphere
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(280, ctx.currentTime);
      noiseFilter.Q.setValueAtTime(4.0, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.045, ctx.currentTime);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      whiteNoise.start();
      noiseSourceRef.current = whiteNoise;

      setIsPlaying(true);
    } catch {
      // AudioContext policy handled gracefully
      setIsPlaying(false);
    }
  };

  // Gracefully stop ambient hum with smooth fadeout
  const stopAudio = () => {
    if (audioCtxRef.current && masterGainRef.current) {
      const ctx = audioCtxRef.current;
      masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ctx.currentTime);
      masterGainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      setTimeout(() => {
        try {
          droneOsc1Ref.current?.stop();
          droneOsc2Ref.current?.stop();
          noiseSourceRef.current?.stop();
          audioCtxRef.current?.close();
        } catch {
          // Ignored
        }
        audioCtxRef.current = null;
        masterGainRef.current = null;
        setIsPlaying(false);
      }, 650);
    } else {
      setIsPlaying(false);
    }
  };

  // Play subtle mechanical relay click on section transition
  const playMechanicalClick = () => {
    if (!isPlaying || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();

      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(1400, ctx.currentTime);
      clickOsc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.035);

      clickGain.gain.setValueAtTime(0.06, ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);

      clickOsc.start();
      clickOsc.stop(ctx.currentTime + 0.045);
    } catch {
      // Ignored
    }
  };

  // Trigger mechanical click whenever activeSection changes
  useEffect(() => {
    if (scrollState.activeSection !== prevSectionRef.current) {
      if (isPlaying) {
        playMechanicalClick();
      }
      prevSectionRef.current = scrollState.activeSection;
    }
  }, [scrollState.activeSection, isPlaying]);

  const toggleAudio = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-[180] flex items-center gap-2 select-none">
      <button
        onClick={toggleAudio}
        className={`group flex items-center gap-2.5 px-3 py-2 rounded-sm border backdrop-blur-md transition-all duration-300 shadow-lg cursor-pointer ${
          isPlaying
            ? 'bg-[var(--panel)]/90 border-[#ff7a29] text-[var(--txt)] shadow-[0_0_20px_-5px_rgba(255,122,41,0.35)]'
            : 'bg-[var(--panel)]/70 border-[var(--line)] text-[var(--dim)] hover:text-[var(--txt)] hover:border-[var(--line2)]'
        }`}
        title={isPlaying ? 'Mute Laboratory Audio Atmosphere' : 'Unmute Ambient Laboratory Audio (Drone & Mechanical Clicks)'}
        aria-label="Toggle Laboratory Atmosphere Audio"
      >
        {isPlaying ? (
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-[#ff7a29]" />
            {/* Visualizer micro-bars */}
            <span className="flex items-end gap-0.5 h-3 w-3">
              <span className="w-0.5 bg-[#ff7a29] h-full animate-[pulse_0.8s_ease-in-out_infinite]" />
              <span className="w-0.5 bg-[#ff7a29] h-2/3 animate-[pulse_1.1s_ease-in-out_infinite_0.2s]" />
              <span className="w-0.5 bg-[#ff7a29] h-4/5 animate-[pulse_0.9s_ease-in-out_infinite_0.4s]" />
            </span>
          </div>
        ) : (
          <VolumeX className="w-3.5 h-3.5" />
        )}

        <div className="flex items-center gap-1.5 font-mono-code text-[0.62rem] uppercase tracking-wider">
          <span className={isPlaying ? 'text-[#ff7a29]' : 'text-[var(--dim)]'}>
            ATMOSPHERE
          </span>
          <span className="text-[var(--dim)]">//</span>
          <span className={isPlaying ? 'text-[var(--txt)]' : 'text-[var(--dim)]'}>
            {isPlaying ? 'ACTIVE' : 'MUTED'}
          </span>
        </div>
      </button>
    </div>
  );
};
