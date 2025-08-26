
import React, { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

interface PromptDisplayProps {
  prompt: string;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-brand-surface rounded-xl shadow-lg p-6 relative animate-fade-in flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-brand-text-primary">Generated Prompt</h3>
        <button
          onClick={handleCopy}
          className="p-2 rounded-md bg-brand-secondary hover:bg-gray-600 transition-colors duration-200"
          aria-label="Copy prompt to clipboard"
        >
          {copied ? (
            <CheckIcon className="w-5 h-5 text-green-400" />
          ) : (
            <CopyIcon className="w-5 h-5 text-brand-text-secondary" />
          )}
        </button>
      </div>
      <div className="flex-grow overflow-y-auto pr-2">
        <p className="text-brand-text-primary leading-relaxed whitespace-pre-wrap">{prompt}</p>
      </div>
    </div>
  );
};
