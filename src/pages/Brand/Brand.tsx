import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  Download, Sparkles, Copy, Check,
  Droplet, Leaf, Users, ArrowUpRight, ShieldCheck,
  Palette, Type, Layers, ExternalLink, Eye, Sun, Moon
} from "lucide-react";
import { SEO } from "../../components/common/SEO";
import "./Brand.css";

interface ColorItem {
  nameEn: string;
  nameAr: string;
  hex: string;
  rgb: string;
  roleEn: string;
  roleAr: string;
  textLight: boolean;
}

const BRAND_COLORS: ColorItem[] = [
  {
    nameEn: "Primary Green",
    nameAr: "الأخضر الأساسي",
    hex: "#00C091",
    rgb: "rgb(0, 192, 145)",
    roleEn: "Nature, renewal, primary CTAs & active states",
    roleAr: "الطبيعة، التجدد، الأزرار الرئيسية والشارات النشطة",
    textLight: true
  },
  {
    nameEn: "Primary Blue",
    nameAr: "الأزرق الأساسي",
    hex: "#009AF8",
    rgb: "rgb(0, 154, 248)",
    roleEn: "Water, oceans, digital links & gradient flows",
    roleAr: "المياه، المحيطات، الروابط الرقمية وتدفق التدرج",
    textLight: true
  },
  {
    nameEn: "Deep Navy",
    nameAr: "الكحلي الداكن",
    hex: "#122133",
    rgb: "rgb(18, 33, 51)",
    roleEn: "Depth, primary typography, dark backgrounds & headers",
    roleAr: "العمق، العناوين الرئيسية، الخلفيات الليلية والهيدر",
    textLight: true
  },
  {
    nameEn: "Light Gray",
    nameAr: "الرمادي الفاتح",
    hex: "#F1F5F9",
    rgb: "rgb(241, 245, 249)",
    roleEn: "Surface backdrops, subtle cards & contrast borders",
    roleAr: "الأسطح الهادئة، كروت المعلومات، والحدود الفاصلة",
    textLight: false
  },
  {
    nameEn: "Pure White",
    nameAr: "الأبيض النقي",
    hex: "#FFFFFF",
    rgb: "rgb(255, 255, 255)",
    roleEn: "Clarity, high contrast badges & card containers",
    roleAr: "الوضوح، التباين العالي، وخلفيات الحاويات الرئيسية",
    textLight: false
  }
];

interface LogoAsset {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  previewUrl: string;
  pngUrl: string;
  webpUrl: string;
  darkBg?: boolean;
}

