import React from 'react';

interface ShareOptionsProps {
  results: any; // Using any for now since we don't have the exact type
}

export const ShareOptions: React.FC<ShareOptionsProps> = ({ results }) => {
  const handleShare = async (method: 'copy' | 'download') => {
    try {
      if (method === 'copy') {
        await navigator.clipboard.writeText(JSON.stringify(results, null, 2));
        alert('Results copied to clipboard!');
      } else {
        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'analysis-results.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error sharing results:', error);
      alert('Failed to share results. Please try again.');
    }
  };

  return (
    <div className="mt-8 bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Share Results</h3>
      <div className="flex space-x-4">
        <button
          onClick={() => handleShare('copy')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Copy to Clipboard
        </button>
        <button
          onClick={() => handleShare('download')}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Download JSON
        </button>
      </div>
    </div>
  );
}; 