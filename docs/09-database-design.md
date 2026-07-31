# Database Design

**Project Name:** Fincz Expense Tracker  
**Version:** 0.2.0  
**Status:** Active  
**Author:** Kaunain Ahmad  

---

# Overview

Fincz Expense Tracker utilizes a **Local-First Storage Engine** powered by **IndexedDB via Dexie.js** for Phase 1 (v1.0).

All data is stored directly in the user's browser database with index-optimized querying. Custom PostgreSQL server database schemas are documented for Phase 2 expansion.

---

# Client-Side Database Schema (IndexedDB via Dexie.js)

### Database Name
`FinczExpenseTrackerDB`

---

## 1. Table: `expenses`

**Purpose:** Stores user financial transaction records.

| Attribute | TypeScript Type | Indexed Key | Description |
|-----------|-----------------|-------------|-------------|
| `id` | `number` | Primary Key (`++id`) | Auto-incremented unique ID |
| `title` | `string` | Indexed | Short transaction title/description |
| `amount` | `number` | Indexed | Transaction monetary value |
| `category` | `string` | Indexed | Associated category name |
| `date` | `string` | Indexed | ISO Date string (`YYYY-MM-DD`) |
| `paymentMethod` | `PaymentMethod` | Indexed | Cash, Credit Card, Debit Card, UPI, etc. |
| `notes` | `string` | Optional | Additional notes or tags |
| `createdAt` | `string` | Indexed | ISO Timestamp of creation |
| `updatedAt` | `string` | Metadata | ISO Timestamp of last modification |

```typescript
// Dexie Store Definition
expenses: '++id, title, amount, category, date, paymentMethod, createdAt'
```

---

## 2. Table: `categories`

**Purpose:** Stores spending categories and visual badges.

| Attribute | TypeScript Type | Indexed Key | Description |
|-----------|-----------------|-------------|-------------|
| `id` | `number` | Primary Key (`++id`) | Auto-incremented unique ID |
| `name` | `string` | Unique Index (`&name`) | Category display name |
| `icon` | `string` | Property | Material design icon key |
| `color` | `string` | Property | HEX color badge string |
| `isDefault` | `boolean` | Indexed | `true` for system defaults |
| `budgetLimit` | `number` | Optional | Optional monthly spending limit |

```typescript
// Dexie Store Definition
categories: '++id, &name, isDefault'
```

---

# Seed Data (Default Categories)

Upon first launch, `AppDatabase` automatically populates the `categories` table with system presets:
- Food & Dining (`#ff6b6b`)
- Housing & Rent (`#4ecdc4`)
- Transportation (`#ffe66d`)
- Utilities & Bills (`#1a535c`)
- Entertainment (`#9b5de5`)
- Shopping (`#f15bb5`)
- Health & Fitness (`#00bbf9`)
- Salary & Income (`#00f5d4`)
- Miscellaneous (`#6c757d`)

---

# Backup & Restore Payload Format (JSON)

```json
{
  "app": "Fincz Expense Tracker",
  "version": "0.2.0",
  "exportedAt": "2026-07-31T12:00:00.000Z",
  "expenses": [
    {
      "title": "Grocery Shopping",
      "amount": 85.50,
      "category": "Food & Dining",
      "date": "2026-07-31",
      "paymentMethod": "Credit Card",
      "createdAt": "2026-07-31T10:00:00.000Z",
      "updatedAt": "2026-07-31T10:00:00.000Z"
    }
  ],
  "categories": [...]
}
```