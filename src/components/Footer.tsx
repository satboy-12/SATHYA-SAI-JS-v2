import React from 'react';
import { ArrowUp, ArrowUpRight, Mail, Phone, MessageSquare, Github, Linkedin, RotateCcw } from 'lucide-react';

interface FooterProps {
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayIntro }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const email = 'sathyasaijs12@gmail.com';
  const phoneFormatted = '+91 73056 62449';
  const phoneTel = 'tel:+917305662449';
  const whatsappUrl = 'https://wa.me/917305662449';
  const githubUrl = 'https://github.com/satboy-12';
  const linkedinUrl = 'https://linkedin.com/in/sathyasaijs';

  return (
    <footer className="py-16 sm:py-20 bg-[#0D0A09] border-t border-[#E8D4C5]/10 text-[#C7B0A1]">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#E8D4C5]/10 items-start">
          
          {/* Brand & Roles */}
          <div className="md:col-span-5 space-y-3">
            <h3 className="font-serif-editorial text-3xl sm:text-4xl text-[#E8D4C5] tracking-tight">
              SATHYA SAI JS
            </h3>
            <div className="text-xs uppercase tracking-[0.16em] text-[#C7B0A1]/80 space-y-1 font-mono-code">
              <div>Web & App Developer</div>
              <div>Cyber Security Engineer</div>
              <div>Data Analyst</div>
            </div>
            <p className="text-xs text-[#C7B0A1]/60 pt-2 font-serif-reading italic max-w-sm">
              “I build things that work — creating resilient digital applications, evaluating threat surfaces, and deriving structured insight.”
            </p>
          </div>

          {/* Direct Communication Channels in Footer */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-[11px] font-mono-code uppercase tracking-[0.2em] text-[#A84C35] font-semibold">
              Connect Directly
            </div>
            <div className="flex flex-col space-y-2 text-xs">
              <a
                href={`mailto:${email}`}
                className="hover:text-[#E8D4C5] transition-colors flex items-center gap-2 group"
                aria-label="Send Email"
              >
                <Mail size={13} className="text-[#A84C35]" />
                <span className="font-mono-code">{email}</span>
              </a>

              <a
                href={phoneTel}
                className="hover:text-[#E8D4C5] transition-colors flex items-center gap-2 group"
                aria-label="Call Phone"
              >
                <Phone size={13} className="text-[#A84C35]" />
                <span className="font-mono-code">{phoneFormatted}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E8D4C5] transition-colors flex items-center gap-2 group"
                aria-label="WhatsApp"
              >
                <MessageSquare size={13} className="text-[#A84C35]" />
                <span className="font-mono-code">WhatsApp: {phoneFormatted}</span>
                <ArrowUpRight size={11} className="text-[#C7B0A1]/60" />
              </a>
            </div>
          </div>

          {/* Social Profiles & Actions */}
          <div className="md:col-span-3 space-y-4 md:text-right">
            <div className="text-[11px] font-mono-code uppercase tracking-[0.2em] text-[#A84C35] font-semibold">
              Profiles & Navigation
            </div>
            <div className="flex md:flex-col items-center md:items-end gap-3 text-xs">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E8D4C5] transition-colors inline-flex items-center gap-1.5 font-mono-code"
              >
                <Github size={13} />
                <span>github.com/satboy-12</span>
                <ArrowUpRight size={12} />
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E8D4C5] transition-colors inline-flex items-center gap-1.5 font-mono-code"
              >
                <Linkedin size={13} />
                <span>linkedin.com/in/sathyasaijs</span>
                <ArrowUpRight size={12} />
              </a>

              {onReplayIntro && (
                <button
                  type="button"
                  onClick={onReplayIntro}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-mono-code uppercase tracking-wider text-[#C7B0A1] hover:text-[#A84C35] transition-colors cursor-pointer"
                  title="Replay cinematic opening experience"
                >
                  <RotateCcw size={12} />
                  <span>Replay Intro</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-[#C7B0A1]/60">
          <p>© 2026 SATHYA SAI JS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Chennai, TN, India</span>
            <button
              onClick={scrollToTop}
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#C7B0A1] hover:text-[#E8D4C5] transition-colors font-mono-code cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform text-[#A84C35]" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
