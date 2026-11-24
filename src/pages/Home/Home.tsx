import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { apiService, ApiError } from "../../services/api";
import type { BlogPost } from "../../types";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Milestone,
  Compass,
  Heart,
  Users,
  Activity,
  Play,
  Pause,
  Image as ImageIcon,
  X,
  Calendar,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { BorderGlow } from "../../components/BorderGlow/BorderGlow";
import { RouteLoader } from "../../components/common/RouteLoader";
import { EmptyState } from "../../components/ui/EmptyState";
import { LogoMarquee } from "../../components/common/LogoMarquee";
import { SEO } from "../../components/common/SEO";
import { setScrollLocked } from "../../components/layout/scrollController";
import "./Home.css";

const Aurora = React.lazy(() =>
  import("../../components/Aurora/Aurora").then((m) => ({ default: m.Aurora }))
);

interface HomePoster {
  id: string;
  titleEn: string;
  titleAr: string;
  categoryEn: string;
  categoryAr: string;
  image: string;
  descriptionEn: string;
  descriptionAr: string;
  dateEn: string;
  dateAr: string;
}

const OFFICIAL_HOME_POSTERS: HomePoster[] = [
  {
    id: "shift-ambassadors-poster",
    titleEn: "SHIFT Ambassadors 2026",
    titleAr: "الملصق الرسمي لسفراء برنامج SHIFT لعام 2026",
    categoryEn: "Official Program Poster",
    categoryAr: "ملصق برامجي رسمي",
    image: "/ambassadors/shift-ambassadors-2026.webp",
    descriptionEn: "Official visual announcement of the 2026 SHIFT Ambassadors cohort leading youth-driven climate empowerment.",
    descriptionAr: "الإعلان البصري الرسمي لدفعة سفراء ومتدربي برنامج SHIFT لعام 2026 لقيادة العمل المناخي والتمكين البيئي الشبابي.",
    dateEn: "September 2026",
    dateAr: "سبتمبر 2026",
  },
  {
    id: "cop28-campaign-poster",
    titleEn: "Paving the Way to COP28 Campaign",
    titleAr: "بوستر حملة تمهيد الطريق نحو COP28",
    categoryEn: "Campaign Media",
    categoryAr: "وسائط الحملات التوعوية",
    image: "/climatify-cop28-coy18-dubai.jpg",
    descriptionEn: "National awareness poster engaging youth across the UAE leading up to COP28.",
    descriptionAr: "بوستر التوعية الوطنية لتمكين وتثقيف الشباب في دولة الإمارات والمنطقة استعداداً لمؤتمر الأطراف COP28.",
    dateEn: "COP28 Cohort",
    dateAr: "فعاليات COP28",
  },
];

const sectionRevealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const }
  }
};

// Local 28 kB WebP hero poster eliminates extra third-party DNS/TLS connection during LCP
const HERO_POSTER = "/clipboard-image-1784502037.webp";

type NetworkConnectionInfo = { saveData?: boolean; effectiveType?: string };

/** Skip decorative background video autoplay on reduced-motion, Data-Saver, or 2G/3G networks. */
function heroAutoplayAllowed(): boolean {
  if (typeof window === "undefined") return false;
  const reduceMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return false;
  const conn = (navigator as Navigator & { connection?: NetworkConnectionInfo }).connection;
  if (conn?.saveData === true) return false;
  if (
    conn?.effectiveType === "slow-2g" ||
    conn?.effectiveType === "2g" ||
    conn?.effectiveType === "3g"
  ) {
    return false;
  }
  return true;
}

