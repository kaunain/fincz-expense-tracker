# 💰 Fincz Expense Tracker

> A modern, open-source personal expense tracker built with a **Local-First Offline Architecture** using **Angular 20+** and **Dexie.js (IndexedDB)**.
>
> Fully static, zero-backend-dependency client-side web application designed for instant loading, privacy, and full data portability.

![License](https://img.shields.io/badge/license-MIT-green)
![Angular](https://img.shields.io/badge/Angular-20%2B-red)
![Dexie.js](https://img.shields.io/badge/Dexie.js-IndexedDB-blue)
![Architecture](https://img.shields.io/badge/Architecture-Local--First-brightgreen)
![Status](https://img.shields.io/badge/status-Active%20Development-blue)

---

## 📖 Features

- ⚡ **Local-First Database Engine**: Instant load times and 100% offline access powered by Dexie.js (IndexedDB).
- 📝 **Expense CRUD**: Add, edit, view, filter, and delete transactions with Angular Reactive Signals state.
- 🏷️ **Category Manager**: System default categories + custom category creation with palette colors.
- 📊 **Summary Dashboard & Reports**: Financial metric cards, spending progress bars, and recent activity feed.
- 💾 **Data Backup & Portability**: One-click JSON Export & Import backup service.
- 🌐 **Static Deployment Ready**: Easily hostable on Cloudflare Pages, Vercel, Netlify, or GitHub Pages.

---

## 🛠️ Quick Start & Local Setup

### Prerequisites

- Node.js `v20.x` or higher
- `pnpm` (or `npm`)

### Installation Commands

```bash
# Clone the repository
git clone https://github.com/kaunain/fincz-expense-tracker.git
cd fincz-expense-tracker

# Install dependencies
pnpm install

# Start local development server
pnpm start
```

Navigate to `http://localhost:4200/` in your browser.

---

## 🏗️ Project Architecture & Structure

```
fincz-expense-tracker/
├── src/
│   ├── app/
│   │   ├── core/            # Database (Dexie.js), Models, Services (Signals)
│   │   │   ├── db/          # Dexie AppDatabase schema & IndexedDB migrations
│   │   │   ├── models/      # Expense & Category TypeScript models
│   │   │   └── services/    # ExpenseService, CategoryService, ImportExportService
│   │   ├── features/        # Main Feature Modules
│   │   │   ├── dashboard/   # Summary cards & spending insights
│   │   │   ├── expenses/    # CRUD table & Add/Edit form modal
│   │   │   ├── categories/  # Category manager view
│   │   │   ├── reports/     # Category distribution analytics
│   │   │   └── settings/    # JSON Backup export/import & DB clear
│   │   └── layout/          # App Shell (Header, Sidenav, Footer)
│   ├── assets/              # Static assets
│   └── styles.scss          # Global styling & CSS custom variables
├── angular.json             # Angular CLI Root Configuration
├── package.json             # Root dependencies & scripts
├── CONTRIBUTING.md          # Open-Source Contribution Guide
├── CODE_OF_CONDUCT.md       # Contributor Covenant
├── DECISIONS.md             # Architecture Decision Records (ADRs)
└── LICENSE                  # MIT License
```

---

## 🔧 How to Customize for Your Own Requirements

This project is built to be easily forkable and customizable:

1. **Custom Expense Fields**: Update [`src/app/core/models/expense.model.ts`](file:///home/ahmad/NIDE/fincz-expense-tracker/src/app/core/models/expense.model.ts) and [`src/app/core/db/app-database.ts`](file:///home/ahmad/NIDE/fincz-expense-tracker/src/app/core/db/app-database.ts).
2. **Default Spending Categories**: Modify `DEFAULT_CATEGORIES` in [`src/app/core/models/category.model.ts`](file:///home/ahmad/NIDE/fincz-expense-tracker/src/app/core/models/category.model.ts).
3. **UI Theme & Branding**: Adjust color variables in [`src/styles.scss`](file:///home/ahmad/NIDE/fincz-expense-tracker/src/styles.scss).

---

## 🤝 Contributing & Code of Conduct

We welcome all contributions! Check out our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) to get started.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
