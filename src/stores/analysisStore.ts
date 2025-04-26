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
  addAnalysis: (analysis: Analysis) => void;
  removeAnalysis: (id: string) => void;
  clearAnalyses: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  recentAnalyses: [],
  addAnalysis: (analysis) =>
    set((state) => ({
      recentAnalyses: [analysis, ...state.recentAnalyses].slice(0, 10),
    })),
  removeAnalysis: (id) =>
    set((state) => ({
      recentAnalyses: state.recentAnalyses.filter((a) => a.id !== id),
    })),
  clearAnalyses: () => set({ recentAnalyses: [] }),
}));