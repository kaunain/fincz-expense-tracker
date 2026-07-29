# Software Architecture

**Project Name:** Fincz Expense Tracker

**Version:** 0.1.0

**Status:** Draft

**Author:** Kaunain Ahmad

---

# Overview

Fincz Expense Tracker follows a modern layered architecture.

The application is divided into independent modules to improve maintainability, scalability, and testability.

Initially, the frontend will use Local Storage.

Later versions will communicate with a Spring Boot backend through REST APIs.

---

# High-Level Architecture

```

```
+------------------------+
|      Angular App       |
|                        |
|  Components            |
|  Pages                 |
|  Services              |
|  Models                |
|  Guards                |
|  Pipes                 |
+-----------+------------+
            |
            | REST API
            |
+-----------v------------+
|     Spring Boot API    |
|                        |
| Controllers            |
| Services               |
| Repositories           |
| Security               |
+-----------+------------+
            |
            |
+-----------v------------+
|     PostgreSQL DB      |
+------------------------+
```

---

# Frontend Architecture

```
src/

app/

core/

shared/

features/

assets/

environments/
```

---

## Core Module

The Core module contains application-wide services.

Examples:

- Authentication
- API Client
- Route Guards
- Global Configuration

---

## Shared Module

The Shared module contains reusable components.

Examples:

- Header
- Sidebar
- Buttons
- Dialogs
- Pipes
- Directives

---

## Feature Modules

Each feature should be isolated.

Example:

```
features/

dashboard/

expenses/

categories/

reports/

budget/

settings/
```

Each module contains:

- Components
- Services
- Models
- Routes

---

# Backend Architecture

The backend follows a standard Spring Boot layered architecture.

```
Controller

↓

Service

↓

Repository

↓

Database
```

Example:

```
ExpenseController

↓

ExpenseService

↓

ExpenseRepository

↓

PostgreSQL
```

---

# Request Flow

```
User

↓

Angular Component

↓

Angular Service

↓

REST API

↓

Controller

↓

Service

↓

Repository

↓

Database
```

---

# Response Flow

```
Database

↓

Repository

↓

Service

↓

Controller

↓

JSON Response

↓

Angular Service

↓

Component

↓

User Interface
```

---

# Folder Structure

```
fincz-expense-tracker/

frontend/

backend/

docs/

screenshots/

README.md

ROADMAP.md

CHANGELOG.md

LICENSE
```

---

# Frontend Folder Structure

```
frontend/

src/

app/

core/

shared/

features/

assets/

styles/

environments/
```

---

# Backend Folder Structure

```
backend/

src/

main/

java/

controller/

service/

repository/

entity/

dto/

mapper/

config/

security/

exception/

util/

resources/
```

---

# Design Principles

The project follows these principles:

- Single Responsibility Principle
- Separation of Concerns
- Reusable Components
- Modular Design
- Clean Code
- RESTful APIs

---

# State Management

Version 0.1

- Angular Signals (preferred)
- Services

Future versions may include:

- NgRx (only if required)

---

# Data Storage

Version 0.1

Browser Local Storage

Version 0.7

PostgreSQL Database

---

# API Communication

All frontend and backend communication will use REST APIs.

Data format:

- JSON

HTTP Methods:

- GET
- POST
- PUT
- DELETE

---

# Error Handling

Frontend

- User-friendly error messages
- Validation messages
- Loading indicators

Backend

- Global Exception Handler
- Standard Error Response
- Validation Errors

---

# Security

Version 0.1

No authentication

Version 0.8

- JWT Authentication
- Password Encryption
- Role-Based Access Control

---

# Performance

The application should:

- Load quickly
- Minimize API calls
- Use lazy loading
- Reuse components
- Avoid duplicate requests

---

# Future Improvements

- Docker
- CI/CD
- Cloud Deployment
- Caching
- PWA Support
- Offline Mode
- Multi-user Support

---

# Architecture Goals

The architecture should be:

- Simple
- Modular
- Testable
- Scalable
- Easy to maintain
- Easy to extend

---

# Architecture Decision

This project intentionally starts with a simple architecture.

Additional complexity will only be introduced when there is a real business need.

This keeps the project beginner-friendly while allowing it to evolve into a production-ready application.