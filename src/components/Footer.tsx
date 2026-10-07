import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-16 sm:py-20 bg-[#0D0A09] border-t border-[#E8D4C5]/10 text-[#C7B0A1]">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 pb-12 border-b border-[#E8D4C5]/10">
          
          {/* Brand & Roles */}
          <div className="space-y-3">
            <h3 className="font-serif-editorial text-3xl sm:text-4xl text-[#E8D4C5] tracking-tight">
              SATHYA SAI JS
            </h3>
            <div className="text-xs uppercase tracking-[0.16em] text-[#C7B0A1]/80 space-y-1 font-mono-code">
              <div>Web & App Developer</div>
              <div>Cyber Security Engineer</div>
              <div>Data Analyst</div>
            </div>
          </div>

          {/* Back to top action */}
          <button
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#C7B0A1] hover:text-[#E8D4C5] transition-colors font-mono-code"
          >
            <span>Back to top</span>
            <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform text-[#A84C35]" />
          </button>
        </div>

        {/* Copyright notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-[#C7B0A1]/60">
          <p>© 2026 SATHYA SAI JS. All rights reserved.</p>
          <p className="text-[11px]">Handcrafted Editorial Portfolio · Designed with Intention</p>
        </div>
      </div>
    </footer>
  );
};
