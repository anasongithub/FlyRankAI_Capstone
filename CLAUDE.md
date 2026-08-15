# CLAUDE.md — Project Conventions

## Stack
- Next.js (App Router) + React + TypeScript
- Styling: Tailwind CSS (or update once decided)
- Package manager: npm

## Conventions
- Components: PascalCase, one component per file, in `src/components/`
- Hooks: `useX` naming, in `src/hooks/`
- Prefer functional components and React hooks; no class components
- Keep components small and single-purpose
- Use TypeScript types/interfaces for all props — no `any`

## Commit Style
- Follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, etc.)
- One logical change per commit

## AI Assistant Guidelines
- When generating code, follow the folder structure and naming conventions above
- Prefer editing existing files over creating new ones unless a new module is clearly needed
- Flag any assumptions made when requirements are ambiguous
- Do not add new dependencies without calling it out explicitly

## Rules learned from FE-04
- Forms use `react-hook-form` + `zod` for validation — never hand-rolled
  `useState` string checks or uncontrolled inputs with no schema.
- Every form input needs an explicit `<label htmlFor>` tied to its `id`.
  Placeholder text alone does not satisfy this.
- Event handler and callback parameters must be explicitly typed — never
  `any`, implicit or explicit, even in quick scaffolding.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
