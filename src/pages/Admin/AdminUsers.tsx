import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useCMSStore } from "../../store/useCMSStore";
import type { AdminUser } from "../../types";
import {
  Users,
  UserCheck,
  UserX,
  School,
  Building2,
  Shield,
  Search,
  Plus,
  Trash2,
  Download,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Award,
  TreePine,
  Mail,
  MapPin,
  Calendar,
  X,
  CheckCircle2,
} from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";
import { buildCsv, downloadTextFile, toLocalDateInput } from "./adminUtils";

type RoleFilter = "all" | "member" | "school" | "partner" | "admin";
type StatusFilter = "all" | "active" | "suspended";

export const AdminUsers: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const users = useCMSStore((state) => state.users);
  const loading = useCMSStore((state) => state.loading);
  const storeError = useCMSStore((state) => state.error);
  const loadAdminUsers = useCMSStore((state) => state.loadAdminUsers);
  const createAdminUser = useCMSStore((state) => state.createAdminUser);
  const updateAdminUserRole = useCMSStore((state) => state.updateAdminUserRole);
  const toggleAdminUserStatus = useCMSStore((state) => state.toggleAdminUserStatus);
  const deleteAdminUser = useCMSStore((state) => state.deleteAdminUser);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // New user modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserCity, setNewUserCity] = useState("دبي");
  const [newUserBio, setNewUserBio] = useState("");
  const [newUserRole, setNewUserRole] = useState<AdminUser["role"]>("member");
  const [addModalError, setAddModalError] = useState<string | null>(null);
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

  useEffect(() => {
    if (users.length === 0 && !loading && !storeError) {
      void loadAdminUsers();
    }
  }, [users.length, loading, storeError, loadAdminUsers]);

  // Derived metrics
  const totalCount = users.length;
  const memberCount = useMemo(() => users.filter((u) => u.role === "member").length, [users]);
  const schoolCount = useMemo(() => users.filter((u) => u.role === "school").length, [users]);
  const partnerCount = useMemo(() => users.filter((u) => u.role === "partner").length, [users]);
  const adminCount = useMemo(() => users.filter((u) => u.role === "admin").length, [users]);
  const activeCount = useMemo(() => users.filter((u) => u.status !== "suspended").length, [users]);
  const suspendedCount = useMemo(() => users.filter((u) => u.status === "suspended").length, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.city && u.city.toLowerCase().includes(q)) ||
        (u.bio && u.bio.toLowerCase().includes(q));

      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const userStatus = u.status || "active";
      const matchesStatus = statusFilter === "all" || userStatus === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Handle Export CSV
  const handleExportCSV = () => {
    if (users.length === 0) return;
    const headers = [
      "ID",
      "Name",
      "Email",
      "Role",
      "City",
      "Status",
      "Eco Points",
      "Virtual Trees",
      "Created At",
    ];
    const rows = users.map((u) => [
      u.id,
      u.name,
      u.email,
      u.role,
      u.city || "",
      u.status || "active",
      String(u.ecoPoints || 0),
      String(u.virtualTrees || 0),
      u.createdAt || "",
    ]);
    downloadTextFile(
      `climatify_users_${toLocalDateInput()}.csv`,
      buildCsv(headers, rows),
      "text/csv;charset=utf-8"
    );
  };

  // Delete User
  const handlePerformDelete = async (id: string) => {
    setPendingDeleteId(null);
    setActionError(null);
    setBusyId(id);
    try {
      const res = await deleteAdminUser(id);
      if (!res.ok) {
        setActionError(res.error || (isAr ? "تعذّر حذف المستخدم." : "Could not delete user."));
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Error deleting user.");
    } finally {
      setBusyId(null);
    }
  };

  // Toggle Status
  const handleToggleStatus = async (id: string) => {
    setActionError(null);
    setBusyId(id);
    try {
      const res = await toggleAdminUserStatus(id);
      if (!res.ok) {
        setActionError(res.error || (isAr ? "تعذّر تحديث حالة المستخدم." : "Could not update user status."));
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Error updating status.");
    } finally {
      setBusyId(null);
    }
  };

  // Change Role
  const handleChangeRole = async (id: string, newRole: AdminUser["role"]) => {
    setActionError(null);
    setBusyId(id);
    try {
      const res = await updateAdminUserRole(id, newRole);
      if (!res.ok) {
        setActionError(res.error || (isAr ? "تعذّر تغيير دور المستخدم." : "Could not update user role."));
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Error updating role.");
    } finally {
      setBusyId(null);
    }
  };

  // Handle Add New User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddModalError(null);

    const name = newUserName.trim();
    const email = newUserEmail.trim();
    if (!name || !email) {
      setAddModalError(isAr ? "برجاء كتابة الاسم والبريد الإلكتروني." : "Please provide name and email.");
      return;
    }
    if (!email.includes("@")) {
      setAddModalError(isAr ? "بريد إلكتروني غير صالح." : "Invalid email address.");
      return;
    }

    setIsSubmittingAdd(true);
    try {
      const res = await createAdminUser({
        name,
        email,
        city: newUserCity.trim() || (isAr ? "الإمارات" : "UAE"),
        bio: newUserBio.trim(),
        role: newUserRole,
        status: "active",
        ecoPoints: 0,
        virtualTrees: 0,
      });

      if (!res.ok) {
        setAddModalError(res.error || (isAr ? "تعذّر إنشاء الحساب." : "Could not create user account."));
        return;
      }

      // Reset and close
      setNewUserName("");
      setNewUserEmail("");
      setNewUserBio("");
      setShowAddModal(false);
    } catch (err) {
      setAddModalError(err instanceof Error ? err.message : "Error creating user.");
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  const getRoleBadge = (role: AdminUser["role"]) => {
    switch (role) {
      case "admin":
        return {
          icon: <Shield size={13} />,
          label: isAr ? "مسؤول نظام" : "Admin",
          className: "admin-badge-role admin",
        };
      case "school":
        return {
          icon: <School size={13} />,
          label: isAr ? "مؤسسة تعليمية" : "School",
          className: "admin-badge-role school",
        };
      case "partner":
        return {
          icon: <Building2 size={13} />,
          label: isAr ? "شريك استراتيجي" : "Partner",
          className: "admin-badge-role partner",
        };
      default:
        return {
          icon: <UserCheck size={13} />,
          label: isAr ? "عضو شبابي" : "Member",
          className: "admin-badge-role member",
        };
    }
  };

  return (
    <div className="admin-users-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">
            <span>{isAr ? "إدارة المستخدمين والأعضاء المسجلين" : "Users & Members Management"}</span>
          </h2>
          <p className="admin-page-subtitle">
            {isAr
              ? "التحكم الكامل بجميع الحسابات المسجلة بالمنصة، صلاحيات الأدوار، وحالة التفعيل"
              : "Full control over all registered platform accounts, member roles, and activation status"}
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-cms-refresh-btn"
            onClick={() => void loadAdminUsers()}
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
            disabled={users.length === 0}
            title={isAr ? "تصدير كملف CSV" : "Export as CSV"}
          >
            <Download size={15} />
            <span>{isAr ? "تصدير CSV" : "Export CSV"}</span>
          </button>

          <button
            type="button"
            className="admin-btn-primary"
            onClick={() => {
              setAddModalError(null);
              setShowAddModal(true);
            }}
          >
            <Plus size={16} />
            <span>{isAr ? "إضافة مستخدم جديد" : "Add New User"}</span>
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
            <Users size={20} />
          </div>
          <div className="admin-users-stat-info">
            <span className="admin-users-stat-label">{isAr ? "إجمالي المسجلين" : "Total Users"}</span>
            <span className="admin-users-stat-value">{totalCount}</span>
          </div>
        </div>

        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon blue">
            <UserCheck size={20} />
          </div>
          <div className="admin-users-stat-info">
            <span className="admin-users-stat-label">{isAr ? "الأعضاء النشطين" : "Active Members"}</span>
            <span className="admin-users-stat-value">{memberCount}</span>
          </div>
        </div>

        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon purple">
            <School size={20} />
          </div>
          <div className="admin-users-stat-info">
            <span className="admin-users-stat-label">{isAr ? "حسابات المدارس والجامعات" : "Educational Institutions"}</span>
            <span className="admin-users-stat-value">{schoolCount}</span>
          </div>
        </div>

        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon amber">
            <Building2 size={20} />
          </div>
          <div className="admin-users-stat-info">
            <span className="admin-users-stat-label">{isAr ? "الشركاء والمؤسسات" : "Strategic Partners"}</span>
            <span className="admin-users-stat-value">{partnerCount}</span>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="admin-cms-toolbar admin-users-toolbar">
        {/* Role Tabs */}
        <div className="admin-users-role-tabs" role="tablist">
          <button
            type="button"
            className={`admin-cms-tab-btn ${roleFilter === "all" ? "active" : ""}`}
            onClick={() => setRoleFilter("all")}
          >
            <span>{isAr ? "الكل" : "All Roles"}</span>
            <span className="admin-cms-tab-count">{totalCount}</span>
          </button>

          <button
            type="button"
            className={`admin-cms-tab-btn ${roleFilter === "member" ? "active" : ""}`}
            onClick={() => setRoleFilter("member")}
          >
            <UserCheck size={14} />
            <span>{isAr ? "الأعضاء" : "Members"}</span>
            <span className="admin-cms-tab-count">{memberCount}</span>
          </button>

          <button
            type="button"
            className={`admin-cms-tab-btn ${roleFilter === "school" ? "active" : ""}`}
            onClick={() => setRoleFilter("school")}
          >
            <School size={14} />
            <span>{isAr ? "التعليم" : "Schools"}</span>
            <span className="admin-cms-tab-count">{schoolCount}</span>
          </button>

          <button
            type="button"
            className={`admin-cms-tab-btn ${roleFilter === "partner" ? "active" : ""}`}
            onClick={() => setRoleFilter("partner")}
          >
            <Building2 size={14} />
            <span>{isAr ? "الشركاء" : "Partners"}</span>
            <span className="admin-cms-tab-count">{partnerCount}</span>
          </button>

          <button
            type="button"
            className={`admin-cms-tab-btn ${roleFilter === "admin" ? "active" : ""}`}
            onClick={() => setRoleFilter("admin")}
          >
            <Shield size={14} />
            <span>{isAr ? "المسؤولين" : "Admins"}</span>
            <span className="admin-cms-tab-count">{adminCount}</span>
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="admin-users-search-wrap">
          <div className="admin-cms-search">
            <Search size={15} />
            <input
              type="text"
              placeholder={isAr ? "بحث بالاسم، البريد، أو الإمارة..." : "Search by name, email, or city..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={isAr ? "بحث في المستخدمين" : "Search users"}
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

          <select
            className="admin-select-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            aria-label={isAr ? "تصفية حسب الحالة" : "Filter by status"}
          >
            <option value="all">{isAr ? `جميع الحالات (${totalCount})` : `All Statuses (${totalCount})`}</option>
            <option value="active">{isAr ? `نشط فقط (${activeCount})` : `Active only (${activeCount})`}</option>
            <option value="suspended">{isAr ? `موقوف فقط (${suspendedCount})` : `Suspended only (${suspendedCount})`}</option>
          </select>
        </div>
      </div>

      {/* Users Table / List */}
      <div className="admin-users-table-container">
        {loading && users.length === 0 ? (
          <div className="admin-loading-state">
            <Loader2 size={30} className="spin" />
            <p>{isAr ? "جاري تحميل بيانات المستخدمين والأعضاء..." : "Loading users and members..."}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="admin-empty-state-card">
            <Users size={36} />
            <h3>{isAr ? "لا توجد نتائج مطابقة" : "No matching users found"}</h3>
            <p>
              {searchQuery || roleFilter !== "all" || statusFilter !== "all"
                ? isAr
                  ? "جرّب تعديل معايير البحث أو التصفية."
                  : "Try clearing or adjusting your search filters."
                : isAr
                ? "لم يسجل أي عضو حتى الآن."
                : "No members have registered yet."}
            </p>
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>{isAr ? "العضو / المستخدم" : "User / Member"}</th>
                  <th>{isAr ? "الدور والصلاحية" : "Role"}</th>
                  <th>{isAr ? "المدينة / الإمارة" : "City / Location"}</th>
                  <th>{isAr ? "النقاط البيئية" : "Eco Impact"}</th>
                  <th>{isAr ? "الحالة" : "Status"}</th>
                  <th>{isAr ? "تاريخ الانضمام" : "Joined"}</th>
                  <th className="text-end">{isAr ? "الإجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  const isSuspended = user.status === "suspended";
                  const isBusy = busyId === user.id;

                  return (
                    <tr key={user.id} className={isSuspended ? "row-suspended" : ""}>
                      {/* Name & Email */}
                      <td>
                        <div className="admin-user-cell">
                          <div className={`admin-user-avatar role-${user.role}`}>
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="admin-user-details">
                            <span className="admin-user-name">{user.name}</span>
                            <span className="admin-user-email">
                              <Mail size={12} />
                              {user.email}
                            </span>
                            {user.bio && <span className="admin-user-bio-snippet">{user.bio}</span>}
                          </div>
                        </div>
                      </td>

                      {/* Role Dropdown */}
                      <td>
                        <div className="admin-role-select-wrapper">
                          <span className={roleBadge.className}>
                            {roleBadge.icon}
                            {roleBadge.label}
                          </span>
                          <select
                            className="admin-role-selector"
                            value={user.role}
                            disabled={isBusy}
                            onChange={(e) => handleChangeRole(user.id, e.target.value as AdminUser["role"])}
                            title={isAr ? "تغيير رتبة المستخدم" : "Change user role"}
                            aria-label={isAr ? "تغيير رتبة المستخدم" : "Change user role"}
                          >
                            <option value="member">{isAr ? "عضو شبابي (Member)" : "Member"}</option>
                            <option value="school">{isAr ? "مؤسسة تعليمية (School)" : "School"}</option>
                            <option value="partner">{isAr ? "شريك استراتيجي (Partner)" : "Partner"}</option>
                            <option value="admin">{isAr ? "مسؤول نظام (Admin)" : "Admin"}</option>
                          </select>
                        </div>
                      </td>

                      {/* City */}
                      <td>
                        <div className="admin-user-location">
                          <MapPin size={13} />
                          <span>{user.city || (isAr ? "الإمارات" : "UAE")}</span>
                        </div>
                      </td>

                      {/* Eco Impact */}
                      <td>
                        <div className="admin-user-impact">
                          <span className="admin-impact-pill points" title={isAr ? "نقاط العمل المناخي" : "Eco points"}>
                            <Award size={12} />
                            {user.ecoPoints ?? 0}
                          </span>
                          <span className="admin-impact-pill trees" title={isAr ? "أشجار افتراضية مزروعة" : "Virtual trees"}>
                            <TreePine size={12} />
                            {user.virtualTrees ?? 0}
                          </span>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td>
                        <button
                          type="button"
                          className={`admin-status-badge-btn ${isSuspended ? "suspended" : "active"}`}
                          onClick={() => handleToggleStatus(user.id)}
                          disabled={isBusy}
                          title={
                            isSuspended
                              ? isAr
                                ? "انقر لتفعيل الحساب"
                                : "Click to activate account"
                              : isAr
                              ? "انقر لتجميد الحساب"
                              : "Click to suspend account"
                          }
                        >
                          {isSuspended ? (
                            <>
                              <UserX size={12} />
                              <span>{isAr ? "موقوف" : "Suspended"}</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={12} />
                              <span>{isAr ? "نشط" : "Active"}</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Joined Date */}
                      <td>
                        <div className="admin-user-date">
                          <Calendar size={13} />
                          <span>
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString(isAr ? "ar-EG" : "en-GB", {
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
                            className="admin-action-btn delete"
                            disabled={isBusy}
                            onClick={() => setPendingDeleteId(user.id)}
                            title={isAr ? "حذف المستخدم" : "Delete user"}
                            aria-label={isAr ? "حذف المستخدم" : "Delete user"}
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
        title={isAr ? "حذف حساب المستخدم" : "Delete User Account"}
        message={
          isAr
            ? "هل أنت متأكد من حذف هذا الحساب نهائياً من المنصة؟ لن يتمكن العضو من تسجيل الدخول بعد الآن."
            : "Are you sure you want to permanently delete this user account? The member will no longer be able to log in."
        }
        confirmLabel={isAr ? "نعم، احذف الحساب" : "Yes, Delete Account"}
        cancelLabel={isAr ? "إلغاء" : "Cancel"}
        onConfirm={() => pendingDeleteId && handlePerformDelete(pendingDeleteId)}
        onCancel={() => setPendingDeleteId(null)}
        busy={busyId !== null}
      />

      {/* Add New User Modal */}
      {showAddModal && (
        <div className="admin-cms-modal-overlay" onClick={() => !isSubmittingAdd && setShowAddModal(false)}>
          <div className="admin-cms-modal-box admin-add-user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-cms-modal-header">
              <h3>{isAr ? "إضافة مستخدم جديد" : "Add New User Account"}</h3>
              <button
                type="button"
                className="admin-cms-modal-close"
                onClick={() => setShowAddModal(false)}
                disabled={isSubmittingAdd}
                aria-label={isAr ? "إغلاق" : "Close"}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="admin-cms-modal-body">
              {addModalError && (
                <div className="admin-alert error" role="alert">
                  <AlertTriangle size={15} />
                  <span>{addModalError}</span>
                </div>
              )}

              <div className="admin-form-group">
                <label>{isAr ? "الاسم الكامل *" : "Full Name *"}</label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? "مثال: مريم الكعبي" : "e.g. Mariam Al-Kaabi"}
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>{isAr ? "البريد الإلكتروني *" : "Email Address *"}</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>{isAr ? "نوع الحساب / الصلاحية" : "Account Role"}</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as AdminUser["role"])}
                  >
                    <option value="member">{isAr ? "عضو شبابي (Member)" : "Member"}</option>
                    <option value="school">{isAr ? "مدرسة / جامعة (School)" : "School"}</option>
                    <option value="partner">{isAr ? "جهة شريكة (Partner)" : "Partner"}</option>
                    <option value="admin">{isAr ? "مسؤول نظام (Admin)" : "Admin"}</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>{isAr ? "المدينة / الإمارة" : "City / Emirate"}</label>
                  <input
                    type="text"
                    placeholder={isAr ? "دبي، أبوظبي، الشارقة..." : "Dubai, Abu Dhabi..."}
                    value={newUserCity}
                    onChange={(e) => setNewUserCity(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>{isAr ? "نبذة تعريفية" : "Bio / Notes"}</label>
                <textarea
                  rows={3}
                  placeholder={isAr ? "نبذة عن اهتمامات العضو أو نشاط المؤسسة..." : "Brief notes on interests or organization..."}
                  value={newUserBio}
                  onChange={(e) => setNewUserBio(e.target.value)}
                />
              </div>

              <div className="admin-cms-modal-actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmittingAdd}
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button type="submit" className="admin-btn-primary" disabled={isSubmittingAdd}>
                  {isSubmittingAdd ? (
                    <>
                      <Loader2 size={16} className="spin" />
                      <span>{isAr ? "جاري الإنشاء..." : "Creating..."}</span>
                    </>
                  ) : (
                    <span>{isAr ? "تأكيد إضافة المستخدم" : "Create User"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
