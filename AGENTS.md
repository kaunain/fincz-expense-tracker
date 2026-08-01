# AGENTS.md — Fincz Expense Tracker

This file provides all the context an AI agent needs to understand and work on this project effectively. Read this before making any changes.

---

## Project Overview

**Fincz Expense Tracker** is a modern, offline-first personal finance tracker that runs entirely in the browser using IndexedDB. There is no backend — all data lives on the user's device.

| Property | Value |
|---|---|
| Framework | Angular v22 (Standalone Components) |
| UI Library | Angular Material v22 (Material 3) |
| Database | Dexie.js v4 (IndexedDB wrapper) |
| State | Angular Signals (`signal`, `computed`) |
| Styles | SCSS inline in components + global `src/styles.scss` |
| SSR | Angular SSR + Express v5 (for Cloudflare Pages) |
| Package Manager | **pnpm** — never use npm or yarn |
| Node Version | >=24.15.0 |
| Deployment | Cloudflare Pages via Wrangler |

---

## Directory Structure

```
src/
├── index.html                          # App entry HTML — add scripts here
├── main.ts                             # Bootstrap
├── styles.scss                         # Global CSS variables and utilities
└── app/
    ├── app.routes.ts                   # All route definitions
    ├── app.config.ts                   # Angular providers
    ├── core/
    │   ├── config/
    │   │   └── build-info.ts           # App version, git branch, build date
    │   ├── db/
    │   │   └── app-database.ts         # Dexie schema + migrations (currently v2)
    │   ├── models/
    │   │   ├── expense.model.ts        # Expense interface, PaymentMethod, FinancialSummary
    │   │   └── category.model.ts       # Category interface + DEFAULT_CATEGORIES array
    │   └── services/
    │       ├── expense.service.ts      # All expense CRUD, filtering, financial summary
    │       ├── category.service.ts     # Category CRUD + seeding
    │       └── import-export.service.ts
    ├── features/
    │   ├── dashboard/                  # Home screen — summary cards + charts
    │   ├── expenses/                   # Transaction list with filters and search
    │   ├── categories/                 # Category manager (add/delete)
    │   ├── reports/                    # Charts and analytics
    │   └── settings/                   # Backup, danger zone, app info
    ├── layout/
    │   ├── page-container/             # Main shell: header + sidenav + bottom-nav
    │   ├── header/                     # Top app bar
    │   ├── sidebar/                    # Desktop navigation drawer
    │   ├── bottom-nav/                 # Mobile bottom navigation
    │   └── footer/
    └── shared/
        └── components/
            ├── add-expense-dialog/     # Add / Edit transaction dialog
            └── donut-chart/            # Reusable donut chart component
```

---

## Architecture Patterns

### Standalone Components Only
Every component is standalone — there are no `NgModule` files.

```ts
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `<button mat-button>Click</button>`,
  styles: [`button { color: red; }`]
})
export class ExampleComponent {}
```

### Angular Signals for State
Services expose state via signals, not RxJS observables.

```ts
// In a service
private itemsSignal = signal<Item[]>([]);
public readonly items = computed(() => this.itemsSignal());

// In a component — read reactively in template
items = inject(MyService).items;
// Template: {{ items() }}
```

### Dependency Injection
Use `inject()` function, not constructor injection.

```ts
// Correct
private expenseService = inject(ExpenseService);

// Avoid
constructor(private expenseService: ExpenseService) {}
```

### Inline Component Styles
All component-specific CSS is written inside the component file in the `styles` array — no separate `.scss` files for components.

---

## Data Models

### Expense
```ts
interface Expense {
  id?: number;
  type: 'expense' | 'income';
  title: string;
  amount: number;           // Always a positive number
  category: string;         // References Category.name
  date: string;             // Format: 'YYYY-MM-DD'
  paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'UPI' | 'Bank Transfer' | 'Other';
  notes?: string;
  createdAt: string;        // ISO timestamp string
  updatedAt: string;        // ISO timestamp string
}
```

### Category
```ts
interface Category {
  id?: number;
  name: string;             // UNIQUE — Dexie enforces this with '&name' index
  icon: string;             // Emoji string (e.g. '🍔') or Material icon name
  color: string;            // Hex color string (e.g. '#ff6b6b')
  type?: 'expense' | 'income';
  isDefault?: boolean;
  budgetLimit?: number;
}
```

---

## Database (Dexie / IndexedDB)

**DB Name:** `FinczExpenseTrackerDB`
**Current Schema Version:** 2

Tables:
- `expenses` — all income and expense transactions
- `categories` — expense and income categories

### Adding a New Schema Version
Always increment the version number and write an upgrade function:

```ts
this.version(3).stores({
  expenses: '++id, title, amount, category, date, paymentMethod, type, createdAt',
  categories: '++id, &name, isDefault, type'
}).upgrade(async tx => {
  // migrate existing records
});
```

