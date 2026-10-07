import React from 'react';
import { ChevronUp, ChevronDown, Magnet } from 'lucide-react';
import { useLenisScroll } from '../context/SmoothScrollProvider';

interface SectionNode {
  id: string;
  num: string;
  name: string;
}

const SECTIONS: SectionNode[] = [
  { id: 'home', num: '01', name: 'Identity' },
  { id: 'about', num: '02', name: 'Manifesto' },
  { id: 'lab', num: '03', name: '3D Lab' },
  { id: 'skills', num: '04', name: 'Capabilities' },
  { id: 'projects', num: '05', name: 'Blueprints' },
  { id: 'journey', num: '06', name: 'Milestones' },
  { id: 'contact', num: '07', name: 'Terminal' },
];

export const ScrollSpyIndicator: React.FC = () => {
  const {
    scrollState,
    scrollTo,
    goToNextSection,
    goToPrevSection,
    isSnappingEnabled,
    setIsSnappingEnabled,
  } = useLenisScroll();
  const activeId = scrollState.activeSection || 'home';

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollTo(`#${id}`, { offset: -70, duration: 1.25 });
  };

  return (
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[170] hidden lg:flex flex-col items-center select-none"
      aria-label="Section Navigation"
    >
      {/* Keyboard Accessibility Up Arrow Trigger */}
      <button
        onClick={goToPrevSection}
        className="mb-3 p-1 rounded-sm text-[var(--dim)] hover:text-[#ff7a29] hover:bg-[var(--panel)] border border-transparent hover:border-[var(--line)] transition-all cursor-pointer group relative"
        title="Previous Section (Arrow Up)"
        aria-label="Navigate to Previous Section"
      >
        <ChevronUp className="w-3.5 h-3.5" />
        <span className="absolute right-full mr-2.5 px-2 py-0.5 rounded-xs bg-[var(--panel)] border border-[var(--line)] text-[0.55rem] font-mono-code text-[var(--dim)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          PRESS [↑]
        </span>
      </button>

      {/* Vertical Rail Container */}
      <div className="relative py-1 flex flex-col items-center">
        {/* Background Vertical Guide Track */}
        <div className="absolute top-2 bottom-2 w-[1px] bg-[var(--line)] pointer-events-none" />

        {/* Traveling Active Fill Line based on scroll progress */}
        <div
          className="absolute top-2 w-[2px] bg-[#ff7a29] pointer-events-none transition-all duration-150 ease-out shadow-[0_0_8px_#ff7a29]"
          style={{
            height: `${Math.min(100, Math.max(0, scrollState.progress * 100))}%`,
          }}
        />

        {/* Section Indicator Nodes */}
        <div className="flex flex-col gap-6 relative z-10 py-1">
          {SECTIONS.map((sec) => {
            const isActive = activeId === sec.id;

            return (
              <button
                key={sec.id}
                onClick={(e) => handleClick(e, sec.id)}
                className="group relative flex items-center justify-center p-1.5 focus:outline-none cursor-pointer"
                aria-label={`Scroll to ${sec.name} section`}
                aria-current={isActive ? 'true' : undefined}
              >
                {/* Tooltip Label (Floats to the left on hover / active) */}
                <div
                  className={`absolute right-full mr-3.5 px-2.5 py-1 rounded-sm bg-[var(--panel)]/95 border border-[var(--line)] backdrop-blur-md font-mono-code text-[0.62rem] uppercase tracking-wider text-[var(--txt)] whitespace-nowrap pointer-events-none transition-all duration-300 shadow-md ${
                    isActive
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                  }`}
                >
                  <span className="text-[#ff7a29] mr-1.5">{sec.num}</span>
                  <span>{sec.name}</span>
                </div>

                {/* Node Indicator Dot */}
                <div className="relative flex items-center justify-center">
                  {/* Glowing Pulsing Halo on Active */}
                  {isActive && (
                    <span className="absolute w-5 h-5 rounded-full bg-[#ff7a29]/25 animate-ping pointer-events-none" />
                  )}

                  <div
                    className={`rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-2.5 h-2.5 bg-[#ff7a29] shadow-[0_0_12px_#ff7a29] scale-125'
                        : 'w-1.5 h-1.5 bg-[var(--dim)] group-hover:bg-[var(--txt)] group-hover:scale-125'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Keyboard Accessibility Down Arrow Trigger */}
      <button
        onClick={goToNextSection}
        className="mt-3 p-1 rounded-sm text-[var(--dim)] hover:text-[#ff7a29] hover:bg-[var(--panel)] border border-transparent hover:border-[var(--line)] transition-all cursor-pointer group relative"
        title="Next Section (Arrow Down)"
        aria-label="Navigate to Next Section"
      >
        <ChevronDown className="w-3.5 h-3.5" />
        <span className="absolute right-full mr-2.5 px-2 py-0.5 rounded-xs bg-[var(--panel)] border border-[var(--line)] text-[0.55rem] font-mono-code text-[var(--dim)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          PRESS [↓]
        </span>
      </button>

      {/* Magnetic Snapping Status / Toggle */}
      <button
        onClick={() => setIsSnappingEnabled(!isSnappingEnabled)}
        className={`mt-2 p-1.5 rounded-sm border transition-all cursor-pointer group relative ${
          isSnappingEnabled
            ? 'text-[#ff7a29] border-[#ff7a29]/40 bg-[#ff7a29]/10'
            : 'text-[var(--dim)] border-[var(--line)] bg-[var(--panel)]'
        }`}
        title={`Magnetic Section Snapping: ${isSnappingEnabled ? 'ON (Slow-speed precision lock)' : 'OFF'}`}
        aria-label="Toggle Magnetic Section Snapping"
      >
        <Magnet className="w-3 h-3" />
        <span className="absolute right-full mr-2.5 px-2 py-0.5 rounded-xs bg-[var(--panel)] border border-[var(--line)] text-[0.55rem] font-mono-code text-[var(--dim)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          SNAP: {isSnappingEnabled ? 'ACTIVE' : 'OFF'}
        </span>
      </button>
    </nav>
  );
};
