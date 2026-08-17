# Assignment Submission: React App Development with AI

This document contains the submission details for the **Frontend AI Engineering Track (Week 3 Assignment)**.

---

## 1. The Completed Application: FlyMovie

**FlyMovie** is a premium, cinematic-grade Movie Discovery and Management web application built with Next.js (App Router), React, TypeScript, and Tailwind CSS. It is structured using the **MVVM (Model-View-ViewModel)** architectural pattern to cleanly separate concerns.

### Key Features:
- **Hero Spotlight Banner**: An immersive widescreen banner displaying the top-rated movie with high-resolution backdrop overlays, title, genres, and a "Play Trailer" trigger.
- **Dynamic Category Discovery Grid**: A robust movie discovery panel with live keyboard-friendly search, genre-filtering pills, rating selectors, and sorting criteria. Includes animated skeleton loading screens.
- **Watchlist & Favorites persistent state**: Custom ViewModel hooks coordinate additions and removals, persisted locally via `localStorage` to survive page reloads.
- **Interactive Details Drawer**: A gorgeous overlay modal fetching detailed cast lists (actors' names, characters, avatars), formats runtime, loads YouTube trailer keys, and computes local genre-matching recommendations.
- **Overlay Trailer Player**: A responsive, full-screen YouTube embedded trailer overlay that responds to Escape-key closure.
- **Profile & Live TMDB API Config**: A Settings form using `react-hook-form` + `zod` validation allowing users to choose an avatar seed, change their display name, and supply their own TMDB API key.
  - *Hybrid Mode*: If no API key is supplied, the app functions instantly using a preloaded mock database of 12 blockbuster movies. If a valid TMDB key is provided, the service dynamically requests live trending, searching, credits, and trailers directly from TMDB API!

---

## 2. Prompts Used During Development

Here are the precise, context-aware prompts used to build the application iteratively:

### Prompt 1: Project Types Setup
> "Let's create the TypeScript interfaces for our application domain in `src/types/movie.ts`. We need definitions for a `Cast` member (id, name, character, profilePath), a `Movie` (id, title, overview, posterPath, backdropPath, releaseDate, rating, genres, runtime, trailerUrl, director, cast), a `UserSettings` interface (displayName, avatarUrl, tmdbApiKey, notificationsEnabled), and a `FilterState` interface (searchQuery, selectedGenre, minRating, sortBy)."

### Prompt 2: Data Service Layer (Model)
> "Create a data service layer in `src/components/movieService.ts` (or `src/services/movieService.ts`). It should export functions `getMovies(filters, apiKey)` and `getMovieDetails(id, apiKey)`. Populate it with a high-quality mock database of 12 classic movies with full details (actors, description, runtime, backdrop/poster URLs, and YouTube trailer IDs). If a TMDB API key is provided, dynamically fetch live results from TMDB endpoints (search, popular, credits, videos) and map them to our types. Make sure no 'any' types are used in mapping."

### Prompt 3: Custom State Hooks (ViewModel)
> "Let's write our ViewModel hooks:
> 1. `useWatchlist`: Handles lists of watchlisted and favorited movie IDs, saving/loading them to `localStorage` safely without SSR hydration mismatches.
> 2. `useSettings`: Persists user configuration (DisplayName, Avatar, TMDB key) in `localStorage`.
> 3. `useMovies`: Coordinates filtering/searching criteria state, fetches results from `movieService` based on filters and settings, and exposes loading and error states."

### Prompt 4: View Components (Views)
> "Now let's build the React views using Tailwind CSS. We need:
> 1. A glassmorphic `Navbar` with navigation tabs and a user profile button.
> 2. A widescreen `Hero` spotlight for a featured movie.
> 3. A responsive `MovieCard` with hover scale zoom effects, rating badges, and quick save buttons.
> 4. A `MovieGrid` containing a search input, genre selection pills, rating thresholds, and sorting select.
> 5. A `MovieDetailsModal` showing full movie descriptions, formatted runtime, cast members, and recommended movies.
> 6. A `SettingsModal` that integrates `react-hook-form` + `zod` for display name length validation, avatar selection, and TMDB key format checks, using explicit `<label htmlFor>` inputs."

---

## 3. How AI Assisted Throughout the Implementation

The AI served as an active pair programmer, accelerating the development lifecycle in the following ways:
1. **Scaffolding and Setup**: Scaffolded all ViewModel hooks and Tailwind layout structures, reducing boilerplate code.
2. **Drafting Mock Assets**: Autocompleted a rich dataset of 12 real movies with correct poster paths, runtime minutes, and actual YouTube trailer keys, saving hours of manual data entry.
3. **Form Integration**: Generated the boilerplate hook integrations between `react-hook-form` and `zod` resolver schemas, ensuring accurate form error handling.
4. **Tailwind Styling**: Provided modern design system classes (glassmorphism overlays, flex alignments, animations) to achieve a high-fidelity visual aesthetic.

---

## 4. Examples of Manual Improvements, Corrections, and Refactoring

Following the "human-in-the-loop" approach, we audited the AI-generated code and performed several corrections and optimizations to ensure production readiness:

### A. Fixing SSR Hydration Mismatch & Synchronous State Effects
*   **Issue**: Initial drafts of `useSettings` and `useWatchlist` read from `localStorage` synchronously during initial render inside `useEffect`. This triggered cascading re-render linter errors (`react-hooks/set-state-in-effect`) and caused Next.js server-to-client hydration mismatches.
*   **Correction**: Refactored the `useEffect` blocks to load local storage data asynchronously inside a `setTimeout` block, returning a cancellation cleanup function:
    ```typescript
    useEffect(() => {
      if (typeof window !== "undefined") {
        const timer = setTimeout(() => {
          try {
            const stored = localStorage.getItem("flymovie_settings");
            if (stored) setSettings(JSON.parse(stored));
          } catch (e) {
            console.error(e);
          } finally {
            setIsLoaded(true);
          }
        }, 0);
        return () => clearTimeout(timer);
      }
    }, []);
    ```

### B. Eliminating `any` Types for TMDB Responses
*   **Issue**: The generated code used `any` in TMDB mapping callbacks, e.g., `rawMovies.map((m: any) => ...)` and `(v: any) => v.site === "YouTube"`, violating our repository guidelines (`CLAUDE.md`) and risking runtime crashes.
*   **Correction**: Created detailed TypeScript interfaces matching TMDB's API shapes and typed the results:
    ```typescript
    interface TmdbMovieResult {
      id: number;
      title: string;
      overview: string;
      poster_path: string | null;
      backdrop_path: string | null;
      release_date: string;
      vote_average: number;
      genre_ids: number[];
    }
    
    const rawMovies: TmdbMovieResult[] = data.results || [];
    let movies: Movie[] = rawMovies.map((m: TmdbMovieResult) => ({ ... }));
    ```

### C. Resolving React Testing state update warnings
*   **Issue**: Running `vitest` unit tests flagged warnings: `An update to TestComponent inside a test was not wrapped in act(...)` because state updates from `useWatchlist`'s local storage load occurred inside the deferred timeout.
*   **Correction**: Wrapped the wait period inside `act` in the test file:
    ```diff
    - await new Promise((resolve) => setTimeout(resolve, 10));
    + await act(async () => {
    +   await new Promise((resolve) => setTimeout(resolve, 10));
    + });
    ```

### D. Fixing General Code Smells
*   **Issue**: Linter flagged variable reassignments that were never modified (e.g. `let genreMap` in `movieService`), and unused icons in import declarations.
*   **Correction**: Changed `let genreMap` to `const` and removed unused lucide imports (`Film` in `page.tsx`, `Plus` and `Check` in `MovieCard.tsx`, and `Eye` in `MovieDetailsModal.tsx`).
