import type {
  Program, Initiative, Event, Course, Game, Opportunity,
  BlogPost, TeamMember, AdminStats, AnalyticItem, ContactMessage,
  CareerNode, CarbonQuestion, UserProfileResponse, MutationResult,
  ContactSubmitDto, MeetingBookingDto, PartnershipSubmitDto, WorkshopRequestDto,
  EventRegistrationDto, OpportunityApplicationDto, Certificate,
  AdminUser, AdminEventRegistration, AdminFormSubmission,
} from "../types";
import { isSupabaseConfigured, loadSupabase } from "../lib/supabase/client";
import { sanitizeUrl } from "../lib/utils/sanitize";
import { slugId, ticketCode, certificateId } from "../lib/utils/ids";
import { ApiError } from "../lib/errors/ApiError";
import {
  executeCachedRead,
  executeMutation,
  loadMockData,
} from "./requestCoordinator";

export const USE_SUPABASE = isSupabaseConfigured;

type SupabaseClientInstance = NonNullable<Awaited<ReturnType<typeof loadSupabase>>>;

async function sb(): Promise<SupabaseClientInstance | null> {
  return loadSupabase();
}

function toApiError(message: string, status: number, endpoint: string, body?: unknown): never {
  throw new ApiError(message, status, endpoint, body);
}

const okResult = (messageAr: string, extra?: Partial<MutationResult>): MutationResult => ({
  success: true,
  message: messageAr,
  ...extra,
});

const MAX_MOCK_LOG_ITEMS = 2000;
function pushBounded<T>(arr: T[], item: T): void {
  arr.unshift(item);
  if (arr.length > MAX_MOCK_LOG_ITEMS) {
    arr.length = MAX_MOCK_LOG_ITEMS;
  }
}

/**
 * Resolves the authenticated Supabase user from the in-memory session first (0ms),
 * falling back to `auth.getUser()` only if needed. Eliminates redundant Auth round-trips.
 */
async function getSessionUser(client: SupabaseClientInstance) {
  const { data: sessionData } = await client.auth.getSession();
  if (sessionData.session?.user) return sessionData.session.user;
  const { data: userData } = await client.auth.getUser();
  return userData.user ?? null;
}

/** Best-effort admin audit log writer; never blocks primary mutations. */
async function logAudit(action: string, resource: string): Promise<void> {
  const client = await sb();
  if (!client) return;
  try {
    const user = await getSessionUser(client);
    if (!user) return;
    await client.from("audit_logs").insert({
      actor_id: user.id,
      action,
      resource,
    });
  } catch {
    // non-blocking
  }
}

/**
 * Tracks whether `public.content_items` has been seeded at least once.
 * If seeded, an empty section (`data.length === 0`) means the Admin intentionally deleted
 * items in that section and MUST return `[]` rather than resurrecting mock data.
 * If completely unseeded (`0` rows across the entire table), falls back to mock datasets.
 */
let seededCheckCache: { checkedAt: number; hasRows: boolean } | null = null;
async function isContentTableSeeded(client: SupabaseClientInstance): Promise<boolean> {
  if (seededCheckCache && Date.now() - seededCheckCache.checkedAt < 60_000) {
    return seededCheckCache.hasRows;
  }
  const { count, error } = await client
    .from("content_items")
    .select("id", { count: "exact", head: true })
    .limit(1);
  if (error) return true;
  const hasRows = (count ?? 0) > 0;
  seededCheckCache = { checkedAt: Date.now(), hasRows };
  return hasRows;
}

/**
 * Atomic gamification counter increment via `public.increment_user_stats` RPC.
 */
async function atomicIncrementUserStats(
  client: SupabaseClientInstance,
  userId: string,
  deltas: { ecoPoints?: number; virtualTrees?: number; earnedBadges?: number }
): Promise<void> {
  const p_eco_points = deltas.ecoPoints ?? 0;
  const p_virtual_trees = deltas.virtualTrees ?? 0;
  const p_earned_badges = deltas.earnedBadges ?? 0;
  if (p_eco_points === 0 && p_virtual_trees === 0 && p_earned_badges === 0) return;

  const { error: rpcError } = await client.rpc("increment_user_stats", {
    p_eco_points,
    p_virtual_trees,
    p_earned_badges,
  });
  if (!rpcError) return;

  const { data: stats } = await client
    .from("user_stats")
    .select("eco_points,virtual_trees,earned_badges")
    .eq("user_id", userId)
    .maybeSingle();
  const cur = stats as { eco_points?: number; virtual_trees?: number; earned_badges?: number } | null;
  const { error: upsertErr } = await client.from("user_stats").upsert(
    {
      user_id: userId,
      eco_points: Math.max(0, (cur?.eco_points ?? 0) + p_eco_points),
      virtual_trees: Math.max(0, (cur?.virtual_trees ?? 0) + p_virtual_trees),
      earned_badges: Math.max(0, (cur?.earned_badges ?? 0) + p_earned_badges),
    },
    { onConflict: "user_id" }
  );
  if (upsertErr) throw upsertErr;
}

// ---------- Public reads via content_items ----------
async function listByKind<T>(kind: string, getMock: () => Promise<T[]>): Promise<T[]> {
  const client = await sb();
  if (!client) return getMock();
  const { data, error } = await client
    .from("content_items")
    .select("id, data")
    .eq("kind", kind)
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) toApiError(error.message, 500, `/${kind}`, error);
  if (!data || data.length === 0) {
    const seeded = await isContentTableSeeded(client);
    return seeded ? [] : getMock();
  }
  seededCheckCache = { checkedAt: Date.now(), hasRows: true };
  return data.map((r: { id: string; data: unknown }) => {
    const d = (r.data && typeof r.data === "object" ? r.data : {}) as Record<string, unknown>;
    return { id: r.id, ...d } as T;
  });
}

async function getByKindId<T>(
  kind: string,
  id: string,
  getMock: () => Promise<T | undefined>
): Promise<T | undefined> {
  const client = await sb();
  if (!client) return getMock();
  const { data, error } = await client
    .from("content_items")
    .select("id, data")
    .eq("kind", kind)
    .eq("id", id)
    .maybeSingle();
  if (error) toApiError(error.message, 500, `/${kind}/${id}`, error);
  if (!data) {
    const seeded = await isContentTableSeeded(client);
    return seeded ? undefined : getMock();
  }
  const row = data as { id: string; data: unknown };
  const d = (row.data && typeof row.data === "object" ? row.data : {}) as Record<string, unknown>;
  return { id: row.id, ...d } as T;
}

const CANONICAL_TEAM_ORDER = [
  "mai-moawad",
  "abdullah-salmani",
  "marwa-shalwani",
  "heba-momtaz",
  "rowayyah-alhefeiti",
  "maysara-ezz",
  "ahmed-ashraf-kamel",
];

function mapCertificateRow(r: Record<string, unknown>): Certificate {
  return {
    id: String(r.id ?? ""),
    certificateId: String(r.certificate_id ?? ""),
    courseId: String(r.course_id ?? ""),
    userId: (r.user_id as string | number) ?? 0,
    issuedAt: typeof r.issued_at === "string" && r.issued_at ? r.issued_at : new Date().toISOString(),
  };
}

function buildMockCertificate(courseId: string): Certificate {
  return {
    id: `cert-${courseId}`,
    certificateId: certificateId(courseId),
    courseId,
    userId: "demo-member",
    issuedAt: new Date().toISOString(),
  };
}

