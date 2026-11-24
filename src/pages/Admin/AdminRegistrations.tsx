import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useCMSStore } from "../../store/useCMSStore";
import type { AdminEventRegistration } from "../../types";
import {
  Ticket,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Trash2,
  Download,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Mail,
  Phone,
  Calendar,
  X,
  UserCheck,
  QrCode,
  Tag,
} from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";
import { buildCsv, downloadTextFile, toLocalDateInput } from "./adminUtils";

type StatusFilter = "all" | "Confirmed" | "Attended" | "Cancelled";

export const AdminRegistrations: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const registrations = useCMSStore((state) => state.eventRegistrations);
  const loading = useCMSStore((state) => state.loading);
  const storeError = useCMSStore((state) => state.error);
  const loadAdminEventRegistrations = useCMSStore((state) => state.loadAdminEventRegistrations);
  const updateEventRegistrationStatus = useCMSStore((state) => state.updateEventRegistrationStatus);
  const deleteEventRegistration = useCMSStore((state) => state.deleteEventRegistration);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>("all");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | number | null>(null);

  useEffect(() => {
    if (registrations.length === 0 && !loading && !storeError) {
      void loadAdminEventRegistrations();
    }
  }, [registrations.length, loading, storeError, loadAdminEventRegistrations]);

  // Derived metrics
  const totalCount = registrations.length;
  const confirmedCount = useMemo(
    () => registrations.filter((r) => r.status === "Confirmed").length,
    [registrations]
  );
  const attendedCount = useMemo(
    () => registrations.filter((r) => r.status === "Attended").length,
    [registrations]
  );
  const cancelledCount = useMemo(
    () => registrations.filter((r) => r.status === "Cancelled").length,
    [registrations]
  );

  // Distinct events list for dropdown filter
  const eventOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of registrations) {
      if (!map.has(r.eventId)) {
        map.set(
          r.eventId,
          isAr
            ? r.eventTitleAr || r.eventTitleEn || r.eventId
            : r.eventTitleEn || r.eventTitleAr || r.eventId
        );
      }
    }
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  }, [registrations, isAr]);

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return registrations.filter((r) => {
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        r.ticketCode.toLowerCase().includes(q) ||
        (r.eventTitleEn && r.eventTitleEn.toLowerCase().includes(q)) ||
        (r.eventTitleAr && r.eventTitleAr.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesEvent = selectedEventFilter === "all" || r.eventId === selectedEventFilter;

      return matchesSearch && matchesStatus && matchesEvent;
    });
  }, [registrations, searchQuery, statusFilter, selectedEventFilter]);

  // Handle Export CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) return;
    const headers = [
      "Ticket Code",
      "Attendee Name",
      "Email",
      "Phone",
      "Event ID",
      "Event Title",
      "Status",
      "Registration Date",
    ];
    const rows = registrations.map((r) => [
      r.ticketCode,
      r.name,
      r.email,
      r.phone,
      r.eventId,
      isAr ? r.eventTitleAr || r.eventTitleEn || "" : r.eventTitleEn || r.eventTitleAr || "",
      r.status,
      r.createdAt,
    ]);
    downloadTextFile(
      `climatify_registrations_${toLocalDateInput()}.csv`,
      buildCsv(headers, rows),
      "text/csv;charset=utf-8"
    );
  };

  // Status Change
  const handleChangeStatus = async (
    id: string | number,
    newStatus: AdminEventRegistration["status"]
  ) => {
    setActionError(null);
    setBusyId(id);
    try {
      const res = await updateEventRegistrationStatus(id, newStatus);
      if (!res.ok) {
        setActionError(res.error || (isAr ? "تعذّر تحديث حالة التذكرة." : "Could not update registration status."));
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Error updating status.");
    } finally {
      setBusyId(null);
    }
  };

  // Delete
  const handlePerformDelete = async (id: string | number) => {
    setPendingDeleteId(null);
    setActionError(null);
    setBusyId(id);
    try {
      const res = await deleteEventRegistration(id);
      if (!res.ok) {
        setActionError(res.error || (isAr ? "تعذّر حذف التسجيل." : "Could not delete registration."));
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Error deleting registration.");
    } finally {
      setBusyId(null);
    }
  };

  const getStatusBadge = (status: AdminEventRegistration["status"]) => {
    switch (status) {
      case "Attended":
        return {
          icon: <CheckCircle size={13} />,
          label: isAr ? "حضر الفعالية (Attended)" : "Attended",
          className: "admin-badge-status attended",
        };
      case "Cancelled":
        return {
          icon: <XCircle size={13} />,
          label: isAr ? "ملغي (Cancelled)" : "Cancelled",
          className: "admin-badge-status cancelled",
        };
      default:
        return {
          icon: <Clock size={13} />,
          label: isAr ? "مؤكد الحجز (Confirmed)" : "Confirmed",
          className: "admin-badge-status confirmed",
        };
    }
  };

  return (
    <div className="admin-registrations-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">
            <span>{isAr ? "تسجيلات الفعاليات وتذاكر الحضور" : "Event Registrations & Tickets"}</span>
          </h2>
          <p className="admin-page-subtitle">
            {isAr
              ? "متابعة الحضور، التحقق من أكواد التذاكر، وتأكيد الحضور في ورش العمل والملتقيات المناخية"
              : "Track attendees, verify ticket codes, and record check-ins across all climate conferences and workshops"}
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-cms-refresh-btn"
            onClick={() => void loadAdminEventRegistrations()}
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
            disabled={registrations.length === 0}
            title={isAr ? "تصدير كشف الحضور CSV" : "Export attendees as CSV"}
          >
            <Download size={15} />
            <span>{isAr ? "تصدير كشف الحضور" : "Export CSV"}</span>
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
            <Ticket size={20} />
          </div>
          <div className="admin-users-stat-info">
            <span className="admin-users-stat-label">{isAr ? "إجمالي التذاكر المسجلة" : "Total Registrations"}</span>
            <span className="admin-users-stat-value">{totalCount}</span>
          </div>
        </div>

        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon blue">
            <Clock size={20} />
          </div>
          <div className="admin-users-stat-info">
            <span className="admin-users-stat-label">{isAr ? "الحجوزات المؤكدة" : "Confirmed"}</span>
            <span className="admin-users-stat-value">{confirmedCount}</span>
          </div>
        </div>

        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon purple">
            <UserCheck size={20} />
          </div>
          <div className="admin-users-stat-info">
            <span className="admin-users-stat-label">{isAr ? "حضور مؤكد (Check-in)" : "Attended"}</span>
            <span className="admin-users-stat-value">{attendedCount}</span>
          </div>
        </div>

        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon amber">
            <XCircle size={20} />
          </div>
          <div className="admin-users-stat-info">
            <span className="admin-users-stat-label">{isAr ? "تذاكر ملغاة" : "Cancelled"}</span>
            <span className="admin-users-stat-value">{cancelledCount}</span>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="admin-cms-toolbar admin-users-toolbar">
        {/* Status Tabs */}
        <div className="admin-users-role-tabs" role="tablist">
          <button
            type="button"
            className={`admin-cms-tab-btn ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            <span>{isAr ? "الكل" : "All Tickets"}</span>
            <span className="admin-cms-tab-count">{totalCount}</span>
          </button>

          <button
            type="button"
            className={`admin-cms-tab-btn ${statusFilter === "Confirmed" ? "active" : ""}`}
            onClick={() => setStatusFilter("Confirmed")}
          >
            <Clock size={14} />
            <span>{isAr ? "مؤكد" : "Confirmed"}</span>
            <span className="admin-cms-tab-count">{confirmedCount}</span>
          </button>

          <button
            type="button"
            className={`admin-cms-tab-btn ${statusFilter === "Attended" ? "active" : ""}`}
            onClick={() => setStatusFilter("Attended")}
          >
            <CheckCircle size={14} />
            <span>{isAr ? "حضر" : "Attended"}</span>
            <span className="admin-cms-tab-count">{attendedCount}</span>
          </button>

          <button
            type="button"
            className={`admin-cms-tab-btn ${statusFilter === "Cancelled" ? "active" : ""}`}
            onClick={() => setStatusFilter("Cancelled")}
          >
            <XCircle size={14} />
            <span>{isAr ? "ملغي" : "Cancelled"}</span>
            <span className="admin-cms-tab-count">{cancelledCount}</span>
          </button>
        </div>

        {/* Search & Event Filter */}
        <div className="admin-users-search-wrap">
          {eventOptions.length > 0 && (
            <select
              className="admin-select-status"
              value={selectedEventFilter}
              onChange={(e) => setSelectedEventFilter(e.target.value)}
              aria-label={isAr ? "تصفية حسب الفعالية" : "Filter by event"}
            >
              <option value="all">{isAr ? "جميع الفعاليات" : "All Events"}</option>
              {eventOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          <div className="admin-cms-search">
            <Search size={15} />
            <input
              type="text"
              placeholder={isAr ? "بحث بالاسم، البريد، الهاتف، كود التذكرة..." : "Search by name, ticket code, phone..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={isAr ? "بحث في التسجيلات" : "Search registrations"}
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

      {/* Registrations Table */}
      <div className="admin-users-table-container">
        {loading && registrations.length === 0 ? (
          <div className="admin-loading-state">
            <Loader2 size={30} className="spin" />
            <p>{isAr ? "جاري تحميل كشوفات وتذاكر الفعاليات..." : "Loading event registrations..."}</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="admin-empty-state-card">
            <Ticket size={36} />
            <h3>{isAr ? "لا توجد تسجيلات مطابقة" : "No matching registrations found"}</h3>
            <p>
              {searchQuery || statusFilter !== "all" || selectedEventFilter !== "all"
                ? isAr
                  ? "جرّب تعديل معايير البحث أو اختيار فعالية أخرى."
                  : "Try clearing search or choosing another event."
                : isAr
                ? "لم يسجل أي شخص في الفعاليات حتى الآن."
                : "No attendees have registered for events yet."}
            </p>
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>{isAr ? "كود التذكرة" : "Ticket Code"}</th>
                  <th>{isAr ? "بيانات الحاضر" : "Attendee Details"}</th>
                  <th>{isAr ? "الفعالية المسجل بها" : "Event"}</th>
                  <th>{isAr ? "حالة الحضور" : "Attendance Status"}</th>
                  <th>{isAr ? "تاريخ الحجز" : "Registered At"}</th>
                  <th className="text-end">{isAr ? "تسجيل الحضور / الإجراءات" : "Check-in & Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => {
                  const statusBadge = getStatusBadge(reg.status);
                  const isBusy = busyId === reg.id;
                  const eventTitle = isAr
                    ? reg.eventTitleAr || reg.eventTitleEn || reg.eventId
                    : reg.eventTitleEn || reg.eventTitleAr || reg.eventId;

                  return (
                    <tr key={String(reg.id)} className={`reg-status-${reg.status.toLowerCase()}`}>
                      {/* Ticket Code */}
                      <td>
                        <div className="admin-ticket-code-cell">
                          <QrCode size={15} />
                          <span className="admin-ticket-code-badge">{reg.ticketCode}</span>
                        </div>
                      </td>

                      {/* Attendee Details */}
                      <td>
                        <div className="admin-attendee-cell">
                          <span className="admin-attendee-name">{reg.name}</span>
                          <span className="admin-attendee-email">
                            <Mail size={12} />
                            {reg.email}
                          </span>
                          {reg.phone && (
                            <span className="admin-attendee-phone">
                              <Phone size={12} />
                              {reg.phone}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Event Title */}
                      <td>
                        <div className="admin-reg-event-title">
                          <Tag size={13} />
                          <span>{eventTitle}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td>
                        <span className={statusBadge.className}>
                          {statusBadge.icon}
                          {statusBadge.label}
                        </span>
                      </td>

                      {/* Date */}
                      <td>
                        <div className="admin-user-date">
                          <Calendar size={13} />
                          <span>
                            {reg.createdAt
                              ? new Date(reg.createdAt).toLocaleDateString(isAr ? "ar-EG" : "en-GB", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "—"}
                          </span>
                        </div>
                      </td>

                      {/* Quick Actions */}
                      <td className="text-end">
                        <div className="admin-reg-actions-group">
                          {reg.status !== "Attended" && (
                            <button
                              type="button"
                              className="admin-reg-btn checkin"
                              disabled={isBusy}
                              onClick={() => handleChangeStatus(reg.id, "Attended")}
                              title={isAr ? "تسجيل حضور العضو" : "Mark as Attended"}
                            >
                              <UserCheck size={14} />
                              <span>{isAr ? "حضر" : "Check-in"}</span>
                            </button>
                          )}

                          {reg.status !== "Confirmed" && (
                            <button
                              type="button"
                              className="admin-reg-btn confirm"
                              disabled={isBusy}
                              onClick={() => handleChangeStatus(reg.id, "Confirmed")}
                              title={isAr ? "إعادة تأكيد الحجز" : "Confirm ticket"}
                            >
                              <Clock size={14} />
                              <span>{isAr ? "تأكيد" : "Confirm"}</span>
                            </button>
                          )}

                          {reg.status !== "Cancelled" && (
                            <button
                              type="button"
                              className="admin-reg-btn cancel"
                              disabled={isBusy}
                              onClick={() => handleChangeStatus(reg.id, "Cancelled")}
                              title={isAr ? "إلغاء التذكرة" : "Cancel ticket"}
                            >
                              <XCircle size={14} />
                              <span>{isAr ? "إلغاء" : "Cancel"}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            className="admin-action-btn delete"
                            disabled={isBusy}
                            onClick={() => setPendingDeleteId(reg.id)}
                            title={isAr ? "حذف التذكرة" : "Delete registration"}
                            aria-label={isAr ? "حذف التذكرة" : "Delete registration"}
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={pendingDeleteId !== null}
        title={isAr ? "حذف تذكرة التسجيل" : "Delete Registration"}
        message={
          isAr
            ? "هل أنت متأكد من حذف هذا التسجيل بالكامل؟ سيتم مسح بيانات التذكرة الخاصة بالحاضر."
            : "Are you sure you want to permanently delete this event registration ticket?"
        }
        confirmLabel={isAr ? "نعم، احذف التسجيل" : "Yes, Delete"}
        cancelLabel={isAr ? "تراجع" : "Cancel"}
        onConfirm={() => pendingDeleteId !== null && handlePerformDelete(pendingDeleteId)}
        onCancel={() => setPendingDeleteId(null)}
        busy={busyId !== null}
      />
    </div>
  );
};
