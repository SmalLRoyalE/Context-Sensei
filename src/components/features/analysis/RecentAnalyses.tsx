// src/components/features/analysis/RecentAnalyses.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface RecentAnalysis {
  id: string;
  title: string;
  date: string;
  summary: string;
}

export const RecentAnalyses: React.FC = () => {
  // This would normally come from a store or API
  const recentAnalyses: RecentAnalysis[] = [];

  if (recentAnalyses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No recent analyses found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recentAnalyses.map((analysis) => (
        <Link
          key={analysis.id}
          to={`/analysis/${analysis.id}`}
          className="block bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {analysis.title}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {new Date(analysis.date).toLocaleDateString()}
          </p>
          <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
            {analysis.summary}
          </p>
        </Link>
      ))}
    </div>
  );
};