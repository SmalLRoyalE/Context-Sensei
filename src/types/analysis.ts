// src/types/analysis.ts

export interface ActionItem {
  id?: string;
  task: string;
  assignee: string;
  dueDate?: string;
  status?: 'pending' | 'completed' | 'in-progress';
  priority?: 'low' | 'medium' | 'high';
}

export interface TaskTableRow {
  assignee: string;
  tasks: string[];
  assignedDate?: string;
  deadline: string;
  priority: string;
}

export interface TaskTable {
  rows: TaskTableRow[];
  metadata: {
    totalTasks: number;
    tasksWithDeadlines: number;
    highPriorityTasks: number;
  };
}

export interface AnalysisResult {
  id: string;
  transcriptId: string;
  summary: string;
  keyDecisions: string[];
  actionItems: ActionItem[];
  taskTable?: TaskTable;
  entities?: {
    people: string[];
    organizations: string[];
    dates: string[];
    topics: string[];
  };
  createdAt: string;
  updatedAt?: string;
}

export interface AnalysisRequest {
  transcriptId: string;
  options?: {
    includeEntities?: boolean;
    language?: string;
  };
}

export interface AnalysisResponse {
  success: boolean;
  analysis: AnalysisResult;
  message?: string;
}

