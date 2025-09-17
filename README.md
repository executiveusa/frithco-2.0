# FRITHCO — Full-Stack (Vercel + Railway)
Luxury graffiti removal leadgen for Everett + North Seattle.

## 🚀 Quick Deploy to Vercel

**Experiencing FUNCTION_INVOCATION_FAILED errors?** → See [`DEPLOYMENT_SOLUTION.md`](./DEPLOYMENT_SOLUTION.md) for the complete fix.

For step-by-step Vercel deployment: [`VERCEL_DEPLOYMENT_GUIDE.md`](./VERCEL_DEPLOYMENT_GUIDE.md)

## Stack
- Web: Next.js 14 (App Router), Tailwind, Framer, GSAP, Stripe Checkout (subscriptions)
- API: Express + Prisma + Postgres, Stripe Connect marketplace, S3 presign uploads
- Tests: vitest + testing-library + playwright (web), vitest + supertest (api)
- Telemetry: minimal OTel stubs

## Dev
cp .env.example .env.local
# set local Postgres/Stripe/S3 or use Railway/Vercel envs
pnpm i
pnpm dev

## Deploy
- Web → Vercel (set WEB_* + NEXT_PUBLIC_* env vars)
- API → Railway (Dockerfile + Procfile). Set DATABASE_URL, STRIPE_*, S3_*.

## DB
pnpm migrate   # runs prisma migrate deploy on the API

## Subscriptions (web)
Create 3 recurring prices in Stripe → put IDs in STRIPE_PRICE_*.
Webhook (Vercel): /api/stripe/webhook → events: checkout.session.completed, invoice.payment_succeeded.

## Authentication
- Web: Clerk for auth with Google Sign-In. Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` on web. Create Clerk OAuth Google in dashboard.
- API: Protect vendor/charge routes with Clerk JWT. Set `CLERK_SECRET_KEY` on API. Send `Authorization: Bearer <token>` from the web app when calling protected API endpoints.

## Anti‑abuse / Security
- Lead form uses hCaptcha (invisible) and a hidden honeypot field. Set `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` (web) and `HCAPTCHA_SECRET` (api).
- API CORS allowlist: set `WEB_ORIGIN` to a comma-separated list of allowed origins.
- Helmet security headers enabled on API; rate limiting configurable via env.

## Marketplace (api)
Create connected vendor: POST /v1/vendors
Onboard link: POST /v1/vendors/:id/account-link
Create charge split: POST /v1/charges  (application_fee + transfer_data)
Webhook (Railway): /webhooks/stripe → handles PI + transfers.
