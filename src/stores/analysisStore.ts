// src/stores/analysisStore.ts
import { create } from 'zustand';
import type { AnalysisResult } from '../types/analysis';
import type { Transcript } from '../types/transcript';
import { mockAnalyzeTranscript } from '../services/ai/nlpService';

interface Analysis {
  id: string;
  title: string;
  content: string;
  summary: string;
  actionItems: Array<{
    key: string;
    value: string;
  }>;
  keyPoints: Array<{
    key: string;
    value: string;
  }>;
  createdAt: string;
}

interface AnalysisStore {
  recentAnalyses: Analysis[];
  analysis: Analysis | null;
  isLoading: boolean;
  addAnalysis: (analysis: Analysis) => void;
  removeAnalysis: (id: string) => void;
  clearAnalyses: () => void;
  analyzeTranscript: (transcript: Transcript) => Promise<void>;
  setIsLoading: (loading: boolean) => void;
  setAnalysis: (analysis: Analysis | null) => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  recentAnalyses: [],
  analysis: null,
  isLoading: false,
  addAnalysis: (analysis) =>
    set((state) => ({
      recentAnalyses: [analysis, ...state.recentAnalyses].slice(0, 10),
    })),
  removeAnalysis: (id) =>
    set((state) => ({
      recentAnalyses: state.recentAnalyses.filter((a) => a.id !== id),
    })),
  clearAnalyses: () => set({ recentAnalyses: [] }),
  analyzeTranscript: async (transcript) => {
    set({ isLoading: true });
    try {
      const result = await mockAnalyzeTranscript(transcript);
      // Transform AnalysisResult to Analysis
      const analysis: Analysis = {
        id: result.id || Date.now().toString(),
        title: result.title || 'Analysis Result',
        content: transcript.content,
        summary: result.summary,
        actionItems: result.actionItems.map(item => ({
          key: item.task,
          value: item.assignee
        })),
        keyPoints: result.keyPoints.map(point => ({
          key: point,
          value: ''
        })),
        createdAt: new Date().toISOString()
      };
      set({ analysis });
    } catch (error) {
      console.error('Error analyzing transcript:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  setIsLoading: (loading) => set({ isLoading: loading }),
  setAnalysis: (analysis) => set({ analysis }),
}));