const LOGO_ASSETS: LogoAsset[] = [
  {
    id: "vertical-master",
    titleEn: "Primary Vertical Lockup",
    titleAr: "الشعار الرأسي الأساسي (Master)",
    descEn: "Standard logo for white and light-colored backgrounds.",
    descAr: "الشعار الرسمي المعتمد للاستخدام فوق الخلفيات البيضاء والفاتحة.",
    previewUrl: "/brand/climatify-logo-dark.webp",
    pngUrl: "/brand/climatify-logo-dark.png",
    webpUrl: "/brand/climatify-logo-dark.webp"
  },
  {
    id: "horizontal-lockup",
    titleEn: "Horizontal Lockup with Slogan",
    titleAr: "الشعار الأفقي الممتد مع الشعار اللفظي",
    descEn: "Icon + Wordmark + 'FOR A BETTER FUTURE' for navigation bars & banners.",
    descAr: "الأيقونة مع اسم كلايمتيفاي وسلوجان 'For A Better Future' للأشرطة العلوية والبانرات.",
    previewUrl: "/brand/climatify-logo-horizontal.webp",
    pngUrl: "/brand/climatify-logo-horizontal.png",
    webpUrl: "/brand/climatify-logo-horizontal.webp"
  },
  {
    id: "icon-only",
    titleEn: "Brand Icon Mark Only",
    titleAr: "رمز الهوية المستقل (Brand Mark)",
    descEn: "Circular dynamic symbol with inward arrow for favicons & app icons.",
    descAr: "الرمز الحركي الدائري بالسهم الداخلي للأيقونات، التطبيقات، والصور الشخصية.",
    previewUrl: "/brand/climatify-icon-only.webp",
    pngUrl: "/brand/climatify-icon-only.png",
    webpUrl: "/brand/climatify-icon-only.webp"
  },
  {
    id: "inverted-white",
    titleEn: "White Inverted Lockup",
    titleAr: "الشعار الأبيض المعكوس (Dark Mode)",
    descEn: "High-contrast version designed specifically for dark navy & dark mode screens.",
    descAr: "النسخة المتباينة المخصصة للخلفيات الكحلية الداكنة، الشاشات الليلية، والمطبوعات المظلمة.",
    previewUrl: "/brand/climatify-logo-white.webp",
    pngUrl: "/brand/climatify-logo-white.png",
    webpUrl: "/brand/climatify-logo-white.webp",
    darkBg: true
  },
  {
    id: "circular-badge",
    titleEn: "Circular Badge Lockup",
    titleAr: "شارة الهوية المقوسة (Badge)",
    descEn: "Arched text emblem for stamps, merchandise & event badges.",
    descAr: "النمط المقوس مع شعار 'For A Better Future' للأختام والفعاليات.",
    previewUrl: "/brand/climatify-logo-badge.webp",
    pngUrl: "/brand/climatify-logo-badge.png",
    webpUrl: "/brand/climatify-logo-badge.webp"
  },
  {
    id: "full-guide-sheet",
    titleEn: "Complete Brand Identity Sheet",
    titleAr: "دليل الهوية البصرية الكامل (Sheet)",
    descEn: "The full official design board including typography, motifs, and colors.",
    descAr: "لوحة الدليل الإرشادي الكاملة المعتمدة تشمل الخطوط، الأنماط، وتدرجات الألوان.",
    previewUrl: "/brand/climatify-brand-guidelines.webp",
    pngUrl: "/brand/climatify-brand-guidelines.png",
    webpUrl: "/brand/climatify-brand-guidelines.webp"
  }
];

