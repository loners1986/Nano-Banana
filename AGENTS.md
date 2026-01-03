# Repository Guidelines

## Project Structure

- `app/`: Next.js App Router pages/layouts (entry: `app/page.tsx`, global styles: `app/globals.css`).
- `components/`: shared React components; `components/ui/` contains shadcn/ui building blocks.
- `hooks/`: reusable React hooks (mirrors some shadcn patterns).
- `lib/`: utilities (e.g., `lib/utils.ts`), shared helpers, and non-UI logic.
- `public/`: static assets served at `/` (images, icons).
- `styles/`: additional global CSS (if used alongside `app/globals.css`).

## Build, Test, and Development Commands

This repo uses `pnpm` (see `pnpm-lock.yaml`).

- `pnpm install`: install dependencies.
- `pnpm dev`: run the local dev server (Next.js).
- `pnpm build`: production build.
- `pnpm start`: serve the production build.
- `pnpm lint`: run ESLint over the project.

## Coding Style & Naming

- Language: TypeScript + React (Next.js). Use the path alias `@/*` (configured in `tsconfig.json`).
- Formatting: follow existing files (2-space indent, double quotes, no semicolons).
- Components: `PascalCase` filenames and exports (e.g., `components/editor-section.tsx`).
- Hooks: `useSomething` in `hooks/` (e.g., `hooks/use-toast.ts`).

## Testing Guidelines

There are no automated tests configured in this repository yet. For changes, validate with:

- `pnpm dev` for UI/interaction checks
- `pnpm build` to catch build-time regressions

## Commit & Pull Request Guidelines

No Git history is included in this workspace, so use a consistent convention:

- Commits: `feat: ...`, `fix: ...`, `chore: ...`, `refactor: ...` (Conventional Commits style).
- PRs: describe the change, link issues if applicable, and include screenshots/GIFs for UI changes.
- Keep PRs small and focused; avoid unrelated formatting-only churn.

## Configuration Notes

- If you add environment variables, document them and use `.env.local` (do not commit secrets).
- `next.config.mjs` currently allows builds even with TypeScript errors; treat `pnpm lint` and editor TS errors as gating signals.

