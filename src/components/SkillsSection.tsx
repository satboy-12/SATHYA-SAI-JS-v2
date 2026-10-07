import React from 'react';
import { editorialSkills } from '../data/portfolioData';

export const SkillsSection: React.FC = () => {
  const categories = [
    {
      id: '01',
      title: 'CYBERSECURITY',
      subtitle: 'Defensive & Forensic Foundations',
      items: editorialSkills.cybersecurity
    },
    {
      id: '02',
      title: 'PROGRAMMING',
      subtitle: 'Languages & Systems Logic',
      items: editorialSkills.programming
    },
    {
      id: '03',
      title: 'DEVELOPMENT',
      subtitle: 'Web, App & Frameworks',
      items: editorialSkills.development
    },
    {
      id: '04',
      title: 'DATA',
      subtitle: 'Analytics & Visualization',
      items: editorialSkills.data
    }
  ];

  return (
    <section
      id="skills"
      className="py-24 sm:py-32 lg:py-40 border-b border-[#E8D4C5]/10 bg-[#0D0A09]"
    >
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        
        {/* Editorial Sub-Index */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8D4C5]/10 text-xs font-mono-code uppercase tracking-[0.2em] text-[#C7B0A1]/80">
          <div className="flex items-center gap-3">
            <span className="text-[#A84C35]">04</span>
            <span className="text-[#E8D4C5]">TECHNICAL SPECIFICATIONS</span>
            <span className="text-[#E8D4C5]/30">/</span>
            <span>SKILLS & TOOLING</span>
          </div>
          <span className="hidden sm:inline text-[11px] text-[#C7B0A1]/60">
            SPECIFICATION SHEET
          </span>
        </div>

        {/* Section Headline */}
        <div className="pt-12 pb-16 lg:pb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#A84C35] font-semibold block mb-3">
                Core Stack
              </span>
              <h2 className="font-serif-editorial text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#E8D4C5] leading-[0.95] tracking-tight">
                TECHNICAL<br />
                <span className="italic text-[#C7B0A1]">CAPABILITIES.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-[#C7B0A1] leading-relaxed font-sans-human">
              A curated inventory of programming languages, security assessment methodologies, and analytical tools utilized in my projects and academic coursework.
            </p>
          </div>
        </div>

        {/* Designer's Specification Ledger (Clean 4-Column Grid with Hairline Dividers) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#E8D4C5]/10">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="border-r border-b border-[#E8D4C5]/10 p-8 sm:p-10 bg-[#14100E]/50 flex flex-col justify-between space-y-8"
            >
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono-code text-xs text-[#A84C35]">
                    SEC. {cat.id}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-[#C7B0A1]/50 font-mono-code">
                    {cat.items.length} items
                  </span>
                </div>

                <div>
                  <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#E8D4C5] tracking-tight">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#C7B0A1]/70 mt-1">
                    {cat.subtitle}
                  </p>
                </div>

                {/* Clean Unboxed Skill List (No Pills) */}
                <ul className="pt-4 divide-y divide-[#E8D4C5]/10 list-none p-0 m-0 text-sm text-[#C7B0A1]">
                  {cat.items.map((skill) => (
                    <li
                      key={skill}
                      className="py-2.5 flex items-center justify-between group hover:text-[#E8D4C5] transition-colors"
                    >
                      <span className="font-medium text-[#E8D4C5]/90 group-hover:translate-x-1 transition-transform">
                        {skill}
                      </span>
                      <span className="text-[#A84C35]/50 group-hover:text-[#A84C35] text-xs font-mono-code transition-colors">
                        —
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom footer note */}
              <div className="pt-4 border-t border-[#E8D4C5]/10 text-[11px] font-mono-code text-[#C7B0A1]/50 uppercase tracking-wider">
                Verified in practice
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
