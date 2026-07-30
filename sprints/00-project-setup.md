# Sprint 00 - Project Setup

> **Sprint ID:** S00  
> **Duration:** 1 Day  
> **Priority:** Critical  
> **Status:** Planned

---

## Sprint Goal

Prepare the project for development by setting up the Angular workspace, development tools, coding standards, Git workflow, and project structure.

**No business logic will be implemented in this sprint.**

---

## Prerequisites

Install and verify the following tools:

| Tool | Recommended Version |
|------|----------------------|
| Git | Latest |
| Node.js | 22.x LTS |
| npm | Latest |
| Angular CLI | Latest |
| VS Code | Latest |

### Install Angular CLI

```bash
npm install -g @angular/cli
```

### Verify Installation

```bash
git --version
node -v
npm -v
ng version
```

---

## Tasks

### Repository

- [x] Create GitHub Repository
- [x] Clone Repository
- [x] Create Initial Documentation
- [x] Create `dev` branch
- [x] Configure `.gitignore`

---

### Angular Project

Create Angular workspace inside the `frontend` folder.

```bash
mkdir frontend
cd frontend

pnpm dlx @angular/cli@latest new . \
--routing \
--style=scss \
--strict \
--package-manager=pnpm \
--skip-git
```

Verify project:

```bash
pnpm install
ng serve
ng build --configuration production
```

---

### Angular Material

```bash
ng add @angular/material
```

Options:

- Theme: Azure Blue (or default)
- Typography: Yes
- Animations: Yes

---

### Project Structure

Create the following folders:

```text
src/app/

core/
shared/
features/

features/
    dashboard/
    expenses/
    categories/
    reports/
    settings/

assets/
styles/
```

---

### Runtime Dependencies

```bash
npm install rxjs date-fns uuid
```

---

### Development Dependencies

```bash
npm install -D \
prettier \
husky \
lint-staged \
@commitlint/cli \
@commitlint/config-conventional
```

---

### VS Code

Create:

```text
.vscode/

settings.json
extensions.json
```

Recommended extensions:

- Angular Language Service
- ESLint
- Prettier
- GitLens
- Error Lens

---

### Code Quality

Configure:

- [ ] ESLint
- [ ] Prettier
- [ ] EditorConfig
- [ ] Husky
- [ ] Commitlint
- [ ] lint-staged

---

### Documentation

Update:

- [ ] README.md
- [ ] CHANGELOG.md
- [ ] PROJECT_STATUS.md

---

### GitHub Actions

Create CI workflow to:

- Install dependencies
- Run lint
- Run tests
- Build production

---

## Deliverables

- Angular Workspace
- Angular Material
- Enterprise Folder Structure
- ESLint
- Prettier
- Husky
- Commitlint
- GitHub Action
- Updated Documentation

---

## Definition of Done

Sprint 00 is complete when:

- [ ] Angular project created
- [ ] `ng serve` runs successfully
- [ ] Production build succeeds
- [ ] Angular Material configured
- [ ] Folder structure created
- [ ] Lint passes
- [ ] Git hooks configured
- [ ] Documentation updated
- [ ] First setup commit pushed

---

## Commit Message

```text
chore(setup): initialize enterprise Angular project
```

---

## Next Sprint

**Sprint 01 – Application Foundation**

Focus:

- Application Layout
- Navigation
- Theme
- Shared Components
- Routing
- Core Services