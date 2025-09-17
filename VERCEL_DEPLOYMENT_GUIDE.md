# Vercel Deployment Guide for Fritco Locale Scaffold

This guide will help you deploy your fritco-locale-scaffold project to Vercel and resolve the FUNCTION_INVOCATION_FAILED error.

## Overview

The fritco-locale-scaffold project is a full-stack application with:
- **Web App**: Next.js 14 app (deployed to Vercel)
- **API**: Express.js API (deployed to Railway)

## Prerequisites

1. ✅ **GitHub Repository**: Ensure your project is pushed to GitHub
2. ✅ **Vercel Account**: Create account at [vercel.com](https://vercel.com)
3. 🔧 **External Services**: Set up required third-party services

## Step 1: Verify GitHub Repository

First, ensure your repository is properly pushed to GitHub:

```bash
# Check current status
git status
git remote -v

# If not connected to GitHub, add remote:
git remote add origin https://github.com/YOUR_USERNAME/fritco-locale-scaffold.git

# Push to GitHub
git add .
git commit -m "Initial commit"
git push -u origin main
```

## Step 2: Link Repository to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your `fritco-locale-scaffold` repository
3. Set the **Root Directory** to `apps/web` (important!)
4. Leave framework preset as "Next.js"
5. Click "Deploy" (it will fail initially due to missing environment variables)

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to **Settings** → **Environment Variables** and add the following:

### Required Public Variables (NEXT_PUBLIC_)

| Variable | Value | Environment |
|----------|--------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://your-vercel-app-url.vercel.app` | Production, Preview |
| `NEXT_PUBLIC_API_BASE` | `https://your-railway-api-url.railway.app` | Production, Preview |
| `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` | Your hCaptcha site key | Production, Preview |
| `NEXT_PUBLIC_STUB_MODE` | `0` | Production, Preview |

### Required Secret Variables

| Variable | Value | Environment |
|----------|--------|-------------|
| `WEB_STRIPE_SECRET_KEY` | Your Stripe secret key | Production, Preview |
| `WEB_STRIPE_WEBHOOK_SECRET` | Your Stripe webhook secret | Production, Preview |
| `STRIPE_PRICE_PATROL` | Stripe price ID for patrol plan | Production, Preview |
| `STRIPE_PRICE_BUSINESS` | Stripe price ID for business plan | Production, Preview |
| `STRIPE_PRICE_CAMPUS` | Stripe price ID for campus plan | Production, Preview |

### Optional Variables (Clerk - if using authentication)

| Variable | Value | Environment |
|----------|--------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Your Clerk publishable key | Production, Preview |

## Step 4: Obtain Required API Keys

### For Stripe Integration:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your secret key from **Developers** → **API Keys**
3. Create webhook endpoint for your Vercel domain
4. Create pricing plans and copy the price IDs

### For hCaptcha:
1. Go to [hCaptcha Dashboard](https://dashboard.hcaptcha.com/)
2. Create a new site
3. Copy the site key

### For Database (if needed):
- Your DATABASE_URL is: `postgresql://neondb_owner:npg_Dql0MfSi4ZtN@ep-wandering-dew-adh2z6eb-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`

### For OAuth (if using GitHub/Google auth):
1. **GitHub OAuth**: Create app at [GitHub Settings](https://github.com/settings/applications/new)
2. **Google OAuth**: Create app at [Google Cloud Console](https://console.cloud.google.com/)

## Step 5: Update Environment Variables with Real Values

Replace these placeholder values with your actual keys:

```bash
# Example values - DO NOT use these in production
NEXT_PUBLIC_SITE_URL=https://your-project-name.vercel.app
NEXT_PUBLIC_API_BASE=https://your-api-domain.railway.app
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=10000000-ffff-ffff-ffff-000000000001
WEB_STRIPE_SECRET_KEY=sk_live_...
WEB_STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PATROL=price_...
STRIPE_PRICE_BUSINESS=price_...
STRIPE_PRICE_CAMPUS=price_...
```

## Step 6: Trigger New Deployment

After setting all environment variables:

1. Go to your Vercel project dashboard
2. Go to **Deployments** tab
3. Click the "..." menu on the latest deployment
4. Click **Redeploy**
5. Monitor the build logs for any errors

## Step 7: Verify Deployment

Test these URLs once deployed:

- `https://your-app.vercel.app/` - Homepage
- `https://your-app.vercel.app/request` - Request form
- `https://your-app.vercel.app/retainers` - Retainers page
- `https://your-app.vercel.app/thank-you` - Thank you page

## Troubleshooting

### FUNCTION_INVOCATION_FAILED Error
This usually means:
1. ❌ Missing environment variables
2. ❌ Incorrect API endpoint URLs
3. ❌ Invalid API keys

### Build Failures
1. Check Vercel build logs
2. Ensure `apps/web` is set as root directory
3. Verify all required dependencies are installed

### Runtime Errors
1. Check Vercel function logs
2. Verify external API endpoints are accessible
3. Test environment variables are correctly set

## Environment Variables Checklist

Use this checklist when setting up Vercel:

- [ ] `NEXT_PUBLIC_SITE_URL` - Set to your Vercel app URL
- [ ] `NEXT_PUBLIC_API_BASE` - Set to your Railway API URL  
- [ ] `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` - From hCaptcha dashboard
- [ ] `NEXT_PUBLIC_STUB_MODE` - Set to `0` for production
- [ ] `WEB_STRIPE_SECRET_KEY` - From Stripe dashboard
- [ ] `WEB_STRIPE_WEBHOOK_SECRET` - From Stripe webhook config
- [ ] `STRIPE_PRICE_PATROL` - Stripe price ID
- [ ] `STRIPE_PRICE_BUSINESS` - Stripe price ID  
- [ ] `STRIPE_PRICE_CAMPUS` - Stripe price ID
- [ ] All variables set for both Production and Preview environments

## Support

If you continue to experience issues:

1. Check the existing deployment documentation in `docs/secrets-template.txt`
2. Review the GitHub Actions workflow in `.github/workflows/deploy-web.yml`
3. Consult the `DEPLOYMENT-GUIDE.md` for additional deployment details

## Next Steps

After successful deployment:
1. Set up your Railway API deployment
2. Configure Stripe webhooks to point to your Vercel domain
3. Test the complete application flow
4. Set up monitoring and error tracking