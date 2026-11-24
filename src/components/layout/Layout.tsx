import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileBottomNav } from "./MobileBottomNav";
import { RouteLoader } from "../common/RouteLoader";
import { useLanguage } from "../../context/LanguageContext";
import { registerScrollController } from "./scrollController";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { usePortfolioStore } from "../../store/usePortfolioStore";
import { useCMSStore } from "../../store/useCMSStore";
import { useAuthStore } from "../../store/useAuthStore";
import { apiService } from "../../services/api";
import "./Layout.css";

// Lazy-load non-critical global modals & floating widgets out of the blocking entry chunk
const FullScreenShowcase = lazy(() =>
  import("../PortfolioShowcase/FullScreenShowcase").then((m) => ({
    default: m.FullScreenShowcase,
  }))
);
const AIChatAssistant = lazy(() =>
  import("./AIChatAssistant").then((m) => ({ default: m.AIChatAssistant }))
);
const QuickCommandPalette = lazy(() =>
  import("../ui/QuickCommandPalette").then((m) => ({ default: m.QuickCommandPalette }))
);

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const COARSE_POINTER_QUERY = "(hover: none) and (pointer: coarse)";

const prefersReducedMotion = (): boolean => {
  try {
    return typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(REDUCED_MOTION_QUERY).matches
      : false;
  } catch {
    return false;
  }
};

const isCoarsePointerDevice = (): boolean => {
  try {
    return typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(COARSE_POINTER_QUERY).matches
      : false;
  } catch {
    return false;
  }
};

/**
 * Freezes the outgoing route's outlet snapshot during AnimatePresence exit
 * so the outgoing view never flashes the incoming route's content.
 */
const FrozenOutlet: React.FC = () => {
  const outlet = useOutlet();
  const [frozen] = useState(() => outlet);
  return <>{frozen}</>;
};

