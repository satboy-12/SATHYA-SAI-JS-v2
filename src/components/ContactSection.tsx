import React, { useState } from 'react';
import { Copy, Check, ArrowUpRight, Mail, Phone, MessageSquare, Github, Linkedin, ExternalLink } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface ContactSectionProps {
  onShowToast?: (message: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const email = 'sathyasaijs12@gmail.com';
  const phoneFormatted = '+91 73056 62449';
  const phoneTel = 'tel:+917305662449';
  const whatsappUrl = 'https://wa.me/917305662449';
  const githubUrl = 'https://github.com/satboy-12';
  const linkedinUrl = 'https://linkedin.com/in/sathyasaijs';

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(phoneFormatted);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <section
      id="contact"
      className="py-24 sm:py-32 lg:py-40 bg-[#0D0A09] text-[#E8D4C5] relative border-t border-[#E8D4C5]/10"
    >
      <div className="max-w-[1100px] mx-auto px-6 sm:px-10">
        
        {/* Editorial Sub-Index Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8D4C5]/10 text-xs font-mono-code uppercase tracking-[0.2em] text-[#C7B0A1]/80">
          <div className="flex items-center gap-3">
            <span className="text-[#A84C35]">07</span>
            <span className="text-[#E8D4C5]">CONTACT</span>
            <span className="text-[#E8D4C5]/30">/</span>
            <span>DIRECT CHANNELS</span>
          </div>
          <span className="text-[11px] text-[#A84C35] font-mono-code">
            CHENNAI, INDIA (IST)
          </span>
        </div>

        {/* Large Editorial Headline & Subtitle */}
        <div className="pt-12 pb-14 sm:pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <h2 className="font-serif-editorial text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] leading-[0.88] tracking-tight text-[#E8D4C5]">
              LET'S<br />
              <span className="italic text-[#A84C35]">TALK.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 pb-2">
            <p className="font-serif-reading text-xl sm:text-2xl text-[#C7B0A1] italic leading-relaxed">
              Have a project, idea, opportunity, or just want to connect?
            </p>
          </div>
        </div>

        {/* Thin divider */}
        <div className="border-t border-[#E8D4C5]/15" />

        {/* Direct Communication Channels Grid */}
        <div className="py-12 sm:py-16 space-y-12">
          
          {/* Channel 1: EMAIL */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start sm:items-center py-6 border-b border-[#E8D4C5]/10">
            <div className="md:col-span-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#A84C35] font-mono-code flex items-center gap-2">
                <Mail size={13} className="text-[#A84C35]" />
                EMAIL
              </span>
            </div>
            <div className="md:col-span-5">
              <a
                href={`mailto:${email}`}
                className="font-serif-editorial text-2xl sm:text-3xl text-[#E8D4C5] hover:text-[#A84C35] transition-colors break-all inline-block"
              >
                {email}
              </a>
            </div>
            <div className="md:col-span-4 flex items-center gap-3 pt-2 md:pt-0">
              <a
                href={`mailto:${email}`}
                className="min-h-[44px] px-5 py-2.5 bg-[#E8D4C5] hover:bg-[#A84C35] text-[#0D0A09] hover:text-white text-xs uppercase tracking-[0.18em] font-semibold transition-colors inline-flex items-center justify-center gap-2"
                aria-label="Send email to Sathya Sai JS"
              >
                <span>EMAIL ME</span>
                <ArrowUpRight size={14} />
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="min-h-[44px] min-w-[44px] px-3.5 py-2.5 border border-[#E8D4C5]/20 hover:border-[#A84C35] text-[#E8D4C5] hover:text-[#A84C35] text-xs font-mono-code uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                aria-label="Copy email address"
              >
                {copiedEmail ? (
                  <>
                    <Check size={13} className="text-[#A84C35]" />
                    <span className="text-[#A84C35] text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Channel 2: PHONE */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start sm:items-center py-6 border-b border-[#E8D4C5]/10">
            <div className="md:col-span-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#A84C35] font-mono-code flex items-center gap-2">
                <Phone size={13} className="text-[#A84C35]" />
                PHONE
              </span>
            </div>
            <div className="md:col-span-5">
              <a
                href={phoneTel}
                className="font-serif-editorial text-2xl sm:text-3xl text-[#E8D4C5] hover:text-[#A84C35] transition-colors inline-block"
              >
                {phoneFormatted}
              </a>
            </div>
            <div className="md:col-span-4 flex items-center gap-3 pt-2 md:pt-0">
              <a
                href={phoneTel}
                className="min-h-[44px] px-5 py-2.5 bg-[#E8D4C5] hover:bg-[#A84C35] text-[#0D0A09] hover:text-white text-xs uppercase tracking-[0.18em] font-semibold transition-colors inline-flex items-center justify-center gap-2"
                aria-label="Call Sathya Sai JS"
              >
                <span>CALL ME</span>
                <Phone size={13} />
              </a>
              <button
                type="button"
                onClick={handleCopyPhone}
                className="min-h-[44px] min-w-[44px] px-3.5 py-2.5 border border-[#E8D4C5]/20 hover:border-[#A84C35] text-[#E8D4C5] hover:text-[#A84C35] text-xs font-mono-code uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                aria-label="Copy phone number"
              >
                {copiedPhone ? (
                  <>
                    <Check size={13} className="text-[#A84C35]" />
                    <span className="text-[#A84C35] text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Channel 3: WHATSAPP */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start sm:items-center py-6 border-b border-[#E8D4C5]/10">
            <div className="md:col-span-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#A84C35] font-mono-code flex items-center gap-2">
                <MessageSquare size={13} className="text-[#A84C35]" />
                WHATSAPP
              </span>
            </div>
            <div className="md:col-span-5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif-editorial text-2xl sm:text-3xl text-[#E8D4C5] hover:text-[#A84C35] transition-colors inline-block"
              >
                {phoneFormatted}
              </a>
            </div>
            <div className="md:col-span-4 flex items-center gap-3 pt-2 md:pt-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-5 py-2.5 bg-[#231A16] border border-[#A84C35]/40 hover:border-[#A84C35] hover:bg-[#A84C35] text-[#E8D4C5] hover:text-white text-xs uppercase tracking-[0.18em] font-semibold transition-colors inline-flex items-center justify-center gap-2"
                aria-label="Message Sathya Sai JS on WhatsApp"
              >
                <span>MESSAGE ON WHATSAPP</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

        </div>

        {/* Social / Profiles Section */}
        <div className="pt-8 pb-12 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-[#E8D4C5]/15">
          
          {/* GitHub */}
          <div className="p-6 bg-[#14100E] border border-[#E8D4C5]/10 hover:border-[#A84C35]/40 transition-colors">
            <div className="text-[11px] font-mono-code uppercase tracking-[0.22em] text-[#C7B0A1]/70 mb-2 flex items-center gap-2">
              <Github size={13} className="text-[#A84C35]" />
              GITHUB
            </div>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between text-base sm:text-lg font-serif-editorial text-[#E8D4C5] hover:text-[#A84C35] transition-colors"
            >
              <span>github.com/satboy-12</span>
              <ArrowUpRight size={16} className="text-[#C7B0A1] group-hover:text-[#A84C35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          </div>

          {/* LinkedIn */}
          <div className="p-6 bg-[#14100E] border border-[#E8D4C5]/10 hover:border-[#A84C35]/40 transition-colors">
            <div className="text-[11px] font-mono-code uppercase tracking-[0.22em] text-[#C7B0A1]/70 mb-2 flex items-center gap-2">
              <Linkedin size={13} className="text-[#A84C35]" />
              LINKEDIN
            </div>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between text-base sm:text-lg font-serif-editorial text-[#E8D4C5] hover:text-[#A84C35] transition-colors"
            >
              <span>linkedin.com/in/sathyasaijs</span>
              <ArrowUpRight size={16} className="text-[#C7B0A1] group-hover:text-[#A84C35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
