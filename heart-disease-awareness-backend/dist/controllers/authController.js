"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.getCurrentUser = exports.resetPassword = exports.forgotPassword = exports.login = exports.register = exports.adminLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const User_1 = __importDefault(require("../models/User"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '7d';
const ADMIN_CREDENTIALS = {
    email: process.env.ADMIN_EMAIL || 'admin@heartdisease.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@2024!Secure',
    name: process.env.ADMIN_NAME || 'System Administrator',
    role: 'admin'
};
// Generate JWT Token
const generateToken = (userId, email, role) => {
    return jsonwebtoken_1.default.sign({ userId, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
const isEmailConfigured = () => {
    return Boolean(process.env.SMTP_HOST &&
        process.env.SMTP_PORT &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS &&
        process.env.SMTP_FROM);
};
const sendPasswordResetEmail = async (email, resetLink) => {
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Reset your Heart Disease Awareness password',
        html: `
      <p>Hello,</p>
      <p>We received a request to reset your password.</p>
      <p>Click the link below to reset your password (valid for 1 hour):</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>If you did not request this, please ignore this email.</p>
    `
    });
};
// Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        // Check against hardcoded admin credentials
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            const token = generateToken('admin', email, 'admin');
            return res.status(200).json({
                success: true,
                message: 'Admin login successful',
                token,
                user: {
                    id: 'admin',
                    email: ADMIN_CREDENTIALS.email,
                    name: ADMIN_CREDENTIALS.name,
                    role: 'admin'
                }
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Invalid admin credentials'
        });
    }
    catch (error) {
        console.error('Admin login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.adminLogin = adminLogin;
// User Registration
const register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword, role = 'user' } = req.body;
        // Validate input
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }
        // Check if user already exists
        const existingUser = await User_1.default.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create new user
        const newUser = new User_1.default({
            username,
            email,
            password: hashedPassword,
            role,
            isVerified: false,
            createdAt: new Date()
        });
        await newUser.save();
        // Generate token
        const token = generateToken(newUser._id.toString(), email, role);
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role || 'user',
                isAdmin: newUser.isAdmin,
                isVerified: newUser.isVerified
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.register = register;
// User Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        // Find user
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        // Check password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        // Generate token
        const userRole = user.role || (user.isAdmin ? 'admin' : 'user');
        const token = generateToken(user._id.toString(), email, userRole);
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role || (user.isAdmin ? 'admin' : 'user'),
                isAdmin: user.isAdmin,
                isVerified: user.isVerified
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.login = login;
// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        // Find user
        const user = await User_1.default.findOne({ email });
        if (!user) {
            // Don't reveal if user exists or not for security
            return res.status(200).json({
                success: true,
                message: 'If an account with this email exists, a password reset link has been sent'
            });
        }
        // Generate reset token (in production, use email service)
        const resetToken = jsonwebtoken_1.default.sign({ userId: user._id, email }, JWT_SECRET, { expiresIn: '1h' });
        // For demo purposes, return the token (in production, send email)
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        console.log('Password reset link:', resetLink); // For demo
        const payload = {
            success: true,
            message: 'Password reset link sent to your email'
        };
        if (isEmailConfigured()) {
            await sendPasswordResetEmail(email, resetLink);
            payload.delivery = 'email';
        }
        else if (process.env.NODE_ENV === 'development') {
            payload.delivery = 'debug_link';
            payload.resetLink = resetLink;
            payload.message = 'Email service not configured. Use the reset link returned in this response (development only).';
        }
        return res.status(200).json(payload);
    }
    catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.forgotPassword = forgotPassword;
// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;
        if (!token || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const userId = decoded.userId;
        // Find user
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }
        // Hash new password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
        // Update password
        await User_1.default.findByIdAndUpdate(userId, {
            password: hashedPassword,
            updatedAt: new Date()
        });
        return res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    }
    catch (error) {
        console.error('Reset password error:', error);
        return res.status(400).json({
            success: false,
            message: 'Invalid or expired reset token'
        });
    }
};
exports.resetPassword = resetPassword;
// Get Current User
const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });
    }
    catch (error) {
        console.error('Get current user error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getCurrentUser = getCurrentUser;
// Change Password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user?._id;
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }
        // Find user
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Check current password
        const isCurrentPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        // Hash new password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
        // Update password
        await User_1.default.findByIdAndUpdate(userId, {
            password: hashedPassword,
            updatedAt: new Date()
        });
        return res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    }
    catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.changePassword = changePassword;
