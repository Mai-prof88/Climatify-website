/**
 * Unified High-Concurrency Request Coordinator
 *
 * Shared across both `baseApiService` (REST / Mock) and `supabaseService` (Supabase SDK)
 * to guarantee:
 * 1. Sub-millisecond LRU + TTL response caching (`DEFAULT_TTL_MS = 60s`, `MAX_CACHE_ENTRIES = 500`).
 * 2. In-flight GET request coalescing (thundering-herd protection under 5,000+ simultaneous reads).
 * 3. Bounded outbound concurrency queue (`MAX_CONCURRENT_REQUESTS = 20`) with active-slot timeout
 *    protection (`ACTIVE_TASK_TIMEOUT_MS = 20s`) so stalled sockets can never deadlock the queue.
 * 4. Generation-stamped cache writes (`globalCacheEpoch` + per-key invalidation) eliminating
 *    cross-user cache poisoning on logout and stale read-during-mutation races.
 * 5. In-flight identical mutation deduplication (double-click & concurrent duplicate submit guard).
 * 6. Lazy code-split loading of `mockData.ts` (~280 kB) so production bundles never block first paint.
 */

export type MockDataModule = typeof import("./mockData");

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export const DEFAULT_TTL_MS = 60_000;
export const MAX_CONCURRENT_REQUESTS = 20;
export const MAX_CACHE_ENTRIES = 500;
export const MAX_QUEUE_SIZE = 25_000;
export const ACTIVE_TASK_TIMEOUT_MS = 20_000;
export const NO_DEDUPE_PAYLOAD = Symbol("no-dedupe-payload");

const apiCache = new Map<string, CacheEntry<unknown>>();
const inFlightReads = new Map<string, Promise<unknown>>();
const inFlightMutations = new Map<string, Promise<unknown>>();
const keyEpochs = new Map<string, number>();
let globalCacheEpoch = 0;

type QueueTask = () => Promise<void>;
const requestQueue: QueueTask[] = [];

function currentKeyEpoch(key: string): number {
  return keyEpochs.get(key) ?? 0;
}

function bumpKeyEpoch(key: string): void {
  keyEpochs.set(key, (keyEpochs.get(key) ?? 0) + 1);
  if (keyEpochs.size > MAX_CACHE_ENTRIES * 4) {
    const oldest = keyEpochs.keys().next().value;
    if (oldest !== undefined) keyEpochs.delete(oldest);
  }
}

function setBoundedCacheEntry(key: string, entry: CacheEntry<unknown>): void {
  if (apiCache.has(key)) {
    apiCache.delete(key);
  } else if (apiCache.size >= MAX_CACHE_ENTRIES) {
    // Opportunistically purge expired items first, otherwise evict LRU oldest
    const now = Date.now();
    for (const [k, v] of apiCache) {
      if (now - v.timestamp >= DEFAULT_TTL_MS) {
        apiCache.delete(k);
        if (apiCache.size < MAX_CACHE_ENTRIES) break;
      }
    }
    if (apiCache.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = apiCache.keys().next().value;
      if (oldestKey !== undefined) {
        apiCache.delete(oldestKey);
      }
    }
  }
  apiCache.set(key, entry);
}

function withActiveTimeout<T>(fn: () => Promise<T>): Promise<T> {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  return new Promise<T>((resolve, reject) => {
    timerId = setTimeout(() => {
      reject(new Error(`Request timed out after ${ACTIVE_TASK_TIMEOUT_MS}ms`));
    }, ACTIVE_TASK_TIMEOUT_MS);

    Promise.resolve()
      .then(fn)
      .then(
        (val) => {
          if (timerId !== null) clearTimeout(timerId);
          resolve(val);
        },
        (err) => {
          if (timerId !== null) clearTimeout(timerId);
          reject(err);
        }
      );
  });
}

export const apiMetrics = {
  totalCalls: 0,
  cacheHits: 0,
  coalescedHits: 0,
  networkRequests: 0,
  queuedRequests: 0,
  activeRequests: 0,
  dedupedMutations: 0,
  reset() {
    this.totalCalls = 0;
    this.cacheHits = 0;
    this.coalescedHits = 0;
    this.networkRequests = 0;
    this.queuedRequests = 0;
    this.activeRequests = 0;
    this.dedupedMutations = 0;
    globalCacheEpoch++;
    apiCache.clear();
    inFlightReads.clear();
    inFlightMutations.clear();
    keyEpochs.clear();
    requestQueue.length = 0;
  },
};

