import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Maximize2,
  Minimize2,
  ArrowRight,
  ArrowLeft,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import {
  portfolioProjects,
  PORTFOLIO_CATEGORIES,
} from "../../services/portfolioData";
import type { ShowcaseProject, ProjectAction } from "../../services/portfolioData";
import { setScrollLocked } from "../layout/scrollController";
import "./FullScreenShowcase.css";

interface FullScreenShowcaseProps {
  isOpen: boolean;
  initialIndex?: number;
  onClose: () => void;
}

export const FullScreenShowcase: React.FC<FullScreenShowcaseProps> = ({
  isOpen,
  initialIndex = 0,
  onClose,
}) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isAr = language === "ar";
  const isDark = theme === "dark";

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // Mobile & Zoom enhancements
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isStripVisible, setIsStripVisible] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth > 768;
    }
    return true;
  });
  const [showSwipeHint, setShowSwipeHint] = useState<boolean>(true);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const thumbsStripRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const prevFocusedRef = useRef<HTMLElement | null>(null);
  const slideBoxRef = useRef<HTMLDivElement>(null);

  // Touch & Pinch tracking refs
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const pinchStartRef = useRef<{ dist: number; zoom: number } | null>(null);
  const lastTapTimeRef = useRef<number>(0);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const isStationaryTapRef = useRef<boolean>(true);

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return portfolioProjects;
    return portfolioProjects.filter((p) => p.categoryKey === activeCategory);
  }, [activeCategory]);

  // Current project
  const currentProject: ShowcaseProject =
    filteredProjects[currentIndex] ?? filteredProjects[0] ?? portfolioProjects[0]!;

  // Sync initial index when opened
  useEffect(() => {
    if (isOpen) {
      prevFocusedRef.current = document.activeElement as HTMLElement;
      setCurrentIndex(Math.max(0, Math.min(initialIndex, portfolioProjects.length - 1)));
      setScrollLocked(true);
      document.body.style.overflow = "hidden";
      setShowSwipeHint(true);
      setTimeout(() => closeBtnRef.current?.focus(), 60);
    } else {
      setScrollLocked(false);
      document.body.style.overflow = "";
      prevFocusedRef.current?.focus?.();
    }
    return () => {
      setScrollLocked(false);
      document.body.style.overflow = "";
    };
  }, [isOpen, initialIndex]);

  // Auto fade-out swipe hint on mobile after 5 seconds
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Reset image loading, zoom, swipe offset, and pan state on slide change
  useEffect(() => {
    setImageLoaded(false);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSwipeOffset(0);
    setIsSwiping(false);
  }, [currentIndex, currentProject.image]);

  // Preload adjacent slides for instantaneous transitions
  useEffect(() => {
    if (!isOpen) return;
    const preload = (url: string) => {
      if (!url) return;
      const img = new Image();
      img.src = url;
    };
    const len = filteredProjects.length;
    if (len > 1) {
      const nextIdx = (currentIndex + 1) % len;
      const prevIdx = (currentIndex - 1 + len) % len;
      const nextSlide = filteredProjects[nextIdx];
      const prevSlide = filteredProjects[prevIdx];
      if (nextSlide?.image) preload(nextSlide.image);
      if (prevSlide?.image) preload(prevSlide.image);
    }
  }, [currentIndex, filteredProjects, isOpen]);

  // Scroll active thumbnail into center view
  useEffect(() => {
    if (!isOpen || !thumbsStripRef.current || !isStripVisible) return;
    const activeEl = thumbsStripRef.current.querySelector<HTMLElement>(
      `[data-thumb-index="${currentIndex}"]`
    );
    if (activeEl && typeof activeEl.scrollIntoView === "function") {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex, isOpen, isStripVisible]);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : filteredProjects.length - 1
    );
  }, [filteredProjects.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev < filteredProjects.length - 1 ? prev + 1 : 0
    );
  }, [filteredProjects.length]);

  const handleSelectSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Zoom handlers
  const handleDoubleTap = useCallback(() => {
    setShowSwipeHint(false);
    setZoomLevel((prev) => {
      if (prev > 1) {
        setPanOffset({ x: 0, y: 0 });
        return 1;
      }
      return 2.2;
    });
  }, []);

  const toggleZoom = useCallback(() => {
    setShowSwipeHint(false);
    setZoomLevel((prev) => {
      if (prev > 1) {
        setPanOffset({ x: 0, y: 0 });
        return 1;
      }
      return 2.2;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  // Touch event handlers (Pinch zoom, drag pan, swipe navigation)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Multi-touch pinch zoom
      setIsSwiping(false);
      setIsDragging(false);
      setSwipeOffset(0);
      const t1 = e.touches[0]!;
      const t2 = e.touches[1]!;
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      pinchStartRef.current = {
        dist: dist > 0 ? dist : 1,
        zoom: zoomLevel,
      };
      return;
    }

    if (e.touches.length === 1) {
      const t = e.touches[0]!;
      isStationaryTapRef.current = true;
      touchStartRef.current = {
        x: t.clientX,
        y: t.clientY,
        time: Date.now(),
      };

      if (zoomLevel > 1) {
        setIsDragging(true);
        dragStartRef.current = {
          x: t.clientX,
          y: t.clientY,
          panX: panOffset.x,
          panY: panOffset.y,
        };
      } else {
        setIsSwiping(true);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // 2-finger proportional pinch zoom
    if (e.touches.length === 2 && pinchStartRef.current && pinchStartRef.current.dist > 0) {
      const t1 = e.touches[0]!;
      const t2 = e.touches[1]!;
      const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const scale = (currentDist / pinchStartRef.current.dist) * pinchStartRef.current.zoom;
      const newZoom = Math.max(1, Math.min(3.5, scale));
      setZoomLevel(newZoom);
      if (newZoom <= 1.05) {
        setPanOffset({ x: 0, y: 0 });
      }
      return;
    }

    // 1 finger: pan if zoomed, or live touch swipe if not zoomed
    if (e.touches.length === 1 && touchStartRef.current) {
      const t = e.touches[0]!;
      const dx = t.clientX - touchStartRef.current.x;
      const dy = t.clientY - touchStartRef.current.y;
      const moveDist = Math.hypot(dx, dy);

      if (moveDist > 10) {
        isStationaryTapRef.current = false;
      }

      if (zoomLevel > 1 && dragStartRef.current) {
        const boxW = slideBoxRef.current?.offsetWidth || 360;
        const boxH = slideBoxRef.current?.offsetHeight || 202;
        const maxPanX = Math.max(0, (boxW * (zoomLevel - 1)) / 2);
        const maxPanY = Math.max(0, (boxH * (zoomLevel - 1)) / 2);

        setPanOffset({
          x: Math.max(-maxPanX, Math.min(maxPanX, dragStartRef.current.panX + dx)),
          y: Math.max(-maxPanY, Math.min(maxPanY, dragStartRef.current.panY + dy)),
        });
      } else if (zoomLevel <= 1 && isSwiping) {
        // Live visual translation while dragging
        if (Math.abs(dx) > Math.abs(dy) * 0.7) {
          setSwipeOffset(dx);
        }
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    setIsSwiping(false);
    dragStartRef.current = null;
    pinchStartRef.current = null;

    if (touchStartRef.current) {
      const changedTouch = e.changedTouches[0];
      const endX = changedTouch ? changedTouch.clientX : touchStartRef.current.x;
      const endY = changedTouch ? changedTouch.clientY : touchStartRef.current.y;
      const dx = endX - touchStartRef.current.x;
      const dy = endY - touchStartRef.current.y;
      const dt = Date.now() - touchStartRef.current.time;

      if (isStationaryTapRef.current) {
        // Stationary tap -> check double-tap
        const now = Date.now();
        if (now - lastTapTimeRef.current < 320) {
          lastTapTimeRef.current = 0;
          toggleZoom();
        } else {
          lastTapTimeRef.current = now;
        }
      } else {
        // Was a drag or swipe
        lastTapTimeRef.current = 0;

        if (zoomLevel <= 1) {
          const isHorizontal = Math.abs(dx) > Math.abs(dy) * 1.1;
          const isQuickFlick = Math.abs(dx) > 35 && dt < 450;
          const isFarDrag = Math.abs(dx) > 55;

          if (isHorizontal && (isQuickFlick || isFarDrag)) {
            setShowSwipeHint(false);
            if (dx < 0) {
              handleNext();
            } else {
              handlePrev();
            }
          }
        }
      }
    }

    setSwipeOffset(0);
    touchStartRef.current = null;
  };

  // Mouse pan handlers when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: panOffset.x,
        panY: panOffset.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1 && dragStartRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      const boxW = slideBoxRef.current?.offsetWidth || 800;
      const boxH = slideBoxRef.current?.offsetHeight || 450;
      const maxPanX = Math.max(0, (boxW * (zoomLevel - 1)) / 2);
      const maxPanY = Math.max(0, (boxH * (zoomLevel - 1)) / 2);

      setPanOffset({
        x: Math.max(-maxPanX, Math.min(maxPanX, dragStartRef.current.panX + dx)),
        y: Math.max(-maxPanY, Math.min(maxPanY, dragStartRef.current.panY + dy)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // Keyboard navigation & trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (isAr) handleNext();
        else handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (isAr) handlePrev();
        else handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isAr, handlePrev, handleNext, onClose]);

  // Fullscreen API toggle
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch {
      // Fullscreen not supported or blocked
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const slideTransform = useMemo(() => {
    if (zoomLevel > 1) {
      return `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoomLevel})`;
    }
    if (swipeOffset !== 0) {
      return `translate3d(${swipeOffset}px, 0, 0)`;
    }
    return "translate3d(0, 0, 0)";
  }, [zoomLevel, panOffset.x, panOffset.y, swipeOffset]);

  if (!isOpen) return null;

  const currentNumberStr = String(currentProject.pageNumber).padStart(2, "0");
  const totalCountStr = String(portfolioProjects.length).padStart(2, "0");
  const progressPercent = Math.min(
    100,
    Math.max(0, ((currentIndex + 1) / filteredProjects.length) * 100)
  );

  return (
    <div
      className={`climatify-showcase-backdrop ${isDark ? "theme-dark" : "theme-light"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={isAr ? "بورتفوليو كلايمتيفاي 2025" : "Climatify Portfolio 2025"}
      data-lenis-prevent
    >
      <div
        ref={containerRef}
        className={`climatify-showcase-frame ${isDark ? "theme-dark" : "theme-light"} ${
          isFullscreen ? "fullscreen" : ""
        }`}
      >
        {/* Slide Progress Indicator Bar */}
        <div className="showcase-progress-track" aria-hidden="true">
          <div
            className="showcase-progress-bar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* ====================================================================
            1. TOP HEADER (Brand, Category Pills & Top Controls)
            ==================================================================== */}
        <header className="showcase-top-header">
          {/* Left: Brand Lockup */}
          <div className="showcase-brand-lockup">
            <img
              src={isDark ? "/logo-white.png" : "/logo-dark.png"}
              alt="Climatify"
              className="showcase-brand-icon"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="showcase-brand-titles">
              <span className="showcase-brand-name">CLIMATIFY</span>
              <span className="showcase-brand-sub">
                {isAr ? "البورتفوليو الرقمي" : "PORTFOLIO 2025"}
              </span>
            </div>
          </div>

          {/* Center: Category Filter Pills (Desktop View) */}
          <div className="showcase-categories-bar desktop-categories" role="tablist">
            {PORTFOLIO_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`showcase-cat-pill ${isActive ? "active" : ""}`}
                  onClick={() => {
                    setActiveCategory(cat.key);
                    setCurrentIndex(0);
                  }}
                >
                  <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Counter, Zoom, Actions & Close */}
          <div className="showcase-top-actions">
            {/* Slide Counter with Accent Bar */}
            <div className="showcase-header-counter" aria-live="polite">
              <span className="current-num">{currentNumberStr}</span>
              <span className="total-num">/{totalCountStr}</span>
              <div className="counter-accent-bar" aria-hidden="true" />
            </div>

            {/* Zoom In/Out Toggle Button (Mobile & Desktop) */}
            <button
              type="button"
              className={`showcase-icon-btn ${zoomLevel > 1 ? "active-zoom" : ""}`}
              onClick={toggleZoom}
              title={
                zoomLevel > 1
                  ? isAr
                    ? "إعادة الحجم الافتراضي (1x)"
                    : "Reset Zoom (1x)"
                  : isAr
                  ? "تكبير الشريحة (2.2x)"
                  : "Zoom In (2.2x)"
              }
              aria-label={zoomLevel > 1 ? "Reset Zoom" : "Zoom In"}
            >
              {zoomLevel > 1 ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
            </button>

            {/* Download PDF Button */}
            <a
              href="/climatify-portfolio-2025.pdf"
              download="Climatify-Portfolio-2025.pdf"
              className="showcase-icon-btn"
              title={isAr ? "تحميل ملف PDF الأصلي" : "Download Original PDF"}
              aria-label={isAr ? "تحميل ملف PDF الأصلي" : "Download Original PDF"}
            >
              <Download size={16} />
            </a>

            {/* Fullscreen API Toggle */}
            <button
              type="button"
              className="showcase-icon-btn desktop-only-btn"
              onClick={toggleFullscreen}
              title={
                isFullscreen
                  ? isAr
                    ? "إنهاء ملء الشاشة"
                    : "Exit Fullscreen"
                  : isAr
                  ? "ملء الشاشة"
                  : "Fullscreen"
              }
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            {/* Close Button */}
            <button
              ref={closeBtnRef}
              type="button"
              className="showcase-close-circle"
              onClick={onClose}
              title={isAr ? "إغلاق (Esc)" : "Close (Esc)"}
              aria-label={isAr ? "إغلاق" : "Close"}
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Mobile Category Filter Bar (Smooth horizontal scrolling on phones) */}
        <div
          className="showcase-mobile-categories-strip"
          role="tablist"
          aria-label={isAr ? "تصنيفات البورتفوليو" : "Portfolio Categories"}
        >
          {PORTFOLIO_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`showcase-cat-pill mobile ${isActive ? "active" : ""}`}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setCurrentIndex(0);
                }}
              >
                <span>{isAr ? cat.labelAr : cat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* ====================================================================
            2. MAIN SLIDE CANVAS (Touch swipeable, double-tap zoomable, 16:9 ratio)
            ==================================================================== */}
        <div
          className="showcase-canvas-area"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Floating Zoom Indicator & Reset Control */}
          {zoomLevel > 1 && (
            <div className="showcase-zoom-floating-badge" role="status">
              <span>{isAr ? "تكبير 2.2x • اسحب للتحريك" : "2.2x • Drag to pan"}</span>
              <button
                type="button"
                className="showcase-zoom-reset-btn"
                onClick={resetZoom}
                title={isAr ? "إعادة الضبط" : "Reset Zoom"}
              >
                <RotateCcw size={12} />
                <span>{isAr ? "إعادة" : "Reset"}</span>
              </button>
            </div>
          )}

          {/* Mobile Swipe / Tap Hint Pill */}
          {showSwipeHint && (
            <div
              className="showcase-swipe-hint-pill"
              onClick={() => setShowSwipeHint(false)}
              role="note"
            >
              <span>
                {isAr
                  ? "اسحب للتنقل • انقر مرتين للتكبير"
                  : "Swipe to browse • Double-tap to zoom"}
              </span>
            </div>
          )}

          {/* Side Navigation Arrow - Prev */}
          <button
            type="button"
            className="showcase-side-nav prev"
            onClick={handlePrev}
            aria-label={isAr ? "الشريحة السابقة" : "Previous Slide"}
          >
            {isAr ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
          </button>

          {/* 16:9 Ratio Clean Slide Container */}
          <div
            ref={slideBoxRef}
            className="showcase-slide-box"
            style={{
              cursor: zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "default",
            }}
            onDoubleClick={handleDoubleTap}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {!imageLoaded && (
              <div className="showcase-image-loader" aria-hidden="true">
                <div className="showcase-spinner" />
              </div>
            )}
            <img
              src={currentProject.image}
              alt={isAr ? currentProject.altAr : currentProject.altEn}
              className={`showcase-slide-image ${imageLoaded ? "loaded" : "loading"}`}
              style={{
                transform: slideTransform,
                transition: isDragging || isSwiping ? "none" : "transform 0.22s ease-out, opacity 0.25s ease",
              }}
              onLoad={() => setImageLoaded(true)}
              draggable={false}
            />
          </div>

          {/* Side Navigation Arrow - Next */}
          <button
            type="button"
            className="showcase-side-nav next"
            onClick={handleNext}
            aria-label={isAr ? "الشريحة التالية" : "Next Slide"}
          >
            {isAr ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
          </button>
        </div>

        {/* ====================================================================
            3. SLIDE INFORMATION & ACTION RIBBON
            ==================================================================== */}
        <div className="showcase-info-ribbon">
          <div className="showcase-ribbon-left">
            <span className="showcase-ribbon-cat">
              — {isAr ? currentProject.categoryAr : currentProject.categoryEn} • {currentNumberStr}
            </span>
            <h2 className="showcase-ribbon-title">
              {isAr ? currentProject.titleAr : currentProject.titleEn}
            </h2>
            <p className="showcase-ribbon-desc">
              {isAr ? currentProject.descriptionAr : currentProject.descriptionEn}
            </p>
          </div>

          <div className="showcase-ribbon-right">
            {currentProject.actions && currentProject.actions.length > 0 ? (
              currentProject.actions.map((act: ProjectAction) => {
                if (act.type === "internal") {
                  return (
                    <Link
                      key={act.id}
                      to={act.href}
                      onClick={onClose}
                      className="showcase-ribbon-action-btn"
                    >
                      <span>{isAr ? act.labelAr : act.labelEn}</span>
                      {isAr ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
                    </Link>
                  );
                }
                return (
                  <a
                    key={act.id}
                    href={act.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="showcase-ribbon-action-btn"
                  >
                    <span>{isAr ? act.labelAr : act.labelEn}</span>
                    <ExternalLink size={15} />
                  </a>
                );
              })
            ) : (
              <a
                href="/climatify-portfolio-2025.pdf"
                download="Climatify-Portfolio-2025.pdf"
                className="showcase-ribbon-action-btn secondary"
              >
                <span>{isAr ? "تحميل ملف PDF" : "Download PDF"}</span>
                <Download size={14} />
              </a>
            )}
          </div>
        </div>

        {/* ====================================================================
            4. BOTTOM FEATURED STRIP (Horizontal numbered thumbnail cards)
            ==================================================================== */}
        <footer
          className={`showcase-bottom-strip-container ${
            isStripVisible ? "expanded" : "collapsed"
          }`}
        >
          <div className="showcase-strip-header">
            <div className="strip-title-wrapper">
              <span className="strip-title">
                {isAr
                  ? `شرائح البورتفوليو (${filteredProjects.length})`
                  : `PORTFOLIO SLIDES (${filteredProjects.length})`}
              </span>
            </div>

            <div className="strip-hints">
              <span className="strip-hint-dot" aria-hidden="true">•</span>
              <span className="strip-hint-text">
                {isAr
                  ? "اختر أي شريحة للاستعراض المباشر • اسحب أو استخدم ← → للتنقل • Esc للإغلاق"
                  : "SELECT A SLIDE TO EXPLORE • Swipe or use ← → to navigate • Esc to close"}
              </span>
            </div>

            {/* Mobile / Compact Toggle Button */}
            <button
              type="button"
              className="showcase-strip-toggle-btn"
              onClick={() => setIsStripVisible((v) => !v)}
              title={
                isStripVisible
                  ? isAr
                    ? "إخفاء شريط الشرائح"
                    : "Hide Thumbnails"
                  : isAr
                  ? "إظهار شريط الشرائح"
                  : "Show Thumbnails"
              }
              aria-label="Toggle Thumbnails Strip"
            >
              {isStripVisible ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              <span className="toggle-btn-label">
                {isStripVisible
                  ? isAr
                    ? "تصغير"
                    : "Minimize"
                  : isAr
                  ? "الشرائح"
                  : "Slides"}
              </span>
            </button>
          </div>

          {isStripVisible && (
            <div
              ref={thumbsStripRef}
              className="showcase-cards-strip"
              role="tablist"
              aria-label={isAr ? "شريط شرائح البورتفوليو" : "Portfolio Slides Strip"}
            >
              {filteredProjects.map((proj, idx) => {
                const isActive = idx === currentIndex;
                const cardNumStr = String(proj.pageNumber).padStart(2, "0");
                return (
                  <button
                    key={proj.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    data-thumb-index={idx}
                    className={`showcase-thumb-card ${isActive ? "active" : ""}`}
                    onClick={() => handleSelectSlide(idx)}
                  >
                    <img
                      src={proj.thumbnail}
                      alt=""
                      className="thumb-card-bg"
                      loading="lazy"
                    />
                    <div className="thumb-card-gradient" aria-hidden="true" />
                    <span className="thumb-card-watermark">{cardNumStr}</span>
                    <div className="thumb-card-caption">
                      <span className="thumb-card-title">
                        {isAr ? proj.titleAr : proj.titleEn}
                      </span>
                      <span className="thumb-card-cat">
                        {isAr ? proj.categoryAr : proj.categoryEn}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </footer>
      </div>
    </div>
  );
};
