import React, { useState } from 'react';
import { Copy, Check, ArrowUpRight, Mail, Github, Linkedin, Send } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface ContactSectionProps {
  onShowToast: (message: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onShowToast }) => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioData.email);
    setCopied(true);
    onShowToast('Email address copied to clipboard');
    setTimeout(() => setCopied(false), 2400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      onShowToast('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onShowToast('Thank you, Sathya will get back to you shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 600);
  };

  return (
    <section
      id="contact"
      className="py-24 sm:py-32 lg:py-40 bg-[#0D0A09] text-[#E8D4C5] relative"
    >
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        
        {/* Editorial Sub-Index */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8D4C5]/10 text-xs font-mono-code uppercase tracking-[0.2em] text-[#C7B0A1]/80">
          <div className="flex items-center gap-3">
            <span className="text-[#A84C35]">09</span>
            <span className="text-[#E8D4C5]">CONTACT</span>
            <span className="text-[#E8D4C5]/30">/</span>
            <span>GET IN TOUCH</span>
          </div>
          <span className="hidden sm:inline text-[11px] text-[#C7B0A1]/60">
            OPEN FOR OPPORTUNITIES
          </span>
        </div>

        {/* Big Editorial Headline */}
        <div className="pt-12 pb-16 lg:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <h2 className="font-serif-editorial text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-[0.9] tracking-tight text-[#E8D4C5]">
              LET'S WORK<br />
              <span className="italic text-[#A84C35]">TOGETHER.</span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="font-serif-reading text-xl sm:text-2xl text-[#C7B0A1] italic leading-relaxed">
              “Have an idea, project or opportunity? I'd love to hear about it.”
            </p>
          </div>
        </div>

        {/* Asymmetrical Content Grid: Direct Channels vs Working Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-8 border-t border-[#E8D4C5]/10">
          
          {/* Left Column: Direct Communication Channels */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] text-[#A84C35] font-semibold block">
                Direct Communication
              </span>
              <p className="text-sm sm:text-base text-[#C7B0A1] leading-relaxed font-sans-human">
                Feel free to email me directly or connect through GitHub and LinkedIn. I'm actively interested in cybersecurity engineering roles, full-stack web projects, and data analytics work.
              </p>
            </div>

            {/* Email Card with 1-Click Copy */}
            <div className="p-6 sm:p-8 bg-[#14100E] border border-[#E8D4C5]/15 space-y-4">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#C7B0A1]/70 font-mono-code">
                Primary Email
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <a
                  href={`mailto:${portfolioData.email}`}
                  className="font-serif-editorial text-xl sm:text-2xl text-[#E8D4C5] hover:text-[#A84C35] transition-colors break-all"
                >
                  {portfolioData.email}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code uppercase tracking-wider text-[#E8D4C5] border border-[#E8D4C5]/20 hover:border-[#A84C35] hover:text-[#A84C35] transition-colors self-start sm:self-auto shrink-0"
                >
                  {copied ? <Check size={13} className="text-[#A84C35]" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Social Channels List */}
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.2em] text-[#C7B0A1]/70 font-mono-code block">
                Network & Repositories
              </span>
              <div className="divide-y divide-[#E8D4C5]/10 border-t border-b border-[#E8D4C5]/10 text-sm">
                <a
                  href="https://github.com/satboy-12"
                  target="_blank"
                  rel="noreferrer"
                  className="py-3.5 flex items-center justify-between group hover:text-[#A84C35] transition-colors"
                >
                  <span className="text-[#E8D4C5] group-hover:text-[#A84C35]">GitHub / satboy-12</span>
                  <ArrowUpRight size={15} className="text-[#C7B0A1] group-hover:text-[#A84C35] transition-colors" />
                </a>
                <a
                  href="https://linkedin.com/in/sathyasaijs"
                  target="_blank"
                  rel="noreferrer"
                  className="py-3.5 flex items-center justify-between group hover:text-[#A84C35] transition-colors"
                >
                  <span className="text-[#E8D4C5] group-hover:text-[#A84C35]">LinkedIn / in/sathyasaijs</span>
                  <ArrowUpRight size={15} className="text-[#C7B0A1] group-hover:text-[#A84C35] transition-colors" />
                </a>
                <div className="py-3.5 flex items-center justify-between text-[#C7B0A1]">
                  <span>Location: Chennai, Tamil Nadu, India</span>
                  <span className="text-xs font-mono-code text-[#A84C35]">IST (UTC+5:30)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Grounded Human Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 lg:p-12 bg-[#14100E] border border-[#E8D4C5]/15 space-y-8">
              <div className="border-b border-[#E8D4C5]/10 pb-4">
                <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#E8D4C5]">
                  Send a Direct Message
                </h3>
                <p className="text-xs sm:text-sm text-[#C7B0A1] mt-1 font-sans-human">
                  Leave a note with your project scope, questions, or opportunity details.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-[0.16em] text-[#C7B0A1] font-mono-code">
                      Your Name <span className="text-[#A84C35]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Maya Chen"
                      className="w-full bg-[#0D0A09] border border-[#E8D4C5]/20 focus:border-[#A84C35] px-4 py-3 text-sm text-[#E8D4C5] outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-[0.16em] text-[#C7B0A1] font-mono-code">
                      Your Email <span className="text-[#A84C35]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. maya@example.com"
                      className="w-full bg-[#0D0A09] border border-[#E8D4C5]/20 focus:border-[#A84C35] px-4 py-3 text-sm text-[#E8D4C5] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-[0.16em] text-[#C7B0A1] font-mono-code">
                    Subject / Area of Interest
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Web Development project / Security evaluation"
                    className="w-full bg-[#0D0A09] border border-[#E8D4C5]/20 focus:border-[#A84C35] px-4 py-3 text-sm text-[#E8D4C5] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-[0.16em] text-[#C7B0A1] font-mono-code">
                    Message <span className="text-[#A84C35]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me a bit about what you're working on..."
                    className="w-full bg-[#0D0A09] border border-[#E8D4C5]/20 focus:border-[#A84C35] px-4 py-3 text-sm text-[#E8D4C5] outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#E8D4C5] hover:bg-[#A84C35] text-[#0D0A09] hover:text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send size={14} />
                  <span>{isSubmitting ? 'Transmitting...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
