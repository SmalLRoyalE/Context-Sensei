// src/components/features/analysis/KeyDecisions.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { AnalysisResult } from '@/types/analysis';

interface KeyDecisionsProps {
  analysis: AnalysisResult;
}

export const KeyDecisions: React.FC<KeyDecisionsProps> = ({ analysis }) => {
  if (!analysis.keyPoints?.length) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Key Points</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {analysis.keyPoints.map((point: string, index: number) => (
              <div
                key={`${point}-${index}`}
                className="flex items-start space-x-4 p-4 rounded-lg border"
              >
                <div className="flex-1">
                  <p className="font-medium">{point}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};