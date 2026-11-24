import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { apiService, clearApiCache } from "../services/api";
import { executeCachedRead } from "../services/requestCoordinator";
import { useAuthStore } from "../store/useAuthStore";
import { useCMSStore } from "../store/useCMSStore";
import { postSection, opportunitySection, teamSection } from "../pages/Admin/content/sections";
import { SEO } from "../components/common/SEO";
import { LanguageProvider } from "../context/LanguageContext";
import hardeningSql from "../../supabase/migrations/003_production_hardening.sql?raw";

describe("Production Hardening, Admin CMS Parity & Edge Reliability Suite", () => {
  beforeEach(() => {
    cleanup();
    clearApiCache();
    useAuthStore.setState({
      isAuthenticated: false,
      token: null,
      adminEmail: null,
      isMemberAuthenticated: false,
      memberToken: null,
      demoSignedOut: false,
      profile: null,
      stats: { ecoPoints: 240, virtualTrees: 3, earnedBadges: 2 },
      spentEcoPoints: 0,
      recentActivities: [],
      registeredCourses: [],
      registeredEvents: [],
      completedCourseIds: [],
      carbonCreditAwarded: false,
      loading: false,
      error: null,
    });
  });

  it("prevents stale in-flight reads from poisoning cache across clearApiCache() epoch boundaries", async () => {
    let resolveSlowRead!: (val: string) => void;
    const slowPromise = executeCachedRead(
      "/user/profile-epoch-test",
      () =>
        new Promise<string>((resolve) => {
          resolveSlowRead = resolve;
        })
    );

    // Let the concurrency queue start the task microtask
    await Promise.resolve();

    // User logs out while read is in-flight -> global cache epoch increments
    clearApiCache();
    resolveSlowRead("user-A-private-data");
    const firstResult = await slowPromise;
    expect(firstResult).toBe("user-A-private-data");

    // Next user reading the same key MUST NOT receive User A's stale cached result
    const secondResult = await executeCachedRead(
      "/user/profile-epoch-test",
      async () => "user-B-fresh-data"
    );
    expect(secondResult).toBe("user-B-fresh-data");
  });

  it("persists virtual tree point deductions across loadUserProfile reloads (no infinite free trees)", async () => {
    const planted = useAuthStore.getState().plantVirtualTree("شجرة الغاف", "Ghaf Tree", 40);
    expect(planted).toBe(true);
    expect(useAuthStore.getState().stats?.ecoPoints).toBe(200);
    expect(useAuthStore.getState().stats?.virtualTrees).toBe(4);

    // Reloading profile must NOT resurrect spent 40 points back to 240
    await useAuthStore.getState().loadUserProfile();
    expect(useAuthStore.getState().stats?.ecoPoints).toBe(200);
    expect(useAuthStore.getState().stats?.virtualTrees).toBe(4);
  });

  it("returns valid ticketCode on event registration and valid ISO issuedAt on course certificates", async () => {
    const uniqueEmail = `ticket-check-${Date.now()}@climatify-youth.com`;
    const reg = await useAuthStore.getState().registerForEvent(
      {
        id: "shift-cohort-2027-forum",
        titleAr: "ملتقى SHIFT 2027",
        titleEn: "SHIFT 2027 Forum",
        date: "2027-02-20",
      },
      { name: "Layla", email: uniqueEmail, phone: "+971501234567" }
    );
    expect(reg.ok).toBe(true);
    expect(reg.ticketCode).toMatch(/^CLM-/);

    const cert = await apiService.issueCertificate("course-shift-internship");
    expect(cert.certificateId).toContain("COURSE");
    expect(Number.isNaN(Date.parse(cert.issuedAt))).toBe(false);
  });

  it("syncs Admin Settings (siteName, contactEmail, enableMaintenance) live to public readers", async () => {
    const res = await useCMSStore.getState().saveSettings({
      siteName: "Climatify UAE",
      contactEmail: "hello@climatify-youth.com",
      enableMaintenance: true,
    });
    expect(res.ok).toBe(true);

    const publicSettings = await apiService.getPublicSettings();
    expect(publicSettings).toEqual({
      siteName: "Climatify UAE",
      contactEmail: "hello@climatify-youth.com",
      enableMaintenance: true,
    });

    // Restore default settings
    await useCMSStore.getState().saveSettings({
      siteName: "Climatify",
      contactEmail: "info@climatify-youth.com",
      enableMaintenance: false,
    });
  });

  it("validates Admin CMS section field completeness (Article date, Opportunity type, Team category/bio)", () => {
    expect(postSection.fields.some((f) => f.name === "date" && f.required)).toBe(true);
    expect(opportunitySection.emptyForm().type).toBe("Volunteering");

    const teamPayload = teamSection.toPayload({
      nameAr: "سارة المزروعي",
      nameEn: "Sara Al Mazrouei",
      roleAr: "منسقة البرامج",
      roleEn: "Programs Coordinator",
      bioAr: "نبذة بالعربية",
      bioEn: "Bio in English",
      category: "intern",
      image: "/ambassadors/salma-nagy.webp",
    });
    expect(teamPayload.category).toBe("intern");
    expect(teamPayload.bioAr).toBe("نبذة بالعربية");
    expect(teamPayload.bioEn).toBe("Bio in English");
  });

  it("removes build-time #prerendered-route-schema on client SEO hydration to avoid duplicate JSON-LD", () => {
    const prerendered = document.createElement("script");
    prerendered.id = "prerendered-route-schema";
    prerendered.type = "application/ld+json";
    prerendered.textContent = '{"@type":"WebPage"}';
    document.head.appendChild(prerendered);

    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/about"]}>
          <SEO
            title="About Us"
            breadcrumbs={[
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ]}
          />
        </MemoryRouter>
      </LanguageProvider>
    );

    expect(document.getElementById("prerendered-route-schema")).toBeNull();
    expect(document.getElementById("dynamic-climatify-seo-schema")).not.toBeNull();
  });

  it("includes atomic security & gamification RPCs in 003_production_hardening.sql", () => {
    expect(hardeningSql).toContain("public.redeem_virtual_tree");
    expect(hardeningSql).toContain("public.record_carbon_footprint");
    expect(hardeningSql).toContain("public.issue_course_certificate");
    expect(hardeningSql).toContain("public.verify_certificate");
    expect(hardeningSql).toContain("public.guard_profile_self_update");
    expect(hardeningSql).toContain("public.is_active_user");
  });
});
