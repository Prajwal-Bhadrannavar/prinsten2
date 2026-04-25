import express from 'express';
import { 
  adminLogin, 
  register, 
  login, 
  forgotPassword, 
  resetPassword, 
  getCurrentUser, 
  changePassword 
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Admin Login (Hardcoded credentials)
router.post('/admin/login', adminLogin);

// User Registration
router.post('/register', register);

// User Login
router.post('/login', login);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// Reset Password
router.post('/reset-password', resetPassword);

// Get Current User (protected)
router.get('/me', authenticate, getCurrentUser);

// Change Password (protected)
router.post('/change-password', authenticate, changePassword);

export default router;
