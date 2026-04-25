import React from 'react';
import { Button } from '@mui/material';

const TestButton: React.FC = () => {
  const testNewRoutes = async () => {
    try {
      // Test admin login route
      const adminResponse = await fetch('http://localhost:5000/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@heartdisease.com', password: 'Admin@2024!Secure' })
      });
      
      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        console.log('✅ Admin login works:', adminData);
      } else {
        console.log('❌ Admin login failed:', await adminResponse.text());
      }

      // Test forgot password route
      const forgotResponse = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' })
      });
      
      if (forgotResponse.ok) {
        const forgotData = await forgotResponse.json();
        console.log('✅ Forgot password works:', forgotData);
      } else {
        console.log('❌ Forgot password failed:', await forgotResponse.text());
      }
    } catch (error) {
      console.log('❌ Test failed:', error);
    }
  };

  return (
    <Button variant="contained" color="secondary" onClick={testNewRoutes}>
      Test New Routes
    </Button>
  );
};

export default TestButton;
