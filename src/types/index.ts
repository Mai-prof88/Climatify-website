export interface Program {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon: string;
  longDescriptionEn?: string;
  longDescriptionAr?: string;
}

export interface Initiative {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string;
  categoryEn: string;
  categoryAr: string;
  progress: number; // 0 to 100
  targetEn: string;
  targetAr: string;
  // === الحقول الاختيارية اللي بتدعم التنظيم الديناميكي والترتيب الذكي ===
  // status: حالة المبادرة — لو مش موجودة، بنحسبها تلقائي من الـ progress
  //   - 'active': مبادرة شغالة دلوقتي (progress أقل من 100)
  //   - 'completed': مبادرة خلصت (progress = 100)
  //   - 'upcoming': مبادرة لسه هتبدأ (progress = 0 و ليها تاريخ مستقبلي)
  // تصنيف المبادرة: الحملات، برامج، معسكرات، ورش عمل، ألعاب بيئية، هاكاثونات
  type?: 'campaign' | 'program' | 'camp' | 'workshop' | 'game' | 'hackathon' | string;
  status?: 'active' | 'completed' | 'upcoming';
  // عدد المشاركين أو المستفيدين — بيتعرض في الكارت كـ social proof
  participantsCount?: number;
  // تاريخ بداية المبادرة بصيغة ISO (YYYY-MM-DD) — بيساعد في الترتيب الزمني
  startDate?: string;
}

export interface Event {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  date: string; // ISO date string (YYYY-MM-DD)
  locationEn: string;
  locationAr: string;
  categoryEn: string;
  categoryAr: string;
  registeredCount: number;
  image?: string;
}

export interface Course {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  instructorEn: string;
  instructorAr: string;
  durationEn: string;
  durationAr: string;
  lessonsCount: number;
  categoryEn: string;
  categoryAr: string;
  image: string;
}

export interface Game {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  categoryEn: string;
  categoryAr: string;
  icon: string;
  playUrl: string;
  image?: string;
}

export interface HandsOnTrack {
  id: string;
  titleEn: string;
  titleAr: string;
  taglineEn: string;
  taglineAr: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string;
  tagsEn: string[];
  tagsAr: string[];
}

export interface Opportunity {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  typeEn: string; // "Job" | "Internship" | "Volunteering"
  typeAr: string;
  locationEn: string;
  locationAr: string;
  postedDate: string;
}

export interface BlogPost {
  id: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  contentEn: string;
  contentAr: string;
  image: string;
  date: string;
  authorEn: string;
  authorAr: string;
  categoryEn: string;
  categoryAr: string;
}

export interface TeamMember {
  id: string;
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  image: string;
  borderColor?: string;
  gradient?: string;
  category?: "founder" | "core" | "intern";
  bioAr?: string;
  bioEn?: string;
}

// === أنواع بيانات لوحة تحكم الأعضاء (User Dashboard) ===

export interface UserActivity {
  id: string;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
}

export interface UserCourse {
  id: string;
  titleAr: string;
  titleEn: string;
  progress: number;
}

export interface UserEvent {
  id: string;
  titleAr: string;
  titleEn: string;
  date: string;
  status: string;
  ticketCode?: string;
}

export interface Certificate {
  id: string;
  certificateId: string;
  courseId: string;
  userId: number | string;
  issuedAt: string;
}

/** The three gamification counters shown on the member dashboard. */
export interface UserStats {
  ecoPoints: number;
  virtualTrees: number;
  earnedBadges: number;
}

/** The profile fields the member can edit — the server is the source of truth for these. */
export interface UserProfile {
  name: string;
  email: string;
  city: string;
  bio: string;
}

/** Attendee details POSTed with an event registration. */
export interface EventRegistrationAttendee {
  name: string;
  email: string;
  phone: string;
}

/**
 * What a store mutation answers with.
 * `ok` is the only thing worth branching on; `error` is a ready-to-render,
 * already-localized sentence (usually from `ApiError.localizedMessage`).
 * Deliberately NOT a bare boolean: a bare `false` told the user nothing.
 */
export interface StoreActionResult {
  ok: boolean;
  error?: string;
  ticketCode?: string;
  requiresEmailConfirmation?: boolean;
}

// === أنواع بيانات لوحة تحكم المسؤول (Admin Dashboard) ===

export interface AdminActivity {
  textAr: string;
  textEn: string;
  timeAr: string;
  timeEn: string;
}

export interface AdminStats {
  totalVisitors: string;
  activeMembers: string;
  upcomingEvents: string;
  publishedPosts: string;
  recentActivities: AdminActivity[];
}

export interface AnalyticItem {
  labelAr: string;
  labelEn: string;
  value: string;
  icon: string;
}

export interface ContactMessage {
  id: string;
  sender: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  city: string;
  bio: string;
  role: "admin" | "member" | "partner" | "school";
  createdAt: string;
  ecoPoints?: number;
  virtualTrees?: number;
  status?: "active" | "suspended";
}

