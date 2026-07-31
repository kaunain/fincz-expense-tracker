# ☁️ Cloudflare Pages Deployment Guide (CLI First)

This document provides a comprehensive, production-ready, CLI-driven deployment guide for **Fincz Expense Tracker** on **Cloudflare Pages**.

---

## 📌 Project & Deployment Overview

- **Application:** Fincz Expense Tracker
- **Architecture:** Local-First Static Web Application (Angular 22 + Dexie.js IndexedDB)
- **Deployment Platform:** Cloudflare Pages
- **Production URL:** `https://expense.fincz.com`
- **Preview / Default URL:** `https://expense.pages.dev` (or `https://fincz-expense-tracker.pages.dev`)
- **CLI Tool:** Wrangler CLI (`wrangler`)
- **Build Output Directory:** `./dist/fincz-expense-tracker/browser`

---

## 🏗️ Architecture & Configuration Files

The project includes pre-configured Cloudflare Pages integration files:

1. **`wrangler.jsonc`**: Cloudflare Pages configuration defining project name, compatibility date, and build output directory (`dist/fincz-expense-tracker/browser`).
2. **`public/_redirects`**: Client-side SPA routing fallback rule (`/* /index.html 200`) ensuring Angular client-side routes (`/dashboard`, `/expenses`, `/categories`, `/reports`, `/settings`) work on direct browser refresh.
3. **`package.json` Scripts**: Standardized CLI commands for authentication, local previews, and deployments.

---

## 🛠️ Step-by-Step CLI Deployment Guide

### Step 1: Install Dependencies & Build Application

Make sure all project dependencies are installed and test the production build locally:

```bash
# Install dependencies
pnpm install

# Build static bundle for production
pnpm run build
```

The output files will be generated in `./dist/fincz-expense-tracker/browser`.

---

### Step 2: Authenticate with Cloudflare CLI (Wrangler)

Before running deployment commands for the first time, log in to your Cloudflare account via Wrangler:

```bash
# Log in to Cloudflare account via browser OAuth
pnpm run cf:login

# Verify authenticated account identity
pnpm run cf:whoami
```

---

### Step 3: Deploy to Cloudflare Pages via CLI

#### Option A: Deploy to Production (`main` branch)

To deploy the production build directly from your terminal:

```bash
pnpm run deploy:prod
```

Or run directly with Wrangler:
```bash
npx wrangler pages deploy dist/fincz-expense-tracker/browser --project-name fincz-expense-tracker --branch main
```

#### Option B: Deploy to Preview (`preview` branch)

To deploy a temporary preview build for testing features before merging to production:

```bash
pnpm run deploy:preview
```

---

### Step 4: Configure Custom Domain (`expense.fincz.com`)

To bind your custom domain `expense.fincz.com` to the Cloudflare Pages project via Wrangler CLI or Cloudflare DNS:

```bash
# Add custom domain to Cloudflare Pages project via Wrangler
npx wrangler pages domain add expense.fincz.com --project-name fincz-expense-tracker
```

*Note: Ensure your Cloudflare DNS zone for `fincz.com` has CNAME target pointing to `fincz-expense-tracker.pages.dev`.*

---

## 📜 NPM Package Scripts Reference

| Script Command | Realized Terminal Command | Description |
|----------------|--------------------------|-------------|
| `pnpm run cf:login` | `wrangler login` | Authenticates CLI with Cloudflare account |
| `pnpm run cf:whoami` | `wrangler whoami` | Displays active Cloudflare user and account details |
| `pnpm run build` | `ng build` | Compiles static Angular bundle to `dist/fincz-expense-tracker/browser` |
| `pnpm run deploy` | `pnpm run build && wrangler pages deploy dist/...` | Compiles build and deploys to Cloudflare Pages |
| `pnpm run deploy:preview` | `pnpm run build && wrangler pages deploy ... --branch preview` | Deploys feature preview build |
| `pnpm run deploy:prod` | `pnpm run build && wrangler pages deploy ... --branch main` | Deploys production build |

---

## 🔒 Environment Variables & GitHub Actions Preparation

### Environment Variables Policy
- Never hardcode API tokens or credentials inside repository source code or `wrangler.jsonc`.
- For CI/CD automation, pass `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as secure environment variables.

### GitHub Actions Preparation (Future Automated CI/CD)
When ready to automate deployment on push to `main`, add the following step to your GitHub Actions workflow:

```yaml
- name: Deploy to Cloudflare Pages
  uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    command: pages deploy dist/fincz-expense-tracker/browser --project-name=fincz-expense-tracker --branch=main
```
