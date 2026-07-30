#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || true)"

if [ -z "$ROOT_DIR" ]; then
  echo "❌ Not inside a Git repository."
  exit 1
fi

cd "$ROOT_DIR"

echo "========================================="
echo " Sprint 00 - Enterprise Structure"
echo "========================================="

FRONTEND_DIR="$ROOT_DIR/frontend"

if [ ! -d "$FRONTEND_DIR" ]; then
  echo "❌ frontend directory not found."
  exit 1
fi

if [ ! -f "$FRONTEND_DIR/package.json" ]; then
  echo "❌ frontend/package.json not found."
  exit 1
fi

echo "✅ Angular project found"

echo
echo "Creating enterprise folder structure..."

mkdir -p "$FRONTEND_DIR/src/app/core"/{config,constants,guards,interceptors,services,utils}
mkdir -p "$FRONTEND_DIR/src/app/shared"/{components,directives,models,pipes,validators}
mkdir -p "$FRONTEND_DIR/src/app/features"/{dashboard,expenses,categories,reports,settings}
mkdir -p "$FRONTEND_DIR/src/assets"/{fonts,icons,images,mock-data}
mkdir -p "$FRONTEND_DIR/src/styles"/{base,components,layout,themes,utilities}

echo "✅ Folder structure created"

echo
echo "Creating .gitkeep files..."

find "$FRONTEND_DIR/src/app" -type d -empty -exec touch {}/.gitkeep \;
find "$FRONTEND_DIR/src/assets" -type d -empty -exec touch {}/.gitkeep \;
find "$FRONTEND_DIR/src/styles" -type d -empty -exec touch {}/.gitkeep \;

echo "✅ .gitkeep files created"

echo
echo "Creating .editorconfig..."

cat > "$ROOT_DIR/.editorconfig" <<'EOF'
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true
EOF

echo "✅ .editorconfig created"

echo
echo "Creating .prettierignore..."

cat > "$ROOT_DIR/.prettierignore" <<'EOF'
node_modules
dist
coverage
.angular
EOF

echo "✅ .prettierignore created"

echo
echo "Creating VS Code configuration..."

mkdir -p "$ROOT_DIR/.vscode"

cat > "$ROOT_DIR/.vscode/settings.json" <<'EOF'
{
  "editor.formatOnSave": true,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "typescript.preferences.importModuleSpecifier": "relative"
}
EOF

cat > "$ROOT_DIR/.vscode/extensions.json" <<'EOF'
{
  "recommendations": [
    "Angular.ng-template",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "eamodio.gitlens",
    "usernamehw.errorlens"
  ]
}
EOF

echo "✅ VS Code configuration created"

echo
echo "Project Structure"

tree -L 3 "$FRONTEND_DIR/src/app" || true

echo
echo "========================================="
echo " Enterprise Structure Completed"
echo "========================================="

echo "Checklist"

echo "✅ Enterprise folders"
echo "✅ .gitkeep files"
echo "✅ .editorconfig"
echo "✅ .prettierignore"
echo "✅ VS Code settings"

echo
echo "Next"

echo "scripts/setup/02-code-quality.sh"