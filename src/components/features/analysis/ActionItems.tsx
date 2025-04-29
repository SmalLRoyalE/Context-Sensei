// src/components/features/analysis/ActionItems.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { AnalysisResult } from '@/types/analysis';

interface ActionItemsProps {
  analysis: AnalysisResult;
}

export const ActionItems: React.FC<ActionItemsProps> = ({ analysis }) => {
  if (!analysis.actionItems?.length) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Action Items</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {analysis.actionItems.map((item, index) => (
              <div
                key={`${item.task}-${index}`}
                className="flex items-start space-x-4 p-4 rounded-lg border"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.task}</p>
                  <div className="mt-2">
                    <Badge variant="outline">Assignee: {item.assignee}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};