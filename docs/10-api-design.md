# API & Service Design Specifications

**Project Name:** Fincz Expense Tracker  
**Version:** 0.2.0  
**Status:** Active  
**Author:** Kaunain Ahmad

---

# Overview

In Phase 1 (Local-First Architecture), application logic operates via **Angular Service Contracts** interacting with browser **IndexedDB (Dexie.js)**. Phase 2 deferred Spring Boot REST endpoints are also defined for cloud synchronization.

---

# Client-Side Service Contracts (Phase 1)

## 1. `ExpenseService`

Provides transaction management with Angular Reactive Signals state.

| Method                    | Parameters                                          | Return Type       | Description                                         |
| ------------------------- | --------------------------------------------------- | ----------------- | --------------------------------------------------- |
| `refreshExpenses()`       | None                                                | `Promise<void>`   | Fetches all items from Dexie IndexedDB into Signals |
| `addExpense(data)`        | `Omit<Expense, 'id' \| 'createdAt' \| 'updatedAt'>` | `Promise<number>` | Creates new transaction record                      |
| `updateExpense(id, data)` | `number, Partial<Expense>`                          | `Promise<void>`   | Updates existing transaction by primary key         |
| `deleteExpense(id)`       | `number`                                            | `Promise<void>`   | Deletes transaction record                          |
| `setFilter(filter)`       | `Partial<ExpenseFilter>`                            | `void`            | Applies search, category, or date range filter      |
| `clearAllExpenses()`      | None                                                | `Promise<void>`   | Wipes all transactions from local database          |

### Signals Exposed

- `expenses`: `Signal<Expense[]>` (Read-only raw list)
- `filteredExpenses`: `Signal<Expense[]>` (Computed reactive filtered & sorted list)
- `financialSummary`: `Signal<FinancialSummary>` (Computed metrics: totalSpent, monthlySpent, categoryBreakdown)

---

## 2. `CategoryService`

Manages spending category store.

| Method               | Parameters             | Return Type       | Description                                         |
| -------------------- | ---------------------- | ----------------- | --------------------------------------------------- |
| `initCategories()`   | None                   | `Promise<void>`   | Initializes category table and seeds defaults       |
| `addCategory(data)`  | `Omit<Category, 'id'>` | `Promise<number>` | Adds custom spending category                       |
| `deleteCategory(id)` | `number`               | `Promise<void>`   | Removes custom category (System defaults protected) |

---

## 3. `ImportExportService`

Handles local data portability.

| Method             | Parameters | Return Type             | Description                                      |
| ------------------ | ---------- | ----------------------- | ------------------------------------------------ |
| `exportData()`     | None       | `Promise<void>`         | Serializes database to downloadable JSON file    |
| `importData(file)` | `File`     | `Promise<ImportResult>` | Validates JSON backup file & populates IndexedDB |

---

# Deferred Backend REST API Endpoints (Phase 2 Expansion)

- `GET /api/v1/expenses`: Fetch user cloud expenses
- `POST /api/v1/expenses`: Sync new transaction
- `PUT /api/v1/expenses/{id}`: Update synced transaction
- `DELETE /api/v1/expenses/{id}`: Delete synced transaction
- `POST /api/v1/sync`: Batch upload/download offline IndexedDB transactions
