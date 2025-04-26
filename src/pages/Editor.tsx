// src/pages/Editor.tsx
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@components/layout/PageContainer';
import { TranscriptEditor } from '@components/features/transcript/TranscriptEditor';
import { useTranscriptStore } from '@stores/transcriptStore';
import { useAnalysisStore } from '@stores/analysisStore';

export const Editor = () => {
  const navigate = useNavigate();
  const { transcript } = useTranscriptStore();
  const { analyzeTranscript, setIsLoading } = useAnalysisStore();
  
  const handleAnalyze = async () => {
    if (!transcript) return;
    
    setIsLoading(true);
    try {
      await analyzeTranscript(transcript);
      navigate('/results');
    } catch (error) {
      console.error('Error analyzing transcript:', error);
      // Show error message
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            onClick={() => navigate('/')}
          >
            ← Back
          </button>
        </div>
        <div>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            onClick={handleAnalyze}
          >
            Analyze Transcript
          </button>
        </div>
      </div>
      
      <TranscriptEditor />
    </PageContainer>
  );
};