import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const rawToggle = import.meta.env.VITE_USE_SUPABASE as string | undefined;

const url = rawUrl?.trim();
const anonKey = rawAnonKey?.trim();
const explicitlyDisabled = rawToggle?.trim().toLowerCase() === "false";

export const isSupabaseConfigured = Boolean(
  !explicitlyDisabled &&
    url &&
    anonKey &&
    url.length > 0 &&
    anonKey.length > 0 &&
    /^https?:\/\//i.test(url)
);

const SUPABASE_FETCH_TIMEOUT_MS = 18_000;

/**
 * Bounded-timeout fetch wrapper so stalled mobile / captive-portal TCP sockets
 * never hang outbound requests indefinitely under high concurrency.
 */
const fetchWithTimeout: typeof fetch = async (input, init) => {
  if (init?.signal) {
    return fetch(input, init);
  }
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), SUPABASE_FETCH_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timerId);
  }
};

let _client: SupabaseClient<Database> | null = null;
let _clientPromise: Promise<SupabaseClient<Database> | null> | null = null;

/**
 * Returns the already-initialized Supabase client synchronously, or `null` if
 * Supabase is not configured or has not finished lazy initialization yet.
 */
export function getSupabase(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured || !url || !anonKey) return null;
  return _client;
}

/**
 * Lazily imports `@supabase/supabase-js` into its own async chunk so cold first-paint
 * bundles stay ultra-small (~80 kB) even when Supabase keys are active on Vercel.
 */
export function loadSupabase(): Promise<SupabaseClient<Database> | null> {
  if (!isSupabaseConfigured || !url || !anonKey) {
    return Promise.resolve(null);
  }
  if (_client) {
    return Promise.resolve(_client);
  }
  if (!_clientPromise) {
    _clientPromise = import("@supabase/supabase-js")
      .then(({ createClient }) => {
        _client = createClient<Database>(url, anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
          global: {
            fetch: fetchWithTimeout,
          },
        });
        return _client;
      })
      .catch((err) => {
        _clientPromise = null;
        console.error("[Supabase] Failed to initialize Supabase client:", err);
        return null;
      });
  }
  return _clientPromise;
}

export const supabase: SupabaseClient<Database> | null = null;
