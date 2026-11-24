import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { apiService, ApiError } from "../../services/api";
import { certificateId as generateCertificateId } from "../../lib/utils/ids";
import type { Course, Certificate } from "../../types";
import { Clock, BookOpen, GraduationCap, Award, Lightbulb, CheckCircle, Lock, Printer, X, Sparkles, Play, Video, FolderOpen, ExternalLink } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { RouteLoader } from "../../components/common/RouteLoader";
import { EmptyState } from "../../components/ui/EmptyState";
import { SEO } from "../../components/common/SEO";
import { setScrollLocked } from "../../components/layout/scrollController";
import "./LearningHub.css";

/** الشركاء الأكاديميون والمؤسسيون لمحتوى التعلم */
const getCoursePartner = (courseId: string, title: string) => {
  const t = (courseId + " " + title).toLowerCase();
  if (t.includes("zayed") || t.includes("زايد")) {
    return { nameAr: "جامعة زايد", nameEn: "Zayed University", logo: "/partners/zayed-university.webp" };
  }
  if (t.includes("khalifa") || t.includes("خليفة")) {
    return { nameAr: "جامعة خليفة", nameEn: "Khalifa University", logo: "/partners/khalifa-university.webp" };
  }
  if (t.includes("heliopolis") || t.includes("هليوبوليس")) {
    return { nameAr: "جامعة هليوبوليس", nameEn: "Heliopolis University", logo: "/partners/heliopolis-university.webp" };
  }
  if (t.includes("enoc")) {
    return { nameAr: "ENOC", nameEn: "ENOC", logo: "/partners/enoc.webp" };
  }
  return null;
};

/**
 * عناوين الدروس المكتوبة يدوياً. عدد الدروس الحقيقي بيجي من
 * `course.lessonsCount`، فأي درس بعد العناوين دي بياخد عنوان وحدة عام.
 * TODO(backend): محتاجين GET /api/courses/<id>/lessons يرجّع الدروس الحقيقية.
 */
const LESSON_TITLES: { ar: string; en: string }[] = [
  { ar: "الوعي بالمناخ وأهمية الحلول الرقمية", en: "Introduction to Climate Digitization & Web Tools" },
  { ar: "حساب البصمة الكربونية للمؤسسات والشركات", en: "Carbon Footprint Calculations" },
  { ar: "الاستراتيجية الوطنية للاستدامة والتطبيق العملي", en: "UAE & Regional Green Action Strategy" }
];

function lessonTitleFor(lessonIndex: number, isAr: boolean): string {
  const known = LESSON_TITLES[lessonIndex - 1];
  if (known) return isAr ? known.ar : known.en;
  return isAr ? `الوحدة التدريبية رقم ${lessonIndex}` : `Training Module ${lessonIndex}`;
}

/** عدد الدروس الفعلي للمساق — من الـ API، مع سقف وحد أدنى عشان الرندر ما يتفجّرش. */
function lessonTotalOf(course: Course): number {
  const raw = typeof course.lessonsCount === "number" && Number.isFinite(course.lessonsCount)
    ? Math.round(course.lessonsCount)
    : 0;
  return Math.min(100, Math.max(1, raw));
}

/** صيغة العدد العربية الصحيحة — "1 دروس" غير سليمة لغويًا. */
function lessonsCountLabel(count: number, isAr: boolean): string {
  if (!isAr) return `${count} ${count === 1 ? "Lesson" : "Lessons"}`;
  if (count === 1) return "درس واحد";
  if (count === 2) return "درسان";
  if (count <= 10) return `${count} دروس`;
  return `${count} درساً`;
}

