import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import LifestyleData from '../models/LifestyleData';

export const saveLifestyleData = async (req: AuthRequest, res: Response) => {
  try {
    const { date, steps, waterIntake, sleepHours, exerciseMinutes } = req.body;
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const entryDate = date ? new Date(date) : new Date();
    if (Number.isNaN(entryDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date provided' });
    }

    const dayStart = new Date(entryDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(entryDate);
    dayEnd.setHours(23, 59, 59, 999);

    await LifestyleData.findOneAndUpdate(
      {
        userId: req.user._id,
        date: { $gte: dayStart, $lte: dayEnd }
      },
      {
        $set: {
          userId: req.user._id,
          date: dayStart,
          steps: Number(steps) || 0,
          waterIntake: Number(waterIntake) || 0,
          sleepHours: Number(sleepHours) || 0,
          exerciseMinutes: Number(exerciseMinutes) || 0
        }
      },
      { upsert: true, new: true }
    );

    res.json({ message: 'Lifestyle data saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getLifestyleData = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    let query: any = { userId: req.user!._id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    } else {
      const defaultStart = new Date();
      defaultStart.setDate(defaultStart.getDate() - 30);
      query.date = { $gte: defaultStart };
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
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const lifestyleData = await LifestyleData.find({
      userId: req.user!._id,
      date: { $gte: thirtyDaysAgo },
    });

    if (lifestyleData.length === 0) {
      return res.json({
        averages: { steps: 0, water: 0, sleep: 0, exercise: 0 },
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
