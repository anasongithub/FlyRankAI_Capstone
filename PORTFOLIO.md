# Capstone Portfolio Entry: FlyMovie

> Submit this document (or paste its contents) alongside your GitHub and Vercel links.

---

## 1. Project Brief

**FlyMovie** is an AI-powered cinematic discovery and management dashboard that solves "decision paralysis" when selecting movies. Targeting casual watchers and film enthusiasts, it replaces generic recommendation feeds with a natural-language interface powered by Google Gemini — users describe what they're in the mood for (*"a mind-bending sci-fi with a dark tone"*) and receive curated matches with custom, vibe-specific explanations. Built with Next.js App Router, TypeScript, and Vitest on an MVVM architecture, it demonstrates how a small, complete, production-shipped AI application should look.

---

## 2. Live Deployed Application

- **Production URL**: https://fly-rank-ai-capstone.vercel.app
- **AI Assistant**: https://fly-rank-ai-capstone.vercel.app/ai
- **Health Dashboard**: https://fly-rank-ai-capstone.vercel.app/health
- **Health API**: https://fly-rank-ai-capstone.vercel.app/api/health

**Accessibility**: WCAG 2.1 AA compliant — all interactive elements carry `aria-label`, correct focus rings, and a single `<h1>` per page with ordered heading hierarchy.

---

## 3. Repository with Complete README

- **GitHub**: https://github.com/anasongithub/FlyRankAI_Capstone/tree/capstone
- **Branch**: `capstone`
- **One-command setup**: `git clone … && git checkout capstone && npm install && npm run dev`
- README covers: setup instructions, architecture overview, AI integration explanation, known limitations, tech stack, and health/monitoring details.

---

## 4. AI Integration Explained

FlyMovie integrates the **Google Gemini 3.6 Flash API** in two places via direct HTTP `fetch` in Next.js serverless routes (no SDK — keeps Edge bundle minimal and cold starts fast).

### `/api/ai/recommend` — Natural Language Discovery
- **Input**: Plain-English prompt from the user
- **Process**: Fetches candidate movies (TMDB or local mock DB), serializes them into a Gemini prompt that instructs the model to act as a film critic and return structured JSON only
- **Output**: Top 5 matches with `id` + custom `reason` per movie explaining the thematic fit
- **Prompt strategy**: System instruction forbids markdown wrapping and enforces `{ "recommendations": [...] }` schema to make output deterministic

### `/movie/[id]` — Cinematic Insights (Server Component)
- **Input**: Movie title + overview + genres
- **Output**: `{ contentAdvisory, thematicMotifs[], vibeCheck }` — analysis cached 24h via `next: { revalidate: 86400 }`
- **Why it's not a gimmick**: Replaces 5 minutes of manual research (reading reviews, checking suitability, identifying themes) with a 2-second server-side call rendered before the page is sent to the browser

### Resilience
Both routes are wrapped in try/catch. If the API key is missing, invalid, or rate-limited, a clean static fallback card is returned — the UI never crashes.

---

## 5. Testing Evidence

```bash
npm run test
```

```
 RUN  v4.1.10

 ✓ src/hooks/__tests__/useWatchlist.test.ts > useWatchlist Hook > should initialize with empty watchlist and favorites 17ms
 ✓ src/hooks/__tests__/useWatchlist.test.ts > useWatchlist Hook > should toggle items in and out of the watchlist 13ms
 ✓ src/hooks/__tests__/useWatchlist.test.ts > useWatchlist Hook > should toggle items in and out of favorites 12ms
 ✓ src/hooks/__tests__/useMovies.test.ts > useMovies Hook > should start in loading state and load movies on mount 59ms
 ✓ src/hooks/__tests__/useMovies.test.ts > useMovies Hook > should set error state when the movie service throws 53ms
 ✓ src/hooks/__tests__/useMovies.test.ts > useMovies Hook > should update filters and reload movies 55ms
 ✓ src/hooks/__tests__/useMovies.test.ts > useMovies Hook > should reset filters to defaults 54ms

 Test Files  2 passed (2)
      Tests  7 passed (7)
   Duration  782ms
```

**Coverage**: 2 of 3 ViewModel hooks fully tested (67% hook coverage). Tests cover: initial state, localStorage persistence, toggle logic, async loading, error propagation, filter mutation, and filter reset.

---

## 6. Performance & Accessibility Audit

### Performance
- **Lighthouse Score**: **95+** desktop / **90+** mobile
- Next.js automatically: code-splits per route, serves optimized images via `next/image`, and pre-renders static pages at build time
- No heavy AI SDK bundled — Gemini called via native `fetch` from serverless functions only

### Accessibility
- **Tool used**: axe DevTools browser extension
- **Initial issue found**: Icon-only action buttons (Watchlist ➕, Favorite ❤️) on movie cards lacked accessible names — axe flagged them as `"button-name"` violations
- **Fix applied**: Added `aria-label="Add to Watchlist"` and `aria-label="Add to Favorites"` to all icon buttons in `MovieCard.tsx`
- **Result**: Zero WCAG AA violations on re-audit
- **Heading structure**: Single `<h1>` per page; `<h2>` for section headers; `<h3>` for detail labels

---

## 7. Deployment & Operations

### Deployment Checklist ✅

| Check | Status |
|---|---|
| Production build passes (`npm run build`) | ✅ Zero errors, zero warnings |
| All routes render correctly | ✅ Verified on production URL |
| Zero secrets committed to Git | ✅ Security audit passed — `.env.local` is gitignored |
| Environment variables configured in Vercel | ✅ `GEMINI_API_KEY`, `TMDB_API_KEY`, `NEXT_PUBLIC_APP_URL` set for all environments |
| Fallback behavior verified (keys removed) | ✅ App returns static mock data gracefully |
| Health check endpoint live | ✅ `/api/health` returns `{ status: "ok" }` |
| Tests pass on clean install | ✅ 7/7 |
| Accessibility audit clean | ✅ Zero axe violations after fix |

### How It Fails Safely
- **Missing API keys**: Both AI routes return pre-written fallback content — no error shown to user
- **TMDB down**: Falls back to mock DB of 12 curated films with Unsplash posters
- **Gemini rate limit**: Caught in try/catch, fallback insights card rendered instead

### Rollback Plan
Vercel tracks every deployment by Git commit hash. To rollback:
1. Go to Vercel Dashboard → Deployments
2. Find the last stable deployment
3. Click **⋯ → Redeploy** → confirm

Monitoring: `/api/health` endpoint + Vercel Edge Logs in the dashboard.

---

## 8. Reflection

### What was hardest?
Handling **SSR hydration mismatches** from `localStorage`. Next.js pre-renders HTML on the server (where `window.localStorage` is `undefined`), and if the client's initial render differs, React throws a hydration error. The fix was deferring all localStorage reads inside `useEffect` with a `setTimeout(..., 0)` to guarantee the first render is always identical between server and client.

### What would I do differently next time?
Instead of passing all candidate movies inside the Gemini prompt, I would integrate a vector database (Pinecone or Vercel KV) to do semantic similarity search first, passing only the top 10 semantically closest movies to Gemini. This would scale to millions of movies while keeping token usage and latency minimal.

### One thing that surprised me
How fast and clean it is to call Google Gemini via native `fetch` directly in a Next.js Server Component — no SDK, no client-side exposure, no bundle overhead. The simplicity of a structured JSON prompt with a `responseMimeType: "application/json"` flag is genuinely powerful for production use cases.
