#!/usr/bin/env bash
# PostToolUse(Edit|Write) : passe Prettier sur le fichier qui vient d'être écrit.
# prettier-plugin-tailwindcss trie les classes utilitaires — sans ce passage,
# `bun run format:check` casse dès qu'une classe est ajoutée à la main.
set -euo pipefail

file=$(python3 -c 'import json,sys; print(json.load(sys.stdin).get("tool_input",{}).get("file_path",""))' 2>/dev/null || true)
[ -n "$file" ] && [ -f "$file" ] || exit 0

case "$file" in
  "$CLAUDE_PROJECT_DIR"/*) ;;
  *) exit 0 ;;
esac

prettier="$CLAUDE_PROJECT_DIR/node_modules/.bin/prettier"
[ -x "$prettier" ] || exit 0

"$prettier" --write --ignore-unknown --log-level warn "$file" >/dev/null 2>&1 || true
