# Vercel Environment Variables Setup Template

This file provides a complete checklist for setting up environment variables in Vercel.

## How to Use This Template

1. Copy the variable names from the sections below
2. Paste them into Vercel → Project → Settings → Environment Variables
3. Set the target environments (Production, Preview, Development)
4. Replace placeholder values with your actual API keys

## Required Environment Variables for Vercel

### 🌐 Public Variables (Safe to expose to browser)

Set these for: **Production** and **Preview** environments

```
NEXT_PUBLIC_SITE_URL=https://your-vercel-app-url.vercel.app
NEXT_PUBLIC_API_BASE=https://your-railway-api-url.railway.app
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=10000000-ffff-ffff-ffff-000000000001
NEXT_PUBLIC_STUB_MODE=0
```

**📝 Notes:**
- `NEXT_PUBLIC_SITE_URL`: Your actual Vercel app URL (get this after first deployment)
- `NEXT_PUBLIC_API_BASE`: Your Railway API URL (or your backend API endpoint)
- `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`: Get from hCaptcha dashboard
- `NEXT_PUBLIC_STUB_MODE`: Set to `0` for production, `1` for testing without external APIs

### 🔐 Secret Variables (Server-side only)

Set these for: **Production** and **Preview** environments

```
WEB_STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
WEB_STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
STRIPE_PRICE_PATROL=price_your_patrol_price_id_here
STRIPE_PRICE_BUSINESS=price_your_business_price_id_here
STRIPE_PRICE_CAMPUS=price_your_campus_price_id_here
```

**📝 Notes:**
- Get Stripe keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- Create webhook endpoint in Stripe for your Vercel domain
- Create pricing plans in Stripe and copy the price IDs

### 🔧 Optional Authentication Variables (if using Clerk)

Set these for: **Production** and **Preview** environments (only if using authentication)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_key_here
```

## Quick Setup Checklist

Use this checklist when setting up your Vercel project:

### Phase 1: Initial Setup
- [ ] GitHub repository is pushed and accessible
- [ ] Vercel project created and linked to repository
- [ ] Root directory set to `apps/web` in Vercel
- [ ] Initial deployment attempted (will fail without env vars)

### Phase 2: Environment Variables
- [ ] `NEXT_PUBLIC_SITE_URL` - Set after getting Vercel URL
- [ ] `NEXT_PUBLIC_API_BASE` - Your backend API endpoint
- [ ] `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` - From hCaptcha
- [ ] `NEXT_PUBLIC_STUB_MODE` - Set to `0`
- [ ] `WEB_STRIPE_SECRET_KEY` - From Stripe dashboard
- [ ] `WEB_STRIPE_WEBHOOK_SECRET` - From Stripe webhook
- [ ] `STRIPE_PRICE_PATROL` - Stripe price ID
- [ ] `STRIPE_PRICE_BUSINESS` - Stripe price ID
- [ ] `STRIPE_PRICE_CAMPUS` - Stripe price ID

### Phase 3: Deployment & Testing
- [ ] Trigger new deployment in Vercel
- [ ] Verify build completes successfully
- [ ] Test main pages: `/`, `/request`, `/retainers`, `/thank-you`
- [ ] Run verification script: `node verify-deployment.js https://your-app.vercel.app`

## Environment Setup Commands

### Using Vercel CLI (Alternative Method)

If you prefer to set environment variables via CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_API_BASE production
vercel env add NEXT_PUBLIC_HCAPTCHA_SITE_KEY production
vercel env add NEXT_PUBLIC_STUB_MODE production
vercel env add WEB_STRIPE_SECRET_KEY production
vercel env add WEB_STRIPE_WEBHOOK_SECRET production
vercel env add STRIPE_PRICE_PATROL production
vercel env add STRIPE_PRICE_BUSINESS production
vercel env add STRIPE_PRICE_CAMPUS production

# Deploy
vercel --prod
```

## Getting Your API Keys

### 🔑 Stripe Setup
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **API Keys**
3. Copy your **Secret Key** (starts with `sk_`)
4. Go to **Developers** → **Webhooks**
5. Create endpoint: `https://your-app.vercel.app/api/stripe/webhook`
6. Select events: `checkout.session.completed`, `invoice.payment_succeeded`
7. Copy the **Webhook Secret** (starts with `whsec_`)
8. Go to **Products** → Create your pricing plans
9. Copy the **Price IDs** (start with `price_`)

### 🤖 hCaptcha Setup
1. Go to [hCaptcha Dashboard](https://dashboard.hcaptcha.com/)
2. Create a new site
3. Add your Vercel domain to allowed domains
4. Copy the **Site Key**

### 🌐 API Backend
- If using Railway: Get URL from Railway dashboard
- If using custom backend: Use your API domain
- Format: `https://your-api-domain.com` (no trailing slash)

## Common Issues & Solutions

### ❌ FUNCTION_INVOCATION_FAILED
**Cause**: Missing or incorrect environment variables
**Solution**: Double-check all required variables are set with correct values

### ❌ Build Failures
**Cause**: Root directory not set correctly
**Solution**: Ensure Vercel project root directory is set to `apps/web`

### ❌ Runtime Errors
**Cause**: Invalid API endpoints or keys
**Solution**: Test your API endpoints separately and verify all keys are active

### ❌ Stripe Integration Issues
**Cause**: Webhook endpoints not configured
**Solution**: Create webhook in Stripe dashboard pointing to your Vercel domain

## Verification

After deployment, test these URLs:
- `https://your-app.vercel.app/` ← Should load homepage
- `https://your-app.vercel.app/request` ← Should load request form
- `https://your-app.vercel.app/retainers` ← Should load retainers page

Run the verification script:
```bash
node verify-deployment.js https://your-app.vercel.app
```

## Support Resources

- **Main Guide**: `VERCEL_DEPLOYMENT_GUIDE.md`
- **Deployment Docs**: `DEPLOYMENT-GUIDE.md`
- **Secrets Template**: `docs/secrets-template.txt`
- **GitHub Workflow**: `.github/workflows/deploy-web.yml`