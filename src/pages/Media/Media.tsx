import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { apiService, ApiError } from "../../services/api";
import { RouteLoader } from "../../components/common/RouteLoader";
import { EmptyState } from "../../components/ui/EmptyState";
import type { BlogPost } from "../../types";
import {
  Calendar, User, ArrowRight, ArrowLeft,
  FileSpreadsheet, Sparkles, Download, ExternalLink,
  Search, X
} from "lucide-react";
import { SEO } from "../../components/common/SEO";
import "./Media.css";

const localizeError = (err: unknown, language: string): string => {
  if (err instanceof ApiError) return err.localizedMessage(language);
  return language === "ar" ? "حدث خطأ غير متوقع أثناء تحميل المقالات." : "An unexpected error occurred while loading the articles.";
};

export const Media: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState(qParam);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set("q", val);
    } else {
      newParams.delete("q");
    }
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.getBlogPosts();
        if (controller.signal.aborted) return;
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (controller.signal.aborted) return;
        setPosts([]);
        setError(err);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [reloadKey]);

  // Featured post: The Heliopolis MoU signing post if present, or the first post
  const featuredPost = useMemo(() => {
    const heliopolis = posts.find((p) => p.id === "heliopolis-mou-signing");
    return heliopolis || posts[0] || null;
  }, [posts]);

  // Filter other posts by category and search query (deduplicating featuredPost on default view)
  const filteredPosts = useMemo(() => {
    let result = posts;
    const q = searchQuery.trim().toLowerCase();
    if (!q && selectedCategory === "all" && featuredPost && posts.length > 1) {
      result = result.filter((p) => p.id !== featuredPost.id);
    }
    if (selectedCategory !== "all") {
      result = result.filter(
        (p) =>
          p.categoryEn.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          p.categoryAr.includes(selectedCategory)
      );
    }
    if (q) {
      result = result.filter(
        (p) =>
          p.titleEn.toLowerCase().includes(q) ||
          p.titleAr.toLowerCase().includes(q) ||
          p.excerptEn.toLowerCase().includes(q) ||
          p.excerptAr.toLowerCase().includes(q) ||
          p.contentEn.toLowerCase().includes(q) ||
          p.contentAr.toLowerCase().includes(q)
      );
    }
    return result;
  }, [posts, selectedCategory, searchQuery, featuredPost]);

  return (
    <div className="media-page-container container">
      <SEO
        title={isAr ? "المركز الإعلامي والتقارير الصحفية" : "Media Center & Official Press"}
        description={
          isAr
            ? "تابع أحدث أخبار مبادرات كلايمتفاي، التقارير السنوية المعتمدة، تغطيات مؤتمرات المناخ، وتوقيع مذكرات التفاهم الاستراتيجية."
            : "Follow the latest Climatify climate initiatives, certified annual progress reports, climate summit coverage, and strategic MoUs."
        }
        breadcrumbs={[
          { name: isAr ? "الرئيسية" : "Home", path: "/" },
          { name: isAr ? "المركز الإعلامي" : "Media Center", path: "/media" },
        ]}
      />
      {/* 1. Header */}
      <section className="media-header text-center">
        <span className="eyebrow">{isAr ? "المركز الإعلامي" : "Media Center"}</span>
        <h1 className="section-title">
          {isAr ? "أخبار كلايمتيفاي والبيانات الصحفية" : "Climatify News & Press Releases"}
        </h1>
        <p className="section-lead mx-auto">
          {isAr
            ? "تابع أحدث شراكاتنا الميدانية، الفعاليات التوعوية، والتقرير السنوي لتقدم مبادرة كلايمتيفاي."
            : "Follow our strategic field partnerships, awareness campaigns, and official annual progress reports."}
        </p>
      </section>

      {/* 2. Official Annual Progress Report Banner (التقرير السنوي بدل مبادرة كما ورد في التعديلات) */}
      <section className="media-annual-report-banner card glass" aria-labelledby="annual-report-title">
        <div className="annual-report-banner-grid">
          <div className="annual-report-icon-box">
            <FileSpreadsheet size={36} />
          </div>
          <div className="annual-report-copy">
            <span className="annual-report-tag">{isAr ? "الوثيقة الرسمية المعتمدة" : "Official Publication"}</span>
            <h2 id="annual-report-title">
              {isAr ? "التقرير السنوي لتقدم كلايمتيفاي" : "Climatify Annual Progress Report"}
            </h2>
            <p>
              {isAr
                ? "استكشف التقرير السنوي الشامل الذي يوثق أرقام الأثر المعتمدة، والتحالفات الاستراتيجية، ومخرجات برامج ومخيمات الشباب المناخية."
                : "Explore our official annual report documenting verified impact milestones, partner alliances, and regional youth climate action outcomes."}
            </p>
          </div>
          <div className="annual-report-cta-box">
            <a
              href="/climatify-annual-report.pdf"
              download="Climatify-Annual-Impact-Report.pdf"
              className="btn btn-primary annual-download-btn"
            >
              <Download size={18} />
              <span>{isAr ? "تحميل التقرير السنوي (PDF)" : "Download Annual Report (PDF)"}</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* 3. News & Press Releases Grid */}
      <section className="media-posts section">
        {loading && <RouteLoader label={isAr ? "جارٍ تحميل المقالات…" : "Loading articles…"} />}

          {!loading && error !== null && (
            <EmptyState
              type="error"
              titleEn="We couldn't load the articles"
              titleAr="تعذّر تحميل المقالات"
              descriptionEn={localizeError(error, "en")}
              descriptionAr={localizeError(error, "ar")}
              actionEn="Try again"
              actionAr="إعادة المحاولة"
              onAction={() => setReloadKey((key) => key + 1)}
            />
          )}

          {!loading && error === null && posts.length === 0 && (
            <EmptyState
              type="empty"
              titleEn="No articles published yet"
              titleAr="لا توجد مقالات منشورة بعد"
              descriptionEn="New stories and reports will appear here as soon as they are published."
              descriptionAr="ستظهر الأخبار والتقارير الجديدة هنا فور نشرها."
              actionEn="Refresh"
              actionAr="تحديث"
              onAction={() => setReloadKey((key) => key + 1)}
            />
          )}

          {!loading && error === null && posts.length > 0 && (
            <>
              {/* Featured News Hero: Heliopolis MoU Signing */}
              {featuredPost && (
                <div className="media-featured-news-card card glass">
                  <div className="featured-news-img-col">
                    <img
                      src={featuredPost.image}
                      alt={isAr ? featuredPost.titleAr : featuredPost.titleEn}
                      className="featured-news-cover"
                      fetchPriority="high"
                      decoding="async"
                    />
                    <span className="featured-news-pill">
                      <Sparkles size={14} />
                      <span>{isAr ? "شراكة استراتيجية بارزة" : "Key Partnership Milestone"}</span>
                    </span>
                  </div>
                  <div className="featured-news-content-col">
                    <div className="post-meta-details-row">
                      <span>
                        <Calendar size={14} aria-hidden="true" />
                        {featuredPost.date}
                      </span>
                      <span>
                        <User size={14} aria-hidden="true" />
                        {isAr ? featuredPost.authorAr : featuredPost.authorEn}
                      </span>
                    </div>

                    <h2>{isAr ? featuredPost.titleAr : featuredPost.titleEn}</h2>
                    <p className="featured-excerpt">
                      {isAr ? featuredPost.contentAr : featuredPost.contentEn}
                    </p>

                    <Link to={`/blog/${featuredPost.id}`} className="btn btn-primary featured-cta-btn">
                      <span>{isAr ? "قراءة التغطية الكاملة" : "Read Full Story"}</span>
                      {isAr ? <ArrowLeft size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
                    </Link>
                  </div>
                </div>
              )}

              {/* Search Bar & Category Filter Pills */}
              <div className="news-search-filter-container">
                <div className="news-search-bar" role="search">
                  <Search size={17} className="news-search-icon" aria-hidden="true" />
                  <input
                    type="search"
                    className="news-search-input"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder={
                      isAr
                        ? "ابحث في البيانات الصحفية والتقارير والشراكات..."
                        : "Search press releases, reports, and partnerships..."
                    }
                    aria-label={isAr ? "البحث في الأخبار" : "Search articles"}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="news-search-clear-btn"
                      onClick={() => handleSearchChange("")}
                      aria-label={isAr ? "مسح البحث" : "Clear search"}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <div className="news-filter-pills-row">
                  {[
                    { key: "all", labelEn: "All Stories", labelAr: "جميع الأخبار" },
                    { key: "partnership", labelEn: "Partnerships", labelAr: "الشراكات والتحالفات" },
                    { key: "campaign", labelEn: "Campaigns", labelAr: "الحملات التوعوية" },
                    { key: "report", labelEn: "Reports", labelAr: "التقارير السنوية" }
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      className={`news-pill-btn ${selectedCategory === cat.key ? "active" : ""}`}
                      onClick={() => setSelectedCategory(cat.key)}
                    >
                      {isAr ? cat.labelAr : cat.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Search Indicator */}
              {searchQuery && (
                <div className="news-search-results-info">
                  <span>
                    {isAr
                      ? `نتائج البحث عن "${searchQuery}": ${filteredPosts.length} مقال`
                      : `Search results for "${searchQuery}": ${filteredPosts.length} article(s)`}
                  </span>
                  <button
                    type="button"
                    className="news-reset-search-btn"
                    onClick={() => handleSearchChange("")}
                  >
                    {isAr ? "إلغاء البحث" : "Reset search"}
                  </button>
                </div>
              )}

              {/* Grid or Empty Search State */}
              {filteredPosts.length === 0 ? (
                <EmptyState
                  type="empty"
                  titleEn={`No articles matching "${searchQuery}"`}
                  titleAr={`لا توجد نتائج مطابقة لـ "${searchQuery}"`}
                  descriptionEn="Try searching with different keywords or reset your filters."
                  descriptionAr="جرب البحث بكلمات أخرى أو قم بإعادة ضبط عوامل التصفية."
                  actionEn="Show all articles"
                  actionAr="عرض جميع المقالات"
                  onAction={() => {
                    handleSearchChange("");
                    setSelectedCategory("all");
                  }}
                />
              ) : (
                <div className="posts-layout-grid">
                {filteredPosts.map((post) => (
                  <article key={post.id} className="post-large-card card">
                    <div className="post-img-cover-area">
                      <img
                        src={post.image}
                        alt={isAr ? post.titleAr : post.titleEn}
                        className="post-cover-img"
                        loading="lazy"
                        onError={(e) => {
                          if (e.currentTarget.dataset.fallbackApplied === "true") return;
                          e.currentTarget.dataset.fallbackApplied = "true";
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <span className="post-category-tag-badge">
                        {isAr ? post.categoryAr : post.categoryEn}
                      </span>
                    </div>

                    <div className="post-text-content-area">
                      <div className="post-meta-details-row">
                        <span>
                          <Calendar size={14} aria-hidden="true" />
                          {post.date}
                        </span>
                        <span>
                          <User size={14} aria-hidden="true" />
                          {isAr ? post.authorAr : post.authorEn}
                        </span>
                      </div>

                      <h3>{isAr ? post.titleAr : post.titleEn}</h3>
                      <p className="excerpt">{isAr ? post.excerptAr : post.excerptEn}</p>

                      <Link to={`/blog/${post.id}`} className="btn btn-ghost read-post-action-btn">
                        <span>{isAr ? "عرض تفاصيل المقال" : "Read Full Article"}</span>
                        {isAr ? <ArrowLeft size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
            </>
          )}
        </section>
    </div>
  );
};
