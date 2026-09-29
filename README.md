# Pathly

**YouTube Learning Path Builder** — turn a topic, skill level, and preferences into a sequenced YouTube learning path powered by OpenAI + YouTube Data API v3.

> Learn with intention, not infinite scroll.

## Develop

```bash
npm install
cp .env.example .env.local
# Add OPENAI_API_KEY and YOUTUBE_API_KEY to .env.local (server-side only)
npx vercel dev
```

`vercel dev` serves the Vite frontend and `POST /api/generate-path` together.

Frontend-only UI work (no API):

```bash
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Environment variables

Store secrets in `.env.local` locally and in the Vercel project settings for production:

| Variable | Where used | Notes |
|----------|------------|-------|
| `OPENAI_API_KEY` | `/api/generate-path` only | Never use a `VITE_` prefix |
| `YOUTUBE_API_KEY` | `/api/generate-path` only | Never use a `VITE_` prefix |

`.env` / `.env.local` are gitignored. `.env.example` is placeholders only.

## How generation works

1. User submits the existing Pathly form
2. Frontend `POST`s to `/api/generate-path`
3. Server uses OpenAI to build a sequential curriculum
4. Server searches YouTube Data API v3 for each module
5. Structured `GeneratedPath` JSON is returned and rendered by `PathResults`

## Deploy (Vercel)

1. Merge PR → `main`
2. Import repo at [vercel.com](https://vercel.com/new)
3. Framework: **Vite** · Build: `npm run build` · Output: `dist`
4. Add `OPENAI_API_KEY` and `YOUTUBE_API_KEY` in Project → Settings → Environment Variables
5. Deploy

`vercel.json` rewrites SPA routes to `index.html` while leaving `/api/*` to serverless functions.

## Paths

| Path | Purpose |
|------|---------|
| `/` | Learning path builder UI |
| `POST /api/generate-path` | OpenAI + YouTube path generation |
