import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { SEO } from "../components/common/SEO";
import { LanguageProvider } from "../context/LanguageContext";
import { mockBlogPosts } from "../services/mockData";
import sitemapXml from "../../public/sitemap.xml?raw";
import feedXml from "../../public/feed.xml?raw";
import llmsTxt from "../../public/llms.txt?raw";
import robotsTxt from "../../public/robots.txt?raw";

describe("SEO Component & Head Metadata Infrastructure", () => {
  afterEach(() => {
    cleanup();
    const script = document.getElementById("dynamic-climatify-seo-schema");
    if (script) script.remove();
  });

  const renderWithProviders = (ui: React.ReactElement, initialPath = "/") => {
    return render(
      <LanguageProvider>
        <MemoryRouter initialEntries={[initialPath]}>{ui}</MemoryRouter>
      </LanguageProvider>
    );
  };

  it("updates document title with branding", () => {
    renderWithProviders(<SEO title="البرامج والمبادرات" />);
    expect(document.title).toContain("البرامج والمبادرات");
    expect(document.title).toContain("Climatify");
  });

  it("injects canonical URL and multilingual hreflang link tags", () => {
    renderWithProviders(<SEO title="الفعاليات" />, "/events");

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical).not.toBeNull();
    expect(canonical?.getAttribute("href")).toBe("https://climatify-youth.com/events");

    const hreflangAr = document.querySelector('link[rel="alternate"][hreflang="ar"]');
    expect(hreflangAr).not.toBeNull();
    expect(hreflangAr?.getAttribute("href")).toBe("https://climatify-youth.com/events");

    const hreflangEn = document.querySelector('link[rel="alternate"][hreflang="en"]');
    expect(hreflangEn).not.toBeNull();
    expect(hreflangEn?.getAttribute("href")).toBe("https://climatify-youth.com/events");

    const hreflangDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
    expect(hreflangDefault).not.toBeNull();
    expect(hreflangDefault?.getAttribute("href")).toBe("https://climatify-youth.com/events");
  });

  it("injects Open Graph and Twitter metadata", () => {
    renderWithProviders(
      <SEO
        title="أكاديمية كلايمتفاي"
        description="مساقات بيئية متقدمة لتمكين الشباب."
        image="/brand/academy-banner.jpg"
      />,
      "/learning-hub"
    );

    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle?.getAttribute("content")).toContain("أكاديمية كلايمتفاي");

    const ogDesc = document.querySelector('meta[property="og:description"]');
    expect(ogDesc?.getAttribute("content")).toBe("مساقات بيئية متقدمة لتمكين الشباب.");

    const ogImage = document.querySelector('meta[property="og:image"]');
    expect(ogImage?.getAttribute("content")).toBe("https://climatify-youth.com/brand/academy-banner.jpg");

    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    expect(twitterCard?.getAttribute("content")).toBe("summary_large_image");
  });

  it("injects BreadcrumbList and BlogPosting JSON-LD schemas", () => {
    renderWithProviders(
      <SEO
        title="شراكة استراتيجية جديدة"
        description="تفاصيل مذكرة التفاهم مع جامعة هليوبوليس."
        article={{
          datePublished: "2026-09-01",
          author: "فريق كلايمتفاي",
          section: "بيانات صحفية"
        }}
        breadcrumbs={[
          { name: "الرئيسية", path: "/" },
          { name: "المركز الإعلامي", path: "/media" },
          { name: "مذكرة التفاهم", path: "/media/heliopolis" }
        ]}
      />,
      "/media/heliopolis"
    );

    const script = document.getElementById("dynamic-climatify-seo-schema");
    expect(script).not.toBeNull();
    expect(script?.textContent).toBeDefined();

    const json = JSON.parse(script!.textContent!);
    expect(Array.isArray(json)).toBe(true);

    const breadcrumbSchema = json.find((item: { "@type": string }) => item["@type"] === "BreadcrumbList");
    expect(breadcrumbSchema).toBeDefined();
    expect(breadcrumbSchema.itemListElement).toHaveLength(3);

    const articleSchema = json.find((item: { "@type": string }) => item["@type"] === "BlogPosting");
    expect(articleSchema).toBeDefined();
    expect(articleSchema.headline).toContain("شراكة استراتيجية جديدة");
    expect(articleSchema.author.name).toBe("فريق كلايمتفاي");
  });

  it("safely escapes HTML characters in JSON-LD to prevent script tag injection", () => {
    renderWithProviders(
      <SEO
        title="Testing </script><script>alert('xss')</script>"
        description="Testing <tag> sanitization in structured data"
      />
    );

    const script = document.getElementById("dynamic-climatify-seo-schema");
    expect(script).not.toBeNull();
    // Raw script text should not contain literal unescaped '<'
    expect(script?.textContent).not.toContain("</script>");
  });

  it("injects custom schemas like Event and Course rich snippets", () => {
    const sampleEventSchema = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Climatify Youth Summit 2026",
      startDate: "2026-11-15",
    };

    renderWithProviders(
      <SEO
        title="Youth Summit"
        schema={sampleEventSchema}
      />
    );

    const script = document.getElementById("dynamic-climatify-seo-schema");
    expect(script).not.toBeNull();
    const parsed = JSON.parse(script!.textContent!);
    expect(parsed["@type"]).toBe("Event");
    expect(parsed.name).toBe("Climatify Youth Summit 2026");
  });

  it("supports canonicalPath override and noindex protection for Soft-404 prevention", () => {
    renderWithProviders(
      <SEO
        title="مقال تجريبي"
        canonicalPath="/blog/heliopolis-mou-signing"
      />,
      "/media/heliopolis-mou-signing"
    );

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(
      "https://climatify-youth.com/blog/heliopolis-mou-signing"
    );

    cleanup();

    renderWithProviders(<SEO title="404 Not Found" noindex />, "/unknown-url");
    const robots = document.querySelector('meta[name="robots"]');
    const googlebot = document.querySelector('meta[name="googlebot"]');
    expect(robots?.getAttribute("content")).toBe("noindex, nofollow");
    expect(googlebot?.getAttribute("content")).toBe("noindex, nofollow");
  });

  it("verifies sitemap.xml, feed.xml, llms.txt, and robots.txt have 100% completeness", () => {
    // 1. All 27 blog posts must be in sitemap.xml, feed.xml, and llms.txt
    for (const post of mockBlogPosts) {
      const postUrl = `https://climatify-youth.com/blog/${post.id}`;
      expect(sitemapXml).toContain(`<loc>${postUrl}</loc>`);
      expect(feedXml).toContain(`<link>${postUrl}</link>`);
      expect(llmsTxt).toContain(postUrl);
    }

    // 2. Every <image:loc> in sitemap.xml must be a valid https://climatify-youth.com/ URL
    const imageLocMatches = [...sitemapXml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)];
    expect(imageLocMatches.length).toBe(12 + mockBlogPosts.length);

    for (const match of imageLocMatches) {
      const url = match[1]!;
      expect(url.startsWith("https://climatify-youth.com/")).toBe(true);
    }

    // 3. Every <url> block in sitemap.xml must include ar, en, and x-default hreflang
    const urlBlocks = [...sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/g)];
    expect(urlBlocks.length).toBe(12 + mockBlogPosts.length);
    for (const block of urlBlocks) {
      const content = block[1]!;
      expect(content).toContain('hreflang="ar"');
      expect(content).toContain('hreflang="en"');
      expect(content).toContain('hreflang="x-default"');
    }

    // 4. robots.txt references sitemap.xml and allows llms.txt & feed.xml
    expect(robotsTxt).toContain("Sitemap: https://climatify-youth.com/sitemap.xml");
    expect(robotsTxt).toContain("Allow: /llms.txt");
    expect(robotsTxt).toContain("Allow: /feed.xml");
  });
});

