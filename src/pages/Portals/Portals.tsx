import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import {
  Award, Building2, School, GraduationCap, Download, CheckCircle2, Send,
  ShieldCheck, Heart, FileText, Users, Handshake, Globe2, Sparkles
} from "lucide-react";
import { apiService, ApiError, sanitizeUrl } from "../../services/api";
import type { PartnershipSubmitDto, WorkshopRequestDto } from "../../types";
import { SEO } from "../../components/common/SEO";
import "./Portals.css";

interface PartnerItem {
  nameAr: string;
  nameEn: string;
  logo: string;
  category: "Academic" | "Government" | "Corporate" | "International" | "Youth";
}

const PARTNERS_LIST: PartnerItem[] = [
  { nameAr: "وزارة التغير المناخي والبيئة", nameEn: "Ministry of Climate Change and Environment", logo: "/partners/uae-climate-ministry.webp", category: "Government" },
  { nameAr: "متحف المستقبل", nameEn: "Museum of the Future", logo: "/partners/museum-of-the-future.webp", category: "Corporate" },
  { nameAr: "شركة بترول الإمارات الوطنية (ENOC)", nameEn: "ENOC", logo: "/partners/enoc.webp", category: "Corporate" },
  { nameAr: "جامعة زايد", nameEn: "Zayed University", logo: "/partners/zayed-university.webp", category: "Academic" },
  { nameAr: "جامعة خليفة", nameEn: "Khalifa University", logo: "/partners/khalifa-university.webp", category: "Academic" },
  { nameAr: "الجامعة الأميركية في الشارقة", nameEn: "American University of Sharjah", logo: "/partners/american-university-of-sharjah.webp", category: "Academic" },
  { nameAr: "جامعة هليوبوليس للتنمية المستدامة", nameEn: "Heliopolis University", logo: "/partners/heliopolis-university.webp", category: "Academic" },
  { nameAr: "جامعة الإمارات العربية المتحدة (UAEU)", nameEn: "United Arab Emirates University", logo: "/partners/uaeu.webp", category: "Academic" },
  { nameAr: "مركز الشباب العربي", nameEn: "Arab Youth Center", logo: "/partners/arab-youth-center.webp", category: "Youth" },
  { nameAr: "مؤتمر المناخ COP29 باكو", nameEn: "COP29 Azerbaijan", logo: "/partners/cop29-baku.webp", category: "International" },
  { nameAr: "شنايدر إلكتريك", nameEn: "Schneider Electric", logo: "/partners/schneider-electric.webp", category: "Corporate" },
  { nameAr: "برنامج الجوار الأوروبي (EU Neighbours)", nameEn: "EU Neighbours South", logo: "/partners/eu-neighbours.webp", category: "International" },
  { nameAr: "منظمة الهجرة الدولية (IOM)", nameEn: "IOM UN Migration", logo: "/partners/iom-un-migration.webp", category: "International" },
  { nameAr: "YOUNGO — الذراع الشبابي لـ UNFCCC", nameEn: "YOUNGO", logo: "/partners/youngo.webp", category: "International" },
  { nameAr: "الاتحاد الدولي لحفظ الطبيعة (IUCN)", nameEn: "IUCN", logo: "/partners/iucn.webp", category: "International" },
  { nameAr: "المؤتمر الإقليمي للشباب RCOY MENA", nameEn: "RCOY MENA", logo: "/partners/rcoy-mena.webp", category: "Youth" },
  { nameAr: "أكاديمية إنكو (INCO Academy)", nameEn: "INCO Academy", logo: "/partners/inco-academy.webp", category: "Academic" },
  { nameAr: "المناخ بالعربي", nameEn: "Almanakh Bil Arabi", logo: "/partners/almanakh-bil-arabi.webp", category: "Youth" },
  { nameAr: "مؤتمر الطاقة والمرافق العالمي", nameEn: "World Utilities Congress", logo: "/partners/world-utilities-congress.webp", category: "Corporate" },
  { nameAr: "منظمة أوكسفام (Oxfam)", nameEn: "Oxfam", logo: "/partners/oxfam.webp", category: "International" },
  { nameAr: "ازرع من أجل الكوكب", nameEn: "Plant for the Planet", logo: "/partners/plant-for-the-planet.webp", category: "Youth" },
  { nameAr: "مجالس الشباب", nameEn: "Youth Councils", logo: "/partners/youth-councils.webp", category: "Youth" },
  { nameAr: "ICYF — منتدى شباب التعاون الإسلامي", nameEn: "ICYF", logo: "/partners/icyf.webp", category: "Youth" },
];

