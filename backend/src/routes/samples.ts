import express from 'express';
import {
  createSample,
  getAllSamples,
  getSampleById,
  updateSampleStatus,
  deleteSample,
} from '../controllers/sampleController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Routes
router.post('/', authorize('TECHNICIAN', 'ADMIN'), createSample);
router.get('/', getAllSamples);
router.get('/:id', getSampleById);
router.patch('/:id/status', authorize('TECHNICIAN', 'ADMIN'), updateSampleStatus);
router.delete('/:id', authorize('ADMIN'), deleteSample);

export default router; 