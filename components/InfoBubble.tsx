
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
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-y-transparent border-l-transparent'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="p-1 text-slate-400 hover:text-accent transition-colors rounded-full hover:bg-slate-100"
      >
        <Info size={14} />
      </button>

      {isVisible && (
        <div className={`absolute z-[100] w-48 p-3 bg-slate-800 text-white text-[10px] leading-relaxed rounded-xl shadow-2xl animate-fade-in pointer-events-none font-medium ${positionClasses[position]}`}>
          {content}
          <div className={`absolute border-4 ${arrowClasses[position]}`}></div>
        </div>
      )}
    </div>
  );
};
