// src/components/features/transcript/TranscriptEditor.tsx
import { useState, useEffect } from 'react';
import { useTranscriptStore } from '@stores/transcriptStore';

export const TranscriptEditor = () => {
  const { transcript, updateTranscript } = useTranscriptStore();
  const [content, setContent] = useState('');
  
  useEffect(() => {
    if (transcript) {
      setContent(transcript.content);
    }
  }, [transcript]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const handleSave = () => {
    if (transcript) {
      updateTranscript({
        ...transcript,
        content
      });
    }
  };
  
  if (!transcript) {
    return <div className="text-gray-700 dark:text-gray-300">No transcript loaded</div>;
  }
  
  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow dark:shadow-dark-700">
      <div className="border-b dark:border-dark-700 px-4 py-3 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {transcript.title}
        </h3>
        <button
          type="button"
          className="px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
      
      <div className="p-4">
        <textarea
          className="w-full h-96 p-4 border dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
          value={content}
          onChange={handleChange}
          placeholder="Meeting transcript content..."
        />
      </div>
    </div>
  );
};