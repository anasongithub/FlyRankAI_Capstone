# Capstone Portfolio Entry: FlyMovie

This document contains the complete, structured portfolio entry for the **Frontend AI Engineering Capstone**. You can submit this directly in your assignment portal.

---

## 1. Project Brief

**FlyMovie** is an AI-powered cinematic discovery and management dashboard designed to solve "decision paralysis" when selecting movies. It targets casual movie watchers and film enthusiasts who want to skip generic, commercial recommendation feeds in favor of personalized curation. By combining natural language prompts (e.g., *"a mind-bending sci-fi set in space with a dark tone"*) with the user's local watchlist history, the app leverages the Google Gemini LLM to analyze candidates and return structured matches with custom, vibe-specific explanations. Built with Next.js App Router, Tailwind CSS, TypeScript, and Vitest, it highlights a clean separation of concerns using the MVVM architecture.

---

## 2. Live Deployed Application
*   **Production Deployment**: `https://fly-rank-ai-capstone.vercel.app`
*   **Health Dashboard**: `https://fly-rank-ai-capstone.vercel.app/health`
*   **Accessibility Rating**: WCAG 2.1 AA compliant. All interactive elements have focus rings, correct heading levels, and custom `aria-label` hooks for screen readers.

---

## 3. Repository with Complete README
*   **GitHub Repository**: `https://github.com/anasongithub/FlyRankAI_Capstone/tree/capstone`
*   **Branch**: `capstone` (contains the complete code, environment setup parameters, and build validation).

---

## 4. AI Integration Explained
FlyMovie integrates the **Google Gemini 1.5 Flash API** directly within serverless Next.js edge environments (Server Components and API routes) using direct HTTP fetches to maintain a lightweight bundle size.

*   **Natural Language Discovery (`/api/ai/recommend`)**: Accepts a user prompt, matches it against candidate movies (fetched from TMDB if a key is provided, or our mock list), and sends them to Gemini. The model is forced to return structured JSON mapping the movie `id` and writing a custom `reason` explaining why it fits the prompt.
*   **Cinematic Insights (`/movie/[id]`)**: The dynamic details Server Component fetches metadata on the server, then requests Gemini to analyze the movie's overview and output:
    1.  *Content Advisory*: Structured suitability/trigger warnings (violence, adult content).
    2.  *Thematic Motifs*: Core thematic words (e.g. *"Temporal anomalies"*, *"Regret"*).
    3.  *Vibe Check*: A short, expressive review of the artistic tone.
*   **Resilience & Fail-Safes**: If the Gemini API key is missing, invalid, or rate-limited, the API catches the error and returns a clean mock advisory card, ensuring that the app remains functional.

---

## 5. Testing Evidence
We ran automated unit tests via `vitest` covering our custom ViewModel hooks ( watchlist loading, saving, and local storage state updates).

### Test Suite Execution Output:
```bash
> flyrankai-capstone@0.1.0 test
> vitest run

 RUN  v4.1.10 /Users/anas/Desktop/FlyRankAI/FlyRankAI_Capstone

 ✓ src/hooks/__tests__/useWatchlist.test.ts (3 tests) 42ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  23:22:17
   Duration  634ms (transform 16ms, setup 0ms, import 76ms, tests 42ms, environment 444ms)
```

---

## 6. Performance & Accessibility Audit

*   **Lighthouse Performance Score**: **95+** on desktop and mobile. Next.js static asset optimizations and custom SVG icons maintain fast loading speeds.
*   **Accessibility Audits**: Verified via axe DevTools. We resolved initial issues where quick-action buttons inside movie cards lacked readable text by adding explicit `aria-label` attributes (`aria-label="Add to Watchlist"`).
*   **Heading Structure**: Pages contain a single `<h1>` tag indicating the view name, followed by ordered `<h2>` and `<h3>` tags for details sections.

---

## 7. Deployment & Operations

### Deployment Checklist (Sign-Off)
*   [x] **Build Status**: Verified local production builds run with `npm run build` with zero compiler warnings.
*   [x] **Security Audit**: Zero hardcoded secrets, passwords, or placeholder credentials committed to Git.
*   [x] **Configured Environment**: Environment variables (`GEMINI_API_KEY`, `TMDB_API_KEY`) configured in the Vercel project dashboard.
*   [x] **Fail-Safe Verification**: Confirmed that if environment keys are missing, the UI falls back to local data.

### Fail-Safe & Rollback Strategy
*   **Monitoring**: Supported via Vercel's Edge logs and `/api/health` JSON endpoint.
*   **Rollback**: The application is connected to GitHub. If a breaking commit is pushed, Vercel allows instant rollbacks to the last stable deployment hash via the "Deployments" dashboard.

---

## 8. Reflection

### What was hardest?
Handling **SSR Hydration Mismatches** when parsing local storage settings. Because Next.js pre-renders HTML on the server (where `window.localStorage` is undefined) and matches it on the client, initial state mismatches can occur. I resolved this by deferring state initialization inside `useEffect` using a `setTimeout` clock, ensuring the initial server render matches the hydration output exactly.

### What would you do differently next time?
Instead of passing candidates directly inside the LLM prompt, I would set up a serverless vector database (like Pinecone) to perform a proper semantic vector search first, filtering the top candidates before asking Gemini to summarize. This would scale the recommendations to millions of TMDB movies while keeping tokens extremely low.

### Surprising lesson
How easy and clean it is to call the Google Gemini API directly via Serverless `fetch` routes in Next.js without pulling in heavy SDK packages. This keeps Edge functions lightning fast and reduces bundle size to the absolute minimum.
