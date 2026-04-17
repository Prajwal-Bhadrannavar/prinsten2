import express from 'express';
import { authenticate } from '../middleware/auth';
import { getQuestions, calculateRisk, saveAssessment, getAssessmentHistory } from '../controllers/assessmentController';

const router = express.Router();

router.get('/questions', getQuestions);
router.post('/calculate', calculateRisk);
router.post('/save', authenticate, saveAssessment);
router.get('/history', authenticate, getAssessmentHistory);

export default router;
