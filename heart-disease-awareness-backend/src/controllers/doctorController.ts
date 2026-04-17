import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Doctor from '../models/Doctor';
import Article from '../models/Article';

export const submitDoctorVerification = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      specialty,
      licenseNumber,
      hospital,
      phone,
      email,
      address,
      qualifications,
      experience,
      verificationDocuments
    } = req.body;

    // Check if doctor with this license already exists
    const existingDoctor = await Doctor.findOne({ licenseNumber });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor with this license number already exists' });
    }

    const doctor = new Doctor({
      userId: req.user!._id,
      name,
      specialty,
      licenseNumber,
      hospital,
      phone,
      email,
      address,
      qualifications,
      experience,
      verificationDocuments: verificationDocuments || [],
    });

    await doctor.save();

    res.status(201).json({
      message: 'Doctor verification submitted successfully',
      doctor: {
        id: doctor._id,
        name: doctor.name,
        specialty: doctor.specialty,
        isVerified: doctor.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getDoctorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user!._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createArticle = async (req: AuthRequest, res: Response) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user!._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    if (!doctor.isVerified) {
      return res.status(403).json({ message: 'Only verified doctors can create articles' });
    }

    const {
      title,
      category,
      excerpt,
      content,
      readTime,
      tags,
      isPublished
    } = req.body;

    const article = new Article({
      doctorId: doctor._id,
      title,
      category,
      excerpt,
      content,
      readTime: readTime || `${Math.ceil(content.length / 200)} min read`,
      tags: tags || [],
      isPublished: isPublished || false,
    });

    await article.save();

    res.status(201).json({
      message: 'Article created successfully',
      article,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateArticle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findOne({ userId: req.user!._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const article = await Article.findOne({ _id: id, doctorId: doctor._id });
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const {
      title,
      category,
      excerpt,
      content,
      readTime,
      tags,
      isPublished
    } = req.body;

    article.title = title || article.title;
    article.category = category || article.category;
    article.excerpt = excerpt || article.excerpt;
    article.content = content || article.content;
    article.readTime = readTime || article.readTime;
    article.tags = tags || article.tags;
    article.isPublished = isPublished !== undefined ? isPublished : article.isPublished;

    await article.save();

    res.json({
      message: 'Article updated successfully',
      article,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getDoctorArticles = async (req: AuthRequest, res: Response) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user!._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const articles = await Article.find({ doctorId: doctor._id })
      .sort({ createdAt: -1 });

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteArticle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findOne({ userId: req.user!._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const article = await Article.findOne({ _id: id, doctorId: doctor._id });
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await Article.deleteOne({ _id: id });

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllPublishedArticles = async (req: AuthRequest, res: Response) => {
  try {
    const articles = await Article.find({ isPublished: true })
      .populate('doctorId', 'name specialty')
      .sort({ createdAt: -1 });

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
