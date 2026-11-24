import fs from "node:fs";
import path from "node:path";
import {
  mockBlogPosts,
  mockPrograms,
  mockCourses,
  mockEvents,
  mockGames,
  mockTeam,
} from "../src/services/mockData.ts";

const SITE_URL = "https://climatify-youth.com";
const PUBLIC_DIR = path.resolve(process.cwd(), "public");
const DIST_DIR = path.resolve(process.cwd(), "dist");

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Ensures an image path exists in `public/` before emitting it into sitemap/RSS.
 * Falls back to `/future-100-recognition.jpg` if a relative asset is missing.
 */
function resolveVerifiedPublicImage(imgPath: string): string {
  if (!imgPath) return "/future-100-recognition.jpg";
  if (/^https?:\/\//i.test(imgPath)) return imgPath;
  const normalized = imgPath.startsWith("/") ? imgPath : `/${imgPath}`;
  const diskPath = path.join(PUBLIC_DIR, normalized.slice(1));
  if (fs.existsSync(diskPath)) {
    return normalized;
  }
  throw new Error(`[SEO Generator] Missing public image asset on disk: ${normalized}`);
}

interface StaticRouteMeta {
  path: string;
  lastmod: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: string;
  image: string;
  imageTitle: string;
  imageCaption: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  breadcrumbAr: string;
  breadcrumbEn: string;
}

const CORE_ROUTES: StaticRouteMeta[] = [
  {
    path: "/",
    lastmod: "2026-11-01",
    changefreq: "daily",
    priority: "1.0",
    image: "/clipboard-image-1784502037.webp",
    imageTitle: "Climatify — Climate Action Digitized | UAE Future 100 Winner",
    imageCaption:
      "Climatify is an award-winning UAE climate education and youth empowerment social enterprise founded in 2023 in Dubai.",
    titleAr: "Climatify — من الشباب إلى الشباب | الفائز بجائزة Future 100 في دولة الإمارات",
    titleEn: "Climatify — From Youth to Youth | UAE Future 100 Winner & Climate Education",
    descriptionAr:
      "كلايمتفاي (Climatify) مؤسسة مجتمعية وشركة ناشئة إماراتية فائزة بجائزة Future 100 لعام 2025 من وزارة الاقتصاد ومكتب رئاسة مجلس الوزراء، تجمع بين الرقمنة المناخية وتمكين الشباب والتعليم البيئي التفاعلي.",
    descriptionEn:
      "Climatify is an award-winning UAE climate education and youth empowerment social enterprise (Future 100 winner) transforming climate action and sustainability into interactive learning experiences.",
    breadcrumbAr: "الرئيسية",
    breadcrumbEn: "Home",
  },
  {
    path: "/portfolio",
    lastmod: "2026-11-01",
    changefreq: "weekly",
    priority: "0.95",
    image: "/portfolio/page-01.webp",
    imageTitle: "Climatify Technology & Impact Portfolio 2025",
    imageCaption: "53 Interactive Showcase Slides of Climatify Climate Action Milestones and Partnerships",
    titleAr: "بورتفوليو كلايمتفاي التفاعلي 2025 | Climatify — التعليم المناخي وتمكين الشباب في الإمارات",
    titleEn: "Interactive Impact Portfolio 2025 | Climatify — Climate Education & Youth Empowerment UAE",
    descriptionAr:
      "استعرض بورتفوليو كلايمتفاي التفاعلي (53 شريحة موثقة) لإنجازات التعليم المناخي، برنامج SHIFT، شراكات الجامعات، وجائزة Future 100 في دولة الإمارات.",
    descriptionEn:
      "Explore Climatify's 53-slide interactive portfolio showcasing UAE Future 100 recognition, SHIFT cohorts, university MoUs, and regional climate impact.",
    breadcrumbAr: "البورتفوليو",
    breadcrumbEn: "Portfolio",
  },
  {
    path: "/about",
    lastmod: "2026-11-01",
    changefreq: "weekly",
    priority: "0.90",
    image: "/future-100-recognition.jpg",
    imageTitle: "Climatify Leadership & UAE Future 100 Recognition",
    imageCaption: "Climatify Co-Founders and Leadership Team driving youth climate empowerment across MENA",
    titleAr: "من نحن والقيادة المؤسسية | Climatify — التعليم المناخي وتمكين الشباب في الإمارات",
    titleEn: "About Us & Leadership Team | Climatify — Climate Education & Youth Empowerment UAE",
    descriptionAr:
      "تعرف على قصة تأسيس كلايمتفاي في دولة الإمارات عام 2023، رؤيتها في الرقمنة المناخية من الشباب إلى الشباب، وفريق المؤسسين الفائز بجائزة Future 100.",
    descriptionEn:
      "Discover Climatify's founding story in the UAE (2023), our From Youth to Youth mission, Future 100 recognition, and executive leadership team.",
    breadcrumbAr: "من نحن",
    breadcrumbEn: "About Us",
  },
  {
    path: "/programs",
    lastmod: "2026-11-01",
    changefreq: "weekly",
    priority: "0.90",
    image: "/ambassadors/shift-internship-poster.webp",
    imageTitle: "Climatify SHIFT Program & Climate Initiatives",
    imageCaption: "Regional youth capacity building, climate hackathons, and interactive sustainability programs",
    titleAr: "البرامج والمبادرات المناخية (برنامج SHIFT) | Climatify — التعليم المناخي وتمكين الشباب في الإمارات",
    titleEn: "Climate Programs & SHIFT Initiative | Climatify — Climate Education & Youth Empowerment UAE",
    descriptionAr:
      "استكشف برامج ومبادرات كلايمتفاي الرائدة: برنامج SHIFT لبناء قدرات الشباب، زمالة الحد من مخاطر الكوارث CADRR، ومعسكرات Wavemakers البيئية.",
    descriptionEn:
      "Explore Climatify's flagship programs: the SHIFT Youth Capacity Building Program, CADRR Climate Fellowship, and Wavemakers environmental camps.",
    breadcrumbAr: "البرامج والمبادرات",
    breadcrumbEn: "Programs & Initiatives",
  },
  {
    path: "/events",
    lastmod: "2026-11-01",
    changefreq: "weekly",
    priority: "0.85",
    image: "/climatify-ice-2024-hackathon-projectset.jpg",
    imageTitle: "Climatify Climate Events, Summits and Hackathons",
    imageCaption: "COP28, COP29, Youth Climate Mobility Forum, and regional sustainability hackathons",
    titleAr: "الفعاليات والمؤتمرات والهاكاثونات المناخية | Climatify — التعليم المناخي وتمكين الشباب في الإمارات",
    titleEn: "Climate Events, Summits & Hackathons | Climatify — Climate Education & Youth Empowerment UAE",
    descriptionAr:
      "سجل في أحدث مؤتمرات وورش عمل وهاكاثونات كلايمتفاي البيئية في دبي وأبوظبي والقاهرة والمنطقة العربية واحصل على تذكرة حضور معتمدة.",
    descriptionEn:
      "Register for upcoming Climatify climate summits, university workshops, and sustainability hackathons across Dubai, Abu Dhabi, and MENA.",
    breadcrumbAr: "الفعاليات",
    breadcrumbEn: "Events",
  },
  {
    path: "/learning-hub",
    lastmod: "2026-11-01",
    changefreq: "weekly",
    priority: "0.85",
    image: "/brand/climatify-what-is.png",
    imageTitle: "Climatify Academy & Certified Climate Courses",
    imageCaption: "Interactive courses and workshops delivered with Zayed University, Khalifa University, Heliopolis University, and ENOC",
    titleAr: "أكاديمية التعلم والمساقات المعتمدة | Climatify — التعليم المناخي وتمكين الشباب في الإمارات",
    titleEn: "Learning Hub & Certified Climate Academy | Climatify — Climate Education & Youth Empowerment UAE",
    descriptionAr:
      "تعلم مجاناً واحصل على شهادات معتمدة من أكاديمية كلايمتفاي بالتعاون مع جامعة زايد وجامعة خليفة وجامعة هليوبوليس وشركة ENOC.",
    descriptionEn:
      "Earn certified climate credentials at Climatify Academy with courses co-developed with Zayed University, Khalifa University, Heliopolis University, and ENOC.",
    breadcrumbAr: "أكاديمية التعلم",
    breadcrumbEn: "Learning Hub",
  },
  {
    path: "/media",
    lastmod: "2026-11-01",
    changefreq: "daily",
    priority: "0.90",
    image: "/partnerships/mou-heliopolis-ceremony.jpg",
    imageTitle: "Climatify Media Center, News & Annual Sustainability Reports",
    imageCaption: "Official press releases, strategic MoUs, COP28 & COP29 coverage, and Future 100 milestones",
    titleAr: "المركز الإعلامي والتقارير الصحفية | Climatify — التعليم المناخي وتمكين الشباب في الإمارات",
    titleEn: "Media Center & Official Press | Climatify — Climate Education & Youth Empowerment UAE",
    descriptionAr:
      "تابع أحدث أخبار مبادرات كلايمتفاي، التقارير السنوية المعتمدة، تغطيات مؤتمرات المناخ COP28 وCOP29، وتوقيع مذكرات التفاهم الاستراتيجية.",
    descriptionEn:
      "Follow the latest Climatify climate initiatives, certified annual progress reports, COP28 & COP29 summit coverage, and strategic MoUs.",
    breadcrumbAr: "المركز الإعلامي",
    breadcrumbEn: "Media Center",
  },
  {
    path: "/opportunities",
    lastmod: "2026-11-01",
    changefreq: "weekly",
    priority: "0.85",
    image: "/ambassadors/shift-ambassadors-2026.webp",
    imageTitle: "Youth Climate Opportunities, Internships, Fellowships & Green Careers",
    imageCaption: "Apply for internships, volunteering, and explore green career pathways in the UAE and MENA",
    titleAr: "الفرص والتدريب والمسارات المهنية الخضراء | Climatify — التعليم المناخي وتمكين الشباب في الإمارات",
    titleEn: "Green Careers, Internships & Youth Opportunities | Climatify — Climate Education & Youth Empowerment UAE",
    descriptionAr:
      "قدم على فرص التدريب، التطوع، والزمالات المناخية في كلايمتفاي، واستكشف دليل المسارات المهنية الخضراء ووظائف الاستدامة في الإمارات.",
    descriptionEn:
      "Apply for climate internships, volunteering, and fellowships at Climatify, and explore high-demand green career pathways across the UAE and MENA.",
    breadcrumbAr: "الفرص والوظائف",
    breadcrumbEn: "Opportunities",
  },
  {
    path: "/games",
    lastmod: "2026-11-01",
    changefreq: "monthly",
    priority: "0.80",
    image: "/clipboard-image-1784502037.webp",
    imageTitle: "AgriClash Climate Game, GreenSharks & Carbon Footprint Calculator",
    imageCaption: "Interactive educational climate games and personal carbon footprint simulator by Climatify",
    titleAr: "ألعاب المناخ التفاعلية (AgriClash) وحاسبة الكربون | Climatify — التعليم المناخي وتمكين الشباب في الإمارات",
    titleEn: "Climate Games (AgriClash) & Carbon Calculator | Climatify — Climate Education & Youth Empowerment UAE",
    descriptionAr:
      "العب وتعلم مع ألعاب المناخ التفاعلية من كلايمتفاي: لعبة AgriClash لإدارة الموارد الزراعية، تحدي GreenSharks، حاسبة البصمة الكربونية، وحديقة الغاف الرقمية.",
    descriptionEn:
      "Experience Climatify's interactive climate gamification suite: AgriClash agricultural strategy game, GreenSharks pitch challenge, Carbon Calculator, and Ghaf Digital Garden.",
    breadcrumbAr: "ألعاب المناخ",
    breadcrumbEn: "Climate Games",
  },
  {
    path: "/portals",
    lastmod: "2026-11-01",
    changefreq: "monthly",
    priority: "0.80",
    image: "/brand/future-100-badge.png",
    imageTitle: "Climatify Institutional, Corporate & University Partnerships Portal",
    imageCaption: "Partner with Climatify or request interactive climate workshops for schools and universities",
    titleAr: "بوابة الشركاء والمدارس والجامعات | Climatify — التعليم المناخي وتمكين الشباب في الإمارات",
    titleEn: "Corporate, School & University Portals | Climatify — Climate Education & Youth Empowerment UAE",
    descriptionAr:
      "بوابة مخصصة للشراكات المؤسسية والحكومية وطلب ورش العمل المناخية التفاعلية والمناهج البيئية للمدارس والجامعات في دولة الإمارات والمنطقة.",
    descriptionEn:
      "Dedicated portal for corporate ESG partnerships and school/university interactive climate workshops and curriculum packs across the UAE and MENA.",
    breadcrumbAr: "بوابة الشركاء والمدارس",
    breadcrumbEn: "Partner & School Portals",
  },
  {
    path: "/brand",
    lastmod: "2026-11-01",
    changefreq: "monthly",
    priority: "0.70",
    image: "/brand/future-100-2024.png",
    imageTitle: "Climatify Official Brand Guidelines & Media Kit",
    imageCaption: "Official Climatify logos, typography, color palette, and media kit assets",
    titleAr: "دليل الهوية البصرية والشعارات الرسمية | Climatify — التعليم المناخي وتمكين الشباب في الإمارات",
    titleEn: "Official Brand Guidelines & Media Kit | Climatify — Climate Education & Youth Empowerment UAE",
    descriptionAr:
      "حمّل الشعارات الرسمية المعتمدة ودليل الهوية البصرية والألوان والخطوط الخاصة بمؤسسة كلايمتفاي (Climatify Brand Kit).",
    descriptionEn:
      "Download official Climatify brand guidelines, approved logos, color tokens, and media kit resources for press and partners.",
    breadcrumbAr: "الهوية البصرية",
    breadcrumbEn: "Brand Kit",
  },
  {
    path: "/contact",
    lastmod: "2026-11-01",
    changefreq: "monthly",
    priority: "0.75",
    image: "/logo-dark.png",
    imageTitle: "Contact Climatify Team in Dubai, United Arab Emirates",
    imageCaption: "Reach out to Climatify or book a direct consultation meeting with our team",
    titleAr: "تواصل معنا واحجز اجتماعاً | Climatify — التعليم المناخي وتمكين الشباب في الإمارات",
    titleEn: "Contact Us & Book a Meeting | Climatify — Climate Education & Youth Empowerment UAE",
    descriptionAr:
      "تواصل مباشرة مع فريق مؤسسة كلايمتفاي في دبي، دولة الإمارات العربية المتحدة، أو احجز موعد اجتماع استشاري للشراكات والمبادرات البيئية.",
    descriptionEn:
      "Get in touch with the Climatify team in Dubai, UAE, or schedule a direct meeting for climate partnerships, educational programs, and media inquiries.",
    breadcrumbAr: "تواصل معنا",
    breadcrumbEn: "Contact Us",
  },
];

function generateSitemapXml(): string {
  const lines: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
    `        xmlns:xhtml="http://www.w3.org/1999/xhtml"`,
    `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`,
    ``,
    `  <!-- ============================================== -->`,
    `  <!-- 🌍 Core Public Platform Pages (${CORE_ROUTES.length} Routes) -->`,
    `  <!-- ============================================== -->`,
  ];

  for (const route of CORE_ROUTES) {
    const loc = `${SITE_URL}${route.path === "/" ? "/" : route.path}`;
    const verifiedImg = resolveVerifiedPublicImage(route.image);
    const imgUrl = verifiedImg.startsWith("http") ? verifiedImg : `${SITE_URL}${verifiedImg}`;

    lines.push(
      `  <url>`,
      `    <loc>${escapeXml(loc)}</loc>`,
      `    <xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(loc)}" />`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(loc)}" />`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(loc)}" />`,
      `    <lastmod>${escapeXml(route.lastmod)}</lastmod>`,
      `    <changefreq>${route.changefreq}</changefreq>`,
      `    <priority>${route.priority}</priority>`,
      `    <image:image>`,
      `      <image:loc>${escapeXml(imgUrl)}</image:loc>`,
      `      <image:title>${escapeXml(route.imageTitle)}</image:title>`,
      `      <image:caption>${escapeXml(route.imageCaption)}</image:caption>`,
      `    </image:image>`,
      `  </url>`
    );
  }

  lines.push(
    ``,
    `  <!-- ============================================== -->`,
    `  <!-- 📰 Official Climatify News & Articles (${mockBlogPosts.length} Posts) -->`,
    `  <!-- ============================================== -->`
  );

  const sortedPosts = [...mockBlogPosts].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  for (const post of sortedPosts) {
    const loc = `${SITE_URL}/blog/${post.id}`;
    const verifiedImg = resolveVerifiedPublicImage(post.image);
    const imgUrl = verifiedImg.startsWith("http") ? verifiedImg : `${SITE_URL}${verifiedImg}`;
    const priority =
      post.id === "uae-future-100-recognition" || post.id === "heliopolis-mou-signing"
        ? "0.90"
        : post.date >= "2025-01-01"
        ? "0.85"
        : "0.80";

    lines.push(
      `  <url>`,
      `    <loc>${escapeXml(loc)}</loc>`,
      `    <xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(loc)}" />`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(loc)}" />`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(loc)}" />`,
      `    <lastmod>${escapeXml(post.date)}</lastmod>`,
      `    <changefreq>monthly</changefreq>`,
      `    <priority>${priority}</priority>`,
      `    <image:image>`,
      `      <image:loc>${escapeXml(imgUrl)}</image:loc>`,
      `      <image:title>${escapeXml(post.titleEn)}</image:title>`,
      `      <image:caption>${escapeXml(post.excerptEn)}</image:caption>`,
      `    </image:image>`,
      `  </url>`
    );
  }

  lines.push(`</urlset>`, ``);
  return lines.join("\n");
}

