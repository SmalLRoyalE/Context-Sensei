import apiClient from '../api/client';
import { endpoints } from '../api/endpoints';
import type { AnalysisResult } from '../../types/analysis';

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
    try {
        const response = await apiClient.post(endpoints.analysis.create, { text });
        return response.data;
    } catch (error) {
        console.error('Error analyzing text:', error);
        throw new Error('Failed to analyze text');
    }
}; 