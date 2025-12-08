## PR: Publish docs/website to GitHub Pages

### Summary
This PR publishes the `docs/website` static site to GitHub Pages using the `gh-pages` workflow. It includes the landing page, docs, and a smoke test workflow for CI.

### What to verify
- The `docs/website` folder contains `index.html` and `style.css`.
- The `gh-pages` workflow runs on push to `docs/site` and `main` and deploys the site.
- The smoke test workflow exists under `.github/workflows/smoke.yml` and is configured to run on PRs.

### PR description (for you to paste)
> Deploy project docs to GitHub Pages
>
> This PR adds a GitHub Actions workflow to publish `docs/website` to GitHub Pages. It also includes project docs and CI smoke test workflows.
>
> How to test locally:
> 1. Open `docs/website/index.html` or run `python -m http.server 8081 -d docs/website` and visit `http://127.0.0.1:8081`.
> 2. Confirm the site looks correct and links to `README.md`, `LESSONS_LEARNED.md`, and `NEXT_STEPS.md`.

### Notes
If your organization requires a specific Pages branch / domain configuration, update the workflow or Pages settings accordingly.

