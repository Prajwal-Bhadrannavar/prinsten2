import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import TestButton from './TestButton';

const DebugPanel: React.FC = () => {
  const { user, token, login, logout } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('password123');

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBackendConnection = async () => {
    try {
      addResult('Testing backend connection...');
      const response = await fetch('http://localhost:5000');
      const data = await response.json();
      addResult(`✅ Backend connected: ${JSON.stringify(data)}`);
    } catch (error) {
      addResult(`❌ Backend connection failed: ${error}`);
    }
  };

  const testAdminLogin = async () => {
    try {
      addResult('Testing admin login...');
      const response = await authAPI.adminLogin({
        email: 'admin@heartdisease.com',
        password: 'Admin@2024!Secure'
      });
      addResult(`✅ Admin login successful: ${JSON.stringify(response)}`);
    } catch (error) {
      addResult(`❌ Admin login failed: ${JSON.stringify(error)}`);
    }
  };

  const testUserRegistration = async () => {
    try {
      addResult('Testing user registration...');
      const response = await authAPI.register({
        username: 'testuser',
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword
      });
      addResult(`✅ User registration successful: ${JSON.stringify(response)}`);
    } catch (error) {
      addResult(`❌ User registration failed: ${JSON.stringify(error)}`);
    }
  };

  const testUserLogin = async () => {
    try {
      addResult('Testing user login...');
      const response = await authAPI.login({
        email: testEmail,
        password: testPassword
      });
      addResult(`✅ User login successful: ${JSON.stringify(response)}`);
    } catch (error) {
      addResult(`❌ User login failed: ${JSON.stringify(error)}`);
    }
  };

  const testForgotPassword = async () => {
    try {
      addResult('Testing forgot password...');
      const response = await authAPI.forgotPassword({
        email: testEmail
      });
      addResult(`✅ Forgot password successful: ${JSON.stringify(response)}`);
    } catch (error) {
      addResult(`❌ Forgot password failed: ${JSON.stringify(error)}`);
    }
  };

  const testAuthContext = () => {
    addResult(`AuthContext state:`);
    addResult(`  User: ${JSON.stringify(user)}`);
    addResult(`  Token: ${token ? 'exists' : 'none'}`);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Paper sx={{ p: 3, m: 2, maxHeight: '80vh', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        🔧 Debug Panel
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Current Auth State:
        </Typography>
        <Chip 
          label={user ? `Logged in as ${user.role}` : 'Not logged in'} 
          color={user ? 'success' : 'default'} 
          size="small"
        />
        {token && <Chip label="Token exists" color="primary" size="small" sx={{ ml: 1 }} />}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        <Button variant="outlined" size="small" onClick={testBackendConnection}>
          Test Backend
        </Button>
        <Button variant="outlined" size="small" onClick={testAdminLogin}>
          Test Admin Login
        </Button>
        <Button variant="outlined" size="small" onClick={testUserRegistration}>
          Register User
        </Button>
        <Button variant="outlined" size="small" onClick={testUserLogin}>
          Test User Login
        </Button>
        <Button variant="outlined" size="small" onClick={testForgotPassword}>
          Test Forgot PW
        </Button>
        <Button variant="outlined" size="small" onClick={testAuthContext}>
          Check Auth
        </Button>
        <Button variant="outlined" size="small" color="error" onClick={logout}>
          Logout
        </Button>
        <Button variant="outlined" size="small" onClick={clearResults}>
          Clear
        </Button>
        <TestButton />
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          label="Test Email"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          size="small"
          sx={{ mr: 1, width: 200 }}
        />
        <TextField
          label="Test Password"
          value={testPassword}
          onChange={(e) => setTestPassword(e.target.value)}
          size="small"
          sx={{ width: 150 }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
        {testResults.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Click test buttons to see results...
          </Typography>
        ) : (
          testResults.map((result, index) => (
            <Alert 
              key={index} 
              severity={result.includes('✅') ? 'success' : result.includes('❌') ? 'error' : 'info'}
              sx={{ mb: 1, fontSize: '0.8rem' }}
            >
              {result}
            </Alert>
          ))
        )}
      </Box>
    </Paper>
  );
};

export default DebugPanel;
