
import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full bg-brand-surface rounded-xl shadow-lg p-6 relative animate-fade-in flex flex-col h-full animate-pulse">
      <div className="flex justify-between items-center mb-4">
        {/* Title placeholder */}
        <div className="h-6 bg-brand-secondary/50 rounded-md w-1/3"></div>
        {/* Button placeholder */}
        <div className="h-8 w-8 bg-brand-secondary/50 rounded-md"></div>
      </div>
      <div className="space-y-3 mt-4 flex-grow">
        {/* Text line placeholders */}
        <div className="h-4 bg-brand-secondary/50 rounded-md w-full"></div>
        <div className="h-4 bg-brand-secondary/50 rounded-md w-5/6"></div>
        <div className="h-4 bg-brand-secondary/50 rounded-md w-full"></div>
        <div className="h-4 bg-brand-secondary/50 rounded-md w-3/4"></div>
        <div className="h-4 bg-brand-secondary/50 rounded-md w-4/6"></div>
      </div>
    </div>
  );
};
