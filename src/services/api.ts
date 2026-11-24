import type {
  Program, Initiative, Event, Course, Game, Opportunity,
  BlogPost, TeamMember, AdminStats, AnalyticItem, ContactMessage,
  CareerNode, CarbonQuestion, UserProfileResponse, MutationResult,
  ContactSubmitDto, MeetingBookingDto, PartnershipSubmitDto, WorkshopRequestDto,
  EventRegistrationDto, OpportunityApplicationDto, Certificate,
  AdminUser, AdminEventRegistration, AdminFormSubmission
} from "../types";

import { ApiError, extractServerMessage } from "../lib/errors/ApiError";
export { ApiError, extractServerMessage };
import { isSupabaseConfigured } from "../lib/supabase/client";
import { certificateId, ticketCode } from "../lib/utils/ids";
import {
  DEFAULT_TTL_MS,
  apiMetrics,
  clearApiCache,
  executeCachedRead,
  executeMutation,
  loadMockData,
} from "./requestCoordinator";

export { apiMetrics, clearApiCache };

// ==========================================
// ⚙️ Configuration
// ==========================================

/** Base URL for the legacy REST API fallback. MUST include the /api prefix. */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api";

const isLocalhostUrl = (url: string) => /https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/i.test(url);
const isRemoteHost =
  typeof window !== "undefined" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1" &&
  window.location.hostname !== "::1";

const shouldForceMockForRemoteHost = isRemoteHost && isLocalhostUrl(API_BASE_URL);

/**
 * True ONLY when Supabase is NOT configured AND either mock mode is requested
 * or no remote REST backend URL is configured.
 * When `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY` are set on Vercel,
 * `isSupabaseConfigured` is `true` and `USE_MOCK_API` is strictly `false`.
 */
export const USE_MOCK_API =
  !isSupabaseConfigured &&
  (import.meta.env.VITE_USE_MOCK_API === "true" || shouldForceMockForRemoteHost);

/** Abort a request that the server has not answered within this many ms. */
const REQUEST_TIMEOUT_MS = 15000;

const MAX_MOCK_LOG_ITEMS = 2000;
function pushBounded<T>(arr: T[], item: T): void {
  arr.unshift(item);
  if (arr.length > MAX_MOCK_LOG_ITEMS) {
    arr.length = MAX_MOCK_LOG_ITEMS;
  }
}

// ==========================================
// 🔑 Helpers
// ==========================================

export function sanitizeUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  const collapsed = trimmed.split("").filter((ch) => ch.charCodeAt(0) > 32).join("").toLowerCase();
  const blocked = ["javascript:", "data:", "vbscript:", "file:"];
  if (blocked.some((scheme) => collapsed.startsWith(scheme))) {
    return "#invalid-url";
  }
  return trimmed;
}

function clientLanguage(): string {
  return (typeof document !== "undefined" && document.documentElement.getAttribute("lang")) || "ar";
}

function getToken(endpoint = ""): string | null {
  try {
    if (endpoint.startsWith("/user/")) {
      return localStorage.getItem("user_token") || null;
    }
    if (endpoint.startsWith("/admin/")) {
      return localStorage.getItem("admin_token") || null;
    }
    return localStorage.getItem("admin_token") || localStorage.getItem("user_token");
  } catch {
    return null;
  }
}

export function clearTokens(): void {
  try {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("user_token");
  } catch {
    // Storage blocked — auth_unauthorized event handles in-memory teardown.
  }
}

const AUTH_ENDPOINTS = ["/admin/login", "/admin/change-password", "/auth/login", "/auth/register"];

export async function authFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken(endpoint);
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };

  if (options.body !== undefined && headers["Content-Type"] === undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: options.signal ?? controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status === 401 && !AUTH_ENDPOINTS.includes(endpoint)) {
    clearTokens();
    window.dispatchEvent(new Event("auth_unauthorized"));
  }

  return response;
}

function unwrap<T>(json: unknown): T {
  if (json && typeof json === "object" && !Array.isArray(json)) {
    const obj = json as Record<string, unknown>;
    if ("data" in obj && "success" in obj) return obj.data as T;
  }
  return json as T;
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit,
  mock: () => T | Promise<T>
): Promise<T> {
  if (USE_MOCK_API) {
    return await mock();
  }

  let res: Response;
  try {
    res = await authFetch(endpoint, options);
  } catch (err) {
    throw new ApiError(`Network request to ${endpoint} failed`, 0, endpoint, err);
  }

  const body = await parseBody(res);

  if (!res.ok) {
    console.warn(`[API] Request to ${endpoint} failed with status ${res.status}.`);
    throw new ApiError(
      extractServerMessage(body) || `Request to ${endpoint} failed with status ${res.status}`,
      res.status,
      endpoint,
      body
    );
  }

  return unwrap<T>(body);
}

const GET = <T>(
  endpoint: string,
  mock: () => T | Promise<T>,
  ttlMs = DEFAULT_TTL_MS
): Promise<T> => executeCachedRead(endpoint, () => request<T>(endpoint, {}, mock), ttlMs);

const SEND = <T>(
  method: "POST" | "PUT" | "DELETE" | "PATCH",
  endpoint: string,
  data: unknown,
  mock: () => T | Promise<T>
): Promise<T> =>
  executeMutation(method, endpoint, data, () =>
    request<T>(
      endpoint,
      { method, ...(data === undefined ? {} : { body: JSON.stringify(data) }) },
      mock
    )
  );

