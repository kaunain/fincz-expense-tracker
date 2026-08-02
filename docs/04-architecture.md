# Software Architecture

**Project Name:** Fincz Expense Tracker  
**Version:** 0.2.0  
**Status:** Active Development  
**Author:** Kaunain Ahmad

---

# Overview

Fincz Expense Tracker is engineered using a **Local-First Offline Architecture** for Phase 1 (v1.0), with planned custom backend integration deferred to Phase 2 (Platform Expansion).

The primary goal of Phase 1 is delivering a fast, privacy-focused, 100% client-side personal finance manager that runs completely in the user's browser with zero server latency or cloud dependency.

---

# System Architecture (Phase 1 vs Phase 2)

```
Phase 1: Local-First Client-Side Static Application (v1.0)
+-------------------------------------------------------------------+
|                        Angular 20+ Web App                        |
|                                                                   |
|  +-------------------+  +-------------------+  +---------------+  |
|  | UI Views          |  | Reactive Signals  |  | JSON Backup   |  |
|  | (Dashboard/CRUD)  |  | Service Layer     |  | Export/Import |  |
|  +---------+---------+  +---------+---------+  +-------+-------+  |
|            |                      |                    |          |
|            +----------------------+--------------------+          |
|                                   |                               |
|                     +-------------v-------------+                 |
|                     | IndexedDB via Dexie.js    |                 |
|                     | (Client-Side Storage DB)  |                 |
|                     +---------------------------+                 |
+-------------------------------------------------------------------+
                                    |
                         Static Web App Hosting
          (Cloudflare Pages / Vercel / Netlify / GitHub Pages)

---------------------------------------------------------------------

Phase 2: Platform Expansion (Custom Backend Integration)
+------------------------+                  +-----------------------+
|      Angular App       | === REST API ===>|   Spring Boot 3.x API |
| (Local-First Engine)   |   (Cloud Sync)   | (JWT Auth & Services) |
+------------------------+                  +-----------+-----------+
                                                        |
                                                        v
                                                +---------------+
                                                | PostgreSQL DB |
                                                +---------------+
```

---

# Single-Root Directory Architecture

```
fincz-expense-tracker/
├── .github/                   # CI workflows & issue templates
├── .vscode/                   # Recommended editor settings
├── docs/                      # Architectural & design specifications
├── sprints/                   # Sprint milestones & task logs
├── public/                    # Static assets & favicon
├── src/
│   ├── app/
│   │   ├── core/              # Database (Dexie.js), Models, Services
│   │   │   ├── db/            # Dexie AppDatabase schema initialization
│   │   │   ├── models/        # Expense & Category TypeScript interfaces
│   │   │   └── services/      # ExpenseService, CategoryService, ImportExportService
│   │   ├── features/          # Isolated Feature View Modules
│   │   │   ├── dashboard/     # Summary metrics & recent activity
│   │   │   ├── expenses/      # CRUD management table & modal form
│   │   │   ├── categories/    # Spending category manager
│   │   │   ├── reports/       # Category distribution analytics
│   │   │   └── settings/      # JSON backup export/import & DB clear
│   │   └── layout/            # App Shell (Header, Navigation, Footer)
│   ├── assets/                # Icons & images
│   ├── styles/                # Theme tokens & SCSS styling
│   ├── index.html
│   └── main.ts
├── angular.json               # Angular CLI Root Config
├── package.json               # Dependencies & scripts
├── CONTRIBUTING.md            # Open-Source Contribution Guide
├── CODE_OF_CONDUCT.md         # Contributor Covenant
├── DECISIONS.md               # Architecture Decision Records
└── LICENSE                    # MIT License
```

---

# Core Architectural Components

### 1. Dexie.js (IndexedDB Engine)

- Serves as the primary client-side persistent database.
- Provides asynchronous, promise-based indexed queries over browser `IndexedDB`.
- Auto-seeds default categories on initial database creation.

### 2. Angular Reactive Signals State Management

- Utilizes `signal`, `computed`, and `effect` primitives for fine-grained UI reactivity.
- Eliminates unnecessary component re-renders and complex RxJS subscription boilerplate.

### 3. Data Portability & Serialization

- Provides manual JSON Export and Import services (`ImportExportService`).
- Guarantees 100% data ownership, backup safety, and easy migration across devices.
