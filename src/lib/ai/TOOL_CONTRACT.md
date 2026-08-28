# AI Tool Contract & Schema Specifications (FE-07)

**Module**: `src/lib/ai/tools.ts`  
**Framework**: Next.js 16 · TypeScript · Zod  
**AI Persona**: CineBot (Cinematic Consultant & Generative UI Engine)

---

## 1. Tool: `fetchMovieDeepDive`

### Description
Queries the film catalog and computes comprehensive cinematographic metrics, visual signatures, and box office telemetry.

### Input Schema (Zod)
```typescript
export const FetchMovieDeepDiveSchema = z.object({
  movieTitle: z.string().describe("The exact title of the film to analyze (e.g. 'Inception', 'Blade Runner 2049')"),
  releaseYear: z.number().optional().describe("Optional release year to disambiguate films with identical titles"),
  detailType: z.enum(["full", "cinematography", "themes", "boxoffice"]).default("full").describe("Depth of analysis requested"),
});
```

### Return Shape (JSON)
```typescript
export interface MovieDeepDiveResult {
  id: number;
  title: string;
  year: number;
  rating: number;
  genres: string[];
  director: string;
  cinematographer: string;
  visualStyle: string;
  pacingScore: number;         // 0 - 100
  thematicDepthScore: number;  // 0 - 100
  rewatchabilityScore: number; // 0 - 100
  boxOffice: {
    budget: string;
    worldwideGross: string;
    status: string;
  };
  keyThemes: string[];
  overview: string;
  posterPath: string;
}
```

### Rendered Component
Rendered as `<MovieDeepDiveCard />` featuring:
- Visual score bars for Pacing, Thematic Depth, and Rewatch Value.
- Cinematographer & Director attribution badges.
- One-click "Save to Watchlist" interactive trigger.

---

## 2. Tool: `compareFilms`

### Description
Generates comparative, side-by-side metric analytics between two candidate films for head-to-head evaluation.

### Input Schema (Zod)
```typescript
export const CompareFilmsSchema = z.object({
  filmA: z.string().describe("Title of the first film to compare"),
  filmB: z.string().describe("Title of the second film to compare"),
});
```

### Return Shape (JSON)
```typescript
export interface FilmComparisonResult {
  filmA: {
    title: string;
    year: number;
    rating: number;
    visualSpectacle: number;      // 0 - 10
    narrativeComplexity: number;  // 0 - 10
    emotionalResonance: number;   // 0 - 10
    pacingSpeed: number;          // 0 - 10
    posterPath: string;
  };
  filmB: {
    title: string;
    year: number;
    rating: number;
    visualSpectacle: number;      // 0 - 10
    narrativeComplexity: number;  // 0 - 10
    emotionalResonance: number;   // 0 - 10
    pacingSpeed: number;          // 0 - 10
    posterPath: string;
  };
  verdict: string;
  recommendedFor: {
    filmA: string;
    filmB: string;
  };
}
```

### Rendered Component
Rendered as `<FilmComparisonChart />` featuring:
- Dual comparative SVG/progress metric meters.
- Critical verdict synthesis.
- Recommendation decision split for viewers.

---

## 3. Tool: `quickAddToWatchlist` (User Action Tool)

### Description
Direct user interaction tool allowing the AI assistant to recommend saving a specific movie with a confirmation button.

### Input Schema (Zod)
```typescript
export const QuickAddToWatchlistSchema = z.object({
  movieId: z.number().describe("The ID of the movie to add"),
  movieTitle: z.string().describe("The title of the movie"),
  reason: z.string().describe("Why the user should watch this film"),
  posterPath: z.string().optional().describe("Poster image URL"),
});
```

### Rendered Component
Rendered as `<WatchlistActionWidget />` with immediate local storage synchronization.

---

## 4. The Four Tool Lifecycle States

| State | Visual Treatment | Transition |
|---|---|---|
| `input-streaming` | Violet pulsing badge with spinner indicating parameter formulation | Crossfades to `input-available` |
| `input-available` | Indigo badge displaying tool name and parsed parameters | Crossfades to output |
| `output-available` | High-fidelity Generative UI Component (`MovieDeepDiveCard` or `FilmComparisonChart`) | Morph with 200ms ease-out |
| `output-error` | Rose alert card with error diagnosis and one-click "Retry Query" action | Graceful error state (no app crash) |
