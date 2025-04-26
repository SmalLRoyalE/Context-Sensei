// src/types/transcript.ts

export interface Transcript {
  id: string;
  title: string;
  content: string;
  sourceFile: string;
  createdAt: string;
  updatedAt?: string;
  userId?: string;
  meetingDate?: string;
  participants?: string[];
  duration?: number; // in minutes
}

export interface TranscriptUploadResponse {
  success: boolean;
  transcript: Transcript;
  message?: string;
}

