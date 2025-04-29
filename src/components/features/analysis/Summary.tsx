// src/components/features/analysis/Summary.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnalysisResult } from '@/types/analysis';

interface SummaryProps {
  analysis: AnalysisResult;
}

export const Summary: React.FC<SummaryProps> = ({ analysis }) => {
  if (!analysis.summary) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{analysis.title || 'Summary'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {analysis.summary}
          </p>
        </div>
      </CardContent>
    </Card>
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