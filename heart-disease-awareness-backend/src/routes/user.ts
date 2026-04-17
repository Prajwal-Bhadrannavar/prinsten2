import express from 'express';
import { authenticate } from '../middleware/auth';
import { saveLifestyleData, getLifestyleData, getHealthInsights } from '../controllers/userController';

const router = express.Router();

router.post('/lifestyle', authenticate, saveLifestyleData);
router.get('/lifestyle', authenticate, getLifestyleData);
router.get('/insights', authenticate, getHealthInsights);

export default router;
