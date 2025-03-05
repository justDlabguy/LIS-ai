import { api } from '@/lib/axios';
import { TestResult, CreateTestResultData, UpdateTestResultData } from '@/types/testResult';

export const testResultService = {
  async getAllTestResults(): Promise<TestResult[]> {
    const response = await api.get<TestResult[]>('/test-results');
    return response.data;
  },

  async getTestResultById(id: string): Promise<TestResult> {
    const response = await api.get<TestResult>(`/test-results/${id}`);
    return response.data;
  },

  async createTestResult(data: CreateTestResultData): Promise<TestResult> {
    const response = await api.post<TestResult>('/test-results', data);
    return response.data;
  },

  async updateTestResult(id: string, data: UpdateTestResultData): Promise<TestResult> {
    const response = await api.patch<TestResult>(`/test-results/${id}`, data);
    return response.data;
  },

  async deleteTestResult(id: string): Promise<void> {
    await api.delete(`/test-results/${id}`);
  },

  async requestAIAnalysis(id: string): Promise<TestResult> {
    const response = await api.post<TestResult>(`/test-results/${id}/analyze`);
    return response.data;
  },
}; 