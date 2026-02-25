import React from 'react';

interface GeminiButtonProps {
  onClick: () => void;
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3L9.5 8.5L4 11L9.5 13.5L12 19L14.5 13.5L20 11L14.5 8.5L12 3Z"/>
        <path d="M5 21L7 16L5 21Z" /><path d="M19 21L17 16L19 21Z" /><path d="M21 5L16 7L21 5Z" /><path d="M3 5L8 7L3 5Z" />
    </svg>
);

const LoadingSpinner = () => (
    <svg className="animate-spin h-4 w-4 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const GeminiButton: React.FC<GeminiButtonProps> = ({ onClick, isLoading, children, className }) => {
    return (
        <button onClick={onClick} disabled={isLoading} className={`flex items-center justify-center gap-2 px-4 py-2 font-semibold text-indigo-700 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-lg shadow-md hover:from-purple-300 hover:to-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
            {isLoading ? <LoadingSpinner /> : <SparkleIcon />}
            {isLoading ? 'Génération...' : children}
        </button>
    );
};