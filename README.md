# दैनिक साधनेची लय — Sadhak Daily Journal (PWA)

Static, offline-capable web app (no build step, no server code). A4 landscape, 3 pages:
page 1 = 03:00–09:30, page 2 = 09:30–21:30 (each = reference column(s) on the left + a ruled
spontaneous-log column on the right), page 3 = written reflection.

## Deploy on GitHub Pages
1. Create a repository and upload **everything in this folder** to the repository root
   (`index.html`, `manifest.webmanifest`, `sw.js`, `libs/`, `icons/`, `.nojekyll`).
2. Repo → **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main`, folder `/ (root)` → Save.
3. Open `https://<user>.github.io/<repo>/` — all paths are relative, so project sub-paths work.
   Use "Install app / Add to Home screen" for the standalone app.

## Easy app view (v1.1)
- Screens show a touch-friendly app view: big tap rows, bottom tabs **१ · अभ्यास / २ · लेखन** (or swipe),
  floating **⏱ आत्ता** button (jumps to the current time block, which is also highlighted), today's weekday
  card on top, auto-growing writing boxes, ☰ menu for PDF / archive / print / reset.
- **कागद दृश्य (A4)** in the menu shows the exact paper layout. Print and the midnight / “आजचे PDF” export
  always use the paper layout (A4 landscape, 3 pages), whichever view is on screen.

## Continuous log (v1.2)
- One unlimited writing field beside all practice lists for minute-by-minute notes (no per-block boxes).
  Wide screens: sticky panel on the right. Phones/tablets: **✎ लॉग** button opens a bottom sheet.
- **⏱ वेळ टाका** (or Ctrl/Cmd+Enter, or double-tap on an empty line) inserts `HH:MM — `;
  tapping a block heading inserts `HH:MM — <block name>: `.
- Paper/print/PDF: see “Time-window pages” below. Blank journal = exactly 3 pages.
- The midnight PDF includes the whole log; the log is cleared only after the PDF is saved.

## Time-window pages (v1.3)
- **Page 1 · ०३:०० – ०९:३०** and **page 2 · ०९:३० – २१:३०**. Left half = *संदर्भ* (the practice checklists for that window),
  right half = *लॉग · सहज प्रवाह* (blank ruled space for the spontaneous flow of the day). Page 3 = reflection.
- The log is still **one continuous field** in the app. On paper / print / PDF it is split by its `HH:MM —` stamps:
  stamps 00:00–09:29 go to page 1's log, 09:30–23:59 to page 2's log. A line without a stamp stays with the entry above it;
  text before the first stamp belongs to page 1.
- If a window's log is longer than its column, continuation pages (“लॉग — पुढे · <window>”) follow **that** page
  (page 1 → its continuation → page 2 → its continuation → reflection). Pages are numbered automatically.
- When you tap at the end of the log in a different time window than the last stamp (e.g. first note after 09:30), a
  stamp is added automatically so the entry lands on the right page. **⏱ वेळ टाका** / Ctrl+Enter on an empty stamp only refreshes its time.
- App view is unchanged: tab १ shows both practice windows as one continuous list with the log panel; tab २ is the reflection.
  The paper view (कागद दृश्य) is a live preview of what prints; tapping a log column there opens the app view's log.
- Page 3 = old page 2 (content unchanged). Saved marks keep working (item ids are unchanged).

## Theme + today's tasks (v1.4)
- **आजची थीम** write-in sits in the header of page 1 and page 2, next to तारीख / वार. It is the same field as the theme on page 3
  (type it once, it shows on all pages). Weekly theme cycle is on page 3.
- **आजची कामे · ०३:०० – ०९:३०** (page 1, foot of the 2nd reference column) and **आजची कामे · ०९:३० – २१:३०** (page 2, foot of the 2nd column)
  are write-in task lines, each with a circle (tap cycles empty → done → half, like the rest of the map). In the app view each block is shown first on its tab.
- Row counts are `TASK_ROWS` in `source/build_journal.py` (page 1 = 4, page 2 = 7, the most that fit the free space without crowding the lists).

## Workbook tab (v1.5) — from `Sadhak_Operational_v2_Yama_Niyama_52.pdf` (pages 4–44)
- New bottom tab **३ · चिंतन** (swipe works across 3 tabs): 15 deep-reflection topics (१. शक्यता … १५. आत्मचिंतन), **विभाग A** (identity · direction · what not to do) and
  **विभाग G · यम – नियम** (all 52 rules, two columns). Each question has an auto-growing answer box; each section shows an answered count.