export const Layout: React.FC = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const isHome = location.pathname === "/";
  const lenisRef = useRef<Lenis | null>(null);
  const [reduceMotion, setReduceMotion] = useState<boolean>(prefersReducedMotion);
  const [coarsePointer, setCoarsePointer] = useState<boolean>(isCoarsePointerDevice);

  const isPortfolioOpen = usePortfolioStore((state) => state.isOpen);
  const activeSlideIndex = usePortfolioStore((state) => state.activeSlideIndex);
  const closePortfolio = usePortfolioStore((state) => state.closePortfolio);

  const siteSettings = useCMSStore((state) => state.siteSettings);
  const loadSiteSettings = useCMSStore((state) => state.loadSiteSettings);
  const isAdminAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [widgetsReady, setWidgetsReady] = useState(false);
  const [openPaletteImmediately, setOpenPaletteImmediately] = useState(false);

  useEffect(() => {
    void loadSiteSettings();
  }, [loadSiteSettings]);

  // Defer non-critical floating widgets until browser idle (or immediate Ctrl+K)
  useEffect(() => {
    if (widgetsReady) return;
    const onEarlyShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenPaletteImmediately(true);
        setWidgetsReady(true);
      }
    };
    window.addEventListener("keydown", onEarlyShortcut);
    let idleId: number | null = null;
    const timer = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => setWidgetsReady(true), { timeout: 1500 });
      } else {
        setWidgetsReady(true);
      }
    }, 1800);
    return () => {
      window.removeEventListener("keydown", onEarlyShortcut);
      window.clearTimeout(timer);
      if (idleId !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [widgetsReady]);

  // Lightweight idle analytics pageview beacon
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void apiService.trackPageView(location.pathname).catch(() => {});
    }, 900);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    let reducedMql: MediaQueryList | null = null;
    let pointerMql: MediaQueryList | null = null;
    try {
      reducedMql = window.matchMedia(REDUCED_MOTION_QUERY);
      pointerMql = window.matchMedia(COARSE_POINTER_QUERY);
    } catch {
      return;
    }
    const onReducedChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    const onPointerChange = (e: MediaQueryListEvent) => setCoarsePointer(e.matches);
    reducedMql.addEventListener("change", onReducedChange);
    pointerMql.addEventListener("change", onPointerChange);
    return () => {
      reducedMql?.removeEventListener("change", onReducedChange);
      pointerMql?.removeEventListener("change", onPointerChange);
    };
  }, []);

  useEffect(() => {
    // Skip Lenis on reduced-motion AND coarse-pointer touch screens so iOS/Android
    // use native hardware-composited 120Hz touch momentum scrolling with zero JS overhead.
    if (reduceMotion || coarsePointer) {
      registerScrollController(null);
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    registerScrollController(lenis);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    const startRaf = () => {
      if (!rafId && document.visibilityState !== "hidden") {
        rafId = requestAnimationFrame(raf);
      }
    };
    const stopRaf = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stopRaf();
      } else {
        startRaf();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    startRaf();

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopRaf();
      registerScrollController(null);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduceMotion, coarsePointer]);

  const skipLinkLabel =
    language === "ar" ? "تخطَّ إلى المحتوى الرئيسي" : "Skip to main content";

  // Crisp 160ms route transition (down from 350ms) for near-instant perceived navigation
  const pageMotion = useMemo(
    () =>
      reduceMotion
        ? {
            initial: { opacity: 1 },
            animate: { opacity: 1 },
            exit: { opacity: 1 },
            transition: { duration: 0 },
          }
        : {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -6 },
            transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] as const },
          },
    [reduceMotion]
  );

  if (siteSettings.enableMaintenance && !isAdminAuthenticated) {
    const isAr = language === "ar";
    return (
      <div
        className="app-layout"
        dir={isAr ? "rtl" : "ltr"}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <section
          className="glass"
          style={{
            maxWidth: "560px",
            width: "100%",
            padding: "40px 32px",
            borderRadius: "24px",
            textAlign: "center",
            border: "1px solid rgba(16, 185, 129, 0.25)",
          }}
        >
          <img
            src="/logo-dark.webp"
            alt={siteSettings.siteName || "Climatify"}
            width={132}
            height={38}
            style={{ margin: "0 auto 20px", display: "block" }}
          />
          <h1 style={{ fontSize: "1.6rem", marginBottom: "12px" }}>
            {isAr ? "المنصة قيد التحديث المؤقت" : "Scheduled Platform Upgrade"}
          </h1>
          <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: "24px" }}>
            {isAr
              ? `يقوم فريق ${siteSettings.siteName || "Climatify"} حالياً بإجراء تحديثات تقنية لتحسين سرعة وأداء المنصة. سنعود للعمل خلال دقائق.`
              : `The ${siteSettings.siteName || "Climatify"} team is performing a brief technical upgrade. We will be back online shortly.`}
          </p>
          <a
            href={`mailto:${siteSettings.contactEmail || "info@climatify-youth.com"}`}
            className="btn btn-primary"
          >
            {siteSettings.contactEmail || "info@climatify-youth.com"}
          </a>
        </section>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <a className="skip-link" href="#main-content">
        {skipLinkLabel}
      </a>

      <div className="wave-bg" aria-hidden="true"></div>

      <Header isHome={isHome} />

      <main className="main-content-flow" id="main-content" tabIndex={-1}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={location.pathname} {...pageMotion} style={{ width: "100%" }}>
            <Suspense fallback={<RouteLoader />}>
              <FrozenOutlet />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      <MobileBottomNav />

      {widgetsReady && (
        <Suspense fallback={null}>
          <AIChatAssistant />
          <QuickCommandPalette defaultOpen={openPaletteImmediately} />
        </Suspense>
      )}

      {isPortfolioOpen && (
        <Suspense fallback={null}>
          <FullScreenShowcase
            isOpen={isPortfolioOpen}
            initialIndex={activeSlideIndex}
            onClose={closePortfolio}
          />
        </Suspense>
      )}
    </div>
  );
};
