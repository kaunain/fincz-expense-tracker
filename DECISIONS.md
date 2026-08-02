# Architecture Decision Records (ADR)

This document records important technical decisions made during the project.

---

# ADR-001

## Decision

Use Angular instead of React.

### Reason

- Better enterprise adoption.
- Improve interview opportunities.
- Strong TypeScript support.
- Excellent Angular Material ecosystem.

Status

Accepted

---

# ADR-002

## Decision

Use Spring Boot for backend.

### Reason

- Existing Java expertise.
- Enterprise standard.
- Easy REST API development.

Status

Accepted

---

# ADR-003

## Decision

Use PostgreSQL.

### Reason

- Open source.
- Powerful SQL support.
- Excellent Spring Boot integration.

Status

Accepted

---

# ADR-004

## Decision

Use Angular Material.

### Reason

- Consistent UI.
- Accessibility.
- Fast development.

Status

Accepted

---

# ADR-005

## Decision

Start with Local Storage.

### Reason

- Faster MVP.
- No backend dependency.
- Easy migration later.

Status

Accepted

---

# ADR-006

## Decision

Pivot Phase 1 (v1.0) to a Local-First Storage Strategy using Dexie.js (IndexedDB) and JSON Portability, deferring custom Spring Boot backend integration to Phase 2.

### Context

To rapidly deliver and deploy v1.0 as a fully operational personal expense tracker without waiting for custom backend deployment, server infrastructure, or authentication setups, the application needs a scalable, performant client-side storage solution.

### Reason

- **Rapid v1.0 Release**: Allows immediate deployment of a client-side static web application on Cloudflare Pages, Vercel, Netlify, or GitHub Pages with zero server cost.
- **Robust Client-Side Database**: Dexie.js provides a clean, promise-based API over IndexedDB, supporting high storage limits, indexed queries, and type-safe schemas far superior to basic `localStorage`.
- **Privacy & Security**: Financial records stay 100% local on the user's browser, providing ultimate data privacy out of the box.
- **Data Portability & Safety**: Manual JSON Export/Import services ensure users can back up, restore, and move their financial data freely.
- **Decoupled Architecture**: Clean Angular service abstractions enable seamless migration or sync integration with the custom Spring Boot backend when Phase 2 (platform expansion) begins.

### Consequences

- Custom Spring Boot REST API integration, PostgreSQL, and multi-device cloud sync are deferred to Phase 2.
- Data synchronization across different devices requires manual JSON export/import during Phase 1.

Status

Accepted
