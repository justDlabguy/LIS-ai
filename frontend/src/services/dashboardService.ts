import { api } from '@/lib/axios';
import { Sample } from '@/types/sample';
import { TestResult } from '@/types/testResult';

interface DashboardStats {
  totalSamples: number;
  pendingTests: number;
  completedTests: number;
  successRate: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  async getRecentSamples(): Promise<Sample[]> {
    const response = await api.get<Sample[]>('/dashboard/recent-samples');
    return response.data;
  },

  async getRecentResults(): Promise<TestResult[]> {
    const response = await api.get<TestResult[]>('/dashboard/recent-results');
    return response.data;
  },
}; 