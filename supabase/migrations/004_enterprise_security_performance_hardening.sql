-- ============================================================
-- Climatify — 004 Enterprise Security & Performance Hardening
-- Resolves all Supabase Security & Performance Advisor findings:
--   1. Fixed search_path on public.touch_updated_at()
--   2. Private app_private schema for internal RLS helpers (not exposed to PostgREST)
--   3. Least-privilege EXECUTE grants on all SECURITY DEFINER RPCs & triggers
--   4. Cached (select auth.uid()) in every RLS policy (eliminates auth_rls_initplan)
--   5. Non-overlapping per-command RLS policies (eliminates multiple_permissive_policies)
--   6. Covering FK index on audit_logs(actor_id) & drop redundant duplicate index
-- ============================================================

-- 1. Fix mutable search_path on touch_updated_at()
alter function public.touch_updated_at() set search_path = public;

-- 2. Private schema for internal RLS helpers (not in PostgREST exposed schemas)
create schema if not exists app_private;
revoke all on schema app_private from public;
grant usage on schema app_private to anon, authenticated, service_role;

create or replace function app_private.is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin' and status = 'active'
  );
$$;

create or replace function app_private.is_active_user()
returns boolean language sql security definer set search_path = public stable as $$
  select (select auth.uid()) is not null
    and not exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and status = 'suspended'
    );
$$;

create or replace function app_private.can_update_own_profile(target_id uuid, new_role text, new_status text)
returns boolean language sql security definer set search_path = public stable as $$
  select (select auth.uid()) = target_id
    and exists (
      select 1
      from public.profiles p
      where p.id = target_id
        and p.status = 'active'
        and p.role = new_role
        and p.status = new_status
    );
$$;

revoke all on function app_private.is_admin() from public;
revoke all on function app_private.is_active_user() from public;
revoke all on function app_private.can_update_own_profile(uuid, text, text) from public;
grant execute on function app_private.is_admin() to anon, authenticated, service_role;
grant execute on function app_private.is_active_user() to anon, authenticated, service_role;
grant execute on function app_private.can_update_own_profile(uuid, text, text) to authenticated, service_role;

-- Update trigger & RPCs to use app_private helpers
create or replace function public.guard_profile_self_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not app_private.is_admin() then
    new.email := old.email;
    new.role := old.role;
    new.status := old.status;
  end if;
  return new;
end;
$$;

create or replace function public.increment_user_stats(
  p_eco_points int default 0,
  p_virtual_trees int default 0,
  p_earned_badges int default 0
)
returns table (eco_points int, virtual_trees int, earned_badges int)
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_pts int := least(200, greatest(-200, coalesce(p_eco_points, 0)));
  v_trees int := least(5, greatest(0, coalesce(p_virtual_trees, 0)));
  v_badges int := least(3, greatest(0, coalesce(p_earned_badges, 0)));
begin
  if v_uid is null or not app_private.is_active_user() then
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
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_cost int := greatest(10, coalesce(p_cost, 40));
begin
  if v_uid is null or not app_private.is_active_user() then
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
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_prior_count int := 0;
  v_award int := 0;
  v_pts int := 0;
  v_trees int := 0;
  v_badges int := 0;
begin
  if v_uid is null or not app_private.is_active_user() then
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
language plpgsql security definer set search_path = public as $$
#variable_conflict use_column
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null or not app_private.is_active_user() then
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

-- 3. Rebuild all RLS policies with cached (select auth.uid()) and non-overlapping commands

-- profiles
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_delete_admin" on public.profiles;

create policy "profiles_select_own_or_admin" on public.profiles for select
  using ((select auth.uid()) = id or (select app_private.is_admin()));
create policy "profiles_insert_own" on public.profiles for insert
  with check (((select auth.uid()) = id and role = 'member' and status = 'active') or (select app_private.is_admin()));
create policy "profiles_update_own" on public.profiles for update
  using ((select auth.uid()) = id or (select app_private.is_admin()))
  with check (app_private.can_update_own_profile(id, role, status) or (select app_private.is_admin()));
create policy "profiles_delete_admin" on public.profiles for delete
  using ((select app_private.is_admin()));

