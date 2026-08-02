# Fincz Expense Tracker — Gemini Agent Context

This file is for Google Gemini / Antigravity agents working on this project.
For the complete architecture guide, always read `AGENTS.md` first.

---

## Project Summary

A local-first expense tracker. No backend. Everything stored in browser IndexedDB via Dexie.js.
Built with Angular 22 standalone components, Angular Material 22, and Angular Signals.

**Package manager:** `pnpm` (strict — never use npm or yarn)

---

## First Steps for Every Task

1. Read `AGENTS.md` — full architecture, patterns, data models, and hard rules
2. Read `PLAN.md` — list of pending features and bug fixes
3. Identify the affected files from the directory map in `AGENTS.md`
4. Make changes incrementally — one logical unit at a time
5. Never run the dev server (`pnpm run start`)

---

## Most Important Rules

| Rule                                            | Reason                                               |
| ----------------------------------------------- | ---------------------------------------------------- |
| Use `pnpm` only                                 | Project enforces pnpm in `.npmrc` and `angular.json` |
| No `ng serve` / `pnpm start`                    | User runs dev server manually                        |
| Standalone components only                      | No NgModules in this project                         |
| Use `inject()` not constructor injection        | Angular v14+ pattern used throughout                 |
| Use `signal()` / `computed()` for state         | No RxJS state in components or services              |
| Check `isPlatformBrowser()` before browser APIs | SSR is enabled — `window`/`document` crash on server |
| Increment Dexie version on schema changes       | Required for proper IndexedDB migrations             |
| Category `name` is unique                       | Dexie `&name` constraint — duplicate insert = error  |

---

## Current Pending Tasks (from PLAN.md)

### High Priority

- Google Analytics `G-SP0MLCNXK8` → add gtag script to `src/index.html`
- Bottom-nav → replace 5 nav links with 2 action buttons (New Expense + New Income)
- Hamburger menu → add mobile drawer with all navigation items
- Add Transaction dialog → auto-focus amount, remove number spinners, quick category chips
- Category page → fix icon display bug (emoji vs Material icon detection)

### Medium Priority

- Header → remove "Offline First" badge, add About info dialog, wrap logo in `routerLink="/"`
- Routes → make Dashboard the root route `/` (not `/dashboard`)
- Settings → fix build date (currently `new Date()` runs at runtime — needs build-time injection)

### Low Priority

- Settings → add income configuration card
- Settings → add transfer between payment modes feature
- Dark mode support via CSS `prefers-color-scheme`

---

## File Quick Reference

```
src/index.html                                           → Add GA scripts here
src/app/app.routes.ts                                    → Route config
src/app/layout/page-container/page-container.component.ts → App shell
src/app/layout/header/header.component.ts                → Top bar
src/app/layout/sidebar/sidebar.component.ts              → Desktop nav
src/app/layout/bottom-nav/bottom-nav.component.ts        → Mobile nav
src/app/shared/components/add-expense-dialog/            → Add/Edit dialog
src/app/core/services/expense.service.ts                 → Expense CRUD
src/app/core/services/category.service.ts                → Category CRUD
src/app/core/db/app-database.ts                          → Dexie schema
src/app/core/models/expense.model.ts                     → Data types
src/app/core/models/category.model.ts                    → Category + defaults
src/app/core/config/build-info.ts                        → Version info
src/styles.scss                                          → Global CSS vars
```
