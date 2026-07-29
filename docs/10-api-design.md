# API Design

**Project Name:** Fincz Expense Tracker

**Version:** 0.1.0

**Status:** Draft

**Author:** Kaunain Ahmad

---

# Overview

This document defines the REST APIs for the backend.

The APIs follow RESTful design principles and use JSON for request and response payloads.

---

# API Standards

Base URL

```
/api/v1
```

Content Type

```
application/json
```

Authentication

Version 0.1

- No Authentication

Future

- JWT Bearer Token

---

# Standard Response

Success

```json
{
  "success": true,
  "message": "Expense created successfully.",
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": []
}
```

---

# Expense APIs

## Create Expense

POST

```
/api/v1/expenses
```

Request

```json
{
  "amount": 25.50,
  "categoryId": "uuid",
  "accountId": "uuid",
  "expenseDate": "2026-08-01",
  "note": "Lunch"
}
```

Response

```json
{
  "success": true,
  "message": "Expense created successfully."
}
```

---

## Get All Expenses

GET

```
/api/v1/expenses
```

Optional Query Parameters

```
?page=1
&size=20
&sort=expenseDate,desc
```

---

## Get Expense By Id

GET

```
/api/v1/expenses/{id}
```

---

## Update Expense

PUT

```
/api/v1/expenses/{id}
```

---

## Delete Expense

DELETE

```
/api/v1/expenses/{id}
```

---

## Search Expenses

GET

```
/api/v1/expenses/search
```

Query Parameters

```
category

account

fromDate

toDate

keyword
```

---

# Category APIs

## Get Categories

GET

```
/api/v1/categories
```

---

## Create Category

POST

```
/api/v1/categories
```

---

## Update Category

PUT

```
/api/v1/categories/{id}
```

---

## Delete Category

DELETE

```
/api/v1/categories/{id}
```

---

# Account APIs

## Get Accounts

GET

```
/api/v1/accounts
```

---

## Create Account

POST

```
/api/v1/accounts
```

---

## Update Account

PUT

```
/api/v1/accounts/{id}
```

---

## Delete Account

DELETE

```
/api/v1/accounts/{id}
```

---

# Dashboard APIs

## Dashboard Summary

GET

```
/api/v1/dashboard
```

Example Response

```json
{
  "todayExpense": 35.25,
  "monthExpense": 540.80,
  "totalExpense": 1280.40,
  "remainingBudget": 219.60
}
```

---

## Recent Expenses

GET

```
/api/v1/dashboard/recent-expenses
```

---

# Report APIs

## Monthly Report

GET

```
/api/v1/reports/monthly
```

Parameters

```
month

year
```

---

## Yearly Report

GET

```
/api/v1/reports/yearly
```

---

## Category Report

GET

```
/api/v1/reports/categories
```

---

# Budget APIs (Future)

GET

```
/api/v1/budgets
```

POST

```
/api/v1/budgets
```

PUT

```
/api/v1/budgets/{id}
```

DELETE

```
/api/v1/budgets/{id}
```

---

# Authentication APIs (Future)

POST

```
/api/v1/auth/register
```

POST

```
/api/v1/auth/login
```

POST

```
/api/v1/auth/logout
```

GET

```
/api/v1/auth/profile
```

---

# HTTP Status Codes

| Status | Meaning |
|----------|---------------------------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

# Validation Rules

Expense

- Amount > 0
- Category is required
- Account is required
- Expense Date is required

Category

- Name is required
- Name must be unique

Account

- Name is required

---

# Pagination

Request

```
GET /expenses?page=1&size=20
```

Response

```json
{
  "content": [],
  "page": 1,
  "size": 20,
  "totalElements": 120,
  "totalPages": 6
}
```

---

# Sorting

Example

```
GET /expenses?sort=expenseDate,desc
```

```
GET /expenses?sort=amount,asc
```

---

# Filtering

Examples

```
GET /expenses?category=Food
```

```
GET /expenses?account=Cash
```

```
GET /expenses?fromDate=2026-08-01&toDate=2026-08-31
```

---

# Versioning Strategy

Current Version

```
v1
```

Future

```
/api/v2
```

Only introduce a new API version when there are breaking changes.

---

# Future APIs

- Income
- Investments
- Savings Goals
- Net Worth
- Financial Calendar
- Notifications
- Recurring Expenses
- AI Insights

---

# API Design Principles

- RESTful URLs
- Use HTTP methods correctly
- Consistent naming
- Stateless APIs
- JSON only
- Pagination for large data
- Proper validation
- Meaningful error messages