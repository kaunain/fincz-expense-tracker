#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel)"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo "========================================="
echo " Sprint 00 - GitHub Actions Setup"
echo "========================================="

mkdir -p "$ROOT_DIR/.github/workflows"

echo "Creating frontend-ci.yml..."

cat > "$ROOT_DIR/.github/workflows/frontend-ci.yml" <<'EOF'
name: Frontend CI

on:
  push:
    branches:
      - main
      - dev
  pull_request:
    branches:
      - main
      - dev

jobs:
  build:

    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: frontend

    steps:

      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
          cache-dependency-path: frontend/pnpm-lock.yaml

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Run Production Build
        run: pnpm ng build --configuration production
EOF

echo "✅ GitHub Actions workflow created"

echo
echo "Verifying workflow..."

if [ -f "$ROOT_DIR/.github/workflows/frontend-ci.yml" ]; then
    echo "✅ Workflow exists"
else
    echo "❌ Workflow missing"
    exit 1
fi

echo
echo "========================================="
echo " Sprint 00 Progress"
echo "========================================="

echo "✅ Angular Workspace"
echo "✅ Enterprise Structure"
echo "✅ GitHub Actions"

echo
echo "Remaining"

echo "⏳ ESLint Flat Config"
echo "⏳ Husky (Monorepo)"
echo "⏳ lint-staged"

echo
echo "Next"

echo "scripts/setup/04-finalize.sh"
