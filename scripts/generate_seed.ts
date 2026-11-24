import fs from "node:fs";
import path from "node:path";
import {
  mockPrograms,
  mockInitiatives,
  mockEvents,
  mockCourses,
  mockGames,
  mockOpportunities,
  mockBlogPosts,
  mockTeam,
  mockCareers,
  mockCarbonQuestions,
  mockAdminUsers,
  mockAdminMessages,
  mockAdminEventRegistrations,
  mockAdminFormSubmissions,
} from "../src/services/mockData.ts";

function escapeSqlString(str: string): string {
  return str.replace(/'/g, "''");
}

function deterministicUuid(index: number): string {
  return `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`;
}

const sets: { kind: string; items: { id: string;[key: string]: unknown }[] }[] = [
  { kind: "programs", items: mockPrograms },
  { kind: "initiatives", items: mockInitiatives },
  { kind: "events", items: mockEvents },
  { kind: "courses", items: mockCourses },
  { kind: "games", items: mockGames },
  { kind: "opportunities", items: mockOpportunities },
  { kind: "posts", items: mockBlogPosts },
  { kind: "team", items: mockTeam },
  { kind: "careers", items: mockCareers },
  { kind: "carbon-questions", items: mockCarbonQuestions },
];

let sql = `-- Climatify Comprehensive Production Seed Data
-- Auto-generated from official mock data datasets
-- Total items across all 10 CMS kinds + initial Admin directory, messages, registrations & submissions

-- 1. Initial Admin Settings
insert into public.admin_settings (id, site_name, contact_email, enable_maintenance)
values (1, 'Climatify', 'info@climatify-youth.com', false)
on conflict (id) do nothing;

-- 2. Content Items (All 10 CMS sections)
`;

for (const { kind, items } of sets) {
  if (!items || items.length === 0) continue;
  sql += `\n-- Kind: ${kind} (${items.length} items)\n`;
  sql += `insert into public.content_items (id, kind, data) values\n`;
  const rows = items.map((item, idx) => {
    const id = String(item.id || (kind === "carbon-questions" ? `carbon-q-${idx + 1}` : `item-${idx + 1}`));
    const payload = { id, ...item };
    const jsonStr = escapeSqlString(JSON.stringify(payload));
    return `  ('${escapeSqlString(id)}', '${escapeSqlString(kind)}', '${jsonStr}'::jsonb)`;
  });
  sql += rows.join(",\n");
  sql += `\non conflict (id) do nothing;\n`;
}

// Map mock user IDs ("user-1" .. "user-8") to deterministic UUIDs
const userIdMap = new Map<string, string>();
mockAdminUsers.forEach((u, idx) => {
  userIdMap.set(u.id, deterministicUuid(idx + 1));
});

sql += `\n-- 3. Initial Profiles & User Stats (${mockAdminUsers.length} users)\n`;
sql += `insert into public.profiles (id, email, name, city, bio, role, status, created_at) values\n`;
sql += mockAdminUsers
  .map((u, idx) => {
    const uuid = userIdMap.get(u.id) ?? deterministicUuid(idx + 1);
    return `  ('${uuid}'::uuid, '${escapeSqlString(u.email.toLowerCase())}', '${escapeSqlString(u.name)}', '${escapeSqlString(u.city)}', '${escapeSqlString(u.bio)}', '${escapeSqlString(u.role)}', '${escapeSqlString(u.status)}', '${escapeSqlString(u.createdAt)}'::timestamptz)`;
  })
  .join(",\n");
sql += `\non conflict (email) do nothing;\n`;

sql += `\ninsert into public.user_stats (user_id, eco_points, virtual_trees, earned_badges)
select p.id, v.eco_points, v.virtual_trees, 0
from (values\n`;
sql += mockAdminUsers
  .map((u) => `  ('${escapeSqlString(u.email.toLowerCase())}', ${Number(u.ecoPoints) || 0}, ${Number(u.virtualTrees) || 0})`)
  .join(",\n");
sql += `\n) as v(email, eco_points, virtual_trees)
join public.profiles p on lower(p.email) = v.email
on conflict (user_id) do update set
  eco_points = greatest(public.user_stats.eco_points, excluded.eco_points),
  virtual_trees = greatest(public.user_stats.virtual_trees, excluded.virtual_trees);\n`;

sql += `\n-- 4. Initial Contact Messages (${mockAdminMessages.length} messages)\n`;
sql += `insert into public.contact_messages (id, sender, email, subject, message, is_read, date) values\n`;
sql += mockAdminMessages
  .map((m, idx) => {
    const numId = Number(m.id) || idx + 1;
    return `  (${numId}, '${escapeSqlString(m.sender)}', '${escapeSqlString(m.email)}', '${escapeSqlString(m.subject)}', '${escapeSqlString(m.message)}', ${Boolean(m.isRead)}, '${escapeSqlString(m.date)}'::date)`;
  })
  .join(",\n");
sql += `\non conflict (id) do nothing;\n`;
sql += `select setval(pg_get_serial_sequence('public.contact_messages', 'id'), coalesce((select max(id) from public.contact_messages), 1), true);\n`;

sql += `\n-- 5. Initial Event Registrations (${mockAdminEventRegistrations.length} registrations)\n`;
sql += `insert into public.event_registrations (id, event_id, user_id, name, email, phone, ticket_code, status, created_at) values\n`;
sql += mockAdminEventRegistrations
  .map((r, idx) => {
    const numId = idx + 1;
    const mappedUuid = r.userId ? userIdMap.get(r.userId) : null;
    const userIdSql = mappedUuid
      ? `(select id from public.profiles where id = '${mappedUuid}'::uuid)`
      : "null";
    return `  (${numId}, '${escapeSqlString(r.eventId)}', ${userIdSql}, '${escapeSqlString(r.name)}', '${escapeSqlString(r.email)}', '${escapeSqlString(r.phone)}', '${escapeSqlString(r.ticketCode)}', '${escapeSqlString(r.status)}', '${escapeSqlString(r.createdAt)}'::timestamptz)`;
  })
  .join(",\n");
sql += `\non conflict (id) do nothing;\n`;
sql += `select setval(pg_get_serial_sequence('public.event_registrations', 'id'), coalesce((select max(id) from public.event_registrations), 1), true);\n`;

sql += `\n-- 6. Initial Form Submissions (${mockAdminFormSubmissions.length} submissions)\n`;
sql += `insert into public.form_submissions (id, kind, email, payload, created_at) values\n`;
sql += mockAdminFormSubmissions
  .map((s, idx) => {
    const numId = idx + 1;
    const jsonPayload = escapeSqlString(JSON.stringify(s.payload || {}));
    return `  (${numId}, '${escapeSqlString(s.kind)}', '${escapeSqlString(s.email)}', '${jsonPayload}'::jsonb, '${escapeSqlString(s.createdAt)}'::timestamptz)`;
  })
  .join(",\n");
sql += `\non conflict (id) do nothing;\n`;
sql += `select setval(pg_get_serial_sequence('public.form_submissions', 'id'), coalesce((select max(id) from public.form_submissions), 1), true);\n`;

const targetPath = path.resolve(process.cwd(), "supabase/seed.sql");
fs.writeFileSync(targetPath, sql, "utf8");
console.log(`Successfully generated ${targetPath} with ${sets.reduce((acc, s) => acc + s.items.length, 0)} content items + admin seed tables!`);

