import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";

import { useLocation, Link } from "react-router-dom";

import { useLanguage } from "../../context/LanguageContext";

import { apiService, ApiError } from "../../services/api";

import type { Program, Initiative } from "../../types";
import { mockHandsOnTracks } from "../../data/staticContent";
import { setScrollLocked } from "../../components/layout/scrollController";

import {
  Monitor,
  Search,
  Megaphone,
  Users,
  MessageSquare,
  Activity,
  Leaf,
  TreePine,
  X,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Target,
  QrCode,
  Rocket,
  Compass,
  Layers,
  Maximize2,
  CheckCircle2,
  ExternalLink,
  Gamepad2,
  Trophy,
  Droplets,
  Palette,
  Heart,
  Flower2,
  TrendingUp,
  BarChart3,
  Lightbulb,
  Globe,
  ArrowUpRight
} from "lucide-react";

const TRACK_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean | "true" | "false" }>> = {
  "self-watering": Droplets,
  "trash-to-art": Palette,
  "mental-health": Heart,
  "die-beauty": Flower2,
};

import { SEO } from "../../components/common/SEO";

import "./Programs.css";

/** Placeholder used when a CMS image 404s. Applied once so a failing fallback cannot loop. */

const IMAGE_FALLBACK =

  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80";

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {

  const img = e.currentTarget;

  if (img.dataset.fallbackApplied === "true") return;

  img.dataset.fallbackApplied = "true";

  img.src = IMAGE_FALLBACK;

};

// ============================================================

// Icon mapping — بيربط اسم الـ icon اللي بيرجع من الباك إند بالـ component المناسب

// ============================================================

type IconType = typeof Monitor;

const getProgramIcon = (iconName: string): IconType => {

  switch (iconName) {

    case "Monitor": return Monitor;

    case "Search": return Search;

    case "Megaphone": return Megaphone;

    case "Users": return Users;

    case "MessageSquare": return MessageSquare;

    case "Leaf": return Leaf;

    case "TreePine": return TreePine;

    default: return Activity;

  }

};

// ============================================================

// Main Programs Component

// ============================================================

