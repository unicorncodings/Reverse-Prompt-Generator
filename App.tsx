import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptDisplay } from './components/PromptDisplay';
import { generatePromptFromImage } from './services/geminiService';
import { fileToBase64 } from './utils/imageUtils';
import { PromptHistory } from './components/PromptHistory';
import { SkeletonLoader } from './components/SkeletonLoader';
import { SettingsModal } from './components/SettingsModal';
import { Loader } from './components/Loader';

interface HistoryItem {
  id: number;
  prompt: string;
}

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [promptHistory, setPromptHistory] = useState<HistoryItem[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);

  useEffect(() => {
    const key = localStorage.getItem('gemini_api_key');
    if (key) {
      setIsApiKeySet(true);
    } else {
      setIsSettingsOpen(true); // Open settings if no key on load
    }

    try {
      const storedHistory = localStorage.getItem('promptHistory');
      if (storedHistory) {
        setPromptHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse history from localStorage", error);
      setPromptHistory([]);
    }
  }, []);

  const handleImageUpload = useCallback((file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setGeneratedPrompt('');
    setError('');
  }, []);

  const handleGeneratePrompt = async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }
    if (!isApiKeySet) {
      setError('Please set your Gemini API key in the settings.');
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedPrompt('');

    try {
      const base64Image = await fileToBase64(imageFile);
      const prompt = await generatePromptFromImage(base64Image, imageFile.type);
      setGeneratedPrompt(prompt);
      
      const newHistoryItem: HistoryItem = { id: Date.now(), prompt };
      setPromptHistory(prevHistory => {
          const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 20); // Keep last 20
          localStorage.setItem('promptHistory', JSON.stringify(updatedHistory));
          return updatedHistory;
      });

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      if (errorMessage.includes("API Key")) {
        setIsSettingsOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveApiKey = (apiKey: string) => {
    localStorage.setItem('gemini_api_key', apiKey);
    setIsApiKeySet(true);
    setIsSettingsOpen(false);
    setError(''); // Clear previous errors
  };

  const handleReset = () => {
    setImageFile(null);
    setImageUrl(null);
    setGeneratedPrompt('');
    setError('');
    setIsLoading(false);
  }
  
  const handleSelectHistoryItem = (prompt: string) => {
    setGeneratedPrompt(prompt);
  };

  const handleClearHistory = () => {
    setPromptHistory([]);
    localStorage.removeItem('promptHistory');
  };

  return (
    <>
      <div className="min-h-screen bg-brand-bg text-brand-text-primary font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
        <Header onOpenSettings={() => setIsSettingsOpen(true)} />
        <main className="w-full max-w-7xl flex-grow flex flex-col lg:flex-row items-start gap-8 mt-8">
          
          {/* Main Content Area */}
          <div className="w-full lg:flex-1 flex flex-col items-center">
              {!imageUrl && (
                <div className="w-full max-w-xl animate-fade-in">
                  <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Upload an Image</h2>
                  <p className="text-brand-text-secondary text-center mb-6">And watch the magic happen. ✨</p>
                  <ImageUploader onImageUpload={handleImageUpload} />
                </div>
              )}

              {imageUrl && (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                  <div className="flex flex-col items-center">
                    <div className="w-full max-w-md bg-brand-surface rounded-xl shadow-lg p-4 relative overflow-hidden">
                      <img src={imageUrl} alt="Uploaded preview" className="rounded-lg object-contain w-full h-auto max-h-[400px]" />
                    </div>
                    <div className="flex space-x-4 mt-6">
                      <button
                        onClick={handleGeneratePrompt}
                        disabled={isLoading || !isApiKeySet}
                        className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        title={!isApiKeySet ? "Set your API Key in settings" : ""}
                      >
                        {isLoading ? <Loader /> : 'Generate Prompt'}
                      </button>
                      <button
                        onClick={handleReset}
                        disabled={isLoading}
                        className="px-6 py-3 bg-brand-secondary text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300 disabled:opacity-50"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col w-full">
                    {isLoading ? (
                      <SkeletonLoader />
                    ) : error ? (
                      <div className="text-red-400 bg-red-900/50 p-4 rounded-lg animate-fade-in">{error}</div>
                    ) : generatedPrompt ? (
                      <PromptDisplay prompt={generatedPrompt} />
                    ) : (
                      <div className="h-full w-full bg-brand-surface rounded-xl shadow-lg p-6 relative animate-fade-in flex flex-col items-center justify-center text-center">
                          <h3 className="text-xl font-bold text-brand-text-primary">Ready to Generate</h3>
                          <p className="text-brand-text-secondary mt-2">Click the button below the image to create a prompt.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* History Sidebar */}
          <div className="w-full lg:w-96 lg:sticky lg:top-8">
            <PromptHistory
              history={promptHistory}
              onSelectItem={handleSelectHistoryItem}
              onClearHistory={handleClearHistory}
            />
          </div>

        </main>
        <footer className="text-center p-4 mt-12 text-brand-text-secondary text-sm">
          <p>Powered by Gemini API</p>
        </footer>
      </div>
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} onSave={handleSaveApiKey} />}
    </>
  );
};

export default App;