import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  submitDoctorVerification,
  getDoctorProfile,
  createArticle,
  updateArticle,
  getDoctorArticles,
  deleteArticle,
  getAllPublishedArticles,
} from '../controllers/doctorController';

const router = Router();

// Doctor verification and profile
router.post('/verify', authenticate, submitDoctorVerification);
router.get('/profile', authenticate, getDoctorProfile);

// Article management (for verified doctors)
router.post('/articles', authenticate, createArticle);
router.get('/articles', authenticate, getDoctorArticles);
router.put('/articles/:id', authenticate, updateArticle);
router.delete('/articles/:id', authenticate, deleteArticle);

// Public articles (for everyone)
router.get('/articles/published', getAllPublishedArticles);

export default router;
