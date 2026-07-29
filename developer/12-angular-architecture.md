# Angular Architecture

**Project:** Fincz Expense Tracker

**Angular Version:** 20+

---

# Goal

Build a scalable Angular application using standalone components and a feature-based architecture.

---

# Folder Structure

```
src/

app/

core/

shared/

features/

layout/

models/

services/

guards/

interceptors/

pipes/

directives/

assets/

environments/
```

---

# Core Module

Contains singleton services.

Examples

- Auth Service
- Storage Service
- Logger
- API Client
- Global Configuration

---

# Shared Module

Reusable UI components.

Examples

- Button
- Card
- Dialog
- Table
- Loader
- Snackbar

---

# Layout Module

Application shell.

Contains

- Header
- Sidebar
- Footer
- Toolbar

---

# Feature Modules

Each feature owns its code.

```
dashboard/

expenses/

categories/

reports/

settings/

budget/
```

Each feature contains

- pages
- components
- services
- models
- routes

---

# State Management

Version 0.1

Angular Signals

Services

Later

NgRx (if needed)

---

# Routing

Use lazy loading.

```
/

dashboard

/expenses

/categories

/reports

/settings
```

---

# Component Rules

One component = One responsibility.

Keep business logic inside services.

---

# Naming Convention

```
expense-list.component.ts

expense.service.ts

expense.model.ts
```

---

# Recommended Packages

Angular Material

CDK

RxJS

Chart.js

ngx-toastr

date-fns

uuid
