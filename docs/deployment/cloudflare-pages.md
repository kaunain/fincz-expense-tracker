# ☁️ Cloudflare Pages Automatic GitHub Integration & Deployment Guide

This guide explains how to connect your GitHub repository directly to **Cloudflare Pages** so that Cloudflare automatically fetches code on every `git push`, builds the Angular static application, and deploys it to production (`expense.fincz.com`).

---

## 📌 Architecture & Auto-Deploy Overview

- **GitHub Repository:** `kaunain/fincz-expense-tracker`
- **Deployment Platform:** Cloudflare Pages (Direct Git Integration)
- **Production Domain:** `expense.fincz.com`
- **Default Pages URL:** `https://fincz-expense-tracker.pages.dev`
- **Build Trigger:** Automatic on `git push` to `main` (Production) or `dev` (Preview)
- **Build Command:** `pnpm run build`
- **Build Output Directory:** `dist/fincz-expense-tracker/browser`

---

## 🛠️ Step-by-Step GitHub + Cloudflare Pages Setup

### Step 1: Connect GitHub Repository in Cloudflare Dashboard

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** ➔ **Create Application** ➔ Select the **Pages** tab.
3. Click **Connect to Git** and authorize Cloudflare to access your GitHub account.
4. Select the repository: **`kaunain/fincz-expense-tracker`**.

---

### Step 2: Configure Build Settings in Cloudflare Pages

Set the build configurations exactly as specified below:

| Configuration Field | Setting Value | Notes / Description |
|---------------------|---------------|---------------------|
| **Project Name** | `fincz-expense-tracker` | Project identifier |
| **Production Branch** | `main` | Deploys live to production |
| **Framework Preset** | `Angular` or `None (Custom)` | Framework preset |
| **Build Command** | `pnpm run build` | Runs Angular static compiler |
| **Build Output Directory** | `dist/fincz-expense-tracker/browser` | Target folder containing compiled `index.html` & static assets |

---

### Step 3: Add Required Environment Variables in Cloudflare Pages

Inside the Cloudflare Pages deployment settings, add the following **Environment Variables** (for both Production and Preview):

```env
NODE_VERSION = 24
PNPM_VERSION = 11
NG_CLI_ANALYTICS = false
```

*Why this is required:* Cloudflare Pages build runners default to older Node versions unless `NODE_VERSION=24` is explicitly set, which is required for Angular 22 & pnpm 11 compatibility.

---

### Step 4: Click "Save and Deploy"

Cloudflare will automatically:
1. Clone the `main` branch of `kaunain/fincz-expense-tracker`.
2. Run `pnpm install` and `pnpm run build`.
3. Read `public/_redirects` (`/* /index.html 200`) and deploy the static app to `https://fincz-expense-tracker.pages.dev`.

---

### Step 5: Bind Custom Domain (`expense.fincz.com`)

1. In Cloudflare Pages project dashboard, go to **Custom Domains**.
2. Click **Set up a Custom Domain**.
3. Enter `expense.fincz.com` and click **Continue**.
4. Cloudflare will automatically configure the CNAME record in your `fincz.com` DNS zone and provision a free SSL certificate.

---

## 🔄 How the Automatic Workflow Works

```
  Developer pushes code to GitHub
                │
                ▼
        [ git push origin main ]
                │
                ▼
  GitHub Webhook triggers Cloudflare Pages
                │
                ▼
  Cloudflare automatically runs:
   1. git clone
   2. pnpm install
   3. pnpm run build
                │
                ▼
  Deploys output (dist/fincz-expense-tracker/browser)
                │
                ▼
  Live at https://expense.fincz.com 🚀
```

---

## 💻 Optional: Manual CLI Deployments (Wrangler Backup)

If you ever need to trigger a manual deploy from your terminal:

```bash
# Log in to Cloudflare
pnpm run cf:login

# Deploy production build directly
pnpm run deploy:prod
```
