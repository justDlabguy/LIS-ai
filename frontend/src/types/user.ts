export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'TECHNICIAN' | 'PATHOLOGIST';
  createdAt: string;
  updatedAt: string;
} 