export interface AdminEventRegistration {
  id: string | number;
  eventId: string;
  eventTitleEn?: string;
  eventTitleAr?: string;
  userId?: string | null;
  name: string;
  email: string;
  phone: string;
  ticketCode: string;
  status: "Confirmed" | "Attended" | "Cancelled";
  createdAt: string;
}

export interface AdminFormSubmission {
  id: string | number;
  kind: string;
  email: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface CareerNode {
  id: string;
  titleEn: string;
  titleAr: string;
  skillsEn: string[];
  skillsAr: string[];
  salaryEn: string;
  salaryAr: string;
  pathEn: string;
  pathAr: string;
  demand: "High" | "Medium" | "Urgent";
}

export interface CarbonQuestionOption {
  textEn: string;
  textAr: string;
  value: number;
}

export interface CarbonQuestion {
  questionEn: string;
  questionAr: string;
  options: CarbonQuestionOption[];
}

// === 🚀 Standard API Response Envelopes & DTOs for Backend Integration ===

/**
 * The shape every write endpoint answers with on success.
 * On failure the server must return a non-2xx status — the client turns that
 * into an ApiError and shows it. A 200 carrying success:false is NOT supported.
 */
export interface MutationResult {
  success: boolean;
  message: string;
  ticketCode?: string;
}

/** Response body of `GET /api/user/profile`. */
export interface UserProfileResponse {
  name: string;
  email: string;
  city: string;
  bio: string;
  stats: UserStats;
  recentActivities: UserActivity[];
  registeredCourses: UserCourse[];
  registeredEvents: UserEvent[];
}

/**
 * The OPTIONAL server envelope. `api.ts`'s `unwrap()` accepts either a bare
 * payload (`[...]` / `{...}`) or this wrapper and returns `data` when both
 * `success` and `data` are present — so a backend may use either style.
 * Nothing in the app is required to produce or consume this shape directly;
 * it documents what the client tolerates.
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

/**
 * The paginated flavour of the optional server envelope described above.
 * `api.ts`'s `unwrap()` returns its `data` array; the paging counters are
 * available for any list endpoint that later grows pagination.
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: "admin" | "member" | "partner" | "school";
  };
  error?: string;
}

export interface ContactSubmitDto {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export interface MeetingBookingDto {
  name: string;
  email: string;
  date: string;
  time: string;
  notes: string;
}

export interface PartnershipSubmitDto {
  orgName: string;
  orgType: string;
  contactPerson: string;
  email: string;
  proposal: string;
}

export interface WorkshopRequestDto {
  institutionName: string;
  city: string;
  studentCount: string;
  workshopType: string;
  email: string;
}

export interface EventRegistrationDto {
  eventId: string;
  name: string;
  email: string;
  phone: string;
}

export interface OpportunityApplicationDto {
  opportunityId: string;
  name: string;
  email: string;
  portfolio: string;
  coverLetter: string;
}

// === 🚀 Member authentication DTOs ===

/** Payload for `POST /api/auth/register` — creates a new member account. */
export interface MemberRegisterDto {
  name: string;
  email: string;
  password: string;
}

/** Payload for `POST /api/auth/login` — authenticates a member. */
export interface MemberLoginDto {
  email: string;
  password: string;
}

/** Result of a member auth attempt — discriminated so callers can tell bad credentials from a server problem. */
export interface MemberAuthResult {
  ok: boolean;
  /** Already-localized sentence ready to render. */
  error?: string;
  /** True when the failure is a transport/server problem, not wrong credentials. */
  isServerProblem?: boolean;
  /** True when registration succeeded on Supabase but email confirmation is required before a session exists. */
  requiresEmailConfirmation?: boolean;
}

// === 🚀 Full-Screen Portfolio Showcase Types ===
export interface ProjectAction {
  id: string;
  labelEn: string;
  labelAr: string;
  href: string;
  type: "internal" | "external";
  variant?: "primary" | "secondary" | "ghost";
}

export interface ShowcaseProject {
  id: string;
  pageNumber: number;
  titleEn: string;
  titleAr: string;
  subtitleEn?: string;
  subtitleAr?: string;
  descriptionEn: string;
  descriptionAr: string;
  categoryEn: string;
  categoryAr: string;
  categoryKey: "all" | "digitization" | "empowerment" | "workshops" | "hackathons" | "events" | "impact";
  image: string;
  thumbnail: string;
  altEn: string;
  altAr: string;
  actions?: ProjectAction[];
}

export interface InternQuote {
  id: string;
  nameEn: string;
  nameAr: string;
  committeeEn: string;
  committeeAr: string;
  committeeKey: "design-web" | "web" | "design" | "video" | "marketing" | "pr";
  quoteEn: string;
  quoteAr: string;
  image: string;
  thumbImage: string;
}
