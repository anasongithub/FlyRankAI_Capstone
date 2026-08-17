# FlyMovie — AI-Powered Movie Discovery (Capstone Skeleton)

> A premium, cinematic-grade Movie Discovery and Management web application built with Next.js (App Router), React, TypeScript, and Tailwind CSS.

This is the Capstone project for the **Frontend AI Engineering** track. The application leverages the **MVVM (Model-View-ViewModel)** architectural pattern to cleanly separate concerns and is designed from day one to support AI-assisted recommendations.

---

## 🚀 Live Preview URL
The skeleton is deployed on Vercel:
*   **Live Preview**: *(Link your Vercel/Netlify preview deployment URL here)*
*   **Health Dashboard**: `/health` (renders status from the internal `/api/health` API and fetches live movies from an external public API)

---

## 📁 Repository Structure & Routes

This skeleton implements a complete routed shell. Every page specified in the application requirements is represented as a placeholder screen:

*   **Discover Home** (`/`) — Main movie discovery page featuring a Hero Spotlight banner, search bar, genre pills, sorting select, rating thresholds, and movie cards with hover actions.
*   **Watchlist** (`/watchlist`) — Shows saved bookmarks loaded dynamically from browser `localStorage`.
*   **Favorites** (`/favorites`) — Shows liked movies loaded from `localStorage`.
*   **AI Assistant** (`/ai`) — Server Component placeholder highlighting future Claude AI integration, mood-based recommendations, and semantic search.
*   **Movie Details** (`/movie/[id]`) — Dynamic route page demonstrating URL segment resolution for specific films.
*   **Settings** (`/settings`) — Client-side settings panel utilizing `react-hook-form` and `zod` schema resolvers to configure displayName, custom avatar seeding, and TMDB API keys.
*   **System Health Check** (`/health`) — Live status dashboard illustrating parallel Server Component fetch requests.
*   **Health API** (`/api/health`) — JSON endpoint detailing app environment, process uptime, and configuration detection.

---

## 🛠️ Tech Stack & Design Tokens

*   **Framework**: Next.js 16 (App Router)
*   **Styling**: Tailwind CSS & Vanilla CSS Design Tokens (Custom fonts, custom dark-mode surface palette, pulse/shimmer/bounce animations in `src/app/globals.css`)
*   **Form Management**: `react-hook-form` + `zod` validation schema
*   **Icons**: `lucide-react`
*   **Testing**: Vitest + `@testing-library/react`

---

## ⚙️ Environment Variables Configuration

To run the application locally or on your hosting provider, copy `.env.example` to `.env.local` and configure your API keys:

```bash
# TMDB API (Optional - falls back to rich Unsplash database)
TMDB_API_KEY=your_tmdb_key_here

# Anthropic / Claude API (Required for the /ai route in Phase 2)
ANTHROPIC_API_KEY=your_anthropic_key_here

# Local app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

*Note: No secrets or actual keys are committed to this repository.*

---

## 🏃 Local Development

1.  **Clone the repository and checkout the capstone branch**:
    ```bash
    git clone https://github.com/anasongithub/FlyRankAI_Capstone.git
    cd FlyRankAI_Capstone
    git checkout capstone
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run unit tests**:
    ```bash
    npm run test
    ```

4.  **Run development server**:
    ```bash
    npm run dev
    ```

5.  **Build production package**:
    ```bash
    npm run build
    ```

---

## 🔍 Verification & Health Check

The app features a built-in health check system:
*   The `/api/health` endpoint verifies memory status, Node process environment, and detects the presence of API keys safely.
*   The `/health` page acts as an integration check by executing a live parallel fetch to `https://freetestapi.com/api/v1/movies` to verify third-party HTTP requests work correctly from Server Components.