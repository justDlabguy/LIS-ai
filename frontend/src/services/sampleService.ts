import { api } from '@/lib/axios';
import { Sample, CreateSampleData, UpdateSampleData } from '@/types/sample';

export const sampleService = {
  async getAllSamples(): Promise<Sample[]> {
    const response = await api.get<Sample[]>('/samples');
    return response.data;
  },

  async getSampleById(id: string): Promise<Sample> {
    const response = await api.get<Sample>(`/samples/${id}`);
    return response.data;
  },

  async createSample(data: CreateSampleData): Promise<Sample> {
    const response = await api.post<Sample>('/samples', data);
    return response.data;
  },

  async updateSampleStatus(id: string, data: UpdateSampleData): Promise<Sample> {
    const response = await api.patch<Sample>(`/samples/${id}/status`, data);
    return response.data;
  },

  async deleteSample(id: string): Promise<void> {
    await api.delete(`/samples/${id}`);
  },
}; 