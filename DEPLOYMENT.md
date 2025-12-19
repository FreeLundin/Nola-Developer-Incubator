- ⚡ **Instant Load** - Optimized for fast loading via Vercel's CDN
- 🔒 **Secure** - Automatic HTTPS encryption

#### Perfect For:
- Portfolio demonstrations
- Sharing with friends and family
- Public beta testing
- Game showcases and competitions
- Educational purposes
- Community events

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Status:** ✅ Production-ready configuration  
**Public Access:** ✅ Yes, fully public  
**Setup Time:** ~5 minutes  

**Quick Deploy:**
1. Click: <a href="https://vercel.com/new/clone?repository-url=https://github.com/Nola-Developer-Incubator/MardiGrasParadeGame"><img src="https://vercel.com/button"></a>
2. Add `DATABASE_URL` environment variable
3. Deploy!

**Result:** Game accessible at `https://your-project-name.vercel.app`

**Documentation:** <a>README_VERCEL.md</a>

### Option 2: Self-Hosting

**Status:** ✅ Supported  
**Public Access:** Depends on your hosting setup  
**Setup Time:** ~30-60 minutes  

**Requirements:**
- Node.js 18+ server
- PostgreSQL database
- Reverse proxy (nginx/Apache)
- SSL certificate (Let's Encrypt)

**Build &amp; Start:**
```bash
npm install
npm run build
npm start
```

Server runs on port 5000 by default (configurable via `PORT` env variable).

---

## 🔗 Example Deployment URLs

Once deployed, your game will be accessible at URLs like these (replace `your-project-name` with the actual Vercel project name you choose):

### Production URLs
```
Main Application:  https://your-project-name.vercel.app/
API Health Check:  https://your-project-name.vercel.app/health
Static Assets:     https://your-project-name.vercel.app/assets/[filename]
```

### Preview URLs (for testing branches/PRs)
```
Feature Branch:    https://your-project-name-git-feature-branch.vercel.app/
Pull Request:      https://your-project-name-pr-123.vercel.app/
```

Note: If you depend on a public demo for automated tests, set the `PLAYTEST_URL` repo secret or the environment variable in your CI with the real deployed URL.