export const Programs: React.FC = () => {

  const { language, t } = useLanguage();

  const isAr = language === "ar";

  // --- Data state ---

  const [programs, setPrograms] = useState<Program[]>([]);

  const [initiatives, setInitiatives] = useState<Initiative[]>([]);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState<unknown>(null);

  const [reloadToken, setReloadToken] = useState(0);

  // --- Filter and Modal state ---

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const [initiativeFilter, setInitiativeFilter] = useState<"all" | "campaign" | "program" | "camp" | "workshop" | "game" | "hackathon">("all");

  const [showQrModal, setShowQrModal] = useState(false);

  const [showHandsOnModal, setShowHandsOnModal] = useState(false);

  const [selectedTrackId, setSelectedTrackId] = useState<string>("self-watering");

  const activeHandsOnTrack = useMemo(

    () => mockHandsOnTracks.find((t) => t.id === selectedTrackId) ?? mockHandsOnTracks[0]!,

    [selectedTrackId]

  );

  // --- Refs ---

  const location = useLocation();

  const modalRef = useRef<HTMLDivElement>(null);

  const triggerBtnRef = useRef<HTMLElement | null>(null);

  // ============================================================

  // تحميل البيانات من الباك إند

  // ============================================================

  useEffect(() => {

    const controller = new AbortController();

    const loadProgramsData = async () => {

      setLoading(true);

      setLoadError(null);

      try {

        const [progData, initData] = await Promise.all([

          apiService.getPrograms(),

          apiService.getInitiatives()

        ]);

        if (controller.signal.aborted) return;

        setPrograms(Array.isArray(progData) ? progData : []);

        setInitiatives(Array.isArray(initData) ? initData : []);

      } catch (err) {

        if (controller.signal.aborted) return;

        console.error("Error loading programs:", err);

        setLoadError(err);

      } finally {

        if (!controller.signal.aborted) setLoading(false);

      }

    };

    void loadProgramsData();

    return () => controller.abort();

  }, [reloadToken]);

  const retry = useCallback(() => setReloadToken((n) => n + 1), []);

  const errorMessage = loadError

    ? loadError instanceof ApiError

      ? loadError.localizedMessage(language)

      : isAr

        ? "حدث خطأ غير متوقع."

        : "An unexpected error occurred."

    : null;

  // التمرير للبرنامج المحدد في الرابط الـ hash anchor

  useEffect(() => {

    if (loading || !location.hash) return;

    const id = location.hash.replace("#", "");

    const element = document.getElementById(id);

    if (!element) return;

    const scrollTimer = setTimeout(() => {

      element.scrollIntoView({ behavior: "smooth" });

    }, 100);

    return () => clearTimeout(scrollTimer);

  }, [loading, location.hash]);

  // ============================================================

  // Modal handlers

  // ============================================================

  const closeModal = useCallback(() => {

    setSelectedProgram(null);

  }, []);

  const openModal = useCallback((program: Program) => {

    triggerBtnRef.current = document.activeElement as HTMLElement;

    setSelectedProgram(program);

  }, []);

  useEffect(() => {

    if (!selectedProgram && !showQrModal && !showHandsOnModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {

      if (e.key === "Escape") {

        closeModal();

        setShowQrModal(false);

        setShowHandsOnModal(false);

        return;

      }

      if (e.key === "Tab") {

        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(

          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

        );

        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];

        const last = focusable[focusable.length - 1];

        if (!first || !last) return;

        if (e.shiftKey && document.activeElement === first) {

          e.preventDefault();

          last.focus();

        } else if (!e.shiftKey && document.activeElement === last) {

          e.preventDefault();

          first.focus();

        }

      }

    };

    document.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";
    setScrollLocked(true);

    const focusTimer = setTimeout(() => {

      const closeBtn = modalRef.current?.querySelector<HTMLElement>(".programs-modal-close-btn");

      closeBtn?.focus();

    }, 100);

    return () => {

      document.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = "";
      setScrollLocked(false);

      clearTimeout(focusTimer);

      triggerBtnRef.current?.focus();

    };

  }, [selectedProgram, showQrModal, showHandsOnModal, closeModal]);

  // ============================================================

  // Derived values & Initiative Filtering

  // ============================================================

  const filteredInitiatives = useMemo(() => {

    if (initiativeFilter === "all") return initiatives;

    return initiatives.filter((init) => {

      if (init.type) return init.type === initiativeFilter;

      const combined = `${init.categoryEn} ${init.categoryAr}`.toLowerCase();

      if (initiativeFilter === "campaign") return combined.includes("campa") || combined.includes("حمل");

      if (initiativeFilter === "program") return combined.includes("prog") || combined.includes("برامج");

      if (initiativeFilter === "camp") return combined.includes("camp") || combined.includes("معسكر");

      if (initiativeFilter === "workshop") return combined.includes("work") || combined.includes("ورش");

      if (initiativeFilter === "game") return combined.includes("game") || combined.includes("ألعاب") || combined.includes("لعب");

      if (initiativeFilter === "hackathon") return combined.includes("hack") || combined.includes("هاكاثون");

      return true;

    });

  }, [initiatives, initiativeFilter]);

  const featuredInitiative = useMemo(() => filteredInitiatives[0] ?? null, [filteredInitiatives]);

  const otherInitiatives = useMemo(() => filteredInitiatives.slice(1), [filteredInitiatives]);

  const longDescription = selectedProgram

    ? ((isAr ? selectedProgram.longDescriptionAr : selectedProgram.longDescriptionEn) ?? "").trim()

    : "";

  // ============================================================

  // Render: Loading skeleton

  // ============================================================

  if (loading) {

    return (

      <div className="programs-page-container">

        <div className="programs-skeleton-hero" />

        <div className="container">

          <div className="programs-skeleton-grid" role="status" aria-live="polite">

            <span className="sr-only">{isAr ? "جارٍ تحميل البرامج…" : "Loading programs…"}</span>

            {Array.from({ length: 6 }, (_, i) => (

              <div key={i} className="programs-skeleton-card">

                <div className="p-skeleton-bar p-skeleton-accent" />

                <div className="p-skeleton-bar p-skeleton-icon" />

                <div className="p-skeleton-bar p-skeleton-title" />

                <div className="p-skeleton-bar p-skeleton-text" />

                <div className="p-skeleton-bar p-skeleton-text" />

                <div className="p-skeleton-bar p-skeleton-btn" />

              </div>

            ))}

          </div>

        </div>

      </div>

    );

  }

  // ============================================================

  // Render: Error state

  // ============================================================

  // قبل كده الفرع ده ما كانش بيشتغل أبداً لأن الـ api كانت بتبلع كل الأخطاء.

  // دلوقتي بيشتغل فعلاً، فلازم يعرض سبب الفشل ويدي المستخدم زرار إعادة محاولة.

  if (errorMessage) {

    return (

      <div className="programs-page-container container">

        <div className="programs-error-state" role="alert">

          <div className="programs-error-icon" aria-hidden="true">

            <Activity size={48} />

          </div>

          <h1>{isAr ? "تعذّر تحميل البرامج" : "Failed to load programs"}</h1>

          <p>{errorMessage}</p>

          <button type="button" className="btn btn-primary programs-retry-btn" onClick={retry}>

            <RotateCcw size={16} aria-hidden="true" />

            <span>{isAr ? "إعادة المحاولة" : "Try again"}</span>

          </button>

        </div>

      </div>

    );

  }

  // ============================================================

  // Render: Main page

  // ============================================================

  return (

    <div className="programs-page-container">

      <SEO

        title={isAr ? "البرامج والمبادرات القيادية المناخية" : "Flagship Climate Programs & Initiatives"}

        description={

          isAr

            ? "برامج استراتيجية رائدة في العمل المناخي والتمكين الشبابي وبناء القدرات، مثل برنامج SHIFT ومبادرات الابتكار والاستدامة في الإمارات والمنطقة."

            : "Strategic programs driving climate action, youth empowerment, and capacity building including the SHIFT Program and green innovation across UAE & MENA."

        }

        breadcrumbs={[

          { name: isAr ? "الرئيسية" : "Home", path: "/" },

          { name: isAr ? "البرامج والمبادرات" : "Programs & Initiatives", path: "/programs" },

        ]}

      />

      {/* ===== 1. Hero Section ===== */}

      <section className="programs-hero">

        <div className="programs-hero-bg" aria-hidden="true" />

        <div className="container programs-hero-inner">

          <div className="programs-hero-content">

            <span className="programs-hero-eyebrow">

              <Sparkles size={16} />

              {isAr ? "أنشطة وبرامج" : "Activities & Programs"}

            </span>

            <h1 className="programs-hero-title">

              {isAr ? "البرامج والمبادرات القيادية" : "Flagship Programs & Initiatives"}

            </h1>

            <p className="programs-hero-lead">

              {isAr

                ? "برامج استراتيجية رائدة في العمل المناخي والتمكين الشبابي وبناء القدرات، من مسارات التسريع والابتكار إلى المعسكرات الميدانية والزمالات النوعية."

                : "Strategic programs driving climate action, youth empowerment, and capacity building — from accelerator tracks and green innovation to immersive field camps and fellowships."}

            </p>

          </div>

        </div>

      </section>

      <div className="container programs-main-content">

        {/* ===== 2. SHIFT Flagship Program Spotlight ===== */}

        <section className="shift-spotlight-section">

          <div className="shift-spotlight-card">

            <div className="shift-spotlight-badge-row">

              <span className="shift-tag-pill">

                <Rocket size={15} />

                {isAr ? "برنامج SHIFT الرائد ٢٠٢٥ | Flagship Program" : "SHiFT Flagship Program 2025"}

              </span>

              <span className="shift-cohort-pill">

                <Users size={14} />

                {isAr ? "بناء قدرات الشباب وإعداد القيادات" : "Youth Capacity Building & Leadership"}

              </span>

            </div>

            <div className="shift-spotlight-grid">

              <div className="shift-spotlight-text">

                <h2>

                  {isAr

                    ? "برنامج SHIFT – بناء قدرات الشباب وإعداد القيادات المستقبلية ٢٠٢٥"

                    : "SHiFT Program – Youth Capacity Building & Leadership 2025"}

                </h2>

                {/* Program Overview */}

                <div className="shift-section-block">

                  <h3 className="shift-block-title">

                    <Compass size={16} />

                    <span>{isAr ? "نبذة عن البرنامج" : "Program Overview"}</span>

                  </h3>

                  <p className="shift-overview-lead">

                    {isAr

                      ? "برنامج SHIFT هو برنامج إقليمي لبناء قدرات الشباب والتطوير المهني، تقوده كلايمتفاي بالتعاون مع شركاء إقليميين ودوليين، بهدف سد الفجوة بين المعرفة الأكاديمية والتطبيق العملي، من خلال مسار متكامل يجمع بين التدريب المتخصص، والتدريب المهني العملي، والإرشاد والقيادة الشبابية، وصولًا إلى إعداد جيل من المهنيين الشباب القادرين على المساهمة في قطاع التنمية المستدامة."

                      : "SHiFT is a youth capacity-building and professional development program led by Climatify, designed to bridge the gap between academic knowledge and practical experience. Through technical training, thematic learning, professional internships, and youth-led mentorship, the program equips emerging leaders with the skills to contribute to sustainable development."}

                  </p>

                </div>

                {/* Key Results */}

                <div className="shift-section-block">

                  <h3 className="shift-block-title">

                    <Trophy size={16} />

                    <span>

                      {isAr ? "أبرز مخرجات الدفعة الأولى – SHIFT 2025" : "SHiFT 2025 – Key Results"}

                    </span>

                  </h3>

                  <div className="shift-results-grid">

                    <div className="shift-result-card">

                      <span className="shift-result-num">60</span>

                      <span className="shift-result-lbl">

                        {isAr ? "مشاركًا من 5 دول" : "Participants from 5 countries"}

                      </span>

                    </div>

                    <div className="shift-result-card">

                      <span className="shift-result-num">14</span>

                      <span className="shift-result-lbl">

                        {isAr ? "جلسة تدريبية ضمن 3 مسارات" : "Sessions across 3 tracks"}

                      </span>

                    </div>

                    <div className="shift-result-card">

                      <span className="shift-result-num">10</span>

                      <span className="shift-result-lbl">

                        {isAr ? "فيديوهات توعوية مناخية" : "Awareness videos produced"}

                      </span>

                    </div>

                    <div className="shift-result-card">

                      <span className="shift-result-num">4</span>

                      <span className="shift-result-lbl">

                        {isAr ? "مشروعات بخرائط أصحاب المصلحة" : "Proposals with stakeholder maps"}

                      </span>

                    </div>

                    <div className="shift-result-card">

                      <span className="shift-result-num">&gt;80%</span>

                      <span className="shift-result-lbl">

                        {isAr ? "نسبة الحضور في التدريب" : "Attendance rate across sessions"}

                      </span>

                    </div>

                    <div className="shift-result-card">

                      <span className="shift-result-badge-text">

                        {isAr ? "شبكة سفراء" : "Network"}

                      </span>

                      <span className="shift-result-lbl">

                        {isAr ? "تأسيس شبكة سفراء SHIFT للقيادة والإرشاد" : "SHiFT Ambassador Network established"}

                      </span>

                    </div>

                  </div>

                </div>

                {/* Program Objectives */}

                <div className="shift-section-block">

                  <h3 className="shift-block-title">

                    <Target size={16} />

                    <span>{isAr ? "أهداف البرنامج" : "Program Objectives"}</span>

                  </h3>

                  <div className="shift-objectives-grid">

                    <div className="shift-objective-item">

                      <CheckCircle2 size={18} className="shift-obj-icon" />

                      <span>

                        {isAr

                          ? "تطوير المهارات التقنية والتحليلية والقيادية لدى الشباب."

                          : "Develop technical, analytical, and leadership competencies."}

                      </span>

                    </div>

                    <div className="shift-objective-item">

                      <CheckCircle2 size={18} className="shift-obj-icon" />

                      <span>

                        {isAr

                          ? "تعزيز قدراتهم في إعداد أوراق السياسات والبحوث والمقترحات والمشروعات التنموية."

                          : "Strengthen skills in policy writing, research, project proposals, and stakeholder mapping."}

                      </span>

                    </div>

                    <div className="shift-objective-item">

                      <CheckCircle2 size={18} className="shift-obj-icon" />

                      <span>

                        {isAr

                          ? "إتاحة فرص للتدريب المهني والتطبيق العملي بالتعاون مع المؤسسات الشريكة."

                          : "Connect young professionals with practical internship opportunities."}

                      </span>

                    </div>

                    <div className="shift-objective-item">

                      <CheckCircle2 size={18} className="shift-obj-icon" />

                      <span>

                        {isAr

                          ? "تأسيس شبكة مستدامة من سفراء البرنامج لدعم التعلم بين الأقران ونقل المعرفة."

                          : "Establish a sustainable network of youth ambassadors and mentors."}

                      </span>

                    </div>

                  </div>

                </div>

                {/* Thematic Areas */}

                <div className="shift-section-block">

                  <h3 className="shift-block-title">

                    <Layers size={16} />

                    <span>

                      {isAr ? "المجالات الموضوعية (Thematic Areas)" : "Thematic Areas"}

                    </span>

                  </h3>

                  <div className="shift-thematic-pills">

                    <span className="shift-thematic-pill">

                      {isAr ? "التغير المناخي والاستدامة البيئية" : "Climate Change & Sustainability"}

                    </span>

                    <span className="shift-thematic-pill">

                      {isAr ? "الاقتصاد الأخضر والاقتصاد الدائري" : "Green & Circular Economy"}

                    </span>

                    <span className="shift-thematic-pill">

                      {isAr ? "الزراعة المستدامة والأمن المائي" : "Sustainable Agriculture & Water Security"}

                    </span>

                    <span className="shift-thematic-pill">

                      {isAr ? "المساواة بين الجنسين والتنمية الشاملة" : "Gender Equality"}

                    </span>

                    <span className="shift-thematic-pill">

                      {isAr ? "السياسات العامة والحوكمة والدبلوماسية الأوروبية" : "Public Policy & EU Diplomacy"}

                    </span>

                    <span className="shift-thematic-pill">

                      {isAr ? "الذكاء الاصطناعي والتكنولوجيا وابتكارات الفضاء" : "AI, Technology & Space Innovation"}

                    </span>

                    <span className="shift-thematic-pill">

                      {isAr ? "القيادة الشبابية والتفاوض والتواصل الفعّال" : "Youth Leadership & Negotiation"}

                    </span>

                  </div>

                </div>

                {/* Program Partners */}

                <div className="shift-section-block shift-partners-block">

                  <h3 className="shift-block-title">

                    <Users size={16} />

                    <span>{isAr ? "شركاء البرنامج" : "Program Partners"}</span>

                  </h3>

                  <div className="shift-partners-list">

                    <span className="shift-partner-tag">

                      {isAr ? "كلايمتفاي (Climatify)" : "Climatify"}

                    </span>

                    <span className="shift-partner-tag">Wavemakers United</span>

                    <span className="shift-partner-tag">Space Point</span>

                    <span className="shift-partner-tag">EU Jeel Connect</span>

                  </div>

                </div>

                {/* Action Buttons */}

                <div className="shift-actions-row">

                  <a

                    href="https://acrobat.adobe.com/id/urn:aaid:sc:EU:a9632f47-907d-42d3-bc03-01173f32367b"

                    target="_blank"

                    rel="noopener noreferrer"

                    className="btn btn-primary shift-btn-primary"

                  >

                    <ExternalLink size={16} />

                    <span>{isAr ? "فتح تقرير SHIFT (PDF)" : "Open SHIFT Report (PDF)"}</span>

                  </a>

                  <Link

                    to="/blog/climatify-shift-first-cohort-graduation"

                    className="btn btn-outline shift-btn-report"

                  >

                    <span>{isAr ? "تغطية حفل تخرج الدفعة الأولى" : "First Cohort Graduation"}</span>

                    <ArrowRight size={15} />

                  </Link>

                </div>

              </div>

              {/* Sidebar with poster */}

              <div className="shift-spotlight-media">

                <img

                  src="/ambassadors/shift-internship-poster.webp"

                  alt={

                    isAr

                      ? "الملصق الرسمي لبرنامج تدريب وبناء قدرات SHIFT 2025"

                      : "SHiFT Program Official Poster 2025"

                  }

                  className="shift-spotlight-poster-img"

                  loading="lazy"

                  onError={handleImageError}

                />

              </div>

            </div>

          </div>

        </section>

        {/* ===== 3. Programs Grid ===== */}

        <section className="programs-grid-section">

          <div className="programs-section-header">

            <span className="eyebrow">{isAr ? "البرامج التأسيسية" : "Core Programs"}</span>

            <h2>

              {isAr

                ? "برامجنا في العمل المناخي والتمكين"

                : "Our Programs in Climate Action & Youth Empowerment"}

            </h2>

          </div>

          {programs.length > 0 ? (

            <div className="programs-grid">

              {programs.map((program) => {

                const Icon = getProgramIcon(program.icon);

                return (

                  <article

                    key={program.id}

                    id={program.id}

                    className="program-card-v2"

                  >

                    <div className="program-card-accent-bar" aria-hidden="true" />

                    <div className="program-card-body">

                      <div className="program-card-icon">

                        <Icon size={26} />

                      </div>

                      <h3 className="program-card-title">

                        {isAr ? program.titleAr : program.titleEn}

                      </h3>

                      <p className="program-card-desc">

                        {isAr ? program.descriptionAr : program.descriptionEn}

                      </p>

                      <button

                        onClick={() => openModal(program)}

                        className="program-card-btn"

                        aria-label={

                          isAr

                            ? `اعرف المزيد عن ${program.titleAr}`

                            : `Learn more about ${program.titleEn}`

                        }

                      >

                        <span>{isAr ? "تفاصيل البرنامج" : "Learn More"}</span>

                        <ArrowRight size={16} className="program-card-btn-arrow" />

                      </button>

                    </div>

                  </article>

                );

              })}

            </div>

          ) : (

            <div className="programs-empty-state">

              <div className="programs-empty-icon">

                <Activity size={48} />

              </div>

              <h3>{isAr ? "لا توجد برامج متاحة" : "No programs available"}</h3>

              <p>{isAr ? "سيتم إضافة برامج قريباً." : "Programs will be added soon."}</p>

            </div>

          )}

        </section>

        {/* ===== 4. Initiatives Section with 4-Track Filter ===== */}

        <section className="programs-initiatives-section">

          <div className="programs-section-header">

            <span className="eyebrow">{t("initiatives")}</span>

            <h2>

              {isAr ? "المبادرات — أنشطة وبرامج نوعية" : "Initiatives — Flagship Activities"}

            </h2>

            <p className="initiatives-section-note">

              {isAr

                ? "ملحوظة: البرامج تضم تحت مظلتها مبادرات وحملات مقسمة عبر محاور رئيسية تشمل:"

                : "Note: Programs encompass focused initiatives and campaigns structured across core pillars:"}

            </p>

          </div>

          {/* Category Filter Pills: الحملات، برامج، معسكرات، ورش عمل، ألعاب بيئية */}

          <div className="initiatives-category-tabs" role="tablist">

            <button

              type="button"

              className={`initiative-filter-pill ${initiativeFilter === "all" ? "active" : ""}`}

              onClick={() => setInitiativeFilter("all")}

              role="tab"

              aria-selected={initiativeFilter === "all"}

            >

              <Layers size={15} />

              <span>{isAr ? "جميع المبادرات" : "All Initiatives"}</span>

              <span className="filter-pill-badge">{initiatives.length}</span>

            </button>

            <button

              type="button"

              className={`initiative-filter-pill ${initiativeFilter === "campaign" ? "active" : ""}`}

              onClick={() => setInitiativeFilter("campaign")}

              role="tab"

              aria-selected={initiativeFilter === "campaign"}

            >

              <Megaphone size={15} />

              <span>{isAr ? "الحملات التوعوية" : "Campaigns"}</span>

            </button>

            <button

              type="button"

              className={`initiative-filter-pill ${initiativeFilter === "program" ? "active" : ""}`}

              onClick={() => setInitiativeFilter("program")}

              role="tab"

              aria-selected={initiativeFilter === "program"}

            >

              <Compass size={15} />

              <span>{isAr ? "البرامج المتخصصة" : "Programs"}</span>

            </button>

            <button

              type="button"

              className={`initiative-filter-pill ${initiativeFilter === "camp" ? "active" : ""}`}

              onClick={() => setInitiativeFilter("camp")}

              role="tab"

              aria-selected={initiativeFilter === "camp"}

            >

              <TreePine size={15} />

              <span>{isAr ? "المعسكرات البيئية" : "Camps"}</span>

            </button>

            <button

              type="button"

              className={`initiative-filter-pill ${initiativeFilter === "workshop" ? "active" : ""}`}

              onClick={() => setInitiativeFilter("workshop")}

              role="tab"

              aria-selected={initiativeFilter === "workshop"}

            >

              <QrCode size={15} />

              <span>{isAr ? "ورش العمل التفاعلية" : "Workshops"}</span>

            </button>

            <button

              type="button"

              className={`initiative-filter-pill ${initiativeFilter === "game" ? "active" : ""}`}

              onClick={() => setInitiativeFilter("game")}

              role="tab"

              aria-selected={initiativeFilter === "game"}

            >

              <Gamepad2 size={15} />

              <span>{isAr ? "الألعاب البيئية" : "Environmental Games"}</span>

            </button>

            <button

              type="button"

              className={`initiative-filter-pill ${initiativeFilter === "hackathon" ? "active" : ""}`}

              onClick={() => setInitiativeFilter("hackathon")}

              role="tab"

              aria-selected={initiativeFilter === "hackathon"}

            >

              <Trophy size={15} />

              <span>{isAr ? "هاكاثونات الابتكار" : "Hackathons"}</span>

            </button>

          </div>

          {/* Workshop Dedicated Portfolio QR Card (Appears on workshops tab or all) */}

          {(initiativeFilter === "workshop" || initiativeFilter === "all") && (

            <div className="workshop-portfolio-qr-card">

              <div className="workshop-qr-left">

                <span className="workshop-qr-eyebrow">

                  <QrCode size={14} />

                  Our Workshop Portfolio

                </span>

                <h3>

                  {isAr

                    ? "ملف ورش العمل: امسح رمز الاستجابة السريعة (QR) لاستعراض كافة الورش في البورتفوليو"

                    : "Our Workshop: Scan the QR Code to Explore All Workshops in Portfolio"}

                </h3>

                <p>

                  {isAr

                    ? "جميع ورش العمل التفاعلية، ونماذج التدريب، ووثائق برنامج SHIFT وبرنامج المتدربين Interns متواجدة وموثقة بالكامل داخل البورتفوليو الرقمي."

                    : "All interactive workshops, training frameworks, SHIFT deliverables, and Intern program materials are curated inside the digital portfolio."}

                </p>

                <div className="workshop-pills-list">

                  <span
                    className="workshop-item-pill workshop-item-pill-action clickable-pill"
                    onClick={() => {
                      setSelectedTrackId("self-watering");
                      setShowHandsOnModal(true);
                    }}
                    role="button"
                    tabIndex={0}
                    title={isAr ? "انقر لاستعراض محاور الورشة الأربعة" : "Click to explore the 4 workshop tracks"}
                  >
                    <Sparkles size={13} className="pill-icon" aria-hidden="true" />
                    <span>{isAr ? "1. ورش العمل التطبيقية (4 مسارات)" : "1. Hands-on Workshop (4 Tracks)"}</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </span>

                  <span className="workshop-item-pill">2. Road to 2028</span>

                  <span className="workshop-item-pill">3. Ramadan أخضر (Green Ramadan)</span>

                  <span className="workshop-item-pill">4. SHIFT Workshop</span>

                </div>

                <div className="workshop-qr-meta-notice">

                  <CheckCircle2 size={16} />

                  <span>

                    {isAr

                      ? "برنامج SHIFT وبرنامج المتدربين (Interns Program) متواجدان وموثقان بالتفصيل ضمن البورتفوليو."

                      : "SHIFT Program and the Interns Program are documented in detail within the official portfolio."}

                  </span>

                </div>

              </div>

              <div className="workshop-qr-right">

                <div className="workshop-qr-frame" onClick={() => setShowQrModal(true)}>

                  <img

                    src="/workshops-portfolio-qr.webp"

                    alt="Workshops Portfolio QR Code"

                    className="workshop-qr-img"

                    width={180}

                    height={180}

                  />

                  <div className="workshop-qr-overlay">

                    <Maximize2 size={20} />

                    <span>{isAr ? "تكبير الرمز" : "Enlarge QR"}</span>

                  </div>

                </div>

                <span className="workshop-qr-caption">

                  {isAr ? "وجّه كاميرا هاتفك للمسح الفوري" : "Point your phone camera to scan"}

                </span>

              </div>

            </div>

          )}

          {/* ===== Dedicated Minimal Modern Hands-on Workshop Section ===== */}

          {(initiativeFilter === "workshop" || initiativeFilter === "all") && (

            <div id="hands-on-workshops" className="hands-on-spotlight-section">

              <div className="hands-on-header">

                <span className="hands-on-eyebrow">

                  <Sparkles size={15} />

                  {isAr ? "محاور ورشة العمل التطبيقية" : "Hands-on Workshop Modules"}

                </span>

                <h3 className="hands-on-main-title">

                  {isAr

                    ? "ورشة العمل التطبيقية: 4 مسارات تفاعلية مبتكرة للاستدامة العملية"

                    : "Hands-on Workshop: 4 Innovative Tracks in Practical Sustainability"}

                </h3>

                <p className="hands-on-main-desc">

                  {isAr

                    ? "تجارب تطبيقية تجمع بين التعليم البيئي والمرح والابتكار الحرفي: من الزراعة ذاتية الري، وتحويل المخلفات إلى فن، إلى الصحة النفسية والارتباط بالطبيعة، والصباغة العضوية النباتية."

                    : "Immersive hands-on masterclasses fusing environmental education, playful learning, and eco-craft: Self-Watering Planting, Trash to Art, Mental Health & Nature, and Die Beauty."}

                </p>

              </div>

              <div className="hands-on-cards-grid">

                {mockHandsOnTracks.map((track) => (

                  <div

                    key={track.id}

                    className="hands-on-track-card"

                    onClick={() => {

                      setSelectedTrackId(track.id);

                      setShowHandsOnModal(true);

                    }}

                    role="button"

                    tabIndex={0}

                  >

                    <div className="hands-on-img-wrap">

                      <img

                        src={track.image}

                        alt={isAr ? track.titleAr : track.titleEn}

                        className="hands-on-track-img"

                        loading="lazy"

                        decoding="async"

                        onError={handleImageError}

                      />

                      <span className="hands-on-card-tag">
                        {React.createElement(TRACK_ICONS[track.id] || Sparkles, { size: 13, "aria-hidden": true })}
                        <span>
                          {track.id === "self-watering"
                            ? isAr ? "الزراعة ذاتية الري" : "Self-Watering"
                            : track.id === "trash-to-art"
                            ? isAr ? "تحويل المخلفات لفن" : "Trash to Art"
                            : track.id === "mental-health"
                            ? isAr ? "الصحة النفسية" : "Mental Health"
                            : "Die Beauty"}
                        </span>
                      </span>

                    </div>

                    <div className="hands-on-card-info">

                      <h4>{isAr ? track.titleAr : track.titleEn}</h4>

                      <p className="hands-on-track-tagline">

                        {isAr ? track.taglineAr : track.taglineEn}

                      </p>

                      <p className="hands-on-track-summary">

                        {isAr

                          ? track.descriptionAr.split("\n\n")[0]

                          : track.descriptionEn.split("\n\n")[0]}

                      </p>

                      <div className="hands-on-pills">

                        {(isAr ? track.tagsAr : track.tagsEn).slice(0, 3).map((tag, idx) => (

                          <span key={idx} className="hands-on-mini-pill">

                            {tag}

                          </span>

                        ))}

                      </div>

                      <button

                        type="button"

                        className="hands-on-open-track-btn"

                        onClick={(e) => {

                          e.stopPropagation();

                          setSelectedTrackId(track.id);

                          setShowHandsOnModal(true);

                        }}

                      >

                        <span>{isAr ? "تفاصيل المحور والتجربة" : "Explore Track Details"}</span>

                        <ArrowRight size={14} className="program-card-btn-arrow" />

                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          )}

          {/* Environmental Games Dedicated Interactive Card (Appears on games tab) */}

          {initiativeFilter === "game" && (

            <div className="games-interactive-spotlight-card">

              <div className="games-spotlight-left">

                <span className="games-spotlight-eyebrow">

                  <Gamepad2 size={14} />

                  {isAr ? "محفظة الألعاب البيئية والمحاكاة" : "Environmental Games Portfolio"}

                </span>

                <h3>

                  {isAr

                    ? "التعلم القائم على الألعاب والمحاكاة الاستراتيجية: AgriClash و GreenSharks"

                    : "Gamified Learning & Strategic Simulations: AgriClash & GreenSharks"}

                </h3>

                <p>

                  {isAr

                    ? "تتبنى كلايمتيفاي منهجية رائدة في دمج التعلم القائم على الألعاب والتفكير المنظومي لتجسيد تحديات المناخ، والتفاوض على الموارد، ونماذج الاستثمار الأخضر بصورة تطبيقية مشوقة."

                    : "Climatify pioneers game-based learning and systems thinking, translating complex climate dilemmas, resource negotiations, and green investment pitching into high-impact experiential simulations."}

                </p>

                <div className="workshop-pills-list">
                  <span className="workshop-item-pill">
                    <Gamepad2 size={13} className="pill-icon" aria-hidden="true" />
                    <span>{isAr ? "1. لعبة AgriClash التفاعلية" : "1. AgriClash Simulation"}</span>
                  </span>
                  <span className="workshop-item-pill">
                    <TrendingUp size={13} className="pill-icon" aria-hidden="true" />
                    <span>{isAr ? "2. تحدي GreenSharks الأخضر" : "2. GreenSharks Challenge"}</span>
                  </span>
                  <span className="workshop-item-pill">
                    <BarChart3 size={13} className="pill-icon" aria-hidden="true" />
                    <span>{isAr ? "3. حاسبة البصمة الكربونية" : "3. Carbon Simulator"}</span>
                  </span>
                  <span className="workshop-item-pill">
                    <TreePine size={13} className="pill-icon" aria-hidden="true" />
                    <span>{isAr ? "4. حديقة أشجار الغاف" : "4. Plant-a-Ghaf Garden"}</span>
                  </span>
                </div>

                <div className="workshop-qr-meta-notice">

                  <CheckCircle2 size={16} />

                  <span>

                    {isAr

                      ? "ألعاب المحاكاة طُوّرت بدعم ورعاية برنامج SHIFT والشركاء لتدريب رواد أعمال المناخ وصناع القرار."

                      : "Simulation games developed under SHIFT and partners to empower youth climate leaders and policy negotiators."}

                  </span>

                </div>

              </div>

              <div className="games-spotlight-right">

                <div className="games-spotlight-stats-card">

                  <span className="games-spotlight-num">1,500+</span>

                  <span className="games-spotlight-sub">

                    {isAr ? "لاعب ومشارك في محاكاة المناخ" : "Simulation Players Trained"}

                  </span>

                  <div className="games-spotlight-tag-row">

                    <span className="games-spotlight-tag">SHIFT Cohorts</span>

                    <span className="games-spotlight-tag">Living Labs</span>

                  </div>

                  <Link to="/games" className="btn btn-primary games-spotlight-cta">

                    <Gamepad2 size={16} />

                    <span>{isAr ? "مركز الألعاب الكامل" : "Open Games Hub"}</span>

                  </Link>

                </div>

              </div>

            </div>

          )}

          {/* Hackathons Dedicated Interactive Card (Appears on hackathons tab) */}

          {initiativeFilter === "hackathon" && (

            <div className="games-interactive-spotlight-card">

              <div className="games-spotlight-left">

                <span className="games-spotlight-eyebrow">

                  <Trophy size={14} />

                  {isAr ? "محفظة الهاكاثونات والتحديات" : "Climate Hackathons Portfolio"}

                </span>

                <h3>

                  {isAr

                    ? "هاكاثونات الابتكار المناخي والريادة: Green Echo و ICE Hackathon"

                    : "Climate Innovation Hackathons: Green Echo & ICE Hackathon"}

                </h3>

                <p>

                  {isAr

                    ? "تنظم كلايمتيفاي وتشارك في هاكاثونات إقليمية ودولية تستقطب مئات الطلاب والمبتكرين لتطوير نماذج تقنية مبتكرة في الأمن الغذائي وإزالة الكربون والعمل المناخي التطبيقي."

                    : "Climatify hosts and co-leads high-impact regional and international hackathons, mobilizing young innovators to solve critical climate, food security, and decarbonization challenges."}

                </p>

                <div className="workshop-pills-list">
                  <span className="workshop-item-pill">
                    <Trophy size={13} className="pill-icon" aria-hidden="true" />
                    <span>1. Green Echo Hackathon</span>
                  </span>
                  <span className="workshop-item-pill">
                    <Lightbulb size={13} className="pill-icon" aria-hidden="true" />
                    <span>2. ICE 2024 International Hackathon</span>
                  </span>
                  <span className="workshop-item-pill">
                    <Globe size={13} className="pill-icon" aria-hidden="true" />
                    <span>3. Climate Mobility Innovation Forum</span>
                  </span>
                </div>

                <div className="workshop-qr-meta-notice">

                  <CheckCircle2 size={16} />

                  <span>

                    {isAr

                      ? "أكثر من 400 فكرة ومشروع ريادي نافست في هاكاثونات كلايمتيفاي عبر الشرق الأوسط وأفريقيا."

                      : "Over 400 innovative concepts competed in Climatify-partnered hackathons across MENA."}

                  </span>

                </div>

              </div>

              <div className="games-spotlight-right">

                <div className="games-spotlight-stats-card">

                  <span className="games-spotlight-num">160+</span>

                  <span className="games-spotlight-sub">

                    {isAr ? "مشروعاً متنافساً في الدورة الواحدة" : "Competing Projects"}

                  </span>

                  <div className="games-spotlight-tag-row">

                    <span className="games-spotlight-tag">Green Echo</span>

                    <span className="games-spotlight-tag">ICE 2024</span>

                    <span className="games-spotlight-tag">Living Labs</span>

                  </div>

                </div>

              </div>

            </div>

          )}

          {/* Featured Initiative */}

          {featuredInitiative && (

            <div className="initiative-featured-card">

              <div className="initiative-featured-img-area">

                <img

                  src={featuredInitiative.image}

                  alt={isAr ? featuredInitiative.titleAr : featuredInitiative.titleEn}

                  className="initiative-featured-img"

                  width={840}

                  height={600}

                  loading="lazy"

                  decoding="async"

                  onError={handleImageError}

                />

              </div>

              <div className="initiative-featured-content">

                <span className="badge-category">

                  {isAr ? featuredInitiative.categoryAr : featuredInitiative.categoryEn}

                </span>

                <h3>

                  {isAr ? featuredInitiative.titleAr : featuredInitiative.titleEn}

                </h3>

                <p>

                  {isAr

                    ? featuredInitiative.descriptionAr

                    : featuredInitiative.descriptionEn}

                </p>

                <div className="initiative-progress-block">

                  <div className="progress-label-row">

                    <span>

                      {isAr ? "نسبة إنجاز المبادرة" : "Campaign Progress"}

                    </span>

                    <strong>{featuredInitiative.progress}%</strong>

                  </div>

                  <div className="initiative-progress-track">

                    <div

                      className="initiative-progress-fill"

                      style={{ width: `${featuredInitiative.progress}%` }}

                    />

                  </div>

                  <div className="initiative-target-box">

                    <Target size={16} />

                    <span>

                      <strong>

                        {isAr ? "الهدف: " : "Target: "}

                      </strong>

                      {isAr ? featuredInitiative.targetAr : featuredInitiative.targetEn}

                    </span>

                  </div>

                </div>

                {(featuredInitiative.type === "game" ||

                  featuredInitiative.categoryEn?.toLowerCase().includes("game")) && (

                  <div className="initiative-card-action">

                    <Link to="/games" className="btn btn-primary initiative-action-btn">

                      <Gamepad2 size={16} />

                      <span>{isAr ? "استكشف في مركز الألعاب" : "Explore in Games Hub"}</span>

                      <ArrowRight size={14} className="program-card-btn-arrow" />

                    </Link>

                  </div>

                )}

              </div>

            </div>

          )}

          {/* Other Initiatives Grid */}

          {otherInitiatives.length > 0 && (

            <div className="initiatives-grid">

              {otherInitiatives.map((init) => (

                <article key={init.id} className="initiative-grid-card">

                  <div className="initiative-grid-img-area">

                    <img

                      src={init.image}

                      alt={isAr ? init.titleAr : init.titleEn}

                      className="initiative-grid-img"

                      width={640}

                      height={400}

                      loading="lazy"

                      decoding="async"

                      onError={handleImageError}

                    />

                  </div>

                  <div className="initiative-grid-content">

                    <span className="badge-category">

                      {isAr ? init.categoryAr : init.categoryEn}

                    </span>

                    <h3>{isAr ? init.titleAr : init.titleEn}</h3>

                    <p>{isAr ? init.descriptionAr : init.descriptionEn}</p>

                    <div className="initiative-progress-block">

                      <div className="progress-label-row">

                        <span>{isAr ? "نسبة الإنجاز" : "Progress"}</span>

                        <strong>{init.progress}%</strong>

                      </div>

                      <div className="initiative-progress-track">

                        <div

                          className="initiative-progress-fill"

                          style={{ width: `${init.progress}%` }}

                        />

                      </div>

                      <div className="initiative-target-box">

                        <Target size={14} />

                        <span>{isAr ? init.targetAr : init.targetEn}</span>

                      </div>

                    </div>

                    {(init.type === "game" ||

                      init.categoryEn?.toLowerCase().includes("game")) && (

                      <div className="initiative-card-action">

                        <Link to="/games" className="btn btn-primary initiative-action-btn">

                          <Gamepad2 size={15} />

                          <span>{isAr ? "استكشف في مركز الألعاب" : "Explore in Games Hub"}</span>

                          <ArrowRight size={14} className="program-card-btn-arrow" />

                        </Link>

                      </div>

                    )}

                    {init.id === "workshop-hands-on" && (

                      <div className="initiative-card-action">

                        <button

                          type="button"

                          onClick={() => {

                            setSelectedTrackId("self-watering");

                            setShowHandsOnModal(true);

                          }}

                          className="btn btn-primary initiative-action-btn hands-on-card-btn"

                        >

                          <Sparkles size={15} />

                          <span>{isAr ? "استكشف محاور الورشة (4 محاور تطبيقية)" : "Explore Workshop Modules (4 Tracks)"}</span>

                          <ArrowRight size={14} className="program-card-btn-arrow" />

                        </button>

                      </div>

                    )}

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </div>

      {/* ===== 5. QR Code Modal ===== */}

      {showQrModal && (

        <div className="programs-modal-overlay" data-lenis-prevent onClick={() => setShowQrModal(false)}>

          <div

            className="programs-modal-card qr-lightbox-modal"

            role="dialog"

            aria-modal="true"

            aria-label="Workshops Portfolio QR"

            onClick={(e) => e.stopPropagation()}

          >

            <div className="programs-modal-header">

              <div className="programs-modal-header-content">

                <div className="programs-modal-icon">

                  <QrCode size={24} />

                </div>

                <div>

                  <span className="programs-modal-label">

                    {isAr ? "بورتفوليو ورش العمل" : "Workshops Portfolio"}

                  </span>

                  <h3 className="programs-modal-title">

                    Our Workshop Portfolio QR

                  </h3>

                </div>

              </div>

              <button

                className="programs-modal-close-btn"

                onClick={() => setShowQrModal(false)}

                aria-label={isAr ? "إغلاق" : "Close"}

              >

                <X size={20} />

              </button>

            </div>

            <div className="qr-lightbox-body">

              <img

                src="/workshops-portfolio-qr.webp"

                alt="Workshops Portfolio QR Code"

                className="qr-lightbox-img"

              />

              <p className="qr-lightbox-desc">

                {isAr

                  ? "امسح الرمز بواسطة كاميرا هاتفك الذكي للوصول مباشرة إلى ملف البورتفوليو الكامل، متضمناً الورش الأربعة وبرنامج SHIFT وبرنامج المتدربين."

                  : "Scan with your smartphone camera to access the full workshops portfolio, including all 4 workshops, SHIFT, and Intern program documentation."}

              </p>

            </div>

          </div>

        </div>

      )}

      {/* ===== 6. Hands-on Workshop Minimal Modern Lightbox Modal ===== */}

      {showHandsOnModal && activeHandsOnTrack && (

        <div className="programs-modal-overlay" data-lenis-prevent onClick={() => setShowHandsOnModal(false)}>

          <div

            className="programs-modal-card hands-on-lightbox-modal"

            role="dialog"

            aria-modal="true"

            aria-label={isAr ? activeHandsOnTrack.titleAr : activeHandsOnTrack.titleEn}

            onClick={(e) => e.stopPropagation()}

          >

            <div className="programs-modal-header">

              <div className="programs-modal-header-content">

                <div className="programs-modal-icon">

                  <Sparkles size={24} />

                </div>

                <div>

                  <span className="programs-modal-label">

                    {isAr ? "محاور ورشة العمل التطبيقية" : "Hands-on Workshop Modules"}

                  </span>

                  <h3 className="programs-modal-title">

                    {isAr ? "ورشة العمل التطبيقية (Hands-on Workshop)" : "Hands-on Workshop Tracks"}

                  </h3>

                </div>

              </div>

              <button

                className="programs-modal-close-btn"

                onClick={() => setShowHandsOnModal(false)}

                aria-label={isAr ? "إغلاق" : "Close"}

              >

                <X size={20} />

              </button>

            </div>

            {/* Navigation Tabs between the 4 tracks */}

            <div className="hands-on-modal-tabs" role="tablist">

              {mockHandsOnTracks.map((track) => {
                const Icon = TRACK_ICONS[track.id] || Sparkles;
                const isSelected = selectedTrackId === track.id;
                const tabLabel =
                  track.id === "self-watering"
                    ? isAr ? "الزراعة ذاتية الري" : "Self-Watering"
                    : track.id === "trash-to-art"
                    ? isAr ? "تحويل المخلفات لفن" : "Trash to Art"
                    : track.id === "mental-health"
                    ? isAr ? "الصحة النفسية" : "Mental Health"
                    : "Die Beauty";

                return (
                  <button
                    key={track.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`hands-on-modal-tab-btn ${isSelected ? "active" : ""}`}
                    onClick={() => setSelectedTrackId(track.id)}
                  >
                    <Icon size={15} aria-hidden="true" className="hands-on-tab-icon" />
                    <span>{tabLabel}</span>
                  </button>
                );
              })}

            </div>

            <div className="hands-on-modal-body">

              <div className="hands-on-modal-media-wrap">

                <img

                  src={activeHandsOnTrack.image}

                  alt={isAr ? activeHandsOnTrack.titleAr : activeHandsOnTrack.titleEn}

                  className="hands-on-modal-hero-img"

                  onError={handleImageError}

                />

                <span className="hands-on-modal-media-badge">
                  {React.createElement(TRACK_ICONS[activeHandsOnTrack.id] || Sparkles, { size: 14, "aria-hidden": true })}
                  <span>{isAr ? "ورشة تطبيقية تفاعلية" : "Interactive Hands-on Track"}</span>
                </span>

              </div>

              <div className="hands-on-modal-details">

                <div className="hands-on-modal-title-block">

                  <h4>{isAr ? activeHandsOnTrack.titleAr : activeHandsOnTrack.titleEn}</h4>

                  <p className="hands-on-modal-subtitle">

                    {isAr ? activeHandsOnTrack.taglineAr : activeHandsOnTrack.taglineEn}

                  </p>

                </div>

                <div className="hands-on-modal-text-content">

                  {(isAr ? activeHandsOnTrack.descriptionAr : activeHandsOnTrack.descriptionEn)

                    .split("\n\n")

                    .map((paragraph, idx) => (

                      <p key={idx} className="hands-on-paragraph">

                        {paragraph}

                      </p>

                    ))}

                </div>

                <div className="hands-on-modal-tags-section">

                  <span className="hands-on-tags-title">

                    {isAr ? "المميزات ومحاور التجربة:" : "Key Features & Experience Highlights:"}

                  </span>

                  <div className="hands-on-pills-row">

                    {(isAr ? activeHandsOnTrack.tagsAr : activeHandsOnTrack.tagsEn).map((t, idx) => (

                      <span key={idx} className="hands-on-modal-pill">

                        <CheckCircle2 size={13} />

                        {t}

                      </span>

                    ))}

                  </div>

                </div>

                <div className="hands-on-modal-actions">

                  <Link

                    to="/portals?tab=school"

                    className="btn btn-primary hands-on-book-btn"

                    onClick={() => setShowHandsOnModal(false)}

                  >

                    <span>{isAr ? "احجز الورشة لمؤسستك أو فعاليتك" : "Book Workshop for Your Team or Event"}</span>

                    <ArrowRight size={15} />

                  </Link>

                  <button

                    type="button"

                    className="btn btn-outline hands-on-close-subbtn"

                    onClick={() => setShowHandsOnModal(false)}

                  >

                    {isAr ? "إغلاق" : "Close"}

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ===== 4. Program Details Modal ===== */}

      {/* يا مطور الباك: لو حابب البرنامج يكون ليه CTA مختلف (زي تسجيل أو تحميل ملف)

// ممكن تضيف field في الـ Program type وتعدل الـ button تحت هنا. */}

      {selectedProgram && (

        <div className="programs-modal-overlay" data-lenis-prevent onClick={closeModal}>

          <div

            ref={modalRef}

            className="programs-modal-card"

            role="dialog"

            aria-modal="true"

            aria-labelledby="program-modal-title"

            onClick={(e) => e.stopPropagation()}

          >

            {/* Modal Accent Header */}

            <div className="programs-modal-header">

              <div className="programs-modal-header-content">

                <div className="programs-modal-icon">

                  {(() => {

                    const Icon = getProgramIcon(selectedProgram.icon);

                    return <Icon size={24} />;

                  })()}

                </div>

                <div>

                  <span className="programs-modal-label">

                    {isAr ? "تفاصيل البرنامج" : "Program Details"}

                  </span>

                  <h3 id="program-modal-title" className="programs-modal-title">

                    {isAr ? selectedProgram.titleAr : selectedProgram.titleEn}

                  </h3>

                </div>

              </div>

              <button

                className="programs-modal-close-btn"

                onClick={closeModal}

                aria-label={isAr ? "إغلاق" : "Close"}

              >

                <X size={20} />

              </button>

            </div>

            {/* Modal Body */}

            <div className="programs-modal-body">

              <p className="programs-modal-summary">

                {isAr ? selectedProgram.descriptionAr : selectedProgram.descriptionEn}

              </p>

              <div className="programs-modal-divider" />

              {/* لو الـ CMS مرجّعش وصف تفصيلي مبنخترعش كلام تسويقي عن برنامج

                  إحنا مش عارفين تفاصيله — بنقول إن التفاصيل لسه مش متاحة. */}

              {longDescription ? (

                <p className="programs-modal-full-desc">{longDescription}</p>

              ) : (

                <p className="programs-modal-no-desc">

                  {isAr

                    ? "لم يُضف وصف تفصيلي لهذا البرنامج بعد. يسعدنا تواصلك معنا لتزويدك بكافة التفاصيل."

                    : "A detailed description for this program has not been published yet. Get in touch and we will send you the full details."}

                </p>

              )}

              <div className="programs-modal-footer-actions">

                {selectedProgram.id === "shift-internship" && (

                  <a

                    href="https://acrobat.adobe.com/id/urn:aaid:sc:EU:a9632f47-907d-42d3-bc03-01173f32367b"

                    target="_blank"

                    rel="noopener noreferrer"

                    className="btn btn-outline programs-modal-report-btn"

                  >

                    <ExternalLink size={16} />

                    <span>{isAr ? "فتح تقرير SHIFT (PDF)" : "Open SHIFT Report (PDF)"}</span>

                  </a>

                )}

                <Link

                  to="/contact"

                  className="btn btn-primary programs-modal-cta"

                  onClick={closeModal}

                >

                  <MessageSquare size={18} />

                  <span>{isAr ? "تواصل معنا" : "Contact Us"}</span>

                </Link>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

