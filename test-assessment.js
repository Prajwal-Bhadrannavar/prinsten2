const http = require('http');

// Test assessment routes
const routes = [
  { path: '/api/assessment/questions', method: 'GET', data: null },
  { path: '/api/assessment/calculate', method: 'POST', data: { responses: [{ questionId: 1, answer: true }] } },
];

function testRoute(route) {
  return new Promise((resolve) => {
    if (!route.data) {
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: route.path,
        method: route.method,
      };
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({ path: route.path, status: res.statusCode, data: data.substring(0, 150) });
        });
      });
      req.on('error', (e) => resolve({ path: route.path, error: e.message }));
      req.end();
    } else {
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
          resolve({ path: route.path, status: res.statusCode, data: data.substring(0, 150) });
        });
      });
      req.on('error', (e) => resolve({ path: route.path, error: e.message }));
      req.write(postData);
      req.end();
    }
  });
}

async function testAllRoutes() {
  console.log('=== Testing Assessment Routes ===');
  for (const route of routes) {
    const result = await testRoute(route);
    console.log(`${result.status || 'error'}: ${route.path}`);
    console.log(`   -> ${result.data || result.error}`);
  }
}

testAllRoutes();