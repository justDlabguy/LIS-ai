import express from 'express';
import {
  createTestResult,
  getTestResults,
  getTestResultById,
  updateTestResult,
  deleteTestResult,
} from '../controllers/testResultController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Routes
router.post('/', authorize('TECHNICIAN', 'ADMIN'), createTestResult);
router.get('/sample/:sampleId', getTestResults);
router.get('/:id', getTestResultById);
router.put('/:id', authorize('TECHNICIAN', 'ADMIN'), updateTestResult);
router.delete('/:id', authorize('ADMIN'), deleteTestResult);

export default router; 