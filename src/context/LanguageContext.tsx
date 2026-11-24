import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "ar";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    home: "Home",
    portfolio: "Portfolio",
    about: "About",
    programs: "Programs",
    initiatives: "Initiatives",
    events: "Events",
    learningHub: "Academy",
    gamesHub: "Games Hub",
    community: "Community",
    opportunities: "Careers",
    contact: "Contact",
    media: "Media",
    portals: "Partners",
    brand: "Brand",
    login: "Login",
    register: "Register",
    dashboard: "Dashboard",
    adminDashboard: "Admin CMS",
    joinMovement: "Join Movement",

    // General text
    keepGoing: "Keep Going",
    learnMore: "Learn More",
    forBetterFuture: "For a Better Future",
    heroTitlePart1: "From youth to youth,",
    heroTitlePart2: "we unite efforts and create solutions",
    heroTitlePart3: "and move toward a more sustainable future.",
    heroSub: "Climatify is a UAE-based startup that unites climate digitization with the empowerment of local, regional, and international communities — turning awareness into real impact.",

    // Impact (verified organizational figures)
    impactYouthValue: "30,000+",
    impactYouthLabel: "Youth reached",
    impactEmpoweredValue: "1,500+",
    impactEmpoweredLabel: "People empowered across the region",
    impactOpportunitiesValue: "200+",
    impactOpportunitiesLabel: "Volunteering & training opportunities provided",

    // Mission Page
    missionTitle: "What is Climatify?",
    missionText1: "Climatify is a UAE-based social enterprise working across two core pillars: Climate Education and Climate Digitalization, with a focus on strengthening the climate action ecosystem at local, regional, and global levels.",
    missionText2: "",
    vision: "Vision",
    visionText: "Unifying global climate-action efforts through climate digitization, and empowering youth to participate actively in shaping sustainable solutions around the world.",
    mission: "Mission",
    missionText: "Merging climate digitization with community empowerment, environmental awareness, and sustainable development through technology and effective participation — building a harmonious, sustainable future.",
    focusAreas: "Focus Areas",
    focusAreasText: "Digitization & digital transformation, environmental awareness, youth and women empowerment, interactive workshops and camps, educational programs + Environmental Dimensions.",
    shiftInvests: "Shift Invests",
    shiftInvestsDesc: "Investment initiative empowering youth-led green startups and emerging climate innovations.",

    // Footer
    footerTagline: "Bridging Borders, Cultures, and Generations through Climate Solutions.",
    newsletterTitle: "Ready to be a Climatifier?",
    newsletterSub: "Join our movement and make a difference for our planet.",
    emailPlaceholder: "Email Address",
    subscribe: "Subscribe",
    services: "Services",
    // السنة تُحسب في الـ Footer وقت العرض — لا تُكتب هنا وإلا تجمّدت.
    copyright: "Climatify. All rights reserved.",
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    portfolio: "البورتفوليو",
    about: "من نحن",
    programs: "البرامج",
    initiatives: "المبادرات",
    events: "الفعاليات",
    learningHub: "الأكاديمية",
    gamesHub: "ألعاب المناخ",
    community: "المجتمع",
    opportunities: "الفرص والوظائف",
    contact: "اتصل بنا",
    media: "المركز الإعلامي",
    portals: "الشركاء",
    brand: "الهوية البصرية",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    dashboard: "لوحة التحكم",
    adminDashboard: "إدارة المحتوى",
    joinMovement: "انضم إلينا",

    // General text
    keepGoing: "انطلق معنا",
    learnMore: "تعرّف على كلايمتيفاي",
    forBetterFuture: "نحو مستقبل أكثر استدامة",
    heroTitlePart1: "من الشباب وإلى الشباب،",
    heroTitlePart2: "نوحّد الطاقات ونبتكر الحلول المستدامة",
    heroTitlePart3: "لنصنع معاً مستقبلاً أكثر استدامة وازدهاراً.",
    heroSub: "كلايمتيفاي شركة إماراتية ناشئة تجمع بين الرقمنة والابتكار المناخي وتمكين المجتمعات محلياً وإقليمياً ودولياً — محوّلةً الوعي البيئي إلى أثر عملي ملموس.",

    // Impact (أرقام الأثر المعتمدة)
    impactYouthValue: "+30,000",
    impactYouthLabel: "شاب وشابة شملتهم مبادراتنا وبرامجنا",
    impactEmpoweredValue: "+1,500",
    impactEmpoweredLabel: "مشارك تم صقل وبناء قدراتهم القيادية",
    impactOpportunitiesValue: "+200",
    impactOpportunitiesLabel: "فرصة تدريب وتطوع نوعية تم إتاحتها",

    // Mission Page
    missionTitle: "ما هي كلايمتيفاي؟",
    missionText1: "كليماتيفاي (Climatify) شركة ذات تأثير اجتماعي مقرها دولة الإمارات العربية المتحدة، تعمل من خلال محورين رئيسيين: التعليم المناخي والرقمنة المناخية، عبر تطوير برامج تعليمية وتدريبية مبتكرة ومشروعات رقمية تهدف إلى تعزيز المشاركة في العمل المناخي، وبناء القدرات، والمساهمة في تطوير منظومة العمل المناخي على المستويات المحلية والإقليمية والعالمية.",
    missionText2: "",
    vision: "الرؤية",
    visionText: "توحيد جهود العمل المناخي عالمياً عبر الرقمنة والحلول الذكية، وتمكين الشباب من القيادة الفاعلة وصياغة حلول بيئية مستدامة حول العالم.",
    mission: "الرسالة",
    missionText: "تسخير التقنيات الرقمية المبتكرة لتمكين المجتمعات، وتعزيز الوعي البيئي، ودفع عجلة التنمية المستدامة بروح المسؤولية والعمل المشترك.",
    focusAreas: "مجالات التركيز",
    focusAreasText: "الرقمنة والتحول المناخي الذكي، التوعية والتثقيف البيئي، تمكين الشباب والنساء، الورش والمعسكرات التفاعلية، والبرامج التعليمية التخصصية في الاستدامة.",
    shiftInvests: "Shift Invests",
    shiftInvestsDesc: "مبادرة استثمارية استراتيجية لتسريع نمو الشركات الخضراء الناشئة وتمكين الابتكارات المناخية الشبابية.",

    // Footer
    footerTagline: "نوحّد الثقافات والأجيال ونتجاوز الحدود عبر ابتكارات وحلول العمل المناخي.",
    newsletterTitle: "كن شريكاً في صناعة الأثر الأخضر",
    newsletterSub: "انضم إلى حراك كلايمتيفاي وكن في طليعة المدافعين عن مستقبل كوكبنا.",
    emailPlaceholder: "أدخل بريدك الإلكتروني",
    subscribe: "اشترك الآن",
    services: "خدماتنا",
    // السنة تُحسب في الـ Footer وقت العرض — لا تُكتب هنا وإلا تجمّدت.
    copyright: "كلايمتيفاي. جميع الحقوق محفوظة.",
  }
};

const STORAGE_KEY = "climatify-lang";

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

/**
 * قراءة آمنة: الوصول إلى localStorage يرمي استثناءً في وضع Safari الخاص
 * وعند حجب التخزين، وكانت القراءة هنا تحدث في مرحلة الرسم فتُسقط التطبيق كله.
 */
const readStoredLanguage = (): Language => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ar") return saved;
  } catch {
    /* التخزين محجوب — نكمل بالافتراضي */
  }
  return "ar"; // Default to Arabic as requested by client dialect & region
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(readStoredLanguage);

  useEffect(() => {
    // index.html يضع lang/dir قبل أول رسم؛ هذا يحافظ عليهما بعد كل تبديل.
    const root = document.documentElement;
    root.setAttribute("lang", language);
    root.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* الكتابة محجوبة — الاختيار يبقى لهذه الجلسة فقط */
    }
  }, [language]);

  // ثابت الهوية طالما لم تتغيّر اللغة، حتى لا يعيد كل مستهلك الرسم بلا داعٍ.
  const t = useCallback(
    (key: string): string => translations[language][key] ?? translations.en[key] ?? key,
    [language]
  );

  const value = useMemo<LanguageContextProps>(
    () => ({ language, setLanguage, t }),
    [language, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
