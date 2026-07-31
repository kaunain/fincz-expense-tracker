# Sprint 02 - Core Data Engine & Expense CRUD

Duration: 3 Days

Status: ✅ Complete

Goal

Establish the Local-First Core Data Engine using Dexie.js (IndexedDB), Angular Reactive Signals, and full Expense CRUD operations.

---

## Features & Tasks

- **Dexie.js IndexedDB Engine**: Configure `AppDatabase` (`src/app/core/db/app-database.ts`) with schema indexes.
- **Data Models**: Define strongly-typed `Expense` and `Category` TypeScript models with JSDoc documentation.
- **ExpenseService**: Implement `ExpenseService` (`src/app/core/services/expense.service.ts`) for asynchronous Dexie.js read/write/update/delete.
- **Angular Signals Integration**: Wire `ExpenseService` data streams into reactive Signals (`signal`, `computed`) for live UI updating.
- **Expenses Manager View**: Build `ExpensesComponent` (`src/app/features/expenses/expenses.component.ts`) with interactive search, category filter, payment method filter, transaction table, and modal dialog.

---

## Deliverables

- ✅ Dexie.js IndexedDB setup with automatic default category seeding
- ✅ Production-ready `ExpenseService` with Reactive Signals state
- ✅ Interactive Expense CRUD table and modal form with validation
