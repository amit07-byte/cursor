# Nexora MVP

AI product research for e-commerce sellers — **Opportunity / Wait / Crowded** verdicts with a transparent full report.

## Stack (PRD v3)

- **Frontend:** Next.js (App Router)
- **Data (MVP demo):** local JSON store in `.data/` (swap to Supabase when keys are set)
- **Schema / RLS:** `supabase/migrations/`
- **APIs:** `/api/submit-validation`, `/api/request-status/:id`, `/api/report/:id`, `/api/webhook/payment`
- **Research:** demo orchestration by default; live Claude + Exa when env keys are present (hooks ready)

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Core flow

1. Landing → **Validate** (`/validate`) with email + URL or description  
2. Free credit check (3 lifetime) + rate limit  
3. Researching state (`/request/:id`)  
4. Quick Verdict → Full Report (`/report/:id`)  
5. Pricing when free credits are exhausted (`/pricing`)

## Environment

Copy `.env.example` to `.env.local` when wiring real providers:

- `ANTHROPIC_API_KEY` / `EXA_API_KEY` — live research (optional for demo)
- `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — production DB
- `PAYMENT_WEBHOOK_SECRET` — webhook signature for payment credits

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
