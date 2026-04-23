import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Doctor from '../models/Doctor';
import User from '../models/User';

export const getPendingVerifications = async (req: AuthRequest, res: Response) => {
  try {
    const pendingDoctors = await Doctor.find({ isVerified: false })
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    res.json(pendingDoctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const approveDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.isVerified = true;
    await doctor.save();

    res.json({
      message: 'Doctor approved successfully',
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

export const rejectDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const { doctorId } = req.params;
    const { reason } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Delete the doctor verification request
    await Doctor.deleteOne({ _id: doctorId });

    res.json({
      message: 'Doctor verification rejected',
      reason: reason || 'Verification request rejected',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Get the userId to also delete the user account
    const userId = doctor.userId;

    // Delete the doctor record
    await Doctor.deleteOne({ _id: doctorId });

    // Also delete the associated user account
    if (userId) {
      await User.deleteOne({ _id: userId });
    }

    res.json({
      message: 'Doctor deleted successfully',
      doctorId: doctorId,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllDoctors = async (req: AuthRequest, res: Response) => {
  try {
    const doctors = await Doctor.find({})
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
