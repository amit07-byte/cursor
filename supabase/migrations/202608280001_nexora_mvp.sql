-- Nexora MVP schema (Supabase / Postgres)
-- Apply via Supabase SQL editor or `supabase db push`

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  free_validations_used int not null default 0 check (free_validations_used >= 0),
  paid_credits int not null default 0 check (paid_credits >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.validation_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete set null,
  email text not null,
  product_url text,
  product_description text,
  status text not null check (status in ('pending', 'complete', 'failed')),
  used_free_credit boolean not null default true,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.validation_reports (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique references public.validation_requests (id) on delete cascade,
  verdict text not null check (verdict in ('Opportunity', 'Wait', 'Crowded')),
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  confidence_score int not null check (confidence_score between 0 and 100),
  best_fit_market text not null,
  summary text not null,
  report_json jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  provider text not null,
  provider_payment_id text not null,
  credits_granted int not null,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  unique (provider, provider_payment_id)
);

create index if not exists validation_requests_email_idx on public.validation_requests (email);
create index if not exists validation_requests_status_idx on public.validation_requests (status);

alter table public.profiles enable row level security;
alter table public.validation_requests enable row level security;
alter table public.validation_reports enable row level security;
alter table public.payments enable row level security;

-- Users can only read their own rows (auth.jwt email claim)
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.jwt() ->> 'email' = email);

create policy "requests_select_own"
  on public.validation_requests for select
  using (auth.jwt() ->> 'email' = email);

create policy "reports_select_own"
  on public.validation_reports for select
  using (
    exists (
      select 1 from public.validation_requests r
      where r.id = request_id and r.email = auth.jwt() ->> 'email'
    )
  );
