import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware";
import { apiService, ApiError, clearApiCache, USE_MOCK_API } from "../services/api";
import { isSupabaseConfigured, loadSupabase } from "../lib/supabase/client";
import type {
  EventRegistrationAttendee,
  MemberAuthResult,
  StoreActionResult,
  UserActivity,
  UserCourse,
  UserEvent,
  UserProfile,
  UserStats
} from "../types";

// ==========================================
// 🔒 Storage that can never throw
// ==========================================

const memoryFallback = new Map<string, string>();

function safeGet(name: string): string | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(name);
  } catch {
    return memoryFallback.get(name) ?? null;
  }
}

function safeSet(name: string, value: string): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(name, value);
  } catch {
    memoryFallback.set(name, value);
  }
}

function safeRemove(name: string): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(name);
  } catch {
    memoryFallback.delete(name);
  }
}

const safeStorage: StateStorage = {
  getItem: safeGet,
  setItem: safeSet,
  removeItem: safeRemove
};

const readToken = safeGet;
const writeToken = safeSet;
const dropToken = safeRemove;

// ==========================================
// 🎫 Token validity
// ==========================================

function decodeJwtExp(token: string): number | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const payload = parts[1];
  if (!payload) return null;
  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const parsed: unknown = JSON.parse(atob(padded));
    if (!parsed || typeof parsed !== "object") return null;
    const exp = (parsed as Record<string, unknown>).exp;
    return typeof exp === "number" && Number.isFinite(exp) ? exp : null;
  } catch {
    return null;
  }
}

/**
 * Only a non-expired 3-part JWT counts as a live session token in production.
 * Mock tokens (`mock-*` / `mock_*`) are accepted strictly when Supabase is NOT configured
 * and `USE_MOCK_API` is active, preventing localStorage token spoofing in production.
 */
function isTokenUsable(token: string | null): boolean {
  if (!token) return false;
  if (
    !isSupabaseConfigured &&
    USE_MOCK_API &&
    (token === "mock-jwt-token-xyz" || token.startsWith("mock-") || token.startsWith("mock_"))
  ) {
    return true;
  }
  const exp = decodeJwtExp(token);
  if (exp === null) return false;
  return exp * 1000 > Date.now();
}

// ==========================================
// 📡 Singleton auth lifecycle bridge
// ==========================================

let authSubscriberCount = 0;
let sharedTeardown: (() => void) | null = null;

// ==========================================
// 🧮 Merge helpers — local progress must survive a profile load
// ==========================================

const MAX_ACTIVITIES = 20;

const ZERO_STATS: UserStats = { ecoPoints: 0, virtualTrees: 0, earnedBadges: 0 };

const num = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

function mergeStats(
  local: UserStats | null,
  server: UserStats | null | undefined,
  spentEcoPoints: number
): UserStats {
  const s: UserStats = {
    ecoPoints: num(server?.ecoPoints),
    virtualTrees: num(server?.virtualTrees),
    earnedBadges: num(server?.earnedBadges)
  };
  if (isSupabaseConfigured) {
    // On Supabase, atomic server RPCs own point deductions and rewards.
    if (!local) return s;
    return {
      ecoPoints: s.ecoPoints,
      virtualTrees: Math.max(num(local.virtualTrees), s.virtualTrees),
      earnedBadges: Math.max(num(local.earnedBadges), s.earnedBadges)
    };
  }
  const adjustedServerPoints = Math.max(0, s.ecoPoints - Math.max(0, num(spentEcoPoints)));
  if (!local) {
    return { ...s, ecoPoints: adjustedServerPoints };
  }
  return {
    ecoPoints: Math.max(num(local.ecoPoints), adjustedServerPoints),
    virtualTrees: Math.max(num(local.virtualTrees), s.virtualTrees),
    earnedBadges: Math.max(num(local.earnedBadges), s.earnedBadges)
  };
}

function mergeById<T extends { id: string }>(local: T[], server: T[]): T[] {
  const byId = new Map<string, T>();
  for (const item of local) {
    if (item && typeof item.id === "string") byId.set(item.id, item);
  }
  for (const item of server) {
    if (item && typeof item.id === "string") {
      const prev = byId.get(item.id);
      byId.set(item.id, prev ? { ...prev, ...item } : item);
    }
  }
  return Array.from(byId.values());
}

