import React, { useState, useEffect } from 'react';
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
import { CinematicOpeningSequence } from './components/CinematicOpeningSequence';
import { ProjectCaseStudy } from './types';

export function App() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Cinematic Intro state with sessionStorage memory
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      const alreadySeen = sessionStorage.getItem('sathya_cinematic_intro_seen');
      return alreadySeen !== 'true';
    } catch {
      return true;
    }
  });
  const [isReplay, setIsReplay] = useState<boolean>(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setIsReplay(false);
    try {
      sessionStorage.setItem('sathya_cinematic_intro_seen', 'true');
    } catch {
      // Ignore storage restrictions
    }
  };

  const handleReplayIntro = () => {
    setIsReplay(true);
    setShowIntro(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        
        {/* Real-time Cinematic 3D Opening Sequence (Storyboard Keyframes 01 to 10) */}
        {showIntro && (
          <CinematicOpeningSequence
            onComplete={handleIntroComplete}
            isReplay={isReplay}
          />
        )}

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

        {/* Minimal Footer with Direct Communication & Replay Option */}
        <Footer onReplayIntro={handleReplayIntro} />

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
