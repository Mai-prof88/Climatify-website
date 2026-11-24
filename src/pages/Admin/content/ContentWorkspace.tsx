import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Settings,
  Plus, Edit2, Trash2, X, Loader2, AlertTriangle, RefreshCw, Search,
  Layers, CheckCircle2, Globe, Save, Columns,
} from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { useCMSStore } from "../../../store/useCMSStore";
import { resolveProgramIcon } from "../../../components/ProgramCards/ProgramCards";
import { ConfirmDialog } from "../ConfirmDialog";
import { PROGRAM_ICONS } from "./sections";
import { ImageUploadDropzone } from "./ImageUploadDropzone";
import type { FieldDef, FormRecord, SectionDef } from "./types";

/**
 * مساحة عمل قسم واحد من أقسام المحتوى: جدول + بحث + فلتر + استوديو تحرير ونشر مدمج.
 * المكوّن عام على (TItem, TPayload) ويُبنى لكل قسم بنوعيه الصريحين في
 * AdminContent — فالحقول والأعمدة كلها مكتوبة بلا أي cast.
 *
 * استوديو التحرير مدمج داخل الصفحة (Inline Studio) لتوحيد تجربة النشر والتعديل،
 * مع تبويبات لغة واسعة تتيح الكتابة براحة تامة دون نوافذ عائمة متكدسة.
 */
