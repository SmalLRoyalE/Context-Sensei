// src/components/common/FileUploader.tsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranscriptStore } from '../../stores/transcriptStore';

export const FileUploader = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setTranscript } = useTranscriptStore();
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = async (file: File) => {
    try {
      setIsUploading(true);
      const text = await file.text();
      
      // Simulate a brief loading period for better UX
      setTimeout(() => {
        setTranscript({
          id: Date.now().toString(),
          title: file.name,
          content: text,
          sourceFile: file.name,
          createdAt: new Date().toISOString()
        });
        
        navigate('/editor');
      }, 800);
    } catch (error) {
      console.error('Error reading file:', error);
      setIsUploading(false);
      // Could add a toast notification here
    }
  };
  
  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={`relative border-2 ${
          dragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-dashed border-gray-300 dark:border-dark-600 hover:border-gray-400 dark:hover:border-dark-500'
        } rounded-xl transition-all duration-200 p-8 sm:p-12 text-center`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="flex flex-col items-center py-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
            <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
              Processing transcript...
            </p>
          </div>
        ) : (
          <>
            <svg
              className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            
            <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
              Drop your meeting transcript here
            </h3>
            
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Drag and drop your file here, or{' '}
              <button
                type="button"
                className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 focus:outline-none focus:underline transition-colors"
                onClick={() => inputRef.current?.click()}
              >
                browse
              </button>{' '}
              to select a file
            </p>
            
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
              Supported formats: .txt, .pdf, .json
            </p>
            
            <input
              ref={inputRef}
              type="file"
              accept=".txt,.pdf,.json"
              className="hidden"
              onChange={handleChange}
            />
          </>
        )}

        {/* Animated border effect on drag */}
        {dragActive && (
          <div 
            className="absolute inset-0 border-2 border-primary-500 dark:border-primary-400 rounded-xl pointer-events-none animate-pulse"
          ></div>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your files are processed locally and securely - we value your privacy.
        </p>
      </div>
    </div>
  );
};