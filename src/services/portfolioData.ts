// Climatify Official Portfolio Showcase Dataset 2025
// Extracted and structured directly from Climatify_information_Tech Portfolio2025.pdf
// 53 Complete Slides with verified links, bilingual metadata, and action buttons.

export type ProjectAction = {
  id: string;
  labelEn: string;
  labelAr: string;
  href: string;
  type: "internal" | "external";
  variant?: "primary" | "secondary" | "ghost";
};

export type ShowcaseProject = {
  id: string;
  pageNumber: number;
  titleEn: string;
  titleAr: string;
  subtitleEn?: string;
  subtitleAr?: string;
  descriptionEn: string;
  descriptionAr: string;
  categoryEn: string;
  categoryAr: string;
  categoryKey: "all" | "digitization" | "empowerment" | "workshops" | "hackathons" | "events" | "impact";
  image: string;
  thumbnail: string;
  altEn: string;
  altAr: string;
  actions?: ProjectAction[];
};

export const PORTFOLIO_CATEGORIES = [
  { key: "all", labelEn: "All Slides", labelAr: "جميع الشرائح" },
  { key: "digitization", labelEn: "Climate Digitization", labelAr: "الرقمنة المناخية" },
  { key: "empowerment", labelEn: "Youth & Women Empowerment", labelAr: "تمكين الشباب والمرأة" },
  { key: "workshops", labelEn: "Workshops & Camps", labelAr: "ورش العمل والمعسكرات" },
  { key: "hackathons", labelEn: "Hackathons & Innovation", labelAr: "الهاكاثونات والابتكار" },
  { key: "events", labelEn: "Conferences & Events", labelAr: "المؤتمرات والفعاليات" },
  { key: "impact", labelEn: "Impact & Leadership", labelAr: "الأثر وفريق القيادة" },
] as const;

