-- Pathly V1 schema
-- Roles: BUSINESS, CREATOR
-- Apply in the Supabase SQL editor or with `supabase db push`.
-- The app uses the anon key only. Do not put the service role key in client code.

create extension if not exists pgcrypto;

create type public.user_role as enum ('BUSINESS', 'CREATOR');
create type public.campaign_status as enum ('draft', 'published', 'closed');
create type public.application_status as enum ('pending', 'accepted', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_not_blank check (char_length(btrim(display_name)) > 0)
);

create table public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  business_name text not null,
  city text,
  category text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint business_profiles_name_not_blank check (char_length(btrim(business_name)) > 0)
);

create table public.creator_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  city text,
  niches text[] not null default '{}',
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business_profiles (id) on delete cascade,
  title text not null,
  description text,
  category text,
  city text,
  status public.campaign_status not null default 'draft',
  deadline date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint campaigns_title_not_blank check (char_length(btrim(title)) > 0)
);

create table public.campaign_requirements (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  description text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint campaign_requirements_description_not_blank check (char_length(btrim(description)) > 0),
  constraint campaign_requirements_sort_order_nonnegative check (sort_order >= 0)
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  creator_id uuid not null references public.creator_profiles (id) on delete cascade,
  message text,
  status public.application_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint applications_unique_creator_per_campaign unique (campaign_id, creator_id)
);

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creator_profiles (id) on delete cascade,
  title text not null,
  description text,
  url text,
  created_at timestamptz not null default now(),
  constraint portfolio_items_title_not_blank check (char_length(btrim(title)) > 0)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  constraint notifications_title_not_blank check (char_length(btrim(title)) > 0)
);

-- Indexes for the filters the marketplace will use.
create index campaigns_status_idx on public.campaigns (status);
create index campaigns_city_idx on public.campaigns (city);
create index campaigns_category_idx on public.campaigns (category);
create index campaigns_deadline_idx on public.campaigns (deadline);
create index campaigns_business_id_idx on public.campaigns (business_id);

create index creator_profiles_city_idx on public.creator_profiles (city);
create index creator_profiles_niches_idx on public.creator_profiles using gin (niches);

create index applications_campaign_id_idx on public.applications (campaign_id);
create index applications_creator_id_idx on public.applications (creator_id);
create index applications_status_idx on public.applications (status);

