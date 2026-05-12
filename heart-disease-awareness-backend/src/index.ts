import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import assessmentRoutes from './routes/assessment';
import userRoutes from './routes/user';
import doctorRoutes from './routes/doctor';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://prinsten2-git-main-prajwal-bhadrannavars-projects.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/heart-disease-awareness')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Heart Disease Awareness System API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
