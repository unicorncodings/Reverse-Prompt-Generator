import React, { useState, useEffect } from 'react';
import { EyeIcon } from './icons/EyeIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';

interface SettingsModalProps {
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [isKeyVisible, setIsKeyVisible] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);
  
  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in"
      onClick={handleBackgroundClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-brand-surface rounded-xl shadow-2xl p-8 w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-4 text-brand-text-primary">Settings</h2>
        <p className="text-brand-text-secondary mb-6">
          Please enter your Gemini API key. Your key is stored securely in your browser's local storage and is never sent anywhere else.
        </p>
        
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-brand-text-secondary mb-2">
            Gemini API Key
          </label>
          <div className="relative">
            <input
              id="apiKey"
              type={isKeyVisible ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-brand-bg border border-brand-secondary rounded-lg px-4 py-3 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="Enter your API key"
            />
            <button
              onClick={() => setIsKeyVisible(!isKeyVisible)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-brand-text-secondary hover:text-brand-text-primary"
              aria-label={isKeyVisible ? 'Hide API key' : 'Show API key'}
            >
              {isKeyVisible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-brand-secondary text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-all duration-300 disabled:opacity-50"
            disabled={!apiKey.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
