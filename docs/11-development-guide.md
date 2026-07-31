# Development Guide

**Project Name:** Fincz Expense Tracker  
**Version:** 0.2.0  
**Status:** Active  
**Author:** Kaunain Ahmad  

---

# Prerequisites

- **Node.js**: `v20.x` or higher
- **Package Manager**: `pnpm` (v10+ recommended) or `npm`
- **Angular CLI**: `v20+` (`pnpm add -g @angular/cli`)

---

# Quick Start Commands

```bash
# 1. Clone repository
git clone https://github.com/kaunain/fincz-expense-tracker.git
cd fincz-expense-tracker

# 2. Install dependencies
pnpm install

# 3. Launch local dev server
pnpm start

# 4. Build production static bundle
pnpm run build
```

---

# Codebase Standards & Guidelines

### 1. Angular Standalone Components & Signals
- All new components must be `standalone: true`.
- Prefer Angular Reactive Signals (`signal`, `computed`, `effect`) over complex RxJS subject pipelines for local state.

### 2. IndexedDB via Dexie.js
- Keep database operations inside dedicated Angular services (`ExpenseService`, `CategoryService`).
- Never perform direct DOM/IndexedDB mutations inside components.

### 3. Open-Source Documentation
- Annotate all exported models, interfaces, and service methods with clear JSDoc comments.
- Follow conventional commit messages (`feat: ...`, `fix: ...`, `docs: ...`).