const mockId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `mock-${Date.now()}`;

const okResult = (messageAr: string, extra?: Partial<MutationResult>): MutationResult => ({
  success: true,
  message: messageAr,
  ...extra,
});

const CANONICAL_TEAM_ORDER = [
  "mai-moawad",
  "abdullah-salmani",
  "marwa-shalwani",
  "heba-momtaz",
  "rowayyah-alhefeiti",
  "maysara-ezz",
  "ahmed-ashraf-kamel",
];

// In-memory state for Demo/Mock mode parity
const SETTINGS_STORAGE_KEY = "climatify-site-settings";
let mockSiteSettings = {
  siteName: "Climatify",
  contactEmail: "info@climatify-youth.com",
  enableMaintenance: false,
};
try {
  if (typeof window !== "undefined") {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<typeof mockSiteSettings>;
      mockSiteSettings = {
        siteName: typeof parsed.siteName === "string" && parsed.siteName ? parsed.siteName : "Climatify",
        contactEmail:
          typeof parsed.contactEmail === "string" && parsed.contactEmail
            ? parsed.contactEmail
            : "info@climatify-youth.com",
        enableMaintenance: Boolean(parsed.enableMaintenance),
      };
    }
  }
} catch {
  // ignore blocked localStorage
}

const mockCertificatesByCourse = new Map<string, Certificate>();
function getOrCreateMockCertificate(courseId: string): Certificate {
  const existing = mockCertificatesByCourse.get(courseId);
  if (existing) return existing;
  const cert: Certificate = {
    id: `cert-${courseId}`,
    certificateId: certificateId(courseId),
    courseId,
    userId: 1,
    issuedAt: new Date().toISOString(),
  };
  mockCertificatesByCourse.set(courseId, cert);
  return cert;
}

// ==========================================
// 🚀 Climatify API Service
// ==========================================

