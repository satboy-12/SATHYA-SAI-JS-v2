import React, { useState } from 'react';
import { SmoothScrollProvider } from './context/SmoothScrollProvider';
import { ProgressBar } from './components/ProgressBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { WhatIDoSection } from './components/WhatIDoSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { JourneySection } from './components/JourneySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { ResumeDossierModal } from './components/ResumeDossierModal';
import { ProjectCaseStudyModal } from './components/ProjectCaseStudyModal';
import { ProjectCaseStudy } from './types';

export function App() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3200);
  };

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-[#0D0A09] text-[#E8D4C5] font-sans-human selection:bg-[#A84C35] selection:text-[#0D0A09] relative overflow-x-hidden">
        
        {/* Subtle Scroll Progress Indicator */}
        <ProgressBar />

        {/* Minimal Editorial Navigation */}
        <Navbar onOpenResume={() => setIsResumeOpen(true)} />

        {/* Primary Editorial Sections */}
        <main id="app" className="relative z-10">
          <HeroSection onOpenResume={() => setIsResumeOpen(true)} />
          <AboutSection />
          <WhatIDoSection />
          <SkillsSection />
          <ProjectsSection onOpenCaseStudy={(proj) => setSelectedProject(proj)} />
          <JourneySection />
          <ContactSection onShowToast={showToast} />
        </main>

        {/* Minimal Footer */}
        <Footer />

        {/* Notification Toast */}
        <Toast message={toastMessage} isVisible={isToastVisible} />

        {/* Full Dossier Résumé Modal */}
        <ResumeDossierModal
          isOpen={isResumeOpen}
          onClose={() => setIsResumeOpen(false)}
        />

        {/* Case Study Modal */}
        <ProjectCaseStudyModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </SmoothScrollProvider>
  );
}

export default App;
