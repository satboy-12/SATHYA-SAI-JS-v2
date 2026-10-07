import React from 'react';
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface HeroSectionProps {
  onOpenResume: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenResume }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] lg:min-h-screen pt-28 sm:pt-32 lg:pt-36 pb-16 lg:pb-24 flex flex-col justify-between border-b border-[#E8D4C5]/10 overflow-hidden"
    >
      <div className="max-w-[1320px] w-full mx-auto px-6 sm:px-10 flex-1 flex flex-col justify-between">
        
        {/* Top Editorial Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8D4C5]/10 text-xs text-[#C7B0A1]/80">
          <div className="flex items-center gap-3">
            <span className="font-mono-code text-[#A84C35] text-[11px]">01</span>
            <span className="uppercase tracking-[0.2em] font-medium text-[#E8D4C5]">
              SATHYA SAI JS
            </span>
            <span className="text-[#E8D4C5]/30">/</span>
            <span className="uppercase tracking-[0.16em] text-[11px] text-[#C7B0A1]/80">
              Personal Portfolio
            </span>
          </div>

          <div className="flex items-center gap-6 uppercase tracking-[0.18em] text-[11px] font-mono-code">
            <span>Chennai, India</span>
            <span className="text-[#E8D4C5]/30">·</span>
            <span className="text-[#A84C35]">Available for 2026 roles</span>
          </div>
        </div>

        {/* Central Asymmetrical Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 my-auto py-10 lg:py-16 items-center">
          
          {/* Left Column: Big Headline & Human Story */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            
            {/* Small Disciplines Label */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs uppercase tracking-[0.2em] text-[#C7B0A1]">
              <span className="text-[#E8D4C5]">Web & App Developer</span>
              <span className="text-[#A84C35]">/</span>
              <span className="text-[#E8D4C5]">Cyber Security Engineer</span>
              <span className="text-[#A84C35]">/</span>
              <span className="text-[#E8D4C5]">Data Analyst</span>
            </div>

            {/* Giant Elegant Serif Headline */}
            <div className="space-y-1">
              <h1 className="font-serif-editorial text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-[0.88] tracking-[-0.02em] text-[#E8D4C5]">
                SATHYA
              </h1>
              <div className="flex items-baseline gap-4 sm:gap-6">
                <h1 className="font-serif-editorial text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-[0.88] tracking-[-0.02em] text-[#E8D4C5]">
                  SAI JS
                </h1>
                <span className="font-serif-editorial italic text-3xl sm:text-4xl md:text-5xl text-[#A84C35] font-normal">
                  — portfolio
                </span>
              </div>
            </div>

            {/* Grounded Human Copy */}
            <div className="max-w-xl space-y-4 pt-2">
              <p className="font-serif-reading text-xl sm:text-2xl text-[#E8D4C5] leading-relaxed italic">
                “Hi, I'm Sathya.
                I build web and mobile experiences, work with cybersecurity, and turn data into useful insights.”
              </p>
              <p className="text-sm sm:text-base text-[#C7B0A1] leading-relaxed">
                Currently an engineering student at Sri Ram Engineering College with hands-on practice across application security, automation scripts, and analytical dashboards. I believe in writing clear code, testing for real-world vulnerabilities, and building systems that are simple and dependable.
              </p>
            </div>

            {/* Intentional Editorial Actions */}
            <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6">
              <a
                href="#work"
                className="inline-flex items-center gap-2.5 px-6 py-3 text-xs uppercase tracking-[0.16em] font-semibold text-[#0D0A09] bg-[#E8D4C5] hover:bg-[#A84C35] hover:text-white transition-colors"
              >
                <span>View Selected Work</span>
                <span aria-hidden="true">↓</span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-medium text-[#E8D4C5] hover:text-[#A84C35] transition-colors py-3"
              >
                <span>Let's talk</span>
                <span aria-hidden="true">→</span>
              </a>

              <button
                onClick={onOpenResume}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#C7B0A1]/80 hover:text-[#E8D4C5] transition-colors py-3"
              >
                <span>Read Dossier</span>
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </div>

          {/* Right Column: Real Photograph with Editorial Framing */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Thin warm frame backdrop offset */}
              <div 
                className="absolute inset-0 border border-[#A84C35]/40 translate-x-3 translate-y-3 pointer-events-none" 
                aria-hidden="true"
              />

              {/* Real Portrait Container */}
              <div className="relative bg-[#14100E] border border-[#E8D4C5]/15 overflow-hidden">
                <img
                  src="/images/sathya-portfolio-photo.jpg"
                  alt="Portrait of Sathya Sai JS, Web & App Developer and Cyber Security Engineer"
                  className="w-full h-auto aspect-[4/5] object-cover object-top filter contrast-[1.03] brightness-[0.98] transition-transform duration-700 hover:scale-[1.02]"
                  loading="eager"
                />

                {/* Quiet caption plate */}
                <div className="p-4 bg-[#14100E] border-t border-[#E8D4C5]/10 flex items-center justify-between text-[11px] font-mono-code text-[#C7B0A1]/80">
                  <span className="uppercase tracking-wider">Fig. 01 — Sathya Sai JS</span>
                  <span className="text-[#A84C35]">Chennai, TN</span>
                </div>
              </div>

              {/* Real Quick Links underneath portrait */}
              <div className="mt-4 flex items-center justify-between px-1 text-xs text-[#C7B0A1]">
                <span className="text-[11px] uppercase tracking-[0.16em]">Direct channels</span>
                <div className="flex items-center gap-4">
                  <a
                    href="https://github.com/satboy-12"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#E8D4C5] transition-colors flex items-center gap-1"
                    aria-label="GitHub profile"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight size={12} />
                  </a>
                  <a
                    href="https://linkedin.com/in/sathyasaijs"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#E8D4C5] transition-colors flex items-center gap-1"
                    aria-label="LinkedIn profile"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight size={12} />
                  </a>
                  <a
                    href="mailto:sathyasaijs12@gmail.com"
                    className="hover:text-[#E8D4C5] transition-colors flex items-center gap-1"
                    aria-label="Email address"
                  >
                    <span>Email</span>
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Bar: Natural Rhythm Index */}
        <div className="pt-6 border-t border-[#E8D4C5]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#C7B0A1]/80">
          <div className="flex items-center gap-4">
            <span className="uppercase tracking-[0.16em]">Practice Focus</span>
            <span className="text-[#E8D4C5]/30">/</span>
            <span className="text-[#E8D4C5]">Zero-Trust Security</span>
            <span className="text-[#E8D4C5]/30">·</span>
            <span className="text-[#E8D4C5]">Web Engineering</span>
            <span className="text-[#E8D4C5]/30">·</span>
            <span className="text-[#E8D4C5]">Power BI Dashboards</span>
          </div>

          <a
            href="#about"
            className="group flex items-center gap-2 uppercase tracking-[0.16em] text-xs text-[#C7B0A1] hover:text-[#E8D4C5] transition-colors"
          >
            <span>Read About Me</span>
            <ArrowDown size={13} className="group-hover:translate-y-0.5 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
};
