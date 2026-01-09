Release process and odd/even version policy

Overview

This project uses a patch-only bump policy for production builds with a deterministic odd/even rule:
- Visual-only releases use odd patch numbers (e.g. 1.0.1, 1.0.3).
- Functional/overall releases use even patch numbers (e.g. 1.0.2, 1.0.4).

Why
- Makes it easier to identify and revert visual-only changes quickly.
- Simple rules for non-technical users to understand.

How it works (Option A, auto-detect)
- CI runs `scripts/auto-bump-version.js --mode=auto` before production builds.
- The script runs `npm run check` and inspects changed files to classify the change as visual or overall.
- The script bumps the patch number to the next odd (visual) or even (overall) value, updates `package.json`, commits and tags the release.

Manual overrides
- To force a visual bump: `node scripts/auto-bump-version.js --mode=visual`
- To force an overall bump: `node scripts/auto-bump-version.js --mode=overall`
- To run a dry run: add `--dry-run`.

CI notes
- By default CI can run with `--push` to push commits and tags. Configure the workflow to use a service account token if necessary.

Rollback
- If a release needs to be reverted, restore the previous commit and delete the tag:
  git revert <commit>
  git push
  git tag -d vX.Y.Z
  git push origin :refs/tags/vX.Y.Z



PR-mode and finalization workflow

PR-mode
- For pull requests, the version is bumped to the next patch number (odd or even) based on the target branch's version.
- The version bump is done by the `scripts/auto-bump-version.js --mode=pr` script, which is run automatically in the CI.

Finalization workflow
- After merging a pull request, the release process should be finalized by running the `scripts/finalize-release.js` script.
- This script will create a new release commit and tag, based on the merged changes.

Manual overrides for non-technical users
- If you need to manually bump the version or create a release, you can do so by following these steps:
  1. Decide if the release is visual-only or functional/overall.
  2. Bump the patch number in `package.json` to the next odd (visual) or even (overall) number.
  3. Commit the changes with a message like "Release version X.Y.Z".
  4. Tag the release with the same version number: `git tag -a vX.Y.Z -m "Release version X.Y.Z"`.
  5. Push the commit and tag to the repository: `git push && git push origin vX.Y.Z`.
