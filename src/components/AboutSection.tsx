import React from 'react';
import { portfolioData } from '../data/portfolioData';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="py-24 sm:py-32 lg:py-40 border-b border-[#E8D4C5]/10 bg-[#0D0A09] relative"
    >
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        
        {/* Editorial Sub-Index Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8D4C5]/10 text-xs font-mono-code uppercase tracking-[0.2em] text-[#C7B0A1]/80">
          <div className="flex items-center gap-3">
            <span className="text-[#A84C35]">02</span>
            <span className="text-[#E8D4C5]">ABOUT ME</span>
            <span className="text-[#E8D4C5]/30">/</span>
            <span>BACKGROUND & INTENTION</span>
          </div>
          <span className="hidden sm:inline text-[11px] text-[#C7B0A1]/60">
            PERSONAL STORY
          </span>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-12 lg:pt-16 items-start">
          
          {/* Left Column: Secondary Real Photo & Quick Personal Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative">
              {/* Thin hairline accent border */}
              <div 
                className="absolute inset-0 border border-[#A84C35]/30 -translate-x-3 -translate-y-3 pointer-events-none" 
                aria-hidden="true" 
              />
              <div className="relative bg-[#14100E] border border-[#E8D4C5]/15 overflow-hidden">
                <img
                  src="/images/sathya-image-1.jpg"
                  alt="Sathya Sai JS in personal setting"
                  className="w-full h-auto aspect-[3/4] object-cover filter contrast-[1.02] brightness-[0.98]"
                  loading="lazy"
                />
                <div className="p-4 bg-[#14100E] border-t border-[#E8D4C5]/10 flex items-center justify-between text-[11px] font-mono-code text-[#C7B0A1]">
                  <span>Fig. 02 — Personal Portrait</span>
                  <span>Tamil Nadu, India</span>
                </div>
              </div>
            </div>

            {/* Quiet personal notes ledger */}
            <div className="border border-[#E8D4C5]/10 p-6 bg-[#14100E]/40 space-y-4">
              <h4 className="text-xs uppercase tracking-[0.2em] text-[#A84C35] font-semibold">
                Quick Facts
              </h4>
              <div className="space-y-3 text-xs text-[#C7B0A1] divide-y divide-[#E8D4C5]/10">
                <div className="pt-2 flex justify-between">
                  <span className="text-[#C7B0A1]/70">Degree</span>
                  <span className="text-[#E8D4C5] font-medium text-right">B.E. Cyber Security (2024–2027)</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-[#C7B0A1]/70">Institution</span>
                  <span className="text-[#E8D4C5] font-medium text-right">Sri Ram Engineering College</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-[#C7B0A1]/70">Prior Diploma</span>
                  <span className="text-[#E8D4C5] font-medium text-right">ECE, CPCL Polytechnic (86%)</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-[#C7B0A1]/70">Location</span>
                  <span className="text-[#E8D4C5] font-medium text-right">Chennai, Tamil Nadu</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-[#C7B0A1]/70">Key Interests</span>
                  <span className="text-[#E8D4C5] font-medium text-right">Application Security, Web Dev, BI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Grounded Human Narrative */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#A84C35] font-semibold block mb-3">
                Overview & Perspective
              </span>
              <h2 className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl text-[#E8D4C5] leading-[1.05] tracking-tight">
                “I enjoy building practical digital products, working with technology, and understanding how systems can be made more secure and useful.”
              </h2>
            </div>

            <div className="space-y-6 text-[#C7B0A1] text-base sm:text-lg leading-relaxed font-sans-human">
              <p>
                I am a student and engineer based in Chennai, currently completing my Bachelor of Engineering in Cyber Security at Sri Ram Engineering College. Prior to this, I completed a three-year Diploma in Electronics and Communication Engineering at CPCL Polytechnic College with an 86% grade, which gave me an early foundation in hardware architectures, digital circuits, and communication protocols.
              </p>

              <p>
                My work spans three interconnected disciplines: building accessible web and mobile applications, assessing software and network defenses against threats, and transforming messy datasets into clear analytical reports that stakeholders can actually act on.
              </p>

              <p>
                Rather than treating security as an afterthought or building software in a silo, I prefer designing tools that are secure from the very start. I believe good engineering is not about complex buzzwords; it is about building software that solves a real operational problem, holds up under rigorous testing, and remains understandable to the people who maintain it.
              </p>
            </div>

            {/* Core Tenets (Human, Not Corporate) */}
            <div className="pt-6 border-t border-[#E8D4C5]/10 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <span className="font-mono-code text-xs text-[#A84C35]">01 / Continuous Learning</span>
                <h4 className="font-serif-editorial text-2xl text-[#E8D4C5]">Hands-On Experimentation</h4>
                <p className="text-xs sm:text-sm text-[#C7B0A1] leading-relaxed">
                  I learn best by building real tools — from educational triage dashboards to simulated packet capture labs.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-mono-code text-xs text-[#A84C35]">02 / Defense-In-Depth</span>
                <h4 className="font-serif-editorial text-2xl text-[#E8D4C5]">Security by Design</h4>
                <p className="text-xs sm:text-sm text-[#C7B0A1] leading-relaxed">
                  Finding system vulnerabilities early and validating threat vectors before malicious actors exploit them.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
