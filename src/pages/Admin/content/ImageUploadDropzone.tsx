import React, { useRef, useState } from "react";
import {
  UploadCloud, Trash2, CheckCircle2,
  Loader2, Zap, Link as LinkIcon, RefreshCw, AlertTriangle
} from "lucide-react";
import { optimizeImage, formatFileSize, type ImageOptimizationResult } from "../../../utils/imageOptimizer";
import { apiService } from "../../../services/api";

export interface ImageUploadDropzoneProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  label?: string;
  hint?: string;
  isAr?: boolean;
  folder?: string;
}

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  value,
  onChange,
  disabled = false,
  label,
  hint,
  isAr = true,
  folder = "articles",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [busyPhase, setBusyPhase] = useState<"compressing" | "uploading" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [lastStats, setLastStats] = useState<ImageOptimizationResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg(isAr ? "يرجى اختيار ملف صورة صالح (PNG, JPG, WebP)." : "Please select a valid image file.");
      return;
    }

    setErrorMsg(null);
    setIsBusy(true);

    try {
      // المرحلة الأولى: ضغط وتحسين الصورة بنسبة 50% على الأقل
      setBusyPhase("compressing");
      const optimized = await optimizeImage(file, {
        maxWidth: 1600,
        maxHeight: 1200,
        quality: 0.75,
        targetReductionPercent: 50,
      });

      setLastStats(optimized);

      // المرحلة الثانية: رفع الصورة المضغوطة إلى مساحة التخزين (Supabase Storage)
      setBusyPhase("uploading");
      const uploadRes = await apiService.uploadImage(optimized.file, folder);

      if (uploadRes.ok && uploadRes.url) {
        onChange(uploadRes.url);
      } else {
        throw new Error(uploadRes.error || (isAr ? "تعذّر رفع الصورة إلى السيرفر." : "Failed to upload image."));
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : (isAr ? "حدث خطأ أثناء معالجة الصورة." : "Error processing image."));
    } finally {
      setIsBusy(false);
      setBusyPhase(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleProcessFile(file);
    }
    // إعادة تعيين القيمة لتمكين اختيار نفس الملف مجدداً
    if (e.target) e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isBusy) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isBusy) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleProcessFile(file);
    }
  };

  const handleClear = () => {
    onChange("");
    setLastStats(null);
    setErrorMsg(null);
  };

  return (
    <div className="admin-image-upload-wrapper">
      {label && (
        <label className="admin-form-label">
          {label}
        </label>
      )}

      {/* رسالة الخطأ إن وجدت */}
      {errorMsg && (
        <div className="admin-alert error compact" role="alert" style={{ marginBottom: "10px" }}>
          <AlertTriangle size={15} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* الحالة 1: يوجد صورة حالية (عرض المعاينة + بيانات الضغط + خيارات التعديل) */}
      {value ? (
        <div className="admin-image-preview-card">
          <div className="admin-image-preview-thumb-wrap">
            <img
              src={value}
              alt={isAr ? "معاينة صورة المقال" : "Article image preview"}
              className="admin-image-preview-thumb"
              onError={(e) => {
                (e.target as HTMLElement).style.opacity = "0.4";
              }}
            />
          </div>

          <div className="admin-image-preview-info">
            <div className="admin-image-preview-header">
              <span className="admin-image-preview-badge">
                <CheckCircle2 size={13} />
                <span>{isAr ? "جاهزة للنشر" : "Ready"}</span>
              </span>
              {lastStats && (
                <span className="admin-image-compression-badge">
                  <Zap size={13} />
                  <span>
                    {isAr
                      ? `تم الضغط: -${lastStats.savedPercentage}% (من ${formatFileSize(lastStats.originalSize)} إلى ${formatFileSize(lastStats.compressedSize)})`
                      : `Compressed: -${lastStats.savedPercentage}% (${formatFileSize(lastStats.originalSize)} → ${formatFileSize(lastStats.compressedSize)})`}
                  </span>
                </span>
              )}
            </div>

            <p className="admin-image-preview-url" title={value}>
              {value}
            </p>

            <div className="admin-image-preview-actions">
              <button
                type="button"
                className="admin-image-action-btn change"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isBusy}
              >
                {isBusy ? <Loader2 size={14} className="admin-spinner" /> : <RefreshCw size={14} />}
                <span>{isAr ? "تغيير الصورة" : "Change Image"}</span>
              </button>

              <button
                type="button"
                className="admin-image-action-btn remove"
                onClick={handleClear}
                disabled={disabled || isBusy}
              >
                <Trash2 size={14} />
                <span>{isAr ? "حذف الصورة" : "Remove"}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* الحالة 2: لا توجد صورة (منطقة السحب والإفلات أو رفع ملف) */
        <div
          className={`admin-image-dropzone ${isDragging ? "dragging" : ""} ${isBusy ? "busy" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isBusy && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          {isBusy ? (
            <div className="admin-image-dropzone-busy">
              <Loader2 size={28} className="admin-spinner" />
              <p className="admin-image-busy-text">
                {busyPhase === "compressing"
                  ? (isAr ? "جاري ضغط الصورة بالمتصفح بنسبة 50%+ لتسريع المنصة..." : "Optimizing & compressing image (50%+ target)...")
                  : (isAr ? "جاري رفع الصورة إلى التخزين السحابي..." : "Uploading optimized image to cloud storage...")}
              </p>
            </div>
          ) : (
            <div className="admin-image-dropzone-content">
              <div className="admin-image-dropzone-icon">
                <UploadCloud size={28} />
              </div>
              <div className="admin-image-dropzone-text">
                <span className="admin-image-dropzone-title">
                  {isAr ? "اضغط هنا لاختيار صورة من جهازك، أو اسحبها وأفلتها هنا" : "Click to browse image or drag and drop here"}
                </span>
                <span className="admin-image-dropzone-sub">
                  {isAr
                    ? "تدعم PNG, JPG, WebP — يتم ضغط الصورة تلقائياً بنسبة 50% أو أكثر لتوفير المساحة"
                    : "PNG, JPG, WebP supported — automatically compressed by 50%+ to save bandwidth"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* مدخل الملف المخفي */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        style={{ display: "none" }}
        onChange={handleFileChange}
        disabled={disabled || isBusy}
      />

      {/* تبديل إدخال رابط يدوي */}
      <div className="admin-image-url-toggle-bar">
        <button
          type="button"
          className="admin-image-url-toggle-btn"
          onClick={() => setShowManualUrl((prev) => !prev)}
        >
          <LinkIcon size={13} />
          <span>{isAr ? (showManualUrl ? "إخفاء إدخال الرابط اليدوي" : "أو إدخال رابط صورة خارجي (URL)") : (showManualUrl ? "Hide URL input" : "Or enter external image URL")}</span>
        </button>
      </div>

      {showManualUrl && (
        <div className="admin-image-manual-url-box">
          <input
            type="url"
            className="admin-form-input"
            placeholder={isAr ? "https://images.unsplash.com/..." : "https://example.com/image.webp"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || isBusy}
          />
        </div>
      )}

      {hint && <p className="admin-form-hint">{hint}</p>}
    </div>
  );
};