create index campaign_requirements_campaign_id_idx on public.campaign_requirements (campaign_id);
create index portfolio_items_creator_id_idx on public.portfolio_items (creator_id);
create index notifications_user_id_idx on public.notifications (user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.prevent_profile_identity_change()
returns trigger
language plpgsql
as $$
begin
  if new.id is distinct from old.id or new.role is distinct from old.role then
    raise exception 'profile id and role cannot be changed';
  end if;
  return new;
end;
$$;

create or replace function public.prevent_user_id_change()
returns trigger
language plpgsql
as $$
begin
  if new.user_id is distinct from old.user_id then
    raise exception 'user_id cannot be changed';
  end if;
  return new;
end;
$$;

create or replace function public.enforce_profile_kind()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  expected public.user_role;
begin
  if tg_table_name = 'business_profiles' then
    expected := 'BUSINESS';
  elsif tg_table_name = 'creator_profiles' then
    expected := 'CREATOR';
  else
    raise exception 'unexpected table %', tg_table_name;
  end if;

  if not exists (
    select 1
    from public.profiles
    where id = new.user_id
      and role = expected
  ) then
    raise exception 'user role does not match %', tg_table_name;
  end if;

  return new;
end;
$$;

create or replace function public.prevent_campaign_business_change()
returns trigger
language plpgsql
as $$
begin
  if new.business_id is distinct from old.business_id then
    raise exception 'campaign business cannot be changed';
  end if;
  return new;
end;
$$;

create or replace function public.prevent_campaign_requirement_move()
returns trigger
language plpgsql
as $$
begin
  if new.campaign_id is distinct from old.campaign_id then
    raise exception 'campaign_id cannot be changed';
  end if;
  return new;
end;
$$;

create or replace function public.prevent_portfolio_creator_change()
returns trigger
language plpgsql
as $$
begin
  if new.creator_id is distinct from old.creator_id then
    raise exception 'creator_id cannot be changed';
  end if;
  return new;
end;
$$;

create or replace function public.enforce_new_application()
returns trigger
language plpgsql
as $$
begin
  if new.status is distinct from 'pending' then
    raise exception 'new applications must start as pending';
  end if;
  return new;
end;
$$;

create or replace function public.protect_application_update()
returns trigger
language plpgsql
as $$
begin
  if not public.owns_campaign(old.campaign_id) then
    raise exception 'not allowed to update this application';
  end if;

  if new.id is distinct from old.id
    or new.campaign_id is distinct from old.campaign_id
    or new.creator_id is distinct from old.creator_id
    or new.message is distinct from old.message
    or new.created_at is distinct from old.created_at
  then
    raise exception 'businesses may only update application status';
  end if;

  return new;
end;
$$;

create or replace function public.protect_notification_update()
returns trigger
language plpgsql
as $$
begin
  if new.id is distinct from old.id
    or new.user_id is distinct from old.user_id
    or new.title is distinct from old.title
    or new.body is distinct from old.body
    or new.created_at is distinct from old.created_at
  then
    raise exception 'only read_at can be updated';
  end if;
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text := new.raw_user_meta_data ->> 'role';
  requested_name text := nullif(btrim(new.raw_user_meta_data ->> 'display_name'), '');
begin
  if requested_role is null or requested_role not in ('BUSINESS', 'CREATOR') then
    raise exception 'signup requires role BUSINESS or CREATOR';
  end if;

  insert into public.profiles (id, role, display_name)
  values (
    new.id,
    requested_role::public.user_role,
    coalesce(
      requested_name,
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'New user'
    )
  );

  return new;
end;
$$;

create or replace function public.is_business()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'BUSINESS'
  );
$$;

create or replace function public.is_creator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'CREATOR'
  );
$$;

create or replace function public.owns_business(business uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.business_profiles
    where id = business
      and user_id = auth.uid()
  );
$$;

create or replace function public.owns_creator(creator uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.creator_profiles
    where id = creator
      and user_id = auth.uid()
  );
$$;

create or replace function public.owns_campaign(target_campaign uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.campaigns as campaign
    join public.business_profiles as business on business.id = campaign.business_id
    where campaign.id = target_campaign
      and business.user_id = auth.uid()
  );
$$;

create or replace function public.campaign_is_published(campaign uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.campaigns
    where id = campaign
      and status = 'published'
  );
$$;

create or replace function public.business_has_published_campaign(business uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.campaigns
    where business_id = business
      and status = 'published'
  );
$$;

create or replace function public.business_can_view_creator(creator uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.applications as application
    join public.campaigns as campaign on campaign.id = application.campaign_id
    join public.business_profiles as business on business.id = campaign.business_id
    where application.creator_id = creator
      and business.user_id = auth.uid()
  );
$$;

