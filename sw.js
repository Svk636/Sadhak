/* ═══════════════════════════════════════════════════════════════════
   साधक · Service Worker · v1
   Cache strategy:
     • Shell assets (HTML, manifest, icons) → Cache-first, updated on install
     • Google Fonts CSS                       → Stale-while-revalidate
     • CDN scripts (jspdf, html2canvas)       → Cache-first (immutable versions)
     • Groq API / other network calls         → Network-only (never cache)
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

const CACHE_VERSION   = 'v1';
const SHELL_CACHE     = 'sadhak-shell-v1';
const FONT_CACHE      = 'sadhak-fonts-v1';
const CDN_CACHE       = 'sadhak-cdn-v1';

/* ── Files that must be available offline ── */
const SHELL_URLS = [
  './sadhak.html',
  './manifest.json',
  './icons/favicon.svg',
  './icons/apple-touch-icon.svg',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
];

/* ── CDN scripts cached on first fetch ── */
const CDN_ORIGINS = [
  'cdnjs.cloudflare.com',
];

/* ── Domains that must always go to the network ── */
const NETWORK_ONLY_ORIGINS = [
  'api.groq.com',
  'api.anthropic.com',
];

/* ─────────────────────────────────────────────────────────────────
   INSTALL — pre-cache the shell
───────────────────────────────────────────────────────────────── */
self.addEventListener('install', function (event) {
  console.log('[साधक SW ' + CACHE_VERSION + '] Installing…');
  event.waitUntil(
    caches.open(SHELL_CACHE).then(function (cache) {
      return cache.addAll(SHELL_URLS).catch(function (err) {
        /* Don't let a single missing icon abort install */
        console.warn('[साधक SW] Shell pre-cache partial failure:', err);
      });
    }).then(function () {
      /* Skip waiting so the new SW activates immediately */
      return self.skipWaiting();
    })
  );
});

/* ─────────────────────────────────────────────────────────────────
   ACTIVATE — delete stale caches from previous versions
───────────────────────────────────────────────────────────────── */
self.addEventListener('activate', function (event) {
  console.log('[साधक SW ' + CACHE_VERSION + '] Activating…');
  const keepCaches = [SHELL_CACHE, FONT_CACHE, CDN_CACHE];
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return !keepCaches.includes(key);
        }).map(function (key) {
          console.log('[साधक SW] Deleting old cache:', key);
          return caches.delete(key);
        })
      );
    }).then(function () {
      /* Claim all open clients so they use this SW immediately */
      return self.clients.claim();
    })
  );
});

/* ─────────────────────────────────────────────────────────────────
   FETCH — route requests to the right strategy
───────────────────────────────────────────────────────────────── */
self.addEventListener('fetch', function (event) {
  var request = event.request;
  var url;

  /* Ignore non-GET and non-http(s) requests */
  if (request.method !== 'GET') return;
  try { url = new URL(request.url); } catch (e) { return; }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return;

  /* 1 ── Network-only: API calls must never be served from cache */
  if (NETWORK_ONLY_ORIGINS.some(function (o) { return url.hostname === o; })) {
    event.respondWith(fetch(request));
    return;
  }

  /* 2 ── Google Fonts CSS → Stale-while-revalidate */
  if (url.hostname === 'fonts.googleapis.com') {
    event.respondWith(staleWhileRevalidate(request, FONT_CACHE));
    return;
  }

  /* 3 ── Google Fonts files → Cache-first (font binaries don't change) */
  if (url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, FONT_CACHE));
    return;
  }

  /* 4 ── CDN scripts → Cache-first (versioned URLs are immutable) */
  if (CDN_ORIGINS.some(function (o) { return url.hostname === o; })) {
    event.respondWith(cacheFirst(request, CDN_CACHE));
    return;
  }

  /* 5 ── Shell assets → Cache-first */
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request, SHELL_CACHE));
    return;
  }

  /* 6 ── Everything else → Network with cache fallback */
  event.respondWith(networkWithCacheFallback(request, SHELL_CACHE));
});

/* ─────────────────────────────────────────────────────────────────
   STRATEGY HELPERS
───────────────────────────────────────────────────────────────── */

/**
 * Cache-first: serve from cache; if missing, fetch, cache, return.
 */
function cacheFirst(request, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (cached) {
      if (cached) return cached;
      return fetch(request).then(function (response) {
        if (response && response.status === 200) {
          cache.put(request, response.clone());
        }
        return response;
      }).catch(function () {
        /* Offline and not cached — return a fallback for navigations */
        if (request.destination === 'document') {
          return caches.match('./sadhak.html');
        }
        return new Response('', { status: 503, statusText: 'Offline' });
      });
    });
  });
}

/**
 * Stale-while-revalidate: serve cached immediately; refresh in background.
 */
function staleWhileRevalidate(request, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (cached) {
      var networkFetch = fetch(request).then(function (response) {
        if (response && response.status === 200) {
          cache.put(request, response.clone());
        }
        return response;
      }).catch(function () { return cached; });

      return cached || networkFetch;
    });
  });
}

/**
 * Network-first with cache fallback: try network, fall back to cache.
 */
function networkWithCacheFallback(request, cacheName) {
  return fetch(request).then(function (response) {
    if (response && response.status === 200) {
      caches.open(cacheName).then(function (cache) {
        cache.put(request, response.clone());
      });
    }
    return response;
  }).catch(function () {
    return caches.match(request).then(function (cached) {
      if (cached) return cached;
      if (request.destination === 'document') {
        return caches.match('./sadhak.html');
      }
      return new Response('', { status: 503, statusText: 'Offline' });
    });
  });
}

/* ─────────────────────────────────────────────────────────────────
   MESSAGE — allow the page to trigger SW updates
───────────────────────────────────────────────────────────────── */
self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CACHE_VERSION_REQUEST') {
    event.source && event.source.postMessage({
      type: 'CACHE_VERSION',
      version: CACHE_VERSION,
      caches: [SHELL_CACHE, FONT_CACHE, CDN_CACHE],
    });
  }
});
