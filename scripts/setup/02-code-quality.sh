#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel)"
FRONTEND_DIR="$ROOT_DIR/frontend"

cd "$FRONTEND_DIR"

echo "========================================="
echo " Sprint 00 - Code Quality Setup"
echo "========================================="

echo
echo "Installing development dependencies..."

pnpm add -D \
  prettier \
  eslint \
  husky \
  lint-staged \
  @commitlint/cli \
  @commitlint/config-conventional

echo "✅ Packages installed"

echo
echo "Creating .prettierrc..."

cat > .prettierrc <<'EOF'
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5"
}
EOF

echo "✅ .prettierrc created"

echo
echo "Creating commitlint.config.cjs..."

cat > commitlint.config.cjs <<'EOF'
module.exports = {
  extends: ['@commitlint/config-conventional']
};
EOF

echo "✅ commitlint.config.cjs created"

echo
echo "Initializing Husky..."

pnpm exec husky init

echo "✅ Husky initialized"

echo
echo "Creating commit-msg hook..."

cat > .husky/commit-msg <<'EOF'
pnpm exec commitlint --edit "$1"
EOF

chmod +x .husky/commit-msg

echo "✅ commit-msg hook created"

echo
echo "Updating package.json scripts..."

node <<'EOF'
const fs = require('fs');

const pkg = JSON.parse(fs.readFileSync('package.json'));

pkg.scripts = {
  ...pkg.scripts,
  format: "prettier --write .",
  "format:check": "prettier --check ."
};

pkg["lint-staged"] = {
  "*.{ts,html,scss,css,json,md}": [
    "prettier --write"
  ]
};

fs.writeFileSync(
  'package.json',
  JSON.stringify(pkg, null, 2)
);
EOF

echo "✅ package.json updated"

echo
echo "Verification"

pnpm prettier --version
pnpm exec commitlint --version

echo
echo "========================================="
echo " Code Quality Completed"
echo "========================================="

echo
echo "Completed"

echo "✅ Prettier"
echo "✅ ESLint"
echo "✅ Husky"
echo "✅ Commitlint"
echo "✅ lint-staged"

echo
echo "Next"

echo "scripts/setup/03-github-actions.sh"
