import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  canonicalPath?: string;
  noindex?: boolean;
  article?: {
    datePublished?: string;
    dateModified?: string;
    author?: string;
    section?: string;
  };
  breadcrumbs?: { name: string; path: string }[];
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

const rawSiteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();
export const SITE_URL =
  rawSiteUrl && /^https?:\/\//i.test(rawSiteUrl)
    ? rawSiteUrl.replace(/\/+$/, "")
    : "https://climatify-youth.com";
const DEFAULT_IMAGE = `${SITE_URL}/future-100-recognition.jpg`;

const DEFAULT_DESCRIPTION_AR =
  "كلايمتفاي (Climatify) مؤسسة مجتمعية وشركة ناشئة إماراتية فائزة بجائزة Future 100 لعام 2025 من وزارة الاقتصاد ومكتب رئاسة مجلس الوزراء، تجمع بين الرقمنة المناخية وتمكين الشباب والتعليم البيئي التفاعلي.";

const DEFAULT_DESCRIPTION_EN =
  "Climatify is an award-winning UAE climate education and youth empowerment social enterprise (Future 100 winner) transforming climate action and sustainability into interactive learning experiences.";

const DEFAULT_KEYWORDS_AR = [
  "كلايمتفاي",
  "Climatify",
  "التعليم المناخي",
  "تمكين الشباب في الإمارات",
  "الاستدامة في الإمارات",
  "Future 100 UAE",
  "العمل المناخي والرقمنة",
  "برنامج SHIFT",
  "AgriClash",
  "الهاكاثون المناخي",
  "COP28",
  "COP29",
  "أسبوع الاستدامة",
];

