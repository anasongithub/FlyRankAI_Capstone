# FlyRank AI — Frontend Engineering Internship Context

**Intern**: Muhammad Anas (GitHub: @anasongithub)  
**Track**: Frontend AI Engineering  
**Repo**: https://github.com/anasongithub/FlyRankAI_Capstone  
**Live App**: https://fly-rank-ai-capstone.vercel.app  
**Stack**: Next.js 16 (App Router) · TypeScript · Tailwind CSS · Vitest · Google Gemini API · TMDB API

---

## Branch Structure

| Branch | Purpose |
|---|---|
| `main` | Clean Next.js scaffold |
| `round-1-vague` | Week 1/2 — vague prompt experiment |
| `round-2-precise` | Week 1/2 — precise prompt experiment |
| `week-3` | Week 3 standalone assignment (FlyMovie v1) |
| `capstone` | Active production branch |

---

## Week 3 Assignment — React App Development with AI

**Goal**: Build a React app independently using AI as a coding assistant.  
**Built**: FlyMovie v1 — cinematic movie discovery app.

### Architecture (MVVM)
- **Model**: `src/types/movie.ts`, `src/services/movieService.ts`
- **ViewModel Hooks**: `useMovies`, `useWatchlist`, `useSettings` (localStorage)
- **Views**: Navbar, Hero, MovieCard, MovieGrid, MovieDetailsModal, SettingsModal, TrailerModal

### Key Features
- Hero Spotlight + search, genre filter, rating, sort
- Watchlist + Favorites (localStorage persisted)
- YouTube trailer modal
- Hybrid: mock DB (12 movies, Unsplash images) OR live TMDB API
- react-hook-form + Zod validation for settings

### Tests
- Vitest unit tests for `useWatchlist` hook — 3/3 passing

---

## Capstone Skeleton (FE-04)

**Goal**: Scaffold all routes, navigation, design system, deploy to Vercel.

### Routes Added
- `/`, `/watchlist`, `/favorites`, `/ai`, `/movie/[id]`, `/settings`, `/health`
- `/api/health` — JSON health check endpoint

### Other Work
- AppNav shared header with active-route highlighting
- CSS design system tokens + Inter font + micro-animations
- Security audit: zero secrets/placeholders in any tracked file
- Vercel connected to `capstone` branch

---

## Capstone Complete (Week 8)

**Goal**: Production-ready AI-enhanced frontend application.

### AI Routes (Google Gemini 3.6 Flash via direct HTTP)
- **`/api/ai/recommend`**: Natural language → top 5 matched movies with per-movie reasons
- **`/api/ai/insights`**: Movie metadata → contentAdvisory, thematicMotifs[], vibeCheck

### New Pages / Components
- `/ai/page.tsx` — Interactive AI Movie Assistant (prompt chips + search)
- `/movie/[id]/page.tsx` — Server Component with server-side Gemini analysis + 24h cache
- `MovieDetailsActions.tsx` — Client Component for trailer/watchlist/favorite actions
- `PORTFOLIO.md` — Capstone submission document

### Settings Upgrade
- `geminiApiKey` in UserSettings interface, hook, and form
- Keys sent via request headers (never logged or exposed)

### Security
- Zero hardcoded secrets in repo
- `.env.example` has empty placeholders only

### Known Limitations
- No server-side cache (Redis would prevent redundant Gemini calls)
- Watchlist/favorites are browser-local (no auth/backend)
- Gemini model names deprecate frequently — env var would be cleaner

---

## Deployment
- **Platform**: Vercel Hobby (free)
- **Production branch**: `capstone`
- **Env vars**: `TMDB_API_KEY`, `GEMINI_API_KEY`, `NEXT_PUBLIC_APP_URL`
- **Health check**: https://fly-rank-ai-capstone.vercel.app/api/health
