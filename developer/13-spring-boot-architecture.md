# Spring Boot Architecture

---

# Architecture

```
Controller

↓

DTO

↓

Service

↓

Mapper

↓

Repository

↓

Entity

↓

Database
```

---

# Package Structure

```
controller

service

repository

entity

dto

mapper

config

security

exception

util

validator

```

---

# Principles

- Controller contains no business logic.
- Service contains business logic.
- Repository only accesses the database.
- Never expose entities directly.

---

# Validation

Bean Validation

Global Exception Handler

DTO Validation

---

# Future

JWT

Spring Security

Docker

Swagger
