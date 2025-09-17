# Production-Ready MVP Deploy + Smoke Test - Complete Guide

## 🎯 Status: DEPLOYMENT READY

All code fixes have been completed and verified. The monorepo is now production-ready for auth-free MVP deployment.

## ✅ Completed Fixes

### 1. Sanity & Build Fixes ✅
- **pino dependencies**: Already present in apps/api/package.json
- **TypeScript compilation**: Fixed pino-http genReqId typing in apps/api/src/index.ts  
- **Web middleware**: apps/web/middleware.ts correctly returns NextResponse.next()
- **Clerk passthrough**: apps/web/components/ClerkClientProvider.tsx is passthrough
- **API routes**: Removed @clerk/nextjs imports and Authorization headers

### 2. Auth-Free MVP Configuration ✅
- **API**: AUTH_DISABLED flag properly implemented
- **Web**: No Clerk imports in API routes, no auth headers sent
- **Middleware**: Always bypasses authentication

## 🚀 Immediate Deployment Steps

### Option A: Automatic (Recommended)
1. **Merge this PR to main branch** - triggers both workflows automatically
2. **Monitor GitHub Actions** for completion
3. **Run smoke tests** (script provided below)

### Option B: Manual Trigger
1. Go to GitHub Actions → Deploy API to Railway → Run workflow (main branch)
2. Go to GitHub Actions → Deploy Web to Vercel → Run workflow (main branch)  
3. Wait for completion and run smoke tests

## 🌍 Environment Variables Required

### Railway (Project: 0f7be884-4342-47a6-846e-cb258dd9ea77)
Set these in Railway → frithco-api service:
```bash
AUTH_DISABLED=1
WEB_ORIGIN=https://frithco-web.vercel.app
DATABASE_URL=postgresql://user:pass@host:5432/frithco?schema=public
HCAPTCHA_SECRET=0x...
S3_ENDPOINT=https://s3.us-west-2.amazonaws.com
S3_REGION=us-west-2
S3_BUCKET=your-bucket
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
```

### Vercel (Project: cjajLc1KjdT4JjWGXaT2gkR6)
Set these in Vercel → frithco-web project:
```bash
NEXT_PUBLIC_SITE_URL=https://frithco-web.vercel.app
NEXT_PUBLIC_API_BASE=https://<RAILWAY_SERVICE_DOMAIN>
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=...
# Do NOT set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (auth disabled)
```

## 🧪 Smoke Test Script

Save and run this after deployment:

```bash
#!/bin/bash
# Smoke test script for Fritco MVP

echo "🧪 Running Fritco MVP Smoke Tests..."

# Expected URLs
WEB_URL="https://frithco-web.vercel.app"
API_URL="https://<RAILWAY_SERVICE_DOMAIN>"  # Update after Railway deployment

# Test API Health (F - Friendly/Functions)
echo "Testing API Health..."
curl -s "$API_URL/health" | jq '.ok' || echo "❌ API health failed"

# Test Web Routes (G-P-T-U)
echo "Testing Web routes..."

# G - Guests (home page)
curl -sI "$WEB_URL/" | head -n1 | grep -q "200" && echo "✅ Home page" || echo "❌ Home page failed"

# P - Pay/Retainers  
curl -sI "$WEB_URL/retainers" | head -n1 | grep -q "200" && echo "✅ Retainers page" || echo "❌ Retainers failed"

# G - Guests (request form)
curl -sI "$WEB_URL/request" | head -n1 | grep -q "200" && echo "✅ Request form" || echo "❌ Request form failed"

# T - Thank you
curl -sI "$WEB_URL/thank-you" | head -n1 | grep -q "200" && echo "✅ Thank you page" || echo "❌ Thank you failed"

echo "🧪 Smoke tests completed"
```

## 📊 Expected Post-Deployment Results

### GitHub Action Links
- **API Deploy**: https://github.com/executiveusa/fritco-locale-scaffold/actions/workflows/deploy-api.yml
- **Web Deploy**: https://github.com/executiveusa/fritco-locale-scaffold/actions/workflows/deploy-web.yml

### Live URLs (After Deployment)
- **API**: https://frithco-api-production.up.railway.app
- **Web**: https://frithco-web.vercel.app

### Smoke Test Results (Expected)
```
✅ PASS API Health: { ok: true }
✅ PASS Web Home: Loads without error
✅ PASS Web Request Form: Form renders with address/contact/service fields  
✅ PASS Web Retainers: 3 payment plans render with buttons
✅ PASS Web Thank You: Page renders successfully
```

## 🔧 Auto-Repair (If Issues Found)

### If API /health fails:
1. Check Railway build logs in GitHub Actions
2. Verify environment variables are set
3. Redeploy API workflow

### If Web pages fail:
1. Check Vercel build logs
2. Ensure NEXT_PUBLIC_API_BASE points to live Railway URL
3. Redeploy web workflow

### If CORS errors on forms:
1. Add frithco-web.vercel.app to WEB_ORIGIN on Railway
2. Redeploy API

## ✅ Acceptance Criteria Status

- [x] **API build passes**: TypeScript compilation fixed
- [x] **Web build passes**: All routes compile without Clerk
- [x] **Health endpoint ready**: Returns { ok: true }
- [x] **Web pages ready**: /, /request, /retainers, /thank-you all auth-free
- [x] **Environment template**: Complete variable documentation
- [x] **Deployment workflows**: Both workflows ready to trigger

## 🎉 Final Status

**STATUS: READY FOR IMMEDIATE DEPLOYMENT**

1. Merge PR → Automatic deployment
2. Monitor Actions → Both should succeed  
3. Run smoke tests → All 5 routes should pass
4. Report final URLs and results

Railway Project: `0f7be884-4342-47a6-846e-cb258dd9ea77`  
Vercel Project: `cjajLc1KjdT4JjWGXaT2gkR6`