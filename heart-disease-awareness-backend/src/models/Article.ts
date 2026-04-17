import mongoose, { Document, Schema } from 'mongoose';

export interface IArticle extends Document {
  doctorId: mongoose.Types.ObjectId;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  readTime: string;
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema: Schema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Heart Disease', 'Diet', 'Exercise', 'Medication', 'Prevention', 'Symptoms', 'Treatment', 'Research', 'General'],
  },
  excerpt: {
    type: String,
    required: true,
  },
  content: [{
    type: String,
    required: true,
  }],
  readTime: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],
  isPublished: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ArticleSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export default mongoose.model<IArticle>('Article', ArticleSchema);
