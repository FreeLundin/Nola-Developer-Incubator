# Designer Workflow (Short)

This page outlines practical steps for designers to add assets and prepare submissions.

1. Art & Textures
  - Place source assets in `client/public/images/` or `client/public/textures/`.
  - Preferred formats: PNG (UI), WebP (compressed), GLB for models.
  - Sizes: textures <= 2048x2048.

2. Audio
  - Place in `client/public/sounds/` and follow `wiki/Audio.md` guidance.

3. Preview & Checklist
  - Provide a thumbnail (512x512 PNG) and a checklist:
    - [ ] Texture sizes ok
    - [ ] Naming convention followed
    - [ ] Alpha preserved or flattened

4. Submit
  - Create a PR with:
    - Files added under `client/public/assets/<asset-name>/`
    - A preview image in PR description (attach thumbnail)
    - A short checklist mention and tags: `design`, `asset`

5. QA
  - Designers should test in the running dev server and link replay or screenshots in the PR.

If you need a template asset checklist file, I can add `docs/ASSET_SUBMISSION_TEMPLATE.md` to the repo.

---