-- content_items (public SELECT; admin INSERT/UPDATE/DELETE — no overlap)
drop policy if exists "content_public_read" on public.content_items;
drop policy if exists "content_admin_write" on public.content_items;
drop policy if exists "content_admin_insert" on public.content_items;
drop policy if exists "content_admin_update" on public.content_items;
drop policy if exists "content_admin_delete" on public.content_items;

create policy "content_public_read" on public.content_items for select using (true);
create policy "content_admin_insert" on public.content_items for insert with check ((select app_private.is_admin()));
create policy "content_admin_update" on public.content_items for update using ((select app_private.is_admin())) with check ((select app_private.is_admin()));
create policy "content_admin_delete" on public.content_items for delete using ((select app_private.is_admin()));

-- contact_messages (anyone INSERT unread or admin INSERT; admin SELECT/UPDATE/DELETE — no overlap)
drop policy if exists "contact_insert_any" on public.contact_messages;
drop policy if exists "contact_admin_all" on public.contact_messages;
drop policy if exists "contact_admin_select" on public.contact_messages;
drop policy if exists "contact_admin_update" on public.contact_messages;
drop policy if exists "contact_admin_delete" on public.contact_messages;

create policy "contact_insert_any" on public.contact_messages for insert
  with check (is_read = false or (select app_private.is_admin()));
create policy "contact_admin_select" on public.contact_messages for select using ((select app_private.is_admin()));
create policy "contact_admin_update" on public.contact_messages for update using ((select app_private.is_admin())) with check ((select app_private.is_admin()));
create policy "contact_admin_delete" on public.contact_messages for delete using ((select app_private.is_admin()));

-- form_submissions (anyone INSERT; admin SELECT/UPDATE/DELETE — no overlap)
drop policy if exists "forms_insert_any" on public.form_submissions;
drop policy if exists "forms_admin_all" on public.form_submissions;
drop policy if exists "forms_admin_select" on public.form_submissions;
drop policy if exists "forms_admin_update" on public.form_submissions;
drop policy if exists "forms_admin_delete" on public.form_submissions;

create policy "forms_insert_any" on public.form_submissions for insert with check (true);
create policy "forms_admin_select" on public.form_submissions for select using ((select app_private.is_admin()));
create policy "forms_admin_update" on public.form_submissions for update using ((select app_private.is_admin())) with check ((select app_private.is_admin()));
create policy "forms_admin_delete" on public.form_submissions for delete using ((select app_private.is_admin()));

-- user_stats (owner/admin SELECT; admin INSERT/UPDATE/DELETE — no overlap)
drop policy if exists "user_stats_select_owner_or_admin" on public.user_stats;
drop policy if exists "user_stats_admin_write" on public.user_stats;
drop policy if exists "user_stats_admin_insert" on public.user_stats;
drop policy if exists "user_stats_admin_update" on public.user_stats;
drop policy if exists "user_stats_admin_delete" on public.user_stats;

create policy "user_stats_select_owner_or_admin" on public.user_stats for select
  using ((select auth.uid()) = user_id or (select app_private.is_admin()));
create policy "user_stats_admin_insert" on public.user_stats for insert with check ((select app_private.is_admin()));
create policy "user_stats_admin_update" on public.user_stats for update using ((select app_private.is_admin())) with check ((select app_private.is_admin()));
create policy "user_stats_admin_delete" on public.user_stats for delete using ((select app_private.is_admin()));

-- user_activities, course_progress, impact_history, carbon_footprints, bookmarks
drop policy if exists "user_activities_owner_or_admin" on public.user_activities;
create policy "user_activities_owner_or_admin" on public.user_activities for all
  using (((select auth.uid()) = user_id and (select app_private.is_active_user())) or (select app_private.is_admin()))
  with check (((select auth.uid()) = user_id and (select app_private.is_active_user())) or (select app_private.is_admin()));

drop policy if exists "course_progress_owner_or_admin" on public.course_progress;
create policy "course_progress_owner_or_admin" on public.course_progress for all
  using (((select auth.uid()) = user_id and (select app_private.is_active_user())) or (select app_private.is_admin()))
  with check (((select auth.uid()) = user_id and (select app_private.is_active_user())) or (select app_private.is_admin()));

