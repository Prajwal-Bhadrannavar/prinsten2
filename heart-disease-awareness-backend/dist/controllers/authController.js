"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const register = async (req, res) => {
    try {
        console.log('Registration request body:', req.body);
        const { username, email, password, adminSecretKey } = req.body;
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        const existingUser = await User_1.default.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            console.log('User already exists:', existingUser.email);
            return res.status(400).json({ message: 'User already exists' });
        }
        // Check if admin secret key is provided and correct
        const isAdmin = adminSecretKey === '5125';
        // Hash password before creating user
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = new User_1.default({
            username,
            email,
            password: hashedPassword,
            adminSecretKey: isAdmin ? adminSecretKey : null,
            isAdmin
        });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.log('User registered successfully:', user.email);
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isAdmin,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password, adminSecretKey } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Check if admin secret key is provided and correct
        let isAdmin = user.isAdmin;
        if (adminSecretKey === '5125' && !user.isAdmin) {
            // Upgrade user to admin if they provide correct secret key
            user.isAdmin = true;
            user.adminSecretKey = adminSecretKey;
            await user.save();
            isAdmin = true;
        }
        else if (adminSecretKey && adminSecretKey !== '5125') {
            return res.status(400).json({ message: 'Invalid admin secret key' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isAdmin,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.login = login;
