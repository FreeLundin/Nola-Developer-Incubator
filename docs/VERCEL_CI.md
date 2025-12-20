# Vercel CI/CD Setup Guide

This guide provides step-by-step instructions for setting up automated Vercel deployments using GitHub Actions.

## Overview

The repository includes a GitHub Actions workflow (`.github/workflows/deploy-to-vercel.yml`) that automatically deploys the application to Vercel when code is pushed to the `main` branch. This workflow requires several secrets to be configured in your GitHub repository.

---

## Prerequisites

Before setting up the CI/CD workflow, ensure you have:

1. A [Vercel account](https://vercel.com/signup) (free tier works)
2. A [GitHub account](https://github.com) with admin access to the repository
3. A PostgreSQL database (optional, but recommended - [Neon](https://neon.tech) offers free serverless PostgreSQL)

---

## Step 1: Create a Vercel Project

### Option A: Using the Vercel Dashboard (Recommended)

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
5. **Don't deploy yet** - Click the project settings to configure environment variables first

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Create a new project (run from project root)
vercel

# Follow the prompts to link your project
# Note: This creates a new project or links to an existing one
```

---

## Step 2: Get Vercel Project IDs and Token

### 2.1 Get VERCEL_ORG_ID and VERCEL_PROJECT_ID

#### Method 1: From Vercel Dashboard

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on **Settings** in the top menu
3. Scroll down to **Project ID** section
   - Copy the **Project ID** - this is your `VERCEL_PROJECT_ID`
4. To get the Organization ID:
   - Click on your profile/organization name in the top-left
   - Go to **Settings**
   - Under **General**, find your **Team ID** or **User ID** - this is your `VERCEL_ORG_ID`

#### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to your project directory
cd /path/to/MardiGrasParadeGame

# Link project (if not already linked)
vercel link

# Get project info - this will display Project ID and Org ID
vercel project ls

# Alternatively, check .vercel/project.json (created after linking)
cat .vercel/project.json
```

The `.vercel/project.json` file will contain:
```json
{
  "orgId": "your-org-id-here",
  "projectId": "your-project-id-here"
}
```

### 2.2 Generate VERCEL_TOKEN

1. Go to [Vercel Account Tokens](https://vercel.com/account/tokens)
2. Click **"Create Token"**
3. Give it a descriptive name like `GitHub Actions - MardiGrasParadeGame`
4. Select the scope:
   - **Full Account** (recommended for simplicity)
   - Or select specific projects if you prefer
5. Set expiration (optional, but recommended for security):
   - Choose an appropriate expiration time (e.g., 1 year)
6. Click **"Create Token"**
7. **IMPORTANT:** Copy the token immediately - you won't be able to see it again!

**Security Note:** Treat this token like a password. Never commit it to your repository or share it publicly.

---

## Step 3: Configure Vercel Environment Variables

Before the CI/CD workflow runs, you need to configure environment variables in Vercel for runtime:

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add the following variables:

| Variable Name | Value | Environment | Required |
|--------------|-------|-------------|----------|
| `DATABASE_URL` | Your PostgreSQL connection string | Production, Preview, Development | Yes* |
| `NODE_ENV` | `production` | Production | Yes |
| `SESSION_SECRET` | A random secure string | Production, Preview, Development | Yes |

**Notes:**
- `DATABASE_URL` should include `?sslmode=require` at the end for Neon/PostgreSQL
  - Example: `postgresql://user:password@host/database?sslmode=require`
- Generate `SESSION_SECRET` using: `openssl rand -base64 32` or any secure random string generator
- *`DATABASE_URL` is technically optional if you're not using database features, but recommended

### Get DATABASE_URL from Neon

1. Sign up at [Neon](https://neon.tech) (free tier available)
2. Create a new project
3. Create a new database (or use the default)
4. Go to **Dashboard** → **Connection Details**
5. Copy the **Connection String** (select "Pooled connection")
6. The format will be: `postgresql://user:password@host/database?sslmode=require`

---

## Step 4: Add GitHub Secrets

Now that you have all the required values, add them as secrets to your GitHub repository:

### 4.1 Navigate to Repository Secrets

1. Go to your GitHub repository: `https://github.com/Nola-Developer-Incubator/MardiGrasParadeGame`
2. Click **Settings** (top menu - requires admin access)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### 4.2 Add Required Secrets

Add each of the following secrets individually:

#### Secret 1: VERCEL_TOKEN
- **Name:** `VERCEL_TOKEN`
- **Value:** The token you generated in Step 2.2
- Click **Add secret**

#### Secret 2: VERCEL_ORG_ID
- **Name:** `VERCEL_ORG_ID`
- **Value:** Your organization/user ID from Step 2.1
- Click **Add secret**

#### Secret 3: VERCEL_PROJECT_ID
- **Name:** `VERCEL_PROJECT_ID`
- **Value:** Your project ID from Step 2.1
- Click **Add secret**

#### Secret 4: DATABASE_URL (Optional)
- **Name:** `DATABASE_URL`
- **Value:** Your PostgreSQL connection string from Neon
- Click **Add secret**

**Note:** `DATABASE_URL` is optional in GitHub secrets. The workflow will skip the database push step if this secret is not provided. However, you should still set `DATABASE_URL` in Vercel environment variables for runtime.

### 4.3 Verify Secrets

After adding all secrets, you should see them listed in the **Repository secrets** section:
- ✅ `VERCEL_TOKEN`
- ✅ `VERCEL_ORG_ID`
- ✅ `VERCEL_PROJECT_ID`
- ✅ `DATABASE_URL` (optional)

**Security Note:** Secret values are hidden and cannot be viewed after creation. If you need to change a secret, you must delete it and create a new one with the same name.

---

## Step 5: Initialize Database Schema (First Time Only)

After adding all the secrets, you need to push the database schema to your PostgreSQL database. This only needs to be done once.

### Option A: Run Locally (Recommended)

```bash
# Install dependencies
npm install

# Set your DATABASE_URL environment variable
export DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Push database schema
npm run db:push
```

On Windows (PowerShell):
```powershell
$env:DATABASE_URL = "postgresql://user:password@host/database?sslmode=require"
npm run db:push
```

### Option B: Let CI/CD Handle It

If you added `DATABASE_URL` as a GitHub secret, the workflow will automatically run `npm run db:push` on the first deployment. Check the GitHub Actions logs to verify it completed successfully.

---

## Step 6: Trigger the Workflow

The workflow is configured to run automatically on every push to the `main` branch. To trigger it:

### Option A: Push to Main Branch

```bash
# Make any change (or create an empty commit)
git commit --allow-empty -m "Trigger Vercel deployment"
git push origin main
```

### Option B: Merge a Pull Request

Create a PR and merge it to `main` - this will automatically trigger the deployment.

### Option C: Manual Trigger

Currently, the workflow only runs on push to `main`. If you want to add manual trigger capability, you can update `.github/workflows/deploy-to-vercel.yml` to include:

```yaml
on:
  push:
    branches: [ main ]
  workflow_dispatch:  # Add this line
```

Then you can manually trigger the workflow from the GitHub Actions tab.

---

## Step 7: Monitor Deployment

### View GitHub Actions Logs

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Click on the latest **"Deploy to Vercel"** workflow run
4. Click on **"build-and-deploy"** job to see detailed logs
5. Monitor each step:
   - ✅ Checkout
   - ✅ Setup Node.js
   - ✅ Install dependencies
   - ✅ Build (vercel-build)
   - ✅ Deploy to Vercel
   - ✅ Run DB schema push (if DATABASE_URL is set)

### View Vercel Deployment

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. View the latest deployment in the **Deployments** tab
4. Click on the deployment to see:
   - Build logs
   - Function logs
   - Deployment URL
   - Deployment status

---

## Troubleshooting

### Workflow Fails: "Missing required secret"

**Error:** Workflow fails with message about missing `VERCEL_TOKEN`, `VERCEL_ORG_ID`, or `VERCEL_PROJECT_ID`

**Solution:**
- Verify all required secrets are added to GitHub repository (Step 4)
- Secret names must match exactly (case-sensitive)
- Re-run the workflow after adding missing secrets

### Workflow Fails: "Vercel deployment failed"

**Error:** The "Deploy to Vercel" step fails

**Solution:**
1. Check that `VERCEL_TOKEN` is valid and not expired
2. Verify `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are correct
3. Ensure the Vercel project exists and is linked to the correct repository
4. Check Vercel dashboard for deployment errors

### Workflow Fails: "Build failed"

**Error:** The "Build (vercel-build)" step fails

**Solution:**
1. Run `npm run build` locally to reproduce the error
2. Check for TypeScript errors: `npm run check`
3. Ensure all dependencies are in `package.json`
4. Fix any build errors and push the fix

### Database Push Fails

**Error:** The "Run DB schema push" step fails

**Solution:**
1. Verify `DATABASE_URL` secret is set correctly
2. Test database connection locally:
   ```bash
   export DATABASE_URL="your_connection_string"
   npm run db:push
   ```
3. Ensure database is accessible from GitHub Actions (check firewall/IP restrictions)
4. Verify the connection string includes `?sslmode=require` for SSL connections

### Deployment Succeeds But Site Doesn't Work

**Error:** Deployment completes successfully but the site shows errors or doesn't load

**Solution:**
1. Check Vercel function logs in the Vercel dashboard
2. Verify environment variables are set in Vercel (Step 3)
3. Test the API health endpoint: `https://your-app.vercel.app/api/health`
4. Check browser console for client-side errors
5. Ensure `DATABASE_URL` is set in Vercel environment variables (not just GitHub secrets)

---

## Workflow Configuration Details

### What the Workflow Does

1. **Checkout:** Clones the repository
2. **Setup Node.js:** Installs Node.js 20
3. **Install dependencies:** Runs `npm ci` for clean install
4. **Build:** Runs `npm run vercel-build` which executes `npm run build`
5. **Deploy to Vercel:** Uses `amondnet/vercel-action@v20` to deploy
   - Deploys to production (`--prod` flag)
   - Uses the secrets for authentication
6. **DB Push (Optional):** Runs `npm run db:push` if `DATABASE_URL` is provided
   - Checks if `DATABASE_URL` secret exists
   - Skips if not provided (useful for deployments without database)

### Workflow Triggers

- **On push to main branch:** Automatically deploys when code is merged to `main`
- **Manual trigger:** Not enabled by default (see Step 6, Option C to enable)

### Security Permissions

The workflow requires:
- `contents: read` - To read repository files
- `id-token: write` - For Vercel authentication

### Build Command

The workflow uses `npm run vercel-build` which is defined in `package.json` as:
```json
"vercel-build": "npm run build"
```

This ensures the build process is identical locally and in CI/CD.

---

## Best Practices

### Security

1. **Never commit secrets** - Always use GitHub Secrets or environment variables
2. **Rotate tokens regularly** - Set expiration dates on Vercel tokens
3. **Use least privilege** - Create Vercel tokens with minimal required permissions
4. **Separate environments** - Use different tokens/projects for staging and production

### CI/CD

1. **Test locally first** - Always run `npm run build` locally before pushing
2. **Use feature branches** - Test changes in feature branches before merging to `main`
3. **Monitor deployments** - Check GitHub Actions and Vercel logs after deployment
4. **Set up notifications** - Configure GitHub or Vercel to notify you of deployment failures

### Database Management

1. **Backup before schema changes** - Always backup your database before running migrations
2. **Test migrations locally** - Run `npm run db:push` locally first
3. **Use preview databases** - Consider using separate databases for preview deployments
4. **Document schema changes** - Keep track of database schema changes in git history

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Vercel GitHub Action](https://github.com/amondnet/vercel-action)
- [Neon PostgreSQL Documentation](https://neon.tech/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)

---

## Quick Reference

### Required GitHub Secrets

```
VERCEL_TOKEN          - From https://vercel.com/account/tokens
VERCEL_ORG_ID         - From Vercel project/team settings
VERCEL_PROJECT_ID     - From Vercel project settings
DATABASE_URL          - (Optional) PostgreSQL connection string
```

### Required Vercel Environment Variables

```
DATABASE_URL          - PostgreSQL connection string
NODE_ENV              - production
SESSION_SECRET        - Random secure string
```

### Useful Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Get project info
vercel project ls

# Deploy manually
vercel --prod

# View logs
vercel logs

# Generate random secret
openssl rand -base64 32

# Push database schema
npm run db:push
```

---

## Summary

After completing these steps, your repository will have automated Vercel deployments:

✅ GitHub Actions workflow configured  
✅ Vercel project created and linked  
✅ Required secrets added to GitHub  
✅ Environment variables configured in Vercel  
✅ Database schema initialized  
✅ Automatic deployments on push to `main`  

Every push to the `main` branch will now automatically build and deploy your application to Vercel!

---

*Last updated: December 2024*
