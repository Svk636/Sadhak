/**
 * साधक · Sadhak — Service Worker v2.0
 * Production-grade offline-first service worker
 * Strategy: App Shell (cache-first) + Network-first for API calls
 */

'use strict';

/* ── Version — bump this string on every deployment ── */
const CACHE_VERSION  = 'sadhak-v2.0.0';
const STATIC_CACHE   = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE  = `${CACHE_VERSION}-runtime`;
const OFFLINE_URL    = './index.html';

/* ── App Shell — files cached on install ── */
const APP_SHELL = [
  './index.html',
  './manifest.json',
  './icons/favicon.svg',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './icons/apple-touch-icon.svg',
];

/* ── External CDN resources cached at runtime ── */
const CDN_ORIGINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://cdnjs.cloudflare.com',
];

/* ════════════════════════════════════════════
   INSTALL — Cache App Shell
   ════════════════════════════════════════════ */
self.addEventListener('install', (event) => {
  console.log('[साधक SW] Installing', CACHE_VERSION);

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[साधक SW] Pre-caching app shell');
        return cache.addAll(APP_SHELL);
      })
      .then(() => {
        /* Skip the waiting phase immediately so the new SW activates
           as soon as the old one is no longer controlling any clients. */
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[साधक SW] Install pre-cache failed:', err);
        /* Don't block installation on CDN failures */
        return self.skipWaiting();
      })
  );
});

/* ════════════════════════════════════════════
   ACTIVATE — Clean old caches, claim clients
   ════════════════════════════════════════════ */
self.addEventListener('activate', (event) => {
  console.log('[साधक SW] Activating', CACHE_VERSION);

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        const deletions = cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== RUNTIME_CACHE)
          .map((name) => {
            console.log('[साधक SW] Deleting old cache:', name);
            return caches.delete(name);
          });
        return Promise.all(deletions);
      })
      .then(() => {
        console.log('[साधक SW] Claiming all clients');
        return self.clients.claim();
      })
  );
});

/* ════════════════════════════════════════════
   FETCH — Routing Strategy
   ════════════════════════════════════════════ */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* ── Skip non-GET and cross-origin API calls ── */
  if (request.method !== 'GET') return;

  /* ── AI / Groq API — always network only, never cache ── */
  if (url.hostname === 'api.groq.com' || url.hostname === 'api.anthropic.com') {
    event.respondWith(fetch(request).catch(() => new Response(
      JSON.stringify({ error: 'offline' }),
      { headers: { 'Content-Type': 'application/json' } }
    )));
    return;
  }

  /* ── CDN resources (fonts, jsPDF, html2canvas) — stale-while-revalidate ── */
  if (CDN_ORIGINS.some((origin) => request.url.startsWith(origin))) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
    return;
  }

  /* ── App Shell — cache first, network fallback ── */
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirstWithNetworkFallback(request));
    return;
  }

  /* ── Everything else — network first ── */
  event.respondWith(networkFirstWithCacheFallback(request));
});

/* ════════════════════════════════════════════
   MESSAGE — Handle skipWaiting from page
   ════════════════════════════════════════════ */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[साधक SW] skipWaiting requested by client');
    self.skipWaiting();
  }
});

/* ════════════════════════════════════════════
   STRATEGIES
   ════════════════════════════════════════════ */

/**
 * Cache first, fall back to network, then offline fallback.
 * Used for app shell files (index.html, icons, manifest).
 */
async function cacheFirstWithNetworkFallback(request) {
  try {
    const cached = await caches.match(request);
    if (cached) return cached;

    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (_err) {
    /* Offline — serve the app shell */
    const offlineResponse = await caches.match(OFFLINE_URL);
    if (offlineResponse) return offlineResponse;
    return new Response('साधक is offline. Please check your connection.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

/**
 * Stale-while-revalidate: serve from cache immediately, update in background.
 * Used for CDN fonts and libraries.
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => null);

  return cached || networkPromise;
}

/**
 * Network first, fall back to cache.
 * Used for dynamic/external resources.
 */
async function networkFirstWithCacheFallback(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (_err) {
    const cached = await cache.match(request);
    return cached || new Response('Network error', { status: 503 });
  }
}
