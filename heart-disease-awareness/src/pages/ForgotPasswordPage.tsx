import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Email,
  Visibility,
  VisibilityOff,
  ArrowBack,
} from '@mui/icons-material';
import { authAPI } from '../services/api';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [resetToken, setResetToken] = useState('');
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.forgotPassword({ email });
      
      if (response.success) {
        setSuccess(response.message || 'Password reset initiated.');
        // For demo purposes, extract token from the resetLink if available
        if (response.resetLink) {
          const urlParams = new URL(response.resetLink);
          const token = urlParams.searchParams.get('token');
          if (token) {
            setResetToken(token);
            setStep('reset');
          }
        }
      } else {
        setError(response.message || 'Failed to send reset link');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.resetPassword({
        token: resetToken,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      if (response.success) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #e8f5e8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ color: '#e91e63', fontWeight: 'bold' }}>
              ❤️ Heart Disease Awareness
            </Typography>
            <Typography variant="h6" sx={{ color: '#666', mt: 1 }}>
              {step === 'email' ? 'Reset Your Password' : 'Create New Password'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSubmitEmail}>
              <TextField
                fullWidth
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mb: 2,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #e91e63, #ff4081)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #c2185b, #e91e63)',
                  },
                }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link to="/login" style={{ textDecoration: 'none', color: '#666' }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <ArrowBack fontSize="small" />
                    Back to Login
                  </Typography>
                </Link>
              </Box>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VisibilityOff />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VisibilityOff />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mb: 2,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #e91e63, #ff4081)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #c2185b, #e91e63)',
                  },
                }}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link to="/login" style={{ textDecoration: 'none', color: '#666' }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <ArrowBack fontSize="small" />
                    Back to Login
                  </Typography>
                </Link>
              </Box>
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;