function processNextQueueTask(): void {
  while (apiMetrics.activeRequests < MAX_CONCURRENT_REQUESTS && requestQueue.length > 0) {
    const task = requestQueue.shift();
    if (!task) break;
    apiMetrics.activeRequests++;
    task().finally(() => {
      apiMetrics.activeRequests--;
      processNextQueueTask();
    });
  }
}

export function enqueueRequest<T>(fn: () => Promise<T>): Promise<T> {
  if (apiMetrics.activeRequests < MAX_CONCURRENT_REQUESTS) {
    apiMetrics.activeRequests++;
    return withActiveTimeout(fn).finally(() => {
      apiMetrics.activeRequests--;
      processNextQueueTask();
    });
  }

  if (requestQueue.length >= MAX_QUEUE_SIZE) {
    return Promise.reject(new Error("Client request queue is full; please retry momentarily."));
  }

  apiMetrics.queuedRequests++;
  return new Promise<T>((resolve, reject) => {
    requestQueue.push(async () => {
      try {
        resolve(await withActiveTimeout(fn));
      } catch (err) {
        reject(err);
      }
    });
  });
}

/**
 * Clear cached GET responses AND invalidate matching in-flight reads so
 * stale/cross-user responses in flight can never populate `apiCache`.
 */
export function clearApiCache(endpointPrefix?: string): void {
  if (!endpointPrefix) {
    globalCacheEpoch++;
    apiCache.clear();
    inFlightReads.clear();
    keyEpochs.clear();
    return;
  }
  for (const key of Array.from(apiCache.keys())) {
    if (key.startsWith(endpointPrefix)) {
      apiCache.delete(key);
      bumpKeyEpoch(key);
    }
  }
  for (const key of Array.from(inFlightReads.keys())) {
    if (key.startsWith(endpointPrefix)) {
      inFlightReads.delete(key);
      bumpKeyEpoch(key);
    }
  }
}

const CMS_RESOURCES = new Set([
  "programs",
  "initiatives",
  "events",
  "courses",
  "games",
  "opportunities",
  "posts",
  "team",
  "careers",
  "carbon-questions",
  "settings",
]);

const PUBLIC_FORM_ENDPOINTS = new Set([
  "/contact",
  "/meetings",
  "/partnerships",
  "/workshops",
  "/opportunities/apply",
  "/newsletter/subscribe",
]);

/**
 * Targeted cache invalidation:
 * - Public contact/form submissions only invalidate `/admin` (preserving warm public CMS caches).
 * - Analytics tracking does not invalidate caches.
 * - Event registrations & cancellations invalidate `/admin`, `/user`, and `/events`.
 * - Member mutations (`/user/*`, `/auth/*`) invalidate `/user` and `/admin`.
 * - Admin CMS mutations (`/admin/<resource>*`) invalidate `/admin`, `/user`, and `/<resource>`.
 */
export function invalidateMutationCache(endpoint: string): void {
  if (endpoint === "/ai/chat" || endpoint === "/analytics/pageview") {
    return;
  }

  if (PUBLIC_FORM_ENDPOINTS.has(endpoint)) {
    clearApiCache("/admin");
    return;
  }

  if (
    endpoint === "/events/register" ||
    endpoint.startsWith("/user/events") ||
    endpoint.startsWith("/admin/event-registrations")
  ) {
    clearApiCache("/admin");
    clearApiCache("/user");
    clearApiCache("/events");
    return;
  }

  if (endpoint.startsWith("/user/") || endpoint.startsWith("/auth/")) {
    clearApiCache("/user");
    clearApiCache("/admin");
    return;
  }

  if (endpoint.startsWith("/admin/")) {
    clearApiCache("/admin");
    clearApiCache("/user");
    const segments = endpoint.split("/").filter(Boolean);
    const resource = segments[1];
    if (resource && CMS_RESOURCES.has(resource)) {
      clearApiCache(`/${resource}`);
    }
    return;
  }

  clearApiCache();
}

