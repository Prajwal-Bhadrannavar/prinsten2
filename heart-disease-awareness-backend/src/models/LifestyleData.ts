import mongoose, { Document, Schema } from 'mongoose';

export interface ILifestyleData extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  steps: number;
  waterIntake: number; // in glasses
  sleepHours: number;
  exerciseMinutes: number;
  createdAt: Date;
}

const LifestyleDataSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  steps: {
    type: Number,
    default: 0,
    min: 0,
  },
  waterIntake: {
    type: Number,
    default: 0,
    min: 0,
  },
  sleepHours: {
    type: Number,
    default: 0,
    min: 0,
    max: 24,
  },
  exerciseMinutes: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ILifestyleData>('LifestyleData', LifestyleDataSchema);
