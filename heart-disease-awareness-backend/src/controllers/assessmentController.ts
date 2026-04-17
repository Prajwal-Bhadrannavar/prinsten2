import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Assessment from '../models/Assessment';

const riskQuestions = [
  { id: 1, question: 'Do you experience chest pain during physical activity?', weight: 3 },
  { id: 2, question: 'Do you have high blood pressure?', weight: 3 },
  { id: 3, question: 'Do you feel shortness of breath with minimal exertion?', weight: 2 },
  { id: 4, question: 'Do you smoke?', weight: 4 },
  { id: 5, question: 'Do you exercise regularly (at least 30 minutes, 3 times per week)?', weight: -2 },
  { id: 6, question: 'Do you have diabetes?', weight: 3 },
  { id: 7, question: 'Is your BMI above 30?', weight: 2 },
  { id: 8, question: 'Do you have high cholesterol?', weight: 2 },
  { id: 9, question: 'Do you experience frequent fatigue?', weight: 1 },
  { id: 10, question: 'Are you over 65 years old?', weight: 1 },
  { id: 11, question: 'Do you have a family history of heart disease?', weight: 2 },
  { id: 12, question: 'Do you consume more than 2 alcoholic drinks per day?', weight: 2 },
];

export const getQuestions = (req: AuthRequest, res: Response) => {
  try {
    res.json(riskQuestions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const calculateRisk = (req: AuthRequest, res: Response) => {
  try {
    const { responses } = req.body;
    
    let riskScore = 10; // Base score
    
    responses.forEach((response: { questionId: number; answer: boolean }) => {
      const question = riskQuestions.find(q => q.id === response.questionId);
      if (question) {
        if (response.answer) {
          riskScore += question.weight;
        }
      }
    });

    riskScore = Math.max(0, Math.min(100, riskScore));

    let riskLevel: 'low' | 'moderate' | 'high';
    let recommendations: string[];

    if (riskScore <= 30) {
      riskLevel = 'low';
      recommendations = [
        'Continue maintaining a healthy lifestyle',
        'Regular exercise (30 minutes, 3-5 times per week)',
        'Balanced diet rich in fruits and vegetables',
        'Regular health check-ups',
      ];
    } else if (riskScore <= 60) {
      riskLevel = 'moderate';
      recommendations = [
        'Consult with a healthcare provider for a thorough evaluation',
        'Implement regular exercise routine',
        'Adopt a heart-healthy diet (low sodium, low saturated fats)',
        'Monitor blood pressure regularly',
        'Consider stress management techniques',
        'Quit smoking if you smoke',
      ];
    } else {
      riskLevel = 'high';
      recommendations = [
        'Schedule an appointment with a cardiologist immediately',
        'Follow medical treatment plan strictly',
        'Make immediate lifestyle changes',
        'Monitor vital signs daily',
        'Consider cardiac rehabilitation program',
        'Emergency action plan should be in place',
      ];
    }

    res.json({
      riskScore,
      riskLevel,
      recommendations,
      disclaimer: 'This is not a medical diagnosis. Please consult a doctor for proper medical advice.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const saveAssessment = async (req: AuthRequest, res: Response) => {
  try {
    const { responses, riskScore, riskLevel, recommendations } = req.body;

    const assessment = new Assessment({
      userId: req.user!._id,
      responses,
      riskScore,
      riskLevel,
      recommendations,
    });

    await assessment.save();

    res.status(201).json({
      message: 'Assessment saved successfully',
      assessment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAssessmentHistory = async (req: AuthRequest, res: Response) => {
  try {
    const assessments = await Assessment.find({ userId: req.user!._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