### Seeding
`DEFAULT_CATEGORIES` seeds only on `on('populate')` — this fires only when the DB is created fresh. For existing users, write a migration or check inside `CategoryService.initCategories()`.

---

## Services API

### ExpenseService
```ts
// Read (reactive signals)
expenseService.expenses()           // All transactions
expenseService.filteredExpenses()   // After filter applied
expenseService.financialSummary()   // Totals, monthly stats, category breakdown

// Write (async)
await expenseService.addExpense({ type, title, amount, date, category, paymentMethod });
await expenseService.updateExpense(id, partialChanges);
await expenseService.deleteExpense(id);
await expenseService.clearAllExpenses();
expenseService.setFilter({ type, category, dateRange, searchQuery });
```

### CategoryService
```ts
categoryService.categories()  // All categories (reactive signal)

await categoryService.addCategory({ name, icon, color, type, isDefault: false });
await categoryService.deleteCategory(id);  // Throws if isDefault is true
```

---

## Layout & Routing

### Routes
```
/              → DashboardComponent (root, home page)
/expenses      → ExpensesComponent
/categories    → CategoriesComponent
/reports       → ReportsComponent
/settings      → SettingsComponent
```

### Page Shell (`PageContainerComponent`)
This is the wrapper for all pages. It contains:
- `<app-header>` — emits `toggleSidebar` and `onQuickAdd`
- `<mat-sidenav>` with `<app-sidebar>` inside
- `<app-bottom-nav>` — mobile only (`display: none` at `min-width: 768px`)
- `<router-outlet>` where page content renders

### Responsive Breakpoint
- `< 768px` → Mobile layout (bottom-nav visible, sidebar hidden)
- `>= 768px` → Desktop layout (sidebar visible, bottom-nav hidden)

---

## Design System

### CSS Variables (defined in `src/styles.scss`)
```scss
--primary-color: #2563eb;      // Blue — used for expenses, primary actions
--primary-dark: #1d4ed8;
--primary-light: #eff6ff;
--accent-color: #059669;       // Green — used for income, success states
--bg-color: #f8fafc;           // Page background
--surface-color: #ffffff;      // Card background
--text-main: #0f172a;          // Primary text
--text-muted: #64748b;         // Secondary text
--border-color: #e2e8f0;
--radius-sm: 8px;
--radius-md: 16px;             // Cards, dialogs
--radius-lg: 24px;
--shadow-sm / --shadow-md / --shadow-lg
--safe-area-bottom             // iOS safe area for bottom-nav
```

### Global Utility Classes
- `.m3-card` — standard card with border, radius, shadow (defined in `styles.scss`)
- `.fab-button` — floating action button style

### Icons
Use Material Symbols Outlined:
```html
<span class="material-symbols-outlined">settings</span>
```
Category icons use emoji strings directly in templates.

### Typography
Primary font: `Plus Jakarta Sans`. Fallback: `Roboto`.

---

## Development Commands

```bash
pnpm run build          # Production build → dist/
pnpm run format         # Prettier format all files
pnpm run lint           # ESLint check
pnpm run deploy         # Build + deploy to Cloudflare Pages
```

> **Do NOT run `pnpm run start` or `ng serve`** — the user runs the dev server manually.

---

## Rules — Never Break These

1. **Package manager:** Always use `pnpm`. Never `npm install` or `yarn add`.
2. **No dev server:** Never run `pnpm run start` or `ng serve`.
3. **No NgModules:** Only standalone components.
4. **Unique category names:** `category.name` has a `&name` unique constraint in Dexie. Inserting duplicates throws an error.
5. **DB version:** Any schema change MUST increment the Dexie version number with a proper `.upgrade()` migration.
6. **SSR safety:** Never use `window`, `document`, or `localStorage` directly. Wrap with `isPlatformBrowser(this.platformId)` check, or use Angular's `DOCUMENT` injection token.
7. **DEFAULT_CATEGORIES changes** only affect new users (fresh DB). Existing users need a DB migration.
8. **Commit format:** Use Conventional Commits — `feat:`, `fix:`, `refactor:`, `style:`, `docs:`.

---

## Pending Tasks

See `PLAN.md` for the full implementation plan. High priority items:

- [ ] Google Analytics `G-SP0MLCNXK8` → `src/index.html`
- [ ] Bottom-nav → replace all nav links with 2 buttons: "New Expense" + "New Income"
- [ ] Hamburger menu → mobile drawer with all navigation
- [ ] Add Transaction dialog → auto-focus amount field, remove number spinners
- [ ] Category icon display bug fix
- [ ] Header → remove "Offline First" badge, add About dialog, wrap logo in home link
- [ ] Dashboard as root route `/`
- [ ] Settings → fix build date (currently regenerates on every page load)
