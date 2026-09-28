# Pathly

**YouTube Learning Path Builder** — turn a topic, skill level, and preferences into a sequenced YouTube learning path.

> Learn with intention, not infinite scroll.

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

## What it does

Fill in:

- Topic, skill level, and learning goal
- Video length, teaching style, and creator preferences
- Weekly time and completion timeline
- Include / exclude content filters

Then hit **Generate Learning Path** for a curated multi-week video sequence.

## Deploy (Vercel)

1. Merge PR → `main`
2. Import repo at [vercel.com](https://vercel.com/new)
3. Framework: **Vite** · Build: `npm run build` · Output: `dist`
4. Deploy

`vercel.json` already rewrites SPA routes to `index.html`.

## Paths

| Path | Purpose |
|------|---------|
| `/` | Learning path builder |
