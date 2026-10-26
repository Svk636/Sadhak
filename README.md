# दैनिक साधनेची लय — Sadhak Daily Journal (PWA)

Static, offline-capable web app (no build step, no server code). A4 landscape, 2 pages:
page 1 = practice tracking, page 2 = written reflection.

## Deploy on GitHub Pages
1. Create a repository and upload **everything in this folder** to the repository root
   (`index.html`, `manifest.webmanifest`, `sw.js`, `libs/`, `icons/`, `.nojekyll`).
2. Repo → **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main`, folder `/ (root)` → Save.
3. Open `https://<user>.github.io/<repo>/` — all paths are relative, so project sub-paths work.
   Use "Install app / Add to Home screen" for the standalone app.

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
