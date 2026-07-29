# Development Guide

**Project Name:** Fincz Expense Tracker

**Version:** 0.1.0

**Status:** Draft

**Author:** Kaunain Ahmad

---

# Purpose

This guide explains how to set up, develop, test, and contribute to the project.

Every developer should read this document before writing code.

---

# Technology Stack

## Frontend

- Angular 20+
- TypeScript
- Angular Material
- RxJS

## Backend (Future)

- Java 21
- Spring Boot
- Spring Security
- PostgreSQL

## Tools

- Git
- GitHub
- VS Code
- IntelliJ IDEA (Backend)
- Docker (Future)

---

# Project Structure

```

fincz-expense-tracker/

frontend/

backend/

docs/

screenshots/

```

---

# Development Workflow

```

Issue

↓

Create Branch

↓

Develop

↓

Commit

↓

Push

↓

Pull Request

↓

Review

↓

Merge

↓

Release

```

---

# Branch Strategy

Main branches

```
main
develop
```

Feature branches

```
feature/add-expense

feature/dashboard

feature/categories

feature/reports
```

Bug fixes

```
fix/expense-validation

fix/dashboard-loading
```

Documentation

```
docs/api-design

docs/readme-update
```

---

# Git Workflow

## Update Local Repository

```
git checkout main
git pull origin main
```

---

## Create Feature Branch

```
git checkout -b feature/add-expense
```

---

## Push Branch

```
git push -u origin feature/add-expense
```

---

## Merge

Merge through Pull Request.

Avoid direct commits to `main`.

---

# Commit Message Convention

Use Conventional Commits.

Examples

```
feat: add expense form

feat: implement dashboard summary

fix: resolve amount validation issue

docs: update roadmap

refactor: simplify expense service

test: add expense component tests

style: format source code

chore: update dependencies
```

---

# Coding Standards

- Keep functions small.
- Write meaningful variable names.
- Avoid duplicate code.
- Keep components focused on one responsibility.
- Follow Angular Style Guide.
- Follow Spring Boot best practices.

---

# Component Guidelines

Each component should have:

- HTML
- TypeScript
- CSS/SCSS
- Unit Test (future)

Example

```
expense-list.component.ts

expense-list.component.html

expense-list.component.scss

expense-list.component.spec.ts
```

---

# Service Guidelines

Services should:

- Call APIs
- Handle business logic
- Avoid UI code

Components should never contain API logic.

---

# Folder Naming

Use lowercase with hyphens.

Example

```
expense-list

add-expense

dashboard-card
```

---

# File Naming

Use descriptive names.

Examples

```
expense.service.ts

expense.model.ts

expense.component.ts

expense.routes.ts
```

---

# Environment Configuration

Development

```
environment.ts
```

Production

```
environment.prod.ts
```

Do not hardcode URLs.

---

# Error Handling

Frontend

- Display user-friendly messages.
- Log technical details only in development.

Backend

- Use Global Exception Handler.
- Return consistent error responses.

---

# Validation

Frontend

- Required fields
- Numeric validation
- Date validation

Backend

- Bean Validation
- Request validation
- Business validation

---

# Logging

Frontend

- Console logging only during development.

Backend

- Use structured logging.
- Avoid logging sensitive information.

---

# Testing Strategy

Manual Testing

- Verify every feature before committing.

Future

- Unit Tests
- Integration Tests
- End-to-End Tests

---

# Pull Request Checklist

Before creating a Pull Request:

- Code compiles successfully.
- No console errors.
- No unused code.
- Documentation updated.
- Screenshots added (if UI changes).
- Feature tested manually.

---

# Code Review Checklist

Review for:

- Readability
- Simplicity
- Performance
- Security
- Reusability
- Naming
- Documentation

---

# Release Process

For every release:

- Update roadmap
- Update changelog
- Update screenshots
- Create Git tag
- Publish GitHub Release

---

# Versioning

Follow Semantic Versioning.

Examples

```
0.1.0

0.2.0

1.0.0

1.1.0
```

---

# Daily Development Routine

1. Pull latest changes.
2. Create a feature branch.
3. Implement one feature.
4. Test locally.
5. Commit changes.
6. Push branch.
7. Create Pull Request.
8. Merge after review.

---

# Best Practices

- Build one feature at a time.
- Keep commits small.
- Update documentation regularly.
- Do not commit secrets.
- Keep the project clean.
- Prefer readable code over clever code.

---

# Goal

The goal of this project is not only to build an expense tracker but also to demonstrate professional software engineering practices.