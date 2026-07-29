# Product Requirements Document (PRD)

**Project Name:** Fincz Expense Tracker

**Version:** 0.1.0

**Status:** Draft

**Author:** Kaunain Ahmad

---

# Purpose

The purpose of this project is to build a simple, fast, and user-friendly expense tracking application.

The application should help users record their daily expenses, monitor spending habits, and improve financial awareness.

This document defines the functional and non-functional requirements of the project.

---

# Product Objectives

- Record daily expenses quickly.
- Organize expenses by category.
- Show spending summary.
- Provide monthly reports.
- Build a solid foundation for future finance modules.

---

# Target Users

### Individual Users

People who want to track their daily expenses.

### Families

Users who manage household expenses.

### Future Users

People who want an all-in-one personal finance platform.

---

# Functional Requirements

## Dashboard

The dashboard should display:

- Total Expenses
- Today's Expenses
- Current Month Expenses
- Category Summary
- Recent Transactions

---

## Expense Management

The user should be able to:

- Add Expense
- Edit Expense
- Delete Expense
- View Expense Details

---

## Categories

The application should provide default categories such as:

- Food
- Travel
- Shopping
- Medical
- Education
- Bills
- Entertainment
- Others

Users should also be able to create custom categories.

---

## Search

The user should be able to search expenses using:

- Date
- Category
- Amount
- Notes

---

## Reports

The application should generate:

- Daily Report
- Weekly Report
- Monthly Report
- Yearly Report

---

## Charts

The application should display:

- Pie Chart
- Monthly Bar Chart
- Expense Trend

---

## Settings

Users should be able to:

- Change Currency
- Select Theme
- Backup Data
- Restore Data

---

# Non-Functional Requirements

## Performance

- Fast loading
- Smooth user experience
- Quick expense entry

---

## Security

- Secure API communication
- Input validation
- JWT Authentication (future)

---

## Usability

- Simple interface
- Minimal clicks
- Mobile-friendly design

---

## Scalability

The architecture should support future modules such as:

- Budget Planner
- Investment Tracker
- Savings Goals
- Net Worth Dashboard

---

## Maintainability

- Clean folder structure
- Modular components
- Reusable services
- Well documented code

---

# MVP Scope (Version 0.1)

The first version will include only:

- Dashboard
- Add Expense
- Expense List
- Delete Expense
- Categories
- Local Storage

---

# Out of Scope

The following features are excluded from Version 0.1:

- Login
- Cloud Sync
- Multi-user Support
- Budget Planning
- Income Tracking
- Reports
- Charts
- AI Features

---

# Future Scope

Future releases may include:

- Spring Boot Backend
- PostgreSQL
- User Authentication
- Budget Planning
- Income Tracking
- Savings Goals
- Investment Portfolio
- Net Worth
- AI Financial Insights
- Family Sharing
- Mobile Application

---

# User Stories

## Story 1

As a user,

I want to add an expense,

So that I can track my daily spending.

---

## Story 2

As a user,

I want to edit an expense,

So that I can correct mistakes.

---

## Story 3

As a user,

I want to delete an expense,

So that I can remove incorrect entries.

---

## Story 4

As a user,

I want to view my monthly spending,

So that I can understand my spending habits.

---

## Story 5

As a user,

I want to organize expenses by category,

So that I know where my money is going.

---

# Acceptance Criteria

Version 0.1 will be considered complete when:

- Users can add expenses.
- Users can edit expenses.
- Users can delete expenses.
- Users can view expense history.
- Dashboard displays expense summary.
- Data is stored locally.
- Application works on desktop and mobile browsers.

---

# Success Metrics

The MVP will be successful if:

- Daily expense entry takes less than 10 seconds.
- The application loads in less than 2 seconds.
- No critical bugs remain.
- The application is stable enough for daily personal use.

---

# Assumptions

- The application will initially support a single user.
- Internet connection is not required for Version 0.1.
- Data will be stored in browser Local Storage.

---

# Dependencies

Frontend

- Angular
- Angular Material
- RxJS

Backend (Future)

- Spring Boot
- PostgreSQL
- JWT

Deployment

- Docker
- GitHub Actions
- Cloudflare Pages