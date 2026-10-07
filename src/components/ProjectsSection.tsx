import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { ProjectCaseStudy } from '../types';

interface ProjectsSectionProps {
  onOpenCaseStudy: (project: ProjectCaseStudy) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onOpenCaseStudy }) => {
  const projects = portfolioData.projects;

  return (
    <section
      id="work"
      className="py-24 sm:py-32 lg:py-40 border-b border-[#E8D4C5]/10 bg-[#0D0A09]"
    >
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        
        {/* Editorial Sub-Index */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8D4C5]/10 text-xs font-mono-code uppercase tracking-[0.2em] text-[#C7B0A1]/80">
          <div className="flex items-center gap-3">
            <span className="text-[#A84C35]">05</span>
            <span className="text-[#E8D4C5]">SELECTED WORK</span>
            <span className="text-[#E8D4C5]/30">/</span>
            <span>PROVEN CASE STUDIES</span>
          </div>
          <span className="hidden sm:inline text-[11px] text-[#C7B0A1]/60">
            ENGINEERING & RESEARCH
          </span>
        </div>

        {/* Section Headline */}
        <div className="pt-12 pb-16 lg:pb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#A84C35] font-semibold block mb-3">
                Portfolio Projects
              </span>
              <h2 className="font-serif-editorial text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#E8D4C5] leading-[0.95] tracking-tight">
                SELECTED<br />
                <span className="italic text-[#C7B0A1]">WORK.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-[#C7B0A1] leading-relaxed font-sans-human">
              Real projects built for educational workflows, vehicular security research, operations data validation, and network threat inspection.
            </p>
          </div>
        </div>

        {/* Magazine-Style Asymmetric Projects Presentation */}
        <div className="space-y-24 sm:space-y-36">
          {projects.map((project, idx) => {
            const isReversed = idx % 2 === 1;

            return (
              <article
                key={project.id}
                className="group border-t border-[#E8D4C5]/10 pt-12 sm:pt-16"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center`}>
                  
                  {/* Large Project Image Container */}
                  <div
                    onClick={() => onOpenCaseStudy(project)}
                    className={`cursor-pointer ${
                      isReversed ? 'lg:col-span-7 lg:order-2' : 'lg:col-span-7 lg:order-1'
                    }`}
                  >
                    <div className="relative overflow-hidden bg-[#14100E] border border-[#E8D4C5]/15 transition-all duration-500 group-hover:border-[#A84C35]/60">
                      
                      {/* Subtle image crop & slow scale on hover */}
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-full object-cover object-center filter contrast-[1.02] brightness-[0.96] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      </div>

                      {/* Quiet project metadata bar */}
                      <div className="p-4 bg-[#14100E] border-t border-[#E8D4C5]/10 flex items-center justify-between text-[11px] font-mono-code text-[#C7B0A1]/80">
                        <span className="uppercase tracking-wider">Plate {project.number}</span>
                        <span className="text-[#A84C35]">{project.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Project Editorial Detail Column */}
                  <div
                    className={`flex flex-col space-y-6 ${
                      isReversed ? 'lg:col-span-5 lg:order-1' : 'lg:col-span-5 lg:order-2'
                    }`}
                  >
                    <div className="flex items-center gap-4 border-b border-[#E8D4C5]/10 pb-4">
                      <span className="font-serif-editorial text-4xl sm:text-5xl text-[#A84C35]">
                        {project.number}
                      </span>
                      <div className="text-xs font-mono-code uppercase tracking-[0.16em] text-[#C7B0A1]/70">
                        {project.subtitle || project.category}
                      </div>
                    </div>

                    <h3 
                      onClick={() => onOpenCaseStudy(project)}
                      className="font-serif-editorial text-3xl sm:text-4xl text-[#E8D4C5] leading-snug tracking-tight hover:text-[#A84C35] transition-colors cursor-pointer"
                    >
                      {project.name}
                    </h3>

                    <div className="text-xs uppercase tracking-[0.18em] text-[#C7B0A1]/90 font-mono-code">
                      {project.tech?.join(' / ') || project.tags.slice(0, 3).join(' / ')}
                    </div>

                    <p className="text-sm sm:text-base text-[#C7B0A1] leading-relaxed font-sans-human">
                      {project.description}
                    </p>

                    {/* Unboxed highlights */}
                    {project.highlights && project.highlights.length > 0 && (
                      <div className="pt-2 border-t border-[#E8D4C5]/10 text-xs text-[#C7B0A1]/80 space-y-1.5 font-sans-human">
                        <p className="italic text-[#E8D4C5]/90">
                          Key outcome: {project.highlights[0]}
                        </p>
                      </div>
                    )}

                    <div className="pt-4 flex items-center gap-6">
                      <button
                        onClick={() => onOpenCaseStudy(project)}
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-[#E8D4C5] group-hover:text-[#A84C35] transition-colors py-2"
                      >
                        <span>View Project</span>
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </button>

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs uppercase tracking-[0.16em] text-[#C7B0A1]/70 hover:text-[#E8D4C5] transition-colors"
                        >
                          Repository ↗
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};
