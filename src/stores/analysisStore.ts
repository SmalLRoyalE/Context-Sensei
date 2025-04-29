// src/stores/analysisStore.ts
import { create } from 'zustand';
import type { AnalysisResult } from '../types/analysis';
import type { Transcript } from '../types/transcript';
import { mockAnalyzeTranscript } from '../services/ai/nlpService';

interface AnalysisStore {
  recentAnalyses: AnalysisResult[];
  analysis: AnalysisResult | null;
  isLoading: boolean;
  addAnalysis: (analysis: AnalysisResult) => void;
  removeAnalysis: (id: string) => void;
  clearAnalyses: () => void;
  analyzeTranscript: (transcript: Transcript) => Promise<void>;
  setIsLoading: (loading: boolean) => void;
  setAnalysis: (analysis: AnalysisResult | null) => void;
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
      set({ analysis: result });
    } catch (error) {
      console.error('Error analyzing transcript:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  setIsLoading: (loading) => set({ isLoading: loading }),
  setAnalysis: (analysis) => set({ analysis }),
}));