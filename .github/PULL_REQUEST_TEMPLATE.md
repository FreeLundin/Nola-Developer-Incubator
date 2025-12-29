chore: remove legacy provider references

This PR removes references to the previous hosting provider from public docs, replaces workflow with deprecation stubs, and archives historical provider-specific files under `archive/legacy-hosting/`.

Changes:
- Remove provider mentions from README/DEPLOYMENT/docs
- Replace `.github/workflows/deploy-to-vercel.yml` with a stub and archive original
- Remove optional provider-specific imports from client code
- Add `scripts/deploy-legacy-hosting.sh` as neutral stub and archive originals
- Regenerate package-lock.json and back up original (note: peer metadata for @vercel/postgres remains in lockfile as optional peer)

Verification:
- TypeScript checks: `npm run check` ✅
- Production build: `npm run build` ✅

Notes:
- `@vercel/postgres` appears as an optional peer declared by `drizzle-orm`; left as peer metadata in lockfile. To fully remove it we must update the dependent package or take a more invasive lockfile rewrite.
- Archive copies kept in `archive/legacy-hosting/` and `archive/vercel/` for historical restoration.

Next steps (optional):
- Review and merge.
- If desired, I can attempt an upgrade/patch to remove `@vercel/postgres` from the dependency graph (requires more testing).