drop policy if exists "impact_owner_or_admin" on public.impact_history;
create policy "impact_owner_or_admin" on public.impact_history for all
  using (((select auth.uid()) = user_id and (select app_private.is_active_user())) or (select app_private.is_admin()))
  with check (((select auth.uid()) = user_id and (select app_private.is_active_user())) or (select app_private.is_admin()));

drop policy if exists "carbon_owner_or_admin" on public.carbon_footprints;
create policy "carbon_owner_or_admin" on public.carbon_footprints for all
  using (((select auth.uid()) = user_id and (select app_private.is_active_user())) or (select app_private.is_admin()))
  with check (((select auth.uid()) = user_id and (select app_private.is_active_user())) or (select app_private.is_admin()));

drop policy if exists "bookmarks_owner_or_admin" on public.bookmarks;
create policy "bookmarks_owner_or_admin" on public.bookmarks for all
  using (((select auth.uid()) = user_id and (select app_private.is_active_user())) or (select app_private.is_admin()))
  with check (((select auth.uid()) = user_id and (select app_private.is_active_user())) or (select app_private.is_admin()));

-- certificates (owner/admin SELECT; admin INSERT/UPDATE/DELETE — no overlap)
drop policy if exists "certificates_select_owner_or_admin" on public.certificates;
drop policy if exists "certificates_admin_write" on public.certificates;
drop policy if exists "certificates_admin_insert" on public.certificates;
drop policy if exists "certificates_admin_update" on public.certificates;
drop policy if exists "certificates_admin_delete" on public.certificates;

create policy "certificates_select_owner_or_admin" on public.certificates for select
  using ((select auth.uid()) = user_id or (select app_private.is_admin()));
create policy "certificates_admin_insert" on public.certificates for insert with check ((select app_private.is_admin()));
create policy "certificates_admin_update" on public.certificates for update using ((select app_private.is_admin())) with check ((select app_private.is_admin()));
create policy "certificates_admin_delete" on public.certificates for delete using ((select app_private.is_admin()));

-- event_registrations
drop policy if exists "event_reg_owner_or_admin" on public.event_registrations;
drop policy if exists "event_reg_insert_any" on public.event_registrations;
drop policy if exists "event_reg_update_own_or_admin" on public.event_registrations;
drop policy if exists "event_reg_delete_admin" on public.event_registrations;

create policy "event_reg_owner_or_admin" on public.event_registrations for select
  using ((select auth.uid()) = user_id or (select app_private.is_admin()));
create policy "event_reg_insert_any" on public.event_registrations for insert
  with check (user_id is null or (select auth.uid()) = user_id or (select app_private.is_admin()));
create policy "event_reg_update_own_or_admin" on public.event_registrations for update
  using ((select auth.uid()) = user_id or (select app_private.is_admin()))
  with check ((select auth.uid()) = user_id or (select app_private.is_admin()));
create policy "event_reg_delete_admin" on public.event_registrations for delete
  using ((select app_private.is_admin()));

-- lessons (public SELECT published or admin; admin INSERT/UPDATE/DELETE — no overlap)
drop policy if exists "lessons_public_read" on public.lessons;
drop policy if exists "lessons_admin_write" on public.lessons;
drop policy if exists "lessons_admin_insert" on public.lessons;
drop policy if exists "lessons_admin_update" on public.lessons;
drop policy if exists "lessons_admin_delete" on public.lessons;

create policy "lessons_public_read" on public.lessons for select
  using (is_published = true or (select app_private.is_admin()));
create policy "lessons_admin_insert" on public.lessons for insert with check ((select app_private.is_admin()));
create policy "lessons_admin_update" on public.lessons for update using ((select app_private.is_admin())) with check ((select app_private.is_admin()));
create policy "lessons_admin_delete" on public.lessons for delete using ((select app_private.is_admin()));

-- admin_settings (public SELECT; admin INSERT/UPDATE/DELETE — no overlap)
drop policy if exists "admin_settings_admin" on public.admin_settings;
drop policy if exists "admin_settings_public_read" on public.admin_settings;
drop policy if exists "admin_settings_admin_insert" on public.admin_settings;
drop policy if exists "admin_settings_admin_update" on public.admin_settings;
drop policy if exists "admin_settings_admin_delete" on public.admin_settings;

