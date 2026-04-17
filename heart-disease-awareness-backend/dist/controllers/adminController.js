"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDoctors = exports.rejectDoctor = exports.approveDoctor = exports.getPendingVerifications = void 0;
const Doctor_1 = __importDefault(require("../models/Doctor"));
const getPendingVerifications = async (req, res) => {
    try {
        const pendingDoctors = await Doctor_1.default.find({ isVerified: false })
            .populate('userId', 'username email')
            .sort({ createdAt: -1 });
        res.json(pendingDoctors);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getPendingVerifications = getPendingVerifications;
const approveDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const doctor = await Doctor_1.default.findById(doctorId);
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.approveDoctor = approveDoctor;
const rejectDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { reason } = req.body;
        const doctor = await Doctor_1.default.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        // Delete the doctor verification request
        await Doctor_1.default.deleteOne({ _id: doctorId });
        res.json({
            message: 'Doctor verification rejected',
            reason: reason || 'Verification request rejected',
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.rejectDoctor = rejectDoctor;
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor_1.default.find({})
            .populate('userId', 'username email')
            .sort({ createdAt: -1 });
        res.json(doctors);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getAllDoctors = getAllDoctors;
