import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { X, ChevronLeft, ChevronRight, Maximize2, Quote, Sparkles } from "lucide-react";
import { mockInternQuotes } from "../../data/staticContent";
import { setScrollLocked } from "../../components/layout/scrollController";
import type { InternQuote } from "../../types";
import "./InternsQuotes.css";

interface InternsQuotesProps {
  onBackToTeam?: () => void;
}

type CommitteeFilter = "all" | "design-web" | "video" | "marketing" | "pr";

export const InternsQuotes: React.FC<InternsQuotesProps> = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const [activeFilter, setActiveFilter] = useState<CommitteeFilter>("all");
  const [albumIndex, setAlbumIndex] = useState<number | null>(null);

  // Filter items
  const filteredQuotes = useMemo(() => {
    if (activeFilter === "all") return mockInternQuotes;
    if (activeFilter === "design-web") {
      return mockInternQuotes.filter((q) =>
        q.committeeKey === "design-web" || q.committeeKey === "web" || q.committeeKey === "design"
      );
    }
    return mockInternQuotes.filter((q) => q.committeeKey === activeFilter);
  }, [activeFilter]);

  // Current active quote in album
  const currentQuote: InternQuote | null =
    albumIndex !== null && filteredQuotes[albumIndex] ? filteredQuotes[albumIndex] : null;

  // Next / Previous navigation
  const handlePrev = useCallback(() => {
    if (albumIndex === null) return;
    setAlbumIndex((prev) => (prev !== null ? (prev > 0 ? prev - 1 : filteredQuotes.length - 1) : null));
  }, [albumIndex, filteredQuotes.length]);

  const handleNext = useCallback(() => {
    if (albumIndex === null) return;
    setAlbumIndex((prev) => (prev !== null ? (prev < filteredQuotes.length - 1 ? prev + 1 : 0) : null));
  }, [albumIndex, filteredQuotes.length]);

  // Keyboard navigation
  useEffect(() => {
    if (albumIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAlbumIndex(null);
      } else if (e.key === "ArrowLeft") {
        if (isAr) handleNext();
        else handlePrev();
      } else if (e.key === "ArrowRight") {
        if (isAr) handlePrev();
        else handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [albumIndex, handleNext, handlePrev, isAr]);

  // Lock body + Lenis scroll when album modal is open
  useEffect(() => {
    if (albumIndex !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setScrollLocked(true);
      return () => {
        document.body.style.overflow = originalOverflow;
        setScrollLocked(false);
      };
    }
  }, [albumIndex]);

  // Touch swipe support for mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0]?.clientX ?? touchStartX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped left
        if (isAr) handlePrev();
        else handleNext();
      } else {
        // Swiped right
        if (isAr) handleNext();
        else handlePrev();
      }
    }
    setTouchStartX(null);
  };

  return (
    <section className="interns-quotes-section" aria-labelledby="interns-quotes-heading">
      {/* Intro Header */}
      <div className="interns-quotes-head text-center">
        <span className="interns-quotes-eyebrow">
          <Sparkles size={14} aria-hidden="true" />
          <span>{isAr ? "رؤى وأقوال متدربي دفعة 2026" : "Interns Voices & Impact Quotes"}</span>
        </span>
        <h3 id="interns-quotes-heading" className="interns-quotes-title">
          {isAr ? "أقوال وتجارب متدربي كلايمتيفاي" : "Climatify Interns Quotes"}
        </h3>
        <p className="interns-quotes-desc">
          {isAr
            ? "تجارب شبابية ملهمة من قلب العمل المناخي، التصميم، البرمجة، والتسويق الرقمي — استعرض ملصقات المتدربين كاملة بنقرة واحدة."
            : "Inspiring perspectives from our youth interns driving sustainability, design, web, and digital climate innovation."}
        </p>

        {/* Minimal Committee Filter Pills */}
        <div className="interns-committee-filters" role="tablist" aria-label="Filter quotes by committee">
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === "all"}
            className={`intern-filter-pill ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            <span>{isAr ? "كافة اللجان" : "All Committees"}</span>
            <span className="filter-pill-count">{mockInternQuotes.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === "design-web"}
            className={`intern-filter-pill ${activeFilter === "design-web" ? "active" : ""}`}
            onClick={() => setActiveFilter("design-web")}
          >
            <span>{isAr ? "الويب والتصميم" : "Design & Web"}</span>
            <span className="filter-pill-count">
              {mockInternQuotes.filter((q) => q.committeeKey === "design-web" || q.committeeKey === "web" || q.committeeKey === "design").length}
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === "video"}
            className={`intern-filter-pill ${activeFilter === "video" ? "active" : ""}`}
            onClick={() => setActiveFilter("video")}
          >
            <span>{isAr ? "المونتاج والفيديو" : "Video Editing"}</span>
            <span className="filter-pill-count">
              {mockInternQuotes.filter((q) => q.committeeKey === "video").length}
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === "marketing"}
            className={`intern-filter-pill ${activeFilter === "marketing" ? "active" : ""}`}
            onClick={() => setActiveFilter("marketing")}
          >
            <span>{isAr ? "التسويق" : "Marketing"}</span>
            <span className="filter-pill-count">
              {mockInternQuotes.filter((q) => q.committeeKey === "marketing").length}
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === "pr"}
            className={`intern-filter-pill ${activeFilter === "pr" ? "active" : ""}`}
            onClick={() => setActiveFilter("pr")}
          >
            <span>{isAr ? "العلاقات العامة" : "Public Relations"}</span>
            <span className="filter-pill-count">
              {mockInternQuotes.filter((q) => q.committeeKey === "pr").length}
            </span>
          </button>
        </div>
      </div>

      {/* Minimal Cards Grid */}
      <div className="interns-quotes-grid">
        {filteredQuotes.map((item, index) => (
          <div
            key={item.id}
            className="intern-quote-card"
            onClick={() => setAlbumIndex(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setAlbumIndex(index);
              }
            }}
            title={isAr ? `انقر لعرض ملصق ${item.nameAr}` : `Click to view ${item.nameEn}'s quote poster`}
          >
            {/* Poster Media Box */}
            <div className="intern-quote-media-wrap">
              <img
                src={item.thumbImage}
                alt={`${item.nameEn} - ${item.committeeEn}`}
                className="intern-quote-thumb-img"
                loading="lazy"
                decoding="async"
              />

              {/* Minimal Committee Badge */}
              <span className="intern-quote-badge">
                {isAr ? item.committeeAr : item.committeeEn}
              </span>

              {/* Hover overlay hint */}
              <div className="intern-quote-hover-overlay">
                <span className="intern-quote-expand-btn">
                  <Maximize2 size={16} aria-hidden="true" />
                  <span>{isAr ? "عرض الملصق الكامل" : "View Poster"}</span>
                </span>
              </div>
            </div>

            {/* Minimal Card Details */}
            <div className="intern-quote-card-details">
              <h4 className="intern-quote-name">{isAr ? item.nameAr : item.nameEn}</h4>
              <p className="intern-quote-snippet">
                “{isAr ? item.quoteAr : item.quoteEn}”
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Album Lightbox Modal */}
      {currentQuote && albumIndex !== null && (
        <div
          className="intern-album-overlay"
          onClick={() => setAlbumIndex(null)}
          role="dialog"
          aria-modal="true"
          data-lenis-prevent
          aria-label={isAr ? `ألبوم متدربي كلايمتيفاي - ${currentQuote.nameAr}` : `Climatify Interns Album - ${currentQuote.nameEn}`}
        >
          <div
            className="intern-album-modal"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top Bar */}
            <div className="intern-album-top-bar">
              <div className="intern-album-meta-left">
                <span className="intern-album-counter">
                  {albumIndex + 1} / {filteredQuotes.length}
                </span>
                <span className="intern-album-badge">
                  {isAr ? currentQuote.committeeAr : currentQuote.committeeEn}
                </span>
              </div>

              <button
                type="button"
                className="intern-album-close-btn"
                onClick={() => setAlbumIndex(null)}
                aria-label={isAr ? "إغلاق الألبوم" : "Close album"}
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Stage with Image and Navigation Arrows */}
            <div className="intern-album-stage">
              <button
                type="button"
                className="intern-album-nav-btn prev"
                onClick={isAr ? handleNext : handlePrev}
                aria-label={isAr ? "الملصق التالي" : "Previous quote"}
                title={isAr ? "السابق (سهم يسار)" : "Previous (Left arrow)"}
              >
                <ChevronLeft size={24} />
              </button>

              <div className="intern-album-image-container">
                <img
                  src={currentQuote.image}
                  alt={`${currentQuote.nameEn} - Climatify Quote Poster`}
                  className="intern-album-full-img"
                />
              </div>

              <button
                type="button"
                className="intern-album-nav-btn next"
                onClick={isAr ? handlePrev : handleNext}
                aria-label={isAr ? "الملصق السابق" : "Next quote"}
                title={isAr ? "التالي (سهم يمين)" : "Next (Right arrow)"}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Caption Area */}
            <div className="intern-album-caption">
              <div className="intern-album-caption-content">
                <div className="intern-album-author-row">
                  <h3 className="intern-album-name">{isAr ? currentQuote.nameAr : currentQuote.nameEn}</h3>
                  <span className="intern-album-subbadge">
                    {isAr ? currentQuote.committeeAr : currentQuote.committeeEn}
                  </span>
                </div>
                <blockquote className="intern-album-quote">
                  <Quote size={18} className="album-quote-icon" aria-hidden="true" />
                  <span>{isAr ? currentQuote.quoteAr : currentQuote.quoteEn}</span>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

