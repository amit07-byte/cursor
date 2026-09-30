# Pathly

Pathly connects local businesses with creators.

A business posts a campaign. Creators browse published campaigns and apply. The business reviews applications and accepts or declines creators.

This repository is the V1 foundation: the Next.js app shell, design system, Supabase clients, and database schema. Campaign posting, applications, and authentication are not wired up yet.

## Install

```bash
npm install
```

## Environment variables

Copy the example file and fill in the values from your Supabase project (**Project Settings → API**):

```bash
cp .env.example .env.local
```

| Variable | Required | Where it is used |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes, before auth or data calls | Browser and server Supabase clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes, before auth or data calls | Browser and server Supabase clients |

The anon key is public. It is safe in client code because Row Level Security restricts what it can read and write.

Do not add the Supabase service role key to this app. Do not create a `NEXT_PUBLIC_` variable for it. The service role bypasses Row Level Security.

The landing page runs without these variables. Session refresh starts once both are set.

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## Connect Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Copy the project URL and anon key into `.env.local`.
3. Apply the database migration below.
4. Restart `npm run dev`.

Clients live in:

- `lib/supabase/client.ts` — browser
- `lib/supabase/server.ts` — Server Components and route handlers
- `lib/supabase/proxy.ts` — refreshes the auth cookie from `proxy.ts`

Signup will store the role in `raw_user_meta_data.role` as `BUSINESS` or `CREATOR`. A trigger copies that into `profiles` and the role cannot be changed later.

## Apply database migrations

Migration file: `supabase/migrations/20260930140000_init.sql`

### SQL editor

1. Open the Supabase dashboard → **SQL Editor**.
2. Paste the contents of the migration file.
3. Run it.

### Supabase CLI

```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push
```

`supabase link` writes the project reference outside this repo. If the CLI asks you to initialize first, run `npx supabase init` and keep the existing `supabase/migrations` folder.

## Roles

| Role | What this schema allows |
| --- | --- |
| `BUSINESS` | Create and update their own business profile and campaigns. Read applications to those campaigns and update application status. |
| `CREATOR` | Create and update their own creator profile. Read published campaigns. Create and read their own applications. |

Draft campaigns stay private to the owning business. Published campaigns are readable by any signed-in user. Users cannot read unrelated private profiles, applications, portfolio items, or notifications.

Notifications can be read and marked read by their owner. Inserts are left to a trusted server path later. There is no client insert policy.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Landing page |
| `/login` | Login shell |
| `/signup` | Signup shell, with `?role=business` or `?role=creator` |
| `/business` | Business workspace shell |
| `/creator` | Creator workspace shell |

## Deploy

The app is a Next.js App Router project. `vercel.json` sets the Vercel framework to Next.js. Set the same two environment variables in the Vercel project settings.
