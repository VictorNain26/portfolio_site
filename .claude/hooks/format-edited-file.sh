#!/usr/bin/env bash
# PostToolUse(Edit|Write) : passe Prettier sur le fichier qui vient d'être écrit.
# prettier-plugin-tailwindcss trie les classes utilitaires — sans ce passage,
# `bun run format:check` casse dès qu'une classe est ajoutée à la main.
set -euo pipefail

prettier="$CLAUDE_PROJECT_DIR/node_modules/.bin/prettier"
# Absent avant le premier `bun install` : rien à formater, pas une erreur.
[ -x "$prettier" ] || exit 0

# Node est déjà un prérequis dur de Prettier (shebang `env node`), donc lire le
# payload avec lui n'ajoute aucune dépendance — contrairement à python3.
if ! command -v node >/dev/null 2>&1; then
  echo "format-edited-file: node introuvable, formatage ignoré" >&2
  exit 1
fi

file=$(node -e 'let s="";process.stdin.on("data",c=>s+=c).on("end",()=>{try{process.stdout.write(JSON.parse(s)?.tool_input?.file_path??"")}catch{}})')
[ -n "$file" ] && [ -f "$file" ] || exit 0

case "$file" in
  "$CLAUDE_PROJECT_DIR"/*) ;;
  *) exit 0 ;;
esac

"$prettier" --write --ignore-unknown --log-level warn "$file" >/dev/null 2>&1 || true
