import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuthStore } from "../../store/useAuthStore";
import { setScrollLocked } from "./scrollController";
import {
  Menu, X, Sun, Moon, Globe, Leaf, Home, Info, LayoutGrid, Calendar,
  BookOpen, Briefcase, Mail, Newspaper, Gamepad2, LayoutDashboard, User, Palette,
  ChevronDown, Layers
} from "lucide-react";
import { usePortfolioStore } from "../../store/usePortfolioStore";
import { prefetchPortfolioShowcase, prefetchRoute } from "../../utils/routePrefetch";
import "./Header.css";

interface HeaderProps {
  isHome?: boolean;
}

const MOBILE_PANEL_ID = "mobile-nav-panel";

/** ما يمكن التركيز عليه داخل الدرج — لحصر التركيز (focus trap). */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Header: React.FC<HeaderProps> = ({ isHome = false }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isMemberAuthenticated = useAuthStore((state) => state.isMemberAuthenticated);
  const openPortfolio = usePortfolioStore((state) => state.openPortfolio);
  const isPortfolioOpen = usePortfolioStore((state) => state.isOpen);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // فشل تحميل صورة الشعار — بيتصفّر لما المصدر يتغير مع الثيم، عشان فشل
  // شبكة عابر ما يخفيش الشعار للأبد بعد تبديل المظهر.
  const [logoFailed, setLogoFailed] = useState(false);
  const location = useLocation();

  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const scrolledRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 20;
      if (scrolledRef.current !== next) {
        scrolledRef.current = next;
        setIsScrolled(next);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    setLogoFailed(false);
  }, [theme]);

  /**
   * سلوك النافذة الحوارية للدرج: حصر التركيز، Escape للإغلاق، قفل تمرير
   * الصفحة، وإعادة التركيز إلى الزر الذي فتح الدرج عند الإغلاق.
   */
  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    // نُثبّت المرجع الآن لأنه غير متاح بأمان داخل دالة التنظيف
    const hamburger = hamburgerRef.current;

    // قفل التمرير: body لخلفية الصفحة، و Lenis لأنه يقود التمرير بنفسه.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setScrollLocked(true);

    // ننتظر إطاراً واحداً حتى يصبح الدرج مرئياً فعلاً قبل نقل التركيز.
    const focusFrame = requestAnimationFrame(() => closeBtnRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) {
        event.preventDefault();
        return;
      }

      const active = document.activeElement;
      const insidePanel = active instanceof Node && panel.contains(active);

      if (event.shiftKey) {
        if (!insidePanel || active === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (!insidePanel || active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      setScrollLocked(false);
      // إعادة التركيز لمصدره حتى لا يعود مستخدم الكيبورد إلى أول الصفحة.
      const target = previouslyFocused && document.contains(previouslyFocused)
        ? previouslyFocused
        : hamburger;
      target?.focus?.();
    };
  }, [isOpen]);

  // إغلاق الدرج عند أي تنقل (بما فيه الرجوع/التقدّم في المتصفح).
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const primaryNavItems = useMemo(
    () => [
      { path: "/", label: t("home"), icon: <Home size={14} /> },
      { path: "/portfolio", label: t("portfolio"), icon: <Layers size={14} /> },
      { path: "/about", label: t("about"), icon: <Info size={14} /> },
      { path: "/programs", label: t("programs"), icon: <LayoutGrid size={14} /> },
      { path: "/events", label: t("events"), icon: <Calendar size={14} /> },
      { path: "/learning-hub", label: t("learningHub"), icon: <BookOpen size={14} /> },
      { path: "/portals", label: t("portals"), icon: <Globe size={14} /> },
    ],
    [t]
  );

  const moreNavItems = useMemo(
    () => [
      { path: "/games", label: t("gamesHub"), icon: <Gamepad2 size={14} /> },
      { path: "/opportunities", label: t("opportunities"), icon: <Briefcase size={14} /> },
      { path: "/media", label: t("media"), icon: <Newspaper size={14} /> },
      { path: "/brand", label: t("brand"), icon: <Palette size={14} /> },
      { path: "/contact", label: t("contact"), icon: <Mail size={14} /> },
    ],
    [t]
  );

  const navItems = useMemo(
    () => [...primaryNavItems, ...moreNavItems],
    [primaryNavItems, moreNavItems]
  );

  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    if (moreMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [moreMenuOpen]);

  useEffect(() => {
    setMoreMenuOpen(false);
  }, [location.pathname]);

  /** المسار نشط أيضاً على صفحاته الفرعية (‎/media ← /blog/:id‎ يظل مستقلاً). */
  const isActivePath = useCallback(
    (path: string) =>
      path === "/"
        ? location.pathname === "/"
        : location.pathname === path || location.pathname.startsWith(`${path}/`),
    [location.pathname]
  );

  const handleLangToggle = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const themeToggleLabel =
    theme === "light"
      ? language === "ar" ? "تشغيل المظهر الداكن" : "Switch to dark mode"
      : language === "ar" ? "تشغيل المظهر الفاتح" : "Switch to light mode";

  const langToggleLabel = language === "ar" ? "Switch to English" : "التبديل إلى العربية";

  const dashboardLabel = t("dashboard");

  const mobileNavPortal = (
    <div
      className={`mobile-nav-overlay ${isOpen ? "open" : ""}`}
      onClick={closeMenu}
      data-lenis-prevent
    >
      <div
        className="mobile-nav-panel"
        onClick={(e) => e.stopPropagation()}
        ref={panelRef}
        id={MOBILE_PANEL_ID}
        role="dialog"
        aria-modal="true"
        aria-label={language === "ar" ? "قائمة التنقل" : "Navigation menu"}
      >
        <div className="mobile-panel-header">
          <span className="mobile-brand-title">Climatify</span>
          <button
            type="button"
            onClick={closeMenu}
            ref={closeBtnRef}
            aria-label={language === "ar" ? "إغلاق القائمة" : "Close menu"}
          >
            <X size={22} />
          </button>
        </div>
        {/* data-lenis-prevent وإلا التقط Lenis عجلة الماوس ولم تعد القائمة تُمرَّر */}
        <nav
          className="mobile-nav-links"
          aria-label={language === "ar" ? "التنقل الرئيسي" : "Main Navigation"}
          data-lenis-prevent
        >
          {navItems.map((item) => {
            if (item.path === "/portfolio") {
              return (
                <button
                  key={item.path}
                  type="button"
                  className={`mobile-nav-item ${isPortfolioOpen ? "active" : ""}`}
                  onPointerEnter={prefetchPortfolioShowcase}
                  onFocus={prefetchPortfolioShowcase}
                  onTouchStart={prefetchPortfolioShowcase}
                  onClick={() => {
                    closeMenu();
                    openPortfolio(0);
                  }}
                >
                  {item.label}
                </button>
              );
            }
            const triggerPrefetch = () => prefetchRoute(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-item ${isActivePath(item.path) ? "active" : ""}`}
                aria-current={isActivePath(item.path) ? "page" : undefined}
                onPointerEnter={triggerPrefetch}
                onFocus={triggerPrefetch}
                onTouchStart={triggerPrefetch}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/dashboard"
            className={`mobile-nav-item ${isActivePath("/dashboard") ? "active" : ""}`}
            aria-current={isActivePath("/dashboard") ? "page" : undefined}
            onPointerEnter={() => prefetchRoute("/dashboard")}
            onFocus={() => prefetchRoute("/dashboard")}
            onTouchStart={() => prefetchRoute("/dashboard")}
            onClick={closeMenu}
          >
            {dashboardLabel}
          </Link>
          <Link
            to="/contact"
            className="btn btn-primary mobile-join-btn"
            onPointerEnter={() => prefetchRoute("/contact")}
            onFocus={() => prefetchRoute("/contact")}
            onTouchStart={() => prefetchRoute("/contact")}
            onClick={closeMenu}
          >
            {t("joinMovement")}
          </Link>
        </nav>
      </div>
    </div>
  );

  const authTargetRoute = isMemberAuthenticated ? "/dashboard" : "/login";

  return (
    <>
      <header className={`site-header glass ${isScrolled ? "scrolled" : ""} ${!isHome ? "not-home" : ""}`}>
        <div className="container header-container">
          <Link to="/" className="logo-area" aria-label="Climatify — Home">
            {logoFailed ? (
              <div className="logo-placeholder">
                <Leaf size={20} className="logo-icon-svg" />
                <span>Climatify</span>
              </div>
            ) : (
              <img
                src={theme === "light" ? "/logo-dark.webp" : "/logo-white.webp"}
                alt="Climatify"
                className="header-logo"
                width={132}
                height={38}
                decoding="async"
                onError={() => setLogoFailed(true)}
              />
            )}
          </Link>

          {/* قائمة التنقل للشاشات الكبيرة */}
          <nav className="desktop-nav" aria-label={language === "ar" ? "التنقل الرئيسي" : "Main Navigation"}>
            {primaryNavItems.map((item) => {
              if (item.path === "/portfolio") {
                return (
                  <button
                    key={item.path}
                    type="button"
                    className={`nav-item-link ${isPortfolioOpen ? "active" : ""}`}
                    onPointerEnter={prefetchPortfolioShowcase}
                    onFocus={prefetchPortfolioShowcase}
                    onTouchStart={prefetchPortfolioShowcase}
                    onClick={() => openPortfolio(0)}
                  >
                    {item.label}
                  </button>
                );
              }
              const triggerPrefetch = () => prefetchRoute(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item-link ${isActivePath(item.path) ? "active" : ""}`}
                  aria-current={isActivePath(item.path) ? "page" : undefined}
                  onPointerEnter={triggerPrefetch}
                  onFocus={triggerPrefetch}
                  onTouchStart={triggerPrefetch}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* قائمة المزيد المنسدلة لبقية الأقسام لتفادي التداخل نهائياً */}
            <div
              className="nav-dropdown-wrapper"
              ref={moreMenuRef}
              onMouseEnter={() => setMoreMenuOpen(true)}
              onMouseLeave={() => setMoreMenuOpen(false)}
            >
              <button
                type="button"
                className={`nav-dropdown-trigger ${moreNavItems.some((i) => isActivePath(i.path)) ? "active" : ""}`}
                onClick={() => setMoreMenuOpen((v) => !v)}
                aria-expanded={moreMenuOpen}
                aria-haspopup="true"
              >
                <span>{language === "ar" ? "المزيد" : "More"}</span>
                <ChevronDown size={13} className={`dropdown-chevron ${moreMenuOpen ? "open" : ""}`} />
              </button>

              {moreMenuOpen && (
                <div className="nav-dropdown-menu" role="menu">
                  {moreNavItems.map((item) => {
                    const triggerPrefetch = () => prefetchRoute(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-dropdown-item ${isActivePath(item.path) ? "active" : ""}`}
                        onPointerEnter={triggerPrefetch}
                        onFocus={triggerPrefetch}
                        onTouchStart={triggerPrefetch}
                        onClick={() => setMoreMenuOpen(false)}
                      >
                        <span className="dropdown-item-icon">{item.icon}</span>
                        <span className="dropdown-item-label">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* أدوات التحكم (اللغة، المظهر، لوحة التحكم، زر الحركة) */}
          <div className="header-actions-group">
            {/* تبديل المظهر */}
            <button
              type="button"
              onClick={toggleTheme}
              className="action-icon-btn"
              title={themeToggleLabel}
              aria-label={themeToggleLabel}
              aria-pressed={theme === "dark"}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* تبديل اللغة */}
            <button
              type="button"
              onClick={handleLangToggle}
              className="action-icon-btn lang-btn"
              title={langToggleLabel}
              aria-label={langToggleLabel}
            >
              <Globe size={18} />
              <span className="lang-text-badge" aria-hidden="true">
                {language === "ar" ? "EN" : "AR"}
              </span>
            </button>

            {/* لوحة التحكم أو تسجيل الدخول */}
            <Link
              to={authTargetRoute}
              className={`action-icon-btn dashboard-action-btn ${isActivePath(authTargetRoute) ? "active" : ""}`}
              title={isMemberAuthenticated ? dashboardLabel : (language === "ar" ? "تسجيل الدخول" : "Sign In")}
              aria-label={isMemberAuthenticated ? dashboardLabel : (language === "ar" ? "تسجيل الدخول" : "Sign In")}
              aria-current={isActivePath(authTargetRoute) ? "page" : undefined}
              onPointerEnter={() => prefetchRoute(authTargetRoute)}
              onFocus={() => prefetchRoute(authTargetRoute)}
              onTouchStart={() => prefetchRoute(authTargetRoute)}
            >
              {isMemberAuthenticated ? <LayoutDashboard size={18} /> : <User size={18} />}
            </Link>

            <Link
              to="/contact"
              className="btn btn-primary join-action-btn"
              onPointerEnter={() => prefetchRoute("/contact")}
              onFocus={() => prefetchRoute("/contact")}
              onTouchStart={() => prefetchRoute("/contact")}
            >
              {t("joinMovement")}
            </Link>

            {/* زر الموبايل */}
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="mobile-menu-hamburger-btn"
              ref={hamburgerRef}
              aria-label={
                isOpen
                  ? language === "ar" ? "إغلاق القائمة" : "Close menu"
                  : language === "ar" ? "فتح القائمة" : "Open menu"
              }
              aria-expanded={isOpen}
              aria-controls={MOBILE_PANEL_ID}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* بورتال القائمة الجانبية للموبايل خارج الهيدر لضمان الظهور والـ positioning السليم */}
      {typeof document !== "undefined" && createPortal(mobileNavPortal, document.body)}
    </>
  );
};
