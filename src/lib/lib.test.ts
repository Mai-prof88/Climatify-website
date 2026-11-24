import { describe, it, expect } from "vitest";
import { sanitizeUrl, toCsvField, buildCsv, toLocalDateInput } from "../lib/utils/sanitize";
import { slugId, ticketCode, certificateId } from "../lib/utils/ids";
import { validateEntity } from "../lib/validators/content";
import { isValidEmail, isValidDate, isValidTime } from "../lib/validators/forms";
import { getSupabase, isSupabaseConfigured } from "../lib/supabase/client";
import { supabaseService } from "../services/supabaseApi";
import schemaSql from "../../supabase/migrations/001_initial_schema.sql?raw";
import storageSql from "../../supabase/migrations/002_storage_setup.sql?raw";
import seedSql from "../../supabase/seed.sql?raw";

describe("lib/utils/sanitize", () => {
  it("sanitizeUrl blocks javascript:", () => expect(sanitizeUrl("javascript:alert(1)")).toBe("#invalid-url"));
  it("sanitizeUrl allows https", () => expect(sanitizeUrl("https://example.com/a.png")).toBe("https://example.com/a.png"));
  it("sanitizeUrl allows /", () => expect(sanitizeUrl("/logo-dark.png")).toBe("/logo-dark.png"));
  it("toCsvField guards formula", () => {
    const v = toCsvField("=cmd");
    expect(v.includes("'")).toBe(true);
  });
  it("buildCsv has BOM", () => expect(buildCsv(["a"],[["b"]]).charCodeAt(0)).toBe(0xFEFF));
  it("toLocalDateInput format", () => expect(toLocalDateInput(new Date(2026,0,15))).toBe("2026-01-15"));
});
describe("lib/utils/ids", () => {
  it("slugId unique", () => expect(slugId()).not.toBe(slugId()));
  it("ticketCode prefix", () => expect(ticketCode().startsWith("CLM-")).toBe(true));
  it("certificateId contains course", () => expect(certificateId("abc")).toContain("ABC"));
});
describe("lib/validators/content", () => {
  it("validates program", () => expect(validateEntity("programs", { titleEn: "a", titleAr: "ب", descriptionEn: "d", descriptionAr: "و", icon: "Leaf" })).toBeNull());
  it("fails missing title", () => expect(validateEntity("programs", { titleEn: "", titleAr: "ب", descriptionEn: "d", descriptionAr: "و", icon: "Leaf" })).not.toBeNull());
  it("accepts blob: and https:// image URLs on initiatives", () => {
    expect(
      validateEntity("initiatives", {
        titleEn: "Init",
        titleAr: "مبادرة",
        descriptionEn: "Desc",
        descriptionAr: "وصف",
        image: "blob:https://climatify-youth.com/1234-5678",
        categoryEn: "Cat",
        categoryAr: "فئة",
        progress: 50,
      })
    ).toBeNull();
    expect(
      validateEntity("initiatives", {
        titleEn: "Init",
        titleAr: "مبادرة",
        descriptionEn: "Desc",
        descriptionAr: "وصف",
        image: "javascript:alert(1)",
        categoryEn: "Cat",
        categoryAr: "فئة",
        progress: 50,
      })
    ).not.toBeNull();
  });
  it("unknown kind passes", () => expect(validateEntity("unknown", {})).toBeNull());
});
describe("lib/validators/forms", () => {
  it("email valid", () => expect(isValidEmail("a@b.com")).toBe(true));
  it("email invalid", () => expect(isValidEmail("bad")).toBe(false));
  it("date valid", () => expect(isValidDate("2026-12-01")).toBe(true));
  it("date invalid", () => expect(isValidDate("not-a-date")).toBe(false));
  it("time valid", () => expect(isValidTime("14:30")).toBe(true));
});
describe("supabase client (no keys -> mock fallback)", () => {
  it("isSupabaseConfigured is false without env", () => expect(isSupabaseConfigured).toBe(false));
  it("getSupabase returns null without env", () => expect(getSupabase()).toBeNull());
  it("supabaseService falls back to mock data", async () => {
    const programs = await supabaseService.getPrograms();
    expect(Array.isArray(programs)).toBe(true);
    expect(programs.length).toBeGreaterThan(0);
  });
});

describe("Supabase SQL schema, RLS & seed.sql integrity", () => {

  it("verifies every INSERT column in seed.sql exists in 001_initial_schema.sql", () => {
    const tableColumns = new Map<string, Set<string>>();
    const createTableRegex = /create\s+table\s+public\.([a-z_]+)\s*\(([\s\S]*?)\);/gi;
    let match: RegExpExecArray | null;
    while ((match = createTableRegex.exec(schemaSql)) !== null) {
      const tableName = match[1]!;
      const body = match[2]!;
      const cols = new Set<string>();
      for (const rawLine of body.split("\n")) {
        const line = rawLine.trim().replace(/--.*$/, "").trim();
        if (!line || /^(primary|unique|check|constraint|foreign)\b/i.test(line)) continue;
        const colMatch = /^([a-z_]+)\s+/i.exec(line);
        if (colMatch?.[1]) cols.add(colMatch[1].toLowerCase());
      }
      tableColumns.set(tableName, cols);
    }

    expect(tableColumns.size).toBe(17);

    const insertRegex = /insert\s+into\s+public\.([a-z_]+)\s*\(([^)]+)\)/gi;
    let insMatch: RegExpExecArray | null;
    let insertCount = 0;
    while ((insMatch = insertRegex.exec(seedSql)) !== null) {
      insertCount++;
      const table = insMatch[1]!;
      const cols = insMatch[2]!.split(",").map((c) => c.trim().toLowerCase());
      const schemaCols = tableColumns.get(table);
      expect(schemaCols, `Table public.${table} not found in 001_initial_schema.sql`).toBeDefined();
      for (const col of cols) {
        expect(
          schemaCols!.has(col),
          `Column "${col}" in seed.sql INSERT INTO public.${table} does not exist in 001_initial_schema.sql (valid columns: ${Array.from(schemaCols!).join(", ")})`
        ).toBe(true);
      }
    }
    expect(insertCount).toBeGreaterThanOrEqual(15);
  });

  it("enforces ON UPDATE CASCADE on foreign keys referencing public.profiles(id) so handle_new_user() never fails", () => {
    expect(schemaSql).toMatch(/user_id\s+uuid\s+references\s+public\.profiles\(id\)\s+on\s+update\s+cascade\s+on\s+delete\s+set\s+null/i);
    expect(schemaSql).toMatch(/user_id\s+uuid\s+primary\s+key\s+references\s+public\.profiles\(id\)\s+on\s+update\s+cascade\s+on\s+delete\s+cascade/i);
    expect(schemaSql).toContain("public.can_update_own_profile(id, role, status)");
  });

  it("restricts storage media mutations strictly to public.is_admin() and blocks SVG XSS", () => {
    const activeStorageSql = storageSql.replace(/--.*$/gm, "");
    expect(activeStorageSql).not.toContain("image/svg+xml");
    expect(activeStorageSql).not.toMatch(/auth\.role\(\)\s*=\s*'authenticated'\s+or\s+public\.is_admin\(\)/i);
    expect(activeStorageSql).toMatch(/bucket_id\s*=\s*'media'\s+and\s+public\.is_admin\(\)/i);
  });
});

