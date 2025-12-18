# Designer Workflow (Short)

This page outlines practical steps for designers to add assets and prepare submissions. The focus is quick playtesting and easy QA.

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

5. QA (Playtest-focused)
  - Use the canonical quick-launch page `docs/launch.html` or the public link:
    `https://mardigrasparadesim2026.busaradigitalstrategy.com` to verify assets in the live build.
  - Update the public URL helper when you publish a new tunnel URL: edit `docs/last-public-url.txt` and run:

    ```bash
    node scripts/update-public-url.mjs
    ```

  - For each asset PR include:
    - The public URL or a `docs/launch.html` snapshot used for verification
    - Device/browser notes and any reproduction steps
    - A checklist showing the items below (copy from the asset template)

6. Quick asset submission checklist (use `docs/ASSET_SUBMISSION_TEMPLATE.md`)
  - Title, short description, and author (Designer)
  - Folder path in repo
  - Thumbnail (512x512) and preview screenshot(s)
  - File formats and sizes
  - Performance notes (polycount, LODs, texture sizes)
  - Accessibility/contrast notes (for UI assets)

7. QR & Mobile Testing
  - After `node scripts/update-public-url.mjs` the QR is generated at `docs/browser-qr.svg`.
  - To create a PNG QR (for PR screenshots):

    ```powershell
    # (optional) use the included PS script to generate PNG QR
    .\ps1\generate-qr.ps1 -Url "$(Get-Content .\docs\last-public-url.txt | Select-Object -Last 1)"
    ```

8. Contact / Project Lead
  - For design decisions or approvals, contact the Project Lead: Brian C Lundin

If you need a template asset checklist file, it is available at `docs/ASSET_SUBMISSION_TEMPLATE.md`.

---
