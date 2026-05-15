# साधक · Sadhak — Production Deployment Package

---

## 📁 Deployment Folder Structure

```
/
├── index.html          ← Main application (single-file PWA)
├── manifest.json       ← PWA manifest (installability)
├── sw.js               ← Service worker (offline support + caching)
└── icons/
    ├── favicon.svg
    ├── icon-192.svg
    ├── icon-512.svg
    └── apple-touch-icon.svg
```

---

## 🚀 Deployment Instructions

### GitHub Pages

1. Create a new GitHub repository (or use an existing one)
2. Upload all files maintaining the folder structure above
3. Go to **Settings → Pages**
4. Set Source: **Deploy from a branch → main → / (root)**
5. Your app will be live at `https://<username>.github.io/<repo>/`

> ⚠️ PWA service workers require HTTPS. GitHub Pages provides this automatically.

### Netlify

1. Log in to [netlify.com](https://netlify.com)
2. Drag and drop your project folder onto the Netlify dashboard
3. Netlify auto-detects and deploys — no build configuration needed
4. Your site goes live at `https://<your-site>.netlify.app`

> For custom domains, configure under Site Settings → Domain Management.

### Vercel

1. Log in to [vercel.com](https://vercel.com)
2. Click **New Project** → Import from Git (or use Vercel CLI)
3. No framework preset needed — select **Other**
4. Click Deploy
5. Live at `https://<project>.vercel.app`

### Cloudflare Pages

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com) → Pages
2. Click **Create a project → Direct Upload**
3. Upload your project folder
4. Click **Deploy site**
5. Live at `https://<project>.pages.dev`

---

## ✅ Pre-Deployment Checklist

Before going live, confirm:

- [ ] All 5 files are present: `index.html`, `manifest.json`, `sw.js`, `icons/favicon.svg`, `icons/icon-192.svg`, `icons/icon-512.svg`, `icons/apple-touch-icon.svg`
- [ ] Paths in `index.html` are relative (`./sw.js`, `icons/favicon.svg`, `manifest.json`)
- [ ] Site is served over HTTPS (required for service workers and PWA install)
- [ ] Open the site in Chrome → DevTools → Lighthouse → Run PWA audit (aim for 90+)
- [ ] Test offline: DevTools → Network → Offline → reload page
- [ ] Test install: Chrome on Android → address bar → "Add to Home Screen"
- [ ] Test on Safari iOS: Share → Add to Home Screen

---

## 🧪 QA Checklist

### 🔷 First Launch
- [ ] App loads in under 3 seconds on 3G
- [ ] Marathi and English text renders correctly
- [ ] All 18 blocks are visible in the task list
- [ ] Header buttons (Log, Vows, Books, Journal, Map, Guide) are tappable
- [ ] Date displays correctly in IST (Asia/Kolkata timezone)
- [ ] Progress bar shows 0/18 on first load

### 💾 Data Persistence
- [ ] Mark a block as done → reload → block still shows as done
- [ ] Enter a journal entry → reload → entry persists
- [ ] Log an output metric → reload → metric value is retained
- [ ] Set a Must-Win block → reload → selection persists
- [ ] Close and reopen the app → all state is preserved

### ⏱️ Timer System
- [ ] Tap ▶ on header → Start modal opens
- [ ] Select a block → timer starts with correct duration
- [ ] Timer counts down correctly (test with a 2-minute block)
- [ ] Pause and resume works correctly
- [ ] Overtime shows in red with + prefix
- [ ] Warning (last 60s) shows in amber
- [ ] Next task button appears after completing a block

### 📝 Microsteps
- [ ] Tap a block with microsteps → microstep panel shows
- [ ] Progress dots update as steps complete
- [ ] "Next Step" button advances correctly
- [ ] All microsteps done → "All Done" message shows
- [ ] Microstep timer counts down correctly

### 📊 Output Tracking
- [ ] Tap + on an output chip → value increments
- [ ] Tap − on an output chip → value decrements (min 0)
- [ ] Quick Panel shows all domain metrics
- [ ] Values update immediately after increment/decrement
- [ ] Output values sync between block overlay and Quick Panel

### 📔 Journal & Diary
- [ ] Open Diary overlay → all sections load
- [ ] Add an affirmation → it appears and persists
- [ ] Add a gratitude entry → appears in today's section
- [ ] Books Library loads and shows skill categories
- [ ] Strategies section shows 48 Laws, Chanakya, etc.
- [ ] Journal section saves entries correctly

### 📅 Daily Reviews
- [ ] Open Log overlay → Daily tab shows today's blocks
- [ ] Weekly review tab loads correctly
- [ ] Reflection fields save and load correctly
- [ ] Export to PDF generates a downloadable file

### 📜 History
- [ ] History tab shows past days
- [ ] Clicking a past day shows its data
- [ ] Data for past days is read-only

### 📄 PDF Export
- [ ] PDF exports correctly with Marathi text rendered
- [ ] PDF contains date, block data, outputs, and reflection
- [ ] Roadmap PDF downloads from AI Roadmap overlay

### 📵 Offline Mode
- [ ] Load app → enable airplane mode → all features still work
- [ ] Timer runs offline
- [ ] Data saves to localStorage offline
- [ ] App reloads offline without error

### 📲 PWA Installation
- [ ] `beforeinstallprompt` fires on Chrome Android → Install button appears
- [ ] Tapping Install → system prompt → app installs → icon on home screen
- [ ] Installed app opens in standalone mode (no browser chrome)
- [ ] Safe areas render correctly (no content behind notch/home indicator)

### 🔄 Service Worker Updates
- [ ] Bump `CACHE_VERSION` in `sw.js` → redeploy → open app → update banner appears
- [ ] Tap "अपडेट करा" → page reloads with new version
- [ ] Tap "नंतर" → banner dismisses, old version continues

### 🗺️ AI Roadmap
- [ ] Enter a goal → Generate → roadmap renders
- [ ] Invalid API key → shows clear error message
- [ ] Copy button copies roadmap text
- [ ] PDF export from roadmap works
- [ ] Preset skill map renders all 32 cards

### 📱 Cross-Browser & Device Testing
- [ ] Chrome Android — full feature test
- [ ] Safari iOS — timer, storage, install flow
- [ ] Samsung Internet — basic flow
- [ ] Desktop Chrome — all overlays
- [ ] Desktop Firefox — all overlays
- [ ] Landscape orientation — layout adapts
- [ ] Font size accessibility — UI readable at 150% system font

### ⚖️ Danda / Vows
- [ ] Vows overlay opens
- [ ] Checking/unchecking vows saves state
- [ ] Vow history persists across days

---

## 📋 Changelog of Fixes Applied

### v2.0.0 — Production Hardening

**Bug Fixes:**
- ✅ Fixed `quick-panel-toggle` not toggling panel open/closed (was only refreshing values, not opening panel due to removed `onclick`)
- ✅ Fixed `aria-expanded` attribute not updating on quick panel toggle
- ✅ Added `aria-controls` to connect toggle button to panel body

**Security & Robustness:**
- ✅ Added global `window.onerror` handler for unhandled JS errors
- ✅ Added `window.addEventListener('unhandledrejection', ...)` for Promise errors
- ✅ Both handlers log to console without suppressing default behavior

**PWA Improvements:**
- ✅ Added `beforeinstallprompt` capture in the `<head>` (fires before DOM is ready, critical timing)
- ✅ Added `appinstalled` listener to auto-hide install button after installation
- ✅ Added Install PWA button to header nav with proper show/hide logic
- ✅ Created production-grade `manifest.json` with all required fields: `scope`, `start_url`, `orientation`, `categories`, `shortcuts`
- ✅ Created production-grade `sw.js` with:
  - Versioned cache names (`sadhak-v2.0.0`)
  - App Shell pre-caching on install
  - `skipWaiting()` and `clients.claim()` for immediate activation
  - Old cache cleanup on activate
  - Three routing strategies: cache-first (app shell), stale-while-revalidate (CDN), network-first (dynamic)
  - AI API calls bypass cache entirely (always network-only with offline fallback)
  - `SKIP_WAITING` message handler for controlled update

**Icons:**
- ✅ Created all 4 required SVG icons: `favicon.svg`, `icon-192.svg`, `icon-512.svg`, `apple-touch-icon.svg`
- ✅ Icons use Sadhak Devanagari branding with amber color scheme

**Architecture Notes:**
- Storage keys are defined as constants: `STORE_KEY = 'sadhak-lite-v2'`, `MICRO_STORE_KEY = 'sadhak-microhabits-v1'`, `BLOCK_OUTPUTS_STORE = 'sadhak-block-outputs-v1'`
- `todayKey()` uses `Asia/Kolkata` timezone for reliable IST date handling
- Debounced saves already present in the codebase
- Safe JSON parsing with try/catch in all storage operations
- State migration on load injects missing DEFAULT_TASKS entries

**Known Remaining Considerations:**
- The inline `onclick` attributes in quick panel diary strip buttons (`window.openDiaryTo(...)`) are functional but could be refactored to event delegation in a future pass
- The guide overlay uses Blob URLs for the inline HTML guide — this works correctly but means the guide content is bundled in the main HTML file
- The app is a single ~16,500 line HTML file; future refactoring could split into separate JS modules while maintaining single-file deployment option
