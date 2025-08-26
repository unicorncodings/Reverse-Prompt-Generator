
import React from 'react';
import { TrashIcon } from './icons/TrashIcon';

interface HistoryItem {
  id: number;
  prompt: string;
}

interface PromptHistoryProps {
  history: HistoryItem[];
  onSelectItem: (prompt: string) => void;
  onClearHistory: () => void;
}

export const PromptHistory: React.FC<PromptHistoryProps> = ({ history, onSelectItem, onClearHistory }) => {
  if (history.length === 0) {
    return (
        <aside className="w-full bg-brand-surface rounded-xl shadow-lg p-6 animate-fade-in flex flex-col h-full">
         <h3 className="text-xl font-bold text-brand-text-primary mb-4">History</h3>
         <div className="flex-grow flex items-center justify-center">
            <p className="text-brand-text-secondary text-center">Your generated prompts will appear here.</p>
         </div>
       </aside>
    );
  }

  return (
    <aside className="w-full bg-brand-surface rounded-xl shadow-lg p-6 animate-fade-in flex flex-col h-full max-h-[600px] lg:max-h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-brand-text-primary">History</h3>
        <button
          onClick={onClearHistory}
          className="p-2 rounded-md bg-brand-secondary hover:bg-gray-600 transition-colors duration-200"
          aria-label="Clear history"
        >
          <TrashIcon className="w-5 h-5 text-brand-text-secondary" />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto -mr-2 pr-2 space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectItem(item.prompt)}
            className="p-3 bg-brand-secondary/30 rounded-lg cursor-pointer hover:bg-brand-primary/20 transition-colors"
          >
            <p className="text-brand-text-primary text-sm leading-relaxed line-clamp-3">
              {item.prompt}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
};