export const portfolioProjects: ShowcaseProject[] = [
  {
    id: "portfolio-slide-01",
    pageNumber: 1,
    titleEn: "Climatify — Unite. Innovate. Act.",
    titleAr: "كلايمتيفاي — اتحد، ابتكر، تحرك",
    subtitleEn: "UNITE. INNOVATE. ACT. TOGETHER, WE CAN TURN THE CLIMATE CRISIS INTO CLIMATE SOLUTIONS.",
    subtitleAr: "",
    descriptionEn: "Together, we can turn the climate crisis into climate solutions. The official 2025 company profile and technology portfolio.",
    descriptionAr: "معاً نحو تحويل الأزمة المناخية إلى حلول وفرص مستدامة. الملف المؤسسي والبورتفوليو الرقمي المعتمد لعام 2025.",
    categoryEn: "Corporate Overview",
    categoryAr: "نظرة عامة على المؤسسة",
    categoryKey: "impact",
    image: "/portfolio/page-01.webp",
    thumbnail: "/portfolio/thumb-01.webp",
    altEn: "Climatify Portfolio 2025 - Slide 01: Climatify — Unite. Innovate. Act.",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 01: كلايمتيفاي — اتحد، ابتكر، تحرك",
    actions: []
  },
  {
    id: "portfolio-slide-02",
    pageNumber: 2,
    titleEn: "From Youth to Youth",
    titleAr: "من الشباب إلى الشباب",
    subtitleEn: "FROM YOUTH TO",
    subtitleAr: "",
    descriptionEn: "Climatify's youth-led movement empowering emerging generations across the MENA region and the UAE.",
    descriptionAr: "حراك يقوده الشباب لتمكين الأجيال الناشئة في دولة الإمارات والشرق الأوسط وشمال أفريقيا.",
    categoryEn: "Corporate Identity",
    categoryAr: "الهوية المؤسسية",
    categoryKey: "impact",
    image: "/portfolio/page-02.webp",
    thumbnail: "/portfolio/thumb-02.webp",
    altEn: "Climatify Portfolio 2025 - Slide 02: From Youth to Youth",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 02: من الشباب إلى الشباب",
    actions: []
  },
  {
    id: "portfolio-slide-03",
    pageNumber: 3,
    titleEn: "About Climatify",
    titleAr: "نبذة عن كلايمتيفاي",
    subtitleEn: "Climatify is a UAE startup company that combines climate",
    subtitleAr: "",
    descriptionEn: "Climatify is a UAE startup company that combines climate digitization with the development of local, regional, and international communities.",
    descriptionAr: "كلايمتيفاي شركة إماراتية ناشئة تدمج الرقمنة المناخية بتمكين وتطوير المجتمعات المحلية والإقليمية والدولية.",
    categoryEn: "About Climatify",
    categoryAr: "عن كلايمتيفاي",
    categoryKey: "impact",
    image: "/portfolio/page-03.webp",
    thumbnail: "/portfolio/thumb-03.webp",
    altEn: "Climatify Portfolio 2025 - Slide 03: About Climatify",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 03: نبذة عن كلايمتيفاي",
    actions: []
  },
  {
    id: "portfolio-slide-04",
    pageNumber: 4,
    titleEn: "Our Vision",
    titleAr: "رؤيتنا الاستراتيجية",
    subtitleEn: "Climatify envisions uniting global climate action efforts",
    subtitleAr: "",
    descriptionEn: "Uniting global climate action efforts through climate digitization, empowering youth to actively shape sustainable solutions worldwide.",
    descriptionAr: "توحيد جهود العمل المناخي العالمية عبر الرقمنة البيئية، وتمكين الشباب من صياغة حلول مستدامة حول العالم.",
    categoryEn: "Strategic Vision",
    categoryAr: "الرؤية الاستراتيجية",
    categoryKey: "impact",
    image: "/portfolio/page-04.webp",
    thumbnail: "/portfolio/thumb-04.webp",
    altEn: "Climatify Portfolio 2025 - Slide 04: Our Vision",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 04: رؤيتنا الاستراتيجية",
    actions: []
  },
  {
    id: "portfolio-slide-05",
    pageNumber: 5,
    titleEn: "Our Mission",
    titleAr: "رسالتنا المؤسسية",
    subtitleEn: "Climatify merges climate digitization with community",
    subtitleAr: "",
    descriptionEn: "Merging climate digitization with community empowerment, fostering environmental awareness and sustainable development through technology.",
    descriptionAr: "دمج الرقمنة المناخية بالتمكين المجتمعي، ونشر الوعي البيئي والتنمية المستدامة عبر التكنولوجيا والمشاركة الفعالة.",
    categoryEn: "Our Mission",
    categoryAr: "رسالتنا",
    categoryKey: "impact",
    image: "/portfolio/page-05.webp",
    thumbnail: "/portfolio/thumb-05.webp",
    altEn: "Climatify Portfolio 2025 - Slide 05: Our Mission",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 05: رسالتنا المؤسسية",
    actions: []
  },
  {
    id: "portfolio-slide-06",
    pageNumber: 6,
    titleEn: "Digital Transformation & Focus Areas",
    titleAr: "التحول الرقمي ومجالات التركيز",
    subtitleEn: "TRANSFORMATION.",
    subtitleAr: "",
    descriptionEn: "Our pillars: Digital Transformation, Interactive Workshops & Camps, and Climate Innovation Acceleration.",
    descriptionAr: "محاورنا الأساسية: التحول الرقمي، الورش التفاعلية والمعسكرات، وتسريع الابتكارات المناخية.",
    categoryEn: "Focus Areas",
    categoryAr: "مجالات التركيز",
    categoryKey: "digitization",
    image: "/portfolio/page-06.webp",
    thumbnail: "/portfolio/thumb-06.webp",
    altEn: "Climatify Portfolio 2025 - Slide 06: Digital Transformation & Focus Areas",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 06: التحول الرقمي ومجالات التركيز",
    actions: []
  },
  {
    id: "portfolio-slide-07",
    pageNumber: 7,
    titleEn: "Climatify Brand & Presence",
    titleAr: "علامة وحضور كلايمتيفاي",
    subtitleEn: "",
    subtitleAr: "",
    descriptionEn: "Official identity, visual ecosystem, and strategic positioning in global climate digitalization.",
    descriptionAr: "الهوية الرسمية والمنظومة البصرية والتموضع الاستراتيجي في الرقمنة المناخية العالمية.",
    categoryEn: "Brand & Visuals",
    categoryAr: "العلامة البصرية",
    categoryKey: "impact",
    image: "/portfolio/page-07.webp",
    thumbnail: "/portfolio/thumb-07.webp",
    altEn: "Climatify Portfolio 2025 - Slide 07: Climatify Brand & Presence",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 07: علامة وحضور كلايمتيفاي",
    actions: []
  },
  {
    id: "portfolio-slide-08",
    pageNumber: 8,
    titleEn: "Digital Projects 2023 - 2026",
    titleAr: "المشاريع والمنصات الرقمية 2023 - 2026",
    subtitleEn: "2023 - 2026",
    subtitleAr: "",
    descriptionEn: "Climatify Information Technology LLC portfolio of innovative digital climate solutions.",
    descriptionAr: "محفظة شركة كلايمتيفاي لتقنية المعلومات من الحلول الرقمية والمنصات المناخية المبتكرة.",
    categoryEn: "Digital Projects",
    categoryAr: "المشاريع الرقمية",
    categoryKey: "digitization",
    image: "/portfolio/page-08.webp",
    thumbnail: "/portfolio/thumb-08.webp",
    altEn: "Climatify Portfolio 2025 - Slide 08: Digital Projects 2023 - 2026",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 08: المشاريع والمنصات الرقمية 2023 - 2026",
    actions: []
  },
  {
    id: "portfolio-slide-09",
    pageNumber: 9,
    titleEn: "Climatify App — Arab Climate Action Platform",
    titleAr: "تطبيق كلايمتيفاي — منصة العمل المناخي العربي",
    subtitleEn: "CLIMATIFT APP",
    subtitleAr: "",
    descriptionEn: "The first global digital youth platform in climate action that contributes to uniting regional efforts under one umbrella.",
    descriptionAr: "أول منصة رقمية شبابية عالمية في العمل المناخي تسهم في توحيد الجهود الإقليمية تحت مظلة واحدة متكاملة.",
    categoryEn: "Climate Digitization",
    categoryAr: "الرقمنة المناخية",
    categoryKey: "digitization",
    image: "/portfolio/page-09.webp",
    thumbnail: "/portfolio/thumb-09.webp",
    altEn: "Climatify Portfolio 2025 - Slide 09: Climatify App — Arab Climate Action Platform",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 09: تطبيق كلايمتيفاي — منصة العمل المناخي العربي",
    actions: [
      {
            "id": "canva-9",
            "labelEn": "Interactive Presentation (Canva)",
            "labelAr": "العرض التقديمي التفاعلي (Canva)",
            "href": "https://www.canva.com/design/DAGJHz-6mgs/JVe8q1LZnT9wdHRcuNrspA/edit?utm_content=DAGJHz-6mgs&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
            "type": "external",
            "variant": "primary"
      },
      {
            "id": "pdf-9",
            "labelEn": "Official Report (PDF)",
            "labelAr": "التقرير الرسمي (PDF)",
            "href": "https://acrobat.adobe.com/id/urn:aaid:sc:eu:b2230cef-d31b-432e-a09e-b7c79cf9a8e1",
            "type": "external",
            "variant": "secondary"
      },
      {
            "id": "web-9",
            "labelEn": "Visit Arab Climate Platform",
            "labelAr": "زيارة منصة العمل المناخي العربي",
            "href": "https://arabclimateaction.com/",
            "type": "external",
            "variant": "primary"
      }
]
  },
  {
    id: "portfolio-slide-10",
    pageNumber: 10,
    titleEn: "Climatify App — Arab Climate Action Platform",
    titleAr: "تطبيق كلايمتيفاي — منصة العمل المناخي العربي",
    subtitleEn: "CLIMATIFT APP",
    subtitleAr: "",
    descriptionEn: "The first global digital youth platform in climate action that contributes to uniting regional efforts under one umbrella.",
    descriptionAr: "أول منصة رقمية شبابية عالمية في العمل المناخي تسهم في توحيد الجهود الإقليمية تحت مظلة واحدة متكاملة.",
    categoryEn: "Climate Digitization",
    categoryAr: "الرقمنة المناخية",
    categoryKey: "digitization",
    image: "/portfolio/page-10.webp",
    thumbnail: "/portfolio/thumb-10.webp",
    altEn: "Climatify Portfolio 2025 - Slide 10: Climatify App — Arab Climate Action Platform",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 10: تطبيق كلايمتيفاي — منصة العمل المناخي العربي",
    actions: [
      {
            "id": "canva-10",
            "labelEn": "Interactive Presentation (Canva)",
            "labelAr": "العرض التقديمي التفاعلي (Canva)",
            "href": "https://www.canva.com/design/DAGJHz-6mgs/JVe8q1LZnT9wdHRcuNrspA/edit?utm_content=DAGJHz-6mgs&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
            "type": "external",
            "variant": "primary"
      }
]
  },
  {
    id: "portfolio-slide-11",
    pageNumber: 11,
    titleEn: "Workshops Portfolio & Proposal",
    titleAr: "ملف ومقترحات ورش العمل التفاعلية",
    subtitleEn: "SCAN THIS",
    subtitleAr: "",
    descriptionEn: "Interactive climate literacy, waste management, and sustainable innovation workshops designed for schools and universities.",
    descriptionAr: "ورش عمل تفاعلية في التثقيف المناخي وإدارة النفايات والابتكار المستدام للمدارس والجامعات.",
    categoryEn: "Workshops & Capacity",
    categoryAr: "ورش العمل وبناء القدرات",
    categoryKey: "workshops",
    image: "/portfolio/page-11.webp",
    thumbnail: "/portfolio/thumb-11.webp",
    altEn: "Climatify Portfolio 2025 - Slide 11: Workshops Portfolio & Proposal",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 11: ملف ومقترحات ورش العمل التفاعلية",
    actions: []
  },
  {
    id: "portfolio-slide-12",
    pageNumber: 12,
    titleEn: "AgriClash Simulation Game Brochure",
    titleAr: "بروشور لعبة محاكاة AgriClash",
    subtitleEn: "SCAN THIS",
    subtitleAr: "",
    descriptionEn: "Strategic educational board and simulation game for sustainable agriculture and water resource governance.",
    descriptionAr: "لعبة محاكاة تعليمية واستراتيجية لإدارة الموارد المائية ومجابهة التحديات المناخية الزراعية.",
    categoryEn: "Environmental Games",
    categoryAr: "الألعاب البيئية",
    categoryKey: "hackathons",
    image: "/portfolio/page-12.webp",
    thumbnail: "/portfolio/thumb-12.webp",
    altEn: "Climatify Portfolio 2025 - Slide 12: AgriClash Simulation Game Brochure",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 12: بروشور لعبة محاكاة AgriClash",
    actions: [
      {
            "id": "internal-games-12",
            "labelEn": "Explore in Games Hub",
            "labelAr": "تجربة الألعاب في المنصة",
            "href": "/games",
            "type": "internal",
            "variant": "primary"
      }
]
  },
  {
    id: "portfolio-slide-13",
    pageNumber: 13,
    titleEn: "Green Sharks Challenge Brochure",
    titleAr: "بروشور تحدي Green Sharks للاستثمار الأخضر",
    subtitleEn: "SCAN THIS",
    subtitleAr: "",
    descriptionEn: "Interactive green pitch challenge connecting young eco-innovators with sustainability investors and mentors.",
    descriptionAr: "تحدي ومحاكاة الاستثمار الأخضر لربط المبتكرين الشباب بالمستثمرين والموجهين في الاستدامة.",
    categoryEn: "Green Entrepreneurship",
    categoryAr: "الريادة الخضراء",
    categoryKey: "hackathons",
    image: "/portfolio/page-13.webp",
    thumbnail: "/portfolio/thumb-13.webp",
    altEn: "Climatify Portfolio 2025 - Slide 13: Green Sharks Challenge Brochure",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 13: بروشور تحدي Green Sharks للاستثمار الأخضر",
    actions: [
      {
            "id": "internal-games-13",
            "labelEn": "Explore in Games Hub",
            "labelAr": "تجربة الألعاب في المنصة",
            "href": "/games",
            "type": "internal",
            "variant": "primary"
      }
]
  },
  {
    id: "portfolio-slide-14",
    pageNumber: 14,
    titleEn: "Little Green Heroes — Museum of the Future",
    titleAr: "أبطال البيئة الصغار — متحف المستقبل",
    subtitleEn: "Heroes Summer Camp, hosted by the Museum of the Future. The workshop focused on",
    subtitleAr: "",
    descriptionEn: "Waste management and recycling workshop engaging 50+ students at the Museum of the Future summer camp.",
    descriptionAr: "ورشة تفاعلية لإدارة النفايات وإعادة التدوير شملت 50+ طالباً ضمن معسكر متحف المستقبل الصيفي.",
    categoryEn: "Environmental Awareness",
    categoryAr: "التوعية البيئية",
    categoryKey: "workshops",
    image: "/portfolio/page-14.webp",
    thumbnail: "/portfolio/thumb-14.webp",
    altEn: "Climatify Portfolio 2025 - Slide 14: Little Green Heroes — Museum of the Future",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 14: أبطال البيئة الصغار — متحف المستقبل",
    actions: []
  },
  {
    id: "portfolio-slide-15",
    pageNumber: 15,
    titleEn: "Ramadan Akhdar Audio Campaign",
    titleAr: "حملة رمضان أخضر الصوتية",
    subtitleEn: "raise environmental awareness and enrich content on climate and sustainability issues",
    subtitleAr: "",
    descriptionEn: "An 8-episode Arabic podcast series promoting green economy, eco-feminism, and sustainable habits during Ramadan.",
    descriptionAr: "سلسلة بودكاست وتوعية صوتية من 8 حلقات حول الاقتصاد الأخضر والعادات المستدامة خلال شهر رمضان.",
    categoryEn: "Awareness Campaigns",
    categoryAr: "حملات التوعية",
    categoryKey: "empowerment",
    image: "/portfolio/page-15.webp",
    thumbnail: "/portfolio/thumb-15.webp",
    altEn: "Climatify Portfolio 2025 - Slide 15: Ramadan Akhdar Audio Campaign",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 15: حملة رمضان أخضر الصوتية",
    actions: [
      {
            "id": "drive-15",
            "labelEn": "Media & Project Files (Drive)",
            "labelAr": "وسائط وملفات المشروع (Drive)",
            "href": "https://drive.google.com/drive/folders/1vyjYNwHIIB4nOyJP8yt1xcP6tPYEztJ6?usp=sharing",
            "type": "external",
            "variant": "secondary"
      }
]
  },
  {
    id: "portfolio-slide-16",
    pageNumber: 16,
    titleEn: "Paving the Way to COP28 Campaign",
    titleAr: "حملة تمهيد الطريق نحو COP28",
    subtitleEn: "people in climate and environmental issues. in collaboration with Global Shapers Dubai.",
    subtitleAr: "",
    descriptionEn: "In collaboration with Global Shapers Dubai, engaging youth from the UAE, Egypt, Tunisia, Morocco, Yemen, and Lebanon.",
    descriptionAr: "بالتعاون مع جلوبال شيبرز دبي، لإشراك وتأهيل الشباب من الإمارات ومصر وتونس والمغرب واليمن ولبنان.",
    categoryEn: "COP28 Preparations",
    categoryAr: "فعاليات COP28",
    categoryKey: "events",
    image: "/portfolio/page-16.webp",
    thumbnail: "/portfolio/thumb-16.webp",
    altEn: "Climatify Portfolio 2025 - Slide 16: Paving the Way to COP28 Campaign",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 16: حملة تمهيد الطريق نحو COP28",
    actions: [
      {
            "id": "pdf-16",
            "labelEn": "Official Report (PDF)",
            "labelAr": "التقرير الرسمي (PDF)",
            "href": "https://acrobat.adobe.com/id/urn:aaid:sc:EU:d573a2c3-b327-47f5-aff1-3012f41d98b2",
            "type": "external",
            "variant": "secondary"
      }
]
  },
  {
    id: "portfolio-slide-17",
    pageNumber: 17,
    titleEn: "Climatify University Clubs & EYWAN Network",
    titleAr: "أندية كلايمتيفاي الجامعية وشبكة إيوان الزراعية",
    subtitleEn: "Climatify University Clubs",
    subtitleAr: "",
    descriptionEn: "Empowering university students and women in agriculture through institutional clubs and knowledge exchange.",
    descriptionAr: "تمكين طلبة الجامعات ورائدات الزراعة عبر شبكة الأندية المؤسسية ونقل الخبرات.",
    categoryEn: "Youth & Women Empowerment",
    categoryAr: "تمكين الشباب والمرأة",
    categoryKey: "empowerment",
    image: "/portfolio/page-17.webp",
    thumbnail: "/portfolio/thumb-17.webp",
    altEn: "Climatify Portfolio 2025 - Slide 17: Climatify University Clubs & EYWAN Network",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 17: أندية كلايمتيفاي الجامعية وشبكة إيوان الزراعية",
    actions: [
      {
            "id": "pdf-17",
            "labelEn": "Official Report (PDF)",
            "labelAr": "التقرير الرسمي (PDF)",
            "href": "https://acrobat.adobe.com/id/urn:aaid:sc:eu:7be5cb69-6a0b-42b9-ae2a-6588ab5acaa6",
            "type": "external",
            "variant": "secondary"
      },
      {
            "id": "drive-17",
            "labelEn": "Media & Project Files (Drive)",
            "labelAr": "وسائط وملفات المشروع (Drive)",
            "href": "https://drive.google.com/file/d/10UFTf4iagIIBZQnFQwiPl2_QbIHQmN1F/view?usp=sharing",
            "type": "external",
            "variant": "secondary"
      },
      {
            "id": "internal-prog-17",
            "labelEn": "View in Programs",
            "labelAr": "استكشف في صفحة البرامج",
            "href": "/programs",
            "type": "internal",
            "variant": "secondary"
      }
]
  },
  {
    id: "portfolio-slide-18",
    pageNumber: 18,
    titleEn: "Transforming Narratives Climate Camp — Fayoum",
    titleAr: "معسكر إعادة تشكيل الخطاب المناخي — الفيوم",
    subtitleEn: "We proudly to be partner in the “Transforming Narratives on Climate Action” youth camp held in Fayoum,",
    subtitleAr: "",
    descriptionEn: "Training 20 youth workers on climate justice, science, and constructive dialogue in Fayoum, Egypt.",
    descriptionAr: "تدريب 20 عاملاً في القطاع الشبابي على العدالة المناخية والحوار البنّاء بالفيوم.",
    categoryEn: "Youth Camps",
    categoryAr: "معسكرات الشباب",
    categoryKey: "workshops",
    image: "/portfolio/page-18.webp",
    thumbnail: "/portfolio/thumb-18.webp",
    altEn: "Climatify Portfolio 2025 - Slide 18: Transforming Narratives Climate Camp — Fayoum",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 18: معسكر إعادة تشكيل الخطاب المناخي — الفيوم",
    actions: [
      {
            "id": "ig-18",
            "labelEn": "View Highlights on Instagram",
            "labelAr": "مشاهدة التغطية على إنستغرام",
            "href": "https://www.instagram.com/p/DKwkQCotCJK/?img_index=8&igsh=MWx6ZWJ1dml6bWdveA==",
            "type": "external",
            "variant": "secondary"
      }
]
  },
  {
    id: "portfolio-slide-19",
    pageNumber: 19,
    titleEn: "Wavemakers Summer Students Camp — Hurghada",
    titleAr: "معسكر Wavemakers الصيفي للناشئة — الغردقة",
    subtitleEn: "The Wavemakers Summer Students Camp, held in collaboration with Wavemakers United, was designed to",
    subtitleAr: "",
    descriptionEn: "3-day virtual bootcamp + 7-day marine field training in Hurghada on water security and clean energy.",
    descriptionAr: "3 أيام تدريب افتراضي و7 أيام تدريب ميداني بحري بالغردقة حول أمن المياه والطاقة النظيفة.",
    categoryEn: "Field Camps",
    categoryAr: "المعسكرات الميدانية",
    categoryKey: "workshops",
    image: "/portfolio/page-19.webp",
    thumbnail: "/portfolio/thumb-19.webp",
    altEn: "Climatify Portfolio 2025 - Slide 19: Wavemakers Summer Students Camp — Hurghada",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 19: معسكر Wavemakers الصيفي للناشئة — الغردقة",
    actions: [
      {
            "id": "drive-19",
            "labelEn": "Media & Project Files (Drive)",
            "labelAr": "وسائط وملفات المشروع (Drive)",
            "href": "https://drive.google.com/file/d/1LRBmyKKZnCH2Th49oQjXE85SFijjPYYU/view?usp=drivesdk",
            "type": "external",
            "variant": "secondary"
      }
]
  },
  {
    id: "portfolio-slide-20",
    pageNumber: 20,
    titleEn: "SHIFT Internship & Capacity Building Program",
    titleAr: "برنامج SHIFT لبناء القدرات والتدريب المهني",
    subtitleEn: "INTERNSHIP",
    subtitleAr: "",
    descriptionEn: "A quarterly 3-month regional program accredited by the EU, covering climate action, water security, and space technology.",
    descriptionAr: "برنامج إقليمي فصلي لمدة 3 أشهر معتمد من الاتحاد الأوروبي، يغطي العمل المناخي وأمن المياه والفضاء.",
    categoryEn: "Flagship Program",
    categoryAr: "البرنامج الرائد",
    categoryKey: "empowerment",
    image: "/portfolio/page-20.webp",
    thumbnail: "/portfolio/thumb-20.webp",
    altEn: "Climatify Portfolio 2025 - Slide 20: SHIFT Internship & Capacity Building Program",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 20: برنامج SHIFT لبناء القدرات والتدريب المهني",
    actions: [
      {
            "id": "pdf-20",
            "labelEn": "Official Report (PDF)",
            "labelAr": "التقرير الرسمي (PDF)",
            "href": "https://acrobat.adobe.com/id/urn:aaid:sc:EU:a9632f47-907d-42d3-bc03-01173f32367b",
            "type": "external",
            "variant": "secondary"
      },
      {
            "id": "internal-prog-20",
            "labelEn": "View in Programs",
            "labelAr": "استكشف في صفحة البرامج",
            "href": "/programs",
            "type": "internal",
            "variant": "secondary"
      }
]
  },
  {
    id: "portfolio-slide-21",
    pageNumber: 21,
    titleEn: "Nawah Eco-Feminist Network",
    titleAr: "شبكة نواة للعدالة البيئية وتمكين المرأة",
    subtitleEn: "Climatify partnered with the Nawah Network in a strategic initiative to empower rural women in marginalized",
    subtitleAr: "",
    descriptionEn: "Directly empowering 50+ women and reaching 200+ participants across 5 Egyptian governorates in climate adaptation.",
    descriptionAr: "تمكين أكثر من 50 سيدة والوصول إلى 200+ مشارك عبر 5 محافظات مصرية في التكيف المناخي.",
    categoryEn: "Women Empowerment",
    categoryAr: "تمكين المرأة الريفية",
    categoryKey: "empowerment",
    image: "/portfolio/page-21.webp",
    thumbnail: "/portfolio/thumb-21.webp",
    altEn: "Climatify Portfolio 2025 - Slide 21: Nawah Eco-Feminist Network",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 21: شبكة نواة للعدالة البيئية وتمكين المرأة",
    actions: [
      {
            "id": "pdf-21",
            "labelEn": "Official Report (PDF)",
            "labelAr": "التقرير الرسمي (PDF)",
            "href": "https://acrobat.adobe.com/id/urn:aaid:sc:eu:ba0d8692-4714-4a14-8ddf-090cf4fc1d8c",
            "type": "external",
            "variant": "secondary"
      }
]
  },
  {
    id: "portfolio-slide-22",
    pageNumber: 22,
    titleEn: "Nawah Eco-Feminist Network",
    titleAr: "شبكة نواة للعدالة البيئية وتمكين المرأة",
    subtitleEn: "Nawah Eco- feminist  Network",
    subtitleAr: "",
    descriptionEn: "Directly empowering 50+ women and reaching 200+ participants across 5 Egyptian governorates in climate adaptation.",
    descriptionAr: "تمكين أكثر من 50 سيدة والوصول إلى 200+ مشارك عبر 5 محافظات مصرية في التكيف المناخي.",
    categoryEn: "Women Empowerment",
    categoryAr: "تمكين المرأة الريفية",
    categoryKey: "empowerment",
    image: "/portfolio/page-22.webp",
    thumbnail: "/portfolio/thumb-22.webp",
    altEn: "Climatify Portfolio 2025 - Slide 22: Nawah Eco-Feminist Network",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 22: شبكة نواة للعدالة البيئية وتمكين المرأة",
    actions: []
  },
  {
    id: "portfolio-slide-23",
    pageNumber: 23,
    titleEn: "Climate Action & Disaster Risk Reduction Fellowship (CADRR)",
    titleAr: "زمالة العمل المناخي والحد من مخاطر الكوارث",
    subtitleEn: "Fellowship, a regional initiative led by Climatic Peace in partnership with TISLAB and under the",
    subtitleAr: "",
    descriptionEn: "12-week hybrid regional fellowship engaging 150–200 young leaders under the Egyptian Ministry of Youth & Sports.",
    descriptionAr: "زمالة إقليمية مدمجة تمتد لـ 12 أسبوعاً تستهدف 150-200 قيادي شاب تحت رعاية وزارة الشباب والرياضة.",
    categoryEn: "Fellowships",
    categoryAr: "الزمالات الإقليمية",
    categoryKey: "empowerment",
    image: "/portfolio/page-23.webp",
    thumbnail: "/portfolio/thumb-23.webp",
    altEn: "Climatify Portfolio 2025 - Slide 23: Climate Action & Disaster Risk Reduction Fellowship (CADRR)",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 23: زمالة العمل المناخي والحد من مخاطر الكوارث",
    actions: [
      {
            "id": "pdf-23",
            "labelEn": "Official Report (PDF)",
            "labelAr": "التقرير الرسمي (PDF)",
            "href": "https://acrobat.adobe.com/id/urn:aaid:sc:EU:420d5015-c49d-49b1-a677-d57f82ab8425",
            "type": "external",
            "variant": "secondary"
      }
]
  },
  {
    id: "portfolio-slide-24",
    pageNumber: 24,
    titleEn: "Green Echo Regional Hackathon",
    titleAr: "هاكاثون الصدى الأخضر الإقليمي",
    subtitleEn: "communities across the Middle East and North Africa (MENA), particularly those affected by",
    subtitleAr: "",
    descriptionEn: "160 project submissions across MENA focused on climate-smart agriculture and food security, alongside RCOY MENA 2024.",
    descriptionAr: "استقطب 160 مشروعاً ابتكارياً في الأمن الغذائي والزراعة الذكية بمشاركة شباب من كافة دول المنطقة.",
    categoryEn: "Regional Hackathons",
    categoryAr: "الهاكاثونات الإقليمية",
    categoryKey: "hackathons",
    image: "/portfolio/page-24.webp",
    thumbnail: "/portfolio/thumb-24.webp",
    altEn: "Climatify Portfolio 2025 - Slide 24: Green Echo Regional Hackathon",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 24: هاكاثون الصدى الأخضر الإقليمي",
    actions: [
      {
            "id": "pdf-24",
            "labelEn": "Official Report (PDF)",
            "labelAr": "التقرير الرسمي (PDF)",
            "href": "https://acrobat.adobe.com/id/urn:aaid:sc:EU:2dde33ce-f7b1-481b-b547-f4c18d6496bb",
            "type": "external",
            "variant": "secondary"
      }
]
  },
  {
    id: "portfolio-slide-25",
    pageNumber: 25,
    titleEn: "ICE 2024 International Climate Hackathon",
    titleAr: "هاكاثون ICE 2024 الدولي للاستدامة",
    subtitleEn: "collaboration aims to empower 1000 university students and recent graduates globally to develop and",
    subtitleAr: "",
    descriptionEn: "Partnering with ProjectSet to empower 1,000 university students globally in developing sustainable city solutions.",
    descriptionAr: "شراكة استدامة مع ProjectSet لتمكين 1,000 طالب جامعي حول العالم في تطوير حلول المدن المستدامة.",
    categoryEn: "International Hackathons",
    categoryAr: "الهاكاثونات الدولية",
    categoryKey: "hackathons",
    image: "/portfolio/page-25.webp",
    thumbnail: "/portfolio/thumb-25.webp",
    altEn: "Climatify Portfolio 2025 - Slide 25: ICE 2024 International Climate Hackathon",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 25: هاكاثون ICE 2024 الدولي للاستدامة",
    actions: []
  },
  {
    id: "portfolio-slide-26",
    pageNumber: 26,
    titleEn: "SHIFT: First Cohort Graduation Ceremony",
    titleAr: "حفل تخرج الدفعة الأولى من برنامج SHIFT",
    subtitleEn: "INTERNSHIP",
    subtitleAr: "",
    descriptionEn: "Celebrating 60 emerging climate leaders from 5 countries under the theme 'Empowerment Starts with Inspiration'.",
    descriptionAr: "تخريج 60 قائداً مناخياً ناشئاً من 5 دول تحت شعار «التمكين يبدأ بالإلهام» بحضور الشركاء الدوليين.",
    categoryEn: "Milestones & Ceremonies",
    categoryAr: "حفلات التخرج والإنجاز",
    categoryKey: "empowerment",
    image: "/portfolio/page-26.webp",
    thumbnail: "/portfolio/thumb-26.webp",
    altEn: "Climatify Portfolio 2025 - Slide 26: SHIFT: First Cohort Graduation Ceremony",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 26: حفل تخرج الدفعة الأولى من برنامج SHIFT",
    actions: [
      {
            "id": "canva-26",
            "labelEn": "Interactive Presentation (Canva)",
            "labelAr": "العرض التقديمي التفاعلي (Canva)",
            "href": "https://www.canva.com/design/DAG_vE1fQf8/UOpKQqHxfDV9kKHeEBIGXw/edit?utm_content=DAG_vE1fQf8&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
            "type": "external",
            "variant": "primary"
      },
      {
            "id": "internal-prog-26",
            "labelEn": "View in Programs",
            "labelAr": "استكشف في صفحة البرامج",
            "href": "/programs",
            "type": "internal",
            "variant": "secondary"
      }
]
  },
  {
    id: "portfolio-slide-27",
    pageNumber: 27,
    titleEn: "AgriClash Interactive Simulation Game",
    titleAr: "لعبة محاكاة AgriClash التفاعلية",
    subtitleEn: "2024 - 2025",
    subtitleAr: "",
    descriptionEn: "Developed under SHIFT, challenging Policy Makers and Engineers teams to manage resources and climate crises.",
    descriptionAr: "محاكاة واقعية طوّرتها كلايمتيفاي يتنافس فيها فريق صناع القرار والمهندسين لإدارة الموارد المائية.",
    categoryEn: "Educational Games",
    categoryAr: "الألعاب البيئية",
    categoryKey: "hackathons",
    image: "/portfolio/page-27.webp",
    thumbnail: "/portfolio/thumb-27.webp",
    altEn: "Climatify Portfolio 2025 - Slide 27: AgriClash Interactive Simulation Game",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 27: لعبة محاكاة AgriClash التفاعلية",
    actions: [
      {
            "id": "canva-27",
            "labelEn": "Interactive Presentation (Canva)",
            "labelAr": "العرض التقديمي التفاعلي (Canva)",
            "href": "https://www.canva.com/design/DAG_5VsTBlE/1BWV9-iHIpXIK25mMOmyiQ/edit?utm_content=DAG_5VsTBlE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
            "type": "external",
            "variant": "primary"
      },
      {
            "id": "internal-games-27",
            "labelEn": "Explore in Games Hub",
            "labelAr": "تجربة الألعاب في المنصة",
            "href": "/games",
            "type": "internal",
            "variant": "secondary"
      }
]
  },
  {
    id: "portfolio-slide-28",
    pageNumber: 28,
    titleEn: "Sustainable Universe Conference 2025 at UAEU",
    titleAr: "مؤتمر الكون المستدام 2025 في جامعة الإمارات",
    subtitleEn: "October | 2025",
    subtitleAr: "",
    descriptionEn: "Workshops in Self-Watering Planting and Trash to Art engaging students and faculty at UAEU.",
    descriptionAr: "تقديم ورش الزراعة ذاتية الري وتحويل المخلفات إلى فن لطلبة وأعضاء هيئة التدريس بجامعة الإمارات.",
    categoryEn: "University Summits",
    categoryAr: "المؤتمرات الجامعية",
    categoryKey: "events",
    image: "/portfolio/page-28.webp",
    thumbnail: "/portfolio/thumb-28.webp",
    altEn: "Climatify Portfolio 2025 - Slide 28: Sustainable Universe Conference 2025 at UAEU",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 28: مؤتمر الكون المستدام 2025 في جامعة الإمارات",
    actions: [
      {
            "id": "internal-event-28",
            "labelEn": "View in Events",
            "labelAr": "استكشف في صفحة الفعاليات",
            "href": "/events",
            "type": "internal",
            "variant": "primary"
      }
]
  },
  {
    id: "portfolio-slide-29",
    pageNumber: 29,
    titleEn: "Sustainable Universe Conference 2025 at UAEU",
    titleAr: "مؤتمر الكون المستدام 2025 في جامعة الإمارات",
    subtitleEn: "October | 2025",
    subtitleAr: "",
    descriptionEn: "Workshops in Self-Watering Planting and Trash to Art engaging students and faculty at UAEU.",
    descriptionAr: "تقديم ورش الزراعة ذاتية الري وتحويل المخلفات إلى فن لطلبة وأعضاء هيئة التدريس بجامعة الإمارات.",
    categoryEn: "University Summits",
    categoryAr: "المؤتمرات الجامعية",
    categoryKey: "events",
    image: "/portfolio/page-29.webp",
    thumbnail: "/portfolio/thumb-29.webp",
    altEn: "Climatify Portfolio 2025 - Slide 29: Sustainable Universe Conference 2025 at UAEU",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 29: مؤتمر الكون المستدام 2025 في جامعة الإمارات",
    actions: [
      {
            "id": "drive-29",
            "labelEn": "Media & Project Files (Drive)",
            "labelAr": "وسائط وملفات المشروع (Drive)",
            "href": "https://drive.google.com/drive/folders/13raFtiuFjrNDNf_J1hPFA3mODhjhuoGb?q=sharedwith:public%20parent:13raFtiuFjrNDNf_J1hPFA3mODhjhuoGb%20type:folder",
            "type": "external",
            "variant": "secondary"
      }
]
  },
  {
    id: "portfolio-slide-30",
    pageNumber: 30,
    titleEn: "Portfolio Slide 30",
    titleAr: "شريحة البورتفوليو 30",
    subtitleEn: "2024 - 2025",
    subtitleAr: "",
    descriptionEn: "2024 - 2025 2024 - 2025",
    descriptionAr: "2024 - 2025 2024 - 2025",
    categoryEn: "Impact & Leadership",
    categoryAr: "الأثر وفريق القيادة",
    categoryKey: "impact",
    image: "/portfolio/page-30.webp",
    thumbnail: "/portfolio/thumb-30.webp",
    altEn: "Climatify Portfolio 2025 - Slide 30: Portfolio Slide 30",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 30: شريحة البورتفوليو 30",
    actions: []
  },
  {
    id: "portfolio-slide-31",
    pageNumber: 31,
    titleEn: "Climatify & Heliopolis University MoU & Forum",
    titleAr: "مذكرة تفاهم ومنتدى جامعة هليوبوليس للتنمية المستدامة",
    subtitleEn: "September| 2026",
    subtitleAr: "",
    descriptionEn: "Signing strategic MoU for climate curriculum development, research, and youth training.",
    descriptionAr: "توقيع مذكرة تفاهم لتطوير المناهج المناخية والبحوث والتدريب الشبابي المشترك.",
    categoryEn: "Academic Partnerships",
    categoryAr: "الشراكات الأكاديمية",
    categoryKey: "events",
    image: "/portfolio/page-31.webp",
    thumbnail: "/portfolio/thumb-31.webp",
    altEn: "Climatify Portfolio 2025 - Slide 31: Climatify & Heliopolis University MoU & Forum",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 31: مذكرة تفاهم ومنتدى جامعة هليوبوليس للتنمية المستدامة",
    actions: [
      {
            "id": "internal-event-31",
            "labelEn": "View in Events",
            "labelAr": "استكشف في صفحة الفعاليات",
            "href": "/events",
            "type": "internal",
            "variant": "primary"
      }
]
  },
  {
    id: "portfolio-slide-32",
    pageNumber: 32,
    titleEn: "Forbes Middle East Sustainability Leaders Summit 2025",
    titleAr: "قمة قادة الاستدامة من فوربس الشرق الأوسط 2025",
    subtitleEn: "October | 2025",
    subtitleAr: "",
    descriptionEn: "Participating in Eco-Entrepreneurs youth-led startups panel powering the sustainable transition.",
    descriptionAr: "مشاركة ريادية في جلسة الشركات الناشئة الخضراء التي تقود التحول نحو الاستدامة.",
    categoryEn: "Industry Summits",
    categoryAr: "قمم ريادة الأعمال",
    categoryKey: "events",
    image: "/portfolio/page-32.webp",
    thumbnail: "/portfolio/thumb-32.webp",
    altEn: "Climatify Portfolio 2025 - Slide 32: Forbes Middle East Sustainability Leaders Summit 2025",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 32: قمة قادة الاستدامة من فوربس الشرق الأوسط 2025",
    actions: []
  },
  {
    id: "portfolio-slide-33",
    pageNumber: 33,
    titleEn: "World Utilities Congress 2025 — Youth Energy Forum",
    titleAr: "الكونجرس العالمي للمرافق 2025 — منتدى طاقة الشباب",
    subtitleEn: "May | 2025",
    subtitleAr: "",
    descriptionEn: "Showcasing youth perspectives in clean utilities, grid decarbonization, and smart infrastructure.",
    descriptionAr: "استعراض رؤية الشباب في مرافق الطاقة النظيفة وخفض انبعاثات الشبكات والبنية التحتية الذكية.",
    categoryEn: "Energy Forums",
    categoryAr: "منتديات الطاقة",
    categoryKey: "events",
    image: "/portfolio/page-33.webp",
    thumbnail: "/portfolio/thumb-33.webp",
    altEn: "Climatify Portfolio 2025 - Slide 33: World Utilities Congress 2025 — Youth Energy Forum",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 33: الكونجرس العالمي للمرافق 2025 — منتدى طاقة الشباب",
    actions: []
  },
  {
    id: "portfolio-slide-34",
    pageNumber: 34,
    titleEn: "Earth Day Event — Nile River Initiative",
    titleAr: "فعالية يوم الأرض — مبادرة حماية النيل",
    subtitleEn: "April | 2025",
    subtitleAr: "",
    descriptionEn: "'From the Nile... Our Unified Commitment to Protect the Earth' in collaboration with Nabtah and Dialogreen.",
    descriptionAr: "«من النيل... التزامنا الموحد لحماية الأرض» بالتعاون مع نبتة وديالوجرين.",
    categoryEn: "Community Events",
    categoryAr: "الفعاليات المجتمعية",
    categoryKey: "events",
    image: "/portfolio/page-34.webp",
    thumbnail: "/portfolio/thumb-34.webp",
    altEn: "Climatify Portfolio 2025 - Slide 34: Earth Day Event — Nile River Initiative",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 34: فعالية يوم الأرض — مبادرة حماية النيل",
    actions: [
      {
            "id": "pdf-34",
            "labelEn": "Official Report (PDF)",
            "labelAr": "التقرير الرسمي (PDF)",
            "href": "https://acrobat.adobe.com/id/urn:aaid:sc:EU:f01da5c3-98c2-4081-a6cb-e50466d53fac",
            "type": "external",
            "variant": "secondary"
      },
      {
            "id": "ig-34",
            "labelEn": "View Highlights on Instagram",
            "labelAr": "مشاهدة التغطية على إنستغرام",
            "href": "https://www.instagram.com/reel/DIoseI7Mccj/?igsh=OGNoOW80bDNwemRw",
            "type": "external",
            "variant": "secondary"
      },
      {
            "id": "internal-event-34",
            "labelEn": "View in Events",
            "labelAr": "استكشف في صفحة الفعاليات",
            "href": "/events",
            "type": "internal",
            "variant": "secondary"
      }
]
  },
  {
    id: "portfolio-slide-35",
    pageNumber: 35,
    titleEn: "RISE '25 — American University of Sharjah",
    titleAr: "فعالية RISE 25 بالجامعة الأمريكية في الشارقة",
    subtitleEn: "April | 2025",
    subtitleAr: "",
    descriptionEn: "Engaging with nearly 90 students and changemakers on climate technology and green startups.",
    descriptionAr: "التفاعل مع قرابة 90 طالباً ومبتكراً حول تكنولوجيا المناخ وريادة الأعمال الخضراء.",
    categoryEn: "University Innovation",
    categoryAr: "الابتكار الجامعي",
    categoryKey: "events",
    image: "/portfolio/page-35.webp",
    thumbnail: "/portfolio/thumb-35.webp",
    altEn: "Climatify Portfolio 2025 - Slide 35: RISE '25 — American University of Sharjah",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 35: فعالية RISE 25 بالجامعة الأمريكية في الشارقة",
    actions: [
      {
            "id": "internal-event-35",
            "labelEn": "View in Events",
            "labelAr": "استكشف في صفحة الفعاليات",
            "href": "/events",
            "type": "internal",
            "variant": "primary"
      }
]
  },
  {
    id: "portfolio-slide-36",
    pageNumber: 36,
    titleEn: "Future Pioneers Award — BEEAH Group",
    titleAr: "جائزة رواد المستقبل — مجموعة بيئة",
    subtitleEn: "April | 2025",
    subtitleAr: "",
    descriptionEn: "Selected among top innovators out of 2,600+ regional entries under the patronage of H.E. Sheikha Bodour Al Qasimi.",
    descriptionAr: "تكريم ريادي ضمن نخبة المبتكرين من بين أكثر من 2,600 مشاركة برعاية الشيخة بدور القاسمي.",
    categoryEn: "Awards & Honors",
    categoryAr: "الجوائز والتكريم",
    categoryKey: "events",
    image: "/portfolio/page-36.webp",
    thumbnail: "/portfolio/thumb-36.webp",
    altEn: "Climatify Portfolio 2025 - Slide 36: Future Pioneers Award — BEEAH Group",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 36: جائزة رواد المستقبل — مجموعة بيئة",
    actions: []
  },
  {
    id: "portfolio-slide-37",
    pageNumber: 37,
    titleEn: "Farming & Agricultural Waste Recycling Workshop",
    titleAr: "ورشة تدوير المخلفات الزراعية والري المستدام",
    subtitleEn: "Feb | 2025",
    subtitleAr: "",
    descriptionEn: "Co-organized with Wavemakers United and Anuket, training local farmers on circular agri-practices.",
    descriptionAr: "تدريب مزارعين ورواد أعمال على الممارسات الدائرية وإعادة تدوير المتبقيات الزراعية.",
    categoryEn: "Agri-Waste Workshops",
    categoryAr: "ورش التدوير الزراعي",
    categoryKey: "workshops",
    image: "/portfolio/page-37.webp",
    thumbnail: "/portfolio/thumb-37.webp",
    altEn: "Climatify Portfolio 2025 - Slide 37: Farming & Agricultural Waste Recycling Workshop",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 37: ورشة تدوير المخلفات الزراعية والري المستدام",
    actions: []
  },
  {
    id: "portfolio-slide-38",
    pageNumber: 38,
    titleEn: "COP29 Baku, Azerbaijan — UAE Youth Climate Action Panel",
    titleAr: "مؤتمر COP29 في باكو — جلسة شباب الإمارات للعمل المناخي",
    subtitleEn: "Novmber| 2024",
    subtitleAr: "",
    descriptionEn: "Hosted with Azerbaijan Ministry of Youth: 'Youth of the UAE Tackling Climate Challenges: Agricultural Innovation'.",
    descriptionAr: "جلسة نقاشية رسمية بالتعاون مع وزارة الشباب الأذربيجانية حول الابتكار الزراعي ودعم الشباب.",
    categoryEn: "COP Conferences",
    categoryAr: "مؤتمرات الأطراف COP",
    categoryKey: "events",
    image: "/portfolio/page-38.webp",
    thumbnail: "/portfolio/thumb-38.webp",
    altEn: "Climatify Portfolio 2025 - Slide 38: COP29 Baku, Azerbaijan — UAE Youth Climate Action Panel",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 38: مؤتمر COP29 في باكو — جلسة شباب الإمارات للعمل المناخي",
    actions: []
  },
  {
    id: "portfolio-slide-39",
    pageNumber: 39,
    titleEn: "COP29 Baku, Azerbaijan — UAE Youth Climate Action Panel",
    titleAr: "مؤتمر COP29 في باكو — جلسة شباب الإمارات للعمل المناخي",
    subtitleEn: "2023 - 2024",
    subtitleAr: "",
    descriptionEn: "Hosted with Azerbaijan Ministry of Youth: 'Youth of the UAE Tackling Climate Challenges: Agricultural Innovation'.",
    descriptionAr: "جلسة نقاشية رسمية بالتعاون مع وزارة الشباب الأذربيجانية حول الابتكار الزراعي ودعم الشباب.",
    categoryEn: "COP Conferences",
    categoryAr: "مؤتمرات الأطراف COP",
    categoryKey: "events",
    image: "/portfolio/page-39.webp",
    thumbnail: "/portfolio/thumb-39.webp",
    altEn: "Climatify Portfolio 2025 - Slide 39: COP29 Baku, Azerbaijan — UAE Youth Climate Action Panel",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 39: مؤتمر COP29 في باكو — جلسة شباب الإمارات للعمل المناخي",
    actions: []
  },
  {
    id: "portfolio-slide-40",
    pageNumber: 40,
    titleEn: "Portfolio Slide 40",
    titleAr: "شريحة البورتفوليو 40",
    subtitleEn: "2023 - 2024",
    subtitleAr: "",
    descriptionEn: "2023 - 2024 2023 - 2024",
    descriptionAr: "2023 - 2024 2023 - 2024",
    categoryEn: "Impact & Leadership",
    categoryAr: "الأثر وفريق القيادة",
    categoryKey: "impact",
    image: "/portfolio/page-40.webp",
    thumbnail: "/portfolio/thumb-40.webp",
    altEn: "Climatify Portfolio 2025 - Slide 40: Portfolio Slide 40",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 40: شريحة البورتفوليو 40",
    actions: []
  },
  {
    id: "portfolio-slide-41",
    pageNumber: 41,
    titleEn: "RCOY MENA 2024 — Amman, Jordan",
    titleAr: "مؤتمر RCOY MENA 2024 — عمّان، الأردن",
    subtitleEn: "RC    YMENA",
    subtitleAr: "",
    descriptionEn: "Strategic partners dedicated for 8 months in organizing the regional youth climate consultation.",
    descriptionAr: "شريك استراتيجي في تنظيم المؤتمر الإقليمي للشباب لاتفاقية الأمم المتحدة الإطارية للمناخ.",
    categoryEn: "Regional Conferences",
    categoryAr: "المؤتمرات الإقليمية",
    categoryKey: "events",
    image: "/portfolio/page-41.webp",
    thumbnail: "/portfolio/thumb-41.webp",
    altEn: "Climatify Portfolio 2025 - Slide 41: RCOY MENA 2024 — Amman, Jordan",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 41: مؤتمر RCOY MENA 2024 — عمّان، الأردن",
    actions: [
      {
            "id": "ig-41",
            "labelEn": "View Highlights on Instagram",
            "labelAr": "مشاهدة التغطية على إنستغرام",
            "href": "https://www.instagram.com/reel/DAiGcZpO5bT/?igsh=MXJuMWtwZDFuMnRneg==",
            "type": "external",
            "variant": "secondary"
      },
      {
            "id": "internal-event-41",
            "labelEn": "View in Events",
            "labelAr": "استكشف في صفحة الفعاليات",
            "href": "/events",
            "type": "internal",
            "variant": "secondary"
      }
]
  },
  {
    id: "portfolio-slide-42",
    pageNumber: 42,
    titleEn: "Sustainability Day with ENOC Youth Council",
    titleAr: "يوم الاستدامة بالشراكة مع مجلس شباب إينوك",
    subtitleEn: "May - August | 2024",
    subtitleAr: "",
    descriptionEn: "Over 100 participants engaged in hydroponic farming, recycling, and sustainable lifestyle workshops.",
    descriptionAr: "أكثر من 100 مشارك في ورش الزراعة المائية وتدوير الموارد وترشيد الطاقة مع شركة إينوك.",
    categoryEn: "Corporate Youth Councils",
    categoryAr: "المجالس الشبابية المؤسسية",
    categoryKey: "events",
    image: "/portfolio/page-42.webp",
    thumbnail: "/portfolio/thumb-42.webp",
    altEn: "Climatify Portfolio 2025 - Slide 42: Sustainability Day with ENOC Youth Council",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 42: يوم الاستدامة بالشراكة مع مجلس شباب إينوك",
    actions: [
      {
            "id": "drive-42",
            "labelEn": "Media & Project Files (Drive)",
            "labelAr": "وسائط وملفات المشروع (Drive)",
            "href": "https://drive.google.com/drive/folders/12wsfT7MZPWZWknHPsaKlzdifI_I1vdIz?usp=sharing",
            "type": "external",
            "variant": "secondary"
      }
]
  },
  {
    id: "portfolio-slide-43",
    pageNumber: 43,
    titleEn: "Global Trees & Seas Film Festival",
    titleAr: "مهرجان أشجار وبحار العالم السينمائي",
    subtitleEn: "CONFERENCES AND EVENTS",
    subtitleAr: "",
    descriptionEn: "Highlighting the ecological significance of UAE mangroves and palm trees in climate resilience.",
    descriptionAr: "تسليط الضوء على الأهمية البيئية لأشجار القرم والنخيل في دولة الإمارات.",
    categoryEn: "Cultural & Film",
    categoryAr: "السينما والبيئة",
    categoryKey: "events",
    image: "/portfolio/page-43.webp",
    thumbnail: "/portfolio/thumb-43.webp",
    altEn: "Climatify Portfolio 2025 - Slide 43: Global Trees & Seas Film Festival",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 43: مهرجان أشجار وبحار العالم السينمائي",
    actions: []
  },
  {
    id: "portfolio-slide-44",
    pageNumber: 44,
    titleEn: "International Leadership Conference — ICYF Azerbaijan",
    titleAr: "مؤتمر القيادة الدولية — منتدى شباب التعاون الإسلامي",
    subtitleEn: "International Leadership Conference",
    subtitleAr: "",
    descriptionEn: "Representing the UAE in Shusha - OIC Youth Capital 2024 on youth climate advocacy.",
    descriptionAr: "تمثيل دولة الإمارات في مؤتمر القيادة الدولية ضمن فعاليات شوشا عاصمة شباب التعاون الإسلامي.",
    categoryEn: "International Diplomacy",
    categoryAr: "الدبلوماسية الدولية",
    categoryKey: "events",
    image: "/portfolio/page-44.webp",
    thumbnail: "/portfolio/thumb-44.webp",
    altEn: "Climatify Portfolio 2025 - Slide 44: International Leadership Conference — ICYF Azerbaijan",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 44: مؤتمر القيادة الدولية — منتدى شباب التعاون الإسلامي",
    actions: []
  },
  {
    id: "portfolio-slide-45",
    pageNumber: 45,
    titleEn: "Environmental Health & Safety Day — Khalifa University",
    titleAr: "يوم الصحة والسلامة البيئية — جامعة خليفة",
    subtitleEn: "Environmental Health and Safety Day",
    subtitleAr: "",
    descriptionEn: "Promoting campus sustainability, waste audits, and green technology with Khalifa University.",
    descriptionAr: "نشر الوعي البيئي وتقنيات الاستدامة مع طلبة وأساتذة جامعة خليفة بأبوظبي.",
    categoryEn: "Campus Sustainability",
    categoryAr: "الاستدامة الجامعية",
    categoryKey: "events",
    image: "/portfolio/page-45.webp",
    thumbnail: "/portfolio/thumb-45.webp",
    altEn: "Climatify Portfolio 2025 - Slide 45: Environmental Health & Safety Day — Khalifa University",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 45: يوم الصحة والسلامة البيئية — جامعة خليفة",
    actions: []
  },
  {
    id: "portfolio-slide-46",
    pageNumber: 46,
    titleEn: "Local Product Sustainability — Zayed University",
    titleAr: "استدامة المنتج المحلي — جامعة زايد",
    subtitleEn: "Local Product Sustainability.",
    subtitleAr: "",
    descriptionEn: "UAE Environment Day event in Dubai Campus promoting sustainable consumption of local goods.",
    descriptionAr: "فعالية يوم البيئة الوطني بجامعة زايد لتعزيز استهلاك ودعم المنتجات المحلية المستدامة.",
    categoryEn: "Campus Sustainability",
    categoryAr: "الاستدامة الجامعية",
    categoryKey: "events",
    image: "/portfolio/page-46.webp",
    thumbnail: "/portfolio/thumb-46.webp",
    altEn: "Climatify Portfolio 2025 - Slide 46: Local Product Sustainability — Zayed University",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 46: استدامة المنتج المحلي — جامعة زايد",
    actions: []
  },
  {
    id: "portfolio-slide-47",
    pageNumber: 47,
    titleEn: "Climatify Impact Numbers",
    titleAr: "أثر كلايمتيفاي الإقليمي المعتمد",
    subtitleEn: "CLIMATIFY HAS REACHED 30,000+ YOUTH, EMPOWERED",
    subtitleAr: "",
    descriptionEn: "Reaching 30,000+ youth, empowering 1,000+ leaders, and supporting 250+ climate and agritech projects.",
    descriptionAr: "الوصول إلى أكثر من 30 ألف شاب، وتمكين 1,000+ مشارك، ودعم أكثر من 250 فكرة ومشروعاً ريادياً.",
    categoryEn: "Regional Impact",
    categoryAr: "الأثر الإقليمي بالأرقام",
    categoryKey: "impact",
    image: "/portfolio/page-47.webp",
    thumbnail: "/portfolio/thumb-47.webp",
    altEn: "Climatify Portfolio 2025 - Slide 47: Climatify Impact Numbers",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 47: أثر كلايمتيفاي الإقليمي المعتمد",
    actions: []
  },
  {
    id: "portfolio-slide-48",
    pageNumber: 48,
    titleEn: "Trusted by Global & Regional Partners",
    titleAr: "شركاؤنا الاستراتيجيون حول العالم",
    subtitleEn: "",
    subtitleAr: "",
    descriptionEn: "UN agencies, EU delegations, leading universities, and regional institutions powering climate action.",
    descriptionAr: "منظمات الأمم المتحدة، بعثات الاتحاد الأوروبي، كبرى الجامعات، والمؤسسات الرائدة.",
    categoryEn: "Trusted Partners",
    categoryAr: "الشركاء الاستراتيجيون",
    categoryKey: "impact",
    image: "/portfolio/page-48.webp",
    thumbnail: "/portfolio/thumb-48.webp",
    altEn: "Climatify Portfolio 2025 - Slide 48: Trusted by Global & Regional Partners",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 48: شركاؤنا الاستراتيجيون حول العالم",
    actions: []
  },
  {
    id: "portfolio-slide-49",
    pageNumber: 49,
    titleEn: "Trusted by Global & Regional Partners",
    titleAr: "شركاؤنا الاستراتيجيون حول العالم",
    subtitleEn: "",
    subtitleAr: "",
    descriptionEn: "UN agencies, EU delegations, leading universities, and regional institutions powering climate action.",
    descriptionAr: "منظمات الأمم المتحدة، بعثات الاتحاد الأوروبي، كبرى الجامعات، والمؤسسات الرائدة.",
    categoryEn: "Trusted Partners",
    categoryAr: "الشركاء الاستراتيجيون",
    categoryKey: "impact",
    image: "/portfolio/page-49.webp",
    thumbnail: "/portfolio/thumb-49.webp",
    altEn: "Climatify Portfolio 2025 - Slide 49: Trusted by Global & Regional Partners",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 49: شركاؤنا الاستراتيجيون حول العالم",
    actions: []
  },
  {
    id: "portfolio-slide-50",
    pageNumber: 50,
    titleEn: "Proud Moments & Recognitions",
    titleAr: "لحظات فخر وتكريمات دولية",
    subtitleEn: "",
    subtitleAr: "",
    descriptionEn: "Celebrating achievements, ministerial recognitions, and international climate milestones.",
    descriptionAr: "استعراض الجوائز والتكريمات الرسمية والمحطات المناخية الفارقة في مسيرة كلايمتيفاي.",
    categoryEn: "Awards & Recognitions",
    categoryAr: "الجوائز واللحظات الفخرية",
    categoryKey: "impact",
    image: "/portfolio/page-50.webp",
    thumbnail: "/portfolio/thumb-50.webp",
    altEn: "Climatify Portfolio 2025 - Slide 50: Proud Moments & Recognitions",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 50: لحظات فخر وتكريمات دولية",
    actions: []
  },
  {
    id: "portfolio-slide-51",
    pageNumber: 51,
    titleEn: "Annual Progress Report",
    titleAr: "تقرير الإنجاز والتقدم السنوي",
    subtitleEn: "YOU CAN VIEW OUR 2023",
    subtitleAr: "",
    descriptionEn: "Reviewing annual milestones, financial governance, community metrics, and strategic plans.",
    descriptionAr: "استعراض الإنجازات السنوية ومؤشرات الحوكمة المجتمعية والمستهدفات المستقبلية.",
    categoryEn: "Annual Progress",
    categoryAr: "تقرير الإنجاز السنوي",
    categoryKey: "impact",
    image: "/portfolio/page-51.webp",
    thumbnail: "/portfolio/thumb-51.webp",
    altEn: "Climatify Portfolio 2025 - Slide 51: Annual Progress Report",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 51: تقرير الإنجاز والتقدم السنوي",
    actions: []
  },
  {
    id: "portfolio-slide-52",
    pageNumber: 52,
    titleEn: "Climatify Executive Leadership",
    titleAr: "القيادة التنفيذية لكلايمتيفاي",
    subtitleEn: "Founder & CEO",
    subtitleAr: "",
    descriptionEn: "Led by Mai Moawad (Founder & CEO) and Abdullah Al Salmani (Co-Founder & COO).",
    descriptionAr: "قيادة شابة تقودها مي معوض (المؤسس والرئيس التنفيذي) وعبدالله السلماني (الشريك المؤسس ومدير العمليات).",
    categoryEn: "Leadership Team",
    categoryAr: "فريق القيادة",
    categoryKey: "impact",
    image: "/portfolio/page-52.webp",
    thumbnail: "/portfolio/thumb-52.webp",
    altEn: "Climatify Portfolio 2025 - Slide 52: Climatify Executive Leadership",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 52: القيادة التنفيذية لكلايمتيفاي",
    actions: [
      {
            "id": "internal-contact-52",
            "labelEn": "Get in Touch",
            "labelAr": "تواصل مع الإدارة",
            "href": "/contact",
            "type": "internal",
            "variant": "primary"
      }
]
  },
  {
    id: "portfolio-slide-53",
    pageNumber: 53,
    titleEn: "Get in Touch — Let's Work Together",
    titleAr: "تواصل معنا — لنتعاون معاً",
    subtitleEn: "PORTOFOLIO 2023 - 2024",
    subtitleAr: "",
    descriptionEn: "Connect with Climatify for strategic partnerships, youth empowerment programs, and climate projects.",
    descriptionAr: "تواصل مع فريق كلايمتيفاي لبناء شراكات استراتيجية وبرامج تمكين شبابية ومشاريع مناخية.",
    categoryEn: "Contact & Connect",
    categoryAr: "التواصل والشراكات",
    categoryKey: "impact",
    image: "/portfolio/page-53.webp",
    thumbnail: "/portfolio/thumb-53.webp",
    altEn: "Climatify Portfolio 2025 - Slide 53: Get in Touch — Let's Work Together",
    altAr: "بورتفوليو كلايمتيفاي 2025 - الشريحة 53: تواصل معنا — لنتعاون معاً",
    actions: [
      {
            "id": "ig-53",
            "labelEn": "View Highlights on Instagram",
            "labelAr": "مشاهدة التغطية على إنستغرام",
            "href": "https://www.instagram.com/climatify?igsh=MWJyYmVxdmJxN3R6",
            "type": "external",
            "variant": "secondary"
      },
      {
            "id": "linktree-53",
            "labelEn": "Linktree Community",
            "labelAr": "روابط المجتمع الرقمي",
            "href": "https://linktr.ee/climatify.platform?utm_source=linktree_profile_share&ltsid=305131df-e4c9-40cd-bd19-354e4432cf12",
            "type": "external",
            "variant": "primary"
      },
      {
            "id": "internal-contact-53",
            "labelEn": "Get in Touch",
            "labelAr": "تواصل مع الإدارة",
            "href": "/contact",
            "type": "internal",
            "variant": "primary"
      }
]
  },
];
