#!/usr/bin/env node

/**
 * Fritco MVP Post-Deployment Smoke Test Suite
 * Tests all F-G-P-T-U endpoints as specified in the problem statement
 */

const https = require('https');
const http = require('http');

// Configuration - Update these after deployment
const CONFIG = {
  WEB_URL: 'https://frithco-web.vercel.app',
  // API URL will be auto-discovered from Railway or can be set manually
  API_URL: process.env.API_URL || null,
  TIMEOUT: 10000
};

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.request(url, {
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'FritcoMVPSmokeTest/1.0',
        'Accept': 'application/json, text/html, */*',
        ...options.headers
      },
      timeout: CONFIG.TIMEOUT
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          url: url
        });
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

async function discoverApiUrl() {
  // Try common Railway URL patterns
  const patterns = [
    'https://frithco-api-production.up.railway.app',
    'https://production-frithco-api.up.railway.app',
    'https://frithco-api.up.railway.app'
  ];
  
  console.log('🔍 Discovering API URL...');
  
  for (const url of patterns) {
    try {
      console.log(`  Trying: ${url}`);
      const result = await makeRequest(`${url}/health`);
      if (result.status === 200) {
        try {
          const health = JSON.parse(result.body);
          if (health.ok === true) {
            console.log(`  ✅ Found API at: ${url}`);
            return url;
          }
        } catch (e) {
          // Not JSON or wrong format
        }
      }
    } catch (e) {
      // Continue to next pattern
    }
  }
  
  return null;
}

async function testEndpoint(name, url, validator) {
  try {
    console.log(`Testing ${name}: ${url}`);
    const result = await makeRequest(url);
    
    const isValid = validator ? validator(result) : (result.status >= 200 && result.status < 400);
    const status = isValid ? '✅ PASS' : '❌ FAIL';
    const note = isValid ? `HTTP ${result.status}` : `HTTP ${result.status} - ${validator ? 'Content check failed' : 'Bad status'}`;
    
    console.log(`  ${status} - ${note}`);
    return { name, url, passed: isValid, status: result.status, note };
    
  } catch (error) {
    console.log(`  ❌ FAIL - ${error.message}`);
    return { name, url, passed: false, status: null, note: error.message };
  }
}

async function runSmokeTests() {
  console.log('🧪 Fritco MVP Smoke Test Suite');
  console.log('===============================\n');
  
  const results = [];
  
  // F - Functions/API (Friendly utilities)
  let apiUrl = CONFIG.API_URL;
  if (!apiUrl) {
    apiUrl = await discoverApiUrl();
  }
  
  if (apiUrl) {
    const apiResult = await testEndpoint(
      'API Health', 
      `${apiUrl}/health`,
      (result) => {
        try {
          const data = JSON.parse(result.body);
          return result.status === 200 && data.ok === true;
        } catch {
          return false;
        }
      }
    );
    results.push(apiResult);
  } else {
    console.log('❌ FAIL API Health - No accessible API found');
    results.push({
      name: 'API Health',
      url: 'Not found',
      passed: false,
      status: null,
      note: 'API service not accessible'
    });
  }
  
  console.log();
  
  // G-P-T-U - Web routes (Guests, Pay, Thank-U)
  const webTests = [
    {
      name: 'Web Home (Guests)',
      path: '/',
      validator: (result) => result.status === 200 && result.body.includes('html')
    },
    {
      name: 'Web Request Form (Guests)', 
      path: '/request',
      validator: (result) => result.status === 200 && result.body.includes('html')
    },
    {
      name: 'Web Retainers (Pay)',
      path: '/retainers', 
      validator: (result) => result.status === 200 && result.body.includes('html')
    },
    {
      name: 'Web Thank You (Thank-U)',
      path: '/thank-you',
      validator: (result) => result.status === 200 && result.body.includes('html')
    }
  ];
  
  for (const test of webTests) {
    const result = await testEndpoint(
      test.name,
      `${CONFIG.WEB_URL}${test.path}`,
      test.validator
    );
    results.push(result);
  }
  
  // Generate final report
  console.log('\n' + '='.repeat(50));
  console.log('📊 FINAL SMOKE TEST REPORT');
  console.log('='.repeat(50));
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const allPassed = passed === total;
  
  console.log(`Results: ${passed}/${total} tests passed\n`);
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}: ${result.note}`);
  });
  
  console.log(`\nOverall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (apiUrl) {
    console.log(`\nAPI URL: ${apiUrl}`);
  }
  console.log(`Web URL: ${CONFIG.WEB_URL}`);
  
  // Environment recommendations
  if (!allPassed) {
    console.log('\n🔧 Troubleshooting:');
    
    const failedApi = results.find(r => r.name === 'API Health' && !r.passed);
    if (failedApi) {
      console.log('  - Check Railway deployment status');
      console.log('  - Verify environment variables are set');
      console.log('  - Check Railway build logs');
    }
    
    const failedWeb = results.filter(r => r.name.startsWith('Web') && !r.passed);
    if (failedWeb.length > 0) {
      console.log('  - Check Vercel deployment status');
      console.log('  - Verify NEXT_PUBLIC_API_BASE is set correctly');
      console.log('  - Check Vercel build logs');
    }
  }
  
  return { results, apiUrl, allPassed, summary: `${passed}/${total} passed` };
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log('Fritco MVP Smoke Test Suite');
    console.log('Usage: node smoke-test.js [--api-url=URL]');
    console.log('');
    console.log('Options:');
    console.log('  --api-url=URL    Override API URL (auto-discovery otherwise)');
    console.log('  --help          Show this help');
    process.exit(0);
  }
  
  // Parse API URL override
  const apiArg = args.find(arg => arg.startsWith('--api-url='));
  if (apiArg) {
    CONFIG.API_URL = apiArg.split('=')[1];
  }
  
  runSmokeTests()
    .then(results => {
      process.exit(results.allPassed ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Smoke test suite failed:', error.message);
      process.exit(1);
    });
}

module.exports = { runSmokeTests };