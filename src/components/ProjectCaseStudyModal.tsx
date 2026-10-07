import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Github } from 'lucide-react';
import { ProjectCaseStudy } from '../types';

interface ProjectCaseStudyModalProps {
  project: ProjectCaseStudy | null;
  onClose: () => void;
}

export const ProjectCaseStudyModal: React.FC<ProjectCaseStudyModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0D0A09]/90 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#14100E] border border-[#E8D4C5]/20 p-6 sm:p-10 lg:p-12 z-10 space-y-8 my-auto text-[#E8D4C5]"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8D4C5]/10 text-xs font-mono-code text-[#C7B0A1]/80">
            <div className="flex items-center gap-3">
              <span className="font-serif-editorial text-2xl text-[#A84C35]">{project.number}</span>
              <span className="text-[#E8D4C5]/30">/</span>
              <span className="uppercase tracking-[0.16em] text-[#E8D4C5]">{project.category}</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 border border-[#E8D4C5]/15 text-[#C7B0A1] hover:text-[#E8D4C5] hover:border-[#A84C35] transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Title & Headline */}
          <div className="space-y-3">
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl text-[#E8D4C5] leading-tight tracking-tight">
              {project.name}
            </h2>
            <div className="text-xs uppercase tracking-[0.18em] text-[#C7B0A1] font-mono-code">
              {project.tech?.join(' · ') || project.tags.join(' · ')}
            </div>
          </div>

          {/* Large Real Screenshot */}
          <div className="border border-[#E8D4C5]/15 bg-[#0D0A09] overflow-hidden">
            <img
              src={project.image}
              alt={project.name}
              className="w-full h-auto aspect-[16/9] object-cover object-top"
            />
            <div className="p-3 bg-[#0D0A09] border-t border-[#E8D4C5]/10 flex items-center justify-between text-[11px] font-mono-code text-[#C7B0A1]/70">
              <span>Plate {project.number} — Project Screenshot</span>
              <span>Verified System</span>
            </div>
          </div>

          {/* Case Study Long Description */}
          <div className="space-y-4 text-sm sm:text-base text-[#C7B0A1] leading-relaxed font-sans-human">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#A84C35] font-semibold font-mono-code">
              Architecture & Problem Overview
            </h4>
            <p>
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Key Metrics / Highlights */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b border-[#E8D4C5]/10 py-6">
              {project.metrics.map((m, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-[#C7B0A1]/70 font-mono-code">
                    {m.label}
                  </div>
                  <div className="font-serif-editorial text-2xl text-[#E8D4C5]">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Highlights List */}
          {project.highlights && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-[0.2em] text-[#A84C35] font-semibold font-mono-code">
                Implementation Highlights
              </h4>
              <ul className="space-y-2 text-sm text-[#C7B0A1] list-none p-0 m-0">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-[#A84C35] mt-0.5" aria-hidden="true">—</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-6 border-t border-[#E8D4C5]/10 flex flex-wrap items-center justify-between gap-4">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-[0.16em] font-semibold text-[#0D0A09] bg-[#E8D4C5] hover:bg-[#A84C35] hover:text-white transition-colors"
              >
                <Github size={15} />
                <span>View on GitHub</span>
                <ArrowUpRight size={14} />
              </a>
            ) : <div />}

            <button
              onClick={onClose}
              className="text-xs uppercase tracking-[0.16em] text-[#C7B0A1] hover:text-[#E8D4C5] transition-colors py-2"
            >
              Close Study [ESC]
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
