-- Climatify — Supabase initial schema (ported from Alembic a0729e0ed1d5)
-- Postgres-native: jsonb, timestamptz, RLS, Storage bucket-friendly

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- Profiles (links to auth.users on signup; supports admin pre-registration)
-- ============================================================
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null default '',
  city text not null default '',
  bio text not null default '',
  role text not null default 'member' check (role in ('admin','member','partner','school')),
  status text not null default 'active' check (status in ('active','suspended')),
  created_at timestamptz not null default now()
);
create index on public.profiles (role);
create index on public.profiles (status);

-- ============================================================
-- Content items (generic CMS: 10 kinds)
-- ============================================================
create table public.content_items (
  id text primary key,
  kind text not null check (kind in ('programs','initiatives','events','courses','games','opportunities','posts','team','careers','carbon-questions')),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.content_items (kind);
create index on public.content_items (created_at desc);
create index on public.content_items (kind, created_at desc);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger content_items_updated_at before update on public.content_items
for each row execute function public.touch_updated_at();

-- ============================================================
-- Contact messages
-- ============================================================
create table public.contact_messages (
  id bigserial primary key,
  sender text not null,
  email text not null,
  subject text not null,
  message text not null,
  date date not null default current_date,
  is_read boolean not null default false,
  check (char_length(sender) <= 200 and char_length(email) <= 254 and char_length(subject) <= 300 and char_length(message) <= 5000)
);
create index on public.contact_messages (date desc);
create index on public.contact_messages (is_read) where is_read = false;

-- ============================================================
-- Form submissions
-- ============================================================
create table public.form_submissions (
  id bigserial primary key,
  kind text not null,
  email text not null default '',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (char_length(kind) <= 80 and char_length(email) <= 254 and octet_length(payload::text) <= 32768)
);
create index on public.form_submissions (kind);
create index on public.form_submissions (created_at desc);
create unique index uq_newsletter_email on public.form_submissions (lower(email)) where kind = 'newsletter';

-- ============================================================
-- Event registrations
-- ============================================================
create table public.event_registrations (
  id bigserial primary key,
  event_id text not null,
  user_id uuid references public.profiles(id) on update cascade on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  ticket_code text not null unique,
  status text not null default 'Confirmed' check (status in ('Confirmed','Attended','Cancelled')),
  created_at timestamptz not null default now(),
  check (char_length(event_id) <= 160 and char_length(name) <= 200 and char_length(email) <= 254 and char_length(phone) <= 60 and char_length(ticket_code) <= 64)
);
create index on public.event_registrations (event_id);
create index on public.event_registrations (user_id);
create index on public.event_registrations (created_at desc);
create unique index uq_event_email_confirmed on public.event_registrations (event_id, lower(email)) where status = 'Confirmed';

-- ============================================================
-- User stats (1:1 with profiles)
-- ============================================================
create table public.user_stats (
  user_id uuid primary key references public.profiles(id) on update cascade on delete cascade,
  eco_points int not null default 0,
  virtual_trees int not null default 0,
  earned_badges int not null default 0
);

-- ============================================================
-- User activities
-- ============================================================
create table public.user_activities (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title_ar text not null,
  title_en text not null,
  detail_ar text not null,
  detail_en text not null,
  created_at timestamptz not null default now()
);
create index on public.user_activities (user_id, created_at desc);

-- ============================================================
-- Course progress
-- ============================================================
create table public.course_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  progress int not null default 0 check (progress between 0 and 100),
  primary key (user_id, course_id)
);
create index on public.course_progress (course_id);

-- ============================================================
-- Lessons
-- ============================================================
create table public.lessons (
  id bigserial primary key,
  course_id text not null references public.content_items(id) on delete cascade,
  title_en text not null,
  title_ar text not null,
  description_en text not null default '',
  description_ar text not null default '',
  lesson_order int not null check (lesson_order >= 1),
  duration text not null default '',
  content_url text not null default '',
  content_en text not null default '',
  content_ar text not null default '',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, lesson_order)
);
create index on public.lessons (course_id);
create trigger lessons_updated_at before update on public.lessons
for each row execute function public.touch_updated_at();

-- ============================================================
-- Impact history
-- ============================================================
create table public.impact_history (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  action_type text not null,
  value double precision not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index on public.impact_history (user_id);
create index on public.impact_history (action_type);
create index on public.impact_history (created_at);

-- ============================================================
-- Carbon footprints
-- ============================================================
create table public.carbon_footprints (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  footprint double precision not null,
  created_at timestamptz not null default now()
);
create index on public.carbon_footprints (user_id);

-- ============================================================
-- Bookmarks
-- ============================================================
create table public.bookmarks (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  content_type text not null check (content_type in ('courses','events','posts','programs','opportunities','initiatives')),
  content_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, content_type, content_id)
);
create index on public.bookmarks (user_id);

