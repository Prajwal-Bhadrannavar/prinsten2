const http = require('http');

// Test all auth routes
const routes = [
  { path: '/api/auth/login', method: 'POST', data: { email: 'test@example.com', password: 'test123' } },
  { path: '/api/auth/register', method: 'POST', data: { username: 'newuser', email: 'new@example.com', password: 'test123', confirmPassword: 'test123' } },
  { path: '/api/auth/forgot-password', method: 'POST', data: { email: 'test@example.com' } },
  { path: '/api/auth/reset-password', method: 'POST', data: { token: 'test', newPassword: 'test123', confirmPassword: 'test123' } },
  { path: '/api/auth/admin/login', method: 'POST', data: { email: 'admin@heartdisease.com', password: 'Admin@2024!Secure' } },
];

function testRoute(route) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(route.data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: route.path,
      method: route.method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ path: route.path, status: res.statusCode, data: data.substring(0, 100) });
      });
    });

    req.on('error', (e) => {
      resolve({ path: route.path, error: e.message });
    });

    req.write(postData);
    req.end();
  });
}

async function testAllRoutes() {
  for (const route of routes) {
    const result = await testRoute(route);
    console.log(`${result.status || 'error'}: ${route.path} -> ${result.data || result.error}`);
  }
}

testAllRoutes();