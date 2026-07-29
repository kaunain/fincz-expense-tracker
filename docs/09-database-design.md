# Database Design

**Project Name:** Fincz Expense Tracker

**Version:** 0.1.0

**Status:** Draft

**Author:** Kaunain Ahmad

---

# Overview

Version 0.1 stores data in browser Local Storage.

However, the application is designed so that it can later migrate to PostgreSQL without changing the frontend architecture.

This document defines the future database structure.

---

# Database

PostgreSQL

---

# Design Principles

- Keep tables normalized.
- Use UUID as the primary key.
- Track creation and update timestamps.
- Use soft delete where applicable.
- Avoid duplicate data.
- Design for future scalability.

---

# Entity Relationship Diagram

```

User
│
├──────────────┐
│              │
│              │
Expense     Budget
│
│
Category
│
│
Account

```

---

# Table: users

Purpose

Stores application users.

| Column | Type | Description |
|----------|----------|----------------|
| id | UUID | Primary Key |
| name | VARCHAR(100) | Full Name |
| email | VARCHAR(150) | Email Address |
| password | VARCHAR | Encrypted Password |
| created_at | TIMESTAMP | Created Time |
| updated_at | TIMESTAMP | Updated Time |

---

# Table: categories

Purpose

Stores expense categories.

| Column | Type | Description |
|----------|----------|----------------|
| id | UUID | Primary Key |
| name | VARCHAR(50) | Category Name |
| icon | VARCHAR(50) | Material Icon |
| color | VARCHAR(20) | Display Color |
| is_default | BOOLEAN | Default Category |
| created_at | TIMESTAMP | Created Time |

---

# Table: accounts

Purpose

Stores payment accounts.

Examples

- Cash
- Bank
- Credit Card
- Wallet
- UPI

| Column | Type | Description |
|----------|----------|----------------|
| id | UUID | Primary Key |
| name | VARCHAR(50) | Account Name |
| type | VARCHAR(30) | Account Type |
| balance | DECIMAL(15,2) | Current Balance |
| created_at | TIMESTAMP | Created Time |

---

# Table: expenses

Purpose

Stores all expense records.

| Column | Type | Description |
|----------|----------|----------------|
| id | UUID | Primary Key |
| category_id | UUID | Category |
| account_id | UUID | Payment Account |
| amount | DECIMAL(15,2) | Expense Amount |
| expense_date | DATE | Expense Date |
| note | TEXT | Notes |
| created_at | TIMESTAMP | Created Time |
| updated_at | TIMESTAMP | Updated Time |

---

# Table: budgets

Purpose

Stores monthly budgets.

| Column | Type | Description |
|----------|----------|----------------|
| id | UUID | Primary Key |
| category_id | UUID | Category |
| amount | DECIMAL(15,2) | Budget Amount |
| month | INTEGER | Month |
| year | INTEGER | Year |

---

# Relationships

```

Category

1

|

|

*

Expense

```

One category can have many expenses.

---

```

Account

1

|

|

*

Expense

```

One account can have many expenses.

---

```

Category

1

|

|

*

Budget

```

One category can have multiple monthly budgets.

---

# Indexes

Expense Table

- expense_date
- category_id
- account_id

Category Table

- name

Account Table

- name

---

# Naming Convention

Tables

- lowercase
- plural

Examples

- users
- expenses
- categories

Columns

- snake_case

Examples

- created_at
- updated_at
- category_id

---

# Audit Columns

Every table should contain:

- created_at
- updated_at

Future

- created_by
- updated_by

---

# Data Validation

Expense

- Amount must be greater than zero.
- Category is required.
- Account is required.
- Expense date is required.

Category

- Name cannot be empty.
- Name must be unique.

Account

- Name cannot be empty.

---

# Future Tables

The following tables will be added in future releases.

- incomes
- investments
- savings_goals
- subscriptions
- reminders
- notifications
- recurring_expenses
- user_settings

---

# Sample Data

Category

```
Food
Travel
Medical
Shopping
Bills
Education
Entertainment
```

---

Account

```
Cash
Bank
UPI
Credit Card
Wallet
```

---

Expense

```
Amount: 25.50
Category: Food
Account: Cash
Date: 2026-08-01
Note: Lunch
```

---

# Migration Plan

Version 0.1

Local Storage

↓

Version 0.7

Spring Boot REST APIs

↓

PostgreSQL

↓

Cloud Database

---

# Future Improvements

- Multi-user support
- Shared family accounts
- Multi-currency
- Data encryption
- Automatic backup
- Cloud synchronization
- Financial analytics

---

# Summary

The database design is intentionally simple for the initial version while providing a solid foundation for future growth.