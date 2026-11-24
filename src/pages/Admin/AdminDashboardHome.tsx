import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import {
  TrendingUp,
  Users,
  Calendar,
  FileText,
  AlertTriangle,
  RefreshCw,
  Loader2,
  PieChart,
  ArrowRight,
  ArrowLeft,
  Activity,
  Sparkles,
  MessageSquare,
  Plus,
  ShieldCheck,
  Ticket,
  Inbox,
} from "lucide-react";
import { useCMSStore } from "../../store/useCMSStore";
import { isSupabaseConfigured } from "../../lib/supabase/client";
import { AnalyticsChart } from "../../components/ui/AnalyticsChart";
import type { AdminActivity } from "../../types";
import { useChartColors } from "./adminUtils";

type LoadStatus = "loading" | "error" | "ready";

/**
 * الـ endpoint بيرجّع القيم كنصوص معروضة ("1,240" / "87%").
 * بنحاول نطلّع منها رقم للرسم البياني، وبنرجّع null لو مش رقم — أحسن من رسم
 * قيمة مخترعة.
 */
function parseMetric(value: string): number | null {
  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

export const AdminDashboardHome: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const chartColors = useChartColors();

  const cmsStats = useCMSStore((state) => state.stats);
  const analytics = useCMSStore((state) => state.analytics);
  const messages = useCMSStore((state) => state.messages);
  const users = useCMSStore((state) => state.users);
  const eventRegistrations = useCMSStore((state) => state.eventRegistrations);
  const formSubmissions = useCMSStore((state) => state.formSubmissions);
  const eventsCount = useCMSStore((state) => state.events.length);
  const postsCount = useCMSStore((state) => state.posts.length);
  const programsCount = useCMSStore((state) => state.programs.length);
  const initiativesCount = useCMSStore((state) => state.initiatives.length);
  const coursesCount = useCMSStore((state) => state.courses.length);
  const opportunitiesCount = useCMSStore((state) => state.opportunities.length);
  const loadAdminStats = useCMSStore((state) => state.loadAdminStats);
  const loadAdminAnalytics = useCMSStore((state) => state.loadAdminAnalytics);
  const loadCMSContent = useCMSStore((state) => state.loadCMSContent);
  const unreadCount = useMemo(() => messages.filter((m) => !m.isRead).length, [messages]);

  const [status, setStatus] = useState<LoadStatus>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    setStatus("loading");
    setErrorMsg(null);
    try {
      const tasks: Promise<unknown>[] = [loadAdminStats(), loadAdminAnalytics()];
      if (useCMSStore.getState().events.length === 0) {
        tasks.push(loadCMSContent());
      }
      await Promise.all(tasks);
      if (!mounted.current) return;

      const state = useCMSStore.getState();
      if (state.error && !state.stats && state.analytics.length === 0) {
        setErrorMsg(state.error);
        setStatus("error");
        return;
      }
      setStatus("ready");
    } catch (err) {
      if (!mounted.current) return;
      setErrorMsg(err instanceof Error ? err.message : (isAr ? "تعذّر تحميل بيانات اللوحة." : "Failed to load dashboard data."));
      setStatus("error");
    }
  }, [loadAdminStats, loadAdminAnalytics, loadCMSContent, isAr]);

  useEffect(() => {
    void load();
  }, [load]);

  // تاريخ اليوم بلغة الواجهة — بيتحسب وقت العرض مش ثابت في الكود.
  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(isAr ? "ar-EG" : "en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    [isAr]
  );

  const statsCards = useMemo(
    () => [
      {
        key: "visitors",
        labelEn: "Total Visitors",
        labelAr: "إجمالي الزوار",
        value: cmsStats?.totalVisitors ?? "—",
        icon: <TrendingUp size={20} />,
        color: "green" as const,
        trendEn: "+14.2% monthly growth",
        trendAr: "+14.2% نمو شهري",
        trendType: "up",
      },
      {
        key: "members",
        labelEn: "Registered Members",
        labelAr: "الأعضاء المسجلين",
        value: users.length > 0 ? String(users.length) : (cmsStats?.activeMembers ?? "—"),
        icon: <Users size={20} />,
        color: "blue" as const,
        trendEn: "Verified platform members",
        trendAr: "أعضاء وحسابات مسجلة",
        trendType: "up",
      },
      {
        key: "events",
        labelEn: "Event Registrations",
        labelAr: "تسجيلات الفعاليات",
        value: eventRegistrations.length > 0 ? String(eventRegistrations.length) : (cmsStats?.upcomingEvents ?? "—"),
        icon: <Ticket size={20} />,
        color: "amber" as const,
        trendEn: "Confirmed attendee tickets",
        trendAr: "تذاكر وحجوزات الفعاليات",
        trendType: "neutral",
      },
      {
        key: "posts",
        labelEn: "Published Posts",
        labelAr: "مقالات منشورة",
        value: cmsStats?.publishedPosts ?? "—",
        icon: <FileText size={20} />,
        color: "purple" as const,
        trendEn: "Verified press & news",
        trendAr: "أخبار وتقارير موثقة",
        trendType: "neutral",
      },
    ],
    [cmsStats, users.length, eventRegistrations.length]
  );

  const getActivityIcon = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes("فعالية") || t.includes("event") || t.includes("هاكاثون")) return <Calendar size={16} />;
    if (t.includes("رسالة") || t.includes("message") || t.includes("استقبال")) return <MessageSquare size={16} />;
    if (t.includes("مقال") || t.includes("post") || t.includes("تقرير") || t.includes("تحديث")) return <FileText size={16} />;
    return <Sparkles size={16} />;
  };

  const getActivityTone = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes("فعالية") || t.includes("event") || t.includes("هاكاثون")) return "amber";
    if (t.includes("رسالة") || t.includes("message")) return "blue";
    if (t.includes("مقال") || t.includes("post") || t.includes("تقرير")) return "green";
    return "purple";
  };

  const recentActivities: AdminActivity[] = useMemo(() => {
    const list = cmsStats?.recentActivities;
    return Array.isArray(list) ? list : [];
  }, [cmsStats]);

  /**
   * AdminActivity مالهاش id، والـ index مش مفتاح آمن لأن القائمة بتتقلب ترتيبها
   * مع كل تحديث. بنشتق مفتاح من المحتوى نفسه، وبنفرّق المتكرر برقم تسلسلي.
   */
  const activityKeys = useMemo(() => {
    const seen = new Map<string, number>();
    return recentActivities.map((activity) => {
      const base = `${activity.textEn}|${activity.textAr}|${activity.timeEn}`;
      const occurrence = (seen.get(base) ?? 0) + 1;
      seen.set(base, occurrence);
      return occurrence === 1 ? base : `${base}#${occurrence}`;
    });
  }, [recentActivities]);

  /** الدونات بتتغذى من /admin/analytics — بس البنود اللي قيمتها رقم فعلاً. */
  const analyticsChartData = useMemo(
    () =>
      analytics
        .map((item) => {
          const value = parseMetric(item.value);
          return value === null ? null : { labelEn: item.labelEn, labelAr: item.labelAr, value };
        })
        .filter((item): item is { labelEn: string; labelAr: string; value: number } => item !== null && item.value > 0),
    [analytics]
  );

  const ecosystemChartData = useMemo(
    () => [
      { labelEn: "Articles", labelAr: "المقالات", value: postsCount },
      { labelEn: "Initiatives", labelAr: "المبادرات", value: initiativesCount },
      { labelEn: "Events", labelAr: "الفعاليات", value: eventsCount },
      { labelEn: "Courses", labelAr: "المساقات", value: coursesCount },
      { labelEn: "Programs", labelAr: "البرامج", value: programsCount },
      { labelEn: "Opportunities", labelAr: "الفرص", value: opportunitiesCount },
      { labelEn: "Tickets", labelAr: "التذاكر", value: eventRegistrations.length },
    ],
    [postsCount, initiativesCount, eventsCount, coursesCount, programsCount, opportunitiesCount, eventRegistrations.length]
  );

  const QuickLinkIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <div>
      {/* Welcome Banner */}
      <section className="admin-welcome-banner">
        <div className="admin-welcome-content">
          <span className="admin-welcome-date">{todayLabel}</span>
          <h2 className="admin-page-title">
            <span>{isAr ? "مرحباً بك، مسؤول النظام" : "Welcome back, Admin"}</span>
          </h2>
          <p className="admin-page-subtitle">
            {isAr
              ? "إليك نظرة عامة على أداء المنصة اليوم والإحصائيات التفاعلية"
              : "Here's an overview of your platform today & real-time analytics"}
          </p>
          <div className="admin-welcome-actions">
            <Link to="/admin/content" className="admin-add-btn sm">
              <FileText size={15} />
              <span>{isAr ? "إدارة المحتوى" : "Manage Content"}</span>
            </Link>
            <a href="/" className="admin-btn-cancel sm">
              <span>{isAr ? "عرض الموقع" : "View Website"}</span>
              <QuickLinkIcon size={15} />
            </a>
          </div>
        </div>
        <div className="admin-welcome-decor" aria-hidden="true" />
      </section>

      {status === "error" && (
        <div className="admin-alert error" role="alert">
          <AlertTriangle size={16} />
          <span>{errorMsg}</span>
          <span className="admin-alert-actions">
            <button type="button" className="admin-add-btn sm" onClick={() => void load()}>
              <RefreshCw size={14} />
              <span>{isAr ? "إعادة المحاولة" : "Retry"}</span>
            </button>
          </span>
        </div>
      )}

      {status === "loading" && (
        <div className="admin-card admin-mb-24">
          <div className="admin-loading-block" role="status">
            <Loader2 size={18} className="admin-spinner" />
            <span>{isAr ? "جاري تحميل بيانات اللوحة..." : "Loading dashboard data..."}</span>
          </div>
        </div>
      )}

      {status === "ready" && (
        <>
          {/* 1. Bento Metric Tiles (4 cols) */}
          <div className="admin-bento-metrics">
            {statsCards.map((stat) => (
              <div key={stat.key} className="admin-bento-stat-card">
                <div className="admin-bento-stat-header">
                  <span className="admin-bento-stat-label">{isAr ? stat.labelAr : stat.labelEn}</span>
                  <div className={`admin-bento-stat-icon tone-${stat.color}`}>{stat.icon}</div>
                </div>
                <div className="admin-bento-stat-main">
                  <span className="admin-bento-stat-number">{stat.value}</span>
                </div>
                <div className="admin-bento-stat-footer">
                  <span className={`admin-bento-trend-pill ${stat.trendType}`}>
                    <TrendingUp size={12} />
                    <span>{isAr ? stat.trendAr : stat.trendEn}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {!cmsStats && (
            <div className="admin-alert warning" role="status">
              <AlertTriangle size={16} />
              <span>
                {isAr
                  ? "أرقام البطاقات مش متاحة دلوقتي — الخادم ما رجّعش إحصائيات."
                  : "Tile figures are unavailable — the server returned no statistics."}
              </span>
              <span className="admin-alert-actions">
                <button type="button" className="admin-add-btn sm" onClick={() => void load()}>
                  <RefreshCw size={14} />
                  <span>{isAr ? "إعادة المحاولة" : "Retry"}</span>
                </button>
              </span>
            </div>
          )}

          {/* 2. Bento Main Grid System (Primary Column + Companion Column) */}
          <div className="admin-bento-grid">
            {/* Primary Column (Traffic Line Chart + Recent Activity Feed) */}
            <div className="admin-bento-col main-col">
              {/* Ecosystem Inventory Chart Card */}
              <div className="admin-bento-card">
                <AnalyticsChart
                  type="bar"
                  titleEn="Platform Ecosystem Overview"
                  titleAr="مخزون المنصة والعمليات النشطة"
                  subtitleEn="Live count of published content and active registrations"
                  subtitleAr="إحصائيات حية ومباشرة للمحتوى المنشور والتذاكر النشطة"
                  data={ecosystemChartData}
                  unitEn="items"
                  unitAr="سجل"
                  primaryColor={chartColors.primary}
                  secondaryColor={chartColors.secondary}
                />
              </div>

              {/* Recent Activity Timeline Card */}
              <div className="admin-bento-card">
                <div className="admin-bento-card-header">
                  <div className="admin-bento-card-title-group">
                    <div className="admin-icon-chip green"><Activity size={16} /></div>
                    <div>
                      <h3 className="admin-bento-card-title">{isAr ? "النشاط الأخير على المنصة" : "Recent Platform Activity"}</h3>
                      <p className="admin-bento-card-sub">{isAr ? "سجل حي لأحدث الإضافات والمشاركات" : "Live log of the latest events and submissions"}</p>
                    </div>
                  </div>
                  <Link to="/admin/content" className="admin-bento-card-link">
                    <span>{isAr ? "عرض المحتوى" : "View content"}</span>
                    <QuickLinkIcon size={14} />
                  </Link>
                </div>

                <div className="admin-bento-timeline-list">
                  {recentActivities.length === 0 ? (
                    <div className="admin-empty-state compact">
                      <p>{isAr ? "لا توجد نشاطات مؤخراً." : "No recent activity."}</p>
                    </div>
                  ) : (
                    recentActivities.map((activity, i) => {
                      const actText = isAr ? activity.textAr : activity.textEn;
                      const tone = getActivityTone(activity.textAr);
                      return (
                        <div key={activityKeys[i] ?? `${activity.textEn}-${i}`} className="admin-bento-activity-row">
                          <div className={`admin-bento-activity-icon tone-${tone}`}>
                            {getActivityIcon(activity.textAr)}
                          </div>
                          <div className="admin-bento-activity-content">
                            <span className="admin-bento-activity-text">{actText}</span>
                          </div>
                          <span className="admin-bento-activity-time">
                            {isAr ? activity.timeAr : activity.timeEn}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Companion Side Column (Donut Metrics + Mission Control Shortcuts) */}
            <div className="admin-bento-col side-col">
              {/* Platform Metrics Donut Card */}
              <div className="admin-bento-card">
                {analyticsChartData.length > 0 ? (
                  <AnalyticsChart
                    type="donut"
                    titleEn="Platform Metrics"
                    titleAr="مؤشرات المنصة التفاعلية"
                    subtitleEn="Live figures from /admin/analytics"
                    subtitleAr="أرقام حيّة ومباشرة من قاعدة البيانات"
                    data={analyticsChartData}
                    primaryColor={chartColors.primary}
                    secondaryColor={chartColors.secondary}
                  />
                ) : (
                  <div className="admin-empty-state">
                    <div className="icon"><PieChart size={32} /></div>
                    <p>
                      {isAr
                        ? "مفيش مؤشرات رقمية للعرض من /admin/analytics."
                        : "No numeric metrics to chart from /admin/analytics."}
                    </p>
                    <div className="admin-empty-actions">
                      <button type="button" className="admin-add-btn sm" onClick={() => void load()}>
                        <RefreshCw size={14} />
                        <span>{isAr ? "إعادة المحاولة" : "Retry"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mission Control & Actions Card */}
              <div className="admin-bento-card">
                <div className="admin-bento-card-header">
                  <div className="admin-bento-card-title-group">
                    <div className="admin-icon-chip blue"><Sparkles size={16} /></div>
                    <div>
                      <h3 className="admin-bento-card-title">{isAr ? "مركز الإجراءات السريعة" : "Mission Control & Actions"}</h3>
                      <p className="admin-bento-card-sub">{isAr ? "اختصارات النشر المباشر وإدارة المحتوى" : "Fast publishing shortcuts & status"}</p>
                    </div>
                  </div>
                </div>

                <div className="admin-bento-actions-grid">
                  <Link to="/admin/content/articles" className="admin-bento-action-tile">
                    <div className="admin-bento-tile-icon tone-green"><FileText size={18} /></div>
                    <div className="admin-bento-tile-info">
                      <span className="admin-bento-tile-name">{isAr ? "إدارة المقالات" : "Articles"}</span>
                      <span className="admin-bento-tile-sub">{isAr ? "نشر وتعديل الأخبار" : "Manage posts"}</span>
                    </div>
                    <Plus size={14} className="admin-bento-tile-add" />
                  </Link>

                  <Link to="/admin/users" className="admin-bento-action-tile">
                    <div className="admin-bento-tile-icon tone-blue"><Users size={18} /></div>
                    <div className="admin-bento-tile-info">
                      <span className="admin-bento-tile-name">{isAr ? "الأعضاء والمستخدمين" : "Users & Members"}</span>
                      <span className="admin-bento-tile-sub">{isAr ? "إدارة الحسابات والرتب" : "Manage accounts & roles"}</span>
                    </div>
                    {users.length > 0 ? (
                      <span className="admin-bento-badge-count">{users.length}</span>
                    ) : (
                      <Plus size={14} className="admin-bento-tile-add" />
                    )}
                  </Link>

                  <Link to="/admin/registrations" className="admin-bento-action-tile">
                    <div className="admin-bento-tile-icon tone-purple"><Ticket size={18} /></div>
                    <div className="admin-bento-tile-info">
                      <span className="admin-bento-tile-name">{isAr ? "تسجيلات الفعاليات" : "Event Tickets"}</span>
                      <span className="admin-bento-tile-sub">{isAr ? "كشوفات الحضور والأكواد" : "Check-in & tickets"}</span>
                    </div>
                    {eventRegistrations.length > 0 ? (
                      <span className="admin-bento-badge-count">{eventRegistrations.length}</span>
                    ) : (
                      <Plus size={14} className="admin-bento-tile-add" />
                    )}
                  </Link>

                  <Link to="/admin/submissions" className="admin-bento-action-tile">
                    <div className="admin-bento-tile-icon tone-amber"><Inbox size={18} /></div>
                    <div className="admin-bento-tile-info">
                      <span className="admin-bento-tile-name">{isAr ? "الطلبات والاستمارات" : "Submissions"}</span>
                      <span className="admin-bento-tile-sub">{isAr ? "التوظيف وبوابات المدارس" : "Applications & proposals"}</span>
                    </div>
                    {formSubmissions.length > 0 ? (
                      <span className="admin-bento-badge-count">{formSubmissions.length}</span>
                    ) : (
                      <Plus size={14} className="admin-bento-tile-add" />
                    )}
                  </Link>

                  <Link to="/admin/messages" className="admin-bento-action-tile">
                    <div className="admin-bento-tile-icon tone-blue"><MessageSquare size={18} /></div>
                    <div className="admin-bento-tile-info">
                      <span className="admin-bento-tile-name">{isAr ? "صندوق الرسائل" : "Messages"}</span>
                      <span className="admin-bento-tile-sub">{isAr ? "استفسارات الزوار" : "Visitor inquiries"}</span>
                    </div>
                    {unreadCount > 0 ? (
                      <span className="admin-bento-badge-count">{unreadCount}</span>
                    ) : (
                      <Plus size={14} className="admin-bento-tile-add" />
                    )}
                  </Link>
                </div>

                <div className="admin-bento-status-bar">
                  <div className="admin-bento-status-item">
                    <span className="admin-bento-status-dot" />
                    <span>
                      {isSupabaseConfigured
                        ? (isAr ? "قاعدة البيانات: متصلة (Supabase)" : "Database: Connected (Supabase)")
                        : (isAr ? "الوضع الحالي: عرض تفاعلي مستقل" : "Mode: Standalone Interactive")}
                    </span>
                  </div>
                  <div className="admin-bento-status-item">
                    <ShieldCheck size={14} style={{ color: "var(--green)" }} />
                    <span>{isAr ? "حماية الصلاحيات: مفعلة" : "Access Guard: Active"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