function generateRssFeedXml(): string {
  const sortedPosts = [...mockBlogPosts].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const latestDate = sortedPosts[0]?.date ? new Date(`${sortedPosts[0].date}T12:00:00Z`).toUTCString() : new Date().toUTCString();

  const lines: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0"`,
    `     xmlns:atom="http://www.w3.org/2005/Atom"`,
    `     xmlns:dc="http://purl.org/dc/elements/1.1/"`,
    `     xmlns:content="http://purl.org/rss/1.0/modules/content/">`,
    `  <channel>`,
    `    <title>Climatify — Climate Action Digitized | المركز الإعلامي لكلايمتفاي</title>`,
    `    <link>${SITE_URL}</link>`,
    `    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />`,
    `    <description>Official news, strategic MoUs, sustainability reports, COP28 &amp; COP29 panels, and youth empowerment initiatives from Climatify UAE (Future 100 Winner).</description>`,
    `    <language>ar-AE</language>`,
    `    <lastBuildDate>${latestDate}</lastBuildDate>`,
    `    <generator>Climatify SEO Engine</generator>`,
    `    <image>`,
    `      <url>${SITE_URL}/logo-dark.png</url>`,
    `      <title>Climatify</title>`,
    `      <link>${SITE_URL}</link>`,
    `      <width>144</width>`,
    `      <height>144</height>`,
    `    </image>`,
  ];

  for (const post of sortedPosts) {
    const link = `${SITE_URL}/blog/${post.id}`;
    const pubDate = new Date(`${post.date}T10:00:00Z`).toUTCString();
    const verifiedImg = resolveVerifiedPublicImage(post.image);
    const imgUrl = verifiedImg.startsWith("http") ? verifiedImg : `${SITE_URL}${verifiedImg}`;
    const mimeType = verifiedImg.endsWith(".png")
      ? "image/png"
      : verifiedImg.endsWith(".webp")
      ? "image/webp"
      : "image/jpeg";

    lines.push(
      ``,
      `    <item>`,
      `      <title>${escapeXml(`${post.titleAr} | ${post.titleEn}`)}</title>`,
      `      <link>${escapeXml(link)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
      `      <pubDate>${pubDate}</pubDate>`,
      `      <dc:creator>${escapeXml(post.authorEn || "Climatify Media")}</dc:creator>`,
      `      <category>${escapeXml(post.categoryEn)}</category>`,
      `      <enclosure url="${escapeXml(imgUrl)}" type="${mimeType}" length="0" />`,
      `      <description>${escapeXml(`${post.excerptAr} — ${post.excerptEn}`)}</description>`,
      `    </item>`
    );
  }

  lines.push(`  </channel>`, `</rss>`, ``);
  return lines.join("\n");
}

function generateLlmsTxt(): string {
  const sortedPosts = [...mockBlogPosts].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return [
    `# Climatify (كلايمتفاي) — Official Knowledge & AI Index`,
    ``,
    `> Climatify is an award-winning climate education and youth empowerment social enterprise based in Dubai, United Arab Emirates (founded in 2023). Recognized among the UAE Future 100 winners in 2025 by the UAE Ministry of Economy & Prime Minister's Office, Climatify turns complex sustainability and climate challenges into practical, interactive learning experiences under the slogan "From Youth to Youth | من الشباب إلى الشباب".`,
    ``,
    `## Key Facts & Official Recognition`,
    `- **Official Name**: Climatify (كلايمتفاي / كلايمتيفاي)`,
    `- **Headquarters**: Dubai, United Arab Emirates (AE)`,
    `- **Founded**: 2023`,
    `- **Awards**: UAE Future 100 Winner (2025), BEEAH Future Pioneers Award Recognition (2025)`,
    `- **Official Website**: ${SITE_URL}`,
    `- **Official LinkedIn**: https://ae.linkedin.com/company/climatify-youth`,
    `- **Entrepreneur MENA Feature**: https://mena.entrepreneur.com/entrepreneurs/future-100-2025-winner-climatify`,
    `- **Contact Email**: info@climatify-youth.com`,
    ``,
    `## Executive Leadership & Co-Founders`,
    ...mockTeam.map((m) => `- **${m.nameEn} (${m.nameAr})** — ${m.roleEn} (${m.roleAr}): ${m.bioEn}`),
    ``,
    `## Core Platform Sections`,
    ...CORE_ROUTES.map((r) => `- [${r.breadcrumbEn} | ${r.breadcrumbAr}](${SITE_URL}${r.path}): ${r.descriptionEn}`),
    ``,
    `## Flagship Programs`,
    ...mockPrograms.map((p) => `- **${p.titleEn} (${p.titleAr})**: ${p.descriptionEn}`),
    ``,
    `## Certified Climate Academy Courses`,
    ...mockCourses.map((c) => `- **${c.titleEn} (${c.titleAr})** (${c.instructorEn}): ${c.descriptionEn}`),
    ``,
    `## Interactive Climate Games & Simulators`,
    ...mockGames.map((g) => `- **${g.titleEn} (${g.titleAr})**: ${g.descriptionEn}`),
    ``,
    `## Upcoming & Landmark Climate Events`,
    ...mockEvents.map((e) => `- **${e.titleEn} (${e.titleAr})** (${e.date}, ${e.locationEn}): ${e.descriptionEn}`),
    ``,
    `## Official News, Press Releases & Strategic MoUs (${sortedPosts.length} Articles)`,
    ...sortedPosts.map((p) => `- [${p.date}] [${p.titleEn}](${SITE_URL}/blog/${p.id}): ${p.excerptEn}`),
    ``,
  ].join("\n");
}

