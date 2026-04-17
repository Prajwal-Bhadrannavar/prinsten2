import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getPendingVerifications,
  approveDoctor,
  rejectDoctor,
  getAllDoctors,
} from '../controllers/adminController';

const router = Router();

// Admin routes for doctor verification
router.get('/doctors/pending', authenticate, getPendingVerifications);
router.get('/doctors/all', authenticate, getAllDoctors);
router.post('/doctors/:doctorId/approve', authenticate, approveDoctor);
router.post('/doctors/:doctorId/reject', authenticate, rejectDoctor);

export default router;
