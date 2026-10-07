import React from 'react';
import { portfolioData, educationData, certificationsData } from '../data/portfolioData';

export const JourneySection: React.FC = () => {
  const experienceList = portfolioData.experience;

  return (
    <section
      id="experience"
      className="py-24 sm:py-32 lg:py-40 border-b border-[#E8D4C5]/10 bg-[#0D0A09]"
    >
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 space-y-24 sm:space-y-32">
        
        {/* ==================================================
            EXPERIENCE (Printed Editorial Timeline)
           ================================================== */}
        <div>
          {/* Editorial Sub-Index */}
          <div className="flex items-center justify-between pb-6 border-b border-[#E8D4C5]/10 text-xs font-mono-code uppercase tracking-[0.2em] text-[#C7B0A1]/80">
            <div className="flex items-center gap-3">
              <span className="text-[#A84C35]">06</span>
              <span className="text-[#E8D4C5]">EXPERIENCE</span>
              <span className="text-[#E8D4C5]/30">/</span>
              <span>PROFESSIONAL TIMELINE</span>
            </div>
            <span className="hidden sm:inline text-[11px] text-[#C7B0A1]/60">
              CHRONOLOGY
            </span>
          </div>

          {/* Section Headline */}
          <div className="pt-12 pb-14">
            <h2 className="font-serif-editorial text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#E8D4C5] leading-[0.95] tracking-tight">
              EXPERIENCE.
            </h2>
            <p className="max-w-xl text-sm sm:text-base text-[#C7B0A1] mt-4 leading-relaxed font-sans-human">
              Hands-on industry positions in application development, technical training mentorship, and security testing.
            </p>
          </div>

          {/* Printed Editorial Timeline: Large Years + Thin Vertical Lines */}
          <div className="relative border-l border-[#E8D4C5]/15 ml-4 sm:ml-8 pl-8 sm:pl-12 lg:pl-16 space-y-14 sm:space-y-18">
            {experienceList.map((exp, idx) => (
              <div key={idx} className="relative group">
                
                {/* Thin tick node on vertical line */}
                <div 
                  className={`absolute -left-[calc(2rem+4.5px)] sm:-left-[calc(3rem+4.5px)] lg:-left-[calc(4rem+4.5px)] top-3 w-2 h-2 rounded-full border ${
                    exp.active 
                      ? 'bg-[#A84C35] border-[#A84C35]' 
                      : 'bg-[#0D0A09] border-[#E8D4C5]/40 group-hover:border-[#A84C35]'
                  } transition-colors`}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
                  
                  {/* Large Editorial Year */}
                  <div className="lg:col-span-4">
                    <span className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl text-[#E8D4C5] tracking-tight block">
                      {exp.year}
                    </span>
                    <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#A84C35] mt-1 block">
                      {exp.active ? 'Active Role' : 'Completed Milestone'}
                    </span>
                  </div>

                  {/* Company & Role Details */}
                  <div className="lg:col-span-8 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-[#E8D4C5]/10 pb-3">
                      <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#E8D4C5] tracking-tight">
                        {exp.title}
                      </h3>
                      <span className="text-xs uppercase tracking-[0.16em] text-[#C7B0A1]/80 font-mono-code">
                        {exp.subtitle}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-[#C7B0A1] leading-relaxed font-sans-human max-w-2xl">
                      {exp.description || exp.desc}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==================================================
            EDUCATION & CERTIFICATIONS (Split Editorial Ledger)
           ================================================== */}
        <div id="education" className="pt-8 border-t border-[#E8D4C5]/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Column: Education */}
            <div className="lg:col-span-7 space-y-8">
              <div className="border-b border-[#E8D4C5]/10 pb-4">
                <span className="font-mono-code text-xs text-[#A84C35] block mb-1">
                  SEC. 07 / ACADEMIC BACKGROUND
                </span>
                <h3 className="font-serif-editorial text-4xl sm:text-5xl text-[#E8D4C5] tracking-tight">
                  EDUCATION.
                </h3>
              </div>

              <div className="space-y-8">
                {educationData.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-6 sm:p-8 bg-[#14100E] border border-[#E8D4C5]/10 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E8D4C5]/10 pb-3">
                      <h4 className="font-serif-editorial text-xl sm:text-2xl text-[#E8D4C5] tracking-tight">
                        {edu.degree}
                      </h4>
                      <span className="font-mono-code text-xs text-[#A84C35]">
                        {edu.period}
                      </span>
                    </div>

                    <div className="text-xs uppercase tracking-[0.16em] text-[#C7B0A1]/90 font-mono-code">
                      {edu.institution}
                    </div>

                    <p className="text-xs sm:text-sm text-[#C7B0A1] leading-relaxed font-sans-human">
                      {edu.scoreOrDetail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Certifications */}
            <div id="certifications" className="lg:col-span-5 space-y-8">
              <div className="border-b border-[#E8D4C5]/10 pb-4">
                <span className="font-mono-code text-xs text-[#A84C35] block mb-1">
                  SEC. 08 / ACCREDITATIONS
                </span>
                <h3 className="font-serif-editorial text-4xl sm:text-5xl text-[#E8D4C5] tracking-tight">
                  CERTIFICATIONS.
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#C7B0A1] leading-relaxed">
                Formal credentialing in business intelligence, core analytics, secure Python programming, and security principles.
              </p>

              {/* Small Editorial Labels / Clean Ledger (No Colorful Certificate Cards) */}
              <div className="divide-y divide-[#E8D4C5]/10 border-t border-b border-[#E8D4C5]/10">
                {certificationsData.map((cert, idx) => (
                  <div key={idx} className="py-4 space-y-1">
                    <div className="flex items-baseline justify-between">
                      <h5 className="font-serif-editorial text-lg sm:text-xl text-[#E8D4C5]">
                        {cert.name}
                      </h5>
                      <span className="font-mono-code text-[11px] text-[#A84C35]">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-[#C7B0A1]/70 font-sans-human">
                      {cert.focus}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-[#14100E]/40 border border-[#E8D4C5]/10 text-xs text-[#C7B0A1] font-mono-code">
                <span>Verification credentials available upon direct inquiry.</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
