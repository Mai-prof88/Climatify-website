import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useCMSStore } from "../../store/useCMSStore";
import type { AdminFormSubmission } from "../../types";
import {
  Inbox,
  Briefcase,
  School,
  Building2,
  Calendar,
  Mail,
  Search,
  Trash2,
  Download,
  AlertTriangle,
  RefreshCw,
  Loader2,
  X,
  ExternalLink,
  Eye,
  FileText,
} from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";
import { buildCsv, downloadTextFile, toLocalDateInput } from "./adminUtils";
import { sanitizeUrl } from "../../services/api";

type KindFilter = "all" | "opportunity_application" | "school_portal" | "partner_portal" | "meeting" | "newsletter";

export const AdminSubmissions: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const submissions = useCMSStore((state) => state.formSubmissions);
  const loading = useCMSStore((state) => state.loading);
  const storeError = useCMSStore((state) => state.error);
  const loadAdminFormSubmissions = useCMSStore((state) => state.loadAdminFormSubmissions);
  const deleteFormSubmission = useCMSStore((state) => state.deleteFormSubmission);

  const [searchQuery, setSearchQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [selectedSubmission, setSelectedSubmission] = useState<AdminFormSubmission | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | number | null>(null);

  useEffect(() => {
    if (submissions.length === 0 && !loading && !storeError) {
      void loadAdminFormSubmissions();
    }
  }, [submissions.length, loading, storeError, loadAdminFormSubmissions]);

  // Derived counts
  const totalCount = submissions.length;
  const oppCount = useMemo(
    () => submissions.filter((s) => s.kind === "opportunity_application").length,
    [submissions]
  );
  const schoolCount = useMemo(
    () => submissions.filter((s) => s.kind === "school_portal").length,
    [submissions]
  );
  const partnerCount = useMemo(
    () => submissions.filter((s) => s.kind === "partner_portal").length,
    [submissions]
  );
  const meetingCount = useMemo(
    () => submissions.filter((s) => s.kind === "meeting").length,
    [submissions]
  );
  const newsletterCount = useMemo(
    () => submissions.filter((s) => s.kind === "newsletter").length,
    [submissions]
  );

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return submissions.filter((sub) => {
      const payloadStr = JSON.stringify(sub.payload).toLowerCase();
      const matchesSearch =
        !q ||
        sub.email.toLowerCase().includes(q) ||
        sub.kind.toLowerCase().includes(q) ||
        payloadStr.includes(q);

      const matchesKind = kindFilter === "all" || sub.kind === kindFilter;

      return matchesSearch && matchesKind;
    });
  }, [submissions, searchQuery, kindFilter]);

  // Export CSV
  const handleExportCSV = () => {
    if (submissions.length === 0) return;
    const headers = ["ID", "Category / Kind", "Email", "Submission Details (JSON)", "Created At"];
    const rows = submissions.map((s) => [
      String(s.id),
      s.kind,
      s.email,
      JSON.stringify(s.payload),
      s.createdAt,
    ]);
    downloadTextFile(
      `climatify_submissions_${toLocalDateInput()}.csv`,
      buildCsv(headers, rows),
      "text/csv;charset=utf-8"
    );
  };

  // Delete
  const handlePerformDelete = async (id: string | number) => {
    setPendingDeleteId(null);
    setActionError(null);
    setBusyId(id);
    try {
      const res = await deleteFormSubmission(id);
      if (!res.ok) {
        setActionError(res.error || (isAr ? "تعذّر حذف الطلب." : "Could not delete submission."));
      } else {
        if (selectedSubmission && String(selectedSubmission.id) === String(id)) {
          setSelectedSubmission(null);
        }
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Error deleting submission.");
    } finally {
      setBusyId(null);
    }
  };

  const getKindBadge = (kind: string) => {
    switch (kind) {
      case "opportunity_application":
        return {
          icon: <Briefcase size={13} />,
          label: isAr ? "تقديم وظيفة / تدريب" : "Opportunity Application",
          className: "admin-badge-sub opp",
        };
      case "school_portal":
        return {
          icon: <School size={13} />,
          label: isAr ? "بوابة المدارس والتعليم" : "School Portal",
          className: "admin-badge-sub school",
        };
      case "partner_portal":
        return {
          icon: <Building2 size={13} />,
          label: isAr ? "طلب شراكة استراتيجية" : "Partnership Proposal",
          className: "admin-badge-sub partner",
        };
      case "meeting":
        return {
          icon: <Calendar size={13} />,
          label: isAr ? "حجز موعد واجتماع" : "Meeting Booking",
          className: "admin-badge-sub meeting",
        };
      case "newsletter":
        return {
          icon: <Mail size={13} />,
          label: isAr ? "النشرة البريدية" : "Newsletter",
          className: "admin-badge-sub newsletter",
        };
      default:
        return {
          icon: <FileText size={13} />,
          label: kind,
          className: "admin-badge-sub general",
        };
    }
  };

  return (
    <div className="admin-submissions-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">
            <span>{isAr ? "مركز الطلبات والاستمارات الواردة" : "Inbound Submissions & Applications"}</span>
          </h2>
          <p className="admin-page-subtitle">
            {isAr
              ? "متابعة طلبات التوظيف والتدريب، شراكات المدارس، عروض الرعاية، وحجوزات المواعيد"
              : "Review all opportunity applications, school portal onboarding, partner proposals, and bookings"}
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-cms-refresh-btn"
            onClick={() => void loadAdminFormSubmissions()}
            disabled={loading}
            aria-label={isAr ? "تحديث القائمة" : "Refresh list"}
            title={isAr ? "تحديث القائمة" : "Refresh list"}
          >
            <RefreshCw size={15} className={loading ? "spin" : ""} />
            <span>{isAr ? "تحديث" : "Refresh"}</span>
          </button>

          <button
            type="button"
            className="admin-btn-export"
            onClick={handleExportCSV}
            disabled={submissions.length === 0}
            title={isAr ? "تصدير الطلبات CSV" : "Export submissions as CSV"}
          >
            <Download size={15} />
            <span>{isAr ? "تصدير CSV" : "Export CSV"}</span>
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {actionError && (
        <div className="admin-alert error" role="alert">
          <AlertTriangle size={16} />
          <span>{actionError}</span>
          <button type="button" className="admin-alert-close" onClick={() => setActionError(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Overview Stat Counters */}
      <div className="admin-users-stats-grid">
        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon green">
            <Inbox size={20} />
          </div>
          <div className="admin-users-stat-info">
            <span className="admin-users-stat-label">{isAr ? "إجمالي الطلبات" : "Total Submissions"}</span>
            <span className="admin-users-stat-value">{totalCount}</span>
          </div>
        </div>

        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon blue">
            <Briefcase size={20} />
          </div>
          <div className="admin-users-stat-info">
            <span className="admin-users-stat-label">{isAr ? "طلبات التقديم والتدريب" : "Applications"}</span>
            <span className="admin-users-stat-value">{oppCount}</span>
          </div>
        </div>

        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon purple">
            <School size={20} />
          </div>
          <div className="admin-users-stat-info">
            <span className="admin-users-stat-label">{isAr ? "بوابة المدارس" : "School Portals"}</span>
            <span className="admin-users-stat-value">{schoolCount}</span>
          </div>
        </div>

        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon amber">
            <Building2 size={20} />
          </div>
          <div className="admin-users-stat-info">
            <span className="admin-users-stat-label">{isAr ? "الشراكات والاجتماعات" : "Partners & Meetings"}</span>
            <span className="admin-users-stat-value">{partnerCount + meetingCount}</span>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="admin-cms-toolbar admin-users-toolbar">
        {/* Category Tabs */}
        <div className="admin-users-role-tabs" role="tablist">
          <button
            type="button"
            className={`admin-cms-tab-btn ${kindFilter === "all" ? "active" : ""}`}
            onClick={() => setKindFilter("all")}
          >
            <span>{isAr ? "الكل" : "All"}</span>
            <span className="admin-cms-tab-count">{totalCount}</span>
          </button>

          <button
            type="button"
            className={`admin-cms-tab-btn ${kindFilter === "opportunity_application" ? "active" : ""}`}
            onClick={() => setKindFilter("opportunity_application")}
          >
            <Briefcase size={14} />
            <span>{isAr ? "الفرص والتوظيف" : "Opportunities"}</span>
            <span className="admin-cms-tab-count">{oppCount}</span>
          </button>

          <button
            type="button"
            className={`admin-cms-tab-btn ${kindFilter === "school_portal" ? "active" : ""}`}
            onClick={() => setKindFilter("school_portal")}
          >
            <School size={14} />
            <span>{isAr ? "المدارس" : "Schools"}</span>
            <span className="admin-cms-tab-count">{schoolCount}</span>
          </button>

          <button
            type="button"
            className={`admin-cms-tab-btn ${kindFilter === "partner_portal" ? "active" : ""}`}
            onClick={() => setKindFilter("partner_portal")}
          >
            <Building2 size={14} />
            <span>{isAr ? "الشراكات" : "Partners"}</span>
            <span className="admin-cms-tab-count">{partnerCount}</span>
          </button>

          <button
            type="button"
            className={`admin-cms-tab-btn ${kindFilter === "meeting" ? "active" : ""}`}
            onClick={() => setKindFilter("meeting")}
          >
            <Calendar size={14} />
            <span>{isAr ? "المواعيد" : "Meetings"}</span>
            <span className="admin-cms-tab-count">{meetingCount}</span>
          </button>

          <button
            type="button"
            className={`admin-cms-tab-btn ${kindFilter === "newsletter" ? "active" : ""}`}
            onClick={() => setKindFilter("newsletter")}
          >
            <Mail size={14} />
            <span>{isAr ? "النشرة" : "Newsletter"}</span>
            <span className="admin-cms-tab-count">{newsletterCount}</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="admin-users-search-wrap">
          <div className="admin-cms-search">
            <Search size={15} />
            <input
              type="text"
              placeholder={isAr ? "بحث بالبريد، الكلمات المفتاحية، أو الجهة..." : "Search email or content..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={isAr ? "بحث في الطلبات" : "Search submissions"}
            />
            {searchQuery && (
              <button
                type="button"
                className="admin-cms-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label={isAr ? "مسح البحث" : "Clear search"}
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Submissions Table / Cards */}
      <div className="admin-users-table-container">
        {loading && submissions.length === 0 ? (
          <div className="admin-loading-state">
            <Loader2 size={30} className="spin" />
            <p>{isAr ? "جاري تحميل بيانات الطلبات والاستمارات..." : "Loading submissions..."}</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="admin-empty-state-card">
            <Inbox size={36} />
            <h3>{isAr ? "لا توجد طلبات مطابقة" : "No matching submissions found"}</h3>
            <p>
              {searchQuery || kindFilter !== "all"
                ? isAr
                  ? "جرّب تعديل معايير البحث أو اختيار تصنيف آخر."
                  : "Try clearing your search or choosing another category."
                : isAr
                  ? "لم تصل أي طلبات أو استمارات بعد."
                  : "No submissions have been received yet."}
            </p>
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>{isAr ? "نوع الطلب" : "Category"}</th>
                  <th>{isAr ? "المرسل / الجهة" : "Sender / Org"}</th>
                  <th>{isAr ? "ملخص المحتوى" : "Payload Summary"}</th>
                  <th>{isAr ? "تاريخ التقديم" : "Submitted"}</th>
                  <th className="text-end">{isAr ? "معاينة / إجراءات" : "View & Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub) => {
                  const badge = getKindBadge(sub.kind);
                  const isBusy = busyId === sub.id;
                  const payload = sub.payload || {};

                  // Extract main submitter name / summary
                  const titleName =
                    (payload.name as string) ||
                    (payload.representativeName as string) ||
                    (payload.schoolName as string) ||
                    (payload.organizationName as string) ||
                    (payload.organizer as string) ||
                    sub.email.split("@")[0];

                  const summaryText =
                    (payload.opportunityTitle as string) ||
                    (payload.topic as string) ||
                    (payload.notes as string) ||
                    (payload.partnershipType as string) ||
                    (payload.coverLetter as string) ||
                    (payload.source as string) ||
                    "—";

                  return (
                    <tr key={String(sub.id)}>
                      {/* Kind Badge */}
                      <td>
                        <span className={badge.className}>
                          {badge.icon}
                          {badge.label}
                        </span>
                      </td>

                      {/* Sender */}
                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-user-details">
                            <span className="admin-user-name">{titleName}</span>
                            <span className="admin-user-email">
                              <Mail size={12} />
                              {sub.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Payload Summary */}
                      <td>
                        <div className="admin-submission-summary">
                          <span className="admin-submission-summary-text">{summaryText}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td>
                        <div className="admin-user-date">
                          <Calendar size={13} />
                          <span>
                            {sub.createdAt
                              ? new Date(sub.createdAt).toLocaleDateString(isAr ? "ar-EG" : "en-GB", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                              : "—"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="text-end">
                        <div className="admin-row-actions">
                          <button
                            type="button"
                            className="admin-btn-secondary compact"
                            onClick={() => setSelectedSubmission(sub)}
                            title={isAr ? "عرض التفاصيل الكاملة" : "View full details"}
                          >
                            <Eye size={14} />
                            <span>{isAr ? "عرض" : "View"}</span>
                          </button>

                          <button
                            type="button"
                            className="admin-action-btn delete"
                            disabled={isBusy}
                            onClick={() => setPendingDeleteId(sub.id)}
                            title={isAr ? "حذف الطلب" : "Delete submission"}
                            aria-label={isAr ? "حذف الطلب" : "Delete submission"}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Slide-Over Modal */}
      {selectedSubmission && (
        <div className="admin-cms-modal-overlay" onClick={() => setSelectedSubmission(null)}>
          <div className="admin-cms-modal-box admin-submission-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-cms-modal-header">
              <div className="admin-modal-title-with-badge">
                <span className={getKindBadge(selectedSubmission.kind).className}>
                  {getKindBadge(selectedSubmission.kind).icon}
                  {getKindBadge(selectedSubmission.kind).label}
                </span>
                <h3>{isAr ? "تفاصيل الطلب والاستمارة" : "Submission Details"}</h3>
              </div>
              <button
                type="button"
                className="admin-cms-modal-close"
                onClick={() => setSelectedSubmission(null)}
                aria-label={isAr ? "إغلاق" : "Close"}
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-cms-modal-body">
              <div className="admin-detail-meta-box">
                <div className="admin-detail-meta-item">
                  <span className="label">{isAr ? "البريد الإلكتروني:" : "Email:"}</span>
                  <span className="value">
                    <Mail size={14} />
                    <a href={`mailto:${selectedSubmission.email}`}>{selectedSubmission.email}</a>
                  </span>
                </div>
                <div className="admin-detail-meta-item">
                  <span className="label">{isAr ? "تاريخ الإرسال:" : "Submitted At:"}</span>
                  <span className="value">
                    <Calendar size={14} />
                    {new Date(selectedSubmission.createdAt).toLocaleString(isAr ? "ar-EG" : "en-GB")}
                  </span>
                </div>
              </div>

              <div className="admin-detail-fields-list">
                <h4 className="admin-fields-section-title">{isAr ? "بيانات الاستمارة المُدخلة:" : "Submitted Fields:"}</h4>
                {Object.entries(selectedSubmission.payload || {}).map(([key, value]) => {
                  const safeHref =
                    typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://"))
                      ? sanitizeUrl(value)
                      : "";

                  return (
                    <div key={key} className="admin-detail-field-row">
                      <span className="field-key">{key}</span>
                      <div className="field-val">
                        {safeHref ? (
                          <a href={safeHref} target="_blank" rel="noopener noreferrer" className="admin-link-ext">
                            <span>{value as string}</span>
                            <ExternalLink size={13} />
                          </a>
                        ) : typeof value === "object" && value !== null ? (
                          <pre className="admin-detail-json-block">{JSON.stringify(value, null, 2)}</pre>
                        ) : (
                          <span className="val-text">{String(value)}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="admin-cms-modal-actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setSelectedSubmission(null)}
                >
                  {isAr ? "إغلاق" : "Close"}
                </button>

                <button
                  type="button"
                  className="admin-btn-danger"
                  onClick={() => {
                    const id = selectedSubmission.id;
                    setSelectedSubmission(null);
                    setPendingDeleteId(id);
                  }}
                >
                  <Trash2 size={14} />
                  <span>{isAr ? "حذف هذا الطلب" : "Delete Submission"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={pendingDeleteId !== null}
        title={isAr ? "حذف الطلب" : "Delete Submission"}
        message={
          isAr
            ? "هل أنت متأكد من حذف هذا الطلب نهائياً من سجلات الإدارة؟"
            : "Are you sure you want to permanently delete this submission record?"
        }
        confirmLabel={isAr ? "نعم، احذف الطلب" : "Yes, Delete"}
        cancelLabel={isAr ? "إلغاء" : "Cancel"}
        onConfirm={() => pendingDeleteId !== null && handlePerformDelete(pendingDeleteId)}
        onCancel={() => setPendingDeleteId(null)}
        busy={busyId !== null}
      />
    </div>
  );
};
