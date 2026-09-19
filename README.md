# Pathly

Landing page for **Pathly** — local businesses post campaigns, nearby creators apply, deals move to WhatsApp.

> Post the work. Get matched.

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

## Waitlist

The **Get app** button opens a modal. Submissions are emailed to **amrai0583@gmail.com** via [FormSubmit](https://formsubmit.co).

**First time only:** FormSubmit sends an activation email to that inbox. Click the confirm link once. After that, every signup emails you automatically (name + email).

Optional override in `.env`:

```bash
VITE_WAITLIST_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

## Deploy (Vercel)

1. Merge PR → `main`
2. Import repo at [vercel.com](https://vercel.com/new)
3. Framework: **Vite** · Build: `npm run build` · Output: `dist`
4. Deploy — you get a live URL

`vercel.json` already rewrites SPA routes to `index.html`.

## Paths

| Path | Purpose |
|------|---------|
| `/` | Landing + Get app waitlist |
| `/signup/business` | Business signup (optional) |
| `/signup/creator` | Creator signup (optional) |