function stablePayloadKey(value: unknown, seen = new WeakSet<object>()): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return `${typeof value}:${String(value)}`;
  }
  if (value instanceof Date) {
    return `date:${value.getTime()}`;
  }
  if (typeof File !== "undefined" && value instanceof File) {
    return `file:${value.name}:${value.size}:${value.lastModified}`;
  }
  if (typeof Blob !== "undefined" && value instanceof Blob) {
    return `blob:${value.size}:${value.type}`;
  }
  if (typeof value === "object") {
    if (seen.has(value)) return "[Circular]";
    seen.add(value);
    try {
      if (Array.isArray(value)) {
        return `[${value.map((item) => stablePayloadKey(item, seen)).join(",")}]`;
      }
      const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
        a.localeCompare(b)
      );
      return `{${entries
        .map(([k, v]) => `${JSON.stringify(k)}:${stablePayloadKey(v, seen)}`)
        .join(",")}}`;
    } finally {
      seen.delete(value);
    }
  }
  return String(value);
}

/**
 * Execute a read operation with bounded 60s LRU+TTL cache, in-flight request coalescing,
 * epoch-stamped write protection, and bounded concurrency queue. Failed reads are never cached.
 */
export function executeCachedRead<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  ttlMs = DEFAULT_TTL_MS
): Promise<T> {
  apiMetrics.totalCalls++;

  const cached = apiCache.get(cacheKey);
  if (cached) {
    if (Date.now() - cached.timestamp < ttlMs) {
      apiMetrics.cacheHits++;
      // Refresh LRU position
      apiCache.delete(cacheKey);
      apiCache.set(cacheKey, cached);
      return Promise.resolve(cached.data as T);
    }
    apiCache.delete(cacheKey);
  }

  const activePromise = inFlightReads.get(cacheKey);
  if (activePromise) {
    apiMetrics.coalescedHits++;
    return activePromise as Promise<T>;
  }

  const startGlobalEpoch = globalCacheEpoch;
  const startKeyEpoch = currentKeyEpoch(cacheKey);

  const requestPromise = enqueueRequest(() => {
    apiMetrics.networkRequests++;
    return fetcher().then((data) => {
      // Only cache if neither a global reset/logout nor a targeted mutation invalidated this key while in flight
      if (globalCacheEpoch === startGlobalEpoch && currentKeyEpoch(cacheKey) === startKeyEpoch) {
        setBoundedCacheEntry(cacheKey, { data, timestamp: Date.now() });
      }
      return data;
    });
  }).finally(() => {
    if (inFlightReads.get(cacheKey) === requestPromise) {
      inFlightReads.delete(cacheKey);
    }
  });

  inFlightReads.set(cacheKey, requestPromise);
  return requestPromise;
}

/**
 * Execute a mutation with in-flight duplicate-submission coalescing,
 * bounded concurrency queue, and pre/post targeted cache invalidation.
 */
export function executeMutation<T>(
  method: string,
  endpoint: string,
  payloadKey: unknown,
  mutator: () => Promise<T>
): Promise<T> {
  apiMetrics.totalCalls++;
  invalidateMutationCache(endpoint);

  const shouldDedupe = payloadKey !== NO_DEDUPE_PAYLOAD;
  const dedupeKey = shouldDedupe ? `${method}:${endpoint}:${stablePayloadKey(payloadKey)}` : "";

  if (shouldDedupe) {
    const activeMutation = inFlightMutations.get(dedupeKey);
    if (activeMutation) {
      apiMetrics.coalescedHits++;
      apiMetrics.dedupedMutations++;
      return activeMutation as Promise<T>;
    }
  }

  const mutationPromise = enqueueRequest(() => {
    apiMetrics.networkRequests++;
    return mutator().then((result) => {
      invalidateMutationCache(endpoint);
      return result;
    });
  }).finally(() => {
    if (shouldDedupe && inFlightMutations.get(dedupeKey) === mutationPromise) {
      inFlightMutations.delete(dedupeKey);
    }
  });

  if (shouldDedupe) {
    inFlightMutations.set(dedupeKey, mutationPromise);
  }

  return mutationPromise;
}

let mockDataCache: MockDataModule | null = null;
let mockDataPromise: Promise<MockDataModule> | null = null;

/**
 * Lazy singleton loader for `mockData.ts` (~280 kB).
 * Splits mock fixtures into a separate async chunk so cold page loads never parse fallback data upfront.
 */
export function loadMockData(): Promise<MockDataModule> {
  if (mockDataCache) {
    return Promise.resolve(mockDataCache);
  }
  if (!mockDataPromise) {
    mockDataPromise = import("./mockData")
      .then((mod) => {
        mockDataCache = mod;
        return mod;
      })
      .catch((err) => {
        mockDataPromise = null;
        throw err;
      });
  }
  return mockDataPromise;
}
