import React, { Suspense, lazy, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuthStore } from "../../store/useAuthStore";
import { useCMSStore } from "../../store/useCMSStore";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Bell,
  X,
  Users,
  TrendingUp,
  Ticket,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Sun,
  Moon,
  ShieldCheck,
  ExternalLink,
  Inbox,
} from "lucide-react";
import { AdminLogin } from "./AdminLogin";
import type { AdminLoginResult } from "./AdminLogin";
import { AnalyticsChart } from "../../components/ui/AnalyticsChart";
import { RouteLoader } from "../../components/common/RouteLoader";
import { useChartColors } from "./adminUtils";
import "./admin.css";
import "./admin.sidebar.minimal.css";

const AdminDashboardHome = lazy(() =>
  import("./AdminDashboardHome").then((m) => ({ default: m.AdminDashboardHome }))
);
const AdminContent = lazy(() =>
  import("./AdminContent").then((m) => ({ default: m.AdminContent }))
);
const AdminMessages = lazy(() =>
  import("./AdminMessages").then((m) => ({ default: m.AdminMessages }))
);
const AdminSettings = lazy(() =>
  import("./AdminSettings").then((m) => ({ default: m.AdminSettings }))
);
const AdminUsers = lazy(() =>
  import("./AdminUsers").then((m) => ({ default: m.AdminUsers }))
);
const AdminRegistrations = lazy(() =>
  import("./AdminRegistrations").then((m) => ({ default: m.AdminRegistrations }))
);
const AdminSubmissions = lazy(() =>
  import("./AdminSubmissions").then((m) => ({ default: m.AdminSubmissions }))
);

type AdminTab =
  | "dashboard"
  | "content"
  | "users"
  | "registrations"
  | "submissions"
  | "messages"
  | "analytics"
  | "settings";

/** ألوان أيقونات بطاقات الإحصائيات بالتناوب. */
const STAT_TONES = ["green", "blue", "amber", "green"] as const;

