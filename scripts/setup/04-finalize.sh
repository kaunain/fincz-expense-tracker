#!/usr/bin/env bash

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
FRONTEND="$ROOT/frontend"

echo "========================================="
echo " Sprint 00 - Finalize"
echo "========================================="

cd "$FRONTEND"

echo
echo "Installing Angular ESLint..."

pnpm add -D \
angular-eslint \
eslint

echo "✅ angular-eslint installed"

echo
echo "Adding format scripts..."

node <<'EOF'
const fs=require('fs');
const pkg=JSON.parse(fs.readFileSync('package.json'));

pkg.scripts={
  ...pkg.scripts,
  "format":"prettier --write .",
  "format:check":"prettier --check .",
  "lint":"ng lint"
};

pkg["lint-staged"]={
  "*.{ts,html,scss,css,json,md}":[
    "prettier --write"
  ]
};

fs.writeFileSync(
  "package.json",
  JSON.stringify(pkg,null,2)
);
EOF

echo "✅ package.json updated"

echo
echo "Configuring Husky..."

cd "$ROOT"

if [ ! -d ".husky" ]; then
    mkdir .husky
fi

cat > .husky/pre-commit <<'EOF'
#!/usr/bin/env sh

cd frontend

pnpm prettier --check .
EOF

chmod +x .husky/pre-commit

cat > .husky/commit-msg <<'EOF'
#!/usr/bin/env sh

cd frontend

pnpm exec commitlint --edit "$1"
EOF

chmod +x .husky/commit-msg

echo "✅ Husky hooks created"

echo
echo "Verification"

echo

git --version

node -v

pnpm --version

echo

test -f frontend/package.json && echo "✅ package.json"

test -f frontend/.prettierrc && echo "✅ .prettierrc"

test -f frontend/commitlint.config.cjs && echo "✅ commitlint"

test -f .github/workflows/frontend-ci.yml && echo "✅ GitHub Actions"

test -f .husky/pre-commit && echo "✅ pre-commit"

test -f .husky/commit-msg && echo "✅ commit-msg"

echo
echo "========================================="
echo " Sprint 00 Completed"
echo "========================================="

echo

echo "READY FOR SPRINT 01 🚀"
