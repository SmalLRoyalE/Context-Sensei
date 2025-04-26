// src/components/features/analysis/ActionItems.tsx
import { useState } from 'react';
import { ActionItem, AnalysisResult } from '../../../types/analysis';

type ActionItemsProps = {
  analysis: AnalysisResult | null;
  isLoading: boolean;
};

export const ActionItems = ({ analysis, isLoading }: ActionItemsProps) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="p-6">
          <div className="h-6 bg-gray-200 dark:bg-dark-600 rounded w-1/3 mb-6"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="mb-4 border-b border-gray-100 dark:border-dark-700 pb-4 last:border-0 last:pb-0">
              <div className="h-5 bg-gray-200 dark:bg-dark-600 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analysis || !analysis.actionItems || analysis.actionItems.length === 0) {
    return (
      <div className="card">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Action Items</h2>
          <p className="text-gray-500 dark:text-gray-400 italic">No action items identified.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Action Items</h2>
        
        <div className="divide-y divide-gray-100 dark:divide-dark-700">
          {analysis.actionItems.map((item) => (
            <ActionItemCard 
              key={item.id} 
              item={item} 
              isExpanded={!!expandedItems[item.id || '']}
              onToggle={() => item.id && toggleItem(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

type ActionItemCardProps = {
  item: ActionItem;
  isExpanded: boolean;
  onToggle: () => void;
};

const ActionItemCard = ({ item, isExpanded, onToggle }: ActionItemCardProps) => {
  const priorityClasses = {
    high: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50',
    medium: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900/50',
    low: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50'
  };
  
  const statusClasses = {
    'pending': 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-dark-700',
    'in-progress': 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
    'completed': 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
  };

  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div 
        className="flex items-start gap-3 cursor-pointer" 
        onClick={onToggle}
      >
        <div className="pt-0.5">
          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
            item.status === 'completed' 
              ? 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-600' 
              : 'border-gray-300 dark:border-gray-600'
          }`}>
            {item.status === 'completed' && (
              <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <p className="text-gray-900 dark:text-gray-100 font-medium">{item.task}</p>
          
          <div className={`flex flex-wrap items-center gap-2 mt-2 ${isExpanded ? '' : 'line-clamp-1'}`}>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {item.assignee}
            </div>
            
            {item.dueDate && (
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {item.dueDate}
              </div>
            )}
            
            {item.priority && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${priorityClasses[item.priority] || ''}`}>
                {item.priority}
              </span>
            )}
            
            {item.status && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusClasses[item.status] || ''}`}>
                {item.status}
              </span>
            )}
          </div>
        </div>
        
        <div className="pt-1">
          <svg className={`h-5 w-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};