export const Brand: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const [previewBackdrop, setPreviewBackdrop] = useState<"light" | "dark">("light");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(null), 2200);
    });
  };

  return (
    <div className={`brand-page-container ${isAr ? "rtl" : ""}`}>
      <SEO
        title={isAr ? "دليل الهوية البصرية والأصول الرقمية" : "Brand Identity & Media Kit"}
        description={
          isAr
            ? "دليل متكامل يوضح فلسفة تصميم كلايمتفاي، لوحة الألوان الرسمية، الخطوط، والرموز البصرية والأصول القابلة للتنزيل."
            : "Official Climatify Brand Guidelines, vector logos, color palette, typography and downloadable media assets."
        }
        breadcrumbs={[
          { name: isAr ? "الرئيسية" : "Home", path: "/" },
          { name: isAr ? "الهوية البصرية" : "Brand Guidelines", path: "/brand" },
        ]}
      />
      {/* ── 1. Hero Section ── */}
      <section className="brand-hero">
        <div className="container text-center">
          <span className="eyebrow brand-eyebrow">
            <Sparkles size={16} />
            {isAr ? "دليل الهوية البصرية والأصول الرقمية" : "Visual Identity & Media Kit"}
          </span>
          <h1 className="section-title brand-title">
            {isAr ? (
              <>هوية كلايمتيفاي — <span className="text-gradient">Brand Guidelines</span></>
            ) : (
              <>Climatify <span className="text-gradient">Brand Identity</span> & Assets</>
            )}
          </h1>
          <p className="section-lead brand-lead mx-auto">
            {isAr
              ? "دليل متكامل يوضح فلسفة تصميم كلايمتيفاي، لوحة الألوان الرسمية، الخطوط، والرموز البصرية التي تجسد تسخير الرقمنة لتمكين العمل المناخي والشبابي."
              : "A comprehensive guide to Climatify's visual philosophy, official color palette, typography, and downloadable media assets uniting climate action and digital empowerment."}
          </p>

          <div className="brand-hero-actions">
            <a href="#downloads" className="btn btn-primary">
              <Download size={18} />
              <span>{isAr ? "تحميل أصول الشعار" : "Download Logo Assets"}</span>
            </a>
            <a
              href="/brand/climatify-brand-guidelines.png"
              download="Climatify-Brand-Guidelines.png"
              className="btn btn-outline"
            >
              <ExternalLink size={18} />
              <span>{isAr ? "تحميل دليل الهوية الكامل" : "Download Full Brand Sheet"}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. Brand Essence — جوهر الهوية والرموز ── */}
      <section className="brand-essence-section section">
        <div className="container">
          <div className="text-center mb-6">
            <span className="eyebrow">
              <Layers size={16} />
              {isAr ? "فلسفة الرمز" : "Brand Essence"}
            </span>
            <h2 className="section-title">
              {isAr ? "جوهر الهوية والرموز البصرية" : "The Meaning Behind Our Visual Identity"}
            </h2>
            <p className="section-lead mx-auto">
              {isAr
                ? "كل عنصر ولون في شعار كلايمتيفاي يحمل دلالة بيئية ورقمية مدروسة تترجم رسالتنا ورؤيتنا المستقبلية."
                : "Every color, curve, and vector in our emblem carries intentional symbolism reflecting climate digitization and community."}
            </p>
          </div>

          <div className="essence-cards-grid">
            {/* Card 1: Green for Nature */}
            <div className="essence-card card">
              <div className="essence-icon-badge green">
                <Leaf size={28} />
              </div>
              <span className="essence-tag green">#00C091 • NATURE</span>
              <h3 className="essence-name">
                {isAr ? "الأخضر: حماية الطبيعة" : "Green for Nature"}
              </h3>
              <p className="essence-desc">
                {isAr
                  ? "يرمز للأرض، الغطاء النباتي، الزراعة المستدامة، والتحول نحو الاقتصاد الأخضر منخفض الكربون."
                  : "Symbolizing earth preservation, regenerative agriculture, biodiversity, and green circular economics."}
              </p>
            </div>

            {/* Card 2: Blue for Water */}
            <div className="essence-card card">
              <div className="essence-icon-badge blue">
                <Droplet size={28} />
              </div>
              <span className="essence-tag blue">#009AF8 • WATER</span>
              <h3 className="essence-name">
                {isAr ? "الأزرق: المياه والمحيطات" : "Blue for Water"}
              </h3>
              <p className="essence-desc">
                {isAr
                  ? "يعبر عن نقاء المياه، حماية الموارد المائية، توازن الغلاف الجوي، وديمومة الحياة على الكوكب."
                  : "Representing water conservation, blue carbon ecosystems, atmospheric balance, and life sustainability."}
              </p>
            </div>

            {/* Card 3: Gradient for Community */}
            <div className="essence-card card">
              <div className="essence-icon-badge gradient">
                <Users size={28} />
              </div>
              <span className="essence-tag gradient">GRADIENT • COMMUNITY</span>
              <h3 className="essence-name">
                {isAr ? "التدرج: ترابط المجتمع" : "Gradient for Community"}
              </h3>
              <p className="essence-desc">
                {isAr
                  ? "التناغم السلس بين الأخضر والأزرق يعكس شمولية المجتمع، التعاون بين الشباب والشركاء، والعمل الجماعي المتكامل."
                  : "Smooth transition between green and blue, symbolizing youth collaboration, multi-stakeholder coalitions, and collective action."}
              </p>
            </div>

            {/* Card 4: Arrow for Impact */}
            <div className="essence-card card">
              <div className="essence-icon-badge arrow">
                <ArrowUpRight size={28} />
              </div>
              <span className="essence-tag arrow">ARROW • IMPACT</span>
              <h3 className="essence-name">
                {isAr ? "السهم: الأثر والتسارع" : "Arrow for Impact"}
              </h3>
              <p className="essence-desc">
                {isAr
                  ? "السهم الموجه نحو المركز يمثل تركيز الطاقات، سرعة التنفيذ، وتحويل الأفكار والوعي إلى أثر بيئي حقيقي ملموس."
                  : "The inward-directed arrow embodies focused acceleration, scalable execution, and turning climate awareness into tangible real-world impact."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Master Logo Interactive Preview — الشعار التفاعلي ── */}
      <section className="brand-logo-preview-section section bg-gradient-brand-soft">
        <div className="container">
          <div className="logo-preview-wrapper card">
            <div className="logo-preview-header">
              <div>
                <span className="eyebrow">
                  <Eye size={16} />
                  {isAr ? "المعاينة التفاعلية" : "Interactive View"}
                </span>
                <h3 className="logo-preview-title">
                  {isAr ? "الشعار الرئيسي — Master Brandmark" : "Master Brandmark & Clear Space"}
                </h3>
              </div>

              {/* Theme Switcher Toggle */}
              <div className="preview-backdrop-toggle" role="group" aria-label="Toggle preview background">
                <button
                  type="button"
                  className={`backdrop-btn ${previewBackdrop === "light" ? "active" : ""}`}
                  onClick={() => setPreviewBackdrop("light")}
                >
                  <Sun size={15} />
                  <span>{isAr ? "خلفية فاتحة" : "Light Mode"}</span>
                </button>
                <button
                  type="button"
                  className={`backdrop-btn ${previewBackdrop === "dark" ? "active" : ""}`}
                  onClick={() => setPreviewBackdrop("dark")}
                >
                  <Moon size={15} />
                  <span>{isAr ? "خلفية داكنة" : "Dark Mode"}</span>
                </button>
              </div>
            </div>

            {/* The Logo Display Canvas */}
            <div className={`logo-display-canvas ${previewBackdrop === "dark" ? "canvas-dark" : "canvas-light"}`}>
              <img
                src={previewBackdrop === "dark" ? "/brand/climatify-logo-white.webp" : "/brand/climatify-logo-dark.webp"}
                alt="Climatify Master Logo"
                className="logo-display-img"
              />
              <div className="canvas-badge-floating">
                {previewBackdrop === "dark" ? "Climatify Inverted Lockup" : "Climatify Master Lockup"}
              </div>
            </div>

            <div className="logo-specs-row">
              <div className="spec-item">
                <strong>{isAr ? "مساحة الأمان (Clear Space)" : "Clear Space"}</strong>
                <p>{isAr ? "تُترك مسافة محيطة تعادل نصف قطر رمز الشعار لضمان الوضوح." : "Maintain at least 50% of symbol radius of clear breathing room around lockup."}</p>
              </div>
              <div className="spec-item">
                <strong>{isAr ? "أدنى حجم رقمي (Min Size)" : "Minimum Digital Size"}</strong>
                <p>{isAr ? "36 بكسل للشاشات الرقمية للحفاظ على وضوح السهم الداخلي." : "36px height on digital screens to preserve arrow sharpness and readability."}</p>
              </div>
              <div className="spec-item">
                <strong>{isAr ? "النسب الهندسية" : "Aspect Ratio"}</strong>
                <p>{isAr ? "نسبة متوازنة بنسبة 1:1 للأيقونة وتوزيع متناسق للنصوص." : "Engineered on an exact circular grid with uniform optical balance."}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Color Palette System — نظام الألوان ── */}
      <section className="brand-palette-section section">
        <div className="container">
          <div className="text-center mb-6">
            <span className="eyebrow">
              <Palette size={16} />
              {isAr ? "لوحة الألوان الرسمية" : "Color System"}
            </span>
            <h2 className="section-title">
              {isAr ? "لوحة الألوان المعتمدة — Color Palette" : "Official Color Palette"}
            </h2>
            <p className="section-lead mx-auto">
              {isAr
                ? "تتكون هوية كلايمتيفاي من لوحة ألوان دقيقة تجمع بين انتعاش الطبيعة ونقاء المياه وعمق الكحلي التقني. اضغط على أي لون لنسخ كود الـ HEX."
                : "Engineered with high contrast and harmonious transitions. Click any card to copy the official HEX color code directly to your clipboard."}
            </p>
          </div>

          <div className="color-palette-grid">
            {BRAND_COLORS.map((color) => (
              <div key={color.hex} className="color-card card">
                <div
                  className="color-swatch-box"
                  style={{ backgroundColor: color.hex }}
                >
                  <span className={`color-swatch-hex ${color.textLight ? "text-light" : "text-dark"}`}>
                    {color.hex}
                  </span>
                </div>

                <div className="color-card-body">
                  <div className="color-header-row">
                    <div>
                      <h4 className="color-name">{isAr ? color.nameAr : color.nameEn}</h4>
                      <span className="color-rgb">{color.rgb}</span>
                    </div>

                    <button
                      type="button"
                      className={`btn-copy-color ${copiedColor === color.hex ? "copied" : ""}`}
                      onClick={() => handleCopyHex(color.hex)}
                      title={isAr ? "نسخ كود اللون" : "Copy Hex Code"}
                      aria-label={`Copy ${color.hex}`}
                    >
                      {copiedColor === color.hex ? <Check size={16} /> : <Copy size={16} />}
                      <span className="btn-copy-text">
                        {copiedColor === color.hex
                          ? (isAr ? "تم النسخ!" : "Copied!")
                          : (isAr ? "نسخ" : "Copy")}
                      </span>
                    </button>
                  </div>

                  <p className="color-role-desc">
                    {isAr ? color.roleAr : color.roleEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Typography System — الخطوط الرسمية ── */}
      <section className="brand-typography-section section bg-surface-2">
        <div className="container">
          <div className="text-center mb-6">
            <span className="eyebrow">
              <Type size={16} />
              {isAr ? "نظام الخطوط" : "Typography"}
            </span>
            <h2 className="section-title">
              {isAr ? "الخطوط والطباعة الرسمية — Typography" : "Brand Typography & Typefaces"}
            </h2>
            <p className="section-lead mx-auto">
              {isAr
                ? "اعتمدنا خطوطاً هندسية معاصرة تحقق أعلى معايير المقروئية والوضوح على كافة الشاشات والمطبوعات."
                : "Combining geometric contemporary typefaces for optimal legibility across high-density screens and editorial print."}
            </p>
          </div>

          <div className="typography-specimen-grid">
            {/* English Font Specimen */}
            <div className="typo-card card">
              <div className="typo-header-badge">
                <span>ENGLISH TYPEFACE</span>
                <strong>SATOSHI</strong>
              </div>
              <h3 className="typo-sample-en">CLIMATIFY</h3>
              <p className="typo-sample-slogan-en">FOR A BETTER FUTURE</p>
              <div className="typo-alphabet-box">
                <span className="alphabet-string">ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
                <span className="alphabet-string">abcdefghijklmnopqrstuvwxyz</span>
                <span className="numbers-string">0123456789 • !@#$%^&*()</span>
              </div>
              <div className="typo-features-list">
                <span>• Geometric Sans-serif</span>
                <span>• Modern 2027 Proportions</span>
                <span>• Crisp on high-res Retina displays</span>
              </div>
            </div>

            {/* Arabic Font Specimen */}
            <div className="typo-card card">
              <div className="typo-header-badge ar">
                <span>الخط العربي المعتمد</span>
                <strong>F37 WICKLOW AR / TAJAWAL</strong>
              </div>
              <h3 className="typo-sample-ar">الأثر المستدام</h3>
              <p className="typo-sample-slogan-ar">مرحباً أهلاً بيكم في كلايمتيفاي</p>
              <div className="typo-alphabet-box">
                <span className="alphabet-string">أ ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن هـ و ي</span>
                <span className="numbers-string">٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩ • 0 1 2 3 4 5 6 7 8 9</span>
              </div>
              <div className="typo-features-list">
                <span>• خط عربي حديث ذو توازن بصري عالٍ</span>
                <span>• مقروئية فائقة في العناوين والفقرات</span>
                <span>• متناسق تماماً مع هندسة الشعار</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Design Motifs & Elements — العناصر البصرية ── */}
      <section className="brand-elements-section section">
        <div className="container">
          <div className="text-center mb-6">
            <span className="eyebrow">
              <Sparkles size={16} />
              {isAr ? "الأنماط والعناصر البصرية" : "Design Elements"}
            </span>
            <h2 className="section-title">
              {isAr ? "العناصر والأنماط البصرية المساندة" : "Graphic Motifs & Visual Elements"}
            </h2>
            <p className="section-lead mx-auto">
              {isAr
                ? "عناصر رسومية مكملة مستوحاة من تدفق الهواء والمياه، وشبكات البيانات والتقنية الرقمية."
                : "Supporting design patterns drawn from fluid wind/water motion and precision digital data matrices."}
            </p>
          </div>

          <div className="elements-grid">
            <div className="element-card card text-center">
              <div className="element-visual-box water-wave-box">
                <svg viewBox="0 0 160 50" className="element-wave-svg" aria-hidden="true">
                  <path d="M0 25 Q20 5 40 25 T80 25 T120 25 T160 25" fill="none" stroke="#009AF8" strokeWidth="3" />
                  <path d="M0 35 Q20 15 40 35 T80 35 T120 35 T160 35" fill="none" stroke="#00C091" strokeWidth="2.5" opacity="0.8" />
                </svg>
              </div>
              <h4 className="element-title">{isAr ? "تموجات الهواء والماء" : "Inspired by Water & Air"}</h4>
              <p className="element-desc">{isAr ? "خطوط انسيابية متموجة ترمز للتنفس، الهواء النقي، وتدفق التيارات المائية المستدامة." : "Fluid waveforms symbolizing clean breeze, river currents, and natural planetary flow."}</p>
            </div>

            <div className="element-card card text-center">
              <div className="element-visual-box dot-matrix-box">
                <div className="matrix-dot-grid" aria-hidden="true">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span key={i} className={`matrix-dot ${i % 3 === 0 ? "brand-green" : i % 2 === 0 ? "brand-blue" : ""}`} />
                  ))}
                </div>
              </div>
              <h4 className="element-title">{isAr ? "مصفوفة البيانات والتقنية" : "Inspired by Data & Molecules"}</h4>
              <p className="element-desc">{isAr ? "نقاط متراصة ومترابطة تعبر عن رقمنة البيانات المناخية، وتحليل الانبعاثات بالذكاء الاصطناعي." : "Structured dot grid representing climate digitization, satellite telemetry, and AI modeling."}</p>
            </div>

            <div className="element-card card text-center">
              <div className="element-visual-box button-styles-box">
                <div className="btn-specimen-stack">
                  <span className="btn-brand-pill-sample">KEEP GOING</span>
                  <span className="btn-brand-outline-sample">LEARN MORE →</span>
                </div>
              </div>
              <h4 className="element-title">{isAr ? "نمط الأزرار الرسمية" : "Official Button Styling"}</h4>
              <p className="element-desc">{isAr ? "تصميم الحبوب الانسيابية (Pill Shape) بتدرج العلامة التجارية أو الإطار النظيف." : "Signature pill-shaped CTA buttons styled with curated brand gradients and minimal outlines."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Logo Variations & Download Hub — مركز التحميل ── */}
      <section className="brand-downloads-section section bg-gradient-brand-soft" id="downloads">
        <div className="container">
          <div className="text-center mb-6">
            <span className="eyebrow">
              <Download size={16} />
              {isAr ? "حزمة التحميل الرسمية" : "Download Hub"}
            </span>
            <h2 className="section-title">
              {isAr ? "تحميل أصول وشعارات كلايمتيفاي" : "Download Climatify Logo & Assets"}
            </h2>
            <p className="section-lead mx-auto">
              {isAr
                ? "أصول رقمية رسمية بصيغ متعددة (PNG شفاف عالي الدقة وWebP خفيف الوزن) للاستخدام في النشر والمؤتمرات والشراكات."
                : "High-resolution transparent assets ready for media publications, sponsor decks, banners, and partner materials."}
            </p>
          </div>

          <div className="logo-assets-grid">
            {LOGO_ASSETS.map((asset) => (
              <div key={asset.id} className="logo-asset-card card">
                <div className={`logo-asset-thumb-wrapper ${asset.darkBg ? "thumb-dark" : "thumb-light"}`}>
                  <img
                    src={asset.previewUrl}
                    alt={isAr ? asset.titleAr : asset.titleEn}
                    className="logo-asset-thumb-img"
                    loading="lazy"
                  />
                  {asset.darkBg && (
                    <span className="dark-mode-pill">{isAr ? "للخلفيات الداكنة" : "Dark Mode"}</span>
                  )}
                </div>

                <div className="logo-asset-content">
                  <h4 className="logo-asset-title">{isAr ? asset.titleAr : asset.titleEn}</h4>
                  <p className="logo-asset-desc">{isAr ? asset.descAr : asset.descEn}</p>

                  <div className="logo-asset-actions">
                    <a
                      href={asset.pngUrl}
                      download
                      className="btn btn-sm btn-outline download-asset-btn"
                    >
                      <Download size={14} />
                      <span>PNG (شفاف)</span>
                    </a>
                    <a
                      href={asset.webpUrl}
                      download
                      className="btn btn-sm btn-ghost download-asset-btn"
                    >
                      <Download size={14} />
                      <span>WebP</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Guidelines Document Card Banner */}
          <div className="brand-guidelines-banner card mt-6">
            <div className="banner-visual-col">
              <img
                src="/brand/climatify-brand-guidelines.webp"
                alt="Climatify Brand Guidelines"
                className="banner-guide-preview-img"
              />
            </div>
            <div className="banner-text-col">
              <span className="eyebrow">{isAr ? "الدليل المعتمد الكامل" : "Official Guide Sheet"}</span>
              <h3 className="banner-title">
                {isAr ? "لوحة إرشادات الهوية الرسمية الكاملة" : "Complete Climatify Brand Style Guide"}
              </h3>
              <p className="banner-desc">
                {isAr
                  ? "تتضمن اللوحة الأصلية كافة قواعد الهوية، تدرجات الألوان، أنماط الخطوط، وتطبيقات الشعار في ملف واحد متكامل جاهز للطباعة والاستخدام."
                  : "Includes full typography rules, color breakdowns, icon motifs, and lockup specifications in an all-in-one high-resolution board."}
              </p>
              <div className="banner-actions">
                <a
                  href="/brand/climatify-brand-guidelines.png"
                  download="Climatify-Full-Brand-Guide.png"
                  className="btn btn-primary"
                >
                  <Download size={18} />
                  <span>{isAr ? "تحميل اللوحة بدقة فائقة (PNG)" : "Download High-Res Board (PNG)"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Do's & Don'ts — إرشادات الاستخدام ── */}
      <section className="brand-rules-section section">
        <div className="container">
          <div className="text-center mb-6">
            <span className="eyebrow">
              <ShieldCheck size={16} />
              {isAr ? "قواعد الاستخدام" : "Brand Integrity"}
            </span>
            <h2 className="section-title">
              {isAr ? "إرشادات حماية وتطبيق الهوية" : "Brand Usage Guidelines"}
            </h2>
          </div>

          <div className="rules-grid">
            <div className="rule-card do-card card">
              <div className="rule-badge do">✓ {isAr ? "ما يُسمح به" : "Do's"}</div>
              <ul className="rule-list">
                <li>{isAr ? "استخدام الشعار الرسمي بدون أي تعديل على تدرجات الألوان." : "Use official vector or high-resolution PNG assets only."}</li>
                <li>{isAr ? "الحفاظ على مساحة أمان محيطة بالشعار في كافة التطبيقات." : "Maintain clear breathing space around all sides of the logo."}</li>
                <li>{isAr ? "استخدام الشعار المعكوس (الأبيض) فوق الخلفيات الداكنة أو الملونة." : "Use the white inverted lockup on dark navy or saturated backdrops."}</li>
                <li>{isAr ? "الحفاظ على توازن الشعار وتطبيقه بالخطوط المعتمدة حصراً." : "Adhere strictly to Satoshi & F37 Wicklow/Tajawal typography."}</li>
              </ul>
            </div>

            <div className="rule-card dont-card card">
              <div className="rule-badge dont">✕ {isAr ? "المحظورات" : "Don'ts"}</div>
              <ul className="rule-list">
                <li>{isAr ? "لا تقم بتغيير اتجاه السهم الداخلي أو تدوير الأيقونة." : "Do not rotate, slant, or alter the inward direction of the arrow."}</li>
                <li>{isAr ? "لا تقم بتغيير ألوان التدرج (الأخضر بالأعلى والأزرق بالأسفل)." : "Do not invert or swap the gradient direction of the mark."}</li>
                <li>{isAr ? "لا تضع الشعار الداكن فوق خلفيات مظلمة أو مشتتة بصرياً." : "Do not place the dark wordmark over dark, noisy backgrounds."}</li>
                <li>{isAr ? "لا تقم بضغط أو مط الشعار أو تشويه نسب أبعاده الهندسية." : "Do not stretch, distort, or compress the emblem proportions."}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
