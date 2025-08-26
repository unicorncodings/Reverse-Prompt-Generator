import React from 'react';
import { CogIcon } from './icons/CogIcon';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="text-center w-full max-w-4xl relative">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Reverse Prompt Generator
        </span>
      </h1>
      <p className="mt-4 text-lg text-brand-text-secondary max-w-2xl mx-auto">
        Turn any image into a masterpiece of words. Let AI describe your visuals with stunning detail.
      </p>
      <button
        onClick={onOpenSettings}
        className="absolute top-0 right-0 p-2 rounded-full hover:bg-brand-surface transition-colors"
        aria-label="Open settings"
      >
        <CogIcon className="w-6 h-6 text-brand-text-secondary" />
      </button>
    </header>
  );
};