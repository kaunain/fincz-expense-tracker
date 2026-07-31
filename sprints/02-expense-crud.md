# Sprint 02 - Core Data Engine

Duration: 3 Days

Status: Active / Current Sprint

Goal

Establish the Local-First Core Data Engine using Dexie.js (IndexedDB), Angular Reactive Signals, and full Expense CRUD operations.

---

## Key Modules & Tasks

- **Dexie.js Setup**: Configure IndexedDB database schema (`AppDatabase`) using Dexie.js.
- **Data Models**: Define strongly-typed `Expense` and `Category` TypeScript interfaces.
- **CRUD Expense Service**: Implement `ExpenseService` with asynchronous Dexie.js read/write methods.
- **Reactive Signals Integration**: Wire `ExpenseService` data streams into Angular Reactive Signals (`signal`, `computed`, `effect`) for seamless state reactivity.
- **Validation**: Enforce schema validations for expense amounts, dates, categories, and descriptions.

---

## Technical Stack

- **Storage Engine**: Dexie.js (IndexedDB)
- **State Management**: Angular Reactive Signals
- **Language**: TypeScript

---

## Deliverables

- Working Dexie.js IndexedDB schema and database initialization
- Standardized TypeScript Expense & Category models
- Production-ready `ExpenseService` supporting Create, Read, Update, Delete operations
- Reactive Signals state integration for automatic view rendering