/**
 * ──────────────────────────────────────────────────────────────
 *  صفحة البوابات — Portals Page
 *  فيها بوابتين: شراكات الأعمال + المدارس والجامعات
 * ──────────────────────────────────────────────────────────────
 *
 *  نقاط الاتصال بالسيرفر (كلها متنفّذة بالفعل عن طريق apiService،
 *  والمسارات النهائية معرّفة في src/services/api.ts):
 *    • POST /api/partnerships       → PartnershipSubmitDto
 *    • POST /api/workshops          → WorkshopRequestDto
 *    • GET  /api/curricula/download → { url: string }
 *
 *  أي فشل بيرجع ApiError، والواجهة لازم تعرضه للمستخدم — مفيش
 *  شاشة نجاح من غير رد ناجح فعلي من السيرفر.
 * ──────────────────────────────────────────────────────────────
 */

type SubmitStatus = "idle" | "loading" | "success" | "error";

/** رسالة خطأ جاهزة للعرض مهما كان نوع الخطأ الراجع. */
const toErrorMessage = (err: unknown, language: string): string =>
  err instanceof ApiError
    ? err.localizedMessage(language)
    : language === "ar"
      ? "حدث خطأ غير متوقع."
      : "An unexpected error occurred.";

export const Portals: React.FC = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const isAr = language === "ar";
  const [activePortal, setActivePortal] = useState<"partner" | "education">(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    return tab === "school" || tab === "education" ? "education" : "partner";
  });

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    if (tab === "school" || tab === "education") setActivePortal("education");
    else if (tab === "partner") setActivePortal("partner");
  }, [location.search]);

  // ── فورم الشركاء ──
  const [partnerForm, setPartnerForm] = useState<PartnershipSubmitDto>({
    orgName: "",
    orgType: "corporate",
    contactPerson: "",
    email: "",
    proposal: ""
  });
  const [partnerStatus, setPartnerStatus] = useState<SubmitStatus>("idle");
  const [partnerError, setPartnerError] = useState<string | null>(null);

  // ── فورم المدارس والجامعات ──
  // studentCount نصّ في WorkshopRequestDto، وقيمة الـ input رقمية كنص — متطابقين
  const [eduForm, setEduForm] = useState<WorkshopRequestDto>({
    institutionName: "",
    city: "",
    studentCount: "",
    workshopType: "climate-basics",
    email: ""
  });
  const [eduStatus, setEduStatus] = useState<SubmitStatus>("idle");
  const [eduError, setEduError] = useState<string | null>(null);

  // ── حالة تحميل المناهج ──
  const [downloadStatus, setDownloadStatus] = useState<SubmitStatus>("idle");
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // كل المؤقتات في مكان واحد عشان تتلغي لو المستخدم ساب الصفحة
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const schedule = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(setTimeout(fn, ms));
  }, []);
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
      timers.length = 0;
    };
  }, []);

  /** POST /api/partnerships — شاشة النجاح بتظهر بس لما السيرفر يقبل فعلاً. */
  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (partnerStatus === "loading") return;
    setPartnerStatus("loading");
    setPartnerError(null);
    try {
      await apiService.submitPartnership(partnerForm);
      setPartnerStatus("success");
      schedule(() => {
        setPartnerStatus("idle");
        setPartnerForm({ orgName: "", orgType: "corporate", contactPerson: "", email: "", proposal: "" });
      }, 3000);
    } catch (err) {
      setPartnerStatus("error");
      setPartnerError(toErrorMessage(err, language));
    }
  };

  /** POST /api/workshops */
  const handleEduSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (eduStatus === "loading") return;
    setEduStatus("loading");
    setEduError(null);
    try {
      await apiService.submitWorkshopRequest(eduForm);
      setEduStatus("success");
      schedule(() => {
        setEduStatus("idle");
        setEduForm({ institutionName: "", city: "", studentCount: "", workshopType: "climate-basics", email: "" });
      }, 3000);
    } catch (err) {
      setEduStatus("error");
      setEduError(toErrorMessage(err, language));
    }
  };

  /**
   * GET /api/curricula/download — بيرجع { url } وإحنا بنفتحه للتحميل فعلياً.
   * الرابط بيعدي على sanitizeUrl عشان رد مضروب من السيرفر ما يقدرش يحقن javascript:
   *
   * للروابط على نفس الأصل بنعمل HEAD الأول: ملف مش موجود بيكون بيرجع 200 HTML
   * (fallback الـSPA) فبدل ما نعلن "تم التحميل" وينزل ملف مضروب، بنعرض خطأ واضح.
   * الروابط الخارجية منفحش فيها — CORS ممكن يمنع الـHEAD وده معناهش إن الملف بايبوظ.
   */
  const handleDownload = async () => {
    if (downloadStatus === "loading") return;
    setDownloadStatus("loading");
    setDownloadError(null);
    try {
      const result = await apiService.getCurriculaDownloadUrl();
      const rawUrl = result && typeof result.url === "string" ? result.url : "";
      const safeUrl = sanitizeUrl(rawUrl);
      if (!safeUrl || safeUrl === "#invalid-url") {
        throw new ApiError("Invalid download URL returned by the server", 500, "/curricula/download", result);
      }

      let resolvedUrlOrigin: string | null = null;
      try {
        resolvedUrlOrigin = new URL(safeUrl, window.location.href).origin;
      } catch {
        throw new ApiError(`Unparseable download URL: ${safeUrl}`, 500, "/curricula/download", result);
      }
      if (resolvedUrlOrigin === window.location.origin) {
        const head = await fetch(safeUrl, { method: "HEAD" });
        if (!head.ok) {
          throw new ApiError("Curriculum file is not available", head.status, "/curricula/download");
        }
        const contentType = head.headers.get("content-type") ?? "";
        // text/html هنا معناه غالباً إن الـSPA fallback رد بدل الملف المفقود
        if (/^text\/html/i.test(contentType)) {
          throw new ApiError("Curriculum file is missing on the server", 404, "/curricula/download");
        }
      }

      const link = document.createElement("a");
      link.href = safeUrl;
      link.download = "";
      link.rel = "noopener noreferrer";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      link.remove();

      setDownloadStatus("success");
      schedule(() => setDownloadStatus("idle"), 2500);
    } catch (err) {
      setDownloadStatus("error");
      setDownloadError(toErrorMessage(err, language));
    }
  };

  const [partnerCategory, setPartnerCategory] = useState<string>("all");

  const filteredPartners = useMemo(() => {
    if (partnerCategory === "all") return PARTNERS_LIST;
    return PARTNERS_LIST.filter((p) => p.category === partnerCategory);
  }, [partnerCategory]);

  const downloading = downloadStatus === "loading";

  return (
    <div className="portals-page">
      <SEO
        title={isAr ? "بوابات الشركاء والمدارس والمؤسسات" : "Partners, Schools & Institutional Portals"}
        description={
          isAr
            ? "تعرف على شبكة شركاء كلايمتفاي الاستراتيجيين من الوزارات والجامعات والشركات العالمية، وقدم طلبات الشراكة وورش المدارس."
            : "Connect with Climatify strategic partner network spanning ministries, universities, and corporations. Submit partnership proposals and school workshops."
        }
        breadcrumbs={[
          { name: isAr ? "الرئيسية" : "Home", path: "/" },
          { name: isAr ? "الشركاء والبوابات" : "Portals & Partners", path: "/portals" },
        ]}
      />
      {/* ── 1. Hero ── */}
      <section className="portals-hero">
        <div className="container">
          <span className="eyebrow">
            <Sparkles size={16} />
            {isAr ? "الشركاء والتحالفات" : "Partners & Alliances"}
          </span>
          <h1 className="section-title">
            {isAr ? (
              <>الشركاء — <span className="text-gradient">Partners</span></>
            ) : (
              <>Strategic <span className="text-gradient">Partners</span> & Alliances</>
            )}
          </h1>
          <p className="section-lead mx-auto">
            {isAr
              ? "نعمل يداً بيد مع الوزارات، والجامعات الرائدة، والمؤسسات الدولية والشركات لبناء مستقبل مستدام وممكن للشباب."
              : "Collaborating with ministries, top universities, and global bodies to power climate digitization and youth empowerment."}
          </p>
        </div>
      </section>

      {/* ── 2. شركاؤنا — Our Partners Grid ── */}
      <section className="partners-showcase-section section">
        <div className="container">
          <div className="partners-section-header text-center">
            <span className="eyebrow">
              <Globe2 size={16} />
              {isAr ? "شركاء النجاح" : " "}
            </span>
            <h2 className="section-title">
              {isAr ? "شركاؤنا في العمل المناخي والتحول المستدام" : "Trusted By"}
            </h2>
            <p className="section-lead mx-auto">
              {isAr
                ? "نعتز بالتعاون المشترك مع أكثر من 20 جهة ومؤسسة حكومية، أكاديمية، ودولية رائدة تقود العمل المناخي."
                : "Proud to collaborate with over 20 leading governmental, academic, corporate, and UN organizations driving climate action."}
            </p>

            {/* Filter Pills */}
            <div className="partner-category-filter-row">
              {[
                { id: "all", ar: "جميع الشركاء", en: "All Partners" },
                { id: "Academic", ar: "الجامعات والمؤسسات التعليمية", en: "Universities & Academia" },
                { id: "Government", ar: "الجهات الحكومية", en: "Government" },
                { id: "Corporate", ar: "الشركات والقطاع الخاص", en: "Corporate" },
                { id: "International", ar: "المنظمات الدولية والأمم المتحدة", en: "International & UN" },
                { id: "Youth", ar: "منظمات الشباب والبيئة", en: "Youth & Climate" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setPartnerCategory(cat.id)}
                  className={`partner-filter-btn ${partnerCategory === cat.id ? "active" : ""}`}
                >
                  {isAr ? cat.ar : cat.en}
                </button>
              ))}
            </div>
          </div>

          {/* Partners Logos Grid */}
          <div className="partners-brand-grid">
            {filteredPartners.map((partner, index) => (
              <div key={index} className="partner-brand-card card">
                <div className="partner-brand-logo-wrap">
                  <img
                    src={partner.logo}
                    alt={isAr ? partner.nameAr : partner.nameEn}
                    className="partner-brand-logo-img"
                    loading="lazy"
                  />
                </div>
                <div className="partner-brand-info">
                  <span className="partner-brand-cat-pill">{partner.category}</span>
                  <h3 className="partner-brand-name">
                    {isAr ? partner.nameAr : partner.nameEn}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. تقديم طلب شراكة — Partnership Request Section ── */}
      <section className="partnership-request-section section bg-gradient-brand-soft" id="partnership-form">
        <div className="container">
          <div className="partners-section-header text-center mb-6">
            <span className="eyebrow">
              <Handshake size={16} />
              {isAr ? "انضم إلى شبكة الشركاء" : "Join Our Partner Network"}
            </span>
            <h2 className="section-title">
              {isAr ? "تقديم طلب شراكة" : "Submit a Partnership Request"}
            </h2>
            <p className="section-lead mx-auto">
              {isAr
                ? "سواء كنت تمثل شركة تسعى لتحقيق أهداف الاستدامة، أو جهة حكومية أو جامعة، يسعدنا تصميم شراكة مخصصة تخدم أهدافكم."
                : "Whether you represent a corporation, university, or official body, we are eager to design an impactful partnership."}
            </p>

            <div className="portals-tabs mt-4">
              <button
                type="button"
                className={`portal-tab ${activePortal === "partner" ? "active" : ""}`}
                onClick={() => setActivePortal("partner")}
              >
                <Building2 size={16} />
                <span>{isAr ? "شراكات الأعمال والمؤسسات" : "Corporate & Institutions"}</span>
              </button>
              <button
                type="button"
                className={`portal-tab ${activePortal === "education" ? "active" : ""}`}
                onClick={() => setActivePortal("education")}
              >
                <School size={16} />
                <span>{isAr ? "المدارس والجامعات" : "Schools & Universities"}</span>
              </button>
            </div>
          </div>

          <div className="portal-grid" key={activePortal}>
            {/* العمود الأيسر: معلومات + فوائد + تحميل */}
            <div className="portal-info-side portal-fade-in">
              <span className="eyebrow">
                {activePortal === "partner"
                  ? (language === "ar" ? "بوابة الشركاء" : "Partnership Portal")
                  : (language === "ar" ? "التعليم المناخي" : "Climate Education")}
              </span>
              <h2 className="portal-info-title">
                {activePortal === "partner"
                  ? (language === "ar" ? "تحول رقمي أخضر" : "Green Digital Transition")
                  : (language === "ar" ? "توعية جيل الغد" : "Next Climate Leaders")}
              </h2>
              <p className="portal-info-desc">
                {activePortal === "partner"
                  ? (language === "ar"
                    ? "شراكات استراتيجية لتعزيز الوعي المناخي وبناء حلول رقمية مستدامة."
                    : "Strategic collaborations to accelerate climate awareness and scalable solutions.")
                  : (language === "ar"
                    ? "مناهج متكاملة وورش تفاعلية لبناء الوعي المناخي بين الطلاب."
                    : "Comprehensive curricula and interactive workshops for students.")}
              </p>

              {/* الفوائد */}
              <div className="portal-benefits">
                {activePortal === "partner" ? (
                  <>
                    <div className="benefit-item">
                      <ShieldCheck size={20} className="benefit-icon" />
                      <span>{language === "ar" ? "تقارير بصمة كربونية وأثر بيئي." : "Carbon footprint & impact reports."}</span>
                    </div>
                    <div className="benefit-item">
                      <Heart size={20} className="benefit-icon" />
                      <span>{language === "ar" ? "إشراك الموظفين في حملات مستدامة." : "Employee engagement in sustainability."}</span>
                    </div>
                    <div className="benefit-item">
                      <Award size={20} className="benefit-icon" />
                      <span>{language === "ar" ? "شهادات استدامة معتمدة ESG." : "Accredited ESG credits."}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="benefit-item">
                      <FileText size={20} className="benefit-icon" />
                      <span>{language === "ar" ? "مناهج مجانية حول الاستدامة." : "Free sustainability curricula."}</span>
                    </div>
                    <div className="benefit-item">
                      <Users size={20} className="benefit-icon" />
                      <span>{language === "ar" ? "ورش تفاعلية بقيادة خبراء." : "Interactive expert-led workshops."}</span>
                    </div>
                    <div className="benefit-item">
                      <GraduationCap size={20} className="benefit-icon" />
                      <span>{language === "ar" ? "شهادات إتمام معتمدة للطلاب." : "Accredited student certificates."}</span>
                    </div>
                  </>
                )}
              </div>

              {/* تحميل المناهج — بس في بوابة التعليم */}
              {activePortal === "education" && (
                <div className="portal-download-box">
                  <div className="download-box-header">
                    <Download size={22} />
                    <h4>{language === "ar" ? "مناهج التوعية المناخية" : "Climate Curricula"}</h4>
                  </div>
                  <p>
                    {language === "ar"
                      ? "أنشطة صيفية ومواد مبسطة حول الاستدامة."
                      : "Summer activities and simplified sustainability materials."}
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary btn-full-width download-btn"
                    onClick={handleDownload}
                    disabled={downloading}
                  >
                    <Download size={16} />
                    <span>
                      {downloading
                        ? (isAr ? "جاري التحميل..." : "Downloading...")
                        : downloadStatus === "success"
                          ? (isAr ? "تم التحميل ✓" : "Downloaded ✓")
                          : (isAr ? "تحميل الحقيبة (PDF)" : "Download Kit (PDF)")}
                    </span>
                  </button>

                  {downloadStatus === "success" && (
                    <p className="portal-download-note" role="status" aria-live="polite">
                      {isAr
                        ? "لو ما بدأش التحميل تلقائياً، راجع إعدادات المتصفح الخاصة بالنوافذ المنبثقة."
                        : "If the download did not start, check your browser's pop-up settings."}
                    </p>
                  )}

                  {downloadStatus === "error" && downloadError && (
                    <p className="portal-alert portal-alert-on-gradient" role="alert">
                      {downloadError}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* العمود الأيمن: النموذج */}
            <div className="portal-form-side portal-fade-in">
              <div className="portal-form-wrapper card glass">
                {activePortal === "partner" ? (
                  partnerStatus === "success" ? (
                    <div className="form-success-state text-center" role="status" aria-live="polite">
                      <CheckCircle2 size={48} className="success-icon" />
                      <h3>{language === "ar" ? "تم استلام المقترح!" : "Proposal Submitted!"}</h3>
                      <p>{language === "ar" ? "هيتواصل معاك فريقنا قريباً." : "Our team will contact you soon."}</p>
                    </div>
                  ) : (
                    <form onSubmit={handlePartnerSubmit} className="portal-form">
                      <div className="portal-form-header">
                        <h3>{language === "ar" ? "طلب شراكة" : "Partnership Request"}</h3>
                      </div>

                      {partnerStatus === "error" && partnerError && (
                        <p className="portal-alert" role="alert">{partnerError}</p>
                      )}

                      <div className="form-group">
                        <label htmlFor="partner-orgName">{language === "ar" ? "اسم المؤسسة" : "Organization Name"}</label>
                        <input
                          id="partner-orgName"
                          name="orgName"
                          type="text"
                          required
                          autoComplete="organization"
                          className="form-control"
                          value={partnerForm.orgName}
                          onChange={(e) => setPartnerForm({ ...partnerForm, orgName: e.target.value })}
                          placeholder={language === "ar" ? "مؤسسة الإمارات للبيئة" : "EcoCorp Global"}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="partner-orgType">{language === "ar" ? "نوع المؤسسة" : "Organization Type"}</label>
                        <select
                          id="partner-orgType"
                          name="orgType"
                          className="form-control"
                          value={partnerForm.orgType}
                          onChange={(e) => setPartnerForm({ ...partnerForm, orgType: e.target.value })}
                        >
                          <option value="corporate">{language === "ar" ? "شركة خاصة" : "Corporate"}</option>
                          <option value="government">{language === "ar" ? "جهة حكومية" : "Government"}</option>
                          <option value="ngo">{language === "ar" ? "منظمة غير ربحية" : "NGO"}</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="partner-contactPerson">{language === "ar" ? "شخص التواصل" : "Contact Person"}</label>
                        <input
                          id="partner-contactPerson"
                          name="contactPerson"
                          type="text"
                          required
                          autoComplete="name"
                          className="form-control"
                          value={partnerForm.contactPerson}
                          onChange={(e) => setPartnerForm({ ...partnerForm, contactPerson: e.target.value })}
                          placeholder={language === "ar" ? "مريم العلي" : "Sarah Smith"}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="partner-email">{language === "ar" ? "البريد الإلكتروني" : "Email"}</label>
                        <input
                          id="partner-email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          className="form-control"
                          value={partnerForm.email}
                          onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                          placeholder="partnerships@domain.com"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="partner-proposal">{language === "ar" ? "تفاصيل الشراكة" : "Partnership Scope"}</label>
                        <textarea
                          id="partner-proposal"
                          name="proposal"
                          rows={3}
                          required
                          className="form-control"
                          value={partnerForm.proposal}
                          onChange={(e) => setPartnerForm({ ...partnerForm, proposal: e.target.value })}
                          placeholder={language === "ar" ? "كيف تحب تتعاون معانا؟" : "How would you like to collaborate?"}
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary btn-full-width"
                        disabled={partnerStatus === "loading"}
                      >
                        <Send size={16} />
                        <span>
                          {partnerStatus === "loading"
                            ? (isAr ? "جارٍ الإرسال…" : "Submitting…")
                            : (isAr ? "تقديم الطلب" : "Submit")}
                        </span>
                      </button>
                    </form>
                  )
                ) : (
                  eduStatus === "success" ? (
                    <div className="form-success-state text-center" role="status" aria-live="polite">
                      <CheckCircle2 size={48} className="success-icon" />
                      <h3>{language === "ar" ? "تم تسجيل الطلب!" : "Workshop Requested!"}</h3>
                      <p>{language === "ar" ? "منسق المدارس هيتواصل معاكم قريباً." : "Our coordinator will contact you soon."}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleEduSubmit} className="portal-form">
                      <div className="portal-form-header">
                        <h3>{language === "ar" ? "طلب ورشة عمل" : "Workshop Request"}</h3>
                      </div>

                      {eduStatus === "error" && eduError && (
                        <p className="portal-alert" role="alert">{eduError}</p>
                      )}

                      <div className="form-group">
                        <label htmlFor="edu-institutionName">{language === "ar" ? "اسم المؤسسة" : "Institution Name"}</label>
                        <input
                          id="edu-institutionName"
                          name="institutionName"
                          type="text"
                          required
                          autoComplete="organization"
                          className="form-control"
                          value={eduForm.institutionName}
                          onChange={(e) => setEduForm({ ...eduForm, institutionName: e.target.value })}
                          placeholder={language === "ar" ? "مدرسة دبي الوطنية" : "Dubai University"}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="edu-city">{language === "ar" ? "المدينة" : "City"}</label>
                        <input
                          id="edu-city"
                          name="city"
                          type="text"
                          required
                          autoComplete="address-level2"
                          className="form-control"
                          value={eduForm.city}
                          onChange={(e) => setEduForm({ ...eduForm, city: e.target.value })}
                          placeholder={language === "ar" ? "دبي" : "Dubai"}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="edu-studentCount">{language === "ar" ? "عدد الطلاب" : "Student Count"}</label>
                        <input
                          id="edu-studentCount"
                          name="studentCount"
                          type="number"
                          min={1}
                          step={1}
                          inputMode="numeric"
                          required
                          className="form-control"
                          value={eduForm.studentCount}
                          onChange={(e) => setEduForm({ ...eduForm, studentCount: e.target.value })}
                          placeholder="50"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="edu-workshopType">{language === "ar" ? "نوع الورشة" : "Workshop Type"}</label>
                        <select
                          id="edu-workshopType"
                          name="workshopType"
                          className="form-control"
                          value={eduForm.workshopType}
                          onChange={(e) => setEduForm({ ...eduForm, workshopType: e.target.value })}
                        >
                          <option value="climate-basics">{language === "ar" ? "مبادئ المناخ" : "Climate Basics"}</option>
                          <option value="carbon-calculator">{language === "ar" ? "بصمة الكربون" : "Carbon Footprint"}</option>
                          <option value="ghaf-planting">{language === "ar" ? "زراعة الغاف" : "Ghaf Planting"}</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="edu-email">{language === "ar" ? "بريد المنسق" : "Coordinator Email"}</label>
                        <input
                          id="edu-email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          className="form-control"
                          value={eduForm.email}
                          onChange={(e) => setEduForm({ ...eduForm, email: e.target.value })}
                          placeholder="coordinator@school.edu"
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary btn-full-width"
                        disabled={eduStatus === "loading"}
                      >
                        <GraduationCap size={16} />
                        <span>
                          {eduStatus === "loading"
                            ? (isAr ? "جارٍ الإرسال…" : "Submitting…")
                            : (isAr ? "طلب الورشة" : "Book Workshop")}
                        </span>
                      </button>
                    </form>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
