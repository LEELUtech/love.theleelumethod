# Leelu V2

Website for Lily Chystofat — numerology and relationship coaching programs.

## Stack

- Next.js 14, TypeScript, TailwindCSS
- Stripe (payments)
- Firebase (App Hosting, Cloud Functions, Firestore)
- Zoho (CRM, Campaigns, Analytics, SalesIQ)

## Pages

- `/` — Landing
- `/programs` — Programs overview
- `/programs/self-guided-transformation` — Self-Guided Transformation
- `/programs/guided-breakthrough` — Guided Breakthrough
- `/programs/vip-immersion` — VIP Immersion
- `/1-on-1` — 1-on-1 coaching
- `/decode` — Quiz result page
- `/resources` — Free resources
- `/resources/compatibility-report` — Compatibility report
- `/resources/secrets` — Secrets page
- `/about` — About Lily
- `/success` — Post-purchase confirmation

## API Routes

- `POST /api/create-payment-intent` — Create Stripe payment intent
- `POST /api/update-payment-intent` — Update payment intent with billing data
- `POST /api/lead-captured` — Zoho CRM lead creation
- `POST /api/add-tags` — Zoho CRM tagging
- `POST /api/quiz-completed` — Quiz completion handler
- `POST /api/score-crm` — CRM scoring
- `POST /api/resource-optin` — Resource opt-in
- `POST /api/event-log` — Funnel event logging

## Dev

```bash
npm install
npm run dev
```
