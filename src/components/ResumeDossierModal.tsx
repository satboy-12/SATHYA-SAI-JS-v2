import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, ArrowUpRight } from 'lucide-react';
import { portfolioData, educationData, certificationsData, editorialSkills } from '../data/portfolioData';

interface ResumeDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeDossierModal: React.FC<ResumeDossierModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

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

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#14100E] border border-[#E8D4C5]/20 p-6 sm:p-10 lg:p-12 z-10 space-y-8 my-auto text-[#E8D4C5]"
        >
          {/* Top Actions Ribbon */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8D4C5]/10 text-xs font-mono-code text-[#C7B0A1]/80">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#A84C35]" />
              <span className="uppercase tracking-[0.18em] text-[#E8D4C5]">
                CURRICULUM VITAE · {portfolioData.fullName}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 border border-[#E8D4C5]/20 text-xs uppercase tracking-wider text-[#E8D4C5] hover:border-[#A84C35] hover:text-[#A84C35] transition-colors flex items-center gap-1.5"
                title="Print or Save as PDF"
              >
                <Printer size={13} />
                <span>Print</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 border border-[#E8D4C5]/20 text-[#C7B0A1] hover:text-[#E8D4C5] hover:border-[#A84C35] transition-colors"
                aria-label="Close dossier"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Header Block */}
          <div className="space-y-4 border-b border-[#E8D4C5]/10 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
              <div>
                <h2 className="font-serif-editorial text-4xl sm:text-5xl text-[#E8D4C5] tracking-tight">
                  {portfolioData.fullName}
                </h2>
                <div className="text-xs uppercase tracking-[0.2em] text-[#A84C35] font-mono-code mt-1">
                  Web & App Developer · Cyber Security Engineer · Data Analyst
                </div>
              </div>

              <div className="text-xs font-mono-code text-[#C7B0A1] space-y-1 sm:text-right">
                <div>{portfolioData.email}</div>
                <div>Chennai, Tamil Nadu, India</div>
                <div>github.com/satboy-12</div>
              </div>
            </div>

            <p className="text-sm text-[#C7B0A1] leading-relaxed max-w-3xl pt-2 font-sans-human">
              {portfolioData.aboutText}
            </p>
          </div>

          {/* Experience Section */}
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#A84C35] font-semibold font-mono-code">
              Professional Experience
            </h3>

            <div className="space-y-6">
              {portfolioData.experience.map((exp, idx) => (
                <div key={idx} className="border-b border-[#E8D4C5]/10 pb-6 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="font-serif-editorial text-xl sm:text-2xl text-[#E8D4C5]">
                      {exp.title}
                    </div>
                    <span className="font-mono-code text-xs text-[#A84C35]">
                      {exp.year}
                    </span>
                  </div>
                  <div className="text-xs uppercase tracking-wider text-[#C7B0A1]/80 font-mono-code">
                    {exp.subtitle}
                  </div>
                  <p className="text-xs sm:text-sm text-[#C7B0A1] leading-relaxed font-sans-human">
                    {exp.description || exp.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#A84C35] font-semibold font-mono-code">
              Education
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {educationData.map((edu, idx) => (
                <div key={idx} className="p-5 bg-[#0D0A09] border border-[#E8D4C5]/10 space-y-2">
                  <div className="font-serif-editorial text-lg text-[#E8D4C5]">
                    {edu.degree}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-[#A84C35] font-mono-code">
                    {edu.institution} ({edu.period})
                  </div>
                  <p className="text-xs text-[#C7B0A1] leading-relaxed">
                    {edu.scoreOrDetail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Certifications Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-[#E8D4C5]/10">
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-[0.2em] text-[#A84C35] font-semibold font-mono-code">
                Technical Stack
              </h4>
              <div className="text-xs text-[#C7B0A1] space-y-2">
                <div>
                  <strong className="text-[#E8D4C5]">Security:</strong> {editorialSkills.cybersecurity.join(', ')}
                </div>
                <div>
                  <strong className="text-[#E8D4C5]">Programming:</strong> {editorialSkills.programming.join(', ')}
                </div>
                <div>
                  <strong className="text-[#E8D4C5]">Development:</strong> {editorialSkills.development.join(', ')}
                </div>
                <div>
                  <strong className="text-[#E8D4C5]">Data:</strong> {editorialSkills.data.join(', ')}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-[0.2em] text-[#A84C35] font-semibold font-mono-code">
                Certifications
              </h4>
              <ul className="text-xs text-[#C7B0A1] space-y-1.5 list-none p-0 m-0">
                {certificationsData.map((cert, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#A84C35]">—</span>
                    <span><strong className="text-[#E8D4C5]">{cert.name}</strong> · {cert.focus}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-6 border-t border-[#E8D4C5]/10 flex items-center justify-between text-xs text-[#C7B0A1]/60 font-mono-code">
            <span>Official Dossier · Sathya Sai JS</span>
            <button
              onClick={onClose}
              className="hover:text-[#E8D4C5] transition-colors"
            >
              Close Window
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
