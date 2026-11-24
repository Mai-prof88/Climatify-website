/**
 * Smart Route & Modal Chunk Prefetcher
 *
 * Preloads code-split route chunks on hover/focus/touchStart so page transitions
 * feel instantaneous (0ms network wait), while respecting Data-Saver and 2G connections.
 */

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
};

function canPrefetchOnCurrentNetwork(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  if (!conn) return true;
  if (conn.saveData === true) return false;
  if (conn.effectiveType === "slow-2g" || conn.effectiveType === "2g") return false;
  return true;
}

const ROUTE_IMPORTERS: Record<string, () => Promise<unknown>> = {
  "/": () => import("../pages/Home/Home"),
  "/portfolio": () => import("../pages/Portfolio/Portfolio"),
  "/about": () => import("../pages/About/About"),
  "/programs": () => import("../pages/Programs/Programs"),
  "/events": () => import("../pages/Events/Events"),
  "/learning-hub": () => import("../pages/LearningHub/LearningHub"),
  "/media": () => import("../pages/Media/Media"),
  "/blog": () => import("../pages/Media/PostDetail"),
  "/contact": () => import("../pages/Contact/Contact"),
  "/games": () => import("../pages/GamesHub/GamesHub"),
  "/opportunities": () => import("../pages/Opportunities/Opportunities"),
  "/portals": () => import("../pages/Portals/Portals"),
  "/brand": () => import("../pages/Brand/Brand"),
  "/dashboard": () => import("../pages/Dashboard/Dashboard"),
  "/login": () => import("../pages/Auth/MemberLogin"),
  "/register": () => import("../pages/Auth/MemberRegister"),
  "/admin": () => import("../pages/Admin/AdminLayout"),
};

const prefetchedKeys = new Set<string>();

function normalizeRouteKey(rawPath: string): string {
  const clean = (rawPath.split("?")[0]?.split("#")[0] || "/").trim();
  if (clean === "/" || clean === "") return "/";
  if (clean.startsWith("/blog/") || clean.startsWith("/media/")) return "/blog";
  if (clean.startsWith("/admin")) return "/admin";
  return clean.endsWith("/") ? clean.slice(0, -1) : clean;
}

export function prefetchRoute(path: string): boolean {
  if (!canPrefetchOnCurrentNetwork()) return false;
  const key = normalizeRouteKey(path);
  if (prefetchedKeys.has(key)) return false;
  const importer = ROUTE_IMPORTERS[key];
  if (!importer) return false;
  prefetchedKeys.add(key);
  void importer().catch(() => {
    prefetchedKeys.delete(key);
  });
  return true;
}

let showcasePrefetched = false;

export function prefetchPortfolioShowcase(): boolean {
  if (showcasePrefetched || !canPrefetchOnCurrentNetwork()) return false;
  showcasePrefetched = true;
  void import("../components/PortfolioShowcase/FullScreenShowcase").catch(() => {
    showcasePrefetched = false;
  });
  return true;
}

export function _resetPrefetchStateForTests(): void {
  prefetchedKeys.clear();
  showcasePrefetched = false;
}
