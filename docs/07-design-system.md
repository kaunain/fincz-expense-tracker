# Design System

**Project Name:** Fincz Expense Tracker

**Version:** 0.1.0

**Status:** Draft

**Author:** Kaunain Ahmad

---

# Purpose

The Design System ensures that every screen follows a consistent visual style and user experience.

It defines colors, typography, spacing, components, icons, and responsive behavior.

---

# Design Principles

- Simple
- Clean
- Modern
- Consistent
- Accessible
- Mobile First

---

# Theme

Version 0.1 supports:

- Light Theme

Future versions:

- Dark Theme
- System Theme

---

# Color Palette

## Primary

Used for primary actions.

```
Primary
#2563EB
```

---

## Secondary

Used for supporting actions.

```
Secondary
#10B981
```

---

## Success

```
#22C55E
```

---

## Warning

```
#F59E0B
```

---

## Error

```
#EF4444
```

---

## Background

```
#FFFFFF
```

---

## Surface

```
#F8FAFC
```

---

## Border

```
#E5E7EB
```

---

## Text

Primary

```
#111827
```

Secondary

```
#6B7280
```

---

# Typography

Font Family

```
Inter
```

Fallback

```
Arial
sans-serif
```

---

## Heading 1

32px

Bold

---

## Heading 2

28px

Bold

---

## Heading 3

24px

Semi Bold

---

## Heading 4

20px

Medium

---

## Body

16px

Regular

---

## Small Text

14px

Regular

---

## Caption

12px

Regular

---

# Border Radius

Cards

12px

Buttons

8px

Input Fields

8px

Dialogs

16px

---

# Shadow

Cards

Small shadow

Dialogs

Medium shadow

Floating Button

Large shadow

---

# Buttons

## Primary Button

- Filled
- Rounded
- Primary Color

Example

```
Save Expense
```

---

## Secondary Button

Outlined

Example

```
Cancel
```

---

## Danger Button

Red

Example

```
Delete
```

---

# Icons

Use:

Material Icons

Examples

- dashboard
- add
- edit
- delete
- search
- settings
- category
- account_balance_wallet
- pie_chart

---

# Cards

Cards should contain:

- Title
- Value
- Optional Icon

Example

```
Today's Expense

$25
```

---

# Tables

Tables should support:

- Sorting
- Pagination
- Responsive Layout

Columns

- Date
- Category
- Amount
- Account
- Actions

---

# Forms

Every form should include:

- Labels
- Validation
- Helper Text
- Error Messages

Example

```
Amount

Required
```

---

# Input Fields

Supported

- Text
- Number
- Date
- Select
- Textarea

---

# Dialogs

Dialogs should be used for:

- Delete Confirmation
- Settings
- Add Category

---

# Navigation

Desktop

Left Sidebar

Mobile

Bottom Navigation

---

# Responsive Breakpoints

Desktop

1200px+

Tablet

768px - 1199px

Mobile

Below 768px

---

# Spacing

Small

8px

Medium

16px

Large

24px

Extra Large

32px

---

# Layout

Maximum Content Width

1440px

Page Padding

24px

Card Gap

16px

---

# Animations

Keep animations simple.

Recommended duration:

200ms

Use animations only where they improve usability.

---

# Accessibility

- Keyboard Navigation
- Proper Labels
- High Contrast
- Screen Reader Friendly
- Focus Indicators

---

# Empty State

Display:

- Icon
- Message
- Primary Action Button

Example

```
No expenses found.

Add your first expense.
```

---

# Loading State

Use Skeleton Loader whenever possible.

---

# Error State

Show:

- Error Message
- Retry Button

---

# Notifications

Use Snackbars for:

- Success
- Error
- Warning
- Information

---

# Charts

Preferred Library

Chart.js

Supported

- Pie Chart
- Doughnut Chart
- Bar Chart
- Line Chart

---

# Future Improvements

- Dark Theme
- Theme Customization
- RTL Support
- Multiple Color Themes