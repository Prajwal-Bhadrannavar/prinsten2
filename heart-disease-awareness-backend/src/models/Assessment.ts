import mongoose, { Document, Schema } from 'mongoose';

export interface IAssessment extends Document {
  userId: mongoose.Types.ObjectId;
  responses: { questionId: number; answer: string }[];
  riskScore: number;
  awarenessScore: number;
  clinicalRiskIndicator: number;
  riskLevel: 'low' | 'moderate' | 'high';
  recommendations: string[];
  createdAt: Date;
}

const AssessmentSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  responses: [{
    questionId: {
      type: Number,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  }],
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  riskLevel: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    required: true,
  },
  recommendations: [{
    type: String,
  }],
  awarenessScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  clinicalRiskIndicator: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IAssessment>('Assessment', AssessmentSchema);
