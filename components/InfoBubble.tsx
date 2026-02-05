
import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InfoBubbleProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const InfoBubble: React.FC<InfoBubbleProps> = ({ 
  content, 
  position = 'top',
  className = "" 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-900 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-900 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-900 border-y-transparent border-l-transparent'
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => {
            e.stopPropagation();
            setIsVisible(!isVisible);
        }}
        className="p-1.5 text-slate-400 hover:text-accent transition-all rounded-full hover:bg-slate-100 focus:outline-none"
        aria-label="Informations complémentaires"
      >
        <Info size={16} />
      </button>

      {isVisible && (
        <div className={`absolute z-[200] w-56 p-4 bg-slate-900 text-white text-[11px] leading-relaxed rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] animate-fade-in pointer-events-none font-medium border border-slate-800 ${positionClasses[position]}`}>
          {content}
          <div className={`absolute border-[6px] ${arrowClasses[position]}`}></div>
        </div>
      )}
    </div>
  );
};
