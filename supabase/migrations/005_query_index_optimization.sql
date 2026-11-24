-- ============================================================
-- Climatify — 005 Query-Driven Database Index Optimization
-- Based on actual query patterns in src/services/supabaseApi.ts:
--   1. Drop redundant leftmost-prefix single-column indexes
--   2. Upgrade single-column indexes to composite (filter, sort DESC)
--      indexes so hot queries avoid in-memory Sort operations under load
--   3. Add missing profiles(created_at DESC) index for Admin user directory
-- ============================================================

-- 1. Drop 100% redundant leftmost-prefix indexes
drop index if exists public.content_items_kind_idx;      -- covered by content_items_kind_created_at_idx(kind, created_at DESC)
drop index if exists public.lessons_course_id_idx;       -- covered by lessons_course_id_lesson_order_key(course_id, lesson_order)

-- 2. Upgrade user-scoped indexes to composite (user_id, <sort_col> DESC)
drop index if exists public.bookmarks_user_id_idx;
create index if not exists bookmarks_user_id_created_at_idx
  on public.bookmarks (user_id, created_at desc);

drop index if exists public.certificates_user_id_idx;
create index if not exists certificates_user_id_issued_at_idx
  on public.certificates (user_id, issued_at desc);

drop index if exists public.impact_history_user_id_idx;
create index if not exists impact_history_user_id_created_at_idx
  on public.impact_history (user_id, created_at desc);

drop index if exists public.event_registrations_user_id_idx;
create index if not exists event_registrations_user_id_created_at_idx
  on public.event_registrations (user_id, created_at desc);

-- 3. Upgrade admin listing & analytics indexes to composite (filter, created_at DESC)
drop index if exists public.form_submissions_kind_idx;
create index if not exists form_submissions_kind_created_at_idx
  on public.form_submissions (kind, created_at desc);

drop index if exists public.analytics_events_event_type_idx;
create index if not exists analytics_events_type_created_at_idx
  on public.analytics_events (event_type, created_at desc);

-- 4. Add missing Admin users directory sort index
create index if not exists profiles_created_at_idx
  on public.profiles (created_at desc);

-- Refresh planner statistics
analyze;
