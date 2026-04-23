import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getPendingVerifications,
  approveDoctor,
  rejectDoctor,
  deleteDoctor,
  getAllDoctors,
} from '../controllers/adminController';

const router = Router();

// Admin routes for doctor verification
router.get('/doctors/pending', authenticate, getPendingVerifications);
router.get('/doctors/all', authenticate, getAllDoctors);
router.post('/doctors/:doctorId/approve', authenticate, approveDoctor);
router.post('/doctors/:doctorId/reject', authenticate, rejectDoctor);
router.delete('/doctors/:doctorId', authenticate, deleteDoctor);

export default router;
