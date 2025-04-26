export interface Task {
  name: string;
  tasks: string[];
  assignedDate: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface MeetingAnalysis {
  tasks: Task[];
  summary: string;
  keyPoints: string[];
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  fileId?: string;
}

export interface AnalysisResponse {
  success: boolean;
  data?: MeetingAnalysis;
  error?: string;
}

export interface ShareResponse {
  success: boolean;
  message: string;
  error?: string;
} 