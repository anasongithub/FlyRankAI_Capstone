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