# Task: Cloudflare Pages Deployment Automation (CLI First)

Act as a Staff Frontend Architect, DevOps Engineer, and Cloudflare Expert.

Review the entire project before making any changes.

Project:
Fincz Expense Tracker

Current Stack:
- Angular 22
- Standalone Components
- SCSS
- Angular Material
- pnpm 11
- Dexie (IndexedDB)
- Offline First
- Cloudflare
- GitHub
- Ubuntu

-------------------------------------------------------
GOAL
-------------------------------------------------------

Deploy the application to Cloudflare Pages.

The deployment process must be completely CLI-driven.

Avoid manual dashboard configuration whenever Cloudflare CLI (Wrangler) supports it.

The deployment process should be repeatable, automated, and production-ready.

-------------------------------------------------------
DEPLOYMENT TARGET
-------------------------------------------------------

Production URL

expense.fincz.com

Temporary URL

expense.pages.dev

-------------------------------------------------------
REQUIREMENTS
-------------------------------------------------------

1.

Review current Angular build output.

Detect the correct production output folder automatically.

2.

Install and configure Wrangler CLI.

3.

Generate all required configuration files.

4.

Configure package.json scripts.

Example:

- deploy
- deploy:preview
- deploy:prod
- cf:login
- cf:whoami

5.

Create deployment documentation.

docs/deployment/cloudflare-pages.md

6.

If configuration files are missing,
create them.

If existing files require updates,
modify them safely.

7.

Never hardcode secrets.

Use environment variables where required.

8.

Prepare the project for GitHub Actions deployment later.

Do not implement GitHub Actions yet.

Only prepare the project.

-------------------------------------------------------
DELIVERABLES
-------------------------------------------------------

Review existing project.

Explain every required change.

Modify files where needed.

Generate missing files.

Generate deployment scripts.

Generate Wrangler configuration.

Generate deployment documentation.

Verify deployment configuration.

Explain how to deploy from terminal.

-------------------------------------------------------
IMPORTANT
-------------------------------------------------------

Do NOT redesign the application.

Do NOT change business logic.

Do NOT modify Angular architecture.

Only work on deployment.

Keep everything production-ready following enterprise best practices.

At the end create a proper documents for all the above steps so any other persion can follow
