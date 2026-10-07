import React from 'react';
import { whatIDoData } from '../data/portfolioData';

export const WhatIDoSection: React.FC = () => {
  return (
    <section
      id="what-i-do"
      className="py-24 sm:py-32 lg:py-40 border-b border-[#E8D4C5]/10 bg-[#0D0A09]"
    >
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        
        {/* Editorial Sub-Index */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8D4C5]/10 text-xs font-mono-code uppercase tracking-[0.2em] text-[#C7B0A1]/80">
          <div className="flex items-center gap-3">
            <span className="text-[#A84C35]">03</span>
            <span className="text-[#E8D4C5]">DISCIPLINES</span>
            <span className="text-[#E8D4C5]/30">/</span>
            <span>CORE PRACTICE AREAS</span>
          </div>
          <span className="hidden sm:inline text-[11px] text-[#C7B0A1]/60">
            PRACTICAL EXECUTION
          </span>
        </div>

        {/* Section Headline */}
        <div className="pt-12 pb-16 lg:pb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#A84C35] font-semibold block mb-3">
                Focus Areas
              </span>
              <h2 className="font-serif-editorial text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#E8D4C5] leading-[0.95] tracking-tight">
                WHAT<br />
                <span className="italic text-[#C7B0A1]">I DO.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-[#C7B0A1] leading-relaxed">
              Four complementary areas where I apply engineering principles, solve day-to-day software bottlenecks, and test system defenses.
            </p>
          </div>
        </div>

        {/* 4 Editorial Cards / Editorial Rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {whatIDoData.map((item) => (
            <div
              key={item.number}
              className="group p-8 sm:p-10 bg-[#14100E] border border-[#E8D4C5]/10 hover:border-[#A84C35]/50 transition-colors flex flex-col justify-between space-y-8 relative"
            >
              <div className="space-y-6">
                <div className="flex items-baseline justify-between border-b border-[#E8D4C5]/10 pb-4">
                  <span className="font-serif-editorial text-3xl sm:text-4xl text-[#A84C35]">
                    {item.number}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#C7B0A1]/60 font-mono-code">
                    Discipline
                  </span>
                </div>

                <h3 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl text-[#E8D4C5] tracking-tight group-hover:text-[#E8D4C5] transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm sm:text-base text-[#C7B0A1] leading-relaxed font-sans-human">
                  {item.summary}
                </p>
              </div>

              {/* Zero-Pill Unboxed Metadata with Typographic Separator */}
              <div className="pt-6 border-t border-[#E8D4C5]/10 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#C7B0A1]/80">
                {item.tags.map((tag, idx) => (
                  <React.Fragment key={tag}>
                    <span className="text-[#E8D4C5]/90">{tag}</span>
                    {idx < item.tags.length - 1 && (
                      <span className="text-[#A84C35]" aria-hidden="true">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
