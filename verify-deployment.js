/**
 * Deployment Verification Script
 * 
 * This script will test your deployed backend API once it's live
 * 
 * Usage: node verify-deployment.js <your-render-url>
 * Example: node verify-deployment.js https://finance-manager-api-abc123.onrender.com
 */

const https = require('https');
const http = require('http');

const RENDER_URL = process.argv[2];

if (!RENDER_URL) {
  console.log('\n❌ Error: Please provide your Render URL\n');
  console.log('Usage: node verify-deployment.js <your-render-url>');
  console.log('Example: node verify-deployment.js https://finance-manager-api-abc123.onrender.com\n');
  process.exit(1);
}

const baseUrl = RENDER_URL.replace(/\/$/, ''); // Remove trailing slash
const client = baseUrl.startsWith('https') ? https : http;

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║          FINANCE MANAGER API - DEPLOYMENT VERIFICATION        ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');
console.log(`🔗 Testing: ${baseUrl}\n`);

// Test 1: Health Check
function testHealthCheck() {
  return new Promise((resolve, reject) => {
    console.log('📋 Test 1: Health Check');
    console.log('   Endpoint: GET /api');
    
    const req = client.get(`${baseUrl}/api`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('   ✅ Status: 200 OK');
          console.log(`   ✅ Response: ${data}`);
          resolve();
        } else {
          console.log(`   ❌ Status: ${res.statusCode}`);
          console.log(`   ❌ Response: ${data}`);
          reject(new Error(`Health check failed with status ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.log('   ❌ Error:', error.message);
      reject(error);
    });

    req.setTimeout(30000, () => {
      console.log('   ⏱️  Request timeout (30s) - Server might be cold starting...');
      console.log('   ℹ️  This is normal for Render free tier. Retrying...');
      req.destroy();
    });
  });
}

// Test 2: Login with Admin Credentials
function testLogin() {
  return new Promise((resolve, reject) => {
    console.log('\n📋 Test 2: Admin Login');
    console.log('   Endpoint: POST /api/auth/login');
    
    const postData = JSON.stringify({
      email: 'Iamshemaleandre@gmail.com',
      password: 'shema@1050!'
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const url = new URL(`${baseUrl}/api/auth/login`);
    options.hostname = url.hostname;
    options.port = url.port;
    options.path = url.pathname;

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          try {
            const response = JSON.parse(data);
            console.log('   ✅ Status: 200 OK');
            console.log('   ✅ Login successful!');
            console.log(`   ✅ User: ${response.user.fullName}`);
            console.log(`   ✅ Email: ${response.user.email}`);
            console.log('   ✅ Access token received');
            resolve(response.access_token);
          } catch (e) {
            console.log('   ❌ Invalid JSON response');
            reject(e);
          }
        } else {
          console.log(`   ❌ Status: ${res.statusCode}`);
          console.log(`   ❌ Response: ${data}`);
          reject(new Error(`Login failed with status ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.log('   ❌ Error:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Test 3: Get Categories (requires auth)
function testCategories(token) {
  return new Promise((resolve, reject) => {
    console.log('\n📋 Test 3: Get Categories');
    console.log('   Endpoint: GET /api/categories');
    
    const options = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const url = new URL(`${baseUrl}/api/categories`);
    options.hostname = url.hostname;
    options.port = url.port;
    options.path = url.pathname;

    const req = client.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const categories = JSON.parse(data);
            console.log('   ✅ Status: 200 OK');
            console.log(`   ✅ Categories found: ${categories.length}`);
            console.log('   ✅ Default categories:');
            categories.forEach(cat => {
              console.log(`      • ${cat.name} (${cat.type})`);
            });
            resolve();
          } catch (e) {
            console.log('   ❌ Invalid JSON response');
            reject(e);
          }
        } else {
          console.log(`   ❌ Status: ${res.statusCode}`);
          reject(new Error(`Categories request failed with status ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.log('   ❌ Error:', error.message);
      reject(error);
    });
  });
}

// Run all tests
async function runTests() {
  try {
    await testHealthCheck();
    const token = await testLogin();
    await testCategories(token);
    
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ ALL TESTS PASSED!                       ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
    console.log('🎉 Your Finance Manager API is fully deployed and working!\n');
    console.log('📱 Next Steps:');
    console.log('   1. Update your frontend VITE_API_URL to this backend URL');
    console.log('   2. Login with: Iamshemaleandre@gmail.com / shema@1050!');
    console.log('   3. Start managing your finances!\n');
  } catch (error) {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║                    ❌ TESTS FAILED                            ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
    console.log('💡 Troubleshooting:');
    console.log('   • Make sure DATABASE_URL is set in Render');
    console.log('   • Check Render logs for errors');
    console.log('   • Ensure migrations ran successfully');
    console.log('   • Wait a few minutes if this is the first deployment\n');
    process.exit(1);
  }
}

runTests();

