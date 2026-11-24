import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Download, Sparkles, Image as ImageIcon, X, ExternalLink, Calendar, Building2, GraduationCap, Cpu, Compass, CheckCircle2, ArrowRight } from "lucide-react";
import { InternsQuotes } from "./InternsQuotes";
import { ChromaGrid, type ChromaItem } from "../../components/ChromaGrid/ChromaGrid";
import { EmptyState } from "../../components/ui/EmptyState";
import { SEO } from "../../components/common/SEO";
import { setScrollLocked } from "../../components/layout/scrollController";
import { apiService, ApiError } from "../../services/api";
import type { TeamMember } from "../../types";
import "./About.css";

const ANNUAL_REPORT_URL = "/climatify-annual-report.pdf";

const CANONICAL_TEAM_ORDER = [
  "mai-moawad",
  "abdullah-salmani",
  "marwa-shalwani",
  "heba-momtaz",
  "rowayyah-alhefeiti",
  "maysara-ezz",
  "ahmed-ashraf-kamel",
] as const;

interface PosterItem {
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
  partnerEn: string;
  partnerAr: string;
  reportUrl?: string;
}

const OFFICIAL_POSTERS: PosterItem[] = [
  {
    id: "climatify-interns-2026-poster",
    titleEn: "Meet Climatify Interns 2026",
    titleAr: "الملصق الرسمي لمتدربي كلايمتيفاي دفعة 2026",
    categoryEn: "Official Cohort",
    categoryAr: "الدفعة الرسمية المعتمدة",
    image: "/ambassadors/climatify-interns-2026.webp",
    descriptionEn: "Climatify's official 2026 Interns cohort leading climate research, policy innovation, and digital sustainability.",
    descriptionAr: "الدفعة الرسمية لمتدربي كلايمتيفاي لعام 2026 لقيادة أبحاث المناخ والابتكار والرقمنة البيئية.",
    dateEn: "2026 Cohort",
    dateAr: "دفعة 2026",
    partnerEn: "Climatify Youth Empowerment",
    partnerAr: "برنامج تمكين الشباب في كلايمتيفاي"
  },
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
    partnerEn: "Youth Empowerment Initiative",
    partnerAr: "مبادرة التمكين الشبابي",
    reportUrl: "https://acrobat.adobe.com/id/urn:aaid:sc:EU:a9632f47-907d-42d3-bc03-01173f32367b",
  },
  {
    id: "heliopolis-mou-signing",
    titleEn: "Heliopolis University Strategic MoU",
    titleAr: "توقيع مذكرة التفاهم مع جامعة هليوبوليس",
    categoryEn: "Partnership Milestone",
    categoryAr: "إنجاز شراكة استراتيجية",
    image: "/partnerships/mou-heliopolis-ceremony.jpg",
    descriptionEn: "Climatify leadership signing the Memorandum of Understanding with Heliopolis University for Sustainable Development in September 2026.",
    descriptionAr: "توقيع مذكرة التفاهم الرسمية بين كلايمتيفاي وجامعة هليوبوليس للتنمية المستدامة في سبتمبر 2026 لتعزيز تدريب وتمكين الكوادر الشبابية في مجالات الاقتصاد الأخضر.",
    dateEn: "September 2026",
    dateAr: "سبتمبر 2026",
    partnerEn: "Heliopolis University for Sustainable Development",
    partnerAr: "جامعة هليوبوليس للتنمية المستدامة"
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
    partnerEn: "UAE Youth Climate Movement",
    partnerAr: "حراك شباب الإمارات للمناخ"
  }
];

