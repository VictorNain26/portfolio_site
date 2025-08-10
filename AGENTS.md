# Repository Guidelines

## Project Structure & Modules

- Routes: `app/` (App Router, server components). 404: `app/not-found.tsx`.
- UI: `components/` (e.g., `ModelHero.tsx`, shadcn in `components/ui`).
- Shared: `lib/` (utils), `hooks/` (React hooks).
- Content: `content/` and `.content-collections/` (generated types).
- Assets: `public/` (images, icons), global styles in `app/globals.css`.
- Config: `next.config.js`, `tailwind.config.js`, `eslint.config.js`,
  `vitest.config.ts`, `tsconfig.json`.
- Tests: colocated `**/*.{test,spec}.{ts,tsx}` or `__tests__/` (example:
  `components/ui/__tests__/badge.test.tsx`).

## Build, Test, and Development

- Install: `bun install` (npm users: `npm ci`).
- Dev: `bun run dev` (Next dev server).
- Build: `bun run build` (use `ANALYZE=true bun run build` to profile).
- Start: `bun run start` (serve production build).
- Lint/Format: `bun run lint`, `lint:fix`, `format`, `format:check`.
- Types: `bun run type-check` (no emit).
- Tests: `bun run test`, `test:watch`, `test:coverage`.
- Clean: `bun run clean` (removes `.next/`, `out/`, `dist/`).

## Coding Style & Naming

- Language: TypeScript, React 19, Next.js (App Router).
- Formatting: 2 spaces, semicolons, single quotes, width 80 (`.prettierrc.js`).
- Components: `PascalCase` in `components/` (e.g., `ProjectCard.tsx`).
- Routes: kebab-case in `app/` folders (e.g., `app/blog/[slug]/page.tsx`).
- Imports: prefer type-only; avoid `any`; keep console minimal (ESLint flat
  config).

## Testing Guidelines

- Frameworks: Vitest + jsdom; React Testing Library; `@testing-library/jest-dom`
  setup in `vitest.setup.ts`.
- Coverage: global 80% (branches, lines, functions, statements).
- Run: `bun run test:watch` during dev; `test:coverage` for reports.
- Example: `components/ui/__tests__/badge.test.tsx` validates rendering and
  variants.

## Commit & PRs

- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`,
  `test:`. Use scopes (e.g., `feat(hero): add bloom`).
- Before PR: run `lint`, `type-check`, `test`; include screenshots/recordings
  for UI changes.
- PR description: what/why, linked issues, performance/SEO notes when relevant.

## Security & Config

- Env: `cp .env.example .env.local`; set `HF_TOKEN` if needed.
- Engines: Node ≥ 18.17 or Bun ≥ 1.2 (see `package.json#engines`).
- Do not commit secrets or `*.env*`; commit `bun.lock` for reproducibility.
