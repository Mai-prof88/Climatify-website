import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  apiMetrics,
  clearApiCache,
  enqueueRequest,
  executeCachedRead,
  executeMutation,
  loadMockData,
  MAX_CONCURRENT_REQUESTS,
  NO_DEDUPE_PAYLOAD,
} from "./requestCoordinator";
import {
  _resetPrefetchStateForTests,
  prefetchPortfolioShowcase,
  prefetchRoute,
} from "../utils/routePrefetch";
import schemaSql from "../../supabase/migrations/001_initial_schema.sql?raw";

describe("Unified High-Concurrency Request Coordinator & Edge Cases", () => {
  beforeEach(() => {
    apiMetrics.reset();
    clearApiCache();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("coalesces simultaneous identical reads and serves subsequent reads from TTL cache", async () => {
    let executions = 0;
    const fetcher = () =>
      new Promise<string[]>((res) => {
        executions++;
        setTimeout(() => res(["alpha", "beta"]), 15);
      });

    const burst = await Promise.all(
      Array.from({ length: 25 }, () => executeCachedRead("/events", fetcher, 5_000))
    );

    expect(executions).toBe(1);
    expect(apiMetrics.networkRequests).toBe(1);
    expect(apiMetrics.coalescedHits).toBe(24);
    expect(burst.every((items) => items.length === 2)).toBe(true);

    // Subsequent call within TTL hits memory cache in 0ms without re-invoking fetcher
    const cachedResult = await executeCachedRead("/events", fetcher, 5_000);
    expect(cachedResult).toEqual(["alpha", "beta"]);
    expect(executions).toBe(1);
    expect(apiMetrics.cacheHits).toBe(1);
  });

  it("re-fetches cleanly after TTL expiration and never caches rejected reads", async () => {
    let attempts = 0;
    const flakyFetcher = async () => {
      attempts++;
      if (attempts === 1) {
        throw new Error("Transient network timeout");
      }
      return { ok: true, attempt: attempts };
    };

    await expect(executeCachedRead("/programs", flakyFetcher, 50)).rejects.toThrow(
      "Transient network timeout"
    );
    expect(apiMetrics.cacheHits).toBe(0);

    // Immediate retry must NOT receive a cached rejection
    const recovered = await executeCachedRead("/programs", flakyFetcher, 50);
    expect(recovered).toEqual({ ok: true, attempt: 2 });

    // Wait past 50ms TTL and verify cache expiry triggers fresh read
    await new Promise((r) => setTimeout(r, 65));
    const refreshed = await executeCachedRead("/programs", flakyFetcher, 50);
    expect(refreshed).toEqual({ ok: true, attempt: 3 });
  });

  it("enforces MAX_CONCURRENT_REQUESTS ceiling under heavy parallel burst even with mixed rejections", async () => {
    let activeNow = 0;
    let peakActive = 0;

    const tasks = Array.from({ length: 65 }, (_, index) =>
      enqueueRequest(async () => {
        activeNow++;
        peakActive = Math.max(peakActive, activeNow);
        await new Promise((r) => setTimeout(r, 5));
        activeNow--;
        if (index % 13 === 0) {
          throw new Error(`Expected failure #${index}`);
        }
        return index;
      })
    );

    const settled = await Promise.allSettled(tasks);
    const fulfilled = settled.filter((s) => s.status === "fulfilled");
    const rejected = settled.filter((s) => s.status === "rejected");

    expect(peakActive).toBeLessThanOrEqual(MAX_CONCURRENT_REQUESTS);
    expect(peakActive).toBe(MAX_CONCURRENT_REQUESTS);
    expect(fulfilled.length).toBe(60);
    expect(rejected.length).toBe(5);
    expect(apiMetrics.activeRequests).toBe(0);
    expect(apiMetrics.queuedRequests).toBe(65 - MAX_CONCURRENT_REQUESTS);
  });

  it("deduplicates rapid identical mutations regardless of key order or shared DAG refs while keeping distinct payloads separate", async () => {
    let submitCount = 0;
    const sharedMeta = { source: "mobile", campaign: "cop28" };

    const mutator = () =>
      new Promise<{ id: string }>((res) => {
        const id = `msg-${++submitCount}`;
        setTimeout(() => res({ id }), 20);
      });

    // Different key orders + shared DAG object reference representing the exact same logical payload
    const p1 = executeMutation(
      "POST",
      "/contact",
      { email: "ali@climatify.org", name: "Ali", metaA: sharedMeta, metaB: sharedMeta },
      mutator
    );
    const p2 = executeMutation(
      "POST",
      "/contact",
      {
        name: "Ali",
        metaB: { campaign: "cop28", source: "mobile" },
        metaA: { source: "mobile", campaign: "cop28" },
        email: "ali@climatify.org",
      },
      mutator
    );
    // Distinct payload (string "1" vs number 1, and different Date timestamps)
    const p3 = executeMutation(
      "POST",
      "/contact",
      { count: "1", at: new Date("2026-05-01T00:00:00Z") },
      mutator
    );
    const p4 = executeMutation(
      "POST",
      "/contact",
      { count: 1, at: new Date("2026-05-01T00:00:00Z") },
      mutator
    );
    const p5 = executeMutation(
      "POST",
      "/contact",
      { count: 1, at: new Date("2026-06-01T00:00:00Z") },
      mutator
    );

    const [r1, r2, r3, r4, r5] = await Promise.all([p1, p2, p3, p4, p5]);

    expect(r1).toEqual(r2);
    expect(apiMetrics.dedupedMutations).toBe(1);
    expect(submitCount).toBe(4);
    expect(new Set([r1.id, r3.id, r4.id, r5.id]).size).toBe(4);

    // Subsequent identical submission AFTER completion must execute normally
    const afterCompletion = await executeMutation(
      "POST",
      "/contact",
      { name: "Ali", email: "ali@climatify.org", metaA: sharedMeta, metaB: sharedMeta },
      mutator
    );
    expect(afterCompletion.id).toBe("msg-5");
  });

  it("handles circular payload references, NO_DEDUPE_PAYLOAD, and failed mutation retries cleanly", async () => {
    const circular: Record<string, unknown> = { user: "sara" };
    circular.self = circular;

    let circularRuns = 0;
    const [c1, c2] = await Promise.all([
      executeMutation("POST", "/meetings", circular, async () => {
        circularRuns++;
        await new Promise((r) => setTimeout(r, 10));
        return "ok";
      }),
      executeMutation("POST", "/meetings", circular, async () => {
        circularRuns++;
        return "ok";
      }),
    ]);
    expect(c1).toBe("ok");
    expect(c2).toBe("ok");
    expect(circularRuns).toBe(1);

    // NO_DEDUPE_PAYLOAD never coalesces concurrent calls
    let nonDedupedRuns = 0;
    await Promise.all([
      executeMutation("POST", "/ai/chat", NO_DEDUPE_PAYLOAD, async () => ++nonDedupedRuns),
      executeMutation("POST", "/ai/chat", NO_DEDUPE_PAYLOAD, async () => ++nonDedupedRuns),
    ]);
    expect(nonDedupedRuns).toBe(2);

    // Failed mutation cleans up inFlightMutations so immediate retry succeeds
    let flakyRuns = 0;
    const flakyMutator = async () => {
      flakyRuns++;
      if (flakyRuns === 1) throw new Error("Temporary 503");
      return "saved";
    };
    await expect(
      executeMutation("POST", "/workshops", { school: "Dubai Academy" }, flakyMutator)
    ).rejects.toThrow("Temporary 503");
    await expect(
      executeMutation("POST", "/workshops", { school: "Dubai Academy" }, flakyMutator)
    ).resolves.toBe("saved");
  });

  it("applies targeted cache invalidation so public form writes never trigger public CMS cache stampedes", async () => {
    let eventsFetches = 0;
    let programsFetches = 0;
    let adminFetches = 0;

    await executeCachedRead("/events", async () => [`ev-${++eventsFetches}`]);
    await executeCachedRead("/programs", async () => [`pr-${++programsFetches}`]);
    await executeCachedRead("/admin/submissions", async () => [`sub-${++adminFetches}`]);

    // 1. Public contact submission invalidates /admin/* ONLY — /events and /programs stay warm!
    await executeMutation("POST", "/contact", { email: "visitor@uae.ae" }, async () => ({
      success: true,
    }));

    await executeCachedRead("/events", async () => [`ev-${++eventsFetches}`]);
    await executeCachedRead("/programs", async () => [`pr-${++programsFetches}`]);
    await executeCachedRead("/admin/submissions", async () => [`sub-${++adminFetches}`]);

    expect(eventsFetches).toBe(1);
    expect(programsFetches).toBe(1);
    expect(adminFetches).toBe(2);

    // 2. Admin event update invalidates /admin and /events, keeping /programs warm!
    await executeMutation("PUT", "/admin/events/e1", { titleEn: "Updated" }, async () => ({
      id: "e1",
    }));

    await executeCachedRead("/events", async () => [`ev-${++eventsFetches}`]);
    await executeCachedRead("/programs", async () => [`pr-${++programsFetches}`]);
    expect(eventsFetches).toBe(2);
    expect(programsFetches).toBe(1);
  });

  it("lazy-loads mockData as a cached singleton module", async () => {
    const [m1, m2] = await Promise.all([loadMockData(), loadMockData()]);
    expect(m1).toBe(m2);
    expect(Array.isArray(m1.mockEvents)).toBe(true);
    expect(Array.isArray(m1.mockBlogPosts)).toBe(true);
  });

  it("skips route/showcase prefetching on Data-Saver or 2G connections, deduplicates 4G prefetches, and ignores unknown paths", () => {
    _resetPrefetchStateForTests();
    const origConnection = (navigator as Navigator & { connection?: unknown }).connection;
    try {
      Object.defineProperty(navigator, "connection", {
        configurable: true,
        value: { saveData: true, effectiveType: "4g" },
      });
      expect(prefetchRoute("/about")).toBe(false);
      expect(prefetchPortfolioShowcase()).toBe(false);

      Object.defineProperty(navigator, "connection", {
        configurable: true,
        value: { saveData: false, effectiveType: "2g" },
      });
      expect(prefetchRoute("/events")).toBe(false);
      expect(prefetchPortfolioShowcase()).toBe(false);

      Object.defineProperty(navigator, "connection", {
        configurable: true,
        value: { saveData: false, effectiveType: "4g" },
      });
      expect(prefetchRoute("/unknown-nonexistent-route?foo=1#bar")).toBe(false);
      expect(prefetchRoute("/blog/sample-post?utm=1#top")).toBe(true);
      // Duplicate normalized route (/blog/*) must not re-dispatch
      expect(prefetchRoute("/blog/another-post")).toBe(false);
      expect(prefetchPortfolioShowcase()).toBe(true);
      expect(prefetchPortfolioShowcase()).toBe(false);
    } finally {
      _resetPrefetchStateForTests();
      Object.defineProperty(navigator, "connection", {
        configurable: true,
        value: origConnection,
      });
    }
  });

  it("verifies PostgreSQL atomic stats RPC and high-concurrency indexes in 001_initial_schema.sql", () => {
    expect(schemaSql).toMatch(/create or replace function public\.increment_user_stats\(/i);
    expect(schemaSql).toMatch(/on conflict \(user_id\) do update/i);
    expect(schemaSql).toMatch(
      /uq_newsletter_email[\s\S]*lower\(email\)[\s\S]*where kind = 'newsletter'/i
    );
    expect(schemaSql).toMatch(/create index on public\.content_items \(kind, created_at desc\)/i);
    expect(schemaSql).toMatch(
      /create index on public\.user_activities \(user_id, created_at desc\)/i
    );
    expect(schemaSql).toMatch(
      /create index on public\.contact_messages \(is_read\) where is_read = false/i
    );
  });
});
