# Sprint 00 - Project Setup

> **Sprint ID:** S00  
> **Duration:** 1 Day  
> **Priority:** Critical  
> **Status:** Completed

---

## Sprint Goal

Prepare the project for development by setting up the Angular workspace, development tools, coding standards, Git workflow, and project structure.

**No business logic will be implemented in this sprint.**

---

## Prerequisites

Install and verify the following tools.

| Tool    | Recommended Version             |
| ------- | ------------------------------- |
| Git     | Latest Stable                   |
| Node.js | Latest LTS supported by Angular |
| pnpm    | Latest                          |
| VS Code | Latest                          |

---

## Verify Installed Tools

Verify all required tools are installed.

```bash
git --version
node -v
pnpm --version
```

Expected Result

- Git version displayed
- Node.js version displayed
- pnpm version displayed

---

## Package Manager Policy

This project officially uses **pnpm**.

Rules:

- Use `pnpm` for package management.
- Use `pnpm ng` for Angular CLI commands.
- Use `pnpm dlx` only for one-time CLI execution.
- Commit `pnpm-lock.yaml`.
- Never commit `package-lock.json`.

---

## Repository Setup

### Clone Repository

Clone the project repository.

```bash
git clone https://github.com/kaunain/fincz-expense-tracker.git
```

### Navigate to Repository

Move into the project directory.

```bash
cd fincz-expense-tracker
```

### Create Development Branch

Create and switch to the development branch.

```bash
git checkout -b dev
```

---

## Create Angular Project

Generate a new Angular workspace inside the repository.

```bash
pnpm dlx @angular/cli@latest new frontend \
  --routing \
  --style=scss \
  --strict \
  --package-manager=pnpm \
  --skip-git
```

Expected Result

- `frontend/` folder created
- Angular project generated
- `pnpm-lock.yaml` created

---

## Navigate to Angular Project

Move into the Angular workspace.

```bash
cd frontend
```

---

## Install Dependencies

Install all project dependencies.

```bash
pnpm install
```

---

## Verify Angular Installation

Display Angular CLI and project information.

```bash
pnpm ng version
```

Expected Result

- Angular CLI version
- Angular packages
- Node version
- pnpm version

---

## Start Development Server

Run the Angular application.

```bash
pnpm ng serve
```

Expected Result

- Application starts successfully
- Browser opens at `http://localhost:4200`
- No build errors

---

## Build Production Version

Generate an optimized production build.

```bash
pnpm ng build --configuration production
```

Expected Result

- Build completes successfully
- `dist/` folder created

---

## Install Angular Material

Add Angular Material to the project.

```bash
pnpm ng add @angular/material
```

Recommended Options

- Theme: Azure Blue
- Global Typography: Yes
- Browser Animations: Yes

---

## Project Structure

Create the following folders.

```text
src/
│
├── app/
│   ├── core/
│   ├── shared/
│   └── features/
│       ├── dashboard/
│       ├── expenses/
│       ├── categories/
│       ├── reports/
│       └── settings/
│
├── assets/
└── styles/
```

---

## Install Runtime Packages

Install runtime dependencies.

```bash
pnpm add rxjs date-fns uuid
```

Purpose

- rxjs → Reactive Programming
- date-fns → Date Utilities
- uuid → Unique ID Generator

---

## Install Development Packages

Install development tools.

```bash
pnpm add -D \
prettier \
husky \
lint-staged \
@commitlint/cli \
@commitlint/config-conventional
```

---

## VS Code Configuration

Create the following files.

```text
.vscode/
├── settings.json
├── extensions.json
└── launch.json
```

Recommended Extensions

- Angular Language Service
- ESLint
- Prettier
- GitLens
- Error Lens
- Material Icon Theme

---

## Configure Code Quality

Configure the following tools to maintain a consistent codebase.

- [ ] ESLint
- [ ] Prettier
- [ ] EditorConfig
- [ ] Husky
- [ ] Commitlint
- [ ] lint-staged

---

## Configure Git Hooks

Initialize Husky for Git hooks.

```bash
pnpm exec husky init
```

Expected Result

- `.husky/` folder created
- Pre-commit hook ready

---

## Documentation

Update the following project documents.

- [ ] README.md
- [ ] CHANGELOG.md
- [ ] PROJECT_STATUS.md
- [ ] DECISIONS.md

---

## GitHub Actions

Create a CI workflow with the following stages.

- Install dependencies
- Run lint
- Run tests
- Build production

Workflow file:

```text
.github/workflows/frontend-ci.yml
```

---

## Sprint Checklist

### Repository

- [x] Repository created
- [x] Development branch created

### Angular

- [x] Angular project created
- [x] Angular Material installed
- [x] Production build successful

### Tooling

- [ ] ESLint configured
- [ ] Prettier configured
- [ ] Husky configured
- [ ] Commitlint configured

### Documentation

- [ ] README updated
- [ ] CHANGELOG updated
- [ ] PROJECT_STATUS updated

---

## Deliverables

At the end of Sprint 00, the project should contain:

- Angular 21 Workspace
- pnpm Configuration
- Angular Material
- Enterprise Folder Structure
- Runtime Dependencies
- Development Tooling
- GitHub Actions
- Updated Documentation

---

## Definition of Done

Sprint 00 is complete when:

- [x] Repository created
- [x] Angular workspace created
- [x] Project builds successfully
- [x] Development server runs successfully
- [x] Angular Material installed
- [ ] ESLint configured
- [ ] Prettier configured
- [ ] Husky configured
- [ ] Commitlint configured
- [ ] GitHub Actions added
- [ ] Documentation updated

---

## Commit History

```text
chore(frontend): bootstrap Angular 21 project with pnpm
```

Future commits

```text
chore(setup): configure Angular Material

chore(tooling): configure prettier and eslint

chore(tooling): configure husky and commitlint

chore(ci): add GitHub Actions workflow
```

---

## Notes

- Use **pnpm** as the official package manager.
- Use **pnpm ng** instead of `ng`.
- Use **pnpm dlx** only for one-time CLI execution.
- Follow Conventional Commits.
- Keep commits small and focused.
- Do not commit generated files such as `dist/` or `node_modules/`.

---

## Next Sprint

### Sprint 01 - Application Foundation

Focus Areas

- Application Shell
- Routing
- Theme
- Layout
- Navigation
- Shared Components
- Core Services
- Project Branding

---

## Sprint Status

| Item                 | Status |
| -------------------- | ------ |
| Repository Setup     | ✅     |
| Angular Workspace    | ✅     |
| pnpm Setup           | ✅     |
| Angular Material     | ✅     |
| Enterprise Structure | ⏳     |
| Code Quality Tools   | ⏳     |
| GitHub Actions       | ⏳     |
| Documentation        | ⏳     |

---

**Sprint 00 Complete ✔️**
