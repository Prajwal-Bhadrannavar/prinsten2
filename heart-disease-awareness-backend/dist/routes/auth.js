"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Admin Login (Hardcoded credentials)
router.post('/admin/login', authController_1.adminLogin);
// User Registration
router.post('/register', authController_1.register);
// User Login
router.post('/login', authController_1.login);
// Forgot Password
router.post('/forgot-password', authController_1.forgotPassword);
// Reset Password
router.post('/reset-password', authController_1.resetPassword);
// Get Current User (protected)
router.get('/me', auth_1.authenticate, authController_1.getCurrentUser);
// Change Password (protected)
router.post('/change-password', auth_1.authenticate, authController_1.changePassword);
exports.default = router;
