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