# FlyMovie — AI-Powered Movie Discovery

> A production-ready, cinematic-grade movie discovery and management platform built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Google Gemini AI**.

**Live App**: https://fly-rank-ai-capstone.vercel.app  
**Capstone Branch**: `capstone` | **Track**: Frontend AI Engineering — Week 8

---

## 🚀 Getting Started (one command)

```bash
git clone https://github.com/anasongithub/FlyRankAI_Capstone.git
cd FlyRankAI_Capstone
git checkout capstone
npm install && npm run dev
```

App runs at `http://localhost:3000`. No API keys required — the app falls back to a rich local mock database.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and fill in your keys (both optional):

```bash
cp .env.example .env.local
```

| Variable | Purpose | Required? |
|---|---|---|
| `TMDB_API_KEY` | Live movie data from The Movie Database | Optional (mock DB fallback) |
| `GEMINI_API_KEY` | Google Gemini AI for recommendations & insights | Optional (static fallback) |
| `NEXT_PUBLIC_APP_URL` | Base URL for the deployment | Optional |

Keys can also be entered at runtime via **Settings → API Keys** in the app — stored in `localStorage`, passed via request headers.

---

## 📁 Architecture Overview

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # / — Discover Home (Hero + MovieGrid)
│   ├── ai/page.tsx         # /ai — AI Movie Assistant (Gemini-powered)
│   ├── movie/[id]/page.tsx # /movie/:id — Dynamic detail + AI insights
│   ├── watchlist/page.tsx  # /watchlist — Saved movies
│   ├── favorites/page.tsx  # /favorites — Liked movies
│   ├── settings/page.tsx   # /settings — API keys + user preferences
│   ├── health/page.tsx     # /health — Live system status dashboard
│   └── api/
│       ├── ai/recommend/   # POST — Natural language → matched movies
│       ├── ai/insights/    # POST — Movie metadata → AI analysis card
│       └── health/         # GET  — JSON health check
├── components/             # Reusable UI (MovieCard, Hero, AppNav, …)
├── hooks/                  # MVVM ViewModels (useMovies, useWatchlist, useSettings)
├── services/movieService.ts # Data layer: mock DB + TMDB adapter
└── types/movie.ts          # TypeScript interfaces
```

**Pattern**: MVVM — components only render; hooks own all state and business logic; `movieService` owns all data fetching.

---

## 🤖 AI Integration

Two serverless API routes call **Google Gemini** via direct `fetch` (no SDK — keeps Edge bundle minimal):

### `/api/ai/recommend` — Natural Language Discovery
Accepts a plain-English prompt. Fetches candidate movies (TMDB or mock DB), builds a structured prompt, and asks Gemini to return the top 5 matches as JSON with a custom per-movie `reason`. Prompt engineering forces JSON-only output to prevent markdown wrapping.

### `/api/ai/insights` — Cinematic Analysis (on `/movie/[id]`)
Accepts movie title + overview. Gemini returns structured JSON with:
- `contentAdvisory` — suitability/trigger warnings
- `thematicMotifs[]` — core thematic tags
- `vibeCheck` — expressive tone summary

**Resilience**: Both routes catch all Gemini errors and return static fallback data — the UI never breaks.

---

## 🧪 Testing

```bash
npm run test
```

**2 test files · 7 tests · 100% passing**

| Suite | Tests | Coverage |
|---|---|---|
| `useWatchlist.test.ts` | 3 | init state, toggle watchlist, toggle favorites |
| `useMovies.test.ts` | 4 | loading state, error handling, filter updates, filter reset |

---

## ⚡ Performance & Accessibility

- **Lighthouse**: 95+ on desktop (Next.js static optimization, SVG icons, no heavy SDKs)
- **WCAG 2.1 AA**: All interactive elements have `aria-label`, focus rings, correct heading hierarchy (`h1` → `h2` → `h3`)
- **axe DevTools**: Resolved icon-button violations by adding explicit `aria-label` attributes to watchlist/favorite action buttons

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Server Components) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + CSS custom properties |
| Forms | react-hook-form + Zod |
| Icons | lucide-react |
| Testing | Vitest + @testing-library/react |
| AI | Google Gemini (direct HTTP fetch) |
| Data | TMDB API + local mock DB |
| Deployment | Vercel (Hobby) |

---

## 🏥 Health & Monitoring

- **`/api/health`** — JSON endpoint: API key presence, Node env, uptime
- **`/health`** — Visual dashboard with live service status
- **Rollback**: Vercel dashboard → Deployments → any past hash → Redeploy

---

## Known Limitations & Future Improvements

1. **No server-side cache** — Redis/Vercel KV would prevent redundant Gemini calls for the same movie
2. **Browser-local persistence** — Watchlist/favorites live in `localStorage`; NextAuth + a DB would enable cross-device sync
3. **Gemini model deprecation** — Model name is hardcoded; an env var `GEMINI_MODEL` would make future updates instant