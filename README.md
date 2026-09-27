# Pathly

MVP marketplace connecting **businesses** and **content creators**.

Businesses post campaigns. Creators browse/filter the open feed, join campaigns that fit, and negotiate in in-app chat. No payments or escrow in v1.

> Post the work. Start the chat.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Demo accounts

All seeded passwords: `pathly123`

| Role | Email |
|------|--------|
| Admin | `admin@pathly.app` |
| Business | `maya@harbor.demo` |
| Creator | `jordan@pathly.demo` |

Data persists in `localStorage` (`pathly.mvp.v1`). Use **Reset demo data** in the admin panel to reseed 15 creators + sample campaigns.

## Core flows

- **Business:** Sign up → profile → post campaign → get notified when a creator joins → chat
- **Creator:** Sign up → profile → browse/filter feed → join → chat
- **Admin:** View users/campaigns, close campaigns, remove users, review reports

## Paths

| Path | Purpose |
|------|---------|
| `/` | Landing |
| `/auth` | Sign up / sign in (email or demo Google) |
| `/onboarding` | Role + profile setup |
| `/app/business` | Business campaigns |
| `/app/campaigns/new` | Post campaign |
| `/app/feed` | Creator campaign feed |
| `/app/inbox` | Conversations |
| `/app/chat/:id` | In-app chat (+ report/block) |
| `/app/admin` | Admin panel |

## Notes

- Auth, database, and chat are client-side for this MVP (no Bubble / backend required to try the loop).
- “Email notifications” are simulated in the in-app Alerts panel.
- Google sign-in is a demo stub (creates a local account).

## Deploy (Vercel)

1. Merge PR → `main`
2. Import repo at [vercel.com](https://vercel.com/new)
3. Framework: **Vite** · Build: `npm run build` · Output: `dist`
4. Deploy — you get a live URL

`vercel.json` already rewrites SPA routes to `index.html`.
