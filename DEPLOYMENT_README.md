# साधक · v5.0 — Deployment Guide

> Bug-free, offline-capable PWA. Deploy in under 5 minutes.

---

## Required File Structure

```
project-root/
├── index.html          ← main app (bug-fixed)
├── manifest.json       ← PWA manifest
├── sw.js               ← Service Worker
└── icons/              ← ⚠ MUST be inside this subfolder
    ├── favicon.svg
    ├── apple-touch-icon.svg
    ├── icon-192.svg
    └── icon-512.svg
```

> **Critical:** All four icon files must live inside an `icons/` subfolder.
> Both `index.html` and `manifest.json` reference them as `icons/filename.svg`.

---

## Bug Fixes Applied to `index.html`

Three bugs were found and fixed before deployment:

| # | Bug | Fix |
|---|-----|-----|
| 1 | **SW update auto-reloaded** before the "Update available" toast was visible to the user | Added a 2500 ms delay before `SKIP_WAITING` so the user can read the notification |
| 2 | **`showToast` duration param ignored** — the final global override discarded the `ms` argument, so the 8000 ms update toast always disappeared after 2200 ms | Added `ms` param to the last `showToast` definition; it now falls back to 2200 ms only when unspecified |
| 3 | **Skill Map showed 21 skills** despite the app having 32 | Added all 11 missing Classical skills + a new CLASSICAL layer to `PRESET_NAMES` and `PRESET_LAYERS` |

---

## `manifest.json` — Recommended Addition

Add an `"id"` field for stable PWA identity (required by Chrome 111+ for proper install tracking):

```json
{
  "id": "/",
  "name": "साधक — Mindful Productivity",
  "short_name": "साधक",
  ...
}
```

Your current manifest works without it, but Chrome may generate a random ID on each install.

---

## Deployment Options

### Option A — Static file host (simplest)

Any host that serves files with correct MIME types works. Pick one:

| Host | Command / Steps | HTTPS | Free |
|------|----------------|-------|------|
| **Netlify** | Drag-drop the folder onto netlify.com/drop | ✅ auto | ✅ |
| **Vercel** | `npx vercel --prod` from project root | ✅ auto | ✅ |
| **GitHub Pages** | Push to `gh-pages` branch; enable in repo Settings | ✅ auto | ✅ |
| **Cloudflare Pages** | Connect GitHub repo or `wrangler pages publish .` | ✅ auto | ✅ |
| **Firebase Hosting** | `firebase deploy` | ✅ auto | ✅ |

### Option B — Self-hosted (nginx)

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    root /var/www/sadhak;
    index index.html;

    # ── Required MIME types ──────────────────────────────
    types {
        image/svg+xml   svg svgz;
        text/javascript js mjs;
    }

    # ── Service Worker: must NOT be cached by the browser ─
    location = /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Service-Worker-Allowed "/";
    }

    # ── Manifest: short cache ────────────────────────────
    location = /manifest.json {
        add_header Cache-Control "public, max-age=86400";
    }

    # ── Static assets: long cache ────────────────────────
    location ~* \.(svg|js|css|woff2)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # ── Security headers ─────────────────────────────────
    add_header X-Content-Type-Options  "nosniff"   always;
    add_header X-Frame-Options         "SAMEORIGIN" always;
    add_header Referrer-Policy         "strict-origin-when-cross-origin" always;

    # ── SPA fallback ─────────────────────────────────────
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Option C — Local development

```bash
# Python (no install needed)
python3 -m http.server 8080

# Node (if installed)
npx serve .

# Then open: http://localhost:8080
```

> **HTTPS note:** PWA features (Service Worker, install prompt, clipboard) require HTTPS in production. `localhost` is the only HTTP exception.

---

## Service Worker Caching Strategy

| Request type | Strategy | Cache name |
|---|---|---|
| Shell assets (HTML, manifest, icons) | Cache-first, updated on install | `sadhak-shell-v2` |
| Google Fonts CSS | Stale-while-revalidate | `sadhak-fonts-v2` |
| CDN scripts (jspdf, html2canvas) | Cache-first, immutable | `sadhak-cdn-v2` |
| Groq API calls | **Network-only, never cached** | — |
| Anthropic API calls | **Network-only, never cached** | — |

### Bumping the cache version

When you ship a new version, increment `CACHE_VERSION` in `sw.js`:

```js
const CACHE_VERSION = 'v3';        // was v2
const SHELL_CACHE   = 'sadhak-shell-v3';
const FONT_CACHE    = 'sadhak-fonts-v3';
const CDN_CACHE     = 'sadhak-cdn-v3';
```

The old caches (`-v2`) are automatically deleted on activation.

---

## Groq API Key Setup

The app uses **Groq** (not Anthropic) for the AI Roadmap Generator. The key is entered by the user and stored in `localStorage` — no server-side secret needed.

1. User gets a free API key from [console.groq.com/keys](https://console.groq.com/keys)
2. Key is stored via `localStorage.setItem('sadhak-rm-apikey', key)`
3. Never sent anywhere except directly to `api.groq.com` (excluded from SW cache)

**Security note:** Because the key lives in localStorage it is readable by any JavaScript running on the same origin. Since the app has no third-party scripts and no user-generated content, this is acceptable for a personal-use PWA.

---

## PWA Install Checklist

Before submitting for review or sharing the URL, verify:

- [ ] Served over **HTTPS**
- [ ] `manifest.json` reachable at root (`/manifest.json`)
- [ ] `sw.js` reachable at root (`/sw.js`) with `Cache-Control: no-cache`
- [ ] All four icons exist inside `icons/` subfolder
- [ ] `start_url` in manifest (`./index.html`) resolves correctly
- [ ] Lighthouse PWA audit passes (run in Chrome DevTools → Lighthouse → Progressive Web App)

---

## Offline Behaviour

| Scenario | Result |
|---|---|
| First visit (online) | App loads, SW installs, shell cached |
| Return visit (online) | Served from cache instantly; SW revalidates in background |
| Return visit (offline) | Full app loads from cache; AI roadmap feature unavailable (shows error) |
| New version deployed | User sees "Update available" toast → page auto-reloads after 2.5 s |

---

## Folder Verification Command

Run this before deploying to confirm the structure is correct:

```bash
find . -not -path './.git/*' | sort
```

Expected output (minimum):
```
.
./icons
./icons/apple-touch-icon.svg
./icons/favicon.svg
./icons/icon-192.svg
./icons/icon-512.svg
./index.html
./manifest.json
./sw.js
```

---

*साधक v5.0 · Built for offline-first mindful productivity*