create policy "admin_settings_public_read" on public.admin_settings for select using (true);
create policy "admin_settings_admin_insert" on public.admin_settings for insert with check ((select app_private.is_admin()));
create policy "admin_settings_admin_update" on public.admin_settings for update using ((select app_private.is_admin())) with check ((select app_private.is_admin()));
create policy "admin_settings_admin_delete" on public.admin_settings for delete using ((select app_private.is_admin()));

-- audit_logs
drop policy if exists "audit_admin" on public.audit_logs;
create policy "audit_admin" on public.audit_logs for all
  using ((select app_private.is_admin())) with check ((select app_private.is_admin()));

-- analytics_events
drop policy if exists "analytics_insert_any" on public.analytics_events;
drop policy if exists "analytics_admin_read" on public.analytics_events;
create policy "analytics_insert_any" on public.analytics_events for insert with check (true);
create policy "analytics_admin_read" on public.analytics_events for select using ((select app_private.is_admin()));

-- uploads (public SELECT; admin INSERT/UPDATE/DELETE — no overlap)
drop policy if exists "uploads_public_read" on public.uploads;
drop policy if exists "uploads_admin_write" on public.uploads;
drop policy if exists "uploads_admin_insert" on public.uploads;
drop policy if exists "uploads_admin_update" on public.uploads;
drop policy if exists "uploads_admin_delete" on public.uploads;

create policy "uploads_public_read" on public.uploads for select using (true);
create policy "uploads_admin_insert" on public.uploads for insert with check ((select app_private.is_admin()));
create policy "uploads_admin_update" on public.uploads for update using ((select app_private.is_admin())) with check ((select app_private.is_admin()));
create policy "uploads_admin_delete" on public.uploads for delete using ((select app_private.is_admin()));

-- storage.objects policies updated to use app_private.is_admin()
drop policy if exists "media_admin_insert" on storage.objects;
drop policy if exists "media_admin_update" on storage.objects;
drop policy if exists "media_admin_delete" on storage.objects;

create policy "media_admin_insert" on storage.objects for insert
  with check (bucket_id = 'media' and (select app_private.is_admin()));
create policy "media_admin_update" on storage.objects for update
  using (bucket_id = 'media' and (select app_private.is_admin()))
  with check (bucket_id = 'media' and (select app_private.is_admin()));
create policy "media_admin_delete" on storage.objects for delete
  using (bucket_id = 'media' and (select app_private.is_admin()));

-- 4. Drop public copies of internal RLS helpers & lock down function EXECUTE privileges
drop function if exists public.is_admin();
drop function if exists public.is_active_user();
drop function if exists public.can_update_own_profile(uuid, text, text);

-- Trigger functions must NEVER be directly callable via PostgREST
revoke all on function public.guard_profile_self_update() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.touch_updated_at() from public, anon, authenticated;
do $$
begin
  if exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'rls_auto_enable'
  ) then
    execute 'revoke all on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end $$;

-- Member-only RPCs: revoke from public & anon; grant strictly to authenticated
revoke all on function public.increment_user_stats(int, int, int) from public, anon;
grant execute on function public.increment_user_stats(int, int, int) to authenticated;

revoke all on function public.redeem_virtual_tree(int) from public, anon;
grant execute on function public.redeem_virtual_tree(int) to authenticated;

revoke all on function public.record_carbon_footprint(double precision) from public, anon;
grant execute on function public.record_carbon_footprint(double precision) to authenticated;

revoke all on function public.issue_course_certificate(text, text) from public, anon;
grant execute on function public.issue_course_certificate(text, text) to authenticated;

-- Public certificate verification RPC: explicitly granted to anon & authenticated
revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;

-- 5. Indexing fixes: add missing FK index & drop redundant duplicate index
create index if not exists audit_logs_actor_id_idx on public.audit_logs (actor_id);
drop index if exists public.certificates_certificate_id_idx;

-- Reload PostgREST schema cache
notify pgrst, 'reload schema';
