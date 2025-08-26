
import React, { useCallback, useState, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null | undefined) => {
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  }, [onImageUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`w-full p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ease-in-out
        ${isDragging ? 'border-brand-primary bg-brand-primary/10' : 'border-brand-secondary hover:border-brand-primary'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
      />
      <div className="flex flex-col items-center justify-center text-center">
        <UploadIcon className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-brand-primary' : 'text-brand-text-secondary'}`} />
        <p className="font-semibold text-brand-text-primary">
          <span className="text-brand-primary">Click to upload</span> or drag and drop
        </p>
        <p className="text-sm text-brand-text-secondary mt-1">PNG, JPG, GIF, WEBP</p>
      </div>
    </div>
  );
};
