import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import LifestyleData from '../models/LifestyleData';

export const saveLifestyleData = async (req: AuthRequest, res: Response) => {
  try {
    const { date, steps, waterIntake, sleepHours, exerciseMinutes } = req.body;

    const existingData = await LifestyleData.findOne({
      userId: req.user!._id,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999)
      },
    });

    if (existingData) {
      existingData.steps = steps;
      existingData.waterIntake = waterIntake;
      existingData.sleepHours = sleepHours;
      existingData.exerciseMinutes = exerciseMinutes;
      await existingData.save();
    } else {
      const lifestyleData = new LifestyleData({
        userId: req.user!._id,
        date: new Date(date),
        steps,
        waterIntake,
        sleepHours,
        exerciseMinutes,
      });
      await lifestyleData.save();
    }

    res.json({ message: 'Lifestyle data saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getLifestyleData = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query: any = { userId: req.user!._id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const lifestyleData = await LifestyleData.find(query)
      .sort({ date: -1 })
      .limit(30);

    res.json(lifestyleData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getHealthInsights = async (req: AuthRequest, res: Response) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const lifestyleData = await LifestyleData.find({
      userId: req.user!._id,
      date: { $gte: thirtyDaysAgo },
    });

    if (lifestyleData.length === 0) {
      return res.json({
        message: 'No data available for the last 30 days',
        insights: [],
      });
    }

    const avgSteps = Math.round(
      lifestyleData.reduce((sum, data) => sum + data.steps, 0) / lifestyleData.length
    );
    const avgWater = Math.round(
      lifestyleData.reduce((sum, data) => sum + data.waterIntake, 0) / lifestyleData.length
    );
    const avgSleep = Math.round(
      lifestyleData.reduce((sum, data) => sum + data.sleepHours, 0) / lifestyleData.length
    );
    const avgExercise = Math.round(
      lifestyleData.reduce((sum, data) => sum + data.exerciseMinutes, 0) / lifestyleData.length
    );

    const insights = [];

    if (avgSteps < 8000) {
      insights.push('Consider increasing your daily steps to 8000+ for better cardiovascular health');
    }
    if (avgWater < 8) {
      insights.push('Try to drink at least 8 glasses of water daily');
    }
    if (avgSleep < 7) {
      insights.push('Aim for 7-9 hours of sleep per night for optimal heart health');
    }
    if (avgExercise < 30) {
      insights.push('Target at least 30 minutes of exercise daily');
    }

    res.json({
      averages: {
        steps: avgSteps,
        water: avgWater,
        sleep: avgSleep,
        exercise: avgExercise,
      },
      insights,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
