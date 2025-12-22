# Deployment Guide (provider-neutral)

This document explains how to publish the frontend and backend of the project.

## Recommended: GitHub Pages (frontend)

The project can publish the frontend build output (`dist/public`) to GitHub Pages using the included workflow `.github/workflows/deploy-gh-pages.yml` or the `deploy:gh-pages` npm script.

Manual deploy (local):

```bash
npm run build
npm run deploy:gh-pages
```

The site will be available at https://Nola-Developer-Incubator.github.io/MardiGrasParadeGame/ when published.

## Self-hosting (backend + frontend)

For full control, host the backend and frontend yourself.

1. Build the project:

```bash
npm ci
npm run build
```

2. Start the server:

```bash
npm start
```

The server listens on port 5000 by default (configure via `PORT` env variable).

## CI/CD

Use GitHub Actions to build and publish artifacts. The repository contains workflows under `.github/workflows/` for GitHub Pages and CI checks. Remove or edit workflows you do not use.

## Healthcheck

Test the running service locally or in production:

```bash
curl http://localhost:5000/api/health
# or
curl https://<your-host>/api/health
```

Expect a JSON response with `{ "status": "ok" }`.

## Notes

- For database-backed deployments, set `DATABASE_URL` in the environment.
- For production, ensure `NODE_ENV=production` and a secure `SESSION_SECRET` are set.
- For static-only frontend hosting, publish `dist/public` to your static host of choice (GitHub Pages, Netlify, S3, etc.).

If you need to recover previous provider-specific instructions, check repository history or the `archive/` directory for historical notes.
