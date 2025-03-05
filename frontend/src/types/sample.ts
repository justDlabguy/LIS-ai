import { User } from './user';
import { TestResult } from './testResult';

export type SampleStatus = 'REGISTERED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';

export interface Sample {
  id: string;
  barcode: string;
  patientName: string;
  patientId: string;
  status: SampleStatus;
  testResults: TestResult[];
  createdBy: User;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSampleData {
  patientName: string;
  patientId: string;
  barcode: string;
}

export interface UpdateSampleData {
  status: SampleStatus;
} 