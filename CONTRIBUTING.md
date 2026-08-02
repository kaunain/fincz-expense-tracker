# 🤝 Contributing to Fincz Expense Tracker

First off, thank you for considering contributing to **Fincz Expense Tracker**! 🎉

Fincz Expense Tracker is an open-source personal finance application built with **Angular** and a **Local-First Offline Architecture** using **Dexie.js (IndexedDB)**.

Whether you are fixing a bug, adding a new category feature, improving documentation, or creating new analytical charts, your contributions are warmly welcomed.

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: `v20.x` or later
- **Package Manager**: `pnpm` (v10+ recommended) or `npm` / `yarn`
- **Git**

### Local Setup Instructions

1. **Fork & Clone the Repository**:

   ```bash
   git clone https://github.com/YOUR-USERNAME/fincz-expense-tracker.git
   cd fincz-expense-tracker
   ```

2. **Install Dependencies**:

   ```bash
   pnpm install
   ```

3. **Start Development Server**:
   ```bash
   pnpm start
   ```
   Open your browser at `http://localhost:4200/`.

---

## 🏗️ Project Architecture & Structure

The repository follows a clean, flattened Angular directory structure:

```
fincz-expense-tracker/
├── src/
│   ├── app/
│   │   ├── core/            # Database (Dexie.js), Models, Services (Signals)
│   │   │   ├── db/          # AppDatabase schema & IndexedDB migrations
│   │   │   ├── models/      # Expense & Category TypeScript interfaces
│   │   │   └── services/    # ExpenseService, CategoryService, ImportExportService
│   │   ├── features/        # Main Application Views
│   │   │   ├── dashboard/   # Financial Summary Cards & Insights
│   │   │   ├── expenses/    # CRUD Transactions Table & Form Modal
│   │   │   ├── categories/  # Category Manager View
│   │   │   ├── reports/     # Spending Distribution & Analytics
│   │   │   └── settings/    # Data Backup (JSON Export/Import) & DB Wipe
│   │   └── layout/          # App Shell (Header, Sidebar Navigation, Footer)
│   ├── assets/              # Icons & visual assets
│   └── styles/              # Global SCSS theme & CSS custom properties
```

---

## 💡 How to Customize the Codebase

### 1. Adding a New Payment Method or Expense Field

- Open [`src/app/core/models/expense.model.ts`](file:///home/ahmad/NIDE/fincz-expense-tracker/src/app/core/models/expense.model.ts) and add your field to the `Expense` interface.
- Update the IndexedDB schema inside [`src/app/core/db/app-database.ts`](file:///home/ahmad/NIDE/fincz-expense-tracker/src/app/core/db/app-database.ts) if you want the new field to be indexed for fast queries.
- Update [`ExpensesComponent`](file:///home/ahmad/NIDE/fincz-expense-tracker/src/app/features/expenses/expenses.component.ts) form controls to capture the field in the UI.

### 2. Customizing Default Categories

- Open [`src/app/core/models/category.model.ts`](file:///home/ahmad/NIDE/fincz-expense-tracker/src/app/core/models/category.model.ts).
- Edit or append items inside `DEFAULT_CATEGORIES`.

---

## 📜 Pull Request Guidelines

1. **Branch Naming**:
   - Features: `feature/short-description`
   - Bug fixes: `fix/short-description`
   - Docs: `docs/short-description`

2. **Code Standards & Format**:
   - Ensure clean JSDoc comments for public methods and interfaces.
   - Run format check:
     ```bash
     pnpm run format
     ```
   - Ensure the static build compiles clean:
     ```bash
     pnpm run build
     ```

3. **Submitting PRs**:
   - Provide a concise description of the changes made.
   - Reference any related open issue numbers (`Fixes #12`).

---

## 📄 License & Code of Conduct

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE). Please adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).