export function ContentWorkspace<TItem extends { id: string }, TPayload>({
  section,
}: {
  section: SectionDef<TItem, TPayload>;
}) {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  useEffect(() => { setSearchQuery(""); setFilterCategory("all"); }, [section.id]);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormRecord>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const [editorTab, setEditorTab] = useState<"ar" | "en" | "meta">("ar");
  const [isSideBySide, setIsSideBySide] = useState(false);
  const editorRef = useRef<HTMLElement | null>(null);

  const modalTitleId = useId();

  const items = useCMSStore((state) => section.selectItems(state));
  const loading = useCMSStore((state) => state.loading);
  const failedResources = useCMSStore((state) => state.failedResources);
  const loadCMSContent = useCMSStore((state) => state.loadCMSContent);

  useEffect(() => {
    void loadCMSContent();
  }, [loadCMSContent]);

  // المرجع الذي فُتح به المحرر — أي انحراف عنه يعني تغييرات غير محفوظة.
  const [baseline, setBaseline] = useState<string | null>(null);
  const isDirty = baseline !== null && JSON.stringify(form) !== baseline;

  const closeEditor = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
    setFormError(null);
    setBaseline(null);
  }, []);

  /** كل منافذ إغلاق المحرر تمر من هنا: المتغيّرات غير المحفوظة تطلب تأكيداً. */
  const requestClose = useCallback(() => {
    if (isSubmitting) return;
    if (isDirty) {
      setConfirmDiscard(true);
      return;
    }
    closeEditor();
  }, [isDirty, isSubmitting, closeEditor]);

  // Escape يقفل المحرر عبر نفس الحارس — لكن ليس أثناء الحفظ.
  useEffect(() => {
    if (!showForm || isSubmitting) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showForm, isSubmitting, requestClose]);

  const handleOpenAdd = () => {
    setRowError(null);
    setEditingId(null);
    setFormError(null);
    setEditorTab("ar");
    const fresh = section.emptyForm();
    setForm(fresh);
    setBaseline(JSON.stringify(fresh));
    setShowForm(true);
    setTimeout(() => {
      editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleOpenEdit = (item: TItem) => {
    setRowError(null);
    setEditingId(item.id);
    setFormError(null);
    setEditorTab("ar");
    const existing = section.formOf(item);
    setForm(existing);
    setBaseline(JSON.stringify(existing));
    setShowForm(true);
    setTimeout(() => {
      editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError(null);

    // Cross-tab required field validation (catches missing inputs on unmounted ar/en/meta tabs)
    for (const field of section.fields) {
      if (!field.required) continue;
      const val = form[field.name];
      const text = typeof val === "string" ? val.trim() : val === undefined ? "" : String(val).trim();
      if (!text) {
        const targetTab: "ar" | "en" | "meta" =
          field.lang === "ar" ? "ar" : field.lang === "en" ? "en" : "meta";
        if (!isSideBySide && editorTab !== targetTab) {
          setEditorTab(targetTab);
        }
        setFormError(
          isAr
            ? `برجاء إكمال الحقل المطلوب: ${field.labelAr}`
            : `Please complete the required field: ${field.labelEn}`
        );
        requestAnimationFrame(() => {
          document.getElementById(`cms-${section.id}-${field.name}`)?.focus();
        });
        return;
      }
    }

    const validationError = section.validate(form, isAr);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = section.toPayload(form);
      const res = editingId
        ? await section.update(editingId, payload)
        : await section.create(payload);

      if (res.ok) {
        closeEditor();
      } else {
        setFormError(res.error ?? (isAr ? "تعذّر الحفظ." : "Save failed."));
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : (isAr ? "حدث خطأ غير متوقع." : "Unexpected error."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const performDelete = async (id: string) => {
    setPendingDeleteId(null);
    setDeletingId(id);
    setRowError(null);
    try {
      const res = await section.remove(id);
      if (!res.ok) setRowError(res.error ?? (isAr ? "تعذّر الحذف." : "Failed to delete item."));
    } catch (err) {
      setRowError(err instanceof Error ? err.message : (isAr ? "خطأ في الحذف." : "Error deleting item."));
    } finally {
      setDeletingId(null);
    }
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filter = section.filter;
    return items.filter((item) => {
      const matchesQuery = !q || section.searchText(item, isAr).toLowerCase().includes(q);
      const matchesFilter =
        !filter || filterCategory === "all" || filter.value(item) === filterCategory;
      return matchesQuery && matchesFilter;
    });
  }, [items, searchQuery, filterCategory, section, isAr]);

  const pendingDeleteName = useMemo(() => {
    if (pendingDeleteId === null) return null;
    const target = items.find((item) => item.id === pendingDeleteId);
    return target ? section.displayName(target, isAr) : null;
  }, [pendingDeleteId, items, section, isAr]);

  const generalFields = section.fields.filter((f) => f.lang === null);
  const arabicFields = section.fields.filter((f) => f.lang === "ar");
  const englishFields = section.fields.filter((f) => f.lang === "en");

  const renderField = (field: FieldDef) => {
    const inputId = `cms-${section.id}-${field.name}`;
    const rawValue = form[field.name];
    const raw = typeof rawValue === "string" ? rawValue : rawValue === undefined ? "" : String(rawValue);
    const setValue = (next: string) => setForm((prev) => ({ ...prev, [field.name]: next }));

    let control: React.ReactNode;
    switch (field.kind) {
      case "textarea":
        control = (
          <textarea
            id={inputId}
            className={`admin-form-input admin-form-textarea ${field.span === 2 ? "admin-form-textarea-tall" : ""}`}
            rows={field.span === 2 ? 8 : 4}
            value={raw}
            onChange={(e) => setValue(e.target.value)}
            required={field.required}
            disabled={isSubmitting}
            placeholder={isAr ? field.placeholderAr : field.placeholderEn}
          />
        );
        break;

      case "image":
        control = (
          <ImageUploadDropzone
            value={raw}
            onChange={(nextUrl) => setValue(nextUrl)}
            disabled={isSubmitting}
            isAr={isAr}
            folder={section.id}
          />
        );
        break;

      case "url":
        control = (
          <input
            id={inputId}
            type="url"
            className="admin-form-input"
            placeholder={isAr ? field.placeholderAr : field.placeholderEn}
            value={raw}
            onChange={(e) => setValue(e.target.value)}
            disabled={isSubmitting}
          />
        );
        break;

      case "number":
        control = (
          <input
            id={inputId}
            type="number"
            className="admin-form-input"
            min={field.min}
            max={field.max}
            value={raw}
            onChange={(e) => {
              const parsed = Number(e.target.value);
              const clamped = Number.isFinite(parsed)
                ? String(Math.min(field.max ?? 1000000, Math.max(field.min ?? 0, Math.round(parsed))))
                : String(field.numberFallback ?? 0);
              setValue(e.target.value === "" ? "" : clamped);
            }}
            disabled={isSubmitting}
          />
        );
        break;

      case "date":
        control = (
          <input
            id={inputId}
            type="date"
            className="admin-form-input"
            value={raw}
            onChange={(e) => setValue(e.target.value)}
            required={field.required}
            disabled={isSubmitting}
          />
        );
        break;

      case "select":
        control = (
          <select
            id={inputId}
            className="admin-form-input"
            value={raw}
            onChange={(e) => setValue(e.target.value)}
            disabled={isSubmitting}
          >
            {(field.options ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {isAr ? option.labelAr : option.labelEn}
              </option>
            ))}
          </select>
        );
        break;

      case "icon":
        control = (
          <div className="admin-icon-picker" role="radiogroup" aria-label={isAr ? "اختيار أيقونة البرنامج" : "Program icon selection"}>
            {PROGRAM_ICONS.map((name) => {
              const Icon = resolveProgramIcon(name);
              const selected = raw === name;
              return (
                <button
                  key={name}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`admin-icon-picker-item ${selected ? "active" : ""}`}
                  onClick={() => setValue(name)}
                  disabled={isSubmitting}
                  title={name}
                >
                  <Icon size={20} />
                  <span>{name}</span>
                  {selected && <CheckCircle2 size={12} aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        );
        break;

      default:
        control = (
          <input
            id={inputId}
            type="text"
            className="admin-form-input"
            placeholder={isAr ? field.placeholderAr : field.placeholderEn}
            value={raw}
            onChange={(e) => setValue(e.target.value)}
            required={field.required}
            disabled={isSubmitting}
          />
        );
    }

    return (
      <div
        key={field.name}
        className={`admin-form-group${field.span === 2 ? " admin-form-group-wide" : ""}`}
      >
        <label className="admin-form-label" htmlFor={inputId}>
          {isAr ? field.labelAr : field.labelEn}
          {field.required ? <span aria-hidden="true"> *</span> : null}
        </label>
        {control}
        {(isAr ? field.hintAr : field.hintEn) ? (
          <p className="admin-form-hint">{isAr ? field.hintAr : field.hintEn}</p>
        ) : null}
      </div>
    );
  };

  const previewUrl =
    section.previewField && typeof form[section.previewField] === "string"
      ? (form[section.previewField] as string)
      : "";

  const filter = section.filter;

  const currentEditingItem = useMemo(() => {
    if (!editingId) return null;
    return items.find((it) => it.id === editingId) ?? null;
  }, [editingId, items]);

  const currentEditingTitle = useMemo(() => {
    if (!currentEditingItem) return null;
    return section.displayName(currentEditingItem, isAr);
  }, [currentEditingItem, section, isAr]);

  const isArticleSection = section.id === "articles";

  const studioTitle = editingId
    ? (isAr ? `تعديل ${section.labelAr}: ${currentEditingTitle || ""}` : `Edit ${section.labelEn}: ${currentEditingTitle || ""}`)
    : (isAr ? (isArticleSection ? "نشر مقال جديد" : `إضافة إلى ${section.labelAr}`) : (isArticleSection ? "Publish New Article" : `Add to ${section.labelEn}`));

  const studioSubtitle = editingId
    ? (isAr ? "عدّل المحتوى باللغتين العربية والإنجليزية ثم اضغط حفظ التعديلات فوراً." : "Edit content in both Arabic and English, then save changes directly.")
    : (isAr ? "أدخل بيانات المحتوى باللغتين العربية والإنجليزية لنشره على المنصة." : "Fill in content details in both languages to publish on the platform.");

  const submitLabel = editingId
    ? (isAr ? "حفظ التعديلات" : "Save Changes")
    : (isAr ? (isArticleSection ? "نشر المقال الآن" : "حفظ ونشر") : (isArticleSection ? "Publish Article Now" : "Save & Publish"));

  return (
    <div>
      {rowError && (
        <div className="admin-alert error" role="alert">
          <AlertTriangle size={16} />
          <span>{rowError}</span>
        </div>
      )}

      {failedResources.length > 0 && (
        <div className="admin-alert warning" role="alert">
          <AlertTriangle size={16} />
          <span>
            {isAr
              ? `بعض البيانات لم تُحمل من السيرفر: ${failedResources.join("، ")}`
              : `Some content resources could not be loaded: ${failedResources.join(", ")}`}
          </span>
          <span className="admin-alert-actions">
            <button type="button" className="admin-add-btn sm" onClick={() => void loadCMSContent()}>
              <RefreshCw size={14} />
              <span>{isAr ? "إعادة التحميل" : "Retry"}</span>
            </button>
          </span>
        </div>
      )}

      {/* Search & Action Toolbar */}
      <div className="admin-cms-toolbar">
        <div className="admin-cms-toolbar-left">
          <div className="admin-cms-search-box">
            <Search size={16} className="admin-cms-search-icon" />
            <input
              type="search"
              className="admin-cms-search-input"
              placeholder={
                isAr
                  ? `بحث في ${section.labelAr}...`
                  : `Search ${section.labelEn}...`
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={isAr ? `بحث في ${section.labelAr}` : `Search ${section.labelEn}`}
            />
          </div>

          {filter && (
            <select
              className="admin-cms-filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              aria-label={isAr ? filter.labelAr : filter.labelEn}
            >
              <option value="all">{isAr ? "الكل" : "All"}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {isAr ? option.labelAr : option.labelEn}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="button"
          className={`admin-add-btn ${showForm && !editingId ? "active" : ""}`}
          onClick={() => {
            if (showForm && !editingId) {
              requestClose();
            } else {
              handleOpenAdd();
            }
          }}
        >
          {showForm && !editingId ? <X size={16} /> : <Plus size={16} />}
          <span>
            {showForm && !editingId
              ? (isAr ? "إلغاء النموذج" : "Close Studio")
              : (isAr ? (isArticleSection ? "نشر مقال جديد" : `إضافة إلى ${section.labelAr}`) : (isArticleSection ? "Publish Article" : `Add to ${section.labelEn}`))}
          </span>
        </button>
      </div>

      {/* Inline Publishing & Editing Studio Card — نفس القالب الموحد للنشر والتعديل معاً */}
      {showForm && (
        <section
          ref={editorRef}
          className="admin-card admin-cms-inline-studio"
          aria-labelledby={modalTitleId}
        >
          <div className="admin-cms-studio-header">
            <div className="admin-cms-studio-heading">
              <span className={`admin-cms-studio-glyph ${editingId ? "" : "create"}`} aria-hidden="true">
                {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
              </span>
              <div className="admin-cms-studio-title-wrap">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span className={`admin-cms-studio-badge ${editingId ? "edit" : "create"}`}>
                    {editingId ? (isAr ? "تعديل المحتوى" : "Edit Mode") : (isAr ? "نشر جديد" : "New Publication")}
                  </span>
                  <div className="admin-cms-studio-title" id={modalTitleId}>
                    {studioTitle}
                  </div>
                </div>
                <p className="admin-cms-studio-sub">{studioSubtitle}</p>
              </div>
            </div>

            <div className="admin-cms-studio-actions">
              {isDirty && (
                <span className="admin-cms-studio-dirty-badge" title={isAr ? "يوجد تعديلات غير محفوظة" : "Unsaved changes"}>
                  <span className="admin-cms-studio-dirty-dot" aria-hidden="true" />
                  <span>{isAr ? "تعديلات غير محفوظة" : "Unsaved"}</span>
                </span>
              )}
              <button
                type="button"
                className="admin-action-btn neutral"
                onClick={requestClose}
                disabled={isSubmitting}
                aria-label={isAr ? "إغلاق الاستوديو" : "Close studio"}
                title={isAr ? "إغلاق الاستوديو" : "Close studio"}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} noValidate>
            {/* Studio Navigation Bar */}
            <div className="admin-cms-studio-nav">
              <div className="admin-cms-studio-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={!isSideBySide && editorTab === "ar"}
                  className={`admin-cms-studio-tab-btn ${!isSideBySide && editorTab === "ar" ? "active" : ""}`}
                  onClick={() => { setIsSideBySide(false); setEditorTab("ar"); }}
                >
                  <Globe size={15} />
                  <span>{isAr ? "المحتوى بالعربية" : "Arabic Content"}</span>
                  <span className="admin-cms-studio-tab-count">{arabicFields.length}</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={!isSideBySide && editorTab === "en"}
                  className={`admin-cms-studio-tab-btn ${!isSideBySide && editorTab === "en" ? "active" : ""}`}
                  onClick={() => { setIsSideBySide(false); setEditorTab("en"); }}
                >
                  <Globe size={15} />
                  <span>{isAr ? "المحتوى بالإنجليزي" : "English Content"}</span>
                  <span className="admin-cms-studio-tab-count">{englishFields.length}</span>
                </button>

                {generalFields.length > 0 && (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={!isSideBySide && editorTab === "meta"}
                    className={`admin-cms-studio-tab-btn ${!isSideBySide && editorTab === "meta" ? "active" : ""}`}
                    onClick={() => { setIsSideBySide(false); setEditorTab("meta"); }}
                  >
                    <Settings size={16} aria-hidden="true" />
                    <span>{isAr ? "بيانات النشر والوسائط" : "Settings & Media"}</span>
                    <span className="admin-cms-studio-tab-count">{generalFields.length}</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                className={`admin-cms-studio-view-toggle ${isSideBySide ? "active" : ""}`}
                onClick={() => setIsSideBySide((prev) => !prev)}
                title={isAr ? "تبديل إلى عرض اللغتين جنباً إلى جنب" : "Toggle side-by-side bilingual view"}
              >
                <Columns size={15} />
                <span>{isAr ? (isSideBySide ? "العودة للتبويبات" : "عرض متجاور") : (isSideBySide ? "Tabbed View" : "Side by Side")}</span>
              </button>
            </div>

            {/* Studio Body */}
            <div className="admin-cms-studio-body">
              {formError && (
                <div className="admin-alert error" role="alert" style={{ marginBottom: "18px" }}>
                  <AlertTriangle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              {isSideBySide ? (
                /* Side-by-side Mode */
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {generalFields.length > 0 && (
                    <div className="admin-cms-meta-grid">
                      {generalFields.map(renderField)}
                    </div>
                  )}

                  <div className="admin-cms-studio-side-by-side">
                    <div className="admin-cms-studio-side-col" dir="rtl">
                      <div className="admin-cms-studio-side-head">
                        <Globe size={15} />
                        <span>النسخة العربية (RTL)</span>
                      </div>
                      {arabicFields.map(renderField)}
                    </div>

                    <div className="admin-cms-studio-side-col" dir="ltr">
                      <div className="admin-cms-studio-side-head">
                        <Globe size={15} />
                        <span>English Version (LTR)</span>
                      </div>
                      {englishFields.map(renderField)}
                    </div>
                  </div>
                </div>
              ) : (
                /* Tabbed Mode */
                <>
                  {editorTab === "ar" && (
                    <div className="admin-cms-studio-panel" dir="rtl">
                      {arabicFields.map(renderField)}
                      <button
                        type="button"
                        className="admin-cms-tab-step-btn"
                        onClick={() => setEditorTab("en")}
                      >
                        <span>{isAr ? "الانتقال للنسخة الإنجليزية ←" : "Proceed to English Version →"}</span>
                      </button>
                    </div>
                  )}

                  {editorTab === "en" && (
                    <div className="admin-cms-studio-panel" dir="ltr">
                      {englishFields.map(renderField)}
                      <button
                        type="button"
                        className="admin-cms-tab-step-btn"
                        onClick={() => setEditorTab(generalFields.length > 0 ? "meta" : "ar")}
                      >
                        <span>{isAr ? "الانتقال لبيانات النشر والوسائط ←" : "Proceed to Settings & Media →"}</span>
                      </button>
                    </div>
                  )}

                  {editorTab === "meta" && (
                    <div className="admin-cms-studio-panel">
                      <div className="admin-cms-meta-grid">
                        {generalFields.map(renderField)}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Live Preview for Image if present */}
              {section.previewField && previewUrl && (
                <div className="admin-cms-studio-preview-card">
                  <img
                    src={previewUrl}
                    alt={isAr ? "معاينة الغلاف" : "Cover preview"}
                    className="admin-cms-studio-preview-thumb"
                    onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
                  />
                  <div className="admin-cms-studio-preview-meta">
                    <span className="admin-cms-studio-preview-badge">
                      {isAr ? "✓ رابط صورة الغلاف متصل وجاهز للعرض" : "✓ Cover image attached"}
                    </span>
                    <span className="admin-cms-studio-preview-url">{previewUrl}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Studio Sticky Footer */}
            <div className="admin-cms-studio-footer">
              <div className="admin-cms-studio-footer-meta">
                <span>{isAr ? "تأكد من إدخال اللغتين لضمان تجربة مثالية للزوار" : "Ensure both languages are completed for optimal experience"}</span>
              </div>

              <div className="admin-cms-studio-footer-buttons">
                <button
                  type="button"
                  className="admin-btn-cancel"
                  onClick={requestClose}
                  disabled={isSubmitting}
                >
                  {isAr ? "إلغاء التراجع" : "Cancel"}
                </button>

                <button
                  type="submit"
                  className="admin-btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="admin-btn-inner">
                      <Loader2 size={16} className="admin-spinner" />
                      {isAr ? "جاري الحفظ والتسجيل..." : "Saving..."}
                    </span>
                  ) : (
                    <span className="admin-btn-inner">
                      {editingId ? <Save size={16} /> : <CheckCircle2 size={16} />}
                      {submitLabel}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      {/* Content Table Card */}
      <div className="admin-card admin-table-card">
        {loading ? (
          <div className="admin-loading-block">
            <Loader2 size={22} className="admin-spinner" />
            <span>{isAr ? "جاري تحميل البيانات..." : "Loading content items..."}</span>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {section.columns.map((column) => (
                    <th key={column.labelEn} className={column.className}>
                      {isAr ? column.labelAr : column.labelEn}
                    </th>
                  ))}
                  <th className="admin-col-actions">{isAr ? "إجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={editingId === item.id ? "admin-table-row-editing" : ""}
                  >
                    {section.columns.map((column) => (
                      <td
                        key={column.labelEn}
                        data-label={isAr ? column.labelAr : column.labelEn}
                        className={column.className}
                      >
                        {column.render(item, isAr)}
                      </td>
                    ))}
                    <td data-label={isAr ? "إجراءات" : "Actions"}>
                      <div className="admin-table-actions">
                        <button
                          className={`admin-action-btn edit ${editingId === item.id ? "active" : ""}`}
                          onClick={() => handleOpenEdit(item)}
                          title={isAr ? "تعديل" : "Edit"}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="admin-action-btn delete"
                          onClick={() => {
                            setRowError(null);
                            setPendingDeleteId(item.id);
                          }}
                          disabled={deletingId === item.id}
                          title={isAr ? "حذف" : "Delete"}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={section.columns.length + 1} className="admin-table-empty-cell">
                      <div className="admin-empty-state compact">
                        <div className="icon"><Layers size={32} /></div>
                        <p>
                          {isAr
                            ? "لا توجد عناصر مضافة بعد أو تطابق البحث."
                            : "No content items match your search or filter."}
                        </p>
                        {searchQuery && (
                          <div className="admin-empty-actions">
                            <button
                              type="button"
                              className="admin-btn-cancel sm"
                              onClick={() => setSearchQuery("")}
                            >
                              {isAr ? "إلغاء البحث" : "Clear Search"}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={pendingDeleteId !== null}
        title={isAr ? "تأكيد الحذف" : "Confirm Deletion"}
        message={
          pendingDeleteName
            ? (isAr
                ? `هل أنت متأكد من حذف «${pendingDeleteName}»؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete “${pendingDeleteName}”? This action cannot be undone.`)
            : (isAr ? "هل أنت متأكد من حذف هذا العنصر؟" : "Are you sure you want to delete this item?")
        }
        confirmLabel={isAr ? "حذف نهائي" : "Delete Permanently"}
        cancelLabel={isAr ? "إلغاء" : "Cancel"}
        busy={deletingId !== null}
        onConfirm={() => {
          if (pendingDeleteId !== null) void performDelete(pendingDeleteId);
        }}
        onCancel={() => setPendingDeleteId(null)}
      />

      {/* Discard Unsaved Changes */}
      <ConfirmDialog
        open={confirmDiscard}
        title={isAr ? "تغييرات غير محفوظة" : "Unsaved changes"}
        message={
          isAr
            ? "عندك تعديلات لم تُحفظ بعد. هل تريد الخروج بدون حفظ؟"
            : "You have unsaved changes. Leave without saving?"
        }
        confirmLabel={isAr ? "خروج بدون حفظ" : "Discard changes"}
        cancelLabel={isAr ? "متابعة التحرير" : "Keep editing"}
        onConfirm={() => {
          setConfirmDiscard(false);
          closeEditor();
        }}
        onCancel={() => setConfirmDiscard(false)}
      />
    </div>
  );
}
