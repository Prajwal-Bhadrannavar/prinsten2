const http = require('http');

const postData = JSON.stringify({
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWViOWY3MDFkODg0ZTk4NTI0MjVhZGYiLCJlbWFpbCI6InRlc3R1c2VyMTIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNzc3MDQ5NTc3LCJleHAiOjE3NzcwNTMxNzd9.Q8Xf8f1ehVrnV848mJ6QCrSHGCVF8tBprXudODrwp1E',
  newPassword: 'newpassword123',
  confirmPassword: 'newpassword123'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/reset-password',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(postData);
req.end();