// src/pages/Results.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@components/layout/PageContainer';
import { Summary } from '@components/features/analysis/Summary';
import { KeyDecisions } from '@components/features/analysis/KeyDecisions';
import { ActionItems } from '@components/features/analysis/ActionItems';
import { ShareModal } from '@components/features/analysis/ShareModal';
import { useAnalysisStore } from '@stores/analysisStore';

export const Results = () => {
  const navigate = useNavigate();
  const { analysis, isLoading } = useAnalysisStore();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const handleDownload = () => {
    // Implementation for downloading results
    // This will be implemented in a future update
    alert("Download functionality will be implemented soon!");
  };

  const handleBackToEditor = () => {
    navigate('/editor');
  };
  
  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            onClick={handleBackToEditor}
          >
            ← Back to Editor
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsShareModalOpen(true)}
            disabled={isLoading || !analysis}
          >
            Share
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            onClick={handleDownload}
            disabled={isLoading || !analysis}
          >
            Download
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Summary section */}
        <Summary analysis={analysis} isLoading={isLoading} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Decisions */}
          <KeyDecisions analysis={analysis} isLoading={isLoading} />
          
          {/* Action Items */}
          <ActionItems analysis={analysis} isLoading={isLoading} />
        </div>
      </div>
      
      {/* Share Modal */}
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        analysis={analysis} 
      />
    </PageContainer>
  );
};