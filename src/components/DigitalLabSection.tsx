import React from 'react';
import { ThreeDLabInspector } from './ThreeDLabInspector';

export const DigitalLabSection: React.FC = () => {
  return (
    <section id="lab" className="py-24 sm:py-32 relative bg-[var(--bg)] border-t border-[var(--line)] overflow-hidden">
      <div className="w-full max-w-[1300px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Section Header */}
        <div className="flex items-baseline gap-4 mb-12 sm:mb-16">
          <span className="font-mono-code text-[0.72rem] text-[#ff7a29] tracking-[0.2em]">02.</span>
          <h2 className="font-disp font-bold text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-[var(--txt)]">
            Digital Engineering Laboratory
          </h2>
          <span className="flex-1 h-[1px] bg-[var(--line)] self-center" />
          <span className="hidden sm:inline-block font-mono-code text-[0.72rem] text-[var(--dim)] tracking-[0.2em]">
            INTERACTIVE 3D WEBGL
          </span>
        </div>

        {/* Section Intro Copy */}
        <div className="max-w-3xl mb-10">
          <span className="font-mono-code text-xs uppercase tracking-[0.25em] text-[#ff7a29] block mb-2">
            Real-Time Model Inspection
          </span>
          <p className="text-[var(--mut)] text-base sm:text-lg leading-relaxed">
            Interact with live Three.js 3D representations of my core disciplines. Rotate the geometric models in 360 degrees, toggle wireframe geometries, and switch between Cyber Defense, Software Architecture, and Data Analytics.
          </p>
        </div>

        {/* 3D WebGL Laboratory Inspector */}
        <ThreeDLabInspector />
      </div>
    </section>
  );
};
