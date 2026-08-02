# 💰 Fincz Expense Tracker

> A modern, open-source personal finance tracker built with a **Local-First Offline Architecture** using **Angular 22** and **Dexie.js (IndexedDB)**.
>
> Fully static, zero-backend-dependency client-side web application designed for instant loading, privacy, and full data portability.

![Version](https://img.shields.io/badge/version-v0.3.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Angular](https://img.shields.io/badge/Angular-22-red)
![Material 3](https://img.shields.io/badge/UI-Angular%20Material%203-7c3aed)
![Dexie.js](https://img.shields.io/badge/Dexie.js-v4--IndexedDB-blue)
![Architecture](https://img.shields.io/badge/Architecture-Local--First-brightgreen)
![E2E Testing](https://img.shields.io/badge/E2E-Playwright-orange)

---

## 📖 Features

- ⚡ **Local-First Database Engine**: Instant load times and 100% offline access powered by Dexie.js (IndexedDB v4). No external database required.
- 💵 **Dual Income & Expense Tracking**: Track expenses, salaries, investments, gifts, and freelance income with real-time financial net summaries.
- 🏦 **Accounts & Wealth Manager (`/accounts`)**: Live tracking of Bank Accounts, Cash, Credit Cards, and Digital Wallets with total net wealth calculations.
- 🔄 **Money Transfer with Account Swap**: Dedicated transfer modal (`TransferDialogComponent`) featuring 1-tap Account Source/Target Swap (`swap_horiz`).
- 📝 **Streamlined Transaction Dialog**: Smart single-tap category selector, auto-suggest notes search history, and future-date restrictions.
- 🏷️ **Category Manager (`/categories`)**: Expense and income categories with custom color palettes and Material/Emoji icons.
- 📊 **Visual Analytics & Reports (`/reports`)**: Interactive Donut charts, monthly spending breakdowns, and month-by-month navigation.
- 💾 **Data Backup & Portability (`/settings`)**: One-click JSON Export & Import service for full data backup and restore.
- 📱 **Mobile-First Responsive Shell**: Material 3 Design System with Desktop Drawer and Mobile Bottom Navigation bar.
- 🧪 **Automated Playwright E2E Audit Suite**: Built-in Playwright test suite (`pnpm run qa:audit`) verifying responsive layouts and IndexedDB persistence.

---

## 🛠️ Quick Start & Local Setup

### Prerequisites

- Node.js `>=24.15.0`
- `pnpm` package manager

### Installation Commands

```bash
# Clone the repository
git clone https://github.com/kaunain/fincz-expense-tracker.git
cd fincz-expense-tracker

# Install dependencies
pnpm install

# Build for production
pnpm run build

# Run Playwright E2E QA Audit suite
pnpm run qa:audit
```

> **Note**: Start the development server using `pnpm start` or `ng serve` and open `http://localhost:4200/`.

---

## 🏗️ Project Architecture & Structure

```
fincz-expense-tracker/
├── e2e/                     # Playwright E2E & Persistence QA test suites
├── src/
│   ├── app/
│   │   ├── core/            # Database (Dexie.js), Models, Services (Angular Signals)
│   │   │   ├── db/          # Dexie AppDatabase schema & IndexedDB migrations (v3)
│   │   │   ├── models/      # Expense, Category, and Account TypeScript interfaces
│   │   │   └── services/    # ExpenseService, CategoryService, AccountService, ImportExportService
│   │   ├── features/        # Main Feature Views (Standalone Components)
│   │   │   ├── dashboard/   # Total Wealth summary cards, recent transactions, donut breakdown
│   │   │   ├── expenses/    # Transaction list with search, category & date filter chips
│   │   │   ├── accounts/    # Live account balance cards & account CRUD
│   │   │   ├── categories/  # Category grid manager (expense/income)
│   │   │   ├── reports/     # Financial analytics charts & month navigator
│   │   │   └── settings/    # JSON Backup export/import & Danger Zone reset
│   │   ├── layout/          # App Shell (Header, Sidebar Drawer, Bottom Nav, Footer)
│   │   └── shared/          # Reusable Dialogs (Add Expense, Transfer, Confirm, Donut Chart)
│   ├── assets/              # Static assets & brand icons
│   └── styles.scss          # Global Material 3 design tokens & custom SCSS variables
├── angular.json             # Angular CLI Configuration
├── package.json             # Root dependencies & scripts
├── AGENTS.md                # AI Agent Instructions & Architectural Constraints
├── CONTRIBUTING.md          # Open-Source Contribution Guide
└── LICENSE                  # MIT License
```

---

## 🔧 Useful Development Commands

| Command | Description |
| :--- | :--- |
| `pnpm run build` | Compiles production bundle to `dist/` |
| `pnpm run qa:audit` | Runs full Playwright E2E audit across Desktop and Mobile viewports |
| `pnpm run format` | Formats all code files using Prettier |
| `pnpm run lint` | Runs ESLint Angular checks |
| `pnpm run deploy` | Deploys static build to Cloudflare Pages via Wrangler |

---

## 🤝 Contributing & Code of Conduct

We welcome all contributions! Check out our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) to get started.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
