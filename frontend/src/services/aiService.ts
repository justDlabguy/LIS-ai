import axios from 'axios';
import { AI_SERVICE_CONFIG } from '@/config/ai';
import { TestType } from '@/types/testResult';

const api = axios.create({
  baseURL: AI_SERVICE_CONFIG.baseUrl,
});

interface AnalysisRequest {
  test_type: TestType;
  raw_data: Record<string, any>;
}

interface AnalysisResponse {
  results: Record<string, any>;
  recommendations: string[];
  flags: Record<string, string>;
  timestamp: string;
}

export const aiService = {
  async analyzeTestResult(data: AnalysisRequest): Promise<AnalysisResponse> {
    let attempts = 0;
    
    while (attempts < AI_SERVICE_CONFIG.retryAttempts) {
      try {
        const response = await api.post<AnalysisResponse>(
          AI_SERVICE_CONFIG.endpoints.analyze,
          data
        );
        return response.data;
      } catch (error) {
        attempts++;
        if (attempts === AI_SERVICE_CONFIG.retryAttempts) {
          throw error;
        }
        await new Promise(resolve => 
          setTimeout(resolve, AI_SERVICE_CONFIG.retryDelay * attempts)
        );
      }
    }
    
    throw new Error('Failed to analyze test result after multiple attempts');
  },

  async checkHealth(): Promise<boolean> {
    try {
      const response = await api.get(AI_SERVICE_CONFIG.endpoints.health);
      return response.data.status === 'healthy';
    } catch (error) {
      return false;
    }
  },
}; 