// ---------- Supabase-backed service (same shape as apiService) ----------
export const supabaseService = {
  getPrograms: (): Promise<Program[]> =>
    executeCachedRead("/programs", () =>
      listByKind("programs", async () => (await loadMockData()).mockPrograms)
    ),

  getProgramById: (id: string): Promise<Program | undefined> =>
    executeCachedRead(`/programs/${id}`, () =>
      getByKindId("programs", id, async () =>
        (await loadMockData()).mockPrograms.find((p) => p.id === id)
      )
    ),

  getInitiatives: (): Promise<Initiative[]> =>
    executeCachedRead("/initiatives", () =>
      listByKind("initiatives", async () => (await loadMockData()).mockInitiatives)
    ),

  getEvents: (): Promise<Event[]> =>
    executeCachedRead("/events", () =>
      listByKind("events", async () => (await loadMockData()).mockEvents)
    ),

  getCourses: (): Promise<Course[]> =>
    executeCachedRead("/courses", () =>
      listByKind("courses", async () => (await loadMockData()).mockCourses)
    ),

  getGames: (): Promise<Game[]> =>
    executeCachedRead("/games", () =>
      listByKind("games", async () => (await loadMockData()).mockGames)
    ),

  getOpportunities: (): Promise<Opportunity[]> =>
    executeCachedRead("/opportunities", () =>
      listByKind("opportunities", async () => (await loadMockData()).mockOpportunities)
    ),

  getBlogPosts: (): Promise<BlogPost[]> =>
    executeCachedRead("/posts", async () => {
      const rows = await listByKind<BlogPost>(
        "posts",
        async () => (await loadMockData()).mockBlogPosts
      );
      return [...rows].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    }),

  getBlogPostById: (id: string): Promise<BlogPost | undefined> =>
    executeCachedRead(`/posts/${id}`, () =>
      getByKindId("posts", id, async () =>
        (await loadMockData()).mockBlogPosts.find((p) => p.id === id)
      )
    ),

  getTeam: (): Promise<TeamMember[]> =>
    executeCachedRead("/team", async () => {
      const list = await listByKind<TeamMember>(
        "team",
        async () => (await loadMockData()).mockTeam
      );
      return [...list].sort((a, b) => {
        const ia = CANONICAL_TEAM_ORDER.indexOf(a.id);
        const ib = CANONICAL_TEAM_ORDER.indexOf(b.id);
        if (ia !== -1 && ib !== -1) return ia - ib;
        if (ia !== -1) return -1;
        if (ib !== -1) return 1;
        return 0;
      });
    }),

  getCareerPathways: (): Promise<CareerNode[]> =>
    executeCachedRead("/careers", () =>
      listByKind("careers", async () => (await loadMockData()).mockCareers)
    ),

  getCarbonQuestions: (): Promise<CarbonQuestion[]> =>
    executeCachedRead("/carbon-questions", () =>
      listByKind("carbon-questions", async () => (await loadMockData()).mockCarbonQuestions)
    ),

  getCurriculaDownloadUrl: (): Promise<{ url: string }> =>
    executeCachedRead("/curricula/download", async () => ({ url: "/climate-curriculum.pdf" })),

  getPublicSettings: (): Promise<{
    siteName: string;
    contactEmail: string;
    enableMaintenance: boolean;
  }> =>
    executeCachedRead(
      "/settings",
      async () => {
        const client = await sb();
        if (!client) {
          return {
            siteName: "Climatify",
            contactEmail: "info@climatify-youth.com",
            enableMaintenance: false,
          };
        }
        const { data } = await client
          .from("admin_settings")
          .select("site_name,contact_email,enable_maintenance")
          .eq("id", 1)
          .maybeSingle();
        const r = data as {
          site_name?: string;
          contact_email?: string;
          enable_maintenance?: boolean;
        } | null;
        return {
          siteName: r?.site_name || "Climatify",
          contactEmail: r?.contact_email || "info@climatify-youth.com",
          enableMaintenance: r?.enable_maintenance ?? false,
        };
      },
      30_000
    ),

  trackPageView: (path: string): Promise<{ success: boolean }> =>
    executeMutation("POST", "/analytics/pageview", undefined, async () => {
      const client = await sb();
      if (!client) return { success: true };
      const cleanPath = (path || "/").slice(0, 250);
      await client.from("analytics_events").insert({
        event_type: "pageview",
        path: cleanPath,
      });
      return { success: true };
    }),

  // ---------- Forms (public inserts with in-flight deduplication) ----------
  submitContact: (data: ContactSubmitDto): Promise<MutationResult> =>
    executeMutation("POST", "/contact", data, async () => {
      const client = await sb();
      if (!client) {
        const { mockAdminMessages } = await loadMockData();
        pushBounded(mockAdminMessages, {
          id: slugId(),
          sender: `${data.firstName} ${data.lastName}`.trim(),
          email: data.email.trim().toLowerCase(),
          subject: data.subject.trim(),
          message: data.message.trim(),
          date: new Date().toISOString().slice(0, 10),
          isRead: false,
        });
        return okResult("تم إرسال رسالتك بنجاح! سيتواصل معك فريق كلايمتيفاي قريباً.");
      }
      const { error } = await client.from("contact_messages").insert({
        sender: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email.trim().toLowerCase(),
        subject: data.subject.trim(),
        message: data.message.trim(),
        is_read: false,
      });
      if (error) toApiError(error.message, 422, "/contact", error);
      return okResult("تم إرسال رسالتك بنجاح! سيتواصل معك فريق كلايمتيفاي قريباً.");
    }),

  bookMeeting: (data: MeetingBookingDto): Promise<MutationResult> =>
    executeMutation("POST", "/meetings", data, async () => {
      const client = await sb();
      const payload = {
        organizer: data.name.trim(),
        topic: data.notes?.trim() || "Meeting Request",
        preferredDate: `${data.date} ${data.time}`.trim(),
        date: data.date,
        time: data.time,
        notes: data.notes?.trim() || "",
      };
      if (!client) {
        const { mockAdminFormSubmissions } = await loadMockData();
        pushBounded(mockAdminFormSubmissions, {
          id: `sub-${slugId()}`,
          kind: "meeting",
          email: data.email.trim().toLowerCase(),
          payload,
          createdAt: new Date().toISOString(),
        });
        return okResult("تم حجز الموعد بنجاح! سنرسل لك بريداً إلكترونياً بتفاصيل التأكيد.");
      }
      const { error } = await client.from("form_submissions").insert({
        kind: "meeting",
        email: data.email.trim().toLowerCase(),
        payload,
      });
      if (error) toApiError(error.message, 422, "/meetings", error);
      return okResult("تم حجز الموعد بنجاح! سنرسل لك بريداً إلكترونياً بتفاصيل التأكيد.");
    }),

  submitPartnership: (data: PartnershipSubmitDto): Promise<MutationResult> =>
    executeMutation("POST", "/partnerships", data, async () => {
      const client = await sb();
      const payload = {
        organizationName: data.orgName.trim(),
        representativeName: data.contactPerson.trim(),
        partnershipType: data.orgType,
        notes: data.proposal.trim(),
      };
      if (!client) {
        const { mockAdminFormSubmissions } = await loadMockData();
        pushBounded(mockAdminFormSubmissions, {
          id: `sub-${slugId()}`,
          kind: "partner_portal",
          email: data.email.trim().toLowerCase(),
          payload,
          createdAt: new Date().toISOString(),
        });
        return okResult("تم إرسال طلب الشراكة بنجاح!");
      }
      const { error } = await client.from("form_submissions").insert({
        kind: "partner_portal",
        email: data.email.trim().toLowerCase(),
        payload,
      });
      if (error) toApiError(error.message, 422, "/partnerships", error);
      return okResult("تم إرسال طلب الشراكة بنجاح!");
    }),

  submitWorkshopRequest: (data: WorkshopRequestDto): Promise<MutationResult> =>
    executeMutation("POST", "/workshops", data, async () => {
      const client = await sb();
      const payload = {
        schoolName: data.institutionName.trim(),
        city: data.city.trim(),
        studentCount: data.studentCount,
        workshopType: data.workshopType,
      };
      if (!client) {
        const { mockAdminFormSubmissions } = await loadMockData();
        pushBounded(mockAdminFormSubmissions, {
          id: `sub-${slugId()}`,
          kind: "school_portal",
          email: data.email.trim().toLowerCase(),
          payload,
          createdAt: new Date().toISOString(),
        });
        return okResult("تم تسجيل طلب ورشة العمل بنجاح!");
      }
      const { error } = await client.from("form_submissions").insert({
        kind: "school_portal",
        email: data.email.trim().toLowerCase(),
        payload,
      });
      if (error) toApiError(error.message, 422, "/workshops", error);
      return okResult("تم تسجيل طلب ورشة العمل بنجاح!");
    }),

  registerForEvent: (data: EventRegistrationDto): Promise<MutationResult> =>
    executeMutation(
      "POST",
      "/events/register",
      { eventId: data.eventId, email: data.email.trim().toLowerCase() },
      async () => {
        const client = await sb();
        const ticket = ticketCode();
        const normalizedEmail = data.email.trim().toLowerCase();
        if (!client) {
          const { mockEvents, mockAdminEventRegistrations } = await loadMockData();
          const duplicate = mockAdminEventRegistrations.some(
            (r) =>
              r.eventId === data.eventId &&
              r.email.toLowerCase() === normalizedEmail &&
              r.status === "Confirmed"
          );
          if (duplicate) {
            toApiError("هذا البريد مسجل بالفعل في الفعالية", 409, "/events/register");
          }
          const event = mockEvents.find((e) => e.id === data.eventId);
          if (event) event.registeredCount = (event.registeredCount || 0) + 1;
          pushBounded(mockAdminEventRegistrations, {
            id: `reg-${slugId()}`,
            eventId: data.eventId,
            eventTitleEn: event?.titleEn || data.eventId,
            eventTitleAr: event?.titleAr || data.eventId,
            name: data.name.trim(),
            email: normalizedEmail,
            phone: data.phone.trim(),
            ticketCode: ticket,
            status: "Confirmed",
            createdAt: new Date().toISOString(),
          });
          return okResult("تم التسجيل في الفعالية بنجاح!", { ticketCode: ticket });
        }
        const user = await getSessionUser(client);
        const userId = user?.id ?? null;
        const { error } = await client.from("event_registrations").insert({
          event_id: data.eventId,
          user_id: userId,
          name: data.name.trim(),
          email: normalizedEmail,
          phone: data.phone.trim(),
          ticket_code: ticket,
          status: "Confirmed",
        });
        if (error) {
          if (error.code === "23505") {
            toApiError("هذا البريد مسجل بالفعل في الفعالية", 409, "/events/register", error);
          }
          toApiError(error.message, 422, "/events/register", error);
        }
        if (userId) {
          try {
            const { data: evRow } = await client
              .from("content_items")
              .select("data")
              .eq("kind", "events")
              .eq("id", data.eventId)
              .maybeSingle();
            const evData = (evRow as { data?: { titleAr?: string; titleEn?: string } } | null)?.data;
            await atomicIncrementUserStats(client, userId, { ecoPoints: 20 });
            await client.from("user_activities").insert({
              id: `act-${slugId()}`,
              user_id: userId,
              title_ar: "تسجيل في فعالية بيئية",
              title_en: "Event Registration",
              detail_ar: `تم التسجيل بنجاح في فعالية ${evData?.titleAr || data.eventId}`,
              detail_en: `Registered successfully for ${evData?.titleEn || data.eventId}`,
            });
          } catch {
            // non-blocking gamification update
          }
        }
        return okResult("تم التسجيل في الفعالية بنجاح!", { ticketCode: ticket });
      }
    ),

  applyToOpportunity: (data: OpportunityApplicationDto): Promise<MutationResult> =>
    executeMutation(
      "POST",
      "/opportunities/apply",
      { opportunityId: data.opportunityId, email: data.email.trim().toLowerCase() },
      async () => {
        const client = await sb();
        if (!client) {
          const { mockOpportunities, mockAdminFormSubmissions } = await loadMockData();
          const opp = mockOpportunities.find((o) => o.id === data.opportunityId);
          const payload = {
            opportunityId: data.opportunityId,
            opportunityTitle: opp ? `${opp.titleAr} / ${opp.titleEn}` : data.opportunityId,
            name: data.name.trim(),
            portfolio: sanitizeUrl(data.portfolio.trim()),
            coverLetter: data.coverLetter?.trim() || "",
          };
          pushBounded(mockAdminFormSubmissions, {
            id: `sub-${slugId()}`,
            kind: "opportunity_application",
            email: data.email.trim().toLowerCase(),
            payload,
            createdAt: new Date().toISOString(),
          });
          return okResult("تم إرسال طلب التقديم بنجاح!");
        }

        const { data: oppRow } = await client
          .from("content_items")
          .select("data")
          .eq("kind", "opportunities")
          .eq("id", data.opportunityId)
          .maybeSingle();
        const oppData = (oppRow as { data?: { titleAr?: string; titleEn?: string } } | null)?.data;
        const payload = {
          opportunityId: data.opportunityId,
          opportunityTitle:
            oppData?.titleAr && oppData?.titleEn
              ? `${oppData.titleAr} / ${oppData.titleEn}`
              : data.opportunityId,
          name: data.name.trim(),
          portfolio: sanitizeUrl(data.portfolio.trim()),
          coverLetter: data.coverLetter?.trim() || "",
        };
        const { error } = await client.from("form_submissions").insert({
          kind: "opportunity_application",
          email: data.email.trim().toLowerCase(),
          payload,
        });
        if (error) toApiError(error.message, 422, "/opportunities/apply", error);
        return okResult("تم إرسال طلب التقديم بنجاح!");
      }
    ),

  subscribeNewsletter: (email: string): Promise<MutationResult> => {
    const normalized = email.trim().toLowerCase();
    return executeMutation("POST", "/newsletter/subscribe", { email: normalized }, async () => {
      const client = await sb();
      const payload = { email: normalized, source: "Footer Newsletter" };
      if (!client) {
        const { mockAdminFormSubmissions } = await loadMockData();
        const alreadyExists = mockAdminFormSubmissions.some(
          (s) => s.kind === "newsletter" && s.email.toLowerCase() === normalized
        );
        if (!alreadyExists) {
          pushBounded(mockAdminFormSubmissions, {
            id: `sub-${slugId()}`,
            kind: "newsletter",
            email: normalized,
            payload,
            createdAt: new Date().toISOString(),
          });
        }
        return okResult("تم الاشتراك في النشرة الإخبارية بنجاح!");
      }
      const { error } = await client.from("form_submissions").insert({
        kind: "newsletter",
        email: normalized,
        payload,
      });
      if (error && error.code !== "23505") {
        toApiError(error.message, 422, "/newsletter/subscribe", error);
      }
      return okResult("تم الاشتراك في النشرة الإخبارية بنجاح!");
    });
  },

  // ---------- Member ----------
  getUserProfile: (): Promise<UserProfileResponse> =>
    executeCachedRead(
      "/user/profile",
      async () => {
        const client = await sb();
        if (!client) return (await loadMockData()).mockUserProfile;
        const user = await getSessionUser(client);
        if (!user) toApiError("Authorization token required", 401, "/user/profile");
        const [profileRes, statsRes, activitiesRes, coursesRes, regsRes] = await Promise.all([
          client.from("profiles").select("name,email,city,bio,status").eq("id", user.id).maybeSingle(),
          client
            .from("user_stats")
            .select("eco_points,virtual_trees,earned_badges")
            .eq("user_id", user.id)
            .maybeSingle(),
          client
            .from("user_activities")
            .select("id,title_ar,title_en,detail_ar,detail_en")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(20),
          client.from("course_progress").select("course_id,progress").eq("user_id", user.id),
          client
            .from("event_registrations")
            .select("event_id,status,ticket_code")
            .eq("user_id", user.id)
            .neq("status", "Cancelled"),
        ]);
        const profile = profileRes.data as {
          name?: string;
          email?: string;
          city?: string;
          bio?: string;
          status?: string;
        } | null;
        if (profile?.status === "suspended") {
          toApiError("Account suspended", 403, "/user/profile");
        }
        const stats = statsRes.data as {
          eco_points?: number;
          virtual_trees?: number;
          earned_badges?: number;
        } | null;
        const activities = activitiesRes.data as unknown[] | null;
        const courses = (coursesRes.data as { course_id: string; progress: number }[] | null) ?? [];
        const regs =
          (regsRes.data as { event_id: string; status: string; ticket_code: string }[] | null) ??
          [];

        // Fetch ONLY the exact course/event rows referenced by this user instead of scanning all content_items
        const referencedIds = Array.from(
          new Set([...courses.map((c) => c.course_id), ...regs.map((r) => r.event_id)])
        );
        const dbCourses = new Map<string, Record<string, unknown>>();
        const dbEvents = new Map<string, Record<string, unknown>>();
        if (referencedIds.length > 0) {
          const { data: contentRows } = await client
            .from("content_items")
            .select("id,kind,data")
            .in("id", referencedIds);
          for (const row of (contentRows as
            | { id: string; kind: string; data: Record<string, unknown> }[]
            | null) ?? []) {
            if (row.kind === "courses" && row.data) dbCourses.set(row.id, row.data);
            if (row.kind === "events" && row.data) dbEvents.set(row.id, row.data);
          }
        }

        const needsMockFallback =
          courses.some((c) => !dbCourses.has(c.course_id)) ||
          regs.some((r) => !dbEvents.has(r.event_id));
        const mocks = needsMockFallback ? await loadMockData() : null;

        return {
          name: profile?.name ?? "",
          email: profile?.email ?? user.email ?? "",
          city: profile?.city ?? "",
          bio: profile?.bio ?? "",
          stats: {
            ecoPoints: stats?.eco_points ?? 0,
            virtualTrees: stats?.virtual_trees ?? 0,
            earnedBadges: stats?.earned_badges ?? 0,
          },
          recentActivities: (activities ?? []).map((a: unknown) => {
            const x = a as {
              id: string;
              title_ar: string;
              title_en: string;
              detail_ar: string;
              detail_en: string;
            };
            return {
              id: x.id,
              titleAr: x.title_ar,
              titleEn: x.title_en,
              detailAr: x.detail_ar,
              detailEn: x.detail_en,
            };
          }),
          registeredCourses: courses.map((x) => {
            const dbC = dbCourses.get(x.course_id);
            const found = mocks?.mockCourses.find((mc) => mc.id === x.course_id);
            return {
              id: x.course_id,
              titleAr: (dbC?.titleAr as string) || found?.titleAr || x.course_id,
              titleEn: (dbC?.titleEn as string) || found?.titleEn || x.course_id,
              progress: x.progress,
            };
          }),
          registeredEvents: regs.map((x) => {
            const dbE = dbEvents.get(x.event_id);
            const found = mocks?.mockEvents.find((me) => me.id === x.event_id);
            return {
              id: x.event_id,
              titleAr: (dbE?.titleAr as string) || found?.titleAr || x.event_id,
              titleEn: (dbE?.titleEn as string) || found?.titleEn || x.event_id,
              date: (dbE?.date as string) || found?.date || "",
              status: x.status,
              ticketCode: x.ticket_code,
            };
          }),
        } as UserProfileResponse;
      },
      15_000
    ),

  updateUserProfile: (data: { name: string; city: string; bio: string }): Promise<MutationResult> =>
    executeMutation("PUT", "/user/profile", data, async () => {
      const client = await sb();
      if (!client) return okResult("تم تحديث الملف الشخصي بنجاح!");
      const user = await getSessionUser(client);
      if (!user) toApiError("Authorization token required", 401, "/user/profile");
      const { error } = await client
        .from("profiles")
        .update({ name: data.name.trim(), city: data.city.trim(), bio: data.bio.trim() })
        .eq("id", user.id);
      if (error) toApiError(error.message, 422, "/user/profile", error);
      return okResult("تم تحديث الملف الشخصي بنجاح!");
    }),

  saveCarbonFootprint: (footprint: number): Promise<MutationResult> =>
    executeMutation("POST", "/user/carbon-footprint", { footprint }, async () => {
      const client = await sb();
      if (!client) return okResult("تم حفظ النتيجة بنجاح!");
      const user = await getSessionUser(client);
      if (!user) toApiError("Authorization token required", 401, "/user/carbon-footprint");

      // Prefer atomic server RPC (enforces one-time +50 eco_points bonus)
      const { data: rpcRows, error: rpcErr } = await client.rpc("record_carbon_footprint", {
        p_footprint: footprint,
      });
      if (!rpcErr) {
        const awarded =
          Array.isArray(rpcRows) && rpcRows[0] ? (rpcRows[0].awarded_points ?? 0) : 0;
        try {
          await client.from("user_activities").insert({
            id: `act-${slugId()}`,
            user_id: user.id,
            title_ar: "حساب البصمة الكربونية",
            title_en: "Carbon Footprint Calculation",
            detail_ar: `تم حساب بصمتك الكربونية: ${footprint} طن/سنوياً${awarded ? ` (+${awarded} نقطة)` : ""}`,
            detail_en: `Calculated carbon footprint: ${footprint} tons/yr${awarded ? ` (+${awarded} points)` : ""}`,
          });
        } catch {
          // non-blocking
        }
        return okResult("تم حفظ النتيجة بنجاح!");
      }

      // Fallback for instances prior to 003_production_hardening.sql
      const { count: priorCount } = await client
        .from("carbon_footprints")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
      const { error } = await client
        .from("carbon_footprints")
        .insert({ user_id: user.id, footprint });
      if (error) toApiError(error.message, 422, "/user/carbon-footprint", error);
      await client.from("impact_history").insert({
        user_id: user.id,
        action_type: "carbon_footprint",
        value: footprint,
        metadata: { unit: "tons_co2e_per_year" },
      });
      const award = (priorCount ?? 0) === 0 ? 50 : 0;
      try {
        if (award > 0) {
          await atomicIncrementUserStats(client, user.id, { ecoPoints: award });
        }
        await client.from("user_activities").insert({
          id: `act-${slugId()}`,
          user_id: user.id,
          title_ar: "حساب البصمة الكربونية",
          title_en: "Carbon Footprint Calculation",
          detail_ar: `تم حساب بصمتك الكربونية: ${footprint} طن/سنوياً${award ? ` (+${award} نقطة)` : ""}`,
          detail_en: `Calculated carbon footprint: ${footprint} tons/yr${award ? ` (+${award} points)` : ""}`,
        });
      } catch {
        // non-blocking
      }
      return okResult("تم حفظ النتيجة بنجاح!");
    }),

  getCourseLessons: (courseId: string): Promise<unknown[]> =>
    executeCachedRead(`/courses/${courseId}/lessons`, async () => {
      const client = await sb();
      if (!client) return [];
      const { data } = await client
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("lesson_order");
      return (data ?? []) as unknown[];
    }),

  saveCourseProgress: (courseId: string, progress: number): Promise<MutationResult> => {
    const clamped = Math.max(0, Math.min(100, Math.round(progress)));
    return executeMutation(
      "POST",
      `/user/courses/${courseId}/progress`,
      { courseId, progress: clamped },
      async () => {
        const client = await sb();
        if (!client) return okResult("تم حفظ التقدم بنجاح!");
        const user = await getSessionUser(client);
        if (!user) {
          toApiError("Authorization token required", 401, `/user/courses/${courseId}/progress`);
        }
        const { data: prevProg } = await client
          .from("course_progress")
          .select("progress")
          .eq("user_id", user.id)
          .eq("course_id", courseId)
          .maybeSingle();
        const prevVal = (prevProg as { progress?: number } | null)?.progress ?? 0;
        const effectiveProgress = Math.max(prevVal, clamped);
        const { error } = await client.from("course_progress").upsert(
          { user_id: user.id, course_id: courseId, progress: effectiveProgress },
          { onConflict: "user_id,course_id" }
        );
        if (error) {
          toApiError(error.message, 422, `/user/courses/${courseId}/progress`, error);
        }
        if (clamped > prevVal) {
          try {
            const justCompleted = clamped === 100 && prevVal < 100;
            const bonusPoints = justCompleted ? 100 : 10;
            await atomicIncrementUserStats(client, user.id, {
              ecoPoints: bonusPoints,
              earnedBadges: justCompleted ? 1 : 0,
            });
          } catch {
            // non-blocking
          }
        }
        return okResult("تم حفظ التقدم بنجاح!");
      }
    );
  },

  addUserEvent: (eventId: string): Promise<MutationResult> =>
    executeMutation("POST", "/user/events", { eventId }, async () => {
      const client = await sb();
      const ticket = ticketCode();
      if (!client) return okResult("تمت إضافة الفعالية بنجاح!", { ticketCode: ticket });
      const user = await getSessionUser(client);
      if (!user) toApiError("Authorization token required", 401, "/user/events");
      const { data: profile } = await client
        .from("profiles")
        .select("name,email")
        .eq("id", user.id)
        .maybeSingle();
      const p = profile as { name?: string; email?: string } | null;
      const { error } = await client.from("event_registrations").insert({
        event_id: eventId,
        user_id: user.id,
        name: p?.name ?? "Member",
        email: (p?.email ?? user.email ?? "").toLowerCase(),
        phone: "",
        ticket_code: ticket,
        status: "Confirmed",
      });
      if (error) {
        if (error.code === "23505") {
          toApiError("أنت مسجّل في هذه الفعالية بالفعل", 409, "/user/events", error);
        }
        toApiError(error.message, 422, "/user/events", error);
      }
      return okResult("تمت إضافة الفعالية بنجاح!", { ticketCode: ticket });
    }),

  cancelUserEvent: (eventId: string): Promise<MutationResult> =>
    executeMutation("DELETE", `/user/events/${eventId}`, { eventId }, async () => {
      const client = await sb();
      if (!client) return okResult("تم إلغاء التسجيل بنجاح!");
      const user = await getSessionUser(client);
      if (!user) toApiError("Authorization token required", 401, `/user/events/${eventId}`);
      const { error } = await client
        .from("event_registrations")
        .update({ status: "Cancelled" })
        .eq("user_id", user.id)
        .eq("event_id", eventId)
        .eq("status", "Confirmed");
      if (error) toApiError(error.message, 422, `/user/events/${eventId}`, error);
      return okResult("تم إلغاء التسجيل بنجاح!");
    }),

  saveVirtualTrees: (count: number, costPoints = 40): Promise<MutationResult> =>
    executeMutation("POST", "/user/trees", { count, costPoints }, async () => {
      const client = await sb();
      if (!client) return okResult("تم حفظ عدد الأشجار بنجاح!");
      const user = await getSessionUser(client);
      if (!user) toApiError("Authorization token required", 401, "/user/trees");

      const { error: rpcErr } = await client.rpc("redeem_virtual_tree", {
        p_cost: Math.max(10, costPoints),
      });
      if (!rpcErr) {
        return okResult("تم حفظ عدد الأشجار بنجاح!");
      }
      if (/insufficient eco points/i.test(rpcErr.message)) {
        toApiError("رصيد النقاط البيئية غير كافٍ", 400, "/user/trees", rpcErr);
      }

      // Fallback if RPC not yet applied
      try {
        await atomicIncrementUserStats(client, user.id, {
          ecoPoints: -Math.abs(costPoints),
          virtualTrees: count,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to update virtual trees";
        toApiError(msg, 422, "/user/trees", err);
      }
      return okResult("تم حفظ عدد الأشجار بنجاح!");
    }),

  getImpactHistory: (year?: number): Promise<unknown> =>
    executeCachedRead(
      `/user/impact${year ? `?year=${year}` : ""}`,
      async () => {
        const client = await sb();
        if (!client) return { history: [] };
        const user = await getSessionUser(client);
        if (!user) toApiError("Authorization token required", 401, "/user/impact");
        let q = client
          .from("impact_history")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(100);
        if (year) {
          const start = `${year}-01-01T00:00:00Z`;
          const end = `${year + 1}-01-01T00:00:00Z`;
          q = q.gte("created_at", start).lt("created_at", end);
        }
        const { data } = await q;
        return {
          history: (data ?? []).map((r: Record<string, unknown>) => ({
            id: String(r.id),
            type: r.action_type,
            value: r.value,
            metadata: r.metadata ?? {},
            timestamp: r.created_at,
          })),
        };
      },
      15_000
    ),

  getBookmarks: (): Promise<unknown[]> =>
    executeCachedRead(
      "/user/bookmarks",
      async () => {
        const client = await sb();
        if (!client) return [];
        const user = await getSessionUser(client);
        if (!user) return [];
        const { data } = await client
          .from("bookmarks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(100);
        return (data ?? []) as unknown[];
      },
      15_000
    ),

  addBookmark: (contentType: string, contentId: string): Promise<unknown> =>
    executeMutation("POST", "/user/bookmarks", { contentType, contentId }, async () => {
      const client = await sb();
      if (!client) return { success: true };
      const user = await getSessionUser(client);
      if (!user) toApiError("Authorization token required", 401, "/user/bookmarks");
      const { data, error } = await client
        .from("bookmarks")
        .insert({ user_id: user.id, content_type: contentType, content_id: contentId })
        .select()
        .maybeSingle();
      if (error) {
        if (error.code === "23505") {
          toApiError("Bookmark already exists", 409, "/user/bookmarks", error);
        }
        toApiError(error.message, 422, "/user/bookmarks", error);
      }
      return data as unknown;
    }),

  deleteBookmark: (bookmarkId: string): Promise<MutationResult> =>
    executeMutation("DELETE", `/user/bookmarks/${bookmarkId}`, { bookmarkId }, async () => {
      const client = await sb();
      if (!client) return okResult("تم حذف العلامة بنجاح!");
      const user = await getSessionUser(client);
      if (!user) toApiError("Authorization token required", 401, `/user/bookmarks/${bookmarkId}`);
      const { error } = await client
        .from("bookmarks")
        .delete()
        .eq("id", Number(bookmarkId))
        .eq("user_id", user.id);
      if (error) toApiError(error.message, 422, `/user/bookmarks/${bookmarkId}`, error);
      return okResult("تم حذف العلامة بنجاح!");
    }),

  getCertificates: (): Promise<Certificate[]> =>
    executeCachedRead(
      "/user/certificates",
      async () => {
        const client = await sb();
        if (!client) return [];
        const user = await getSessionUser(client);
        if (!user) return [];
        const { data } = await client
          .from("certificates")
          .select("*")
          .eq("user_id", user.id)
          .order("issued_at", { ascending: false });
        return ((data ?? []) as unknown as Record<string, unknown>[]).map(mapCertificateRow);
      },
      15_000
    ),

  getCertificate: (courseId: string): Promise<Certificate> =>
    executeCachedRead(
      `/user/certificates/${courseId}`,
      async () => {
        const client = await sb();
        if (!client) return buildMockCertificate(courseId);
        const user = await getSessionUser(client);
        if (!user) toApiError("Authorization token required", 401, `/user/certificates/${courseId}`);
        const { data, error } = await client
          .from("certificates")
          .select("*")
          .eq("user_id", user.id)
          .eq("course_id", courseId)
          .maybeSingle();
        if (error || !data) {
          toApiError("Certificate not found", 404, `/user/certificates/${courseId}`, error);
        }
        return mapCertificateRow(data as unknown as Record<string, unknown>);
      },
      15_000
    ),

  issueCertificate: (courseId: string): Promise<Certificate> =>
    executeMutation("POST", `/user/courses/${courseId}/certificate`, { courseId }, async () => {
      const client = await sb();
      if (!client) return buildMockCertificate(courseId);
      const user = await getSessionUser(client);
      if (!user) {
        toApiError("Authorization token required", 401, `/user/courses/${courseId}/certificate`);
      }
      const certId = certificateId(courseId);

      // Prefer atomic server-verified RPC
      const { data: rpcData, error: rpcErr } = await client.rpc("issue_course_certificate", {
        p_course_id: courseId,
        p_certificate_id: certId,
      });
      if (!rpcErr && Array.isArray(rpcData) && rpcData[0]) {
        return mapCertificateRow(rpcData[0] as unknown as Record<string, unknown>);
      }
      if (rpcErr && /course not completed/i.test(rpcErr.message)) {
        toApiError("Course not completed", 403, `/user/courses/${courseId}/certificate`, rpcErr);
      }

      // Fallback for instances prior to 003_production_hardening.sql
      const { data: prog } = await client
        .from("course_progress")
        .select("progress")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();
      const p = prog as { progress?: number } | null;
      if (!p || (p.progress ?? 0) < 100) {
        toApiError("Course not completed", 403, `/user/courses/${courseId}/certificate`);
      }
      const { data: existing } = await client
        .from("certificates")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();
      if (existing) {
        return mapCertificateRow(existing as unknown as Record<string, unknown>);
      }
      const { data, error } = await client
        .from("certificates")
        .insert({ user_id: user.id, course_id: courseId, certificate_id: certId })
        .select()
        .maybeSingle();
      if (error) {
        if (error.code === "23505") {
          const { data: raced } = await client
            .from("certificates")
            .select("*")
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .maybeSingle();
          if (raced) {
            return mapCertificateRow(raced as unknown as Record<string, unknown>);
          }
        }
        toApiError(error.message, 422, `/user/courses/${courseId}/certificate`, error);
      }
      return mapCertificateRow(data as unknown as Record<string, unknown>);
    }),

  // ---------- Admin ----------
  loginAdmin: (
    email: string,
    password: string
  ): Promise<{ success: boolean; token?: string; error?: string }> =>
    executeMutation("POST", "/admin/login", undefined, async () => {
      const client = await sb();
      if (!client) return { success: true, token: "mock-jwt-token-xyz" };
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) {
        const msg = /invalid/i.test(error.message)
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
          : error.message;
        return { success: false, error: msg };
      }
      const { data: profile } = await client
        .from("profiles")
        .select("role, status")
        .eq("id", data.user.id)
        .maybeSingle();
      const prof = profile as { role?: string; status?: string } | null;
      if (prof?.role !== "admin" || prof?.status === "suspended" || !data.session?.access_token) {
        await client.auth.signOut();
        return { success: false, error: "هذا الحساب ليس مسؤولاً أو تم تعليقه." };
      }
      void logAudit("login", "admin_session");
      return { success: true, token: data.session.access_token };
    }),

  changeAdminPassword: (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<MutationResult> =>
    executeMutation("POST", "/admin/change-password", undefined, async () => {
      const client = await sb();
      if (!client) return okResult("تم تحديث كلمة المرور بنجاح!");
      const user = await getSessionUser(client);
      if (!user || !user.email) {
        toApiError("Authorization token required", 401, "/admin/change-password");
      }
      const { error: verifyErr } = await client.auth.signInWithPassword({
        email: user.email,
        password: data.currentPassword,
      });
      if (verifyErr) {
        toApiError("كلمة المرور الحالية غير صحيحة.", 400, "/admin/change-password", verifyErr);
      }
      const { error } = await client.auth.updateUser({ password: data.newPassword });
      if (error) toApiError(error.message, 422, "/admin/change-password", error);
      void logAudit("update_password", "admin_account");
      return okResult("تم تحديث كلمة المرور بنجاح!");
    }),

  registerMember: (data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{
    success: boolean;
    token?: string;
    error?: string;
    requiresEmailConfirmation?: boolean;
  }> =>
    executeMutation("POST", "/auth/register", undefined, async () => {
      const client = await sb();
      if (!client) {
        if (!data.email.includes("@") || data.password.length < 6) {
          return { success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
        }
        const { mockAdminUsers } = await loadMockData();
        const existing = mockAdminUsers.find(
          (u) => u.email.toLowerCase() === data.email.toLowerCase()
        );
        if (!existing) {
          pushBounded(mockAdminUsers, {
            id:
              typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : `mock-${Date.now()}`,
            email: data.email.trim().toLowerCase(),
            name: data.name.trim(),
            city: "دبي",
            bio: "عضو مسجل جديد في منصة Climatify",
            role: "member",
            createdAt: new Date().toISOString(),
            ecoPoints: 50,
            virtualTrees: 1,
            status: "active",
          });
        }
        return { success: true, token: "mock-member-token-xyz" };
      }
      const normalizedEmail = data.email.trim().toLowerCase();
      const { data: res, error } = await client.auth.signUp({
        email: normalizedEmail,
        password: data.password,
        options: { data: { name: data.name.trim() } },
      });
      if (error) return { success: false, error: error.message };
      if (!res.session?.access_token) {
        return { success: true, requiresEmailConfirmation: true };
      }
      if (res.user) {
        try {
          await client.from("profiles").upsert(
            {
              id: res.user.id,
              email: normalizedEmail,
              name: data.name.trim(),
              role: "member",
              status: "active",
            },
            { onConflict: "id" }
          );
        } catch {
          // Trigger handle_new_user() on auth.users already creates profile & user_stats
        }
      }
      return { success: true, token: res.session.access_token };
    }),

  loginMember: (
    email: string,
    password: string
  ): Promise<{ success: boolean; token?: string; error?: string }> =>
    executeMutation("POST", "/auth/login", undefined, async () => {
      const client = await sb();
      if (!client) {
        if (email.includes("@") && password.length >= 4) {
          return { success: true, token: "mock-member-token-xyz" };
        }
        return { success: false, error: "بريد إلكتروني أو كلمة مرور غير صحيحة" };
      }
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error || !data.session?.access_token) {
        return { success: false, error: error?.message || "بريد إلكتروني أو كلمة مرور غير صحيحة" };
      }
      const { data: prof } = await client
        .from("profiles")
        .select("status")
        .eq("id", data.user.id)
        .maybeSingle();
      const profileRow = prof as { status?: string } | null;
      if (!profileRow) {
        await client.auth.signOut();
        return { success: false, error: "هذا الحساب غير نشط أو تم حذفه من المنصة." };
      }
      if (profileRow.status === "suspended") {
        await client.auth.signOut();
        return { success: false, error: "تم تعليق هذا الحساب مؤقتاً. يرجى التواصل مع الإدارة." };
      }
      return { success: true, token: data.session.access_token };
    }),

  getAdminStats: (): Promise<AdminStats> =>
    executeCachedRead(
      "/admin/stats",
      async () => {
        const client = await sb();
        if (!client) return (await loadMockData()).mockAdminStats;
        const [visitors, members, events, posts, recent] = await Promise.all([
          client.from("analytics_events").select("id", { count: "exact", head: true }),
          client.from("profiles").select("id", { count: "exact", head: true }).neq("role", "admin"),
          client
            .from("content_items")
            .select("id", { count: "exact", head: true })
            .eq("kind", "events"),
          client
            .from("content_items")
            .select("id", { count: "exact", head: true })
            .eq("kind", "posts"),
          client
            .from("audit_logs")
            .select("action,resource,created_at")
            .order("created_at", { ascending: false })
            .limit(8),
        ]);
        if (visitors.error) toApiError(visitors.error.message, 500, "/admin/stats", visitors.error);
        const recentRows = (recent.data as unknown[]) ?? [];
        const recentActivities = recentRows.map((r: unknown) => {
          const x = r as { action: string; resource: string; created_at: string };
          const d = x.created_at ? new Date(x.created_at).toISOString().slice(0, 10) : "";
          return {
            textAr: `تم تنفيذ ${x.action} على ${x.resource}`,
            textEn: `${x.action} ${x.resource}`,
            timeAr: d,
            timeEn: d,
          };
        });
        return {
          totalVisitors: String(visitors.count ?? 0),
          activeMembers: String(members.count ?? 0),
          upcomingEvents: String(events.count ?? 0),
          publishedPosts: String(posts.count ?? 0),
          recentActivities,
        } as AdminStats;
      },
      15_000
    ),

  getAdminAnalytics: (): Promise<AnalyticItem[]> =>
    executeCachedRead(
      "/admin/analytics",
      async () => {
        const client = await sb();
        if (!client) return (await loadMockData()).mockAdminAnalytics;
        const [total, members, regs, forms] = await Promise.all([
          client.from("analytics_events").select("id", { count: "exact", head: true }),
          client.from("profiles").select("id", { count: "exact", head: true }).neq("role", "admin"),
          client
            .from("event_registrations")
            .select("id", { count: "exact", head: true })
            .neq("status", "Cancelled"),
          client.from("form_submissions").select("id", { count: "exact", head: true }),
        ]);
        if (total.error) toApiError(total.error.message, 500, "/admin/analytics", total.error);
        return [
          {
            labelAr: "إجمالي الزيارات المسجلة",
            labelEn: "Recorded Page Views",
            value: String(total.count ?? 0),
            icon: "BarChart3",
          },
          {
            labelAr: "الأعضاء المسجلون",
            labelEn: "Registered Members",
            value: String(members.count ?? 0),
            icon: "Users",
          },
          {
            labelAr: "طلبات واستمارات البوابات",
            labelEn: "Portal Submissions",
            value: String(forms.count ?? 0),
            icon: "TrendingUp",
          },
          {
            labelAr: "تذاكر الفعاليات المؤكدة",
            labelEn: "Active Event Tickets",
            value: String(regs.count ?? 0),
            icon: "Ticket",
          },
        ];
      },
      15_000
    ),

  getAdminMessages: (): Promise<ContactMessage[]> =>
    executeCachedRead(
      "/admin/messages",
      async () => {
        const client = await sb();
        if (!client) return [...(await loadMockData()).mockAdminMessages];
        const { data, error } = await client
          .from("contact_messages")
          .select("*")
          .order("date", { ascending: false })
          .limit(500);
        if (error) toApiError(error.message, 500, "/admin/messages", error);
        if (!data || data.length === 0) return [];
        return (data as unknown[]).map((m: unknown) => {
          const x = m as {
            id: number;
            sender: string;
            email: string;
            subject: string;
            message: string;
            date: string;
            is_read: boolean;
          };
          return {
            id: String(x.id),
            sender: x.sender,
            email: x.email,
            subject: x.subject,
            message: x.message,
            date: x.date,
            isRead: x.is_read,
          };
        });
      },
      15_000
    ),

  markMessageRead: (id: string, isRead = true): Promise<{ success: boolean }> =>
    executeMutation("PUT", `/admin/messages/${id}/read`, { id, isRead }, async () => {
      const client = await sb();
      if (!client) return { success: true };
      const numId = Number(id);
      if (!Number.isFinite(numId)) return { success: true };
      const { error } = await client
        .from("contact_messages")
        .update({ is_read: isRead })
        .eq("id", numId);
      if (error) toApiError(error.message, 422, `/admin/messages/${id}/read`, error);
      return { success: true };
    }),

  deleteMessage: (id: string): Promise<{ success: boolean }> =>
    executeMutation("DELETE", `/admin/messages/${id}`, { id }, async () => {
      const client = await sb();
      if (!client) return { success: true };
      const numId = Number(id);
      if (!Number.isFinite(numId)) return { success: true };
      const { error } = await client
        .from("contact_messages")
        .delete()
        .eq("id", numId);
      if (error) toApiError(error.message, 422, `/admin/messages/${id}`, error);
      void logAudit("delete", `contact_messages/${id}`);
      return { success: true };
    }),

  saveAdminSettings: (data: {
    siteName: string;
    contactEmail: string;
    enableMaintenance: boolean;
  }): Promise<{ success: boolean }> =>
    executeMutation("POST", "/admin/settings", data, async () => {
      const client = await sb();
      if (!client) return { success: true };
      const { error } = await client.from("admin_settings").upsert(
        {
          id: 1,
          site_name: data.siteName.trim(),
          contact_email: data.contactEmail.trim(),
          enable_maintenance: data.enableMaintenance,
        },
        { onConflict: "id" }
      );
      if (error) toApiError(error.message, 422, "/admin/settings", error);
      void logAudit("update", "admin_settings");
      return { success: true };
    }),

  getAdminSettings: (): Promise<{
    siteName: string;
    contactEmail: string;
    enableMaintenance: boolean;
  }> =>
    executeCachedRead(
      "/admin/settings",
      async () => {
        const client = await sb();
        if (!client) {
          return {
            siteName: "Climatify",
            contactEmail: "info@climatify-youth.com",
            enableMaintenance: false,
          };
        }
        const { data, error } = await client
          .from("admin_settings")
          .select("site_name,contact_email,enable_maintenance")
          .eq("id", 1)
          .maybeSingle();
        if (error) toApiError(error.message, 500, "/admin/settings", error);
        const r = data as {
          site_name?: string;
          contact_email?: string;
          enable_maintenance?: boolean;
        } | null;
        return {
          siteName: r?.site_name ?? "Climatify",
          contactEmail: r?.contact_email ?? "info@climatify-youth.com",
          enableMaintenance: r?.enable_maintenance ?? false,
        };
      },
      30_000
    ),

  // ---------- CMS CRUD via content_items ----------
  createEvent: (data: Omit<Event, "id" | "registeredCount">): Promise<Event> =>
    executeMutation("POST", "/admin/events", data, () =>
      createContent("events", { registeredCount: 0, ...data }) as unknown as Promise<Event>
    ),
  updateEvent: (id: string, data: Partial<Event>): Promise<Event> =>
    executeMutation("PUT", `/admin/events/${id}`, data, () =>
      updateContent("events", id, data) as unknown as Promise<Event>
    ),
  deleteEvent: (id: string): Promise<{ success: boolean }> =>
    executeMutation("DELETE", `/admin/events/${id}`, { id }, () => deleteContent("events", id)),

  createBlogPost: (data: Omit<BlogPost, "id">): Promise<BlogPost> =>
    executeMutation("POST", "/admin/posts", data, () =>
      createContent("posts", data) as unknown as Promise<BlogPost>
    ),
  updateBlogPost: (id: string, data: Partial<BlogPost>): Promise<BlogPost> =>
    executeMutation("PUT", `/admin/posts/${id}`, data, () =>
      updateContent("posts", id, data) as unknown as Promise<BlogPost>
    ),
  deleteBlogPost: (id: string): Promise<{ success: boolean }> =>
    executeMutation("DELETE", `/admin/posts/${id}`, { id }, () => deleteContent("posts", id)),

  createProgram: (data: Omit<Program, "id">): Promise<Program> =>
    executeMutation("POST", "/admin/programs", data, () =>
      createContent("programs", data) as unknown as Promise<Program>
    ),
  updateProgram: (id: string, data: Partial<Program>): Promise<Program> =>
    executeMutation("PUT", `/admin/programs/${id}`, data, () =>
      updateContent("programs", id, data) as unknown as Promise<Program>
    ),
  deleteProgram: (id: string): Promise<{ success: boolean }> =>
    executeMutation("DELETE", `/admin/programs/${id}`, { id }, () => deleteContent("programs", id)),

  createInitiative: (data: Omit<Initiative, "id">): Promise<Initiative> =>
    executeMutation("POST", "/admin/initiatives", data, () =>
      createContent("initiatives", data) as unknown as Promise<Initiative>
    ),
  updateInitiative: (id: string, data: Partial<Initiative>): Promise<Initiative> =>
    executeMutation("PUT", `/admin/initiatives/${id}`, data, () =>
      updateContent("initiatives", id, data) as unknown as Promise<Initiative>
    ),
  deleteInitiative: (id: string): Promise<{ success: boolean }> =>
    executeMutation("DELETE", `/admin/initiatives/${id}`, { id }, () =>
      deleteContent("initiatives", id)
    ),

  createCourse: (data: Omit<Course, "id">): Promise<Course> =>
    executeMutation("POST", "/admin/courses", data, () =>
      createContent("courses", data) as unknown as Promise<Course>
    ),
  updateCourse: (id: string, data: Partial<Course>): Promise<Course> =>
    executeMutation("PUT", `/admin/courses/${id}`, data, () =>
      updateContent("courses", id, data) as unknown as Promise<Course>
    ),
  deleteCourse: (id: string): Promise<{ success: boolean }> =>
    executeMutation("DELETE", `/admin/courses/${id}`, { id }, () => deleteContent("courses", id)),

  createOpportunity: (data: Omit<Opportunity, "id">): Promise<Opportunity> =>
    executeMutation("POST", "/admin/opportunities", data, () =>
      createContent("opportunities", data) as unknown as Promise<Opportunity>
    ),
  updateOpportunity: (id: string, data: Partial<Opportunity>): Promise<Opportunity> =>
    executeMutation("PUT", `/admin/opportunities/${id}`, data, () =>
      updateContent("opportunities", id, data) as unknown as Promise<Opportunity>
    ),
  deleteOpportunity: (id: string): Promise<{ success: boolean }> =>
    executeMutation("DELETE", `/admin/opportunities/${id}`, { id }, () =>
      deleteContent("opportunities", id)
    ),

  createTeamMember: (data: Omit<TeamMember, "id">): Promise<TeamMember> =>
    executeMutation("POST", "/admin/team", data, () =>
      createContent("team", data) as unknown as Promise<TeamMember>
    ),
  updateTeamMember: (id: string, data: Partial<TeamMember>): Promise<TeamMember> =>
    executeMutation("PUT", `/admin/team/${id}`, data, () =>
      updateContent("team", id, data) as unknown as Promise<TeamMember>
    ),
  deleteTeamMember: (id: string): Promise<{ success: boolean }> =>
    executeMutation("DELETE", `/admin/team/${id}`, { id }, () => deleteContent("team", id)),

  // ---------- Admin Users / Members ----------
  getAdminUsers: (): Promise<AdminUser[]> =>
    executeCachedRead(
      "/admin/users",
      async () => {
        const client = await sb();
        if (!client) return [...(await loadMockData()).mockAdminUsers];
        const [profilesRes, statsRes] = await Promise.all([
          client.from("profiles").select("*").order("created_at", { ascending: false }).limit(500),
          client.from("user_stats").select("user_id, eco_points, virtual_trees").limit(500),
        ]);
        if (profilesRes.error) {
          toApiError(profilesRes.error.message, 500, "/admin/users", profilesRes.error);
        }
        if (!profilesRes.data || profilesRes.data.length === 0) {
          return [];
        }
        const statsByUser = new Map<string, { eco_points: number; virtual_trees: number }>();
        for (const s of (statsRes.data as
          | { user_id: string; eco_points: number; virtual_trees: number }[]
          | null) ?? []) {
          statsByUser.set(String(s.user_id), s);
        }
        return (profilesRes.data as Record<string, unknown>[]).map((p) => {
          const uid = String(p.id);
          const st = statsByUser.get(uid);
          const email = typeof p.email === "string" ? p.email : "";
          return {
            id: uid,
            email,
            name:
              (typeof p.name === "string" && p.name) ||
              (email ? email.split("@")[0] : "User") ||
              "User",
            city: (typeof p.city === "string" && p.city) || "الإمارات",
            bio: typeof p.bio === "string" ? p.bio : "",
            role: (p.role as AdminUser["role"]) || "member",
            createdAt:
              typeof p.created_at === "string" ? p.created_at : new Date().toISOString(),
            ecoPoints: st?.eco_points ?? 0,
            virtualTrees: st?.virtual_trees ?? 0,
            status: p.status === "suspended" ? "suspended" : "active",
          };
        });
      },
      15_000
    ),

  createAdminUser: (data: Omit<AdminUser, "id" | "createdAt">): Promise<AdminUser> =>
    executeMutation("POST", "/admin/users", data, async () => {
      const client = await sb();
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `mock-${Date.now()}`;
      const newUser: AdminUser = {
        id,
        createdAt: new Date().toISOString(),
        status: data.status || "active",
        ecoPoints: data.ecoPoints ?? 0,
        virtualTrees: data.virtualTrees ?? 0,
        ...data,
      };
      if (!client) {
        const { mockAdminUsers } = await loadMockData();
        pushBounded(mockAdminUsers, newUser);
        return newUser;
      }
      const { data: inserted, error } = await client
        .from("profiles")
        .insert({
          id,
          email: data.email.trim().toLowerCase(),
          name: data.name.trim(),
          city: data.city.trim(),
          bio: data.bio.trim(),
          role: data.role,
          status: data.status || "active",
        })
        .select()
        .maybeSingle();
      if (error) toApiError(error.message, 422, "/admin/users", error);
      try {
        await client.from("user_stats").upsert(
          {
            user_id: id,
            eco_points: data.ecoPoints ?? 0,
            virtual_trees: data.virtualTrees ?? 0,
          },
          { onConflict: "user_id" }
        );
      } catch {
        // non-blocking
      }
      void logAudit("create", `profiles/${id}`);
      return inserted ? { ...newUser, ...(inserted as Partial<AdminUser>) } : newUser;
    }),

  updateAdminUserRole: (id: string, role: AdminUser["role"]): Promise<{ success: boolean }> =>
    executeMutation("PATCH", `/admin/users/${id}/role`, { id, role }, async () => {
      const client = await sb();
      if (!client) {
        const { mockAdminUsers } = await loadMockData();
        const u = mockAdminUsers.find((x) => x.id === id);
        if (u) u.role = role;
        return { success: true };
      }
      const { error } = await client.from("profiles").update({ role }).eq("id", id);
      if (error) toApiError(error.message, 422, `/admin/users/${id}/role`, error);
      void logAudit("update_role", `profiles/${id}`);
      return { success: true };
    }),

  updateAdminUserStatus: (id: string, status: "active" | "suspended"): Promise<{ success: boolean }> =>
    executeMutation("PATCH", `/admin/users/${id}/status`, { id, status }, async () => {
      const client = await sb();
      if (!client) {
        const { mockAdminUsers } = await loadMockData();
        const u = mockAdminUsers.find((x) => x.id === id);
        if (u) u.status = status;
        return { success: true };
      }
      const { error } = await client.from("profiles").update({ status }).eq("id", id);
      if (error) toApiError(error.message, 422, `/admin/users/${id}/status`, error);
      void logAudit("update_status", `profiles/${id}`);
      return { success: true };
    }),

  deleteAdminUser: (id: string): Promise<{ success: boolean }> =>
    executeMutation("DELETE", `/admin/users/${id}`, { id }, async () => {
      const client = await sb();
      if (!client) {
        const { mockAdminUsers } = await loadMockData();
        const idx = mockAdminUsers.findIndex((x) => x.id === id);
        if (idx !== -1) mockAdminUsers.splice(idx, 1);
        return { success: true };
      }
      const { error } = await client.from("profiles").delete().eq("id", id);
      if (error) toApiError(error.message, 422, `/admin/users/${id}`, error);
      void logAudit("delete", `profiles/${id}`);
      return { success: true };
    }),

  // ---------- Admin Event Registrations ----------
  getAdminEventRegistrations: (): Promise<AdminEventRegistration[]> =>
    executeCachedRead(
      "/admin/event-registrations",
      async () => {
        const client = await sb();
        if (!client) return [...(await loadMockData()).mockAdminEventRegistrations];
        const [regsRes, eventsRes] = await Promise.all([
          client
            .from("event_registrations")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(500),
          client.from("content_items").select("id, data").eq("kind", "events"),
        ]);
        if (regsRes.error) {
          toApiError(regsRes.error.message, 500, "/admin/event-registrations", regsRes.error);
        }
        if (!regsRes.data || regsRes.data.length === 0) {
          return [];
        }
        const dbEvents = new Map<string, { titleEn?: string; titleAr?: string }>();
        for (const row of (eventsRes.data as
          | { id: string; data: { titleEn?: string; titleAr?: string } }[]
          | null) ?? []) {
          if (row.data) dbEvents.set(row.id, row.data);
        }
        const regsRows = regsRes.data as Record<string, unknown>[];
        const needsMockEvents = regsRows.some((r) => !dbEvents.has(String(r.event_id ?? "")));
        const mocks = needsMockEvents ? await loadMockData() : null;

        return regsRows.map((r) => {
          const eventId = String(r.event_id ?? "");
          const dbEv = dbEvents.get(eventId);
          const mockEv = mocks?.mockEvents.find((e) => e.id === eventId);
          return {
            id: String(r.id),
            eventId,
            eventTitleEn: dbEv?.titleEn || mockEv?.titleEn || eventId,
            eventTitleAr: dbEv?.titleAr || mockEv?.titleAr || eventId,
            name: String(r.name ?? ""),
            email: String(r.email ?? ""),
            phone: String(r.phone ?? ""),
            ticketCode: String(r.ticket_code ?? ""),
            status: (r.status as AdminEventRegistration["status"]) || "Confirmed",
            createdAt:
              typeof r.created_at === "string" ? r.created_at : new Date().toISOString(),
          };
        });
      },
      15_000
    ),

  updateEventRegistrationStatus: (
    id: string | number,
    status: AdminEventRegistration["status"]
  ): Promise<{ success: boolean }> =>
    executeMutation(
      "PATCH",
      `/admin/event-registrations/${id}/status`,
      { id: String(id), status },
      async () => {
        const client = await sb();
        if (!client) {
          const { mockAdminEventRegistrations } = await loadMockData();
          const reg = mockAdminEventRegistrations.find((x) => String(x.id) === String(id));
          if (reg) reg.status = status;
          return { success: true };
        }
        const numId = Number(id);
        if (!Number.isFinite(numId)) return { success: true };
        const { error } = await client
          .from("event_registrations")
          .update({ status })
          .eq("id", numId);
        if (error) {
          toApiError(error.message, 422, `/admin/event-registrations/${id}/status`, error);
        }
        void logAudit("update_status", `event_registrations/${id}`);
        return { success: true };
      }
    ),

  deleteEventRegistration: (id: string | number): Promise<{ success: boolean }> =>
    executeMutation("DELETE", `/admin/event-registrations/${id}`, { id: String(id) }, async () => {
      const client = await sb();
      if (!client) {
        const { mockAdminEventRegistrations } = await loadMockData();
        const idx = mockAdminEventRegistrations.findIndex((x) => String(x.id) === String(id));
        if (idx !== -1) mockAdminEventRegistrations.splice(idx, 1);
        return { success: true };
      }
      const numId = Number(id);
      if (!Number.isFinite(numId)) return { success: true };
      const { error } = await client
        .from("event_registrations")
        .delete()
        .eq("id", numId);
      if (error) toApiError(error.message, 422, `/admin/event-registrations/${id}`, error);
      void logAudit("delete", `event_registrations/${id}`);
      return { success: true };
    }),

  // ---------- Admin Form Submissions ----------
  getAdminFormSubmissions: (): Promise<AdminFormSubmission[]> =>
    executeCachedRead(
      "/admin/form-submissions",
      async () => {
        const client = await sb();
        if (!client) return [...(await loadMockData()).mockAdminFormSubmissions];
        const { data, error } = await client
          .from("form_submissions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(500);
        if (error) {
          toApiError(error.message, 500, "/admin/form-submissions", error);
        }
        if (!data || data.length === 0) {
          return [];
        }
        return (data as Record<string, unknown>[]).map((s) => {
          const rawKind = String(s.kind ?? "");
          const kind =
            rawKind === "partnership"
              ? "partner_portal"
              : rawKind === "workshop"
                ? "school_portal"
                : rawKind;
          return {
            id: String(s.id),
            kind,
            email: String(s.email ?? ""),
            payload: (s.payload as Record<string, unknown>) || {},
            createdAt:
              typeof s.created_at === "string" ? s.created_at : new Date().toISOString(),
          };
        });
      },
      15_000
    ),

  deleteFormSubmission: (id: string | number): Promise<{ success: boolean }> =>
    executeMutation("DELETE", `/admin/form-submissions/${id}`, { id: String(id) }, async () => {
      const client = await sb();
      if (!client) {
        const { mockAdminFormSubmissions } = await loadMockData();
        const idx = mockAdminFormSubmissions.findIndex((x) => String(x.id) === String(id));
        if (idx !== -1) mockAdminFormSubmissions.splice(idx, 1);
        return { success: true };
      }
      const numId = Number(id);
      if (!Number.isFinite(numId)) return { success: true };
      const { error } = await client
        .from("form_submissions")
        .delete()
        .eq("id", numId);
      if (error) toApiError(error.message, 422, `/admin/form-submissions/${id}`, error);
      void logAudit("delete", `form_submissions/${id}`);
      return { success: true };
    }),

  uploadImage: (
    file: File,
    folder = "articles"
  ): Promise<{ ok: boolean; url: string; error?: string }> =>
    executeMutation("POST", "/admin/uploads", undefined, async () => {
      const client = await sb();
      if (!client) {
        const objectUrl = URL.createObjectURL(file);
        return { ok: true, url: objectUrl };
      }
      try {
        const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "") || "articles";
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
        const uniquePath = `${cleanFolder}/${Date.now()}-${slugId()}-${cleanName}`;

        const { data, error } = await client.storage.from("media").upload(uniquePath, file, {
          cacheControl: "31536000",
          upsert: true,
          contentType: file.type || "image/webp",
        });

        if (error) {
          return {
            ok: false,
            url: "",
            error: error.message || "تعذّر رفع الصورة إلى مساحة تخزين السيرفر.",
          };
        }

        const { data: pubData } = client.storage.from("media").getPublicUrl(data.path);
        const publicUrl = pubData.publicUrl;

        try {
          await client.from("uploads").insert({
            filename: file.name,
            url: publicUrl,
            content_type: file.type || "image/webp",
            size: file.size,
          });
        } catch {
          // non-blocking
        }

        return { ok: true, url: publicUrl };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "تعذّر رفع الصورة إلى السيرفر.";
        return { ok: false, url: "", error: msg };
      }
    }),

  sendAIChatMessage: (
    text: string,
    language: string
  ): Promise<{ success: boolean; reply: string }> =>
    executeMutation("POST", "/ai/chat", { prompt: text, language }, async () => ({
      success: true,
      reply: mockAIReply(text, language),
    })),
};

async function createContent(
  kind: string,
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const client = await sb();
  if (!client) {
    const id = slugId();
    return { id, ...payload } as Record<string, unknown>;
  }
  const id = slugId();
  const sanitized = sanitizePayload(payload);
  const dataWithId = { id, ...sanitized };
  const { data, error } = await client
    .from("content_items")
    .insert({ id, kind, data: dataWithId as unknown as Record<string, never> })
    .select("id,kind,data")
    .maybeSingle();
  if (error) toApiError(error.message, 422, `/admin/${kind}`, error);
  seededCheckCache = { checkedAt: Date.now(), hasRows: true };
  void logAudit("create", `${kind}/${id}`);
  const row = data as { id: string; data: Record<string, unknown> } | null;
  return { id: row?.id ?? id, ...(row?.data ?? dataWithId) } as Record<string, unknown>;
}

async function updateContent(
  kind: string,
  id: string,
  patch: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const client = await sb();
  if (!client) return { id, ...patch } as Record<string, unknown>;
  const { data: existing } = await client
    .from("content_items")
    .select("data")
    .eq("kind", kind)
    .eq("id", id)
    .maybeSingle();
  const base = ((existing as { data?: Record<string, unknown> } | null)?.data ?? {}) as Record<
    string,
    unknown
  >;
  const merged = { ...base, ...patch, id };
  const sanitized = sanitizePayload(merged);
  const { data, error } = await client
    .from("content_items")
    .upsert({ id, kind, data: sanitized as unknown as Record<string, never> }, { onConflict: "id" })
    .select("id,data")
    .maybeSingle();
  if (error) toApiError(error.message, 422, `/admin/${kind}/${id}`, error);
  seededCheckCache = { checkedAt: Date.now(), hasRows: true };
  void logAudit("update", `${kind}/${id}`);
  const row = data as { id: string; data: Record<string, unknown> } | null;
  if (!row) toApiError("Resource not found", 404, `/admin/${kind}/${id}`);
  return { id: row.id, ...(row.data ?? sanitized) } as Record<string, unknown>;
}

async function deleteContent(kind: string, id: string): Promise<{ success: boolean }> {
  const client = await sb();
  if (!client) return { success: true };
  const { error } = await client.from("content_items").delete().eq("kind", kind).eq("id", id);
  if (error) toApiError(error.message, 422, `/admin/${kind}/${id}`, error);
  void logAudit("delete", `${kind}/${id}`);
  return { success: true };
}

function sanitizePayload(payload: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (k === "image" && typeof v === "string") out[k] = sanitizeUrl(v);
    else out[k] = v;
  }
  return out;
}

function mockAIReply(text: string, language: string): string {
  const input = text.toLowerCase().trim();
  if (language === "ar") {
    if (input.includes("بصمة") || input.includes("كربون"))
      return "البصمة الكربونية هي إجمالي الانبعاثات الناتجة عن أنشطتنا. يمكنك استخدام 'حاسبة الكربون' في صفحة ألعاب المناخ لحساب بصمتك بدقة!";
    if (input.includes("شجر") || input.includes("زراعة") || input.includes("غاف"))
      return "نحن ننظم حملات لزراعة شجر الغاف في الإمارات لتعزيز التنوع البيئي.";
    if (input.includes("تطوع") || input.includes("فرص"))
      return "لدينا فرص للشباب مثل التدريب الداخلي والتطوع والزمالات المناخية.";
    return "سؤال رائع! العمل المناخي يبدأ بخطوات بسيطة كتقليل البلاستيك وترشيد الطاقة.";
  }
  if (input.includes("carbon") || input.includes("footprint"))
    return "Carbon footprint is the total emissions caused by our actions. Use our Carbon Calculator in the Games Hub!";
  if (input.includes("tree") || input.includes("plant"))
    return "We organize Ghaf tree planting campaigns across the UAE.";
  return "Great question! Climate action starts with daily habits: reducing plastic use and saving energy.";
}