-- ============================================================
-- Admin settings (single row)
-- ============================================================
create table public.admin_settings (
  id int primary key default 1 check (id = 1),
  site_name text not null default 'Climatify',
  contact_email text not null default 'info@climatify-youth.com',
  enable_maintenance boolean not null default false
);
insert into public.admin_settings (id) values (1) on conflict do nothing;

-- ============================================================
-- Audit logs
-- ============================================================
create table public.audit_logs (
  id bigserial primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource text not null,
  ip_address text,
  created_at timestamptz not null default now()
);
create index on public.audit_logs (created_at desc);

-- ============================================================
-- Analytics events
-- ============================================================
create table public.analytics_events (
  id bigserial primary key,
  event_type text not null,
  path text not null default '',
  created_at timestamptz not null default now(),
  check (char_length(event_type) <= 64 and char_length(path) <= 512)
);
create index on public.analytics_events (event_type);
create index on public.analytics_events (created_at);

-- ============================================================
-- Certificates
-- ============================================================
create table public.certificates (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  certificate_id text not null unique,
  issued_at timestamptz not null default now(),
  unique (user_id, course_id)
);
create index on public.certificates (user_id);
create index on public.certificates (course_id);
create index on public.certificates (certificate_id);

-- ============================================================
-- Uploads (metadata; files live in Storage bucket)
-- ============================================================
create table public.uploads (
  id bigserial primary key,
  filename text not null,
  url text not null,
  content_type text not null,
  size int not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Helper: is_admin()
-- SECURITY DEFINER and fixed search_path to prevent infinite recursion
-- in profiles RLS and protect against search_path hijacking.
-- ============================================================
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and status = 'active');
$$;

-- Helper: is_active_user()
-- Ensures authenticated member is not suspended before mutating personal tables or gamification RPCs.
create or replace function public.is_active_user()
returns boolean language sql security definer set search_path = public stable as $$
  select auth.uid() is not null
    and not exists (
      select 1 from public.profiles where id = auth.uid() and status = 'suspended'
    );
$$;

-- Helper: can_update_own_profile()
-- Prevents role/status privilege escalation on self-update without recursive RLS evaluation.
create or replace function public.can_update_own_profile(target_id uuid, new_role text, new_status text)
returns boolean language sql security definer set search_path = public stable as $$
  select auth.uid() = target_id
    and exists (
      select 1
      from public.profiles p
      where p.id = target_id
        and p.status = 'active'
        and p.role = new_role
        and p.status = new_status
    );
$$;

-- Trigger guard preventing non-admin self-updates from spoofing email, role, or status
create or replace function public.guard_profile_self_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.email := old.email;
    new.role := old.role;
    new.status := old.status;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_self_update on public.profiles;
create trigger profiles_guard_self_update
  before update on public.profiles
  for each row execute function public.guard_profile_self_update();

