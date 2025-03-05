import { Sample } from './sample';

export type TestType = 'BLOOD_COUNT' | 'BIOCHEMISTRY' | 'URINALYSIS' | 'MICROBIOLOGY';
export type TestStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export interface TestResult {
  id: string;
  sample: Sample;
  sampleId: string;
  testType: TestType;
  rawData: Record<string, any>;
  aiAnalysis?: Record<string, any>;
  status: TestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestResultData {
  sampleId: string;
  testType: TestType;
  rawData: Record<string, any>;
}

export interface UpdateTestResultData {
  rawData: Record<string, any>;
} 