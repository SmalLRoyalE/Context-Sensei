import React from 'react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-96 p-4 text-gray-900 dark:text-gray-100 bg-transparent focus:outline-none resize-none"
        placeholder="Enter or paste your text here..."
      />
    </div>
  );
}; 