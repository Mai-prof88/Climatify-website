import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import {
  Home, Info, LayoutGrid, Calendar, BookOpen, Briefcase, Globe, Mail,
  Newspaper, Gamepad2, LayoutDashboard, Layers
} from "lucide-react";
import { usePortfolioStore } from "../../store/usePortfolioStore";
import { prefetchPortfolioShowcase, prefetchRoute } from "../../utils/routePrefetch";
import "./MobileBottomNav.css";

export const MobileBottomNav: React.FC = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const openPortfolio = usePortfolioStore((state) => state.openPortfolio);
  const isPortfolioOpen = usePortfolioStore((state) => state.isOpen);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const navItems = useMemo(
    () => [
      { path: "/", label: t("home"), icon: <Home size={18} /> },
      { path: "/portfolio", label: t("portfolio"), icon: <Layers size={18} /> },
      { path: "/about", label: t("about"), icon: <Info size={18} /> },
      { path: "/programs", label: t("programs"), icon: <LayoutGrid size={18} /> },
      { path: "/events", label: t("events"), icon: <Calendar size={18} /> },
      { path: "/learning-hub", label: t("learningHub"), icon: <BookOpen size={18} /> },
      // مسارات حقيقية كانت بلا أي رابط يوصل إليها في الشِل
      { path: "/media", label: t("media"), icon: <Newspaper size={18} /> },
      { path: "/games", label: t("gamesHub"), icon: <Gamepad2 size={18} /> },
      { path: "/opportunities", label: t("opportunities"), icon: <Briefcase size={18} /> },
      { path: "/portals", label: t("portals"), icon: <Globe size={18} /> },
      { path: "/dashboard", label: t("dashboard"), icon: <LayoutDashboard size={18} /> },
      { path: "/contact", label: t("contact"), icon: <Mail size={18} /> },
    ],
    [t]
  );

  const isActivePath = useCallback(
    (path: string) =>
      path === "/"
        ? location.pathname === "/"
        : location.pathname === path || location.pathname.startsWith(`${path}/`),
    [location.pathname]
  );

  // Center active tab horizontally in both RTL and LTR without affecting vertical page scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || typeof container.scrollBy !== "function") return;
    const activeTab = container.querySelector<HTMLElement>(".mobile-bottom-tab.active");
    if (!activeTab) return;
    const containerRect = container.getBoundingClientRect();
    if (containerRect.width <= 0) return;
    const tabRect = activeTab.getBoundingClientRect();
    const delta =
      tabRect.left + tabRect.width / 2 - (containerRect.left + containerRect.width / 2);
    if (Math.abs(delta) <= 4) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    container.scrollBy({
      left: delta,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [location.pathname, isPortfolioOpen]);

  return (
    <nav
      className="mobile-bottom-nav-bar glass"
      aria-label={language === "ar" ? "شريط التنقل السفلي" : "Mobile bottom navigation"}
    >
      <div ref={scrollContainerRef} className="mobile-bottom-nav-scroll">
        {navItems.map((item) => {
          if (item.path === "/portfolio") {
            return (
              <button
                key={item.path}
                type="button"
                className={`mobile-bottom-tab ${isPortfolioOpen ? "active" : ""}`}
                onPointerEnter={prefetchPortfolioShowcase}
                onFocus={prefetchPortfolioShowcase}
                onTouchStart={prefetchPortfolioShowcase}
                onClick={() => openPortfolio(0)}
              >
                <span className="mobile-tab-icon" aria-hidden="true">{item.icon}</span>
                <span className="mobile-tab-label">{item.label}</span>
              </button>
            );
          }
          const active = isActivePath(item.path);
          const triggerPrefetch = () => prefetchRoute(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-bottom-tab ${active ? "active" : ""}`}
              aria-current={active ? "page" : undefined}
              onPointerEnter={triggerPrefetch}
              onFocus={triggerPrefetch}
              onTouchStart={triggerPrefetch}
            >
              <span className="mobile-tab-icon" aria-hidden="true">{item.icon}</span>
              <span className="mobile-tab-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
