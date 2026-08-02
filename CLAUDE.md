# CLAUDE.md — Fincz Expense Tracker

This file gives Claude (Anthropic) the context needed to work on this project.
For the full architecture guide, read `AGENTS.md` first.

---

## Quick Reference

|                 |                                                                           |
| --------------- | ------------------------------------------------------------------------- |
| Stack           | Angular 22 + Angular Material 22 + Dexie.js 4 + SCSS                      |
| State           | Angular Signals only — no RxJS in components                              |
| DB              | IndexedDB via Dexie, DB name: `FinczExpenseTrackerDB`, current version: 2 |
| Package Manager | `pnpm` only                                                               |
| Component Style | Standalone, inline SCSS in `styles: [...]` array                          |

---

## Before You Start

1. Read `AGENTS.md` for full project context
2. Read `PLAN.md` for the list of pending tasks
3. Never run `pnpm run start` — user manages the dev server

---

## Key File Locations

| What you need             | File                                                                           |
| ------------------------- | ------------------------------------------------------------------------------ |
| Route definitions         | `src/app/app.routes.ts`                                                        |
| Main page shell           | `src/app/layout/page-container/page-container.component.ts`                    |
| Header bar                | `src/app/layout/header/header.component.ts`                                    |
| Sidebar (desktop nav)     | `src/app/layout/sidebar/sidebar.component.ts`                                  |
| Bottom nav (mobile)       | `src/app/layout/bottom-nav/bottom-nav.component.ts`                            |
| Add transaction dialog    | `src/app/shared/components/add-expense-dialog/add-expense-dialog.component.ts` |
| Expense data service      | `src/app/core/services/expense.service.ts`                                     |
| Category data service     | `src/app/core/services/category.service.ts`                                    |
| DB schema + migrations    | `src/app/core/db/app-database.ts`                                              |
| Expense model             | `src/app/core/models/expense.model.ts`                                         |
| Category model + defaults | `src/app/core/models/category.model.ts`                                        |
| Build info (version/date) | `src/app/core/config/build-info.ts`                                            |
| Global styles + CSS vars  | `src/styles.scss`                                                              |
| Main HTML (for scripts)   | `src/index.html`                                                               |

---

## Angular Patterns Used in This Project

### Reading a signal in a template

```ts
// Component class
items = inject(ExpenseService).expenses; // this is a Signal

// Template
{{ items() }}
*ngFor="let item of items()"
```

### Adding a new service method

```ts
async myNewMethod(id: number): Promise<void> {
  await db.expenses.update(id, { myField: value });
  await this.refreshExpenses(); // always refresh after mutations
}
```

### Opening a dialog

```ts
private dialog = inject(MatDialog);

openMyDialog(): void {
  const ref = this.dialog.open(MyDialogComponent, {
    width: '100%',
    maxWidth: '480px',
    panelClass: 'm3-dialog-panel'
  });
  ref.afterClosed().subscribe(result => {
    if (result) { /* handle result */ }
  });
}
```

### Adding a new route

```ts
// src/app/app.routes.ts
{
  path: 'my-feature',
  loadComponent: () => import('./features/my-feature/my-feature.component')
    .then(m => m.MyFeatureComponent)
}
```

### SSR-safe browser API usage

```ts
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

private platformId = inject(PLATFORM_ID);

doSomething() {
  if (isPlatformBrowser(this.platformId)) {
    // safe to use window, document, localStorage here
  }
}
```

---

## Common Pitfalls

- **Category name uniqueness** — `name` field is unique in Dexie (`&name`). Always check before inserting.
- **DB version** — any schema change requires incrementing `this.version(N)` in `app-database.ts`.
- **`new Date()` in `build-info.ts`** — currently this runs at runtime, not build time, so the "Last Build Date" changes on every page load. This is a known bug listed in `PLAN.md`.
- **Bottom-nav padding** — `content-wrapper` has `padding-bottom: 90px` for mobile. If bottom-nav height changes, update this too.
- **Income dialog** — when opening `AddExpenseDialogComponent`, pass `{ defaultType: 'income' }` in the dialog data to pre-select income mode.

---

## Commit Convention

```
feat: short description of new feature
fix: short description of bug fix
refactor: code restructure without behavior change
style: CSS/SCSS changes only
docs: documentation updates
chore: config, tooling, dependency updates
```
