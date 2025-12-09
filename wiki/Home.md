# Mardi Gras Parade Simulator Wiki

Welcome — this wiki contains concise, navigable pages for contributors, designers, and engineers working on the Mardi Gras Parade Simulator.

Quick links

- [Quick Start](./QuickStart.md)
- [Game Design (GDD)](./Game_Design.md)
- [Designer Workflow](./Designer_Workflow.md)
- [Technical Documentation](./TechnicalDocumentation.md)
- [Admin UI & Bot Config](./Admin_UI.md)
- [Audio & Howler.js notes](./Audio.md)
- [Playwright test guide](./Playwright_Testing.md)
- [Archived artifacts](./Archive.md)

How to publish these pages to GitHub Wiki

1. Clone the wiki repository:

```powershell
# Replace YOUR_USERNAME if needed
git clone https://github.com/FreeLundin/Nola-Developer-Incubator.wiki.git
```

2. Copy the files from the `wiki/` folder in this repo into the cloned wiki repo, commit, and push:

```powershell
# from the repo root
cp -Recurse wiki\* ../Nola-Developer-Incubator.wiki\
cd ../Nola-Developer-Incubator.wiki
git add .
git commit -m "docs(wiki): initial wiki pages"
git push origin main
```

Notes
- If you prefer to use the GitHub web UI, open the repository wiki and create pages, then paste content from these files.
- These wiki pages are intentionally kept short and link back to the detailed files in `docs/` when appropriate.

