import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import theme from './theme/theme';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AssessmentPage from './pages/AssessmentPage';
import DashboardPage from './pages/DashboardPage';
import EducationPage from './pages/EducationPage';
import EmergencyPage from './pages/EmergencyPage';
import LifestylePage from './pages/LifestylePage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorVerificationPage from './pages/DoctorVerificationPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import AdminPage from './pages/AdminPage';
import AdminRoute from './components/AdminRoute';
import ContactPage from './pages/ContactPageRealtime';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route 
              path="/lifestyle" 
              element={
                <ProtectedRoute>
                  <LifestylePage />
                </ProtectedRoute>
              } 
            />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route 
              path="/doctor-verification" 
              element={
                <ProtectedRoute>
                  <DoctorVerificationPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor-dashboard" 
              element={
                <ProtectedRoute>
                  <DoctorDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor/create-article" 
              element={
                <ProtectedRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor/edit-article/:id" 
              element={
                <ProtectedRoute>
                </ProtectedRoute>
              } 
            />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              } 
            />
          </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
  );
}

export default App;
