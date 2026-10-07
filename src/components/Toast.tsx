import React from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed left-1/2 bottom-8 -translate-x-1/2 bg-[#14100E] border border-[#A84C35] text-[#E8D4C5] font-mono-code text-xs tracking-[0.14em] uppercase px-6 py-3 z-[350] shadow-xl transition-all duration-300 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#A84C35]" />
        <span>{message}</span>
      </div>
    </div>
  );
};
