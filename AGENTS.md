# Repository Guidelines

## Project Structure & Module Organization

This repository is a **Next.js (App Router) + TypeScript** site with Tailwind CSS and shadcn/ui.

- `app/`: route tree and layouts (`app/layout.tsx`, `app/page.tsx`, global styles in `app/globals.css`)
- `components/`: shared React components (notably `components/ui/` for shadcn/ui primitives)
- `hooks/`: reusable React hooks (name hooks `useXyz`)
- `lib/`: shared utilities (import via `@/lib/...`)
- `public/`: static assets served as-is (images, icons)
- `styles/`: additional styling (if used)

Path alias: use `@/` (configured in `tsconfig.json`) instead of long relative imports.

## Build, Test, and Development Commands

Package manager: **pnpm** (lockfile: `pnpm-lock.yaml`).

- `pnpm install`: install dependencies
- `pnpm dev`: run local dev server (hot reload)
- `pnpm build`: production build (`next build`)
- `pnpm start`: run the built app (`next start`)
- `pnpm exec tsc --noEmit`: typecheck (recommended because `next.config.mjs` allows builds with TS errors)

Linting: `pnpm lint` runs `eslint .`, but ESLint may not be configured in this repo yet. If you add linting, prefer `eslint` + `eslint-config-next` and use `next lint`.

## Coding Style & Naming Conventions

- TypeScript/TSX only; keep components in **PascalCase**, hooks in **camelCase** with `use` prefix.
- Match existing formatting: **2-space indentation**, no semicolons, and consistent quote style within a file.
- Tailwind-first styling; keep design tokens in `app/globals.css` (see the `--banana` theme variables).

## Testing Guidelines

There is no dedicated test suite in this workspace. If you introduce non-trivial logic, add a test framework (e.g., Vitest or Jest) and colocate tests near code (e.g., `components/__tests__/Button.test.tsx`).

## Commit & Pull Request Guidelines

This directory is not currently a Git worktree, so no commit conventions can be inferred here. Recommended:

- Commit messages: Conventional Commits (e.g., `feat: add showcase carousel`, `fix: handle empty upload`)
- PRs: include a short description, screenshots for UI changes, and any relevant issue links

## Configuration & Security

- Put secrets in `.env.local` and never commit them.
- `next.config.mjs` sets `images.unoptimized = true`; keep image usage compatible with that setting.
