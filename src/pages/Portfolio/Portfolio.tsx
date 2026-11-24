import React, { useState, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import {
  Sparkles,
  Maximize2,
  Download,
  Layers,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Search,
  Eye,
} from "lucide-react";
import {
  portfolioProjects,
  PORTFOLIO_CATEGORIES,
} from "../../services/portfolioData";
import { usePortfolioStore } from "../../store/usePortfolioStore";
import { SEO } from "../../components/common/SEO";
import "./Portfolio.css";

export const Portfolio: React.FC = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const isAr = language === "ar";
  const openPortfolio = usePortfolioStore((state) => state.openPortfolio);

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Open fullscreen showcase automatically only when explicitly requested via ?showcase=1
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("showcase") === "1" || params.get("view") === "showcase") {
      openPortfolio(0);
    }
  }, [location.search, openPortfolio]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return portfolioProjects.filter((proj) => {
      const matchCat =
        activeCategory === "all" || proj.categoryKey === activeCategory;
      if (!matchCat) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        proj.titleEn.toLowerCase().includes(q) ||
        proj.titleAr.includes(q) ||
        proj.descriptionEn.toLowerCase().includes(q) ||
        proj.descriptionAr.includes(q) ||
        String(proj.pageNumber).includes(q)
      );
    });
  }, [activeCategory, searchQuery]);

  // Open modal at specific slide
  const openShowcaseAt = useCallback(
    (pageNumber: number) => {
      const globalIndex = portfolioProjects.findIndex(
        (p) => p.pageNumber === pageNumber
      );
      openPortfolio(globalIndex >= 0 ? globalIndex : 0);
    },
    [openPortfolio]
  );

  return (
    <div className="portfolio-page-container">
      <SEO
        title={isAr ? "بورتفوليو كلايمتفاي التفاعلي 2025" : "Official Interactive Portfolio 2025"}
        description={
          isAr
            ? "استعرض المحفظة المتكاملة لشركة كلايمتيفاي عبر 53 شريحة تفاعلية توثق المنصات الرقمية، البرامج القيادية، والمشاركات الدولية في COP28 و COP29."
            : "Explore Climatify's comprehensive 53-slide interactive portfolio documenting digital climate platforms, leadership programs, and global COP milestones."
        }
        image="https://climatify-youth.com/future-100-recognition.jpg"
        breadcrumbs={[
          { name: isAr ? "الرئيسية" : "Home", path: "/" },
          { name: isAr ? "البورتفوليو" : "Portfolio", path: "/portfolio" },
        ]}
      />
      {/* 1. Hero Header Section */}
      <section className="portfolio-hero-section">
        <div className="portfolio-hero-bg" aria-hidden="true" />
        <div className="container portfolio-hero-inner">
          <div className="portfolio-hero-content">
            <span className="portfolio-hero-eyebrow">
              <Sparkles size={16} />
              <span>
                {isAr
                  ? "البورتفوليو الرقمي الشامل 2025"
                  : "Official 2025 Digital Portfolio"}
              </span>
            </span>

            <h1 className="portfolio-hero-title">
              {isAr
                ? "بورتفوليو كلايمتيفاي — الرقمنة والتمكين والعمل المناخي"
                : "Climatify Portfolio — Digitization, Empowerment & Climate Action"}
            </h1>

            <p className="portfolio-hero-lead">
              {isAr
                ? "استعرض المحفظة المتكاملة لشركة كلايمتيفاي لتقنية المعلومات عبر 53 شريحة توثق منصاتنا الرقمية، البرامج القيادية والمعسكرات، الهاكاثونات والألعاب البيئية، والمشاركات الدولية في مؤتمرات الأطراف."
                : "Explore Climatify's comprehensive 53-slide portfolio showcasing our digital platforms, leadership programs, youth camps, environmental games, and international COP milestones."}
            </p>

            <div className="portfolio-hero-actions">
              <button
                type="button"
                className="btn btn-primary portfolio-btn-launch"
                onClick={() => openShowcaseAt(1)}
              >
                <Maximize2 size={18} />
                <span>
                  {isAr
                    ? "استعراض البورتفوليو التفاعلي بملء الشاشة"
                    : "Launch Full-Screen Interactive Showcase"}
                </span>
              </button>

              <a
                href="/climatify-portfolio-2025.pdf"
                download="Climatify-Portfolio-2025.pdf"
                className="btn btn-glass portfolio-btn-download"
              >
                <Download size={18} />
                <span>
                  {isAr ? "تحميل ملف الـ PDF الأصلي" : "Download Original PDF"}
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Impact Ribbon */}
      <section className="portfolio-stats-ribbon">
        <div className="container portfolio-stats-grid">
          <div className="portfolio-stat-item">
            <span className="stat-number">53</span>
            <span className="stat-label">
              {isAr ? "شريحة بورتفوليو موثقة" : "Documented Slides"}
            </span>
          </div>
          <div className="portfolio-stat-item">
            <span className="stat-number">30,000+</span>
            <span className="stat-label">
              {isAr ? "شاب وشابة تم الوصول إليهم" : "Youth Reached"}
            </span>
          </div>
          <div className="portfolio-stat-item">
            <span className="stat-number">1,000+</span>
            <span className="stat-label">
              {isAr ? "قائد مناخي تم تمكينهم" : "Leaders Empowered"}
            </span>
          </div>
          <div className="portfolio-stat-item">
            <span className="stat-number">250+</span>
            <span className="stat-label">
              {isAr ? "مشروع ريادي مدعوم" : "Green Ventures"}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Main Gallery Browser */}
      <div className="container portfolio-main-area">
        {/* Filter & Search Bar */}
        <div className="portfolio-controls-bar">
          <div className="portfolio-pills-row" role="tablist">
            {PORTFOLIO_CATEGORIES.map((cat) => {
              const count =
                cat.key === "all"
                  ? portfolioProjects.length
                  : portfolioProjects.filter((p) => p.categoryKey === cat.key).length;
              return (
                <button
                  key={cat.key}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat.key}
                  className={`portfolio-filter-pill ${
                    activeCategory === cat.key ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                  <span className="pill-counter">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="portfolio-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder={
                isAr ? "بحث في شرائح البورتفوليو..." : "Search portfolio slides..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="portfolio-search-input"
            />
          </div>
        </div>

        {/* Slides Grid */}
        {filteredProjects.length > 0 ? (
          <div className="portfolio-slides-grid">
            {filteredProjects.map((proj) => (
              <article
                key={proj.id}
                className="portfolio-card"
                onClick={() => openShowcaseAt(proj.pageNumber)}
              >
                <div className="portfolio-card-media">
                  <img
                    src={proj.thumbnail}
                    alt={isAr ? proj.altAr : proj.altEn}
                    className="portfolio-card-thumb"
                    loading="lazy"
                  />
                  <div className="portfolio-card-number">
                    {String(proj.pageNumber).padStart(2, "0")}
                  </div>
                  <div className="portfolio-card-overlay-trigger">
                    <Eye size={20} />
                    <span>{isAr ? "عرض بملء الشاشة" : "View Fullscreen"}</span>
                  </div>
                </div>

                <div className="portfolio-card-body">
                  <div className="portfolio-card-cat">
                    <Layers size={12} />
                    <span>
                      {isAr ? proj.categoryAr : proj.categoryEn}
                    </span>
                  </div>

                  <h3 className="portfolio-card-title">
                    {isAr ? proj.titleAr : proj.titleEn}
                  </h3>

                  <p className="portfolio-card-desc">
                    {isAr ? proj.descriptionAr : proj.descriptionEn}
                  </p>

                  {proj.actions && proj.actions.length > 0 && (
                    <div
                      className="portfolio-card-actions-preview"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {proj.actions.slice(0, 2).map((act) => {
                        if (act.type === "internal") {
                          return (
                            <Link
                              key={act.id}
                              to={act.href}
                              className="portfolio-mini-link"
                            >
                              <span>{isAr ? act.labelAr : act.labelEn}</span>
                              {isAr ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                            </Link>
                          );
                        }
                        return (
                          <a
                            key={act.id}
                            href={act.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="portfolio-mini-link"
                          >
                            <ExternalLink size={13} />
                            <span>{isAr ? act.labelAr : act.labelEn}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="portfolio-empty-state">
            <p>
              {isAr
                ? "لا توجد شرائح تطابق معايير البحث الحالية."
                : "No portfolio slides match the current search."}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
            >
              {isAr ? "عرض جميع الشرائح" : "Show All Slides"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
