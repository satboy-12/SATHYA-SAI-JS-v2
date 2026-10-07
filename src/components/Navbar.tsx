import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface NavbarProps {
  onOpenResume: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['about', 'what-i-do', 'skills', 'work', 'experience', 'education', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about', id: 'about' },
    { label: 'What I Do', href: '#what-i-do', id: 'what-i-do' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Work', href: '#work', id: 'work' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Education', href: '#education', id: 'education' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0D0A09]/95 backdrop-blur-sm border-b border-[#E8D4C5]/10 py-3.5 shadow-sm'
          : 'bg-transparent border-b border-transparent py-5 sm:py-6'
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#hero"
          className="group inline-flex items-center gap-2"
        >
          <span className="font-serif-editorial text-xl sm:text-2xl text-[#E8D4C5] tracking-tight group-hover:text-[#A84C35] transition-colors">
            SATHYA SAI JS
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#A84C35] opacity-75" />
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-xs uppercase tracking-[0.16em]">
          {navLinks.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                className={`relative py-1 transition-colors duration-200 ${
                  isActive
                    ? 'text-[#E8D4C5] font-semibold'
                    : 'text-[#C7B0A1]/70 hover:text-[#E8D4C5]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#A84C35]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenResume}
            className="px-4 py-2 text-xs uppercase tracking-[0.14em] font-medium text-[#E8D4C5] border border-[#E8D4C5]/20 hover:border-[#A84C35] hover:text-[#A84C35] transition-colors whitespace-nowrap"
          >
            Résumé
          </button>
          <a
            href="#contact"
            className="px-4 py-2 text-xs uppercase tracking-[0.14em] font-semibold text-[#0D0A09] bg-[#E8D4C5] hover:bg-[#A84C35] hover:text-white transition-colors whitespace-nowrap"
          >
            Get In Touch
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenResume}
            className="px-2.5 py-1.5 text-[11px] uppercase tracking-wider text-[#E8D4C5] border border-[#E8D4C5]/20"
          >
            Résumé
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#E8D4C5] hover:text-[#A84C35] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#14100E] border-b border-[#E8D4C5]/10 px-6 py-6 transition-all">
          <nav className="flex flex-col space-y-4 text-xs uppercase tracking-[0.18em]">
            {navLinks.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-[#C7B0A1] hover:text-[#E8D4C5] transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t border-[#E8D4C5]/10 flex flex-col gap-2">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center text-xs uppercase tracking-wider font-semibold text-[#0D0A09] bg-[#E8D4C5]"
              >
                Get In Touch
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