export const AdminLayout: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const isAr = language === "ar";
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const adminEmail = useAuthStore((state) => state.adminEmail);
  const loginAdmin = useAuthStore((state) => state.loginAdmin);
  const logoutAdmin = useAuthStore((state) => state.logoutAdmin);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const loadMessages = useCMSStore((state) => state.loadMessages);
  const loadAdminUsers = useCMSStore((state) => state.loadAdminUsers);
  const loadAdminEventRegistrations = useCMSStore((state) => state.loadAdminEventRegistrations);
  const loadAdminFormSubmissions = useCMSStore((state) => state.loadAdminFormSubmissions);
  const loadSiteSettings = useCMSStore((state) => state.loadSiteSettings);
  const siteSettings = useCMSStore((state) => state.siteSettings);
  const unreadCountRaw = useCMSStore((state) => state.messages);
  const unreadCount = useMemo(() => unreadCountRaw.filter((m) => !m.isRead).length, [unreadCountRaw]);
  const usersCount = useCMSStore((state) => state.users.length);
  const registrationsCount = useCMSStore((state) => state.eventRegistrations.length);
  const submissionsCount = useCMSStore((state) => state.formSubmissions.length);

  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = initializeAuth();
    setAuthReady(true);
    return unsubscribe;
  }, [initializeAuth]);

  useEffect(() => {
    if (!authReady || !isAuthenticated) return;
    void loadMessages();
    void loadAdminUsers();
    void loadAdminEventRegistrations();
    void loadAdminFormSubmissions();
    void loadSiteSettings();
  }, [authReady, isAuthenticated, loadMessages, loadAdminUsers, loadAdminEventRegistrations, loadAdminFormSubmissions, loadSiteSettings]);

  const getTabFromPath = (path: string): AdminTab => {
    const segment = path.replace(/^\/admin\/?/, "").split("/")[0] ?? "";
    if (
      segment === "content" ||
      segment === "users" ||
      segment === "registrations" ||
      segment === "submissions" ||
      segment === "messages" ||
      segment === "analytics" ||
      segment === "settings"
    ) {
      return segment;
    }
    return "dashboard";
  };

  const activeTab = getTabFromPath(location.pathname);

  const handleTabChange = (tab: AdminTab) => {
    setSidebarOpen(false);
    if (tab === "dashboard") {
      navigate("/admin");
    } else {
      navigate(`/admin/${tab}`);
    }
  };

  const handleLogin = (email: string, password: string): Promise<AdminLoginResult> =>
    loginAdmin(email, password);

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin");
  };

  const navItems: {
    id: AdminTab;
    labelEn: string;
    labelAr: string;
    icon: React.ReactNode;
    badge?: number;
    badgeSrAr?: string;
    badgeSrEn?: string;
  }[] = [
    { id: "dashboard", labelEn: "Dashboard", labelAr: "لوحة التحكم", icon: <LayoutDashboard size={18} /> },
    { id: "content", labelEn: "Content Hub", labelAr: "إدارة المحتوى", icon: <FileText size={18} /> },
    { id: "users", labelEn: "Users & Members", labelAr: "الأعضاء والمستخدمين", icon: <Users size={18} />, badge: usersCount, badgeSrAr: " عضو مسجل", badgeSrEn: " registered members" },
    { id: "registrations", labelEn: "Event Tickets", labelAr: "تسجيلات الفعاليات", icon: <Ticket size={18} />, badge: registrationsCount, badgeSrAr: " تذكرة فعالية", badgeSrEn: " event tickets" },
    { id: "submissions", labelEn: "Inbound Submissions", labelAr: "الطلبات والاستمارات", icon: <Inbox size={18} />, badge: submissionsCount, badgeSrAr: " طلب وارد", badgeSrEn: " inbound submissions" },
    { id: "messages", labelEn: "Messages", labelAr: "الرسائل الواردة", icon: <MessageSquare size={18} />, badge: unreadCount, badgeSrAr: " رسالة غير مقروءة", badgeSrEn: " unread messages" },
    { id: "analytics", labelEn: "Analytics", labelAr: "التحليلات", icon: <BarChart3 size={18} /> },
    { id: "settings", labelEn: "Settings", labelAr: "الإعدادات", icon: <Settings size={18} /> },
  ];

  const pageTitle = (() => {
    const item = navItems.find((n) => n.id === activeTab);
    return isAr ? (item?.labelAr ?? "") : (item?.labelEn ?? "");
  })();

  // عنوان التبويب في المتصفح يعكس الصفحة الحالية بدل عنوان الموقع العام.
  useEffect(() => {
    document.title = `${pageTitle} · Climatify Admin`;
  }, [pageTitle]);

  if (!authReady) {
    return <RouteLoader />;
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="admin-layout">
      {/* Mobile Overlay */}
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}
        aria-label={isAr ? "تنقل لوحة التحكم" : "Admin navigation"}
      >
        <div className="admin-sidebar-brand">
          <img
            src={theme === "dark" ? "/logo-white.webp" : "/logo-dark.webp"}
            alt={siteSettings.siteName || "Climatify"}
            width={116}
            height={33}
          />
          <span className="admin-sidebar-brand-text">
            {siteSettings.siteName || "Climatify"}
            <span className="admin-sidebar-badge">CMS</span>
          </span>
          <button
            type="button"
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label={isAr ? "إغلاق القائمة الجانبية" : "Close sidebar"}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          <span className="admin-nav-section-label">
            {isAr ? "القائمة الرئيسية" : "Main Menu"}
          </span>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`admin-nav-btn ${activeTab === item.id ? "active" : ""}`}
              onClick={() => handleTabChange(item.id)}
              aria-current={activeTab === item.id ? "page" : undefined}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{isAr ? item.labelAr : item.labelEn}</span>
              {(item.badge ?? 0) > 0 ? (
                <span className="admin-nav-badge">
                  {item.badge}
                  <span className="sr-only">
                    {isAr ? (item.badgeSrAr ?? "") : (item.badgeSrEn ?? "")}
                  </span>
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-avatar">
              <ShieldCheck size={18} />
            </div>
            <div className="admin-sidebar-user-info">
              <div className="admin-sidebar-user-name">
                {isAr ? "مسؤول النظام" : "System Admin"}
              </div>
              <div className="admin-sidebar-user-role">
                {adminEmail || siteSettings.contactEmail || "admin@climatify.org"}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="admin-main-area">
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label={isAr ? "فتح القائمة الجانبية" : "Open sidebar"}
              aria-expanded={sidebarOpen}
              aria-controls="admin-sidebar"
            >
              <Menu size={19} />
            </button>
            <div className="admin-topbar-heading">
              <h1 className="admin-topbar-title">{pageTitle}</h1>
              <span className="admin-topbar-crumb">Climatify CMS</span>
            </div>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-lang-toggle" role="group" aria-label={isAr ? "تغيير اللغة" : "Switch language"}>
              <button
                type="button"
                className={`admin-lang-option ${isAr ? "active" : ""}`}
                onClick={() => setLanguage("ar")}
                aria-pressed={isAr}
              >
                ع
              </button>
              <button
                type="button"
                className={`admin-lang-option ${!isAr ? "active" : ""}`}
                onClick={() => setLanguage("en")}
                aria-pressed={!isAr}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              className="admin-topbar-btn"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? (isAr ? "الوضع الفاتح" : "Light Mode") : (isAr ? "الوضع الداكن" : "Dark Mode")}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <a className="admin-topbar-btn admin-topbar-site" href="/" title={isAr ? "عرض الموقع" : "View website"}>
              <ExternalLink size={17} />
              <span className="sr-only">{isAr ? "عرض الموقع" : "View website"}</span>
            </a>

            <button
              type="button"
              className="admin-topbar-btn admin-topbar-bell"
              onClick={() => handleTabChange("messages")}
              aria-label={
                isAr
                  ? `الإشعارات — ${unreadCount} رسالة غير مقروءة`
                  : `Notifications — ${unreadCount} unread messages`
              }
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="admin-topbar-badge" aria-hidden="true">
                  {unreadCount > 9 ? "+9" : unreadCount}
                </span>
              )}
            </button>

            <button type="button" className="admin-logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              <span>{isAr ? "خروج" : "Logout"}</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <Suspense fallback={<RouteLoader />}>
            {activeTab === "dashboard" && <AdminDashboardHome />}
            {activeTab === "content" && <AdminContent />}
            {activeTab === "users" && <AdminUsers />}
            {activeTab === "registrations" && <AdminRegistrations />}
            {activeTab === "submissions" && <AdminSubmissions />}
            {activeTab === "messages" && <AdminMessages />}
            {activeTab === "analytics" && <AdminAnalyticsPage />}
            {activeTab === "settings" && <AdminSettings />}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

