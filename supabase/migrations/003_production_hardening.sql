-- Climatify — Production Security, Concurrency & Integrity Hardening (Idempotent Upgrade)
-- Safe to execute on existing Supabase projects that already ran 001_initial_schema.sql.

-- 1. Case-insensitive unique confirmed ticket per event + email
drop index if exists public.uq_event_email_confirmed;
create unique index if not exists uq_event_email_confirmed
  on public.event_registrations (event_id, lower(email))
  where status = 'Confirmed';

-- 2. Active account helper
create or replace function public.is_active_user()
returns boolean language sql security definer set search_path = public stable as $$
  select auth.uid() is not null
    and not exists (
      select 1 from public.profiles where id = auth.uid() and status = 'suspended'
    );
$$;

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

-- 3. Self-update guard preventing email/role/status spoofing
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

-- 4. Atomic gamification & certificate RPCs
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
  values (v_uid, greatest(0, v_pts), greatest(0, v_trees), greatest(0, v_badges))
  on conflict (user_id) do update
    set eco_points = greatest(0, us.eco_points + v_pts),
        virtual_trees = greatest(0, us.virtual_trees + v_trees),
        earned_badges = greatest(0, us.earned_badges + v_badges)
  returning us.eco_points, us.virtual_trees, us.earned_badges;
end;
$$;

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

-- 5. Hardened new-user signup trigger
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_email text := coalesce(nullif(lower(btrim(new.email)), ''), new.id::text || '@users.climatify.local');
  v_name text := coalesce(nullif(btrim(new.raw_user_meta_data->>'name'), ''), split_part(v_email, '@', 1));
begin
  insert into public.profiles (id, email, name, role, status)
  values (new.id, v_email, v_name, 'member', 'active')
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

-- 6. Tightened RLS policies
drop policy if exists "contact_insert_any" on public.contact_messages;
create policy "contact_insert_any" on public.contact_messages for insert with check (is_read = false);

drop policy if exists "user_stats_owner_or_admin" on public.user_stats;
drop policy if exists "user_stats_select_owner_or_admin" on public.user_stats;
drop policy if exists "user_stats_admin_write" on public.user_stats;
create policy "user_stats_select_owner_or_admin" on public.user_stats for select using (auth.uid() = user_id or public.is_admin());
create policy "user_stats_admin_write" on public.user_stats for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "certificates_owner_or_admin" on public.certificates;
drop policy if exists "certificates_public_verify" on public.certificates;
drop policy if exists "certificates_select_owner_or_admin" on public.certificates;
drop policy if exists "certificates_admin_write" on public.certificates;
create policy "certificates_select_owner_or_admin" on public.certificates for select using (auth.uid() = user_id or public.is_admin());
create policy "certificates_admin_write" on public.certificates for all using (public.is_admin()) with check (public.is_admin());