function mergeCourses(local: UserCourse[], server: UserCourse[]): UserCourse[] {
  const localById = new Map(local.filter((c) => c && typeof c.id === "string").map((c) => [c.id, c]));
  const merged = mergeById(local, server);
  return merged.map((course) => {
    const localCourse = localById.get(course.id);
    if (!localCourse) return course;
    return { ...course, progress: Math.max(num(course.progress), num(localCourse.progress)) };
  });
}

function mergeActivities(local: UserActivity[], server: UserActivity[]): UserActivity[] {
  const seen = new Set<string>();
  const merged: UserActivity[] = [];
  for (const activity of [...local, ...server]) {
    if (!activity || typeof activity.id !== "string" || seen.has(activity.id)) continue;
    seen.add(activity.id);
    merged.push(activity);
  }
  return merged.slice(0, MAX_ACTIVITIES);
}

let activitySeq = 0;
const activityId = (): string => `act-${Date.now()}-${(activitySeq += 1)}`;

const pushActivity = (list: UserActivity[], activity: UserActivity): UserActivity[] =>
  [activity, ...list].slice(0, MAX_ACTIVITIES);

const currentLanguage = (): string =>
  (typeof document !== "undefined" && document.documentElement.getAttribute("lang")) || "ar";

function toMessage(err: unknown, fallbackAr: string, fallbackEn: string): string {
  const language = currentLanguage();
  if (err instanceof ApiError) return err.localizedMessage(language);
  return language === "ar" ? fallbackAr : fallbackEn;
}

// ==========================================
// 🗃️ Store
// ==========================================

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  adminEmail: string | null;
  isMemberAuthenticated: boolean;
  memberToken: string | null;
  demoSignedOut: boolean;
  profile: UserProfile | null;
  stats: UserStats | null;
  spentEcoPoints: number;
  recentActivities: UserActivity[];
  registeredCourses: UserCourse[];
  registeredEvents: UserEvent[];
  completedCourseIds: string[];
  carbonCreditAwarded: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  loginAdmin: (email: string, password: string) => Promise<MemberAuthResult>;
  logoutAdmin: () => void;
  registerMember: (data: { name: string; email: string; password: string }) => Promise<MemberAuthResult>;
  loginMember: (email: string, password: string) => Promise<MemberAuthResult>;
  logoutMember: () => void;
  loadUserProfile: () => Promise<void>;
  updateUserProfile: (data: { name: string; city: string; bio: string }) => Promise<boolean>;
  saveCarbonFootprint: (footprint: number) => Promise<boolean>;
  registerForEvent: (
    event: { id: string; titleAr: string; titleEn: string; date: string },
    attendee: EventRegistrationAttendee
  ) => Promise<StoreActionResult>;
  cancelEventRegistration: (eventId: string) => void;
  updateCourseProgress: (
    courseId: string,
    titleAr: string,
    titleEn: string,
    progress: number
  ) => Promise<void>;
  plantVirtualTree: (treeNameAr: string, treeNameEn: string, costPoints: number) => boolean;
  initializeAuth: () => () => void;
  clearError: () => void;
}

type PersistedAuthState = Pick<
  AuthState,
  | "stats"
  | "spentEcoPoints"
  | "recentActivities"
  | "registeredCourses"
  | "registeredEvents"
  | "completedCourseIds"
  | "carbonCreditAwarded"