create or replace function public.can_view_profile(target uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    target = auth.uid()
    or exists (
      select 1
      from public.business_profiles as business
      join public.campaigns as campaign on campaign.business_id = business.id
      where business.user_id = target
        and campaign.status = 'published'
    )
    or exists (
      select 1
      from public.creator_profiles as creator
      join public.applications as application on application.creator_id = creator.id
      join public.campaigns as campaign on campaign.id = application.campaign_id
      join public.business_profiles as business on business.id = campaign.business_id
      where creator.user_id = target
        and business.user_id = auth.uid()
    );
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger profiles_prevent_identity_change
before update on public.profiles
for each row execute function public.prevent_profile_identity_change();

create trigger business_profiles_set_updated_at
before update on public.business_profiles
for each row execute function public.set_updated_at();

create trigger business_profiles_prevent_user_change
before update on public.business_profiles
for each row execute function public.prevent_user_id_change();

create trigger business_profiles_enforce_role
before insert or update on public.business_profiles
for each row execute function public.enforce_profile_kind();

create trigger creator_profiles_set_updated_at
before update on public.creator_profiles
for each row execute function public.set_updated_at();

create trigger creator_profiles_prevent_user_change
before update on public.creator_profiles
for each row execute function public.prevent_user_id_change();

create trigger creator_profiles_enforce_role
before insert or update on public.creator_profiles
for each row execute function public.enforce_profile_kind();

create trigger campaigns_set_updated_at
before update on public.campaigns
for each row execute function public.set_updated_at();

create trigger campaigns_prevent_business_change
before update on public.campaigns
for each row execute function public.prevent_campaign_business_change();

create trigger campaign_requirements_prevent_move
before update on public.campaign_requirements
for each row execute function public.prevent_campaign_requirement_move();

create trigger applications_enforce_pending_insert
before insert on public.applications
for each row execute function public.enforce_new_application();

create trigger applications_protect_update
before update on public.applications
for each row execute function public.protect_application_update();

create trigger applications_set_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

create trigger portfolio_items_prevent_creator_change
before update on public.portfolio_items
for each row execute function public.prevent_portfolio_creator_change();

create trigger notifications_protect_update
before update on public.notifications
for each row execute function public.protect_notification_update();

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.business_profiles enable row level security;
alter table public.creator_profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_requirements enable row level security;
alter table public.applications enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.notifications enable row level security;

create policy profiles_select
on public.profiles
for select
to authenticated
using (public.can_view_profile(id));

create policy profiles_insert
on public.profiles
for insert
to authenticated
with check (id = (select auth.uid()));

create policy profiles_update
on public.profiles
for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy business_profiles_select
on public.business_profiles
for select
to authenticated
using (
  user_id = (select auth.uid())
  or public.business_has_published_campaign(id)
);

create policy business_profiles_insert
on public.business_profiles
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and public.is_business()
);

create policy business_profiles_update
on public.business_profiles
for update
to authenticated
using (user_id = (select auth.uid()))
with check (
  user_id = (select auth.uid())
  and public.is_business()
);

create policy creator_profiles_select
on public.creator_profiles
for select
to authenticated
using (
  user_id = (select auth.uid())
  or public.business_can_view_creator(id)
);

create policy creator_profiles_insert
on public.creator_profiles
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and public.is_creator()
);

create policy creator_profiles_update
on public.creator_profiles
for update
to authenticated
using (user_id = (select auth.uid()))
with check (
  user_id = (select auth.uid())
  and public.is_creator()
);

create policy campaigns_select_published
on public.campaigns
for select
to authenticated
using (status = 'published');

create policy campaigns_select_own
on public.campaigns
for select
to authenticated
using (public.owns_business(business_id));

create policy campaigns_insert_own
on public.campaigns
for insert
to authenticated
with check (
  public.is_business()
  and public.owns_business(business_id)
);

create policy campaigns_update_own
on public.campaigns
for update
to authenticated
using (public.owns_business(business_id))
with check (
  public.is_business()
  and public.owns_business(business_id)
);

create policy campaign_requirements_select
on public.campaign_requirements
for select
to authenticated
using (
  public.campaign_is_published(campaign_id)
  or public.owns_campaign(campaign_id)
);

create policy campaign_requirements_insert
on public.campaign_requirements
for insert
to authenticated
with check (
  public.is_business()
  and public.owns_campaign(campaign_id)
);

create policy campaign_requirements_update
on public.campaign_requirements
for update
to authenticated
using (public.owns_campaign(campaign_id))
with check (
  public.is_business()
  and public.owns_campaign(campaign_id)
);

create policy campaign_requirements_delete
on public.campaign_requirements
for delete
to authenticated
using (
  public.is_business()
  and public.owns_campaign(campaign_id)
);

create policy applications_select
on public.applications
for select
to authenticated
using (
  public.owns_creator(creator_id)
  or public.owns_campaign(campaign_id)
);

create policy applications_insert
on public.applications
for insert
to authenticated
with check (
  public.is_creator()
  and public.owns_creator(creator_id)
  and public.campaign_is_published(campaign_id)
  and status = 'pending'
);

create policy applications_update_status
on public.applications
for update
to authenticated
using (public.owns_campaign(campaign_id))
with check (
  public.is_business()
  and public.owns_campaign(campaign_id)
);

