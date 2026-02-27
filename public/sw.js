/**
 * Service Worker — offline-first caching strategy.
 * 
 * Cache strategy:
 * - Pages: network-first (show fresh content, fallback to cache)
 * - Static assets (images, JS, CSS): cache-first
 * - API: network-only (never cache dynamic data)
 * - Offline fallback: /offline page
 */

const CACHE_NAME = "visualizer-v1";
const OFFLINE_URL = "/offline";

const PRECACHE_URLS = [
  "/",
  "/products",
  "/offline",
  "/manifest.json",
];

/* ── Install: precache shell ── */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

/* ── Activate: clean up old caches ── */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

/* ── Fetch: routing strategy ── */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // API — always network-only
  if (url.pathname.startsWith("/api/")) return;

  // Static assets — cache-first
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".woff2")
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) => cached ?? fetch(request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return res;
        }),
      ),
    );
    return;
  }

  // Pages — network-first with offline fallback
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return res;
      })
      .catch(() =>
        caches.match(request).then(
          (cached) => cached ?? caches.match(OFFLINE_URL),
        ),
      ),
  );
});
