# Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the Mardi Gras Parade Game to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier works)
- A [GitHub account](https://github.com) with access to this repository
- A PostgreSQL database (we recommend [Neon](https://neon.tech) for free serverless PostgreSQL)

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Nola-Developer-Incubator/MardiGrasParadeGame)

## Step-by-Step Deployment

### 1. Prepare Your Database

1. Create a free PostgreSQL database on [Neon](https://neon.tech)
2. Copy your database connection string (it should look like: `postgresql://user:password@host/database?sslmode=require`)
3. Keep this connection string handy for the next steps

### 2. Connect Your GitHub Repository to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository:
   - Click **"Import Git Repository"**
   - Select **Nola-Developer-Incubator/MardiGrasParadeGame**
   - If not visible, click **"Adjust GitHub App Permissions"** to grant access
4. Configure your project:
   - **Framework Preset:** Other (Vercel will auto-detect settings)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run vercel-build` (should be auto-detected)
   - **Output Directory:** `dist/public` (should be auto-detected from vercel.json)

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from the project root
vercel

# Follow the prompts to link your project
```

### 3. Configure Environment Variables

Before deploying, you must set up the required environment variables in Vercel:

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `DATABASE_URL` | Your PostgreSQL connection string from Neon | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |
| `SESSION_SECRET` | A random secure string (use a password generator) | Production, Preview, Development |

**Important Notes:**
- `DATABASE_URL` should include `?sslmode=require` at the end
- Generate a strong `SESSION_SECRET` using: `openssl rand -base64 32`
- Make sure to add these variables to all environments (Production, Preview, Development)

### 4. Initialize Database Schema

After your first deployment:

1. Install dependencies locally: `npm install`
2. Set your `DATABASE_URL` environment variable locally:
   ```bash
   export DATABASE_URL="your_connection_string_here"
   ```
3. Push the database schema:
   ```bash
   npm run db:push
   ```

Alternatively, you can run this from the Vercel dashboard:
1. Go to your project → **Settings** → **Functions**
2. Use the built-in terminal or deploy a function that runs the migration

### 5. Deploy

#### Automatic Deployment (Recommended)
Vercel will automatically deploy your application when you:
- Push to the `main` branch (production deployment)
- Create or update a pull request (preview deployment)

#### Manual Deployment
To manually trigger a deployment:

1. **From Vercel Dashboard:**
   - Go to your project → **Deployments**
   - Click **"Redeploy"** on any previous deployment

2. **From CLI:**
   ```bash
   vercel --prod
   ```

### 6. Verify Deployment

Once deployed, Vercel will provide you with a URL like: `https://your-project.vercel.app`

Test the following:
1. ✅ **Home page loads** - Visit the root URL
2. ✅ **3D game renders** - Check that the Three.js game environment loads
3. ✅ **API endpoints work** - Check browser console for any API errors
4. ✅ **Static assets load** - Textures, sounds, and models should load
5. ✅ **Database connectivity** - Any features requiring database should work

### 7. Custom Domain (Optional)

To use a custom domain:

1. Go to your project → **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain name
4. Follow Vercel's instructions to configure DNS

## Project Structure for Vercel

```
MardiGrasParadeGame/
├── api/
│   └── index.js          # Vercel serverless function entry point
├── client/               # React frontend source
├── server/               # Express backend source
│   ├── app.ts           # Exportable app factory
│   └── index.ts         # Development server
├── dist/                 # Build output (generated)
│   ├── public/          # Static frontend assets
│   ├── index.js         # Built server code
│   └── app.js           # Built app factory
├── vercel.json          # Vercel configuration
├── .vercelignore        # Files to exclude from deployment
└── package.json         # Contains vercel-build script
```

## Configuration Files

### vercel.json
Defines the Vercel deployment configuration:
- **Builds:** Specifies Node.js runtime for serverless API
- **Routes:** Configures routing for API and static assets
- **Output Directory:** Points to `dist/public` for static files

### .vercelignore
Excludes unnecessary files from deployment to reduce bundle size:
- `node_modules/` (rebuilt by Vercel)
- Development files and documentation
- Unreal Engine files
- Build artifacts (rebuilt during deployment)

## Troubleshooting

### Build Failures

**Issue:** Build fails with "Cannot find module" errors
- **Solution:** Ensure all dependencies are in `dependencies`, not `devDependencies`
- Check that TypeScript compiles without errors: `npm run check`

**Issue:** Build timeout
- **Solution:** Vercel's free tier has build time limits. Optimize your build:
  - Remove unused dependencies
  - Consider code splitting for large bundles

### Runtime Errors

**Issue:** "Internal Server Error" or blank page
- **Solution:** Check Vercel function logs:
  1. Go to your project → **Deployments**
  2. Click on the deployment → **Functions**
  3. Check the logs for errors

**Issue:** Database connection errors
- **Solution:** 
  - Verify `DATABASE_URL` is set correctly in environment variables
  - Ensure your connection string includes `?sslmode=require`
  - Check that your database allows connections from Vercel's IP ranges

**Issue:** Assets (textures, sounds) not loading
- **Solution:** 
  - Verify assets are in `client/public/` directory
  - Check that build includes all asset files
  - Review browser console for 404 errors

### Performance Issues

**Issue:** Slow initial load
- **Solution:**
  - Vercel serverless functions cold start can add latency
  - Consider upgrading to Vercel Pro for better performance
  - Optimize bundle size (see build warnings)

**Issue:** 3D rendering slow or choppy
- **Solution:** This is client-side performance, not related to deployment:
  - Optimize 3D models and textures
  - Reduce polygon counts
  - Use level-of-detail (LOD) techniques

## Environment-Specific Behavior

- **Development (`npm run dev`)**: 
  - Uses Vite middleware for HMR
  - Serves from `client/` directory
  - Runs on `localhost:5000`

- **Production (`vercel`)**: 
  - Serves pre-built static files from `dist/public`
  - API routes handled by serverless functions
  - No HMR or live reload

## Useful Commands

```bash
# Run development server locally
npm run dev

# Type check
npm run check

# Build for production (same as Vercel)
npm run build

# Start production server locally
npm start

# Deploy to Vercel (production)
vercel --prod

# Deploy to Vercel (preview)
vercel

# View deployment logs
vercel logs

# Open Vercel dashboard for project
vercel open
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Node.js Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Neon PostgreSQL](https://neon.tech/docs)

## Getting Help

If you encounter issues:

1. Check the [Issues](https://github.com/Nola-Developer-Incubator/MardiGrasParadeGame/issues) page
2. Review Vercel function logs for detailed error messages
3. Verify all environment variables are set correctly
4. Ensure database schema is up-to-date: `npm run db:push`
5. Create a new issue with:
   - Deployment logs
   - Error messages
   - Steps to reproduce

## Deployment URL

Once deployed successfully, your game will be accessible at:
- **Production:** `https://your-project.vercel.app`
- **Preview (PR):** `https://your-project-git-branch.vercel.app`

---

## 🤖 Automated GitHub Actions Deployment

This repository includes a GitHub Actions workflow that automatically deploys to Vercel when you push to the `main` branch.

### Workflow File

The workflow is located at `.github/workflows/deploy-to-vercel.yml` and runs on every push to `main`.

### What It Does

1. ✅ Checks out the code
2. ✅ Sets up Node.js 20
3. ✅ Installs dependencies with `npm ci`
4. ✅ Builds the project with `npm run vercel-build`
5. ✅ Deploys to Vercel production
6. ✅ Optionally runs database schema push (`npm run db:push`) if `DATABASE_URL` is provided

### Required GitHub Secrets

To use the automated deployment workflow, you must add the following repository secrets in GitHub Settings → Secrets and variables → Actions:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `VERCEL_TOKEN` | Vercel API token for authentication | Create at [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Your Vercel organization/user ID | Found in Vercel project settings or `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | Found in Vercel project settings or `.vercel/project.json` |
| `DATABASE_URL` | PostgreSQL connection string (optional) | From your Neon database dashboard |

📖 **For detailed setup instructions, see:** [docs/VERCEL_CI.md](docs/VERCEL_CI.md)

### How to Set Up Automated Deployment

1. **Create a Vercel project** (if you haven't already)
   - Use the Vercel Dashboard or CLI to create/link your project
   
2. **Get your Vercel IDs**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login and link project
   vercel login
   vercel link
   
   # Check .vercel/project.json for IDs
   cat .vercel/project.json
   ```

3. **Generate a Vercel token**
   - Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Click "Create Token"
   - Give it a name like "GitHub Actions - MardiGrasParadeGame"
   - Copy the token (you won't see it again!)

4. **Add secrets to GitHub**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add each of the required secrets listed above

5. **Configure Vercel environment variables**
   - In Vercel project settings → Environment Variables
   - Add `DATABASE_URL`, `NODE_ENV`, and `SESSION_SECRET`

6. **Push to main branch**
   ```bash
   git push origin main
   ```
   
   The workflow will automatically trigger and deploy your app!

7. **Monitor the deployment**
   - Check the Actions tab in GitHub for workflow status
   - View deployment in your Vercel dashboard

### Manual Deployment with CLI

If you prefer manual deployment, use the included script:

```bash
# Make sure Vercel CLI is installed
npm install -g vercel

# Run the deployment script
./scripts/deploy-vercel.sh

# Or directly with Vercel CLI
vercel --prod
```

---

## ✅ Deployment Definition of Done (DOD)

Use this checklist to ensure your deployment is complete and fully functional:

### Pre-Deployment Setup
- [ ] Vercel project created and linked to GitHub repository
- [ ] Neon PostgreSQL database created
- [ ] `DATABASE_URL` obtained from Neon dashboard
- [ ] `SESSION_SECRET` generated (use `openssl rand -base64 32`)

### GitHub Secrets Configuration
- [ ] `VERCEL_TOKEN` added to GitHub repository secrets
- [ ] `VERCEL_ORG_ID` added to GitHub repository secrets
- [ ] `VERCEL_PROJECT_ID` added to GitHub repository secrets
- [ ] `DATABASE_URL` added to GitHub repository secrets (optional, for auto DB push)

### Vercel Environment Variables
- [ ] `DATABASE_URL` set in Vercel project (Production, Preview, Development)
- [ ] `NODE_ENV` set to `production` in Vercel project
- [ ] `SESSION_SECRET` set in Vercel project (Production, Preview, Development)

### Database Initialization
- [ ] Database schema pushed successfully (`npm run db:push` locally or via CI)
- [ ] Database connection verified (check application logs)

### Deployment Verification
- [ ] Workflow ran successfully in GitHub Actions
- [ ] Deployment visible in Vercel dashboard with "Ready" status
- [ ] Production URL accessible (e.g., `https://your-project.vercel.app`)
- [ ] Home page loads without errors
- [ ] 3D game scene renders correctly
- [ ] API health endpoint returns success: `/api/health`
- [ ] Browser console shows no critical errors
- [ ] Mobile responsiveness verified (use DevTools or real device)

### Post-Deployment
- [ ] Public URL shared and documented (paste below)
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up (GitHub Actions notifications, Vercel alerts)
- [ ] Team members notified of deployment

### 📍 Record Your Deployment URL

**Production URL:** `_________________________________`

**Preview URL (if applicable):** `_________________________________`

**Date Deployed:** `_________________________________`

---

## 🚨 Troubleshooting Automated Deployment

### GitHub Actions Workflow Fails

**Issue:** Workflow fails with "Missing required secret"
- **Solution:** Verify all four secrets are added in GitHub Settings → Secrets
  - `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `DATABASE_URL` (optional)

**Issue:** Workflow fails at "Deploy to Vercel" step
- **Solution:** 
  - Verify your `VERCEL_TOKEN` is valid and not expired
  - Check that `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` match your Vercel project
  - Ensure the Vercel project exists and is linked correctly

**Issue:** Build fails with TypeScript errors
- **Solution:**
  - Run `npm run check` locally to identify TypeScript issues
  - Fix compilation errors and push again

### Database Push Fails in Workflow

**Issue:** "Run DB schema push" step fails
- **Solution:**
  - Verify `DATABASE_URL` secret is set correctly in GitHub
  - Test the connection string locally: `npm run db:push`
  - Ensure database is accessible (no IP restrictions blocking GitHub Actions)

### Deployment Succeeds But Site Doesn't Work

**Issue:** Deployment completes but site shows errors
- **Solution:**
  - Check Vercel function logs for runtime errors
  - Verify environment variables are set in Vercel (not just GitHub secrets)
  - Test API endpoint: `https://your-app.vercel.app/api/health`
  - Check that `DATABASE_URL` includes `?sslmode=require`

### Need More Help?

- 📖 Read the complete CI/CD setup guide: [docs/VERCEL_CI.md](docs/VERCEL_CI.md)
- 🔍 Check GitHub Actions logs for detailed error messages
- 📊 View Vercel deployment logs in the Vercel dashboard
- 💬 Create an issue on GitHub with deployment logs and error details

---

**Note:** The first deployment may take 2-3 minutes to complete. Subsequent deployments are typically faster due to caching.
