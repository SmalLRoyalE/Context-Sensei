// src/pages/Results.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Summary } from '@/components/features/analysis/Summary';
import { ActionItems } from '@/components/features/analysis/ActionItems';
import { KeyDecisions } from '@/components/features/analysis/KeyDecisions';
import { useAnalysisStore } from '@/stores/analysisStore';
import type { AnalysisResult } from '@/types/analysis';

export const Results: React.FC = () => {
  const navigate = useNavigate();
  const { analysis, isLoading } = useAnalysisStore();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Analyzing your content...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Analysis Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't find any analysis results. Please try analyzing your content again.
          </p>
          <Button onClick={() => navigate('/')}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analysis Results</h1>
        <Button onClick={() => navigate('/')}>New Analysis</Button>
      </div>

      <div className="grid gap-6">
        <Summary analysis={analysis} />
        <ActionItems analysis={analysis} />
        <KeyDecisions analysis={analysis} />
      </div>
    </div>
  );
};