const DEFAULT_KEYWORDS_EN = [
  "Climatify",
  "Climate education UAE",
  "Youth empowerment Dubai",
  "Future 100 UAE Winner",
  "Climate digitization",
  "Sustainability startup UAE",
  "SHIFT Program",
  "AgriClash environmental game",
  "COP28 UAE",
  "COP29 Baku",
  "Climate Hackathons MENA",
];

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  canonicalPath,
  noindex = false,
  article,
  breadcrumbs,
  schema,
}) => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const location = useLocation();

  const effectivePath = canonicalPath || location.pathname;
  const normalizedPath = effectivePath === "/" ? "/" : effectivePath.replace(/\/+$/, "");
  const canonicalUrl = `${SITE_URL}${normalizedPath === "/" ? "/" : normalizedPath}`;

  const resolvedTitle = title
    ? `${title} | Climatify — ${
        isAr ? "التعليم المناخي وتمكين الشباب في الإمارات" : "Climate Education & Youth Empowerment UAE"
      }`
    : isAr
    ? "Climatify — من الشباب إلى الشباب | الفائز بجائزة Future 100 في دولة الإمارات"
    : "Climatify — From Youth to Youth | UAE Future 100 Winner & Climate Education";

  const resolvedDescription = description || (isAr ? DEFAULT_DESCRIPTION_AR : DEFAULT_DESCRIPTION_EN);
  const resolvedKeywords = keywords && keywords.length > 0 ? keywords : isAr ? DEFAULT_KEYWORDS_AR : DEFAULT_KEYWORDS_EN;
  const resolvedImage = image ? (image.startsWith("http") ? image : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`) : DEFAULT_IMAGE;

  useEffect(() => {
    // 1. Update Document Title
    const previousTitle = document.title;
    document.title = resolvedTitle;

    // Helper to get or create a meta tag
    const setMetaTag = (attr: "name" | "property", key: string, content: string) => {
      let tag = document.querySelector(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // Helper to get or create a link tag
    const setLinkTag = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]:not([hreflang])`;
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement("link");
        tag.setAttribute("rel", rel);
        if (hreflang) tag.setAttribute("hreflang", hreflang);
        document.head.appendChild(tag);
      }
      tag.setAttribute("href", href);
    };

    const robotsValue = noindex
      ? "noindex, nofollow"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

    // 2. Set Core Meta Tags
    setMetaTag("name", "description", resolvedDescription);
    setMetaTag("name", "keywords", resolvedKeywords.join(", "));
    setMetaTag("name", "author", "Climatify");
    setMetaTag("name", "robots", robotsValue);
    setMetaTag("name", "googlebot", robotsValue);

    // 3. Set Canonical & Multilingual Hreflang Tags
    setLinkTag("canonical", canonicalUrl);
    setLinkTag("alternate", canonicalUrl, "ar");
    setLinkTag("alternate", canonicalUrl, "en");
    setLinkTag("alternate", canonicalUrl, "x-default");

    // 4. Open Graph (Facebook, LinkedIn, Slack, Telegram, WhatsApp)
    setMetaTag("property", "og:type", article ? "article" : "website");
    setMetaTag("property", "og:title", resolvedTitle);
    setMetaTag("property", "og:description", resolvedDescription);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:image", resolvedImage);
    setMetaTag("property", "og:image:alt", resolvedTitle);
    setMetaTag("property", "og:image:width", "1200");
    setMetaTag("property", "og:image:height", "630");
    setMetaTag("property", "og:site_name", "Climatify");
    setMetaTag("property", "og:locale", isAr ? "ar_AE" : "en_US");
    setMetaTag("property", "og:locale:alternate", isAr ? "en_US" : "ar_AE");

    if (article) {
      if (article.datePublished) setMetaTag("property", "article:published_time", article.datePublished);
      if (article.dateModified) setMetaTag("property", "article:modified_time", article.dateModified);
      if (article.author) setMetaTag("property", "article:author", article.author);
      if (article.section) setMetaTag("property", "article:section", article.section);
    }

    // 5. Twitter Card
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:site", "@Climatify");
    setMetaTag("name", "twitter:title", resolvedTitle);
    setMetaTag("name", "twitter:description", resolvedDescription);
    setMetaTag("name", "twitter:image", resolvedImage);
    setMetaTag("name", "twitter:image:alt", resolvedTitle);

    // 6. JSON-LD Dynamic Structured Data (remove static build-time schema to avoid duplicates)
    document.getElementById("prerendered-route-schema")?.remove();
    const jsonLdId = "dynamic-climatify-seo-schema";
    let scriptTag = document.getElementById(jsonLdId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = jsonLdId;
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }

    const structuredDataItems: Record<string, unknown>[] = [];

    // BreadcrumbList Schema
    if (!noindex && breadcrumbs && breadcrumbs.length > 0) {
      structuredDataItems.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: b.name,
          item: `${SITE_URL}${b.path === "/" ? "/" : b.path}`,
        })),
      });
    }

    // Article Schema
    if (!noindex && article) {
      structuredDataItems.push({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title || resolvedTitle,
        description: resolvedDescription,
        image: [resolvedImage],
        datePublished: article.datePublished || new Date().toISOString(),
        dateModified: article.dateModified || article.datePublished || new Date().toISOString(),
        inLanguage: isAr ? "ar-AE" : "en-US",
        articleSection: article.section || "Climate Action & Sustainability",
        keywords: resolvedKeywords.join(", "),
        author: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: article.author || "Climatify",
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
        isPartOf: {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
      });
    }

    // Custom Schemas
    if (!noindex && schema) {
      if (Array.isArray(schema)) {
        structuredDataItems.push(...schema);
      } else {
        structuredDataItems.push(schema);
      }
    }

    if (structuredDataItems.length > 0) {
      const rawJson = JSON.stringify(
        structuredDataItems.length === 1 ? structuredDataItems[0] : structuredDataItems
      );
      // Escape '<' to prevent closing the script tag or HTML injection
      scriptTag.text = rawJson.replace(/</g, "\\u003c");
    } else {
      scriptTag.text = "";
    }

    return () => {
      document.title = previousTitle;
      const el = document.getElementById(jsonLdId);
      if (el) el.remove();
    };
  }, [
    title,
    resolvedTitle,
    resolvedDescription,
    resolvedKeywords,
    resolvedImage,
    canonicalUrl,
    noindex,
    isAr,
    article,
    breadcrumbs,
    schema,
  ]);

  return null;
};