>;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      adminEmail: null,
      isMemberAuthenticated: false,
      memberToken: null,
      demoSignedOut: false,
      profile: null,
      stats: null,
      spentEcoPoints: 0,
      recentActivities: [],
      registeredCourses: [],
      registeredEvents: [],
      completedCourseIds: [],
      carbonCreditAwarded: false,
      loading: false,
      error: null,

      clearError: () => set({ error: null }),

      initializeAuth: () => {
        // Hydrate valid synchronous tokens first
        const adminToken = readToken("admin_token");
        if (isTokenUsable(adminToken)) {
          set({ isAuthenticated: true, token: adminToken });
        } else if (adminToken && !isSupabaseConfigured) {
          dropToken("admin_token");
          set({ isAuthenticated: false, token: null });
        }

        const memberToken = readToken("user_token");
        if (isTokenUsable(memberToken)) {
          set({ isMemberAuthenticated: true, memberToken, demoSignedOut: false });
        } else if (memberToken && !isSupabaseConfigured) {
          dropToken("user_token");
          set({ isMemberAuthenticated: false, memberToken: null });
        }

        authSubscriberCount += 1;
        if (!sharedTeardown) {
          let cancelled = false;
          let supaUnsub: (() => void) | null = null;

          const onUnauthorized = () => {
            clearApiCache();
            dropToken("admin_token");
            dropToken("user_token");
            set({
              isAuthenticated: false,
              token: null,
              adminEmail: null,
              isMemberAuthenticated: false,
              memberToken: null,
              profile: null
            });
          };

          if (typeof window !== "undefined") {
            window.addEventListener("auth_unauthorized", onUnauthorized);
          }

          if (isSupabaseConfigured) {
            void loadSupabase().then((_sb) => {
              if (!_sb || cancelled) return;

              const syncSessionRole = async (accessToken: string, userId: string, userEmail?: string) => {
                const { data: prof } = await _sb
                  .from("profiles")
                  .select("role, status")
                  .eq("id", userId)
                  .maybeSingle();
                if (cancelled) return;
                const row = prof as { role?: string; status?: string } | null;
                if (!row || row.status === "suspended") {
                  void _sb.auth.signOut().catch(() => {});
                  dropToken("admin_token");
                  dropToken("user_token");
                  set({
                    isAuthenticated: false,
                    token: null,
                    adminEmail: null,
                    isMemberAuthenticated: false,
                    memberToken: null
                  });
                  return;
                }
                if (row.role === "admin") {
                  writeToken("admin_token", accessToken);
                  set({
                    isAuthenticated: true,
                    token: accessToken,
                    adminEmail: userEmail || get().adminEmail
                  });
                } else {
                  writeToken("user_token", accessToken);
                  set({
                    isMemberAuthenticated: true,
                    memberToken: accessToken,
                    demoSignedOut: false
                  });
                }
              };

              void _sb.auth.getSession().then(({ data }) => {
                if (cancelled) return;
                const session = data.session;
                if (session?.access_token && session.user) {
                  void syncSessionRole(session.access_token, session.user.id, session.user.email);
                } else {
                  // No active/refreshable Supabase session -> purge any stale stored JWTs
                  dropToken("admin_token");
                  dropToken("user_token");
                  set({
                    isAuthenticated: false,
                    token: null,
                    adminEmail: null,
                    isMemberAuthenticated: false,
                    memberToken: null
                  });
                }
              });

              const { data: _listener } = _sb.auth.onAuthStateChange((event, session) => {
                if (cancelled) return;
                if (event === "SIGNED_OUT") {
                  clearApiCache();
                  dropToken("admin_token");
                  dropToken("user_token");
                  set({
                    isAuthenticated: false,
                    token: null,
                    adminEmail: null,
                    isMemberAuthenticated: false,
                    memberToken: null,
                    profile: null
                  });
                } else if (
                  (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") &&
                  session?.access_token &&
                  session.user
                ) {
                  const state = get();
                  if (state.isAuthenticated) {
                    writeToken("admin_token", session.access_token);
                    set({
                      token: session.access_token,
                      adminEmail: session.user.email || state.adminEmail
                    });
                  }
                  if (state.isMemberAuthenticated) {
                    writeToken("user_token", session.access_token);
                    set({ memberToken: session.access_token });
                  }
                  if (!state.isAuthenticated && !state.isMemberAuthenticated && event === "SIGNED_IN") {
                    void syncSessionRole(session.access_token, session.user.id, session.user.email);
                  }
                }
              });
              supaUnsub = () => _listener.subscription.unsubscribe();
            });
          }

          sharedTeardown = () => {
            cancelled = true;
            if (typeof window !== "undefined") {
              window.removeEventListener("auth_unauthorized", onUnauthorized);
            }
            if (supaUnsub) supaUnsub();
            sharedTeardown = null;
          };
        }

        let released = false;
        return () => {
          if (released) return;
          released = true;
          authSubscriberCount = Math.max(0, authSubscriberCount - 1);
          if (authSubscriberCount === 0 && sharedTeardown) {
            sharedTeardown();
          }
        };
      },

      loginAdmin: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const normalizedEmail = email.trim().toLowerCase();
          const response = await apiService.loginAdmin(normalizedEmail, password);
          if (response.success && response.token) {
            clearApiCache("/admin");
            writeToken("admin_token", response.token);
            set({
              isAuthenticated: true,
              token: response.token,
              adminEmail: normalizedEmail,
              loading: false
            });
            return { ok: true };
          }
          const error = response.error || "بيانات الدخول غير صحيحة";
          set({ error, loading: false });
          return { ok: false, error, isServerProblem: false };
        } catch (err) {
          const error = toMessage(err, "تعذّر تسجيل الدخول. حاول مرة أخرى.", "Sign-in failed. Please try again.");
          set({ error, loading: false });
          return { ok: false, error, isServerProblem: true };
        }
      },

      logoutAdmin: () => {
        clearApiCache("/admin");
        dropToken("admin_token");
        if (isSupabaseConfigured && !get().isMemberAuthenticated) {
          void loadSupabase().then((sb) => sb?.auth.signOut().catch(() => {}));
        }
        set({ isAuthenticated: false, token: null, adminEmail: null, error: null });
      },

      registerMember: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.registerMember(data);
          if (response.success && response.requiresEmailConfirmation) {
            set({ loading: false, error: null });
            return { ok: true, requiresEmailConfirmation: true };
          }
          if (response.success && response.token) {
            clearApiCache("/user");
            dropToken("user_token");
            writeToken("user_token", response.token);
            set({
              isMemberAuthenticated: true,
              memberToken: response.token,
              demoSignedOut: false,
              profile: null,
              stats: null,
              spentEcoPoints: 0,
              recentActivities: [],
              registeredCourses: [],
              registeredEvents: [],
              completedCourseIds: [],
              carbonCreditAwarded: false,
              loading: false
            });
            await get().loadUserProfile();
            return { ok: true };
          }
          const error = response.error || "تعذّر إنشاء الحساب.";
          set({ error, loading: false });
          return { ok: false, error, isServerProblem: false };
        } catch (err) {
          const error = toMessage(err, "تعذّر إنشاء الحساب. حاول مرة أخرى.", "Could not create your account. Please try again.");
          set({ error, loading: false });
          return { ok: false, error, isServerProblem: true };
        }
      },

      loginMember: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.loginMember(email, password);
          if (response.success && response.token) {
            clearApiCache("/user");
            dropToken("user_token");
            writeToken("user_token", response.token);
            set({
              isMemberAuthenticated: true,
              memberToken: response.token,
              demoSignedOut: false,
              profile: null,
              stats: null,
              spentEcoPoints: 0,
              recentActivities: [],
              registeredCourses: [],
              registeredEvents: [],
              completedCourseIds: [],
              carbonCreditAwarded: false,
              loading: false
            });
            await get().loadUserProfile();
            return { ok: true };
          }
          const error = response.error || "بيانات الدخول غير صحيحة";
          set({ error, loading: false });
          return { ok: false, error, isServerProblem: false };
        } catch (err) {
          const error = toMessage(err, "تعذّر تسجيل الدخول. حاول مرة أخرى.", "Sign-in failed. Please try again.");
          set({ error, loading: false });
          return { ok: false, error, isServerProblem: true };
        }
      },

      logoutMember: () => {
        clearApiCache("/user");
        dropToken("user_token");
        if (isSupabaseConfigured && !get().isAuthenticated) {
          void loadSupabase().then((sb) => sb?.auth.signOut().catch(() => {}));
        }
        set({
          isMemberAuthenticated: false,
          memberToken: null,
          demoSignedOut: true,
          profile: null,
          stats: null,
          spentEcoPoints: 0,
          recentActivities: [],
          registeredCourses: [],
          registeredEvents: [],
          completedCourseIds: [],
          carbonCreditAwarded: false,
          error: null
        });
      },

      loadUserProfile: async () => {
        set({ loading: true, error: null });
        try {
          const data = await apiService.getUserProfile();
          const state = get();
          set({
            profile: {
              name: typeof data?.name === "string" ? data.name : "",
              email: typeof data?.email === "string" ? data.email : "",
              city: typeof data?.city === "string" ? data.city : "",
              bio: typeof data?.bio === "string" ? data.bio : ""
            },
            stats: mergeStats(state.stats, data?.stats, state.spentEcoPoints),
            recentActivities: mergeActivities(
              state.recentActivities,
              asArray<UserActivity>(data?.recentActivities)
            ),
            registeredCourses: mergeCourses(
              state.registeredCourses,
              asArray<UserCourse>(data?.registeredCourses)
            ),
            registeredEvents: mergeById(
              state.registeredEvents,
              asArray<UserEvent>(data?.registeredEvents)
            ),
            loading: false
          });
        } catch (err) {
          set({
            error: toMessage(err, "تعذّر تحميل الملف الشخصي.", "Could not load your profile."),
            loading: false
          });
        }
      },

      updateUserProfile: async (profileData) => {
        set({ loading: true, error: null });
        try {
          await apiService.updateUserProfile(profileData);
          set((state) => ({
            profile: state.profile ? { ...state.profile, ...profileData } : null,
            loading: false
          }));
          return true;
        } catch (err) {
          set({
            error: toMessage(err, "تعذّر حفظ الملف الشخصي.", "Could not save your profile."),
            loading: false
          });
          return false;
        }
      },

      saveCarbonFootprint: async (footprint) => {
        set({ error: null });
        try {
          await apiService.saveCarbonFootprint(footprint);
        } catch (err) {
          set({
            error: toMessage(err, "تعذّر حفظ نتيجة البصمة الكربونية.", "Could not save your carbon footprint.")
          });
          return false;
        }

        const state = get();
        const awardPoints = state.carbonCreditAwarded ? 0 : 50;
        const baseStats = state.stats ?? { ...ZERO_STATS };

        set({
          carbonCreditAwarded: true,
          stats: { ...baseStats, ecoPoints: baseStats.ecoPoints + awardPoints },
          recentActivities: pushActivity(state.recentActivities, {
            id: activityId(),
            titleAr: "حساب البصمة الكربونية",
            titleEn: "Carbon Footprint Calculation",
            detailAr: `تم حساب بصمتك الكربونية: ${footprint} طن/سنوياً${awardPoints ? ` (+${awardPoints} نقطة)` : ""}`,
            detailEn: `Calculated carbon footprint: ${footprint} tons/yr${awardPoints ? ` (+${awardPoints} points)` : ""}`
          })
        });
        return true;
      },

      registerForEvent: async (event, attendee) => {
        const state = get();
        if (state.registeredEvents.some((e) => e.id === event.id && e.status !== "Cancelled")) {
          return {
            ok: false,
            error: currentLanguage() === "ar" ? "أنت مسجّل في الفعالية دي بالفعل." : "You are already registered for this event."
          };
        }

        let resultTicketCode: string | undefined;
        try {
          const res = await apiService.registerForEvent({
            eventId: event.id,
            name: attendee.name,
            email: attendee.email,
            phone: attendee.phone
          });
          resultTicketCode = res.ticketCode;
        } catch (err) {
          const message = toMessage(err, "تعذّر إتمام التسجيل في الفعالية.", "Could not complete the event registration.");
          set({ error: message });
          return { ok: false, error: message };
        }

        const after = get();
        const baseStats = after.stats ?? { ...ZERO_STATS };
        const newEvent: UserEvent = {
          id: event.id,
          titleAr: event.titleAr,
          titleEn: event.titleEn,
          date: event.date,
          status: "Confirmed",
          ...(resultTicketCode ? { ticketCode: resultTicketCode } : {})
        };

        set({
          error: null,
          registeredEvents: [
            newEvent,
            ...after.registeredEvents.filter((e) => e.id !== event.id)
          ],
          stats: { ...baseStats, ecoPoints: baseStats.ecoPoints + 20 },
          recentActivities: pushActivity(after.recentActivities, {
            id: activityId(),
            titleAr: "تسجيل في فعالية بيئية",
            titleEn: "Event Registration",
            detailAr: `تم التسجيل بنجاح في فعالية ${event.titleAr}`,
            detailEn: `Registered successfully for ${event.titleEn}`
          })
        });
        return { ok: true, ...(resultTicketCode ? { ticketCode: resultTicketCode } : {}) };
      },

      cancelEventRegistration: (eventId) => {
        const state = get();
        if (state.isMemberAuthenticated) {
          void apiService.cancelUserEvent(eventId).catch(() => undefined);
        }
        set((s) => ({
          registeredEvents: s.registeredEvents.filter((e) => e.id !== eventId)
        }));
      },

      updateCourseProgress: (courseId, titleAr, titleEn, progress) => {
        const clamped = Math.max(0, Math.min(100, Math.round(num(progress))));
        const state = get();
        const existing = state.registeredCourses.find((c) => c.id === courseId);
        const nextProgress = existing ? Math.max(num(existing.progress), clamped) : clamped;

        const alreadyCompleted = state.completedCourseIds.includes(courseId);
        const justCompleted = nextProgress === 100 && !alreadyCompleted;
        const progressAdvanced =
          nextProgress > 0 && (!existing || nextProgress > num(existing.progress));

        if (!existing || progressAdvanced || justCompleted) {
          const updatedCourses: UserCourse[] = existing
            ? state.registeredCourses.map((c) =>
                c.id === courseId ? { ...c, titleAr, titleEn, progress: nextProgress } : c
              )
            : [...state.registeredCourses, { id: courseId, titleAr, titleEn, progress: nextProgress }];

          const bonusPoints = justCompleted ? 100 : progressAdvanced ? 10 : 0;
          const baseStats = state.stats ?? { ...ZERO_STATS };

          set({
            registeredCourses: updatedCourses,
            completedCourseIds: justCompleted
              ? [...state.completedCourseIds, courseId]
              : state.completedCourseIds,
            stats: {
              ...baseStats,
              ecoPoints: baseStats.ecoPoints + bonusPoints,
              earnedBadges: justCompleted ? baseStats.earnedBadges + 1 : baseStats.earnedBadges
            },
            recentActivities:
              progressAdvanced || justCompleted
                ? pushActivity(state.recentActivities, {
                    id: activityId(),
                    titleAr: nextProgress === 100 ? "إتمام مساق تعليمي" : "متابعة دراسة مساق",
                    titleEn: nextProgress === 100 ? "Course Completion" : "Course Progress",
                    detailAr: `${titleAr} (${nextProgress}%)`,
                    detailEn: `${titleEn} (${nextProgress}%)`
                  })
                : state.recentActivities
          });
        }

        if (state.isMemberAuthenticated) {
          return apiService.saveCourseProgress(courseId, nextProgress).then(
            () => undefined,
            () => undefined
          );
        }
        return Promise.resolve();
      },

      plantVirtualTree: (treeNameAr, treeNameEn, costPoints) => {
        const state = get();
        const stats = state.stats;
        if (!stats || stats.ecoPoints < costPoints) return false;

        set({
          spentEcoPoints: state.spentEcoPoints + costPoints,
          stats: {
            ...stats,
            ecoPoints: stats.ecoPoints - costPoints,
            virtualTrees: stats.virtualTrees + 1
          },
          recentActivities: pushActivity(state.recentActivities, {
            id: activityId(),
            titleAr: "زراعة شجرة افتراضية",
            titleEn: "Virtual Tree Planted",
            detailAr: `تم خصم ${costPoints} نقطة لزراعة شجرة ${treeNameAr}`,
            detailEn: `Redeemed ${costPoints} points to plant ${treeNameEn}`
          })
        });
        if (state.isMemberAuthenticated) {
          void apiService.saveVirtualTrees(1, costPoints).catch(() => {
            // Rollback optimistic deduction if server rejected redemption
            const cur = get();
            if (cur.stats) {
              set({
                spentEcoPoints: Math.max(0, cur.spentEcoPoints - costPoints),
                stats: {
                  ...cur.stats,
                  ecoPoints: cur.stats.ecoPoints + costPoints,
                  virtualTrees: Math.max(0, cur.stats.virtualTrees - 1)
                }
              });
            }
          });
        }
        return true;
      }
    }),
    {
      name: "climatify-user",
      version: 2,
      storage: createJSONStorage(() => safeStorage),
      migrate: (persistedState: unknown) => {
        const prev = (persistedState && typeof persistedState === "object" ? persistedState : {}) as Record<string, unknown>;
        return {
          stats: (prev.stats as UserStats | null) ?? null,
          spentEcoPoints: typeof prev.spentEcoPoints === "number" ? prev.spentEcoPoints : 0,
          recentActivities: Array.isArray(prev.recentActivities) ? prev.recentActivities : [],
          registeredCourses: Array.isArray(prev.registeredCourses) ? prev.registeredCourses : [],
          registeredEvents: Array.isArray(prev.registeredEvents) ? prev.registeredEvents : [],
          completedCourseIds: Array.isArray(prev.completedCourseIds) ? prev.completedCourseIds : [],
          carbonCreditAwarded: Boolean(prev.carbonCreditAwarded),
        } as PersistedAuthState;
      },
      partialize: (state): PersistedAuthState => ({
        stats: state.stats,
        spentEcoPoints: state.spentEcoPoints,
        recentActivities: state.recentActivities,
        registeredCourses: state.registeredCourses,
        registeredEvents: state.registeredEvents,
        completedCourseIds: state.completedCourseIds,
        carbonCreditAwarded: state.carbonCreditAwarded
      })
    }
  )
);
