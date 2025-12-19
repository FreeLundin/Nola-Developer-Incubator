# 🚀 Vercel Deployment Guide for NDI Mardi Gras Parade

This guide walks you through deploying the Mardi Gras Parade game to Vercel, making it accessible to anyone with the deployment URL.

## 📋 Prerequisites

Before deploying, ensure you have:

- A [Vercel account](https://vercel.com/signup) (free tier is sufficient)
- A [GitHub account](https://github.com) with this repository forked or accessible
- A PostgreSQL database (we recommend [Neon](https://neon.tech) for free serverless PostgreSQL)
- Node.js 18+ installed locally for testing

## 🎯 Quick Deploy

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Your Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository (`FreeLundin/MardiGrasParadeGame`)
   - Vercel will automatically detect the configuration

2. **Configure Environment Variables**
   
   Add these environment variables in the Vercel project settings:
   
   ```env
   DATABASE_URL=postgresql://username:password@host/database?sslmode=require
   NODE_ENV=production
   ```
   
   > **Note:** Get your `DATABASE_URL` from your Neon database dashboard (see Database Setup section below)

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically:
     - Install dependencies
     - Run `npm run vercel-build` (which runs `npm run build`)
     - Deploy to a production URL

4. **Access Your Deployment**
   - Once deployed, Vercel provides a URL like: `https://your-project-name.vercel.app`
   - The game will be live and accessible to anyone!

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

The CLI will guide you through:
- Linking to your Vercel account
- Setting up the project
- Configuring environment variables
- Deploying the application

## 🗄️ Database Setup

### Using Neon (Recommended)

1. **Create a Neon Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up for a free account

2. **Create a Database**
   - Click "Create Project"
   - Name your project (e.g., "mardigras-parade")
   - Select your preferred region
   - Create the project

3. **Get Connection String**
   - In your Neon dashboard, go to "Connection Details"
   - Copy the connection string (it looks like):
     ```
     postgresql://username:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=require
     ```

4. **Add to Vercel**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add `DATABASE_URL` with your Neon connection string
   - Click "Save"

5. **Initialize Database Schema**
   ```bash
   # Clone the repository locally
   git clone https://github.com/FreeLundin/MardiGrasParadeGame.git
   cd MardiGrasParadeGame
   
   # Install dependencies
   npm install
   
   # Set your DATABASE_URL in .env file
   echo "DATABASE_URL=your_neon_connection_string" > .env
   
   # Push the database schema
   npm run db:push
   ```

## ⚙️ Configuration Details

### vercel.json

The `vercel.json` file configures how Vercel builds and serves your application:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*\\..+)",
      "dest": "/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**Key Points:**
- **buildCommand**: Runs the production build
- **outputDirectory**: Points to built static assets
- **routes**: 
  - API calls go to serverless function
  - Static assets are served directly
  - All other routes serve the SPA index.html

### Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@host/db` |
| `NODE_ENV` | Environment mode | Yes | `production` |

## 🔍 Verifying Your Deployment

After deployment, test these endpoints:

1. **Main Application**
   ```
   https://your-project-name.vercel.app/
   ```
   Should load the game interface

2. **Health Check**
   ```
   https://your-project-name.vercel.app/api/health
   ```
   Should return:
   ```json
   {
     "status": "ok",
     "timestamp": "2024-12-18T22:00:00.000Z",
     "env": "production"
   }
   ```

3. **Static Assets**
   ```
   https://your-project-name.vercel.app/assets/[asset-name]
   ```
   Should load fonts, textures, and other game assets

## 🐛 Troubleshooting

### Build Fails

**Problem:** Build fails during deployment

**Solutions:**
1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json` (not just `devDependencies`)
3. Verify Node.js version compatibility (18+)
4. Try building locally first: `npm run build`

### Database Connection Errors

**Problem:** Application can't connect to database

**Solutions:**
1. Verify `DATABASE_URL` is correctly set in Vercel environment variables
2. Ensure connection string includes `?sslmode=require` for Neon
3. Check that database schema is pushed: `npm run db:push`
4. Verify database is accessible (not behind firewall)

### 404 Errors on Routes

**Problem:** Navigation within the app returns 404

**Solutions:**
1. Check that `vercel.json` routes configuration is correct
2. Ensure the catch-all route `"dest": "/index.html"` is present
3. Verify build output contains `index.html` in `dist/public/`

### Static Assets Not Loading

**Problem:** Textures, sounds, or fonts don't load

**Solutions:**
1. Check browser console for 404 errors
2. Verify assets are in `client/public/` before build
3. Ensure asset paths are relative (start with `/`)
4. Check Vercel logs for asset serving issues

### Environment Variables Not Applied

**Problem:** Environment variables don't seem to work

**Solutions:**
1. After adding variables, trigger a new deployment
2. Check variable names exactly match (case-sensitive)
3. Verify variables are not marked as "development only"
4. Try redeploying: `vercel --prod --force`

### Serverless Function Timeout

**Problem:** API requests timeout after 10 seconds

**Solutions:**
1. Optimize database queries
2. Consider upgrading to Vercel Pro for 60s timeout
3. Use async operations efficiently
4. Implement caching where possible

## 🔄 Continuous Deployment

Vercel automatically deploys:

- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches and PRs

To disable auto-deploy for a branch:
1. Go to Project Settings → Git
2. Configure branch deploy settings

## 📊 Monitoring & Analytics

### Vercel Analytics

Enable analytics in your Vercel dashboard:
1. Go to your project
2. Click "Analytics" tab
3. Enable Web Analytics
4. Add the analytics script (already configured in the build)

### Vercel Logs

View real-time logs:
1. Go to project dashboard
2. Click "Deployments"
3. Select a deployment
4. View "Functions" logs for API calls
5. View "Build" logs for build errors

## 🚀 Performance Optimization

### Recommendations

1. **Enable Caching**
   - Static assets are automatically cached by Vercel CDN
   - Configure cache headers for API responses

2. **Optimize Bundle Size**
   - The build already uses code splitting
   - Consider dynamic imports for large components

3. **Use Edge Functions** (Optional)
   - For ultra-low latency, consider migrating API routes to Edge Functions
   - See [Vercel Edge Functions docs](https://vercel.com/docs/functions/edge-functions)

4. **Database Connection Pooling**
   - Neon automatically provides connection pooling
   - Use the pooled connection string for better performance

## 🔗 Useful Links

- **Vercel Documentation**: https://vercel.com/docs
- **Neon Documentation**: https://neon.tech/docs
- **Project Repository**: https://github.com/FreeLundin/MardiGrasParadeGame
- **Vercel CLI**: https://vercel.com/docs/cli

## 📝 Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] 3D game environment renders correctly
- [ ] API health check returns status "ok"
- [ ] Static assets (textures, sounds) load properly
- [ ] Database connectivity works
- [ ] Mobile responsiveness verified
- [ ] Performance is acceptable (45+ FPS)
- [ ] No console errors in browser
- [ ] Environment variables are set correctly
- [ ] Custom domain configured (optional)

## 🎮 Share Your Deployment

Once deployed, share your game with:
- Direct link: `https://your-project-name.vercel.app`
- Custom domain (configure in Vercel dashboard)
- Social media with screenshots/videos

## 🆘 Need Help?

- **GitHub Issues**: [Create an issue](https://github.com/FreeLundin/MardiGrasParadeGame/issues)
- **Vercel Support**: [Vercel Help](https://vercel.com/help)
- **Community**: Check GitHub Discussions

---

## 🎉 Success!

Your Mardi Gras Parade game is now live on Vercel! Anyone with the URL can play the game in their browser.

**Laissez les bons temps rouler!** 🎭

---

*Last updated: December 2024*
