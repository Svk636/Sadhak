/**
 * साधक · Service Worker · v1.0.0
 * Strategy:
 *   - HTML        → Network-first  (always fresh, fall back to cache)
 *   - CDN assets  → Cache-first    (jsPDF, html2canvas — immutable)
 *   - Fonts       → Cache-first    (Google Fonts — stable URLs)
 *   - Icons/misc  → Stale-while-revalidate
 */

'use strict';

const CACHE_VERSION = 'sadhak-v1.0.0';
const PRECACHE_URLS = [
  './',
  './manifest.json',
  './icons/favicon.svg',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './icons/apple-touch-icon.svg',
];

/* ─── INSTALL ─────────────────────────────────────────────────────────────── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .catch(err => console.warn('[SW] Pre-cache partial failure (expected on first cold install):', err))
  );
  // Don't skipWaiting here — let the update banner ask the user.
});

/* ─── ACTIVATE ────────────────────────────────────────────────────────────── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names
          .filter(name => name !== CACHE_VERSION)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      ))
      .then(() => self.clients.claim())
  );
});

/* ─── MESSAGES ────────────────────────────────────────────────────────────── */
self.addEventListener('message', event => {
  if (!event.data) return;

  // Update banner → user tapped "अपडेट करा"
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/* ─── FETCH ───────────────────────────────────────────────────────────────── */
self.addEventListener('fetch', event => {
  const req = event.request;

  // Only handle GET requests over http(s)
  if (req.method !== 'GET') return;
  if (!req.url.startsWith('http')) return;

  const url = new URL(req.url);

  /* 1. Google Fonts — Cache-first (fonts are content-hashed / stable) */
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(cacheFirst(req, CACHE_VERSION));
    return;
  }

  /* 2. CDN scripts (jsPDF, html2canvas) — Cache-first (versioned URLs) */
  if (url.hostname === 'cdnjs.cloudflare.com') {
    event.respondWith(cacheFirst(req, CACHE_VERSION));
    return;
  }

  /* 3. Anthropic API calls — pass through, never cache */
  if (url.hostname === 'api.anthropic.com') {
    return; // let browser handle it natively
  }

  /* 4. Main HTML shell — Network-first (always try for fresh app) */
  if (
    url.pathname === '/' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('/')
  ) {
    event.respondWith(networkFirst(req, CACHE_VERSION));
    return;
  }

  /* 5. Manifest + Icons + SW itself — Cache-first */
  if (
    url.pathname.endsWith('.json') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.includes('/icons/')
  ) {
    event.respondWith(cacheFirst(req, CACHE_VERSION));
    return;
  }

  /* 6. Everything else — Stale-while-revalidate */
  event.respondWith(staleWhileRevalidate(req, CACHE_VERSION));
});

/* ─── STRATEGY HELPERS ────────────────────────────────────────────────────── */

/**
 * Cache-first: serve from cache immediately, populate cache on miss.
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok) {
      cache.put(request, fresh.clone()); // background write
    }
    return fresh;
  } catch (err) {
    console.warn('[SW] cacheFirst: fetch failed and no cache hit for', request.url);
    return new Response('Offline — resource not cached.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

/**
 * Network-first: try network, fall back to cache if offline.
 */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok) {
      cache.put(request, fresh.clone()); // update cache
    }
    return fresh;
  } catch (_) {
    const cached = await cache.match(request);
    if (cached) return cached;

    // Last resort — try matching without query string
    const stripped = new Request(request.url.split('?')[0]);
    const fallback = await cache.match(stripped);
    return fallback || new Response(
      '<!DOCTYPE html><html lang="mr"><head><meta charset="utf-8"><title>साधक · Offline</title>' +
      '<style>body{font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;height:100dvh;' +
      'margin:0;background:#FAFAF8;color:#111110;flex-direction:column;gap:12px;text-align:center;padding:24px;}' +
      'h1{font-size:28px;font-weight:300;}p{font-size:13px;color:#888;letter-spacing:1px;}</style></head>' +
      '<body><h1>साधक</h1><p>You are offline.<br/>The app will load once your connection is restored.</p></body></html>',
      { status: 200, headers: { 'Content-Type': 'text/html;charset=utf-8' } }
    );
  }
}

/**
 * Stale-while-revalidate: serve cache immediately while fetching a refresh in
 * the background.
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then(fresh => {
      if (fresh && fresh.ok) cache.put(request, fresh.clone());
      return fresh;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}
