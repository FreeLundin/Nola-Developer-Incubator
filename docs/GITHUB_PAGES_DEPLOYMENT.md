# 🎭 MardiGrasParadeGame — GitHub Pages Deployment Blueprint

This document defines the **canonical, production‑ready GitHub Pages configuration** for deploying the MardiGrasParadeGame.  
Follow this structure and your game will load correctly every time.

---

# 1. GitHub Pages Configuration

Navigate to:

**GitHub → Repository → Settings → Pages**

Set:

- **Source:** `main` (or `master`)
- **Folder:**  
  - `root` (recommended)  
  - or `/docs` if your build output lives there

GitHub Pages will only serve content from the selected folder.  
That folder **must contain `index.html`**.

---

# 2. Required Repository Structure

Your published folder (root or `/docs`) must look like this:

```
MardiGrasParadeGame/
│
├── index.html
├── assets/
│   ├── images/
│   ├── audio/
│   ├── scripts/
│   └── styles/
├── js/
├── css/
└── README.md
```

If your game builds into `/dist`, `/build`, or `/public`, move the **contents** of that folder into the publish root or point GitHub Pages to that folder.

---

# 3. Asset Path Requirements (Critical)

GitHub Pages serves your site from:

```
/MardiGrasParadeGame/
```

Therefore **absolute paths break**.

❌ Incorrect  
```
/assets/sprites/player.png
```

✔️ Correct  
```
assets/sprites/player.png
```

or

```
./assets/sprites/player.png
```

This applies to:

- images  
- audio  
- JSON  
- WASM  
- GLTF/GLB  
- JS bundles  
- CSS  

This is the #1 cause of blank screens on GitHub Pages.

---

# 4. Optional: GitHub Actions Auto‑Deploy (Recommended)

If you want automated deployment:

- Build your game on every commit  
- Push the output to `gh-pages`  
- Zero manual steps  

Add this workflow:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ "main" ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Change `publish_dir` to match your build output folder.

---

# 5. Optional: Clean `index.html` Scaffold

If you need a starter HTML shell for your game:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mardi Gras Parade Game</title>
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <div id="game-container"></div>
  <script src="js/game.js"></script>
</body>
</html>
```

---

# ✔️ Deployment Checklist

- [ ] `index.html` exists in the publish root  
- [ ] All asset paths are **relative**, not absolute  
- [ ] Build output folder matches GitHub Pages settings  
- [ ] (Optional) GitHub Actions workflow added  
- [ ] (Optional) HTML scaffold integrated  

---

# 🎉 Result

Following this blueprint ensures:

- GitHub Pages loads your game correctly  
- No blank screens  
- No missing assets  
- Clean, repeatable deployment  
- Optional CI/CD automation  
