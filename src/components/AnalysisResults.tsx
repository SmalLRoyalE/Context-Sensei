import React from 'react';

interface AnalysisResult {
  key: string;
  value: string;
}

interface AnalysisResultsProps {
  results: {
    summary: string;
    actionItems: AnalysisResult[];
    keyPoints: AnalysisResult[];
  };
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  return (
    <div className="space-y-8">
      {/* Summary Section */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Summary</h3>
        <p className="text-gray-600 dark:text-gray-300">{results.summary}</p>
      </div>

      {/* Action Items Section */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Action Items</h3>
        <ul className="space-y-3">
          {results.actionItems.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <span className="text-gray-600 dark:text-gray-300">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Key Points Section */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Key Points</h3>
        <ul className="space-y-3">
          {results.keyPoints.map((point, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-gray-600 dark:text-gray-300">{point.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 