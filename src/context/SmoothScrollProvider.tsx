import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

interface ScrollState {
  scrollY: number;
  progress: number;
  velocity: number;
  direction: number;
  activeSection: string;
}

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement | number, options?: { offset?: number; duration?: number; immediate?: boolean }) => void;
  scrollState: ScrollState;
  goToNextSection: () => void;
  goToPrevSection: () => void;
  isSnappingEnabled: boolean;
  setIsSnappingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const SECTIONS = ['home', 'about', 'lab', 'skills', 'projects', 'journey', 'contact'];

const defaultScrollState: ScrollState = {
  scrollY: 0,
  progress: 0,
  velocity: 0,
  direction: 1,
  activeSection: 'home',
};

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
  scrollState: defaultScrollState,
  goToNextSection: () => {},
  goToPrevSection: () => {},
  isSnappingEnabled: true,
  setIsSnappingEnabled: () => {},
});

export const useLenisScroll = () => useContext(SmoothScrollContext);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const [scrollState, setScrollState] = useState<ScrollState>(defaultScrollState);
  const [isSnappingEnabled, setIsSnappingEnabled] = useState<boolean>(true);

  const lenisRef = useRef<Lenis | null>(null);
  const activeSectionRef = useRef<string>('home');
  const isTransitioningRef = useRef<boolean>(false);
  const snapCooldownRef = useRef<boolean>(false);
  const lastSnappedSectionRef = useRef<string | null>(null);
  const settleTimeoutRef = useRef<number | null>(null);
  const isSnappingEnabledRef = useRef<boolean>(true);

  useEffect(() => {
    isSnappingEnabledRef.current = isSnappingEnabled;
  }, [isSnappingEnabled]);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // In reduced motion mode, fallback to native scrolling with standard event listener
      const handleNativeScroll = () => {
        const y = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const p = totalHeight > 0 ? y / totalHeight : 0;

        let currentSection = 'home';
        for (const id of SECTIONS) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.15) {
              currentSection = id;
            }
          }
        }
        activeSectionRef.current = currentSection;

        setScrollState({
          scrollY: y,
          progress: p,
          velocity: 0,
          direction: 1,
          activeSection: currentSection,
        });
      };

      window.addEventListener('scroll', handleNativeScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleNativeScroll);
    }

    // Initialize Lenis with cinematic, silky smooth scroll physics
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.6,
      infinite: false,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    // RAF loop
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Trigger smooth snap to section
    const triggerSnap = (el: HTMLElement, sectionId: string) => {
      if (!lenisRef.current || snapCooldownRef.current || isTransitioningRef.current) return;
      snapCooldownRef.current = true;
      lastSnappedSectionRef.current = sectionId;

      lenisRef.current.scrollTo(el, {
        offset: -70,
        duration: 0.95,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      // Clear cooldown after animation completes
      setTimeout(() => {
        snapCooldownRef.current = false;
      }, 1000);
    };

    // Check nearest section boundary when scrolling settles at lower velocities
    const checkSettleSnap = () => {
      if (!isSnappingEnabledRef.current || snapCooldownRef.current || isTransitioningRef.current) return;

      const headerOffset = 70;
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const distanceToStart = rect.top - headerOffset;

        // Snapping window: if stopped within 150px of section header start
        if (Math.abs(distanceToStart) < 140 && Math.abs(distanceToStart) > 8) {
          if (lastSnappedSectionRef.current !== id) {
            triggerSnap(el, id);
            break;
          }
        }
      }
    };

    // Handle scroll updates
    const onScroll = (e: { scroll: number; progress: number; velocity: number; direction: number }) => {
      let currentSection = 'home';
      const headerOffset = 70;

      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.15) {
            currentSection = id;
          }
        }
      }

      activeSectionRef.current = currentSection;

      // Reset lastSnappedSectionRef when user scrolls sufficiently far away from it
      if (lastSnappedSectionRef.current) {
        const snappedEl = document.getElementById(lastSnappedSectionRef.current);
        if (snappedEl) {
          const dist = Math.abs(snappedEl.getBoundingClientRect().top - headerOffset);
          if (dist > 280) {
            lastSnappedSectionRef.current = null;
          }
        }
      }

      // Slower-speed section entry snapping logic:
      // When velocity is slow (< 0.38) and entry is detected near section boundary
      if (
        isSnappingEnabledRef.current &&
        !snapCooldownRef.current &&
        !isTransitioningRef.current &&
        Math.abs(e.velocity) < 0.38 &&
        Math.abs(e.velocity) > 0.02
      ) {
        for (const id of SECTIONS) {
          const el = document.getElementById(id);
          if (!el) continue;

          const rect = el.getBoundingClientRect();
          const distanceToStart = rect.top - headerOffset;

          // If moving into section start area (attraction corridor between -90px and +110px)
          if (Math.abs(distanceToStart) < 100 && Math.abs(distanceToStart) > 10) {
            if (lastSnappedSectionRef.current !== id) {
              triggerSnap(el, id);
              break;
            }
          }
        }
      }

      // Settle timer: if user stops scrolling near section start, smoothly lock in
      if (settleTimeoutRef.current) {
        window.clearTimeout(settleTimeoutRef.current);
      }
      if (Math.abs(e.velocity) < 0.22) {
        settleTimeoutRef.current = window.setTimeout(() => {
          checkSettleSnap();
        }, 160);
      }

      setScrollState({
        scrollY: e.scroll,
        progress: e.progress,
        velocity: e.velocity,
        direction: e.direction,
        activeSection: currentSection,
      });
    };

    lenis.on('scroll', onScroll);

    // Smooth scroll interceptor for hash links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: -70,
            duration: 1.25,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Keyboard navigation: ArrowDown / ArrowUp section snapping
    let keyCooldownTimer: number;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Ignore if typing in an input, textarea, select, or editable element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      // 2. Ignore if a modal dialog is currently open
      if (
        document.querySelector('[role="dialog"]') ||
        document.querySelector('.fixed.inset-0.z-\\[250\\]')
      ) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        // Prevent default page jump so smooth section snapping takes over
        e.preventDefault();

        if (isTransitioningRef.current) return;

        const currentActive = activeSectionRef.current;
        let currentIndex = SECTIONS.indexOf(currentActive);
        if (currentIndex === -1) currentIndex = 0;

        let nextIndex = currentIndex;
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
          nextIndex = Math.min(currentIndex + 1, SECTIONS.length - 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          // If user is scrolled down inside the current section (> 140px past its header),
          // first press of ArrowUp returns to the top of the current section
          const currentEl = document.getElementById(currentActive);
          if (currentEl) {
            const currentDist = currentEl.getBoundingClientRect().top - (-70);
            if (currentDist < -140) {
              nextIndex = currentIndex;
            } else {
              nextIndex = Math.max(currentIndex - 1, 0);
            }
          } else {
            nextIndex = Math.max(currentIndex - 1, 0);
          }
        }

        const nextTargetId = SECTIONS[nextIndex];
        const nextTargetEl = document.getElementById(nextTargetId);

        if (nextTargetEl) {
          isTransitioningRef.current = true;
          snapCooldownRef.current = true;
          lastSnappedSectionRef.current = nextTargetId;

          window.clearTimeout(keyCooldownTimer);
          keyCooldownTimer = window.setTimeout(() => {
            isTransitioningRef.current = false;
            snapCooldownRef.current = false;
          }, 750);

          if (lenisRef.current) {
            lenisRef.current.scrollTo(nextTargetEl, {
              offset: -70,
              duration: 1.15,
              easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          } else {
            nextTargetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(keyCooldownTimer);
      if (settleTimeoutRef.current) window.clearTimeout(settleTimeoutRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = (
    target: string | HTMLElement | number,
    options?: { offset?: number; duration?: number; immediate?: boolean }
  ) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: options?.offset ?? -70,
        duration: options?.duration ?? 1.2,
        immediate: options?.immediate ?? false,
      });
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToNextSection = () => {
    const currentIndex = SECTIONS.indexOf(activeSectionRef.current);
    const nextIndex = Math.min(currentIndex + 1, SECTIONS.length - 1);
    const nextEl = document.getElementById(SECTIONS[nextIndex]);
    if (nextEl) {
      lastSnappedSectionRef.current = SECTIONS[nextIndex];
      scrollTo(nextEl, { offset: -70, duration: 1.15 });
    }
  };

  const goToPrevSection = () => {
    const currentIndex = SECTIONS.indexOf(activeSectionRef.current);
    const prevIndex = Math.max(currentIndex - 1, 0);
    const prevEl = document.getElementById(SECTIONS[prevIndex]);
    if (prevEl) {
      lastSnappedSectionRef.current = SECTIONS[prevIndex];
      scrollTo(prevEl, { offset: -70, duration: 1.15 });
    }
  };

  return (
    <SmoothScrollContext.Provider
      value={{
        lenis: lenisInstance,
        scrollTo,
        scrollState,
        goToNextSection,
        goToPrevSection,
        isSnappingEnabled,
        setIsSnappingEnabled,
      }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
};