export const About: React.FC = () => {
  const { language, t } = useLanguage();
  const isAr = language === "ar";

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState<unknown>(null);
  const [reloadToken, setReloadToken] = useState(0);

  // Active Team filter: "all" (All Leaders), "founder", "core", "intern"
  const [activeTab, setActiveTab] = useState<"all" | "founder" | "core" | "intern" | "quotes">("all");

  // Poster Lightbox Modal
  const [selectedPoster, setSelectedPoster] = useState<PosterItem | null>(null);

  // Close lightbox on Escape key + lock Lenis scroll
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

  useEffect(() => {
    const controller = new AbortController();

    const fetchTeam = async () => {
      setTeamLoading(true);
      setTeamError(null);
      try {
        const data = await apiService.getTeam();
        if (controller.signal.aborted) return;
        setTeam(Array.isArray(data) ? data : []);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Error loading team data:", err);
        setTeamError(err);
      } finally {
        if (!controller.signal.aborted) setTeamLoading(false);
      }
    };

    void fetchTeam();
    return () => controller.abort();
  }, [reloadToken]);

  const teamErrorMessage = teamError
    ? teamError instanceof ApiError
      ? teamError.localizedMessage(language)
      : isAr
        ? "حدث خطأ غير متوقع."
        : "An unexpected error occurred."
    : null;

  const retryTeam = useCallback(() => setReloadToken((n) => n + 1), []);

  // Filter and canonically sort team members based on category
  const filteredTeam = useMemo(() => {
    const list = activeTab === "all" ? team : team.filter((member) => member.category === activeTab);
    return [...list].sort((a, b) => {
      const idxA = CANONICAL_TEAM_ORDER.indexOf(a.id as (typeof CANONICAL_TEAM_ORDER)[number]);
      const idxB = CANONICAL_TEAM_ORDER.indexOf(b.id as (typeof CANONICAL_TEAM_ORDER)[number]);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  }, [team, activeTab]);

  const chromaItems: ChromaItem[] = useMemo(() => {
    return filteredTeam.map((member) => ({
      image: member.image,
      title: isAr ? member.nameAr : member.nameEn,
      subtitle: isAr ? member.roleAr : member.roleEn,
      handle:
        member.category === "intern"
          ? (isAr ? "متدرب 2026" : "Intern 2026")
          : member.category === "core"
            ? (isAr ? "فريق العمل" : "Core Team")
            : (isAr ? "مؤسس" : "Founder"),
      borderColor: member.borderColor || "#10B981",
      gradient: member.gradient || "linear-gradient(145deg, #059669, #022c22)"
    }));
  }, [filteredTeam, isAr]);

  return (
    <div className="about-page-container container">
      <SEO
        title={isAr ? "من نحن وفريق القيادة" : "About Us & Leadership Team"}
        description={
          isAr
            ? "تعرف على كليماتيفاي (Climatify)، المؤسسة المجتمعية والشركة الإماراتية الرائدة في التعليم المناخي والرقمنة البيئية وتمكين الشباب."
            : "Learn about Climatify, the UAE-based Future 100 social enterprise advancing climate education, digitalization, and youth leadership."
        }
        breadcrumbs={[
          { name: isAr ? "الرئيسية" : "Home", path: "/" },
          { name: isAr ? "من نحن" : "About", path: "/about" },
        ]}
      />
      {/* 1. Header Section */}
      <section className="about-header-section text-center">
        <span className="eyebrow">{t("about")}</span>
        <h1 className="section-title">
          {isAr ? "من نحن — مبادرة كلايمتيفاي" : "About Us"}
        </h1>
        <p className="section-lead mx-auto">
          {isAr
            ? "نجمع بين الابتكار والرقمنة المناخية وبناء القدرات الشبابية لقيادة التغيير وصناعة مستقبل مستدام."
            : "Uniting climate innovation, digitization, and youth capacity building to lead sustainable impact."}
        </p>
      </section>

      {/* 2. Climatify Comprehensive Overview & Core Pillars */}
      <section className="about-intro-section" aria-labelledby="about-intro-title">
        <div className="about-intro-card card glass">
          <div className="about-intro-grid">
            <div className="about-intro-content">
              <span className="eyebrow-pill">
                <Sparkles size={14} />
                <span>{isAr ? "من نحن" : "Overview"}</span>
              </span>
              <h2 id="about-intro-title" className="about-intro-heading">
                {isAr ? "عن كليماتيفاي | About Climatify" : "About Climatify"}
              </h2>
              <p className="about-intro-lead">
                {isAr
                  ? "كليماتيفاي (Climatify) شركة ذات تأثير اجتماعي مقرها دولة الإمارات العربية المتحدة، تعمل من خلال محورين رئيسيين: التعليم المناخي والرقمنة المناخية، عبر تطوير برامج تعليمية وتدريبية مبتكرة ومشروعات رقمية تهدف إلى تعزيز المشاركة في العمل المناخي، وبناء القدرات، والمساهمة في تطوير منظومة العمل المناخي على المستويات المحلية والإقليمية والعالمية."
                  : "Climatify is a UAE-based social enterprise working across two core pillars: Climate Education and Climate Digitalization, with a focus on strengthening the climate action ecosystem at local, regional, and global levels."}
              </p>
            </div>

            <div className="about-intro-media">
              <img
                src="/brand/climatify-what-is.png"
                alt={isAr ? "شعار كلايمتيفاي الرسمي" : "Climatify Official Logo"}
                className="about-intro-img"
                width={800}
                height={800}
                decoding="async"
              />
            </div>
          </div>

          {/* Core Pillars & Methodology Grid */}
          <div className="about-pillars-grid">
            {/* 1. Climate Education */}
            <div className="about-pillar-card">
              <div className="about-pillar-icon-row">
                <div className="about-pillar-icon">
                  <GraduationCap size={22} />
                </div>
                <h3 className="about-pillar-title">
                  {isAr ? "1. التعليم المناخي" : "1. Climate Education"}
                </h3>
              </div>
              <p className="about-pillar-desc">
                {isAr
                  ? "تعمل كليماتيفاي على تبسيط المفاهيم المناخية والبيئية وتحويلها إلى تجارب تعليمية عملية وتفاعلية، من خلال ورش العمل التطبيقية، والمعسكرات التعليمية والتدريبية، والألعاب البيئية التفاعلية، والمحاكاة، وبرامج بناء القدرات المهنية المتخصصة."
                  : "Climatify makes climate education accessible, practical, and engaging through hands-on workshops, educational camps, interactive environmental games, simulation-based learning, and professional capacity-building programs."}
              </p>
              <p className="about-pillar-desc">
                {isAr
                  ? "تستهدف برامج الشركة الأطفال والنشء والشباب والمهنيين والمؤسسات، من خلال مسارات تعليمية وتدريبية تربط المعرفة العلمية بالتطبيق العملي، وتركز على تنمية المهارات التقنية والمهنية والقيادية، والاستدامة، وريادة الأعمال الخضراء، والسياسات المناخية، لتأهيل الكوادر وإعداد جيل جديد من القيادات المناخية."
                  : "Its educational approach serves children, youth, emerging professionals, and organizations by simplifying complex climate concepts while developing technical, professional, and leadership competencies in climate action, sustainability, green entrepreneurship, and policy engagement."}
              </p>
            </div>

            {/* 2. Climate Digitalization */}
            <div className="about-pillar-card">
              <div className="about-pillar-icon-row">
                <div className="about-pillar-icon">
                  <Cpu size={22} />
                </div>
                <h3 className="about-pillar-title">
                  {isAr ? "2. الرقمنة المناخية" : "2. Climate Digitalization"}
                </h3>
              </div>
              <p className="about-pillar-desc">
                {isAr
                  ? "تعمل كليماتيفاي على تطوير مشروعات وحلول رقمية تهدف إلى تعزيز كفاءة منظومة العمل المناخي، وتوسيع نطاق الوصول إلى المعرفة والفرص والشراكات في قطاع المناخ والاستدامة."
                  : "Climatify is developing digital projects to improve access to climate-related knowledge, facilitate connections between stakeholders, and create new opportunities for collaboration."}
              </p>
              <div className="about-pillar-projects">
                <div className="about-project-pill">
                  <CheckCircle2 size={16} />
                  <span>{isAr ? "المنصة العربية للعمل المناخي | Arab Climate Action Platform" : "Arab Climate Action Platform"}</span>
                </div>
                <div className="about-project-pill">
                  <CheckCircle2 size={16} />
                  <span>{isAr ? "تطبيق كليماتيفاي | Climatify App" : "Climatify App"}</span>
                </div>
              </div>
              <p className="about-pillar-desc">
                {isAr
                  ? "تسعى كليماتيفاي من خلال هذه المشروعات إلى تسريع وتيرة العمل المناخي على المستويات المحلية والإقليمية والعالمية، عبر تطوير منظومة عمل مناخي أكثر ترابطًا وتكاملًا وفاعلية. وتهدف هذه المبادرات إلى تسهيل الوصول إلى المعلومات والموارد والفرص المتعلقة بالمناخ، وتعزيز التعاون بين مختلف الجهات المعنية، ودعم تطوير الحلول المناخية المبتكرة وتوسيع نطاق تطبيقها."
                  : "Through these projects, Climatify aims to accelerate climate action at local, regional, and global levels by fostering a more connected, integrated, and effective climate action ecosystem. These initiatives seek to improve access to climate-related information, resources, and opportunities, strengthen collaboration among key stakeholders, and support the development and scaling of innovative climate solutions."}
              </p>
            </div>

            {/* 3. Our Approach */}
            <div className="about-pillar-card">
              <div className="about-pillar-icon-row">
                <div className="about-pillar-icon">
                  <Compass size={22} />
                </div>
                <h3 className="about-pillar-title">
                  {isAr ? "3. منهجية عملنا" : "3. Our Approach"}
                </h3>
              </div>
              <p className="about-pillar-desc">
                {isAr
                  ? "تعتمد كليماتيفاي على الربط بين التعليم والتكنولوجيا والابتكار والسياسات العامة، من خلال التعاون مع الجهات الحكومية، والمؤسسات الأكاديمية، والمنظمات الدولية، ومؤسسات المجتمع المدني، والقطاع الخاص."
                  : "Climatify collaborates with government entities, academic institutions, international organizations, civil society, and the private sector to develop programs connecting climate knowledge, technology, and public policy."}
              </p>
              <p className="about-pillar-desc">
                {isAr
                  ? "تصميم وتنفيذ برامج ومشروعات تستجيب للاحتياجات الفعلية للقطاعات المستهدفة، وتدعم بناء القدرات، وتطوير الحلول، وتعزيز الشراكات متعددة الأطراف، وتوسيع نطاق المشروعات التعليمية والرقمية إقليمياً ودولياً."
                  : "The company designs and implements programs responsive to real-world sector needs, supporting capacity building, solution development, and multi-stakeholder partnerships contributing to a more connected climate ecosystem."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Team Section — Our Climate Change Leaders with ChromaGrid */}
      <section className="about-team-section" aria-labelledby="about-team-heading">
        <div className="text-center team-section-head">
          <span className="eyebrow">{isAr ? "فريق العمل" : "LEADERSHIP TEAM"}</span>
          <h2 id="about-team-heading">
            {isAr ? "قادة التغيير المناخي" : "Meet Our Team"}
          </h2>
          <p className="team-lead-text">
            {isAr
              ? "نؤمن بأن تمكين الشباب هو أساس التحول الأخضر — تعرف على قادة المبادرة وفريق العمل والمتدربين."
              : "Youth empowerment drives real sustainability — meet our founders, core team, and interns."}
          </p>

          {/* Category Tabs */}
          <div className="team-tabs-bar" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "all"}
              className={`team-tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              <span>{isAr ? "كافة القيادات" : "All Leaders"}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "founder"}
              className={`team-tab-btn ${activeTab === "founder" ? "active" : ""}`}
              onClick={() => setActiveTab("founder")}
            >
              <span>{isAr ? "المؤسسون" : "Founders"}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "core"}
              className={`team-tab-btn ${activeTab === "core" ? "active" : ""}`}
              onClick={() => setActiveTab("core")}
            >
              <span>{isAr ? "الفريق الأساسي" : "Core Team"}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "intern"}
              className={`team-tab-btn ${activeTab === "intern" ? "active" : ""}`}
              onClick={() => setActiveTab("intern")}
            >
              <span>{isAr ? "متدربو دفعة 2026" : "2026 Interns"}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "quotes"}
              className={`team-tab-btn ${activeTab === "quotes" ? "active" : ""}`}
              onClick={() => setActiveTab("quotes")}
            >
              <span>{isAr ? "أقوال المتدربين" : "Interns Quotes"}</span>
            </button>
          </div>
        </div>

        {/* Highlight Feature: When viewing Interns, display the official SHIFT Ambassadors poster & Climatify Interns poster */}
        {activeTab === "intern" && (
          <>
            <div className="ambassadors-poster-banner card glass">
              <div className="ambassadors-poster-flex">
                <div className="ambassadors-poster-img-wrap" onClick={() => setSelectedPoster(OFFICIAL_POSTERS[0] ?? null)}>
                  <img
                    src="/ambassadors/shift-ambassadors-2026.webp"
                    alt="SHIFT Ambassadors 2026"
                    className="ambassadors-poster-preview"
                    loading="lazy"
                  />
                  <span className="poster-zoom-hint">
                    <ImageIcon size={14} />
                    <span>{isAr ? "انقر لتكبير الملصق" : "Click to expand"}</span>
                  </span>
                </div>
                <div className="ambassadors-poster-copy">
                  <span className="badge-featured">{isAr ? "الدفعة المعتمدة 2026" : "Official 2026 Cohort"}</span>
                  <h3>{isAr ? "سفراء ومتدربو برنامج SHIFT 2026" : "SHIFT Program Ambassadors 2026"}</h3>
                  <p>
                    {isAr
                      ? "يقود سفراء ومتدربو كلايمتيفاي لعام 2026 ورش العمل الإقليمية، وحساب البصمة الكربونية، وتمكين المجتمعات المحلية نحو التنمية المستدامة."
                      : "Climatify 2026 Ambassadors lead regional workshops, carbon literacy initiatives, and youth climate advocacy across the region."}
                  </p>
                  <div className="ambassador-names-pills">
                    {["أحمد أشرف", "سلمى ناجي", "مودة جمال", "نور البستكي", "منار محمود", "منة الجندي"].map((name) => (
                      <span key={name} className="name-chip">{name}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: "16px" }}>
                    <a
                      href="https://acrobat.adobe.com/id/urn:aaid:sc:EU:a9632f47-907d-42d3-bc03-01173f32367b"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", fontSize: "0.9rem", borderRadius: "99px" }}
                    >
                      <span>{isAr ? "عرض تقرير SHIFT الكامل (PDF)" : "View Full SHIFT Report"}</span>
                      <ExternalLink size={15} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Climatify Interns 2026 Official Poster Showcase */}
            <div className="ambassadors-poster-banner card glass" style={{ marginTop: "24px" }}>
              <div className="ambassadors-poster-flex">
                <div
                  className="ambassadors-poster-img-wrap"
                  onClick={() => setSelectedPoster(OFFICIAL_POSTERS.find((p) => p.id === "climatify-interns-2026-poster") ?? null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedPoster(OFFICIAL_POSTERS.find((p) => p.id === "climatify-interns-2026-poster") ?? null);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  title={isAr ? "انقر لتكبير ملصق المتدربين" : "Click to expand interns poster"}
                >
                  <img
                    src="/ambassadors/climatify-interns-2026.webp"
                    alt="Climatify Interns 2026"
                    className="ambassadors-poster-preview"
                    loading="lazy"
                  />
                  <span className="poster-zoom-hint">
                    <ImageIcon size={14} />
                    <span>{isAr ? "انقر لتكبير الصورة" : "Click to expand"}</span>
                  </span>
                </div>
                <div className="ambassadors-poster-copy">
                  <span className="badge-featured" style={{ background: "rgba(59, 130, 246, 0.12)", color: "#3b82f6", borderColor: "rgba(59, 130, 246, 0.3)" }}>
                    {isAr ? "متدربو كلايمتيفاي 2026" : "Climatify Interns 2026"}
                  </span>
                  <h3>{isAr ? "متدربو كلايمتيفاي 2026 — Climatify Interns" : "Meet Climatify Interns 2026"}</h3>
                  <p>
                    {isAr
                      ? "طاقات شبابية واعدة تقود أبحاث المناخ، تحليل البيانات البيئية، والحلول الرقمية لتمكين المجتمعات وصناعة أثر حقيقي ومستدام."
                      : "Future climate leaders driving sustainability research, environmental data analytics, and digital innovation to empower communities and deliver real impact."}
                  </p>
                  <div className="ambassador-names-pills">
                    {["Climate Research", "Data Analytics", "Policy & Strategy", "Youth Leadership", "Digital Solutions"].map((tag) => (
                      <span key={tag} className="name-chip">{tag}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: "16px" }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab("quotes")}
                      className="btn btn-outline"
                      style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", fontSize: "0.9rem", borderRadius: "99px" }}
                    >
                      <span>{isAr ? "استعرض أقوال وتجارب المتدربين" : "Explore Interns Quotes"}</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Interns Quotes View or Team Grid */}
        {activeTab === "quotes" ? (
          <InternsQuotes onBackToTeam={() => setActiveTab("all")} />
        ) : teamLoading ? (
          <div className="about-team-skeleton-grid" role="status" aria-live="polite">
            <span className="sr-only">{isAr ? "جارٍ تحميل فريق العمل…" : "Loading the team…"}</span>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="about-team-skeleton-card" aria-hidden="true">
                <div className="about-team-skeleton-avatar" />
                <div className="about-team-skeleton-line" />
                <div className="about-team-skeleton-line short" />
              </div>
            ))}
          </div>
        ) : teamErrorMessage ? (
          <EmptyState
            type="error"
            titleAr="تعذّر تحميل فريق العمل"
            titleEn="Could not load the team"
            descriptionAr={teamErrorMessage}
            descriptionEn={teamErrorMessage}
            actionAr="إعادة المحاولة"
            actionEn="Try again"
            onAction={retryTeam}
          />
        ) : chromaItems.length === 0 ? (
          <EmptyState
            type="no-data"
            titleAr="لا يوجد أعضاء في هذه الفئة حالياً"
            titleEn="No members in this category yet"
            descriptionAr="اختر فئة أخرى لعرض أعضاء الفريق."
            descriptionEn="Select another category to view team members."
          />
        ) : (
          <div className="about-team-grid-wrap">
            <ChromaGrid
              items={chromaItems}
              radius={320}
              columns={3}
              rows={Math.ceil(chromaItems.length / 3)}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
            />
          </div>
        )}
      </section>

      {/* 5. Posters & Visual Designs Showcase Gallery */}
      <section className="about-posters-section" aria-labelledby="posters-section-title">
        <div className="text-center posters-head">
          <span className="eyebrow">{isAr ? "الهوية البصرية والملصقات الرسمية" : "Visual Designs & Media"}</span>
          <h2 id="posters-section-title">
            {isAr ? "معرض التوثيق البصري والإنجازات الميدانية" : "Official Posters & Media Gallery"}
          </h2>
          <p className="posters-sub">
            {isAr
              ? "استكشف الهوية البصرية، ومحطات توقيع مذكرات التفاهم الاستراتيجية، والملصقات التوثيقية لفعاليات كلايمتيفاي."
              : "Explore our official visual media, MoU signing milestones, and campaign posters."}
          </p>
        </div>

        <div className="posters-masonry-grid">
          {OFFICIAL_POSTERS.map((poster) => (
            <div
              key={poster.id}
              className="poster-card-item card glass"
              onClick={() => setSelectedPoster(poster)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelectedPoster(poster);
              }}
            >
              <div className="poster-image-wrap">
                <img
                  src={poster.image}
                  alt={isAr ? poster.titleAr : poster.titleEn}
                  className="poster-img"
                  loading="lazy"
                />
                <div className="poster-hover-overlay">
                  <ImageIcon size={28} />
                  <span>{isAr ? "عرض الملصق بدقة كاملة" : "View Full Size"}</span>
                </div>
              </div>
              <div className="poster-meta-content">
                <span className="poster-cat-badge">{isAr ? poster.categoryAr : poster.categoryEn}</span>
                <h4>{isAr ? poster.titleAr : poster.titleEn}</h4>
                <p>{isAr ? poster.descriptionAr : poster.descriptionEn}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Lightbox Modal for Posters */}
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
            aria-labelledby="lightbox-poster-title"
          >
            {/* Ambient Image Showcase Panel */}
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

            {/* Structured Content & Details Sidebar */}
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
                <h3 id="lightbox-poster-title">
                  {isAr ? selectedPoster.titleAr : selectedPoster.titleEn}
                </h3>
                <p className="lightbox-description">
                  {isAr ? selectedPoster.descriptionAr : selectedPoster.descriptionEn}
                </p>

                {/* Metadata Chips */}
                <div className="lightbox-meta-chips">
                  <div className="meta-chip">
                    <Calendar size={14} />
                    <span>{isAr ? selectedPoster.dateAr : selectedPoster.dateEn}</span>
                  </div>
                  <div className="meta-chip">
                    <Building2 size={14} />
                    <span>{isAr ? selectedPoster.partnerAr : selectedPoster.partnerEn}</span>
                  </div>
                </div>
              </div>

              <div className="lightbox-footer">
                {selectedPoster.reportUrl && (
                  <a
                    href={selectedPoster.reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lightbox-action-btn primary"
                  >
                    <ExternalLink size={16} />
                    <span>{isAr ? "فتح تقرير SHIFT (PDF)" : "Open SHIFT Report"}</span>
                  </a>
                )}
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

      {/* 7. Call-To-Action Annual Report Banner */}
      <section className="about-reports-section">
        <div className="reports-flex-container">
          <div className="reports-text">
            <h2>{isAr ? "التقرير السنوي لتقدم كلايمتيفاي" : "Climatify Annual Progress Reports"}</h2>
            <p>
              {isAr
                ? "نلتزم بأعلى معايير الشفافية والمسؤولية. يمكنك الاطلاع على تقاريرنا السنوية لاستعراض المبادرات، ومؤشرات الأداء، والأثر البيئي والمجتمعي الموثق بالأرقام."
                : "Our transparency is our strength. Download our annual reports now to see the initiatives, milestones, and actual carbon offsets."}
            </p>
          </div>
          <div className="reports-actions">
            <a
              href={ANNUAL_REPORT_URL}
              download="Climatify-Annual-Impact-Report.pdf"
              className="btn btn-primary download-btn"
            >
              <Download size={18} aria-hidden="true" />
              <span>{isAr ? "تحميل تقرير الإنجازات السنوي (PDF)" : "Download Progress Report"}</span>
              <ExternalLink size={14} style={{ marginInlineStart: 6 }} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