/* Analytics Page — connected to live CMS & operational metrics */
const AdminAnalyticsPage: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const analytics = useCMSStore((state) => state.analytics);
  const eventsCount = useCMSStore((state) => state.events.length);
  const postsCount = useCMSStore((state) => state.posts.length);
  const coursesCount = useCMSStore((state) => state.courses.length);
  const initiativesCount = useCMSStore((state) => state.initiatives.length);
  const usersCount = useCMSStore((state) => state.users.length);
  const regsCount = useCMSStore((state) => state.eventRegistrations.length);
  const subsCount = useCMSStore((state) => state.formSubmissions.length);
  const loadAdminAnalytics = useCMSStore((state) => state.loadAdminAnalytics);
  const loadCMSContent = useCMSStore((state) => state.loadCMSContent);
  const chartColors = useChartColors();

  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
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
      const tasks: Promise<unknown>[] = [loadAdminAnalytics()];
      if (useCMSStore.getState().events.length === 0) {
        tasks.push(loadCMSContent());
      }
      await Promise.all(tasks);
      if (!mounted.current) return;
      const { error, analytics: loaded } = useCMSStore.getState();
      if (error && loaded.length === 0) {
        setErrorMsg(error);
        setStatus("error");
        return;
      }
      setStatus("ready");
    } catch (err) {
      if (!mounted.current) return;
      setErrorMsg(err instanceof Error ? err.message : "Failed to load analytics");
      setStatus("error");
    }
  }, [loadAdminAnalytics, loadCMSContent]);

  useEffect(() => {
    void load();
  }, [load]);

  const getAnalyticIcon = (iconName: string, index: number) => {
    if (iconName === "BarChart3") return <BarChart3 size={20} />;
    if (iconName === "Users") return <Users size={20} />;
    if (iconName === "TrendingUp") return <TrendingUp size={20} />;
    if (iconName === "Ticket") return <Ticket size={20} />;

    const mod = index % 4;
    if (mod === 0) return <BarChart3 size={20} />;
    if (mod === 1) return <Users size={20} />;
    if (mod === 2) return <TrendingUp size={20} />;
    return <Ticket size={20} />;
  };

  const liveBreakdown = useMemo(
    () => [
      { labelEn: "Articles", labelAr: "المقالات", value: postsCount },
      { labelEn: "Initiatives", labelAr: "المبادرات", value: initiativesCount },
      { labelEn: "Events", labelAr: "الفعاليات", value: eventsCount },
      { labelEn: "Courses", labelAr: "المساقات", value: coursesCount },
      { labelEn: "Members", labelAr: "الأعضاء", value: usersCount },
      { labelEn: "Tickets", labelAr: "التذاكر", value: regsCount },
      { labelEn: "Submissions", labelAr: "الطلبات", value: subsCount },
    ],
    [postsCount, initiativesCount, eventsCount, coursesCount, usersCount, regsCount, subsCount]
  );

  return (
    <div>
      <div className="admin-page-header">
        <h2 className="admin-page-title">
          <span>{isAr ? "تحليلات المنصة" : "Platform Analytics"}</span>
        </h2>
        <p className="admin-page-subtitle">
          {isAr ? "نظرة عامة حية على أداء المنصة ومخزون المحتوى والتفاعل" : "Live overview of platform performance, content inventory & engagement"}
        </p>
      </div>

      {status === "loading" && (
        <div className="admin-card">
          <div className="admin-loading-block" role="status">
            <Loader2 size={18} className="admin-spinner" />
            <span>{isAr ? "جاري تحميل التحليلات..." : "Loading analytics..."}</span>
          </div>
        </div>
      )}

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

      {status === "ready" && analytics.length === 0 && (
        <div className="admin-card">
          <div className="admin-empty-state">
            <div className="icon"><BarChart3 size={32} /></div>
            <p>{isAr ? "لا توجد بيانات تحليلية بعد." : "No analytics data yet."}</p>
          </div>
        </div>
      )}

      {status === "ready" && analytics.length > 0 && (
        <div className="admin-stats-grid">
          {analytics.map((stat, i) => (
            <div key={`${stat.labelEn}-${i}`} className="admin-stat-card">
              <div className={`admin-stat-icon ${STAT_TONES[i % STAT_TONES.length] ?? "green"}`}>
                {getAnalyticIcon(stat.icon, i)}
              </div>
              <div className="admin-stat-info">
                <h4>{isAr ? stat.labelAr : stat.labelEn}</h4>
                <span className="admin-stat-number">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="admin-mt-20">
        <AnalyticsChart
          type="bar"
          titleEn="Live Platform Inventory & Engagement"
          titleAr="توزيع المحتوى والتفاعل الفعلي بالمنصة"
          subtitleEn="Real-time record counts across published content and inbound operations"
          subtitleAr="إحصائيات حية ومباشرة لإجمالي السجلات والطلبات النشطة"
          data={liveBreakdown}
          unitEn="records"
          unitAr="سجل"
          primaryColor={chartColors.primary}
          secondaryColor={chartColors.secondary}
        />
      </div>
    </div>
  );
};