const localizeError = (err: unknown, language: string): string => {
  if (err instanceof ApiError) return err.localizedMessage(language);
  return language === "ar" ? "حدث خطأ غير متوقع أثناء تحميل المساقات." : "An unexpected error occurred while loading the courses.";
};

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const LearningHub: React.FC = () => {
  const { language, t } = useLanguage();
  const location = useLocation();
  const isAr = language === "ar";

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(() => {
    const q = new URLSearchParams(location.search).get("course");
    return q || null;
  });
  const [dbLessons, setDbLessons] = useState<{ title_ar?: string; title_en?: string }[]>([]);
  const [certFetchSeq, setCertFetchSeq] = useState(0);

  // تتبع فتح الدروس ونسبة إكمال المساق
  const [completedLessonIds, setCompletedLessonIds] = useState<Record<string, number[]>>({});
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const { registeredCourses, updateCourseProgress, profile, isMemberAuthenticated } = useAuthStore();

  const activeCourse = courses.find((c) => c.id === activeCourseId);
  const activeUserCourse = registeredCourses.find((c) => c.id === activeCourseId);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.getCourses();
        if (controller.signal.aborted) return;
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        if (controller.signal.aborted) return;
        setCourses([]);
        setError(err);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [reloadKey]);

  // Sync ?course=<id> query param and load optional DB lessons when activeCourseId changes
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("course");
    if (q) setActiveCourseId(q);
  }, [location.search]);

  useEffect(() => {
    setCertificate(null);
    setDbLessons([]);
    if (!activeCourseId) return;
    let cancelled = false;
    void apiService
      .getCourseLessons(activeCourseId)
      .then((rows) => {
        if (!cancelled && Array.isArray(rows)) {
          setDbLessons(rows as { title_ar?: string; title_en?: string }[]);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [activeCourseId]);

  // Fetch or issue certificate when course reaches 100%
  useEffect(() => {
    if (!activeCourse || !activeUserCourse || activeUserCourse.progress < 100) return;
    let cancelled = false;
    const fetchCert = async () => {
      setCertificateLoading(true);
      const fallbackPreview = (): Certificate => ({
        id: `preview-${activeCourse.id}`,
        certificateId: generateCertificateId(activeCourse.id),
        courseId: activeCourse.id,
        userId: "guest",
        issuedAt: new Date().toISOString(),
      });

      if (!isMemberAuthenticated) {
        if (!cancelled) {
          setCertificate(fallbackPreview());
          setCertificateLoading(false);
        }
        return;
      }

      try {
        const existing = await apiService.getCertificate(activeCourse.id);
        if (!cancelled) setCertificate(existing);
      } catch (err) {
        const isNotFound = err instanceof ApiError && err.status === 404;
        if (isNotFound) {
          try {
            const issued = await apiService.issueCertificate(activeCourse.id);
            if (!cancelled) setCertificate(issued);
          } catch {
            if (!cancelled) setCertificate(fallbackPreview());
          }
        } else if (!cancelled) {
          setCertificate(fallbackPreview());
        }
      } finally {
        if (!cancelled) setCertificateLoading(false);
      }
    };
    void fetchCert();
    return () => { cancelled = true; };
  }, [activeCourse, activeUserCourse, activeUserCourse?.progress, isMemberAuthenticated, certFetchSeq]);

  const closeCertificate = useCallback(() => {
    setShowCertificate(false);
  }, []);

  useEffect(() => {
    if (!showVideoModal) return;
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowVideoModal(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [showVideoModal]);
  // ── سلوك الحوار: Escape، حصر الفوكس، إرجاع الفوكس، قفل تمرير الصفحة ──
  useEffect(() => {
    if (!showCertificate) return;

    lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusables = (): HTMLElement[] => {
      const dialog = dialogRef.current;
      if (!dialog) return [];
      return Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
    };

    // الفوكس يبدأ جوه الحوار، مش فاضل على الزر اللي فتحه
    const initial = focusables()[0] ?? dialogRef.current;
    initial?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCertificate();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const active = document.activeElement;
      const inside = dialogRef.current?.contains(active) ?? false;

      if (event.shiftKey && (active === first || !inside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !inside)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setScrollLocked(true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      setScrollLocked(false);
      lastFocusedRef.current?.focus();
    };
  }, [showCertificate, closeCertificate]);

  /**
   * الدروس المكتملة للمساق. `completedLessonIds` حالة محلية بتضيع مع الـ reload،
   * فلو مفيش سجل محلي بنستنتج العدد من نسبة التقدّم المحفوظة في الـ store —
   * كده الطالب ما يلاقيش نفسه راجع للدرس الأول بعد ما كان في النص.
   */
  const getCompleted = useCallback(
    (course: Course): number[] => {
      const local = completedLessonIds[course.id];
      if (local) return local;

      const total = lessonTotalOf(course);
      if (total <= 0) return [];
      // بنستنتج العدد من نسبة التقدّم المحفوظة في الـ store — كده الطالب
      // ما يلاقيش نفسه راجع للدرس الأول بعد ما كان في النص.
      // المساق غير المسجّل (أو المسجّل بنسبة 0%) يبدأ بصفر دروس مكتملة.
      const stored = registeredCourses.find((c) => c.id === course.id)?.progress;
      const done = typeof stored === "number" && Number.isFinite(stored)
        ? Math.min(total, Math.max(0, Math.round((stored / 100) * total)))
        : 0;
      return Array.from({ length: done }, (_, index) => index + 1);
    },
    [completedLessonIds, registeredCourses]
  );

  // إكمال درس وزيادة النسبة في الـ Auth Store (مع انتظار حفظ التقدّم قبل إصدار الشهادة)
  const handleCompleteLesson = async (course: Course, lessonIndex: number) => {
    const total = lessonTotalOf(course);
    const currentCompleted = getCompleted(course);
    if (currentCompleted.includes(lessonIndex)) return;

    const updated = [...currentCompleted, lessonIndex];
    setCompletedLessonIds({ ...completedLessonIds, [course.id]: updated });

    const done = Math.min(updated.length, total);
    const newProgress = done >= total ? 100 : Math.min(99, Math.round((done / total) * 100));
    await updateCourseProgress(course.id, course.titleAr, course.titleEn, newProgress);

    if (done >= total) {
      setCertFetchSeq((n) => n + 1);
      setShowCertificate(true);
    }
  };

  const header = (
    <section className="hub-header text-center">
      <span className="eyebrow">{t("learningHub")}</span>
      <h1 className="section-title">
        {isAr ? "أكاديمية كلايمتيفاي للتعليم البيئي" : "Climatify Academy for Climate Action"}
      </h1>
      <p className="section-lead mx-auto">
        {isAr
          ? "تعلم مجاناً واحصل على شهادات معتمدة في الرقمنة البيئية والمناخية لخدمة مجتمعك."
          : "Learn for free and obtain certified credentials in climate digitization to serve your local community."}
      </p>
    </section>
  );

  const activeLessonTotal = activeCourse ? lessonTotalOf(activeCourse) : 0;
  const activeCompleted = activeCourse ? getCompleted(activeCourse) : [];
  const activeDoneCount = Math.min(activeCompleted.length, activeLessonTotal);
  const certificateEarned =
    activeUserCourse?.progress === 100 || (activeLessonTotal > 0 && activeDoneCount >= activeLessonTotal);

  const courseSchemas = useMemo(() => {
    return courses.map((c) => ({
      "@context": "https://schema.org",
      "@type": "Course",
      name: isAr ? c.titleAr : c.titleEn,
      description: isAr ? c.descriptionAr : c.descriptionEn,
      provider: {
        "@type": "EducationalOrganization",
        name: "Climatify Academy",
        url: "https://climatify-youth.com",
      },
      educationalCredentialAwarded: isAr ? "شهادة إتمام معتمدة في التعليم المناخي" : "Certified Certificate in Climate Action",
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "Online",
        courseWorkload: `${c.lessonsCount || 5} lessons`,
      },
    }));
  }, [courses, isAr]);

  return (
    <div className="learning-hub-page-container container">
      <SEO
        title={isAr ? "أكاديمية كلايمتفاي والمساقات المناخية المعتمدة" : "Climatify Academy & Certified Climate Courses"}
        description={
          isAr
            ? "تعلم مجاناً واحصل على شهادات معتمدة في الرقمنة البيئية، حساب البصمة الكربونية، واستراتيجيات الاستدامة بالشراكة مع الجامعات الرائدة."
            : "Learn for free and earn certified climate diplomas in environmental digitization, carbon accounting, and sustainability in partnership with top universities."
        }
        breadcrumbs={[
          { name: isAr ? "الرئيسية" : "Home", path: "/" },
          { name: isAr ? "مركز التعلم" : "Learning Hub", path: "/learning-hub" },
        ]}
        schema={courseSchemas}
      />
      {/* 1. Header */}
      {header}

      {/* 2. Session Record Featured Section */}
      <section className="session-record-banner card">
        <div className="session-record-left">
          <div className="session-record-badge">
            <Video size={15} />
            <span>{isAr ? "شيفت سيشن • لايف سيشن مسجلة" : "SHIFT Session • Recorded Live Session"}</span>
            <span className="live-dot" aria-hidden="true" />
          </div>
          <h2>
            {isAr
              ? "التدريب التفاعلي: رقمنة المناخ وأسس العمل المناخي الشبابي"
              : "Interactive Training: Climate Digitization & Youth Action Foundations"}
          </h2>
          <p>
            {isAr
              ? "شاهد التسجيل الكامل للايف سيشن التفاعلية من جلسة شيفت (SHIFT Session) مع نخبة من الخبراء وممثلي شركائنا الأكاديميين (جامعة زايد، جامعة خليفة، جامعة هليوبوليس، و ENOC). تشمل الجلسة شروحات عملية ودراسات حالة إقليمية."
              : "Watch the full recording of our SHIFT live interactive training session with expert mentors  "}
          </p>
          <div className="session-record-meta-row">
            <span className="session-meta-pill">Full HD 1080p</span>
            <span className="session-meta-pill">{isAr ? "المدة: 45 دقيقة" : "Duration: 45 mins"}</span>
            <span className="session-meta-pill">{isAr ? "لايف سيشن مسجلة" : "Recorded Live Session"}</span>
            <span className="session-meta-pill">{isAr ? "محتوى معتمد" : "Accredited"}</span>
          </div>
          <div className="session-record-actions-row">
            <button
              type="button"
              className="btn btn-primary session-watch-btn"
              onClick={() => setShowVideoModal(true)}
            >
              <Play size={18} fill="currentColor" />
              <span>{isAr ? "مشاهدة تسجيل اللايف سيشن" : "Watch Live Session Recording"}</span>
            </button>
            <a
              href="https://drive.google.com/drive/folders/1VGcq9Ggkfjg4Pq7-4YRqXUkCE7WcNi22"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline session-drive-btn"
            >
              <FolderOpen size={17} />
              <span>{isAr ? "تابع باقي الفيديوهات" : "Browse All Videos"}</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
        <div className="session-record-right" onClick={() => setShowVideoModal(true)}>
          <div className="session-video-preview-wrapper">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
              alt={isAr ? "تسجيل لايف سيشن شيفت" : "SHIFT Recorded Live Session"}
              className="session-preview-thumb"
            />
            <div className="session-play-pulse-btn" aria-hidden="true">
              <Play size={28} fill="currentColor" />
            </div>
            <span className="session-preview-time">45:20</span>
          </div>
        </div>
      </section>

      {/* 3. Main Layout — تحميل ← خطأ ← فاضي ← المحتوى */}
      <section className="hub-content-section section">
        {loading && <RouteLoader label={isAr ? "جارٍ تحميل المساقات…" : "Loading courses…"} />}

        {!loading && error !== null && (
          <EmptyState
            type="error"
            titleEn="We couldn't load the courses"
            titleAr="تعذّر تحميل المساقات"
            descriptionEn={localizeError(error, "en")}
            descriptionAr={localizeError(error, "ar")}
            actionEn="Try again"
            actionAr="إعادة المحاولة"
            onAction={() => setReloadKey((key) => key + 1)}
          />
        )}

        {!loading && error === null && courses.length === 0 && (
          <EmptyState
            type="empty"
            titleEn="No courses published yet"
            titleAr="لا توجد مساقات متاحة بعد"
            descriptionEn="The academy catalogue is being prepared. Check back soon."
            descriptionAr="كتالوج الأكاديمية تحت التحضير. تابعنا قريباً."
            actionEn="Refresh"
            actionAr="تحديث"
            onAction={() => setReloadKey((key) => key + 1)}
          />
        )}

        {!loading && error === null && courses.length > 0 && (
          activeCourse ? (
            <div className="active-course-study-panel card">
              <button type="button" className="btn btn-ghost back-to-list-btn" onClick={() => setActiveCourseId(null)}>
                {isAr ? "← العودة لقائمة المساقات" : "← Back to Courses"}
              </button>

              <div className="active-course-header-grid">
                <div className="active-course-thumbnail-wrapper">
                  <img src={activeCourse.image} alt="" className="active-course-img" />
                </div>
                <div className="active-course-main-details">
                  <span className="course-category-tag">{isAr ? activeCourse.categoryAr : activeCourse.categoryEn}</span>
                  <h2>{isAr ? activeCourse.titleAr : activeCourse.titleEn}</h2>
                  <p className="instructor-row">
                    <GraduationCap size={16} aria-hidden="true" />
                    <span>{isAr ? `المحاضر: ${activeCourse.instructorAr}` : `Instructor: ${activeCourse.instructorEn}`}</span>
                  </p>

                  <div className="course-stats-badges-row">
                    <span>
                      <Clock size={14} aria-hidden="true" />
                      {isAr ? activeCourse.durationAr : activeCourse.durationEn}
                    </span>
                    <span>
                      <BookOpen size={14} aria-hidden="true" />
                      {lessonsCountLabel(activeLessonTotal, isAr)}
                    </span>
                    {activeUserCourse && (
                      <span className="progress-badge">
                        {isAr ? `نسبة الإنجاز: ${activeUserCourse.progress}%` : `Progress: ${activeUserCourse.progress}%`}
                      </span>
                    )}
                  </div>

                  <p className="full-description">
                    {isAr ? activeCourse.descriptionAr : activeCourse.descriptionEn}
                  </p>

                  {/* دروس المساق المتاحة وتتبع الإنجاز */}
                  <div className="lessons-simulator-list-box">
                    <h4 className="lessons-box-title">
                      <Lightbulb size={18} aria-hidden="true" />
                      {isAr ? "منهج المساق والدروس التفاعلية:" : "Course Syllabus Lessons:"}
                    </h4>

                    <p className="lessons-progress-summary">
                      {isAr
                        ? `أكملت ${activeDoneCount} من ${activeLessonTotal} درساً`
                        : `${activeDoneCount} of ${activeLessonTotal} lessons completed`}
                    </p>

                    {Array.from({ length: activeLessonTotal }, (_, index) => index + 1).map((lessonIndex) => {
                      const isDone = activeCompleted.includes(lessonIndex);
                      const isUnlocked = lessonIndex === 1 || activeCompleted.includes(lessonIndex - 1);
                      const isLast = lessonIndex === activeLessonTotal;

                      return (
                        <div
                          key={lessonIndex}
                          className={`lesson-item-simulated${!isDone && !isUnlocked ? " lock-state" : ""}`}
                        >
                          <span>
                            {lessonIndex}.{" "}
                            {(() => {
                              const dbRow = dbLessons[lessonIndex - 1];
                              const dbTitle = isAr ? dbRow?.title_ar : dbRow?.title_en;
                              return dbTitle || lessonTitleFor(lessonIndex, isAr);
                            })()}
                          </span>

                          {isDone ? (
                            <span className="lesson-status-completed">
                              <CheckCircle size={14} aria-hidden="true" /> {isAr ? "مكتمل" : "Completed"}
                            </span>
                          ) : isUnlocked ? (
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => handleCompleteLesson(activeCourse, lessonIndex)}
                            >
                              {isLast
                                ? (isAr ? "إكمال الدرس والحصول على الشهادة" : "Complete & Get Certificate")
                                : (isAr ? `إكمال الدرس ${lessonIndex}` : `Complete Lesson ${lessonIndex}`)}
                            </button>
                          ) : (
                            <span className="lock-label">
                              <Lock size={14} aria-hidden="true" />{" "}
                              {isAr ? `مغلق (أكمل الدرس ${lessonIndex - 1} أولاً)` : `Locked (finish lesson ${lessonIndex - 1})`}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* زر استعراض الشهادة إذا كان الكورس مكتمل */}
                  {certificateEarned && (
                    <button
                      type="button"
                      className="btn btn-primary view-certificate-btn"
                      onClick={() => setShowCertificate(true)}
                    >
                      <Award size={18} aria-hidden="true" />
                      <span>{isAr ? "عرض وتحميل الشهادة الرقمية المعتمدة" : "View & Download Certificate"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="courses-grid-list-layout">
              {courses.map((course) => {
                const userCourse = registeredCourses.find((c) => c.id === course.id);
                const total = lessonTotalOf(course);
                const partner = getCoursePartner(course.id, isAr ? course.titleAr : course.titleEn);
                return (
                  <div key={course.id} className="course-card-item card">
                    <div className="course-card-img-banner">
                      <img
                        src={course.image}
                        alt=""
                        className="course-cover-banner"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80";
                        }}
                      />
                      <span className="course-badge-category">
                        {isAr ? course.categoryAr : course.categoryEn}
                      </span>
                      {partner && (
                        <div className="course-partner-affiliation-pill">
                          <img src={partner.logo} alt="" className="course-partner-mini-logo" />
                          <span>{isAr ? partner.nameAr : partner.nameEn}</span>
                        </div>
                      )}
                    </div>

                    <div className="course-card-body-details">
                      <h3>{isAr ? course.titleAr : course.titleEn}</h3>
                      <p className="excerpt">
                        {isAr ? course.descriptionAr.slice(0, 100) + "..." : course.descriptionEn.slice(0, 100) + "..."}
                      </p>

                      <div className="course-meta-data-badges">
                        <span>
                          <Clock size={14} aria-hidden="true" />
                          {isAr ? course.durationAr : course.durationEn}
                        </span>
                        <span>
                          <BookOpen size={14} aria-hidden="true" />
                          {lessonsCountLabel(total, isAr)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveCourseId(course.id);
                          if (!userCourse) {
                            updateCourseProgress(course.id, course.titleAr, course.titleEn, 0);
                          }
                        }}
                        className="btn btn-primary start-course-btn"
                      >
                        <Award size={16} aria-hidden="true" />
                        <span>
                          {userCourse
                            ? (isAr ? `متابعة الدراسة (${userCourse.progress}%)` : `Continue (${userCourse.progress}%)`)
                            : (isAr ? "ابدأ هذا الكورس" : "Start Course")}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </section>

      {/* 4. Session Record Video Modal */}
      {showVideoModal && (
        <div className="modal-overlay video-player-overlay" data-lenis-prevent onClick={() => setShowVideoModal(false)}>
          <div
            className="modal-content video-player-modal card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Session Record Video"
          >
            <div className="video-player-header">
              <div className="video-player-title-box">
                <Video size={20} className="video-icon-accent" />
                <div>
                  <span className="video-player-badge">
                    {isAr ? "لايف سيشن مسجلة" : "Recorded Live Session"}
                  </span>
                  <h3>
                    {isAr
                      ? "جلسة شيفت (SHIFT Session) — لايف سيشن مسجلة"
                      : "SHIFT Session — Recorded Live Session"}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm close-video-btn"
                onClick={() => setShowVideoModal(false)}
                aria-label={isAr ? "إغلاق الفيديو" : "Close video"}
              >
                <X size={20} />
              </button>
            </div>
            <div className="video-screen-container">
              <iframe
                src="https://drive.google.com/file/d/11h2z-Yie9VdXKl9Aj76CXf22AH01yt-H/preview"
                title={isAr ? "تسجيل لايف سيشن شيفت" : "SHIFT Recorded Live Session"}
                className="session-video-iframe"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            </div>
            <div className="video-player-footer">
              <p>
                {isAr
                  ? "تسجيل اللايف سيشن التفاعلية لبرنامج شيفت (SHIFT Session) — بالتعاون الأكاديمي مع جامعة زايد، جامعة خليفة، جامعة هليوبوليس، و ENOC."
                  : "Recorded SHIFT live interactive training session by Climatify — in partnership with Zayed University, Khalifa University, Heliopolis University, and ENOC."}
              </p>
              <div className="video-player-footer-actions">
                <a
                  href="https://drive.google.com/drive/folders/1VGcq9Ggkfjg4Pq7-4YRqXUkCE7WcNi22"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm drive-folder-link"
                >
                  <FolderOpen size={15} />
                  <span>{isAr ? "تابع باقي الفيديوهات (Drive)" : "All Videos Folder"}</span>
                  <ExternalLink size={13} />
                </a>
                <a
                  href="https://drive.google.com/file/d/11h2z-Yie9VdXKl9Aj76CXf22AH01yt-H/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm drive-direct-link"
                >
                  <ExternalLink size={14} />
                  <span>{isAr ? "فتح في Google Drive" : "Open in Drive"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Certificate Modal */}
      {showCertificate && certificate && (
        <div className="modal-overlay" data-lenis-prevent onClick={closeCertificate}>
          <div
            className="modal-content certificate-modal card"
            onClick={(e) => e.stopPropagation()}
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-dialog-title"
            tabIndex={-1}
          >
            <div className="modal-header">
              <h3 id="certificate-dialog-title" className="modal-title">
                <Sparkles size={20} aria-hidden="true" />
                {isAr ? "الشهادة الرقمية المعتمدة" : "Official Digital Certificate"}
              </h3>
              <button
                type="button"
                className="btn-close"
                onClick={closeCertificate}
                aria-label={isAr ? "إغلاق الشهادة" : "Close certificate"}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="certificate-paper-body text-center">
              <Award size={48} className="certificate-seal" aria-hidden="true" />
              <h2 className="certificate-heading">
                {isAr ? "شهادة إتمام مساق بيئي" : "Certificate of Environmental Achievement"}
              </h2>
              <p className="certificate-preamble">
                {isAr ? "تشهد منصة كلايمتيفاي بأن:" : "Climatify Digital Platform certifies that:"}
              </p>
              <h3 className="certificate-recipient">
                {profile?.name || (isAr ? "المستفيد البيئي المميز" : "Valued Environmental Scholar")}
              </h3>
              <p className="certificate-statement">
                {isAr
                  ? `قد أكمل بنجاح المساق التدريبي المعنون: "${activeCourse?.titleAr}"`
                  : `Has successfully completed the climate academy course: "${activeCourse?.titleEn}"`}
              </p>
              <div className="certificate-meta-row">
                <div>
                  <strong>{isAr ? "تاريخ الإصدار:" : "Issue Date:"}</strong>
                  <p>{new Date(certificate.issuedAt).toLocaleDateString(isAr ? "ar-AE" : "en-GB")}</p>
                </div>
                <div>
                  <strong>{isAr ? "معرّف الشهادة الرقمية:" : "Credential ID:"}</strong>
                  <p>{certificate.certificateId}</p>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
                <Printer size={16} aria-hidden="true" />
                <span>{isAr ? "طباعة الشهادة" : "Print Certificate"}</span>
              </button>
              <button type="button" className="btn btn-primary" onClick={closeCertificate}>
                <CheckCircle size={16} aria-hidden="true" />
                <span>{isAr ? "إغلاق" : "Close"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Certificate Loading */}
      {showCertificate && certificateLoading && (
        <div className="modal-overlay">
          <div className="modal-content certificate-modal card" role="dialog" aria-modal="true">
            <div className="certificate-paper-body text-center">
              <div className="loading-spinner" aria-label={isAr ? "جاري تحميل الشهادة..." : "Loading certificate..."} />
              <p>{isAr ? "جاري تحميل الشهادة..." : "Loading certificate..."}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
