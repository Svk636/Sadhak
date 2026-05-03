# साधक (Sadhak) v5.0 — Complete Project README

> **What is this?** Sadhak is a mindful productivity app for one person's day. Think of it like a really smart daily planner that also has a timer, a diary, a scorecard, habit vows, and an AI coach — all packed into a single HTML file that works offline on your phone.

---

## 🗂️ Table of Contents
1. [Project Overview](#1-project-overview)
2. [File Structure](#2-file-structure)
3. [Tech Stack](#3-tech-stack)
4. [Colors, Fonts & Design System](#4-colors-fonts--design-system)
5. [localStorage Keys (Where Data Lives)](#5-localstorage-keys-where-data-lives)
6. [Screen-by-Screen Breakdown](#6-screen-by-screen-breakdown)
7. [The Task System](#7-the-task-system)
8. [The Timer System](#8-the-timer-system)
9. [The Micro-Steps System](#9-the-micro-steps-system)
10. [The Output Metrics System](#10-the-output-metrics-system)
11. [The Danda (Vow) System](#11-the-danda-vow-system)
12. [The Diary System](#12-the-diary-system)
13. [The Roadmap (AI) System](#13-the-roadmap-ai-system)
14. [The Review System](#14-the-review-system)
15. [The History System](#15-the-history-system)
16. [The 4Sadhak Guide Overlay](#16-the-4sadhak-guide-overlay)
17. [Audio System](#17-audio-system)
18. [PWA Setup](#18-pwa-setup)
19. [Important JavaScript Functions](#19-important-javascript-functions)
20. [Rebuild Checklist for Bolt/Cursor](#20-rebuild-checklist-for-boltcursor)

---

## 1. Project Overview

**App name:** साधक (Sadhak) — meaning "practitioner" or "seeker" in Hindi/Marathi

**Version:** v5.0

**Language:** The UI text is mostly in **Marathi** (Devanagari script). Some English labels appear in the output/metrics sections.

**One file:** The entire app is a single `index.html` file — no React, no Vue, no build tools. Just pure HTML + CSS + JavaScript.

**Who is it for?** One user (no login, no accounts). It's a personal daily productivity system.

**Core idea:** Each day starts fresh. You have 20 pre-defined tasks organized into morning / afternoon / evening sections. You tap a task to start a timer, complete it, log outputs, write in your diary, check your vows, and review your day — all in one place.

**PWA (Progressive Web App):** The app can be "installed" on your phone like a real app. It requires a `manifest.json` file and icon files.

---

## 2. File Structure

```
/
├── index.html          ← THE ENTIRE APP (one file, ~15,950 lines)
├── manifest.json       ← PWA manifest (must be created separately)
└── icons/
    ├── favicon.svg
    ├── icon-192.svg
    ├── icon-512.svg
    └── apple-touch-icon.svg
```

### manifest.json (must create this separately)
```json
{
  "name": "साधक",
  "short_name": "साधक",
  "description": "Mindful productivity tracker",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAFAF8",
  "theme_color": "#FAFAF8",
  "icons": [
    { "src": "icons/icon-192.svg", "sizes": "192x192", "type": "image/svg+xml" },
    { "src": "icons/icon-512.svg", "sizes": "512x512", "type": "image/svg+xml" }
  ]
}
```

---

## 3. Tech Stack

| What | Answer |
|------|--------|
| Framework | None. Vanilla HTML + CSS + JavaScript |
| Build Tool | None |
| External Libraries | jsPDF (PDF export), html2canvas (screenshot to PDF) |
| Fonts | Google Fonts (see section 4) |
| AI | Groq API (for roadmap feature, user provides their own API key) |
| Storage | Browser `localStorage` only |
| Offline Support | Yes — all assets are inline, works offline |
| Mobile Support | Yes — designed for mobile-first, max-width 420px |

**CDN scripts loaded in `<head>`:**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" defer></script>
```

---

## 4. Colors, Fonts & Design System

### CSS Variables (defined in `:root`)

```css
:root {
    --bg:       #FAFAF8;   /* main background — warm off-white */
    --bg-2:     #F2F1EE;   /* slightly darker background */
    --bg-3:     #ECEAE5;   /* card / input backgrounds */
    --ink:      #111110;   /* primary text color (almost black) */
    --ink-2:    #444440;   /* secondary text */
    --ink-3:    #888884;   /* muted / label text */
    --amber:    #B8832A;   /* primary accent — golden amber */
    --amber-bg: rgba(184,131,42,.08);  /* very light amber fill */
    --amber-bd: rgba(184,131,42,.25);  /* amber border */
    --green:    #2A7A4B;   /* success color */
    --red:      #B83030;   /* danger / overrun color */
    --line:     #E0DDD7;   /* divider lines */
    --line-2:   #CCCAC4;   /* stronger lines */
    --serif:    'Crimson Pro', 'Noto Sans Devanagari', Georgia, serif;
    --mono:     'IBM Plex Mono', 'Courier New', monospace;
    --r:        4px;       /* border-radius */
    --max:      420px;     /* max width of the app */

    /* Alias variables (used in diary/guide sections) */
    --bg2:  #F2F1EE;
    --bg3:  #ECEAE5;
    --bg4:  #D8D6D0;
    --ink2: #444440;
    --ink3: #888884;
    --ink4: #CCCAC4;
    --gold:    #B8832A;     /* same as amber, used in diary */
    --gold-bg: rgba(184,131,42,.08);
    --gold-bd: rgba(184,131,42,.25);
}
```

### Google Fonts (all loaded in `<head>`)
```html
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&family=IBM+Plex+Mono:wght@300;400;500&family=Noto+Sans+Devanagari:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

**Font roles:**
- `IBM Plex Mono` — body font, all UI labels, numbers, timers
- `Crimson Pro` + `Noto Sans Devanagari` — task names, diary entries (the `--serif` font)
- `Cinzel` — used in the guide overlay center circle title
- `Cormorant Garamond` — decorative headings in guide

### Task Status Colors
| Status | Meaning | Color |
|--------|---------|-------|
| `idle` | Not started | Default ink |
| `active` | Timer running | `--amber` (#B8832A) |
| `done` | Completed on time | Strikethrough, `--ink-3` |
| `skip` | Skipped | Strikethrough, `--ink-3` |
| `overrun` | Ran over time | Strikethrough, `--amber` |
| `interrupted` | Interrupted mid-task | Strikethrough, `#8C3CB8` (purple) |

### Domain Pill Colors
Each task belongs to a domain. Domain pills appear on each task row:
```css
.d-SELF    { background: rgba(0,0,0,.06);          color: var(--ink-3); }
.d-SKILL   { background: rgba(42,122,75,.1);        color: #2A7A4B; }
.d-MONEY   { background: rgba(184,131,42,.12);      color: var(--amber); }
.d-BRAND   { background: rgba(90,40,120,.1);        color: #6B3CA8; }
.d-NETWORK { background: rgba(30,80,160,.1);        color: #1E50A0; }
```

---

## 5. localStorage Keys (Where Data Lives)

| Key | What it stores |
|-----|----------------|
| `sadhak-v1` | Today's state: tasks, outputs, reflection, mustWinId, date, gapNotes, logNotes |
| `sadhak-v1-micro` | Active micro-step state: activeId, activeMicros, activeMicroIdx, microStepElapsed |
| `sadhak-history-v1` | Array of day snapshots (capped at ~90). Each snapshot has the full state + summary |
| `sadhak-weekly-targets-v1` | User's weekly targets for each output metric |
| `sadhak-rm-apikey` | User's Groq API key (saved on device) |
| `sadhak-diary-v1` | All diary data: entries, chief aim, gratitudes, affirmations |
| `sadhak-micro-habits-v1` | User-customized micro-step definitions for each task |
| `output_engine_v1` | Array of output engine records (one per day) |
| `sadhak-danda-v1` | Vow tracking data: which vows were kept/broken today, streak data |

### Today's State Object Shape (`sadhak-v1`)
```js
{
  date: "2024-05-03",           // YYYY-MM-DD in IST
  mustWinId: "c5",              // id of the Must-Win task (or null)
  outputs: { profit:0, revenue:0, ... },   // 16 output metric values
  reflection: {
    progress: "",   // text answer
    waste: "",      // text answer
    change: "",     // text answer
    skipped: false
  },
  gapNotes: [{ prevTaskId, nextTaskId, prevEnd, note }],
  logNotes: [{ taskId, endTime, note }],
  tasks: [
    {
      id: "c1",
      label: "प्रभात · जागृती",
      section: "प्रभात · पहाट",
      dur: 600,                 // duration in seconds (0 = no timer)
      domain: "SELF",
      status: "idle",           // idle | active | done | skip | overrun | interrupted
      elapsed: 0,               // seconds actually spent
      value: null,              // user-rated value score
      startTime: null,          // timestamp (ms)
      endTime: null,            // timestamp (ms)
      type: "predefined",
      parentTaskId: null,
      isMicro: false,
      interruptionReason: null,
      completedMicroIndices: [] // which micro-steps were completed
    },
    // ...19 more tasks
  ]
}
```

---

## 6. Screen-by-Screen Breakdown

The app has **one main screen** plus **many overlays** that slide over it. There's also a completely separate **embedded 4Sadhak Guide** that runs in its own overlay.

### Main Screen Structure (HTML element IDs)
```
#app
├── #hdr (header)
│   ├── #hdr-row1
│   │   ├── #hdr-brand         "साधक · v5.0" (top-left label)
│   │   └── #hdr-date          Today's date + review status
│   └── #hdr-nav (navigation buttons row)
│       ├── .hdr-btn           DANDA (वचन)
│       ├── .guide-split-btn   GUIDE split button (English / Marathi halves)
│       ├── .hdr-btn           DIARY (डायरी)
│       ├── .hdr-btn           ROADMAP
│       └── #btn-start         "START" (dark background, primary CTA)
├── #daily-reset-bar
│   └── #btn-daily-reset       "↺ RESET" button (right-aligned)
├── #progress-wrap
│   ├── #progress-label
│   │   ├── #progress-text     "कार्ये पूर्ण"
│   │   └── #progress-count    "3 / 20"
│   └── #progress-track
│       └── #progress-fill     amber progress bar
├── #domain-bar-wrap
│   └── #domain-bar            "SELF 45m · SKILL 30m · MONEY 0m"
├── .divider
├── #task-list                 scrollable list of tasks
├── #active-panel              appears when a task is running
│   ├── .active-label
│   ├── .active-name
│   ├── #dual-ring-wrap        the main timer display
│   │   ├── #ring-container
│   │   │   ├── #dual-ring-svg (SVG with two concentric rings)
│   │   │   └── #ring-center   (text in center: timer digits)
│   │   └── #active-timer-big  large timer text
│   ├── #micro-panel           micro-step display (hidden until task starts)
│   └── (action buttons: Done, Skip, Interrupt, Next Step)
└── #done-panel                appears when all tasks finished or timer ends
    ├── #output-summary-strip  quick stats row
    ├── #btn-open-outputs      "Log Today's Outputs"
    ├── #btn-review            "→ दिवस समीक्षा"
    └── #btn-reset             "रीसेट करा"
```

### All Overlays (full-screen panels that cover the main screen)

| Overlay ID | What it is | z-index |
|-----------|------------|---------|
| `#output-overlay` | Output engine (contains an `<iframe>`) | 150 |
| `#danda-overlay` | Vow tracking — 5 vow sections | — |
| `#edit-overlay` | Edit task names + micro-steps | 100 |
| `#customise-overlay` | Configure micro-step durations before starting | — |
| `#review-overlay` | Daily review — 4 tabs: Log, Review, History, Settings | — |
| `#roadmap-overlay` | AI roadmap planner | 300 |
| `#diary-overlay` | Diary — journaling system | 350 |
| `#gap-prompt` | Popup to log gap between tasks | 200 |
| `#guide-overlay` | The 4Sadhak guide (embedded second HTML doc) | 500 |

All overlays use `.open` class to show: `display: flex` or `display: block`.

---

## 7. The Task System

### The 20 Default Tasks (IDs: c1–c20)

Tasks are grouped into 3 sections:

**Section 1: प्रभात · पहाट (Morning/Dawn)**
| ID | Task Name | Duration | Domain |
|----|-----------|----------|--------|
| c1 | प्रभात · जागृती (Wake-up ritual) | 10 min | SELF |
| c2 | प्राणायाम · श्वासाभ्यास (Pranayama) | 15 min | SELF |
| c3 | शरीर · व्यायाम (Body workout) | 45 min | SELF |
| c4 | स्नान · शुद्धी (Bath/cleanse) | 10 min | SELF |
| c5 | अध्ययन · वाचन (Study/reading) | 60 min | SKILL |
| c6 | ध्यान · एकाग्रता (Meditation) | 20 min | SELF |
| c7 | पोषण · आहार (Nutrition/meal) | 20 min | SELF |

**Section 2: मध्याह्न · कार्य (Midday/Work)**
| ID | Task Name | Duration | Domain |
|----|-----------|----------|--------|
| c8 | संकल्प · नियोजन (Planning) | 10 min | SELF |
| c9 | संपर्क · सेवा (Contact/outreach) | 30 min | NETWORK |
| c10 | कौशल्य · सर्जन (Skill creation) | 120 min | SKILL |
| c11 | विपणन · ब्रँड (Marketing/brand) | 45 min | SELF |
| c12 | अर्थ · व्यवसाय (Money/business) | 60 min | MONEY |
| c13 | समीक्षा · सुधार (Review/improve) | 15 min | SELF |
| c14 | पोषण · मध्याह्न (Midday meal) | 30 min | SELF |
| c15 | विश्राम · पुनर्भरण (Rest/recharge) | 20 min | SELF |

**Section 3: संध्या · विश्राम (Evening/Wind-down)**
| ID | Task Name | Duration | Domain |
|----|-----------|----------|--------|
| c16 | आहार · संध्या (Evening meal) | 20 min | SELF |
| c17 | लेखन · अभ्यास (Writing/practice) | 75 min | SELF |
| c18 | कला · अभिव्यक्ती (Art/expression) | 60 min | SKILL |
| c19 | शुद्धी · रात्र (Night cleanse) | 20 min | SKILL |
| c20 | निद्रा · विश्राम (Sleep prep) | 30 min | SELF |

### Task State Machine
```
idle → [tap] → customise overlay (if has micro-steps)
            OR  active (if no micro-steps / skips customise)
active → [Done] → done
active → [Skip] → skip
active → [Interrupt] → interrupted (reason required)
active → time runs out → still active but shows "+1:30" (overrun)
[Done while overrun] → overrun (status)
```

### The Must-Win Task
- One task can be designated as "Must-Win" — shown with a `◆` diamond prefix
- Tapping a task name (not just starting) opens a context menu where "Set as Must-Win" appears
- Stored as `state.mustWinId`
- Must-Win completion is tracked in the day snapshot

### Editing Tasks
- The Edit Overlay (`#edit-overlay`) shows all 20 tasks as text inputs
- User can rename any task
- Leaving a field blank = delete that task
- Tasks are saved in `localStorage` under the current template

---

## 8. The Timer System

The timer is a **dual-ring SVG** displayed in `#ring-container` (200×200px).

### Outer Ring (Task Timer)
- SVG circle with `r=86`, circumference = 540.35
- Stroke goes from full to empty as time counts down
- Color: amber → turns red (`#B83030`) when overrun
- Turns yellow-amber when < 60 seconds remain

### Inner Ring (Micro-Step Timer)
- SVG circle with `r=63`, circumference = 395.84
- Only visible when a micro-step is active (class `vis`)
- Same color behavior

### Center Display
- `#center-step-time` — shows micro-step countdown digits
- `#center-step-meta` — shows "step 2 / 3 · 10 min"
- `#active-timer-big` — the large countdown outside the ring

### Timer Tick Loop
Uses `requestAnimationFrame` for smooth updates:
```js
function tick() {
    // Update outer ring (task timer)
    // Update inner ring (micro-step timer)
    // Auto-advance micro-step when it completes
    rafId = requestAnimationFrame(tick);
}
```

### Key Timer Variables
```js
let activeId = null;       // ID of the currently running task
let timerStart = null;     // Date.now() when timer started
let elapsed = 0;           // seconds elapsed before current session
let rafId = null;          // requestAnimationFrame handle
```

### IST Date Logic
The app is **India-timezone aware**:
```js
const todayKey = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
// Returns "YYYY-MM-DD" in IST
```

---

## 9. The Micro-Steps System

Every task can have up to ~5 "micro-steps" — smaller sub-actions that help you complete the task.

### Default Micro-Steps (MICROHABITS object)
Each task ID maps to an array of step objects:
```js
const MICROHABITS = {
    'c1': [
        { name: 'उठणे · पाणी पिणे', dur: 120 },      // 2 min
        { name: 'शतपावली · शांत चाल', dur: 300 },     // 5 min
        { name: 'संकल्प · मनाची तयारी', dur: 180 }    // 3 min
    ],
    'c2': [...],
    // ...all 20 tasks
};
```

Steps with `dur: 0` are "log" steps — no countdown, just tap to confirm.

### Customise Overlay (`#customise-overlay`)
Before starting a task, if it has micro-steps, the **Customise Overlay** opens. The user can:
- Toggle each step on/off
- Adjust each step's duration (tap +/– or type directly)
- See total time selected vs task target time
- Tap "▶ सराव सुरू करा" to begin

### During Task Execution
- The inner ring counts down the current micro-step
- Below the rings: step name, progress bar, "→ Next Step" button
- When a step finishes: bell sound plays, auto-advances to next step
- Each completed step is recorded in `task.completedMicroIndices`

### Editing Micro-Steps (Edit Overlay)
In the Edit Overlay, each task has a "X टप्पे" (steps) button. Tapping it opens a panel to edit step names and durations inline.

---

## 10. The Output Metrics System

After completing work, users log 16 metrics across 5 domains.

### The 16 Metrics

**VALUE domain (money):**
| Key | Label | Type |
|-----|-------|------|
| `profit` | Profit | currency (₹) |
| `revenue` | Revenue | currency (₹) |
| `conversions` | Conversions | count |
| `opportunities` | Opportunities | count |

**CREATION domain (output):**
| Key | Label | Type |
|-----|-------|------|
| `writingOutput` | Writing Output | count |
| `actingOutput` | Acting Output | count |
| `appliedLearning` | Applied Learning | count |
| `offersActive` | Offers Active | count |

**IMPACT domain:**
| Key | Label | Type |
|-----|-------|------|
| `livesTouched` | Lives Touched | count |
| `livesTransformed` | Lives Transformed | count |
| `retention` | Retention | count |

**EXECUTION domain:**
| Key | Label | Type |
|-----|-------|------|
| `cycleTime` | Cycle Time (hrs) | decimal |
| `outputUnits` | Output Units | count |

**BODY domain:**
| Key | Label | Type |
|-----|-------|------|
| `trainingSessions` | Training Sessions | count |
| `perfMarker` | Performance Marker | score 1–5 |
| `recoveryState` | Recovery / Energy | score 1–5 |

### Output Quick Strip
At the bottom of the main screen (done panel), a row of quick-glance cells shows:
- Focus (total time in minutes)
- Tasks (done count)
- Value (revenue)
- Content (writingOutput)
- Lives (livesTouched)

### Output Overlay (4Sadhak Engine)
The "Log Today's Outputs" button opens `#output-overlay` which contains an `<iframe id="output-engine-frame">`. The actual output logging UI lives inside this iframe. It reads/writes to `output_engine_v1` in localStorage.

### Weekly Targets
In the Review overlay → Settings tab, users can set weekly targets for each metric. Progress bars show current week total vs target.

---

## 11. The Danda (Vow) System

**Danda** means "punishment/discipline" in Sanskrit. The Danda overlay shows vows the user commits to every day.

### The 5 Vow Sections

| Section | Count | Variable |
|---------|-------|----------|
| Nava Niyama · Nine Vows | 9 | `window._NAVA_NIYAMA` |
| Daily Conduct Vows | 6 | `window._CONDUCT_VOWS` |
| Daily Rhythms · Charya | 6 | `window._CHARYA_VOWS` |
| Discipline Vows · Anushasan | 19 | `window._DISCIPLINE_VOWS` |
| 48 Laws of Power (Greene) | 48 | `window._LAWS_OF_POWER` |
| Chanakya Niti · Kautilya | 14 | `window._CHANAKYA_NITI` |

### How Vows Work
Each vow shows as a row with:
- Vow text
- Two buttons: ✓ पाळले (kept) | ✕ भंग (broken)

When a vow is **kept**: streak counter goes up
When a vow is **broken**: a "breach log" entry is recorded + a "punishment" is shown
All data resets at midnight.

### PDF Export
The Danda overlay has a "↓ PDF" button that calls `exportDandaPDF()` — uses jsPDF + html2canvas to export the entire vow sheet as a PDF.

### Header Button
```html
<button class="hdr-btn" onclick="openDanda()">DANDA<br><span>वचन</span></button>
```

---

## 12. The Diary System

The Diary is a full journaling system (`#diary-overlay`).

### Diary Sections (tabs at top of diary overlay)

| Tab | What it contains |
|-----|-----------------|
| Chief Aim | One main goal statement (like a mission) — editable, with history |
| Gratitude | 3 gratitude items per day, stored with date |
| Journal | Free-form writing entries with tags and writing prompts |
| Affirmations | Short affirmation statements the user saves |

### Journal Entry Structure
```js
{
  id: "unique-id",
  date: "2024-05-03",
  section: "journal",       // or "chief-aim", "gratitude", "affirmation"
  title: "",
  content: "Full text...",
  tags: ["focus", "growth"],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Writing Overlay
When writing a journal entry, a **Write Overlay** (`#diary-write-overlay`) covers the screen with:
- Section name at top
- Date display
- Tags input field (comma-separated)
- A writing prompt box with shuffle button (🔀)
- Large textarea for the actual writing
- Save / Cancel buttons

### Search Overlay
The Diary has a **Search Overlay** (`#diary-search-overlay`) that searches all entries in real time.

### Chief Aim
- A single long-form statement of the user's main life purpose
- Tapping it opens edit mode (a textarea appears below)
- Full history of past Chief Aims is shown below

### Gratitude
- 3 items per day
- Input row at bottom, "+ " button to add
- Each day's gratitudes collapse into a dated card

### Affirmations
- Short positive statements
- Stored similarly to journal entries
- Each affirmation has an inline edit mode

### Toast Notifications (in diary)
```html
<div id="diary-toast"></div>
```
Shows briefly at bottom of screen when saving/deleting.

---

## 13. The Roadmap (AI) System

The Roadmap overlay (`#roadmap-overlay`) is an AI-powered goal planner.

### How It Works
1. User writes their goal in a textarea
2. Picks a timeframe input (e.g., "3 months")
3. Picks a mode (12-Week Sprint / 90-Day Sprint / Annual Sprint / Decade Plan / AI Guide Mode)
4. Optionally picks a skill preset from horizontal-scrolling cards
5. Taps "Generate with AI" → calls Groq API
6. AI response is displayed
7. User can save or clear the roadmap

### API Integration (Groq)
```js
const APIKEY_STORE = 'sadhak-rm-apikey';
// Key stored in localStorage, user enters in Settings tab

// API call format:
fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [...],
        max_tokens: 2048
    })
});
```

### Skill Preset Cards
A horizontally-scrollable row of preset cards (like "Writing", "Acting", "Martial Arts", "Business", etc.). Tapping one pre-fills the goal textarea with a domain-specific template.

### Voice Input
Many text inputs in the Roadmap (and Review) have a **voice button** (🎤) that uses the Web Speech API:
```js
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'mr-IN';  // Marathi
```

---

## 14. The Review System

The Review Overlay (`#review-overlay`) has **4 tabs**:

### Tab 1: Log (लॉग)
Shows the chronological session log for today:
- Each completed task: name, start → end time, duration
- Between tasks: gap indicator (time between tasks)
- Gap notes: user can type what happened during gaps
- Task notes: user can add a note after each completed task

### Tab 2: Review (समीक्षा)
3 reflection questions (text areas with voice input):
```
Q1: आज काय प्रगती झाली? (What progress today?)
Q2: काय वाया गेले? (What was wasted?)
Q3: उद्या काय बदलाल? (What to change tomorrow?)
```

The review reference section on the right shows completed tasks for context.

**Buttons:**
- "जतन करा" (Save) — saves all 3 answers
- "वगळा" (Skip) — marks review as skipped

### Tab 3: History (इतिहास)
Shows all past day snapshots as expandable cards:
- Card header: date, completion stats chips (e.g., "15/20 done", "42m")
- Expand to see: task log, vow summary, output numbers, reflection answers, domain breakdown

### Tab 4: Settings (⚙ सेटिंग)
- Input field for Groq API key
- Save button (validates that key starts with `gsk_`)
- Status message (green check when saved)

### Gap Prompt (`#gap-prompt`)
A modal dialog that appears between tasks when there's a time gap:
- Shows gap duration
- Asks "What did you do during this gap?"
- Input field for the user's answer
- Confirm / Skip buttons

---

## 15. The History System

### Day Snapshot Structure
When a day is reset or saved, a snapshot is built:
```js
const snapshot = {
    date: "2024-05-03",
    snapshotAt: Date.now(),
    version: 2,
    state: { ...fullStateCopy },        // complete state object
    danda: { ...dandaData },             // vow tracking data
    diary: { ...diaryData },             // diary entries
    microProgress: { c1: [...], ... },   // which micro-steps were done
    outputEngine: { ...oeRecord },       // output engine data for this date
    summary: {
        tasksTotal: 20,
        tasksDone: 15,
        tasksSkipped: 2,
        tasksInterrupted: 1,
        tasksIdle: 2,
        totalElapsedSec: 14400,         // 4 hours in seconds
        valueScore: 0,                   // sum of task value ratings
        mustWinId: "c5",
        mustWinLabel: "अध्ययन · वाचन",
        mustWinDone: true,
        outputs: { profit: 0, revenue: 5000, ... },
        vowsKept: 8,
        vowsBroken: 1,
        vowsTotal: 44,
        domainBreakdown: { SELF: 7200, SKILL: 4200, ... },
        chronoLog: [...],               // array of {id, label, start, end, elapsed, status}
        gapNotes: [...],
        logNotes: [...]
    }
};
```

### History Storage
```js
const HISTORY_KEY = 'sadhak-history-v1';
const HISTORY_MAX = 90;  // keep up to 90 days
```

### Daily Reset Flow
When the user taps "रीसेट करा" (Reset):
1. A confirmation dialog appears
2. On confirm: `saveSnapshot()` is called — saves today to history
3. State is wiped and rebuilt fresh with today's date
4. `save()` stores the fresh state

---

## 16. The 4Sadhak Guide Overlay

This is a **second complete HTML document** embedded as a template string inside the main JS. It renders into `#guide-overlay` when the user taps the Guide button.

### What it Contains
A philosophical guide showing how the 20 daily tasks connect to 5 life output domains.

### The Guide's TASKS Array (20 items)
Each guide task has:
```js
{
    id: "t01",
    num: 1,
    label: "जागृती",               // task name
    section: "BODY",               // which life domain
    time: "5:00 AM",               // suggested time
    dur: "10 min",
    need: "शरीर जागृत होणे",       // the need it meets
    needEmoji: "🌅",
    color: "#B87C2A",
    micro: [                       // 3 micro-actions
        { name: "उठणे", dur: "2 min" },
        { name: "पाणी पिणे", dur: "2 min" },
        { name: "सूर्य नमस्कार", dur: "5 min" }
    ],
    kid: "जसे झाड सकाळी सूर्याकडे वळते...",  // explain to a 6-year-old
    outputs: ["BODY", "SELF"]      // which output domains it feeds
}
```

### The Guide's OUTPUTS Array (5 domains)
```js
{
    key: "BODY",
    title: "शरीर बळ",
    icon: "💪",
    sub: "Physical power",
    desc: "Strength, stamina, discipline",
    taskIds: ["t01", "t02", ...],
    metrics: ["Strength", "Stamina", "Sleep score"]
}
```

### 4 Views in the Guide
The guide has a tab bar with 4 views:

**1. Timeline View** — shows all 20 tasks in chronological order as timeline cards

**2. Cards View** — shows each task as a card with emoji, need, and micro-actions

**3. Mindmap View** — a circular SVG mind map:
- Center circle with "साधक" text
- 20 task nodes arranged in sections around the center
- 5 output domain nodes at the outer edge
- Lines connecting tasks to their output domains
- Color-coded by section

**4. Outputs View** — shows each output domain as a card with its contributing tasks

### Guide Interaction
- Tapping any task card or mindmap node opens a **modal** with full task detail
- Modal shows: need, 3 micro-actions, "explain to a 6-year-old" section, output domain tags

---

## 17. Audio System

The app uses the **Web Audio API** for sound feedback (no audio files needed).

### Sounds
```js
function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

// Bell: short 880Hz sine wave (plays when micro-step ends)
function playBell() {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 880;
    // fade out in 0.18 seconds
}

// Task Done: descending 3-note sequence (660Hz → 528Hz → 440Hz)
function playTaskDone() {
    [660, 528, 440].forEach((freq, i) => {
        // play each note 0.38 seconds apart
    });
}
```

---

## 18. PWA Setup

The app works as an installable Progressive Web App.

### Required meta tags in `<head>`
```html
<meta name="theme-color" content="#FAFAF8" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="साधक" />
<link rel="manifest" href="manifest.json" />
```

### Safe Area Insets (for iPhone notch)
```css
#app { padding: 0 0 env(safe-area-inset-bottom); }
```

### Offline Capability
Since all CSS and JS are inline in `index.html` and fonts come from Google Fonts (with `display=swap`), the app mostly works offline after first load.

---

## 19. Important JavaScript Functions

Here is a map of every important function and what it does:

### Core State Functions
| Function | What it does |
|----------|--------------|
| `load()` | Reads today's state from localStorage. If date doesn't match, returns null |
| `buildFresh(tmpl)` | Creates a brand-new empty day state from the task template |
| `save()` | Writes current state to localStorage |
| `render()` | Calls all the render sub-functions to update the UI |
| `todayKey()` | Returns "YYYY-MM-DD" in India timezone |

### Timer Functions
| Function | What it does |
|----------|--------------|
| `startTimer(id)` | Starts the RAF loop for task `id` |
| `stopTimer()` | Stops the RAF loop, saves elapsed time |
| `tick()` | The animation frame function — updates all timer displays |
| `currentElapsed()` | Returns total seconds elapsed for active task |

### Task Action Functions
| Function | What it does |
|----------|--------------|
| `onTaskTap(id)` | Called when user taps a task item. Opens customise or starts directly |
| `markDone(id)` | Marks task as done, shows gap prompt, plays sound |
| `markSkip(id)` | Marks task as skip |
| `markInterrupted(id, reason)` | Marks as interrupted with reason |
| `openCustomise(id)` | Opens the micro-step customisation overlay |
| `beginTask(id, steps)` | Actually starts the timer after customise |

### Micro-Step Functions
| Function | What it does |
|----------|--------------|
| `nextMicrostep()` | Advances to next micro-step |
| `_markCurrentMicroCompleted()` | Saves completed step index to state |
| `clearMicroState()` | Resets all micro-step variables |
| `loadMicro()` | Restores micro-step state from localStorage on page load |

### Render Functions
| Function | What it does |
|----------|--------------|
| `renderDate()` | Updates `#hdr-date` with today's date + review status |
| `renderProgress()` | Updates the progress bar and "X / 20" count |
| `renderList()` | Re-renders the entire task list |
| `renderActivePanel()` | Shows/updates the active task panel |
| `renderDomainBar()` | Updates the domain time summary bar |
| `renderFooter()` | Shows done panel or hides it |
| `updateOutputStrip()` | Updates the quick output strip numbers |

### Review & History Functions
| Function | What it does |
|----------|--------------|
| `openReview(tab)` | Opens review overlay, optionally on a specific tab |
| `saveReview()` | Saves all 3 reflection answers |
| `skipReview()` | Marks review as skipped |
| `buildTimeLog()` | Builds the chronological session log HTML |
| `buildHistoryPane()` | Builds the history cards HTML |
| `buildDaySnapshot()` | Creates the complete day snapshot object |
| `saveSnapshot()` | Saves snapshot to history array in localStorage |

### Output Functions
| Function | What it does |
|----------|--------------|
| `incOutput(key)` | Increments an output metric by 1 |
| `decOutput(key)` | Decrements an output metric (min 0) |
| `getWeekOutputTotals()` | Sums this week's output totals from history + today |
| `getDayStatus(o)` | Returns whether VALUE + CREATION + BODY minimums are met |
| `weekKey()` | Returns "YYYY-Www" ISO week key |

### Utility Functions
| Function | What it does |
|----------|--------------|
| `fmtSecs(s)` | "3:45" or "1:02:15" format |
| `fmtDur(s)` | "45 मि" or "1 ता 30 मि" (Marathi) |
| `fmtDate(d)` | Hindi locale date format |
| `fmtTime(ts)` | "02:30 PM" (Hindi locale, 12-hour) |
| `esc(s)` | HTML-escape a string |
| `showToast(msg, type)` | Shows bottom toast notification |
| `playBell()` | Plays micro-step completion sound |
| `playTaskDone()` | Plays task done sound |

---

## 20. Rebuild Checklist for Bolt/Cursor

Use this checklist when telling Bolt or Cursor to rebuild this app. Give them sections one at a time if needed.

### 🏗️ Foundation
- [ ] Single `index.html` file, no build tools
- [ ] `<html lang="hi">` (Hindi language)
- [ ] Import all 6 Google Font families
- [ ] Import jsPDF and html2canvas from CDN
- [ ] Set up all CSS variables in `:root`
- [ ] Create `manifest.json` for PWA
- [ ] Create 4 icon SVG files in `/icons/`
- [ ] `#app` max-width 420px, centered, full height

### 📋 Main Screen
- [ ] Header with brand, date, nav buttons
- [ ] 5 header nav buttons: DANDA, GUIDE (split), DIARY, ROADMAP, START
- [ ] Daily reset bar with reset button
- [ ] Progress bar (amber fill, "X / 20")
- [ ] Domain bar (time totals per domain)
- [ ] Scrollable task list with section headers
- [ ] Task item: dot, name, domain pill, micro-badge, timer
- [ ] Active panel (hidden until task running): dual-ring timer, micro-step panel, action buttons
- [ ] Done panel: quick strip, output button, review button, reset button

### ⏱️ Timer
- [ ] SVG dual-ring (outer: task, inner: micro)
- [ ] requestAnimationFrame tick loop
- [ ] IST-aware `todayKey()` function
- [ ] Countdown + overtime display
- [ ] Color transitions (amber → red when overtime)
- [ ] Bell sound on micro-step end, 3-note sound on task done

### 📝 Task System
- [ ] 20 tasks (c1–c20) with sections, durations, domains
- [ ] Default MICROHABITS object with steps for all 20 tasks
- [ ] Task statuses: idle, active, done, skip, overrun, interrupted
- [ ] Must-Win task (◆ diamond prefix)
- [ ] Edit Overlay with inline micro-step editing
- [ ] Customise Overlay for micro-step config before starting

### 📊 Output System
- [ ] 16 output metrics across 5 domains
- [ ] Output Engine as iframe inside output overlay
- [ ] Quick strip showing 5 key metrics
- [ ] Weekly targets with progress bars
- [ ] `incOutput()` / `decOutput()` functions

### 📿 Danda System
- [ ] Danda overlay with 5 vow sections
- [ ] Vow rows with kept/broken buttons
- [ ] Streak tracking
- [ ] Breach log
- [ ] PDF export button

### 📔 Diary System
- [ ] Diary overlay with 4 tabs
- [ ] Chief Aim (editable, with history)
- [ ] Gratitude (3 items/day)
- [ ] Journal entries with tags and prompts
- [ ] Affirmations
- [ ] Write overlay (full-screen textarea)
- [ ] Search overlay
- [ ] Toast notifications inside diary

### 🤖 Roadmap System
- [ ] Roadmap overlay
- [ ] Goal textarea + voice button
- [ ] Mode selection buttons
- [ ] Skill preset cards (horizontal scroll)
- [ ] Groq API integration
- [ ] API key saving in Settings tab

### 📋 Review System
- [ ] Review overlay with 4 tabs: Log, Review, History, Settings
- [ ] Chronological session log with gap indicators
- [ ] Gap notes inputs
- [ ] 3-question reflection form with voice
- [ ] History cards (expandable)
- [ ] Settings tab (Groq API key)
- [ ] Gap Prompt popup

### 🗺️ 4Sadhak Guide
- [ ] Guide overlay rendered from embedded HTML template
- [ ] 4 view tabs: Timeline, Cards, Mindmap, Outputs
- [ ] 20 guide tasks with full metadata
- [ ] 5 output domains with contributing task lists
- [ ] SVG circular mindmap
- [ ] Task detail modal

### 💾 Data
- [ ] All 9 localStorage keys set up correctly
- [ ] `buildDaySnapshot()` function
- [ ] `saveSnapshot()` / `getHistory()` functions
- [ ] History cap at 90 days
- [ ] Daily reset flow (confirm → snapshot → fresh state)
- [ ] JSON import/export in Edit overlay

---

## Quick Start Prompt for Bolt/Cursor

Copy this into Bolt or Cursor to get started:

> Build a single-file `index.html` Progressive Web App called "साधक" (Sadhak) v5.0. It is a mindful productivity tracker with Marathi UI text. It must have: a 20-task daily planner with a dual-ring SVG countdown timer, micro-steps system, 5 life domains (SELF/SKILL/MONEY/BRAND/NETWORK), 16 output metrics, a Danda vow-tracking overlay, a Diary overlay with journaling/gratitude/affirmations, an AI Roadmap planner using the Groq API, and an end-of-day review system with history snapshots stored in localStorage. All data lives in localStorage only. Design is minimal, warm off-white (#FAFAF8), amber accent (#B8832A), IBM Plex Mono font, Crimson Pro for serif text, max-width 420px mobile-first. No frameworks, no build tools — pure HTML + CSS + JS in one file.

---

*This README was generated from the original `index.html` source code of साधक v5.0.*