-- Helper: increment_user_stats()
-- Atomic bounded upsert/increment to eliminate read-modify-write lost updates under concurrent user actions.
create or replace function public.increment_user_stats(
  p_eco_points int default 0,
  p_virtual_trees int default 0,
  p_earned_badges int default 0
)
returns table (eco_points int, virtual_trees int, earned_badges int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_pts int := least(200, greatest(-200, coalesce(p_eco_points, 0)));
  v_trees int := least(5, greatest(0, coalesce(p_virtual_trees, 0)));
  v_badges int := least(3, greatest(0, coalesce(p_earned_badges, 0)));
begin
  if v_uid is null or not public.is_active_user() then
    raise exception 'Not authenticated or account suspended';
  end if;

  return query
  insert into public.user_stats as us (user_id, eco_points, virtual_trees, earned_badges)
  values (
    v_uid,
    greatest(0, v_pts),
    greatest(0, v_trees),
    greatest(0, v_badges)
  )
  on conflict (user_id) do update
    set eco_points = greatest(0, us.eco_points + v_pts),
        virtual_trees = greatest(0, us.virtual_trees + v_trees),
        earned_badges = greatest(0, us.earned_badges + v_badges)
  returning us.eco_points, us.virtual_trees, us.earned_badges;
end;
$$;

-- Atomic virtual tree redemption: verifies point balance, deducts cost, and increments virtual_trees.
create or replace function public.redeem_virtual_tree(p_cost int default 40)
returns table (eco_points int, virtual_trees int, earned_badges int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_cost int := greatest(10, coalesce(p_cost, 40));
begin
  if v_uid is null or not public.is_active_user() then
    raise exception 'Not authenticated or account suspended';
  end if;

  return query
  update public.user_stats as us
  set eco_points = us.eco_points - v_cost,
      virtual_trees = us.virtual_trees + 1
  where us.user_id = v_uid
    and us.eco_points >= v_cost
  returning us.eco_points, us.virtual_trees, us.earned_badges;

  if not found then
    raise exception 'Insufficient eco points';
  end if;
end;
$$;

-- Atomic carbon footprint recorder: awards +50 eco_points strictly once per user.
create or replace function public.record_carbon_footprint(p_footprint double precision)
returns table (awarded_points int, eco_points int, virtual_trees int, earned_badges int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_prior_count int := 0;
  v_award int := 0;
  v_pts int := 0;
  v_trees int := 0;
  v_badges int := 0;
begin
  if v_uid is null or not public.is_active_user() then
    raise exception 'Not authenticated or account suspended';
  end if;

  select count(*)::int into v_prior_count
  from public.carbon_footprints
  where user_id = v_uid;

  insert into public.carbon_footprints (user_id, footprint)
  values (v_uid, p_footprint);

  insert into public.impact_history (user_id, action_type, value, metadata)
  values (v_uid, 'carbon_footprint', p_footprint, '{"unit":"tons_co2e_per_year"}'::jsonb);

  if v_prior_count = 0 then
    v_award := 50;
  end if;

  insert into public.user_stats as us (user_id, eco_points, virtual_trees, earned_badges)
  values (v_uid, v_award, 0, 0)
  on conflict (user_id) do update
    set eco_points = us.eco_points + v_award
  returning us.eco_points, us.virtual_trees, us.earned_badges
  into v_pts, v_trees, v_badges;

  return query select v_award, v_pts, v_trees, v_badges;
end;
$$;

-- Atomic server-verified certificate issuance (requires course_progress >= 100).
create or replace function public.issue_course_certificate(p_course_id text, p_certificate_id text)
returns table (id bigint, user_id uuid, course_id text, certificate_id text, issued_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null or not public.is_active_user() then
    raise exception 'Not authenticated or account suspended';
  end if;

  if not exists (
    select 1
    from public.course_progress cp
    where cp.user_id = v_uid
      and cp.course_id = p_course_id
      and cp.progress >= 100
  ) then
    raise exception 'Course not completed';
  end if;

  insert into public.certificates as c (user_id, course_id, certificate_id)
  values (v_uid, p_course_id, p_certificate_id)
  on conflict (user_id, course_id) do nothing;

  return query
  select c.id, c.user_id, c.course_id, c.certificate_id, c.issued_at
  from public.certificates c
  where c.user_id = v_uid
    and c.course_id = p_course_id;
end;
$$;

-- Public single-certificate verification lookup without exposing full certificates table.
create or replace function public.verify_certificate(p_certificate_id text)
returns table (certificate_id text, course_id text, issued_at timestamptz, holder_name text)
language sql
security definer
set search_path = public
stable
as $$
  select c.certificate_id, c.course_id, c.issued_at, coalesce(p.name, 'Climatify Graduate')
  from public.certificates c
  left join public.profiles p on p.id = c.user_id
  where c.certificate_id = p_certificate_id
  limit 1;
$$;

-- Trigger to auto-create/link profile and user_stats on new auth.users
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_email text := coalesce(nullif(lower(btrim(new.email)), ''), new.id::text || '@users.climatify.local');
  v_name text := coalesce(nullif(btrim(new.raw_user_meta_data->>'name'), ''), split_part(v_email, '@', 1));
begin
  insert into public.profiles (id, email, name, role, status)
  values (
    new.id,
    v_email,
    v_name,
    'member',
    'active'
  )
  on conflict (email) do update
    set id = excluded.id,
        name = case when public.profiles.name = '' then excluded.name else public.profiles.name end,
        role = case
          when public.profiles.role = 'admin' and new.email_confirmed_at is null then 'member'
          else public.profiles.role
        end;

  insert into public.user_stats (user_id, eco_points, virtual_trees)
  values (new.id, 50, 1)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- RLS — enable and policies
-- ============================================================
alter table public.profiles enable row level security;
alter table public.content_items enable row level security;
alter table public.contact_messages enable row level security;
alter table public.form_submissions enable row level security;
alter table public.event_registrations enable row level security;
alter table public.user_stats enable row level security;
alter table public.user_activities enable row level security;
alter table public.course_progress enable row level security;
alter table public.lessons enable row level security;
alter table public.impact_history enable row level security;
alter table public.carbon_footprints enable row level security;
alter table public.bookmarks enable row level security;
alter table public.admin_settings enable row level security;
alter table public.audit_logs enable row level security;
alter table public.analytics_events enable row level security;
alter table public.certificates enable row level security;
alter table public.uploads enable row level security;

-- Profiles: users read own, admin reads all; users update own (preventing role/status escalation); admin can insert/delete
create policy "profiles_select_own_or_admin" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles_insert_own" on public.profiles for insert
  with check ((auth.uid() = id and role = 'member' and status = 'active') or public.is_admin());
create policy "profiles_update_own" on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (
    public.can_update_own_profile(id, role, status)
    or public.is_admin()
  );
create policy "profiles_delete_admin" on public.profiles for delete using (public.is_admin());

-- Content: public read; admin write
create policy "content_public_read" on public.content_items for select using (true);
create policy "content_admin_write" on public.content_items for all using (public.is_admin()) with check (public.is_admin());

-- Contact messages: anyone can insert unread messages; admin reads/updates/deletes
create policy "contact_insert_any" on public.contact_messages for insert with check (is_read = false);
create policy "contact_admin_all" on public.contact_messages for all using (public.is_admin()) with check (public.is_admin());

-- User-scoped tables: owner read/manage (when active) + admin manage; user_stats mutated via RPCs or admin
create policy "user_stats_select_owner_or_admin" on public.user_stats for select using (auth.uid() = user_id or public.is_admin());
create policy "user_stats_admin_write" on public.user_stats for all using (public.is_admin()) with check (public.is_admin());
create policy "user_activities_owner_or_admin" on public.user_activities for all using ((auth.uid() = user_id and public.is_active_user()) or public.is_admin()) with check ((auth.uid() = user_id and public.is_active_user()) or public.is_admin());
create policy "course_progress_owner_or_admin" on public.course_progress for all using ((auth.uid() = user_id and public.is_active_user()) or public.is_admin()) with check ((auth.uid() = user_id and public.is_active_user()) or public.is_admin());
create policy "impact_owner_or_admin" on public.impact_history for all using ((auth.uid() = user_id and public.is_active_user()) or public.is_admin()) with check ((auth.uid() = user_id and public.is_active_user()) or public.is_admin());
create policy "carbon_owner_or_admin" on public.carbon_footprints for all using ((auth.uid() = user_id and public.is_active_user()) or public.is_admin()) with check ((auth.uid() = user_id and public.is_active_user()) or public.is_admin());
create policy "bookmarks_owner_or_admin" on public.bookmarks for all using ((auth.uid() = user_id and public.is_active_user()) or public.is_admin()) with check ((auth.uid() = user_id and public.is_active_user()) or public.is_admin());

-- Certificates: owner & admin read; issued strictly via issue_course_certificate() RPC; public single-ID lookup via verify_certificate() RPC
create policy "certificates_select_owner_or_admin" on public.certificates for select using (auth.uid() = user_id or public.is_admin());
create policy "certificates_admin_write" on public.certificates for all using (public.is_admin()) with check (public.is_admin());

-- Event registrations: owner & admin read; anyone insert (without spoofing user_id); owner & admin update; admin delete
create policy "event_reg_owner_or_admin" on public.event_registrations for select using (auth.uid() = user_id or public.is_admin());
create policy "event_reg_insert_any" on public.event_registrations for insert with check (user_id is null or auth.uid() = user_id or public.is_admin());
create policy "event_reg_update_own_or_admin" on public.event_registrations for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());
create policy "event_reg_delete_admin" on public.event_registrations for delete using (public.is_admin());

-- Form submissions: anyone insert; admin all (read, update, delete)
create policy "forms_insert_any" on public.form_submissions for insert with check (true);
create policy "forms_admin_all" on public.form_submissions for all using (public.is_admin()) with check (public.is_admin());

-- Lessons: public read published; admin all
create policy "lessons_public_read" on public.lessons for select using (is_published = true or public.is_admin());
create policy "lessons_admin_write" on public.lessons for all using (public.is_admin()) with check (public.is_admin());

-- Admin-only tables
create policy "admin_settings_admin" on public.admin_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_settings_public_read" on public.admin_settings for select using (true);
create policy "audit_admin" on public.audit_logs for all using (public.is_admin()) with check (public.is_admin());
create policy "analytics_insert_any" on public.analytics_events for insert with check (true);
create policy "analytics_admin_read" on public.analytics_events for select using (public.is_admin());
create policy "uploads_public_read" on public.uploads for select using (true);
create policy "uploads_admin_write" on public.uploads for all using (public.is_admin()) with check (public.is_admin());