/**
 * Injects route-specific <title>, <meta name="description">, <link rel="canonical">,
 * hreflang links, Open Graph, Twitter Cards, and route-specific JSON-LD into the built
 * `dist/index.html` template and writes static pre-rendered HTML files for every route.
 */
function prerenderDistRoutes(baseHtml: string): number {
  let count = 0;

  const buildRouteHtml = (opts: {
    routePath: string;
    title: string;
    description: string;
    image: string;
    ogType: "website" | "article";
    jsonLd: Record<string, unknown>;
    noscriptHeading: string;
    noscriptBody: string;
    publishedDate?: string;
    category?: string;
  }): string => {
    const canonicalUrl = `${SITE_URL}${opts.routePath === "/" ? "/" : opts.routePath}`;
    const verifiedImg = resolveVerifiedPublicImage(opts.image);
    const fullImageUrl = verifiedImg.startsWith("http") ? verifiedImg : `${SITE_URL}${verifiedImg}`;

    let html = baseHtml;

    // 1. Replace <title>
    html = html.replace(
      /<title>[\s\S]*?<\/title>/i,
      `<title>${escapeHtmlAttr(opts.title)}</title>`
    );

    // 2. Replace meta description
    html = html.replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${escapeHtmlAttr(opts.description)}" />`
    );

    // 3. Replace canonical & hreflang links
    html = html.replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${escapeHtmlAttr(canonicalUrl)}" />\n    <link rel="alternate" hreflang="ar" href="${escapeHtmlAttr(canonicalUrl)}" />\n    <link rel="alternate" hreflang="en" href="${escapeHtmlAttr(canonicalUrl)}" />\n    <link rel="alternate" hreflang="x-default" href="${escapeHtmlAttr(canonicalUrl)}" />`
    );
    // Remove duplicate static hreflang lines if already present in template
    html = html.replace(
      /(<link rel="alternate" hreflang="x-default" href="[^"]*" \/>)\s*<link rel="alternate" hreflang="ar" href="https:\/\/climatify-youth\.com\/" \/>\s*<link rel="alternate" hreflang="en" href="https:\/\/climatify-youth\.com\/" \/>\s*<link rel="alternate" hreflang="x-default" href="https:\/\/climatify-youth\.com\/" \/>/i,
      "$1"
    );

    // 4. Replace Open Graph tags
    html = html.replace(
      /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:type" content="${opts.ogType}" />\n    <meta property="og:url" content="${escapeHtmlAttr(canonicalUrl)}" />`
    );
    html = html.replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${escapeHtmlAttr(opts.title)}" />`
    );
    html = html.replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${escapeHtmlAttr(opts.description)}" />`
    );
    html = html.replace(
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:image" content="${escapeHtmlAttr(fullImageUrl)}" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />`
    );
    html = html.replace(
      /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:image:alt" content="${escapeHtmlAttr(opts.title)}" />`
    );

    // 5. Replace Twitter tags
    html = html.replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeHtmlAttr(opts.title)}" />`
    );
    html = html.replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${escapeHtmlAttr(opts.description)}" />`
    );
    html = html.replace(
      /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:image" content="${escapeHtmlAttr(fullImageUrl)}" />`
    );

    // 6. Inject route-specific JSON-LD right before </head>
    const safeJsonLd = JSON.stringify(opts.jsonLd).replace(/</g, "\\u003c");
    const articleMeta =
      opts.ogType === "article" && opts.publishedDate
        ? `\n    <meta property="article:published_time" content="${escapeHtmlAttr(opts.publishedDate)}" />\n    <meta property="article:section" content="${escapeHtmlAttr(opts.category || "Sustainability")}" />`
        : "";
    html = html.replace(
      /<\/head>/i,
      `${articleMeta}\n    <script id="prerendered-route-schema" type="application/ld+json">${safeJsonLd}</script>\n  </head>`
    );

    // 7. Provide semantic <noscript> crawlable snapshot for zero-JS crawlers
    html = html.replace(
      /<div id="root"><\/div>/i,
      `<div id="root"></div>\n    <noscript><main><h1>${escapeHtmlAttr(opts.noscriptHeading)}</h1><p>${escapeHtmlAttr(opts.noscriptBody)}</p><p><a href="${escapeHtmlAttr(SITE_URL)}">Climatify — UAE Climate Education &amp; Youth Empowerment Platform</a></p></main></noscript>`
    );

    return html;
  };

  // Pre-render all core routes
  for (const route of CORE_ROUTES) {
    const html = buildRouteHtml({
      routePath: route.path,
      title: `${route.titleAr} | ${route.titleEn}`,
      description: `${route.descriptionAr} ${route.descriptionEn}`,
      image: route.image,
      ogType: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement:
          route.path === "/"
            ? [{ "@type": "ListItem", position: 1, name: "Climatify", item: `${SITE_URL}/` }]
            : [
                { "@type": "ListItem", position: 1, name: "Climatify", item: `${SITE_URL}/` },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: `${route.breadcrumbAr} | ${route.breadcrumbEn}`,
                  item: `${SITE_URL}${route.path}`,
                },
              ],
      },
      noscriptHeading: `${route.titleAr} — ${route.titleEn}`,
      noscriptBody: `${route.descriptionAr} — ${route.descriptionEn}`,
    });

    const outFile =
      route.path === "/"
        ? path.join(DIST_DIR, "index.html")
        : path.join(DIST_DIR, route.path.slice(1), "index.html");
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, html, "utf8");
    count++;
  }

  // Pre-render all 27 blog post routes (/blog/<id> and /media/<id>)
  for (const post of mockBlogPosts) {
    const routePath = `/blog/${post.id}`;
    const canonicalUrl = `${SITE_URL}${routePath}`;
    const verifiedImg = resolveVerifiedPublicImage(post.image);
    const fullImageUrl = verifiedImg.startsWith("http") ? verifiedImg : `${SITE_URL}${verifiedImg}`;

    const html = buildRouteHtml({
      routePath,
      title: `${post.titleAr} | ${post.titleEn} | Climatify`,
      description: `${post.excerptAr} — ${post.excerptEn}`,
      image: post.image,
      ogType: "article",
      publishedDate: post.date,
      category: post.categoryEn,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Climatify", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Media Center | المركز الإعلامي", item: `${SITE_URL}/media` },
              { "@type": "ListItem", position: 3, name: post.titleEn, item: canonicalUrl },
            ],
          },
          {
            "@type": "BlogPosting",
            headline: post.titleEn,
            alternativeHeadline: post.titleAr,
            description: post.excerptEn,
            image: [fullImageUrl],
            datePublished: post.date,
            dateModified: post.date,
            inLanguage: ["ar-AE", "en-US"],
            articleSection: post.categoryEn,
            author: {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: post.authorEn || "Climatify",
              url: SITE_URL,
            },
            publisher: {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: "Climatify",
              logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/logo-dark.png`,
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": canonicalUrl,
            },
          },
        ],
      },
      noscriptHeading: `${post.titleAr} — ${post.titleEn}`,
      noscriptBody: `${post.excerptAr}\n\n${post.excerptEn}`,
    });

    const blogFile = path.join(DIST_DIR, "blog", post.id, "index.html");
    fs.mkdirSync(path.dirname(blogFile), { recursive: true });
    fs.writeFileSync(blogFile, html, "utf8");
    count++;

    const mediaAliasFile = path.join(DIST_DIR, "media", post.id, "index.html");
    fs.mkdirSync(path.dirname(mediaAliasFile), { recursive: true });
    fs.writeFileSync(mediaAliasFile, html, "utf8");
    count++;
  }

  return count;
}

function main() {
  const sitemapXml = generateSitemapXml();
  const sitemapPath = path.join(PUBLIC_DIR, "sitemap.xml");
  fs.writeFileSync(sitemapPath, sitemapXml, "utf8");

  const rssXml = generateRssFeedXml();
  const rssPath = path.join(PUBLIC_DIR, "feed.xml");
  fs.writeFileSync(rssPath, rssXml, "utf8");

  const llmsTxt = generateLlmsTxt();
  const llmsPath = path.join(PUBLIC_DIR, "llms.txt");
  fs.writeFileSync(llmsPath, llmsTxt, "utf8");

  console.log(
    `[SEO Generator] Generated sitemap.xml (${CORE_ROUTES.length + mockBlogPosts.length} URLs), feed.xml (${mockBlogPosts.length} items), and llms.txt.`
  );

  // If dist/ exists (e.g., during `npm run build`), also copy fresh XML/txt files and pre-render static route HTMLs
  const distIndex = path.join(DIST_DIR, "index.html");
  if (fs.existsSync(distIndex)) {
    fs.copyFileSync(sitemapPath, path.join(DIST_DIR, "sitemap.xml"));
    fs.copyFileSync(rssPath, path.join(DIST_DIR, "feed.xml"));
    fs.copyFileSync(llmsPath, path.join(DIST_DIR, "llms.txt"));
    const baseHtml = fs.readFileSync(distIndex, "utf8");
    const prerenderedCount = prerenderDistRoutes(baseHtml);
    console.log(`[SEO Generator] Pre-rendered ${prerenderedCount} static route HTML files in dist/ for instant Edge indexing.`);
  }
}

main();