const baseApiService = {
  // ---------- Public reads ----------
  getPrograms: (): Promise<Program[]> =>
    GET("/programs", async () => [...(await loadMockData()).mockPrograms]),

  getProgramById: (id: string): Promise<Program | undefined> =>
    GET(`/programs/${id}`, async () => (await loadMockData()).mockPrograms.find((p) => p.id === id)),

  getInitiatives: (): Promise<Initiative[]> =>
    GET("/initiatives", async () => [...(await loadMockData()).mockInitiatives]),

  getEvents: (): Promise<Event[]> =>
    GET("/events", async () => [...(await loadMockData()).mockEvents]),

  getCourses: (): Promise<Course[]> =>
    GET("/courses", async () => [...(await loadMockData()).mockCourses]),

  getGames: (): Promise<Game[]> =>
    GET("/games", async () => [...(await loadMockData()).mockGames]),

  getOpportunities: (): Promise<Opportunity[]> =>
    GET("/opportunities", async () => [...(await loadMockData()).mockOpportunities]),

  getBlogPosts: (): Promise<BlogPost[]> =>
    executeCachedRead("/posts", async () => {
      const res = await request<BlogPost[]>(
        "/posts",
        {},
        async () => [...(await loadMockData()).mockBlogPosts]
      );
      const list = Array.isArray(res) ? res : (await loadMockData()).mockBlogPosts;
      return [...list].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    }),

  getBlogPostById: (id: string): Promise<BlogPost | undefined> =>
    executeCachedRead(`/posts/${id}`, async () => {
      const res = await request<BlogPost | undefined>(
        `/posts/${id}`,
        {},
        async () => (await loadMockData()).mockBlogPosts.find((p) => p.id === id)
      );
      if (res) return res;
      const { mockBlogPosts } = await loadMockData();
      return mockBlogPosts.find((p) => p.id === id);
    }),

  getTeam: (): Promise<TeamMember[]> =>
    executeCachedRead("/team", async () => {
      const res = await request<TeamMember[]>(
        "/team",
        {},
        async () => [...(await loadMockData()).mockTeam]
      );
      const list = Array.isArray(res) ? res : (await loadMockData()).mockTeam;
      return [...list].sort((a, b) => {
        const idxA = CANONICAL_TEAM_ORDER.indexOf(a.id);
        const idxB = CANONICAL_TEAM_ORDER.indexOf(b.id);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return 0;
      });
    }),

  getCareerPathways: (): Promise<CareerNode[]> =>
    GET("/careers", async () => [...(await loadMockData()).mockCareers]),

  getCarbonQuestions: (): Promise<CarbonQuestion[]> =>
    GET("/carbon-questions", async () => [...(await loadMockData()).mockCarbonQuestions]),

  getCurriculaDownloadUrl: (): Promise<{ url: string }> =>
    GET("/curricula/download", () => ({ url: "/climate-curriculum.pdf" })),

  getPublicSettings: (): Promise<{
    siteName: string;
    contactEmail: string;
    enableMaintenance: boolean;
  }> => GET("/settings", () => ({ ...mockSiteSettings }), 30_000),

  trackPageView: (path: string): Promise<{ success: boolean }> =>
    executeMutation("POST", "/analytics/pageview", undefined, async () => {
      void path;
      if (USE_MOCK_API) {
        return { success: true };
      }
      try {
        await authFetch("/analytics/pageview", {
          method: "POST",
          body: JSON.stringify({ path }),
        });
      } catch {
        // non-blocking
      }
      return { success: true };
    }),

  // ---------- Public form submissions ----------
  submitContact: (data: ContactSubmitDto): Promise<MutationResult> =>
    SEND("POST", "/contact", data, async () => {
      const { mockAdminMessages } = await loadMockData();
      pushBounded(mockAdminMessages, {
        id: mockId(),
        sender: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email.trim().toLowerCase(),
        subject: data.subject.trim(),
        message: data.message.trim(),
        date: new Date().toISOString().slice(0, 10),
        isRead: false,
      });
      return okResult("تم إرسال رسالتك بنجاح! سيتواصل معك فريق كلايمتيفاي قريباً.");
    }),

  bookMeeting: (data: MeetingBookingDto): Promise<MutationResult> =>
    SEND("POST", "/meetings", data, async () => {
      const { mockAdminFormSubmissions } = await loadMockData();
      pushBounded(mockAdminFormSubmissions, {
        id: mockId(),
        kind: "meeting",
        email: data.email.trim().toLowerCase(),
        payload: {
          organizer: data.name.trim(),
          topic: data.notes?.trim() || "Meeting Request",
          preferredDate: `${data.date} ${data.time}`,
        },
        createdAt: new Date().toISOString(),
      });
      return okResult("تم حجز الموعد بنجاح! سنرسل لك بريداً إلكترونياً بتفاصيل التأكيد.");
    }),

  submitPartnership: (data: PartnershipSubmitDto): Promise<MutationResult> =>
    SEND("POST", "/partnerships", data, async () => {
      const { mockAdminFormSubmissions } = await loadMockData();
      pushBounded(mockAdminFormSubmissions, {
        id: mockId(),
        kind: "partner_portal",
        email: data.email.trim().toLowerCase(),
        payload: {
          organizationName: data.orgName.trim(),
          representativeName: data.contactPerson.trim(),
          partnershipType: data.orgType,
          notes: data.proposal.trim(),
        },
        createdAt: new Date().toISOString(),
      });
      return okResult("تم إرسال طلب الشراكة بنجاح!");
    }),

  submitWorkshopRequest: (data: WorkshopRequestDto): Promise<MutationResult> =>
    SEND("POST", "/workshops", data, async () => {
      const { mockAdminFormSubmissions } = await loadMockData();
      pushBounded(mockAdminFormSubmissions, {
        id: mockId(),
        kind: "school_portal",
        email: data.email.trim().toLowerCase(),
        payload: {
          schoolName: data.institutionName.trim(),
          city: data.city.trim(),
          studentCount: data.studentCount,
          workshopType: data.workshopType,
        },
        createdAt: new Date().toISOString(),
      });
      return okResult("تم تسجيل طلب ورشة العمل بنجاح!");
    }),

  registerForEvent: (data: EventRegistrationDto): Promise<MutationResult> =>
    SEND("POST", "/events/register", data, async () => {
      const { mockEvents, mockAdminEventRegistrations } = await loadMockData();
      const normalizedEmail = data.email.trim().toLowerCase();
      const duplicate = mockAdminEventRegistrations.some(
        (r) =>
          r.eventId === data.eventId &&
          r.email.toLowerCase() === normalizedEmail &&
          r.status === "Confirmed"
      );
      if (duplicate) {
        throw new ApiError("هذا البريد مسجل بالفعل في الفعالية", 409, "/events/register");
      }
      const event = mockEvents.find((e) => e.id === data.eventId);
      if (event) event.registeredCount = (event.registeredCount || 0) + 1;
      const ticket = ticketCode();
      pushBounded(mockAdminEventRegistrations, {
        id: mockId(),
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
    }),

  applyToOpportunity: (data: OpportunityApplicationDto): Promise<MutationResult> =>
    SEND("POST", "/opportunities/apply", data, async () => {
      const { mockOpportunities, mockAdminFormSubmissions } = await loadMockData();
      const opp = mockOpportunities.find((o) => o.id === data.opportunityId);
      pushBounded(mockAdminFormSubmissions, {
        id: mockId(),
        kind: "opportunity_application",
        email: data.email.trim().toLowerCase(),
        payload: {
          opportunityTitle: opp ? `${opp.titleAr} / ${opp.titleEn}` : data.opportunityId,
          name: data.name.trim(),
          portfolio: sanitizeUrl(data.portfolio.trim()),
          coverLetter: data.coverLetter?.trim() || "",
        },
        createdAt: new Date().toISOString(),
      });
      return okResult("تم إرسال طلب التقديم بنجاح!");
    }),

  subscribeNewsletter: (email: string): Promise<MutationResult> => {
    const normalized = email.trim().toLowerCase();
    return SEND("POST", "/newsletter/subscribe", { email: normalized }, async () => {
      const { mockAdminFormSubmissions } = await loadMockData();
      const alreadyExists = mockAdminFormSubmissions.some(
        (s) => s.kind === "newsletter" && s.email.toLowerCase() === normalized
      );
      if (!alreadyExists) {
        pushBounded(mockAdminFormSubmissions, {
          id: mockId(),
          kind: "newsletter",
          email: normalized,
          payload: { source: "Footer Newsletter" },
          createdAt: new Date().toISOString(),
        });
      }
      return okResult("تم الاشتراك في النشرة الإخبارية بنجاح!");
    });
  },

  // ---------- Member profile ----------
  getUserProfile: (): Promise<UserProfileResponse> =>
    GET("/user/profile", async () => (await loadMockData()).mockUserProfile, 15_000),

  updateUserProfile: (data: { name: string; city: string; bio: string }): Promise<MutationResult> =>
    SEND("PUT", "/user/profile", data, () => okResult("تم تحديث الملف الشخصي بنجاح!")),

  saveCarbonFootprint: (footprint: number): Promise<MutationResult> =>
    SEND("POST", "/user/carbon-footprint", { footprint }, () => okResult("تم حفظ النتيجة بنجاح!")),

  getCourseLessons: (courseId: string): Promise<unknown[]> =>
    GET(`/courses/${courseId}/lessons`, () => []),

  saveCourseProgress: (courseId: string, progress: number): Promise<MutationResult> =>
    SEND("POST", `/user/courses/${courseId}/progress`, { progress }, () => {
      if (progress >= 100) getOrCreateMockCertificate(courseId);
      return okResult("تم حفظ التقدم بنجاح!");
    }),

  addUserEvent: (eventId: string): Promise<MutationResult> =>
    SEND("POST", "/user/events", { eventId }, () =>
      okResult("تمت إضافة الفعالية بنجاح!", { ticketCode: ticketCode() })
    ),

  cancelUserEvent: (eventId: string): Promise<MutationResult> =>
    SEND("DELETE", `/user/events/${eventId}`, undefined, () => okResult("تم إلغاء التسجيل بنجاح!")),

  saveVirtualTrees: (count: number, costPoints = 40): Promise<MutationResult> =>
    SEND("POST", "/user/trees", { count, costPoints }, () => okResult("تم حفظ عدد الأشجار بنجاح!")),

  getImpactHistory: (year?: number): Promise<unknown> =>
    GET(`/user/impact${year ? `?year=${year}` : ""}`, () => ({ history: [] }), 15_000),

  getBookmarks: (): Promise<unknown[]> => GET("/user/bookmarks", () => [], 15_000),

  addBookmark: (contentType: string, contentId: string): Promise<unknown> =>
    SEND("POST", "/user/bookmarks", { contentType, contentId }, () => ({ success: true })),

  deleteBookmark: (bookmarkId: string): Promise<MutationResult> =>
    SEND("DELETE", `/user/bookmarks/${bookmarkId}`, undefined, () => okResult("تم حذف العلامة بنجاح!")),

  // ---------- Certificates ----------
  getCertificates: (): Promise<Certificate[]> =>
    GET("/user/certificates", () => Array.from(mockCertificatesByCourse.values()), 15_000),

  getCertificate: (courseId: string): Promise<Certificate> =>
    GET(`/user/certificates/${courseId}`, () => getOrCreateMockCertificate(courseId), 15_000),

  issueCertificate: (courseId: string): Promise<Certificate> =>
    SEND("POST", `/user/courses/${courseId}/certificate`, { courseId }, () =>
      getOrCreateMockCertificate(courseId)
    ),

  // ---------- Admin auth ----------
  loginAdmin: (
    email: string,
    password: string
  ): Promise<{ success: boolean; token?: string; error?: string }> =>
    executeMutation("POST", "/admin/login", undefined, async () => {
      if (USE_MOCK_API) {
        return { success: true, token: "mock-jwt-token-xyz" };
      }

      let res: Response;
      try {
        res = await authFetch("/admin/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
      } catch (err) {
        throw new ApiError("Network request to /admin/login failed", 0, "/admin/login", err);
      }

      const body = await parseBody(res);

      if (res.ok) {
        const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
        const token = typeof payload.token === "string" ? payload.token : undefined;
        if (token) return { success: true, token };
        throw new ApiError("Admin login response did not include a token", 500, "/admin/login", body);
      }

      const ar = clientLanguage() === "ar";
      const invalidCredentials = ar
        ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
        : "Invalid email or password.";
      if (res.status === 400 || res.status === 401 || res.status === 422) {
        return { success: false, error: extractServerMessage(body) || invalidCredentials };
      }
      throw new ApiError(
        extractServerMessage(body) || `Admin login failed with status ${res.status}`,
        res.status,
        "/admin/login",
        body
      );
    }),

  changeAdminPassword: (data: { currentPassword: string; newPassword: string }): Promise<MutationResult> =>
    SEND("POST", "/admin/change-password", undefined, () => {
      void data;
      return okResult("تم تحديث كلمة المرور بنجاح!");
    }),

  // ---------- Member auth ----------
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
      if (USE_MOCK_API) {
        if (!data.email.includes("@") || data.password.length < 6) {
          return {
            success: false,
            error:
              clientLanguage() === "ar"
                ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
                : "That email or password is not valid",
          };
        }
        const { mockAdminUsers } = await loadMockData();
        const existing = mockAdminUsers.find(
          (u) => u.email.toLowerCase() === data.email.toLowerCase()
        );
        if (!existing) {
          pushBounded(mockAdminUsers, {
            id: mockId(),
            email: data.email,
            name: data.name,
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

      let res: Response;
      try {
        res = await authFetch("/auth/register", { method: "POST", body: JSON.stringify(data) });
      } catch (err) {
        throw new ApiError("Network request to /auth/register failed", 0, "/auth/register", err);
      }

      const body = await parseBody(res);

      if (res.ok) {
        const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
        const token = typeof payload.token === "string" ? payload.token : undefined;
        if (!token) {
          throw new ApiError(
            "Member registration response did not include a token",
            500,
            "/auth/register",
            body
          );
        }
        clearApiCache("/user");
        return { success: true, token };
      }

      if (res.status === 409 || res.status === 422 || res.status === 400) {
        const ar = clientLanguage() === "ar";
        return {
          success: false,
          error:
            extractServerMessage(body) ||
            (ar
              ? "البريد الإلكتروني مستخدم بالفعل أو كلمة المرور ضعيفة جداً"
              : "That email is already registered or the password is too weak"),
        };
      }
      throw new ApiError(
        extractServerMessage(body) || `Registration failed with status ${res.status}`,
        res.status,
        "/auth/register",
        body
      );
    }),

  loginMember: (
    email: string,
    password: string
  ): Promise<{ success: boolean; token?: string; error?: string }> =>
    executeMutation("POST", "/auth/login", undefined, async () => {
      if (USE_MOCK_API) {
        if (email.includes("@") && password.length >= 4) {
          return { success: true, token: "mock-member-token-xyz" };
        }
        return {
          success: false,
          error:
            clientLanguage() === "ar"
              ? "بريد إلكتروني أو كلمة مرور غير صحيحة"
              : "Incorrect email or password",
        };
      }

      let res: Response;
      try {
        res = await authFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
      } catch (err) {
        throw new ApiError("Network request to /auth/login failed", 0, "/auth/login", err);
      }

      const body = await parseBody(res);
      const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
      const token = typeof payload.token === "string" ? payload.token : undefined;

      if (res.ok && token) {
        clearApiCache("/user");
        return { success: true, token };
      }
      if (res.status === 401 || res.status === 400 || res.status === 422) {
        const ar = clientLanguage() === "ar";
        return {
          success: false,
          error:
            extractServerMessage(body) ||
            (ar ? "بريد إلكتروني أو كلمة مرور غير صحيحة" : "Incorrect email or password"),
        };
      }
      throw new ApiError(
        extractServerMessage(body) || `Login failed with status ${res.status}`,
        res.status,
        "/auth/login",
        body
      );
    }),

  // ---------- Admin dashboard ----------
  getAdminStats: (): Promise<AdminStats> =>
    GET("/admin/stats", async () => (await loadMockData()).mockAdminStats, 15_000),

  getAdminAnalytics: (): Promise<AnalyticItem[]> =>
    GET("/admin/analytics", async () => [...(await loadMockData()).mockAdminAnalytics], 15_000),

  getAdminMessages: (): Promise<ContactMessage[]> =>
    GET("/admin/messages", async () => [...(await loadMockData()).mockAdminMessages], 15_000),

  markMessageRead: (id: string, isRead: boolean = true): Promise<{ success: boolean }> =>
    SEND("PUT", `/admin/messages/${id}/read`, { isRead }, () => ({ success: true })),

  deleteMessage: (id: string): Promise<{ success: boolean }> =>
    SEND("DELETE", `/admin/messages/${id}`, undefined, () => ({ success: true })),

  saveAdminSettings: (data: {
    siteName: string;
    contactEmail: string;
    enableMaintenance: boolean;
  }): Promise<{ success: boolean }> =>
    SEND("POST", "/admin/settings", data, () => {
      mockSiteSettings = {
        siteName: data.siteName.trim() || "Climatify",
        contactEmail: data.contactEmail.trim() || "info@climatify-youth.com",
        enableMaintenance: Boolean(data.enableMaintenance),
      };
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(mockSiteSettings));
        }
      } catch {
        // ignore blocked storage
      }
      return { success: true };
    }),

  getAdminSettings: (): Promise<{
    siteName: string;
    contactEmail: string;
    enableMaintenance: boolean;
  }> => GET("/admin/settings", () => ({ ...mockSiteSettings }), 30_000),

  // ---------- Admin CMS CRUD ----------
  createEvent: (data: Omit<Event, "id" | "registeredCount">): Promise<Event> =>
    SEND("POST", "/admin/events", data, async () => {
      const created: Event = { id: mockId(), registeredCount: 0, ...data };
      const { mockEvents } = await loadMockData();
      mockEvents.unshift(created);
      return created;
    }),

  updateEvent: (id: string, data: Partial<Event>): Promise<Event> =>
    SEND("PUT", `/admin/events/${id}`, data, async () => {
      const { mockEvents } = await loadMockData();
      const idx = mockEvents.findIndex((e) => e.id === id);
      if (idx !== -1 && mockEvents[idx]) {
        mockEvents[idx] = { ...mockEvents[idx]!, ...data, id };
        return mockEvents[idx]!;
      }
      return { id, registeredCount: 0, ...data } as Event;
    }),

  deleteEvent: (id: string): Promise<{ success: boolean }> =>
    SEND("DELETE", `/admin/events/${id}`, undefined, async () => {
      const { mockEvents } = await loadMockData();
      const idx = mockEvents.findIndex((e) => e.id === id);
      if (idx !== -1) mockEvents.splice(idx, 1);
      return { success: true };
    }),

  createBlogPost: (data: Omit<BlogPost, "id">): Promise<BlogPost> =>
    SEND("POST", "/admin/posts", data, async () => {
      const created: BlogPost = { id: mockId(), ...data };
      const { mockBlogPosts } = await loadMockData();
      mockBlogPosts.unshift(created);
      return created;
    }),

  updateBlogPost: (id: string, data: Partial<BlogPost>): Promise<BlogPost> =>
    SEND("PUT", `/admin/posts/${id}`, data, async () => {
      const { mockBlogPosts } = await loadMockData();
      const idx = mockBlogPosts.findIndex((p) => p.id === id);
      if (idx !== -1 && mockBlogPosts[idx]) {
        mockBlogPosts[idx] = { ...mockBlogPosts[idx]!, ...data, id };
        return mockBlogPosts[idx]!;
      }
      return { id, ...data } as BlogPost;
    }),

  deleteBlogPost: (id: string): Promise<{ success: boolean }> =>
    SEND("DELETE", `/admin/posts/${id}`, undefined, async () => {
      const { mockBlogPosts } = await loadMockData();
      const idx = mockBlogPosts.findIndex((p) => p.id === id);
      if (idx !== -1) mockBlogPosts.splice(idx, 1);
      return { success: true };
    }),

  createProgram: (data: Omit<Program, "id">): Promise<Program> =>
    SEND("POST", "/admin/programs", data, async () => {
      const created: Program = { id: mockId(), ...data };
      const { mockPrograms } = await loadMockData();
      mockPrograms.push(created);
      return created;
    }),

  updateProgram: (id: string, data: Partial<Program>): Promise<Program> =>
    SEND("PUT", `/admin/programs/${id}`, data, async () => {
      const { mockPrograms } = await loadMockData();
      const idx = mockPrograms.findIndex((p) => p.id === id);
      if (idx !== -1 && mockPrograms[idx]) {
        mockPrograms[idx] = { ...mockPrograms[idx]!, ...data, id };
        return mockPrograms[idx]!;
      }
      return { id, ...data } as Program;
    }),

  deleteProgram: (id: string): Promise<{ success: boolean }> =>
    SEND("DELETE", `/admin/programs/${id}`, undefined, async () => {
      const { mockPrograms } = await loadMockData();
      const idx = mockPrograms.findIndex((p) => p.id === id);
      if (idx !== -1) mockPrograms.splice(idx, 1);
      return { success: true };
    }),

  createInitiative: (data: Omit<Initiative, "id">): Promise<Initiative> =>
    SEND("POST", "/admin/initiatives", data, async () => {
      const created: Initiative = { id: mockId(), ...data };
      const { mockInitiatives } = await loadMockData();
      mockInitiatives.push(created);
      return created;
    }),

  updateInitiative: (id: string, data: Partial<Initiative>): Promise<Initiative> =>
    SEND("PUT", `/admin/initiatives/${id}`, data, async () => {
      const { mockInitiatives } = await loadMockData();
      const idx = mockInitiatives.findIndex((i) => i.id === id);
      if (idx !== -1 && mockInitiatives[idx]) {
        mockInitiatives[idx] = { ...mockInitiatives[idx]!, ...data, id };
        return mockInitiatives[idx]!;
      }
      return { id, ...data } as Initiative;
    }),

  deleteInitiative: (id: string): Promise<{ success: boolean }> =>
    SEND("DELETE", `/admin/initiatives/${id}`, undefined, async () => {
      const { mockInitiatives } = await loadMockData();
      const idx = mockInitiatives.findIndex((i) => i.id === id);
      if (idx !== -1) mockInitiatives.splice(idx, 1);
      return { success: true };
    }),

  createCourse: (data: Omit<Course, "id">): Promise<Course> =>
    SEND("POST", "/admin/courses", data, async () => {
      const created: Course = { id: mockId(), ...data };
      const { mockCourses } = await loadMockData();
      mockCourses.push(created);
      return created;
    }),

  updateCourse: (id: string, data: Partial<Course>): Promise<Course> =>
    SEND("PUT", `/admin/courses/${id}`, data, async () => {
      const { mockCourses } = await loadMockData();
      const idx = mockCourses.findIndex((c) => c.id === id);
      if (idx !== -1 && mockCourses[idx]) {
        mockCourses[idx] = { ...mockCourses[idx]!, ...data, id };
        return mockCourses[idx]!;
      }
      return { id, ...data } as Course;
    }),

  deleteCourse: (id: string): Promise<{ success: boolean }> =>
    SEND("DELETE", `/admin/courses/${id}`, undefined, async () => {
      const { mockCourses } = await loadMockData();
      const idx = mockCourses.findIndex((c) => c.id === id);
      if (idx !== -1) mockCourses.splice(idx, 1);
      return { success: true };
    }),

  createOpportunity: (data: Omit<Opportunity, "id">): Promise<Opportunity> =>
    SEND("POST", "/admin/opportunities", data, async () => {
      const created: Opportunity = { id: mockId(), ...data };
      const { mockOpportunities } = await loadMockData();
      mockOpportunities.unshift(created);
      return created;
    }),

  updateOpportunity: (id: string, data: Partial<Opportunity>): Promise<Opportunity> =>
    SEND("PUT", `/admin/opportunities/${id}`, data, async () => {
      const { mockOpportunities } = await loadMockData();
      const idx = mockOpportunities.findIndex((o) => o.id === id);
      if (idx !== -1 && mockOpportunities[idx]) {
        mockOpportunities[idx] = { ...mockOpportunities[idx]!, ...data, id };
        return mockOpportunities[idx]!;
      }
      return { id, ...data } as Opportunity;
    }),

  deleteOpportunity: (id: string): Promise<{ success: boolean }> =>
    SEND("DELETE", `/admin/opportunities/${id}`, undefined, async () => {
      const { mockOpportunities } = await loadMockData();
      const idx = mockOpportunities.findIndex((o) => o.id === id);
      if (idx !== -1) mockOpportunities.splice(idx, 1);
      return { success: true };
    }),

  createTeamMember: (data: Omit<TeamMember, "id">): Promise<TeamMember> =>
    SEND("POST", "/admin/team", data, async () => {
      const created: TeamMember = { id: mockId(), ...data };
      const { mockTeam } = await loadMockData();
      mockTeam.push(created);
      return created;
    }),

  updateTeamMember: (id: string, data: Partial<TeamMember>): Promise<TeamMember> =>
    SEND("PUT", `/admin/team/${id}`, data, async () => {
      const { mockTeam } = await loadMockData();
      const idx = mockTeam.findIndex((t) => t.id === id);
      if (idx !== -1 && mockTeam[idx]) {
        mockTeam[idx] = { ...mockTeam[idx]!, ...data, id };
        return mockTeam[idx]!;
      }
      return { id, ...data } as TeamMember;
    }),

  deleteTeamMember: (id: string): Promise<{ success: boolean }> =>
    SEND("DELETE", `/admin/team/${id}`, undefined, async () => {
      const { mockTeam } = await loadMockData();
      const idx = mockTeam.findIndex((t) => t.id === id);
      if (idx !== -1) mockTeam.splice(idx, 1);
      return { success: true };
    }),

  // ---------- Admin Users / Members ----------
  getAdminUsers: (): Promise<AdminUser[]> =>
    GET("/admin/users", async () => [...(await loadMockData()).mockAdminUsers], 15_000),

  createAdminUser: (data: Omit<AdminUser, "id" | "createdAt">): Promise<AdminUser> =>
    SEND("POST", "/admin/users", data, async () => {
      const { mockAdminUsers } = await loadMockData();
      const newUser: AdminUser = {
        id: mockId(),
        createdAt: new Date().toISOString(),
        status: "active",
        ecoPoints: 0,
        virtualTrees: 0,
        ...data,
      };
      pushBounded(mockAdminUsers, newUser);
      return newUser;
    }),

  updateAdminUserRole: (id: string, role: AdminUser["role"]): Promise<{ success: boolean }> =>
    SEND("PATCH", `/admin/users/${id}/role`, { role }, async () => {
      const { mockAdminUsers } = await loadMockData();
      const u = mockAdminUsers.find((x) => x.id === id);
      if (u) u.role = role;
      return { success: true };
    }),

  updateAdminUserStatus: (id: string, status: "active" | "suspended"): Promise<{ success: boolean }> =>
    SEND("PATCH", `/admin/users/${id}/status`, { status }, async () => {
      const { mockAdminUsers } = await loadMockData();
      const u = mockAdminUsers.find((x) => x.id === id);
      if (u) u.status = status;
      return { success: true };
    }),

  deleteAdminUser: (id: string): Promise<{ success: boolean }> =>
    SEND("DELETE", `/admin/users/${id}`, undefined, async () => {
      const { mockAdminUsers } = await loadMockData();
      const idx = mockAdminUsers.findIndex((x) => x.id === id);
      if (idx !== -1) mockAdminUsers.splice(idx, 1);
      return { success: true };
    }),

  // ---------- Admin Event Registrations ----------
  getAdminEventRegistrations: (): Promise<AdminEventRegistration[]> =>
    GET("/admin/event-registrations", async () => [...(await loadMockData()).mockAdminEventRegistrations], 15_000),

  updateEventRegistrationStatus: (
    id: string | number,
    status: AdminEventRegistration["status"]
  ): Promise<{ success: boolean }> =>
    SEND("PATCH", `/admin/event-registrations/${id}/status`, { status }, async () => {
      const { mockAdminEventRegistrations } = await loadMockData();
      const reg = mockAdminEventRegistrations.find((x) => String(x.id) === String(id));
      if (reg) reg.status = status;
      return { success: true };
    }),

  deleteEventRegistration: (id: string | number): Promise<{ success: boolean }> =>
    SEND("DELETE", `/admin/event-registrations/${id}`, undefined, async () => {
      const { mockAdminEventRegistrations } = await loadMockData();
      const idx = mockAdminEventRegistrations.findIndex((x) => String(x.id) === String(id));
      if (idx !== -1) mockAdminEventRegistrations.splice(idx, 1);
      return { success: true };
    }),

  // ---------- Admin Form Submissions ----------
  getAdminFormSubmissions: (): Promise<AdminFormSubmission[]> =>
    GET("/admin/form-submissions", async () => [...(await loadMockData()).mockAdminFormSubmissions], 15_000),

  deleteFormSubmission: (id: string | number): Promise<{ success: boolean }> =>
    SEND("DELETE", `/admin/form-submissions/${id}`, undefined, async () => {
      const { mockAdminFormSubmissions } = await loadMockData();
      const idx = mockAdminFormSubmissions.findIndex((x) => String(x.id) === String(id));
      if (idx !== -1) mockAdminFormSubmissions.splice(idx, 1);
      return { success: true };
    }),

  uploadImage: (
    file: File,
    folder = "articles"
  ): Promise<{ ok: boolean; url: string; error?: string }> =>
    executeMutation("POST", "/admin/uploads", undefined, async () => {
      void folder;
      const objectUrl = URL.createObjectURL(file);
      return { ok: true, url: objectUrl };
    }),

  // ---------- AI assistant ----------
  sendAIChatMessage: (text: string, language: string): Promise<{ success: boolean; reply: string }> =>
    SEND("POST", "/ai/chat", { prompt: text, language }, () => ({
      success: true,
      reply: mockAIReply(text, language),
    })),
};

let _supabaseServicePromise: Promise<typeof import("./supabaseApi")["supabaseService"]> | null = null;
function loadSupabaseService() {
  if (!_supabaseServicePromise) {
    _supabaseServicePromise = import("./supabaseApi").then((m) => m.supabaseService);
  }
  return _supabaseServicePromise;
}

/**
 * Unified API Facade:
 * When Supabase is configured (`VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`),
 * calls dynamically import `supabaseApi` on first invocation — keeping `@supabase/supabase-js`
 * and `supabaseApi.ts` completely out of the synchronous initial bundle!
 */
export const apiService: typeof baseApiService = new Proxy(baseApiService, {
  get(target, prop, receiver) {
    if (isSupabaseConfigured && typeof prop === "string" && prop in target) {
      return async (...args: unknown[]) => {
        const svc = await loadSupabaseService();
        const fn = (svc as Record<string, unknown>)[prop];
        if (typeof fn === "function") {
          return (fn as (...a: unknown[]) => unknown).apply(svc, args);
        }
        return (Reflect.get(target, prop, receiver) as (...a: unknown[]) => unknown)(...args);
      };
    }
    return Reflect.get(target, prop, receiver);
  },
});

function mockAIReply(text: string, language: string): string {
  const input = text.toLowerCase().trim();
  if (language === "ar") {
    if (input.includes("بصمة") || input.includes("كربون"))
      return "البصمة الكربونية هي إجمالي الانبعاثات الناتجة عن أنشطتنا. يمكنك استخدام 'حاسبة الكربون' في صفحة ألعاب المناخ لحساب بصمتك بدقة والحصول على خطة خفض مخصصة!";
    if (input.includes("شجر") || input.includes("زراعة") || input.includes("غاف"))
      return "نحن ننظم حملات لزراعة شجر الغاف في الإمارات لتعزيز التنوع البيئي ومكافحة التصحر. يمكنك التطوع في حملاتنا القادمة من خلال صفحة الفعاليات!";
    if (input.includes("تطوع") || input.includes("فرص") || input.includes("عمل"))
      return "لدينا العديد من الفرص للشباب مثل التدريب الداخلي، التطوع، والزمالات المناخية. يمكنك تصفحها والتقديم عليها مباشرة من خلال قسم الفرص بالموقع!";
    if (input.includes("مسابقة") || input.includes("ألعاب"))
      return "ألعاب المناخ لدينا تشمل AgriClash — لعبة جماعية تعليمية عن الزراعة المستدامة والأمن الغذائي تُقام ضمن فعالياتنا — إضافة إلى محاكي حساب البصمة ولعبة زراعة الغاف التفاعلية. العبها لتجميع النقاط والحصول على شهادات معتمدة!";
    return "سؤال رائع! العمل المناخي يبدأ بخطوات يومية بسيطة مثل تقليل البلاستيك، ترشيد الطاقة، ونشر الوعي. يمكنك استكشاف أكاديمية المناخ بالموقع لتعلم المزيد بالتفصيل.";
  }

  if (input.includes("carbon") || input.includes("footprint"))
    return "A carbon footprint is the total greenhouse gas emissions caused by our actions. Use our 'Carbon Calculator' in the Games Hub to calculate yours and get a reduction plan!";
  if (input.includes("tree") || input.includes("plant") || input.includes("ghaf"))
    return "We organize Ghaf tree planting campaigns across the UAE to boost biodiversity and combat desertification. Join our upcoming drives via the Events page!";
  if (input.includes("volunteer") || input.includes("opportunity") || input.includes("job"))
    return "We offer various youth opportunities including internships, volunteering, and fellowships. Browse and apply directly on our Opportunities page!";
  if (input.includes("game") || input.includes("quiz"))
    return "Our Climate Games Hub features AgriClash — a collaborative educational game on sustainable agriculture and food security played at our events — alongside the Carbon Simulator and our interactive Ghaf-planting activity. Play to earn eco-points and verified certificates!";
  return "Great question! Climate action starts with daily habits: reducing single-use plastics, saving energy, and spreading awareness. Check out our Learning Hub for structured courses!";
}