export const Home: React.FC = () => {
  const { language, t } = useLanguage();
  const { theme } = useTheme();
  const isAr = language === "ar";

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPoster, setSelectedPoster] = useState<HomePoster | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<unknown>(null);
  const [reloadToken, setReloadToken] = useState(0);

  // Close lightbox on Escape key + lock background scroll
  useEffect(() => {
    if (!selectedPoster) return;
    setScrollLocked(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPoster(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPoster]);

  const heroSectionRef = React.useRef<HTMLElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const userPausedRef = React.useRef(false);
  const [autoplayAllowed] = useState<boolean>(() => heroAutoplayAllowed());
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Defer background video download/playback until after initial paint so critical JS/CSS/fonts win bandwidth,
  // and pause automatically whenever scrolled offscreen or tab is hidden.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 1.0;
    if (!autoplayAllowed) {
      video.pause();
      return;
    }

    let isHeroVisible = true;
    let idleTimerId: ReturnType<typeof setTimeout> | null = null;

    const tryPlay = () => {
      if (!userPausedRef.current && isHeroVisible && document.visibilityState !== "hidden") {
        void video.play().catch(() => {
          /* Autoplay blocked by browser policy — manual Play/Pause toggle remains available */
        });
      }
    };

    idleTimerId = setTimeout(tryPlay, 220);

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined" && heroSectionRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          isHeroVisible = entry.isIntersecting;
          if (!isHeroVisible) {
            video.pause();
          } else {
            tryPlay();
          }
        },
        { threshold: 0.08 }
      );
      observer.observe(heroSectionRef.current);
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        video.pause();
      } else {
        tryPlay();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (idleTimerId) clearTimeout(idleTimerId);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [autoplayAllowed]);

  const toggleHeroVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      void video.play().catch(() => {});
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  }, []);

  // الباك إند لما يجهز يا صاحبي: الدوال دي كلها هتجيب البيانات الحقيقية من عندك
  // مفيش أي تغيير هتحتاجه هنا لأن الفرونت بيكلم الـ apiService مباشرة
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const postData = await apiService.getBlogPosts();
        if (controller.signal.aborted) return;
        // عرض كافة الأخبار والبيانات الصحفية كاملة دون قص
        setPosts(Array.isArray(postData) ? postData : []);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Error fetching homepage data:", err);
        setLoadError(err);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void fetchData();
    return () => controller.abort();
  }, [reloadToken]);

  // بنخزّن الـ error object نفسه ونترجمه وقت الرسم، عشان تبديل اللغة
  // ميعملش إعادة تحميل للصفحة كلها.
  const errorMessage = loadError
    ? loadError instanceof ApiError
      ? loadError.localizedMessage(language)
      : isAr
        ? "حدث خطأ غير متوقع."
        : "An unexpected error occurred."
    : null;

  const retry = useCallback(() => setReloadToken((n) => n + 1), []);

  // مصفوفة الأيقونات بناءً على اسم الأيقونة من قاعدة البيانات
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Monitor": return <ShieldCheck size={26} />;
      case "Search": return <Milestone size={26} />;
      case "Megaphone": return <Compass size={26} />;
      case "Users": return <Users size={26} />;
      case "MessageSquare": return <Heart size={26} />;
      default: return <Activity size={26} />;
    }
  };

  /**
   * حالة "لسه بيحمّل" أو "مفيش بيانات" لقسم واحد.
   * الخطأ بيتعرض مرة واحدة بس على مستوى الصفحة (تحت)، مش ٣ مرات،
   * عشان قارئ الشاشة ميسمعش نفس الرسالة تلات مرات.
   */
  const renderSectionState = (emptyTitleAr: string, emptyTitleEn: string, emptyDescAr: string, emptyDescEn: string) => {
    if (loading) {
      return (
        <div className="home-section-loader">
          <RouteLoader label={isAr ? "جارٍ تحميل المحتوى…" : "Loading content…"} />
        </div>
      );
    }
    if (errorMessage) {
      // ملاحظة ثابتة (مش live region) — التفاصيل وزرار إعادة المحاولة فوق مرة واحدة.
      return (
        <p className="home-section-unavailable">
          {isAr
            ? "هذا المحتوى غير متاح حالياً — راجع رسالة الخطأ أعلى الصفحة."
            : "This content is unavailable right now — see the error message at the top of the page."}
        </p>
      );
    }
    return (
      <EmptyState
        type="no-data"
        titleAr={emptyTitleAr}
        titleEn={emptyTitleEn}
        descriptionAr={emptyDescAr}
        descriptionEn={emptyDescEn}
      />
    );
  };

  return (
    <div className="home-page-container">
      <SEO
        breadcrumbs={[{ name: isAr ? "الرئيسية" : "Home", path: "/" }]}
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: isAr ? "ما هي مؤسسة كلايمتفاي (Climatify)؟" : "What is Climatify?",
              acceptedAnswer: {
                "@type": "Answer",
                text: isAr
                  ? "كلايمتفاي (Climatify) هي مؤسسة اجتماعية وشركة ناشئة إماراتية مقرها دبي (تأسست عام 2023)، فائزة بجائزة Future 100 لعام 2025 من وزارة الاقتصاد ومكتب رئاسة مجلس الوزراء في دولة الإمارات، متخصصة في التعليم المناخي، الرقمنة البيئية، وتمكين الشباب لتحويل تحديات الاستدامة إلى تجارب تعليمية تفاعلية وعملية."
                  : "Climatify is a UAE-based climate education and youth empowerment social enterprise (founded in 2023 and recognized among the UAE Future 100 winners in 2025) that turns complex sustainability and climate challenges into practical, interactive learning experiences.",
              },
            },
            {
              "@type": "Question",
              name: isAr ? "ما هي أبرز برامج وألعاب كلايمتفاي المناخية؟" : "What are Climatify's flagship programs and climate games?",
              acceptedAnswer: {
                "@type": "Answer",
                text: isAr
                  ? "تقود كلايمتفاي برنامج SHIFT لبناء قدرات الشباب والقيادة المناخية، ولعبة AgriClash الاستراتيجية لإدارة الموارد الزراعية والأمن الغذائي، ولعبة GreenSharks لمحاكاة ريادة الأعمال الخضراء، وحاسبة البصمة الكربونية، وحديقة شجرة الغاف الرقمية، وزمالة العمل المناخي والحد من مخاطر الكوارث (CADRR)."
                  : "Climatify leads the SHIFT Youth Capacity Building & Leadership Program, the AgriClash strategic agricultural resource game, GreenSharks green entrepreneurship simulation, the Carbon Footprint Calculator, the Plant-a-Ghaf Digital Garden, and the CADRR Fellowship.",
              },
            },
            {
              "@type": "Question",
              name: isAr ? "كيف يمكن للمدارس والجامعات والمؤسسات والشباب الانضمام إلى كلايمتفاي؟" : "How can schools, universities, organizations, and youth partner with or join Climatify?",
              acceptedAnswer: {
                "@type": "Answer",
                text: isAr
                  ? "يمكن للشباب التسجيل في أكاديمية كلايمتفاي والفعاليات وفرص التطوع والتدريب مجاناً، ويمكن للمدارس والجامعات والشركات تقديم طلب شراكة أو طلب ورشة عمل ميدانية عبر بوابة الشركاء والمدارس في الموقع الرسمي."
                  : "Youth can register for certified courses, climate summits, hackathons, and internships on the platform, while schools, universities, and corporate partners can request tailored workshops or strategic partnerships directly through the Climatify Portals page.",
              },
            },
          ],
        }}
      />
      {/* 1. Hero Section */}
      <section ref={heroSectionRef} className="home-hero-section">
        {/* تأثير أورورا العلوي المميز في الدارك مود */}
        {theme === "dark" && (
          <React.Suspense fallback={null}>
            <Aurora
              colorStops={["#00d0ff", "#72ecff", "#27ff70"]}
              blend={0.5}
              amplitude={1.0}
              speed={0.5}
            />
          </React.Suspense>
        )}

        {/* الفيديو كخلفية تفاعلية جذابة — ديكور بحت، مكتوم دائماً ومخفي عن قارئ الشاشة.
            TODO(a11y): لو اتضاف للفيديو تعليق صوتي أو نص على الشاشة لازم يتضاف معاه
            <track kind="captions"> ونص مكتوب. حالياً مفيش صوت خالص فمش مطلوب. */}
        <video
          ref={videoRef}
          className="home-hero-video"
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          poster={HERO_POSTER}
          onPlay={() => setVideoPlaying(true)}
          onPause={() => setVideoPlaying(false)}
        >
          {/* TODO(perf): ضيف <source> بصيغة WebM/AV1 أخف قبل الإطلاق. */}
          <source src="/Climatify-Campign-.mp4" type="video/mp4" />
        </video>
        <div className="home-hero-overlay"></div>

        <button
          type="button"
          className="home-hero-video-toggle"
          onClick={toggleHeroVideo}
          aria-label={
            videoPlaying
              ? isAr ? "إيقاف فيديو الخلفية" : "Pause background video"
              : isAr ? "تشغيل فيديو الخلفية" : "Play background video"
          }
        >
          {videoPlaying ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
          <span>{videoPlaying ? (isAr ? "إيقاف" : "Pause") : (isAr ? "تشغيل" : "Play")}</span>
        </button>

        <motion.div
          className="container hero-content-inner"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="home-hero-pill">
            <span className="dot-pulse"></span>
            {t("forBetterFuture")}
          </span>

          <h1 className="hero-main-heading">
            {t("heroTitlePart1")}{" "}
            <span className="text-gradient">{t("heroTitlePart2")}</span>{" "}
            {t("heroTitlePart3")}
          </h1>

          <p className="hero-subtext">{t("heroSub")}</p>

          <div className="hero-actions-container">
            <a href="#mission" className="btn btn-primary">
              <span>{isAr ? "استكشف مساراتنا" : "Explore Our Work"}</span>
              {isAr ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </a>
            <Link to="/about" className="btn btn-glass">{t("learnMore")}</Link>
          </div>
        </motion.div>
      </section>

      {/* 1b. تحذير واحد على مستوى الصفحة لو الـ API فشل — بدل ٣ رسايل مكررة */}
      {errorMessage && (
        <div className="container home-data-error">
          <EmptyState
            type="error"
            titleAr="تعذّر تحميل محتوى الصفحة"
            titleEn="Could not load the page content"
            descriptionAr={errorMessage}
            descriptionEn={errorMessage}
            actionAr="إعادة المحاولة"
            actionEn="Try again"
            onAction={retry}
          />
        </div>
      )}

      {/* 1c. Impact Band — أرقام الأثر المعتمدة من المحتوى الرسمي */}
      <section className="home-impact-band" aria-label={isAr ? "أثرنا بالأرقام" : "Our impact in numbers"}>
        <div className="container home-impact-grid" role="list">
          <div className="home-impact-item" role="listitem">
            <span className="home-impact-value">{t("impactYouthValue")}</span>
            <span className="home-impact-label">{t("impactYouthLabel")}</span>
          </div>
          <div className="home-impact-item" role="listitem">
            <span className="home-impact-value">{t("impactEmpoweredValue")}</span>
            <span className="home-impact-label">{t("impactEmpoweredLabel")}</span>
          </div>
          <div className="home-impact-item" role="listitem">
            <span className="home-impact-value">{t("impactOpportunitiesValue")}</span>
            <span className="home-impact-label">{t("impactOpportunitiesLabel")}</span>
          </div>
        </div>
      </section>

      {/* 1d. Partners Logo Marquee — أبرز الشركاء الاستراتيجيين */}
      <LogoMarquee />

      {/* 2. Mission Section */}
      <motion.section
        className="section home-mission-section"
        id="mission"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionRevealVariants}
      >
        <div className="container mission-grid-layout">
          <div className="mission-text-area">
            <span className="eyebrow">{isAr ? "رؤيتنا ورسالتنا" : "Our Mission"}</span>
            <h2>{t("missionTitle")}</h2>
            <p>{t("missionText1")}</p>
            <Link to="/about" className="btn btn-ghost" style={{ marginTop: "24px" }}>
              <span>{isAr ? "تعرّف على فريق القيادة" : "Meet The Team"}</span>
              {isAr ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </Link>
          </div>

          <div className="mission-cards-stack">
            <BorderGlow
              edgeSensitivity={30}
              glowColor="190 90 70"
              backgroundColor="var(--surface-2)"
              borderRadius={20}
              glowRadius={35}
              glowIntensity={1.2}
              coneSpread={25}
              animated={true}
              colors={['#38bdf8', '#818cf8', '#34d399']}
            >
              <div className="vm-card-item">
                <span className="icon-tile-wrapper">{getIcon("Monitor")}</span>
                <div>
                  <h3>{t("vision")}</h3>
                  <p>{t("visionText")}</p>
                </div>
              </div>
            </BorderGlow>

            <BorderGlow
              edgeSensitivity={30}
              glowColor="150 85 65"
              backgroundColor="var(--surface-2)"
              borderRadius={20}
              glowRadius={35}
              glowIntensity={1.2}
              coneSpread={25}
              animated={true}
              colors={['#10b981', '#34d399', '#6ee7b7']}
            >
              <div className="vm-card-item">
                <span className="icon-tile-wrapper">{getIcon("Search")}</span>
                <div>
                  <h3>{t("mission")}</h3>
                  <p>{t("missionText")}</p>
                </div>
              </div>
            </BorderGlow>

            <BorderGlow
              edgeSensitivity={30}
              glowColor="280 85 75"
              backgroundColor="var(--surface-2)"
              borderRadius={20}
              glowRadius={35}
              glowIntensity={1.2}
              coneSpread={25}
              animated={true}
              colors={['#c084fc', '#f472b6', '#fbbf24']}
            >
            <div className="vm-card-item">
              <span className="icon-tile-wrapper">{getIcon("Megaphone")}</span>
              <div>
                <h3>{t("focusAreas")}</h3>
                <p>{t("focusAreasText")}</p>
              </div>
            </div>
            </BorderGlow>
          </div>
        </div>
      </motion.section>

      {/* 3. Latest News Section */}
      <motion.section
        className="section home-news-section"
        id="news"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionRevealVariants}
      >
        <div className="container">
          <div className="home-section-header text-center">
            <span className="eyebrow">{isAr ? "أحدث الأخبار" : "Latest News"}</span>
            <h2 className="section-title">
              {isAr ? "أحدث الأخبار والبيانات الصحفية" : "Latest Updates & Announcements"}
            </h2>
          </div>

          {posts.length > 0 ? (
            <>
              <div className="news-cards-grid-layout">
                {posts.slice(0, 6).map((post) => (
                  <article key={post.id} className="news-card-item card">
                    <div className="news-thumbnail-banner" aria-hidden="true">
                      <img
                        src={post.image}
                        alt=""
                        className="news-thumbnail-img"
                        loading="lazy"
                        decoding="async"
                        width={640}
                        height={360}
                      />
                    </div>
                    <div className="news-content-body">
                      <div className="news-meta-row">
                        <span className="news-date-text">{post.date}</span>
                        <span className="news-category-badge">
                          {isAr ? post.categoryAr : post.categoryEn}
                        </span>
                      </div>
                      <h3>{isAr ? post.titleAr : post.titleEn}</h3>
                      <p>{isAr ? post.excerptAr : post.excerptEn}</p>
                      <Link to={`/blog/${post.id}`} className="news-read-more-link">
                        <span>{isAr ? "قراءة التقرير كاملاً" : "Read Full Story"}</span>
                        {isAr ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              {posts.length > 6 && (
                <div className="text-center" style={{ marginTop: "28px" }}>
                  <Link to="/media" className="btn btn-outline">
                    <span>{isAr ? "استكشف جميع الأخبار والتقارير" : "Explore All News & Articles"}</span>
                    {isAr ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                  </Link>
                </div>
              )}
            </>
          ) : (
            renderSectionState(
              "لا توجد أخبار منشورة حالياً",
              "No news published yet",
              "ستظهر أحدث المقالات والأخبار هنا فور نشرها.",
              "The latest articles will show up here as soon as they are published."
            )
          )}

          {/* Minimal Official Posters & Media Gallery within Latest Updates */}
          <div className="home-posters-strip">
            <div className="home-posters-strip-head">
              <div>
                <span className="home-posters-tag">{isAr ? "المعرض الإعلامي الرسمي" : "Official Media Gallery"}</span>
                <h3 className="home-posters-title">
                  {isAr ? "الملصقات الرسمية والمواد الإعلامية المعتمدة" : "Official Posters & Media Gallery"}
                </h3>
              </div>
              <Link to="/about" className="home-posters-viewall">
                <span>{isAr ? "استكشف كافة المواد" : "View All Media"}</span>
                {isAr ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
              </Link>
            </div>

            <div className="home-posters-minimal-grid">
              {OFFICIAL_HOME_POSTERS.map((poster) => (
                <div
                  key={poster.id}
                  className="home-poster-card"
                  onClick={() => setSelectedPoster(poster)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedPoster(poster);
                    }
                  }}
                  aria-label={isAr ? poster.titleAr : poster.titleEn}
                >
                  <div className="home-poster-thumb-wrap">
                    <img
                      src={poster.image}
                      alt={isAr ? poster.titleAr : poster.titleEn}
                      loading="lazy"
                      decoding="async"
                      className="home-poster-img"
                    />
                    <div className="home-poster-zoom-overlay">
                      <ImageIcon size={22} />
                      <span>{isAr ? "عرض الملصق" : "View Poster"}</span>
                    </div>
                  </div>
                  <div className="home-poster-info">
                    <span className="home-poster-badge">
                      {isAr ? poster.categoryAr : poster.categoryEn}
                    </span>
                    <h4>{isAr ? poster.titleAr : poster.titleEn}</h4>
                    <span className="home-poster-date">
                      {isAr ? poster.dateAr : poster.dateEn}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Lightbox Modal for Posters in Homepage */}
      {selectedPoster && (
        <div
          className="poster-lightbox-backdrop"
          onClick={() => setSelectedPoster(null)}
          role="presentation"
          data-lenis-prevent
        >
          <div
            className="poster-lightbox-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-lightbox-title"
          >
            <div className="lightbox-image-box">
              <div
                className="lightbox-ambient-glow"
                style={{ backgroundImage: `url(${selectedPoster.image})` }}
                aria-hidden="true"
              />
              <img
                src={selectedPoster.image}
                alt={isAr ? selectedPoster.titleAr : selectedPoster.titleEn}
                className="lightbox-full-img"
              />
            </div>

            <div className="lightbox-caption-area">
              <div className="lightbox-caption-header">
                <div className="lightbox-cat-badge">
                  <Sparkles size={14} className="cat-icon" />
                  <span>{isAr ? selectedPoster.categoryAr : selectedPoster.categoryEn}</span>
                </div>
                <button
                  type="button"
                  className="lightbox-close-btn"
                  onClick={() => setSelectedPoster(null)}
                  aria-label={isAr ? "إغلاق النافذة" : "Close window"}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="lightbox-body">
                <h3 id="home-lightbox-title">
                  {isAr ? selectedPoster.titleAr : selectedPoster.titleEn}
                </h3>
                <p className="lightbox-description">
                  {isAr ? selectedPoster.descriptionAr : selectedPoster.descriptionEn}
                </p>

                <div className="lightbox-meta-chips">
                  <div className="meta-chip">
                    <Calendar size={14} />
                    <span>{isAr ? selectedPoster.dateAr : selectedPoster.dateEn}</span>
                  </div>
                </div>
              </div>

              <div className="lightbox-footer">
                <div className="lightbox-footer-row">
                  <a
                    href={selectedPoster.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lightbox-action-btn secondary"
                  >
                    <ExternalLink size={15} />
                    <span>{isAr ? "فتح الصورة كاملة" : "Open Full Image"}</span>
                  </a>
                  <button
                    type="button"
                    className="lightbox-action-btn close"
                    onClick={() => setSelectedPoster(null)}
                  >
                    <span>{isAr ? "إغلاق" : "Close"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
