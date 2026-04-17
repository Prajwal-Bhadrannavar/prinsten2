"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPublishedArticles = exports.deleteArticle = exports.getDoctorArticles = exports.updateArticle = exports.createArticle = exports.getDoctorProfile = exports.submitDoctorVerification = void 0;
const Doctor_1 = __importDefault(require("../models/Doctor"));
const Article_1 = __importDefault(require("../models/Article"));
const submitDoctorVerification = async (req, res) => {
    try {
        const { name, specialty, licenseNumber, hospital, phone, email, address, qualifications, experience, verificationDocuments } = req.body;
        // Check if doctor with this license already exists
        const existingDoctor = await Doctor_1.default.findOne({ licenseNumber });
        if (existingDoctor) {
            return res.status(400).json({ message: 'Doctor with this license number already exists' });
        }
        const doctor = new Doctor_1.default({
            userId: req.user._id,
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.submitDoctorVerification = submitDoctorVerification;
const getDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor_1.default.findOne({ userId: req.user._id });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
        res.json(doctor);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getDoctorProfile = getDoctorProfile;
const createArticle = async (req, res) => {
    try {
        const doctor = await Doctor_1.default.findOne({ userId: req.user._id });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
        if (!doctor.isVerified) {
            return res.status(403).json({ message: 'Only verified doctors can create articles' });
        }
        const { title, category, excerpt, content, readTime, tags, isPublished } = req.body;
        const article = new Article_1.default({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createArticle = createArticle;
const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor_1.default.findOne({ userId: req.user._id });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
        const article = await Article_1.default.findOne({ _id: id, doctorId: doctor._id });
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        const { title, category, excerpt, content, readTime, tags, isPublished } = req.body;
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateArticle = updateArticle;
const getDoctorArticles = async (req, res) => {
    try {
        const doctor = await Doctor_1.default.findOne({ userId: req.user._id });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
        const articles = await Article_1.default.find({ doctorId: doctor._id })
            .sort({ createdAt: -1 });
        res.json(articles);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getDoctorArticles = getDoctorArticles;
const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor_1.default.findOne({ userId: req.user._id });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
        const article = await Article_1.default.findOne({ _id: id, doctorId: doctor._id });
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        await Article_1.default.deleteOne({ _id: id });
        res.json({ message: 'Article deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteArticle = deleteArticle;
const getAllPublishedArticles = async (req, res) => {
    try {
        const articles = await Article_1.default.find({ isPublished: true })
            .populate('doctorId', 'name specialty')
            .sort({ createdAt: -1 });
        res.json(articles);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getAllPublishedArticles = getAllPublishedArticles;