- Stored separately (`sadhak-workbook-v1`) — **never cleared by the midnight reset or रीसेट**; it is a personal reference, not a daily list.
- ☰ menu → **चिंतन वही — प्रिंट / PDF** prints the whole workbook (A4 landscape, ruled answer lines). Daily pages 1–3 and the midnight PDF are unchanged.
- **v1.6:** the 15 topics now hold the 150 questions (10 each) from `Sadhak_Daily_Journal_Workbook_150_Questions.pdf` (read by OCR because that PDF's text layer is garbled; stored in `source/workbook.json`). Answers to the older topic questions are no longer shown; विभाग A and G are unchanged.
- Section A text was generated from the earlier PDF: `python3 source/extract_workbook.py <pdf> source/workbook.json` (needs `pdftotext`), then rebuild `index.html`.

## यम-नियम daily record + chintan answers in the midnight PDF (v2.0)
- New bottom tab **४ · यम-नियम**: all 52 rules (विभाग G moved here from the चिंतन tab). Against every rule choose
  **पालन**, **भंग · बेहोशीत** or **भंग · होशात** (tap again to clear). Only a rule broken **in बेहोशी** carries the penalty of
  **१२ दंडबैठका** (`YN_PENALTY` in `source/build_journal.py`); a button then records whether the दंड was **घेतला** or is still **बाकी**.
  A rule broken consciously (होशात) carries no penalty. A summary bar shows पालन / भंग / दंड घेतला / बाकी दंडबैठका.
- Stored in the daily state (`yn`, `yp`), so it is **reset at midnight like the rest of the day** — after being exported.
- The daily PDF (midnight export, **आजचे PDF**, print, paper view) now has, after page 3: **३ pages of the यम-नियम record**
  (every rule with its status boxes and the penalty column, plus the day's totals) and, if any, **pages with the chintan answers written that day**.
- **Chintan answers** are stored with the day they were last written (`sadhak-workbook-v2`, `{t, d}`). They are **never cleared**.
  Only answers written (or edited) on the day being exported go into that day's midnight PDF; older answers stay in the
  workbook untouched and are not repeated. Each answer shows whether it is "आजचे" or "पूर्वीचे". Answers from v1.x are kept as older answers.
- **चिंतन — सर्व उत्तरांसह PDF** (☰ menu and top of the चिंतन tab): all questions + all answers, or only the answered ones.
  The old blank/ruled print stays as **चिंतन वही — प्रिंट / PDF (रिकामी)**.

- **तारीख / वार** are filled with today's date in the app (and refreshed at the midnight reset); the print-ready blank PDF is generated with them empty.

## Fixes in v2.0
- `sw.js` was empty, so the app did not work offline. It now caches the app, icons and PDF libraries (bump `VERSION` on every release).
- A resize / font-load / page-load event during PDF capture could re-paginate the pages and abort the midnight export
  ("Unable to find element in cloned iframe") — layout is now locked while a capture runs, and two PDFs can no longer run at once.
- The midnight reset no longer forgets the chosen view (ॲप / कागद) and the first-run tip.
- Space key on a circle no longer toggles twice; the weekday card also refreshes if the app stays open over midnight;
  long unbroken words are never split inside a Devanagari conjunct when paginating the log.

## Behaviour
- Circle click cycle: empty → dark → half → empty. Everything autosaves in the browser (localStorage).
- **Auto midnight reset (toolbar checkbox, on by default):** when the local date changes, the finished
  day is exported to `Sadhak_Journal_YYYY-MM-DD.pdf` (downloaded **and** kept in the in-app **आर्काइव**),
  then all marks/text are cleared and date + वार are pre-filled for the new day. A day with nothing
  filled in is not exported. If PDF creation fails, nothing is cleared and it retries after 5 minutes.
- A web page cannot run while closed: if the app is closed at midnight, the export + reset happens
  the next time it is opened or brought to the foreground (the PDF still contains the previous day's data).
- **आजचे PDF** exports the current state any time; **प्रिंट** gives a vector A4-landscape print/PDF.
- Data lives only in this browser/device (no sync). Clearing site data deletes entries and archive.

## Updating
Change files, then bump `VERSION` in `sw.js` so installed copies refresh (they update on the next load).
`index.html` is generated: edit `source/build_journal.py` + `source/app.js`, then run
`FONT_DIR=<path to @fontsource/noto-sans-devanagari/files> python3 source/build_journal.py index.html`.
