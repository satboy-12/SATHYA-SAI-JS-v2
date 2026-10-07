import React from 'react';
import { useLenisScroll } from '../context/SmoothScrollProvider';

export const ProgressBar: React.FC = () => {
  const { scrollState } = useLenisScroll();
  const progressPercent = Math.min(100, Math.max(0, scrollState.progress * 100));

  return (
    <div
      className="fixed top-0 left-0 h-[2px] bg-[#A84C35] z-[210] pointer-events-none transition-all duration-75"
      style={{ width: `${progressPercent}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progressPercent)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
};
