// src/components/features/analysis/KeyDecisions.tsx
import { AnalysisResult } from '../../../types/analysis';

type KeyDecisionsProps = {
  analysis: AnalysisResult | null;
  isLoading: boolean;
};

export const KeyDecisions = ({ analysis, isLoading }: KeyDecisionsProps) => {
  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="p-6">
          <div className="h-6 bg-gray-200 dark:bg-dark-600 rounded w-1/3 mb-6"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 mb-4 last:mb-0">
              <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-dark-600 mt-1"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 dark:bg-dark-600 rounded mb-1.5 w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-4/5"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analysis || !analysis.keyDecisions || analysis.keyDecisions.length === 0) {
    return (
      <div className="card">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Key Decisions</h2>
          <p className="text-gray-500 dark:text-gray-400 italic">No key decisions identified.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Decisions</h2>
        
        <ul className="space-y-3">
          {analysis.keyDecisions.map((decision, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 flex items-center justify-center text-xs font-semibold">
                {index + 1}
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                {decision}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};