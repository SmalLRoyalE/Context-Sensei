// src/components/features/analysis/Summary.tsx
import { AnalysisResult } from '../../../types/analysis';

type SummaryProps = {
  analysis: AnalysisResult | null;
  isLoading: boolean;
};

export const Summary = ({ analysis, isLoading }: SummaryProps) => {
  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="p-6">
          <div className="h-6 bg-gray-200 dark:bg-dark-600 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded mb-2.5 w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded mb-2.5 w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded mb-2.5 w-11/12"></div>
          <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded mb-2.5 w-4/5"></div>
          <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-2/3"></div>
        </div>
      </div>
    );
  }
  
  if (!analysis) {
    return (
      <div className="card">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Summary</h2>
          <p className="text-gray-500 dark:text-gray-400 italic">No analysis data available yet.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Summary</h2>
          <div className="badge badge-primary">
            {formatDate(analysis.createdAt)}
          </div>
        </div>
        
        <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none">
          <p>{analysis.summary}</p>
        </div>
        
        {analysis.entities && (
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">Key Entities</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.entities.people.slice(0, 3).map((person, index) => (
                <span key={index} className="badge badge-primary">
                  {person}
                </span>
              ))}
              {analysis.entities.topics.slice(0, 3).map((topic, index) => (
                <span key={index} className="badge badge-secondary">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}