#!/usr/bin/env node

/**
 * Deployment Verification Script for Fritco Locale Scaffold
 * 
 * This script helps verify that your Vercel deployment is working correctly
 * by testing the main application endpoints and functionality.
 */

const https = require('https');
const http = require('http');

class DeploymentVerifier {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.results = [];
  }

  async makeRequest(url, timeout = 10000) {
    return new Promise((resolve) => {
      const protocol = url.startsWith('https:') ? https : http;
      const startTime = Date.now();
      
      const req = protocol.get(url, { timeout }, (res) => {
        const duration = Date.now() - startTime;
        const data = {
          url,
          status: res.statusCode,
          duration,
          headers: res.headers,
          success: res.statusCode >= 200 && res.statusCode < 400
        };
        resolve(data);
      });

      req.on('error', (error) => {
        resolve({
          url,
          status: 0,
          duration: Date.now() - startTime,
          error: error.message,
          success: false
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          url,
          status: 0,
          duration: timeout,
          error: 'Request timeout',
          success: false
        });
      });
    });
  }

  async testEndpoint(path, description) {
    const url = `${this.baseUrl}${path}`;
    console.log(`🧪 Testing ${description}...`);
    
    const result = await this.makeRequest(url);
    result.description = description;
    this.results.push(result);

    if (result.success) {
      console.log(`✅ ${description} - Status: ${result.status} (${result.duration}ms)`);
    } else {
      console.log(`❌ ${description} - Status: ${result.status || 'Failed'} (${result.error || 'Unknown error'})`);
    }
    
    return result;
  }

  async runAllTests() {
    console.log(`🚀 Starting deployment verification for: ${this.baseUrl}\n`);

    // Test main application pages
    await this.testEndpoint('/', 'Homepage');
    await this.testEndpoint('/request', 'Request Form Page');
    await this.testEndpoint('/retainers', 'Retainers Page');
    await this.testEndpoint('/thank-you', 'Thank You Page');
    await this.testEndpoint('/dashboard', 'Dashboard Page');

    // Test API endpoints (these might redirect or require auth)
    await this.testEndpoint('/api/search/leads', 'Search Leads API');
    await this.testEndpoint('/api/stripe/checkout', 'Stripe Checkout API');
    
    // Generate summary
    this.generateSummary();
  }

  generateSummary() {
    console.log('\n📊 DEPLOYMENT VERIFICATION SUMMARY');
    console.log('=' .repeat(50));

    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;

    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (failedTests > 0) {
      console.log('\n🔍 FAILED TESTS:');
      this.results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`❌ ${r.description}: ${r.error || `HTTP ${r.status}`}`);
        });

      console.log('\n💡 TROUBLESHOOTING TIPS:');
      console.log('1. Check that all environment variables are set in Vercel');
      console.log('2. Verify your API base URL is correct and accessible');
      console.log('3. Ensure your Stripe keys are valid and active');
      console.log('4. Check Vercel function logs for detailed error messages');
      console.log('5. Review the VERCEL_DEPLOYMENT_GUIDE.md for setup instructions');
    } else {
      console.log('\n🎉 All tests passed! Your deployment appears to be working correctly.');
    }

    console.log('\n📚 For more help, check:');
    console.log('- VERCEL_DEPLOYMENT_GUIDE.md');
    console.log('- docs/secrets-template.txt');
    console.log('- DEPLOYMENT-GUIDE.md');
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node verify-deployment.js <your-vercel-url>');
    console.log('Example: node verify-deployment.js https://your-app.vercel.app');
    process.exit(1);
  }

  const baseUrl = args[0];
  
  // Validate URL format
  try {
    new URL(baseUrl);
  } catch (error) {
    console.error('❌ Invalid URL format. Please provide a valid URL.');
    console.error('Example: https://your-app.vercel.app');
    process.exit(1);
  }

  const verifier = new DeploymentVerifier(baseUrl);
  await verifier.runAllTests();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = DeploymentVerifier;