create policy portfolio_items_select
on public.portfolio_items
for select
to authenticated
using (
  public.owns_creator(creator_id)
  or public.business_can_view_creator(creator_id)
);

create policy portfolio_items_insert
on public.portfolio_items
for insert
to authenticated
with check (
  public.is_creator()
  and public.owns_creator(creator_id)
);

create policy portfolio_items_update
on public.portfolio_items
for update
to authenticated
using (public.owns_creator(creator_id))
with check (
  public.is_creator()
  and public.owns_creator(creator_id)
);

create policy portfolio_items_delete
on public.portfolio_items
for delete
to authenticated
using (
  public.is_creator()
  and public.owns_creator(creator_id)
);

create policy notifications_select
on public.notifications
for select
to authenticated
using (user_id = (select auth.uid()));

create policy notifications_update
on public.notifications
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

revoke all on table public.profiles from anon;
revoke all on table public.business_profiles from anon;
revoke all on table public.creator_profiles from anon;
revoke all on table public.campaigns from anon;
revoke all on table public.campaign_requirements from anon;
revoke all on table public.applications from anon;
revoke all on table public.portfolio_items from anon;
revoke all on table public.notifications from anon;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.business_profiles to authenticated;
grant select, insert, update on public.creator_profiles to authenticated;
grant select, insert, update on public.campaigns to authenticated;
grant select, insert, update, delete on public.campaign_requirements to authenticated;
grant select, insert, update on public.applications to authenticated;
grant select, insert, update, delete on public.portfolio_items to authenticated;
grant select, update on public.notifications to authenticated;

revoke all on function public.set_updated_at() from public;
revoke all on function public.prevent_profile_identity_change() from public;
revoke all on function public.prevent_user_id_change() from public;
revoke all on function public.enforce_profile_kind() from public;
revoke all on function public.prevent_campaign_business_change() from public;
revoke all on function public.prevent_campaign_requirement_move() from public;
revoke all on function public.prevent_portfolio_creator_change() from public;
revoke all on function public.enforce_new_application() from public;
revoke all on function public.protect_application_update() from public;
revoke all on function public.protect_notification_update() from public;
revoke all on function public.handle_new_user() from public;
revoke all on function public.is_business() from public;
revoke all on function public.is_creator() from public;
revoke all on function public.owns_business(uuid) from public;
revoke all on function public.owns_creator(uuid) from public;
revoke all on function public.owns_campaign(uuid) from public;
revoke all on function public.campaign_is_published(uuid) from public;
revoke all on function public.business_has_published_campaign(uuid) from public;
revoke all on function public.business_can_view_creator(uuid) from public;
revoke all on function public.can_view_profile(uuid) from public;

grant execute on function public.set_updated_at() to authenticated;
grant execute on function public.prevent_profile_identity_change() to authenticated;
grant execute on function public.prevent_user_id_change() to authenticated;
grant execute on function public.enforce_profile_kind() to authenticated;
grant execute on function public.prevent_campaign_business_change() to authenticated;
grant execute on function public.prevent_campaign_requirement_move() to authenticated;
grant execute on function public.prevent_portfolio_creator_change() to authenticated;
grant execute on function public.enforce_new_application() to authenticated;
grant execute on function public.protect_application_update() to authenticated;
grant execute on function public.protect_notification_update() to authenticated;
grant execute on function public.is_business() to authenticated;
grant execute on function public.is_creator() to authenticated;
grant execute on function public.owns_business(uuid) to authenticated;
grant execute on function public.owns_creator(uuid) to authenticated;
grant execute on function public.owns_campaign(uuid) to authenticated;
grant execute on function public.campaign_is_published(uuid) to authenticated;
grant execute on function public.business_has_published_campaign(uuid) to authenticated;
grant execute on function public.business_can_view_creator(uuid) to authenticated;
grant execute on function public.can_view_profile(uuid) to authenticated;

grant execute on function public.handle_new_user() to supabase_auth_admin;
grant execute on function public.enforce_profile_kind() to supabase_auth_admin;
