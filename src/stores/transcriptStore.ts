// src/stores/transcriptStore.ts
import { create } from 'zustand';
import type { Transcript } from '../types/transcript';

interface TranscriptState {
  transcript: Transcript | null;
  recentTranscripts: Transcript[];
  isLoading: boolean;
  error: string | null;
  setTranscript: (transcript: Transcript | null) => void;
  updateTranscript: (transcript: Transcript) => void;
  addToRecent: (transcript: Transcript) => void;
  clearTranscript: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTranscriptStore = create<TranscriptState>((set) => ({
  transcript: null,
  recentTranscripts: [],
  isLoading: false,
  error: null,
  
  setTranscript: (transcript) => set({ transcript }),
  
  updateTranscript: (updatedTranscript: Transcript) =>
    set((state) => {
      // If we're updating the current active transcript
      if (state.transcript && state.transcript.id === updatedTranscript.id) {
        return { transcript: { ...updatedTranscript, updatedAt: new Date().toISOString() } };
      }
      return state;
    }),
  
  addToRecent: (transcript: Transcript) =>
    set((state) => {
      // Check if already exists in recent list
      const exists = state.recentTranscripts.some(t => t.id === transcript.id);
      
      if (!exists) {
        // Add to beginning of the array, limit to 10 recent items
        return {
          recentTranscripts: [transcript, ...state.recentTranscripts].slice(0, 10)
        };
      }
      return state;
    }),
  
  clearTranscript: () => set({ transcript: null }),
  
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  
  setError: (error: string | null) => set({ error })
}));

