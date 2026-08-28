"use client";

import React, { useState } from "react";
import { Cpu, MessageSquare, Sparkles, AlertCircle, ArrowRight, Loader2, Bookmark, Heart, Film } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";
import { useWatchlist } from "../../hooks/useWatchlist";
import { Movie } from "../../types/movie";
import MovieCard from "../../components/MovieCard";
import MovieDetailsModal from "../../components/MovieDetailsModal";
import TrailerModal from "../../components/TrailerModal";
import Link from "next/link";

interface MatchedMovie extends Movie {
  aiReason?: string;
}

const PRESETS = [
  "A mind-bending sci-fi set in space with a dark tone",
  "A heartwarming comfort movie for a rainy Sunday afternoon",
  "Tense psychological thriller with a shocking twist ending",
  "Visually stunning action blockbusters with deep themes",
];

export default function AIPage() {
  const { settings, isLoaded: settingsLoaded } = useSettings();
  const { watchlist, favorites, isInWatchlist, isInFavorites, toggleWatchlist, toggleFavorite } = useWatchlist();
  
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<MatchedMovie[]>([]);

  // Modal triggers
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeTrailerKey, setActiveTrailerKey] = useState<string | null>(null);

  const hasKeys = !!(settings.geminiApiKey || process.env.NEXT_PUBLIC_HAS_GEMINI_ENV);

  const handleRecommend = async (selectedPrompt?: string) => {
    const query = selectedPrompt || prompt;
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    if (selectedPrompt) setPrompt(selectedPrompt);

    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Pass keys in headers securely if set on client
          "x-gemini-key": settings.geminiApiKey || "",
          "x-tmdb-key": settings.tmdbApiKey || "",
        },
        body: JSON.stringify({ prompt: query }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate recommendations");
      }

      setResults(data.recommendations || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while communicating with Gemini.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleRecommend();
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-5 border-b border-zinc-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
          <Cpu className="h-6 w-6 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">AI Movie Assistant</h1>
          <p className="text-zinc-500 text-sm">
            Powered by Google Gemini · Search and discover films in natural language.
          </p>
        </div>
      </div>



      {/* Main input console */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 mb-8 space-y-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-zinc-500 shrink-0" />
          <h2 className="text-sm font-semibold text-zinc-300">Describe what you are looking for...</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
            className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-xl px-5 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none transition"
            placeholder="Describe a mood, theme, style, or specific request (e.g. 'tense detective drama')..."
            aria-label="Natural language movie request prompt"
          />
          <button
            onClick={() => handleRecommend()}
            disabled={loading || !prompt.trim()}
            className="px-6 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-white font-bold text-sm transition shrink-0 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/10"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Find Movies
              </>
            )}
          </button>
        </div>

        {/* Presets */}
        <div className="pt-2">
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5">
            Or select a prompt:
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => !loading && handleRecommend(preset)}
                disabled={loading}
                className="px-3.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-800/40 text-zinc-400 hover:text-zinc-200 text-xs font-medium transition text-left"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Shimmer state */}
      {loading && (
        <div className="space-y-6 flex-1 flex flex-col items-center justify-center py-20">
          <div className="h-10 w-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
          <div className="text-center space-y-1.5">
            <p className="text-white font-bold animate-pulse">Consulting AI critic...</p>
            <p className="text-zinc-500 text-xs max-w-xs leading-normal">
              Gemini is analyzing movie databases to structure matches and write custom reasons...
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-14 w-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
            <AlertCircle className="h-7 w-7 text-rose-500" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Failed to search</h2>
          <p className="text-zinc-500 text-sm max-w-md leading-relaxed">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {results.length === 0 && !loading && !error && (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10 flex-1">
          <div className="h-16 w-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-4 text-zinc-600">
            <Sparkles className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-bold text-zinc-300 mb-1">Your personal recommendations</h2>
          <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
            Enter a description or tap a preset prompt above to generate a list matching your vibe.
          </p>
        </div>
      )}

      {/* Results grid */}
      {results.length > 0 && !loading && !error && (
        <div className="space-y-6 animate-fade-in-up">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
            AI Matches ({results.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((movie) => (
              <div
                key={movie.id}
                className="flex flex-col sm:flex-row bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-700/80 transition duration-300 group"
              >
                {/* Poster column */}
                <div className="w-full sm:w-40 shrink-0 aspect-[2/3] sm:aspect-auto relative bg-zinc-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={movie.posterPath}
                    alt={movie.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent sm:hidden" />
                </div>

                {/* Content details column */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-extrabold text-white text-lg group-hover:text-amber-400 transition cursor-pointer" onClick={() => setSelectedMovie(movie)}>
                          {movie.title}
                        </h4>
                        <p className="text-xs text-zinc-500 font-medium">
                          {movie.releaseDate.split("-")[0]} · ★ {movie.rating.toFixed(1)}
                        </p>
                      </div>

                      {/* Quick toggles */}
                      <div className="flex gap-1 bg-zinc-950/40 p-1 rounded-lg border border-zinc-800">
                        <button
                          onClick={() => toggleWatchlist(movie.id)}
                          className={`p-1.5 rounded transition ${
                            isInWatchlist(movie.id)
                              ? "text-amber-500 bg-amber-500/10"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                          title="Watchlist"
                        >
                          <Bookmark className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleFavorite(movie.id)}
                          className={`p-1.5 rounded transition ${
                            isInFavorites(movie.id)
                              ? "text-rose-500 bg-rose-500/10"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                          title="Favorite"
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* AI analysis tag */}
                    {movie.aiReason && (
                      <div className="p-3.5 rounded-xl bg-violet-500/5 border border-violet-500/10 text-xs text-violet-300 leading-relaxed font-medium">
                        <div className="flex items-center gap-1.5 mb-1.5 font-bold uppercase tracking-wider text-[10px] text-violet-400">
                          <Sparkles className="h-3 w-3" />
                          AI Vibe Match
                        </div>
                        {movie.aiReason}
                      </div>
                    )}

                    <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">
                      {movie.overview}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedMovie(movie)}
                    className="mt-4 w-fit px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Details Modals */}
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onOpenTrailer={setActiveTrailerKey}
          isInWatchlist={isInWatchlist(selectedMovie.id)}
          isInFavorites={isInFavorites(selectedMovie.id)}
          onToggleWatchlist={() => toggleWatchlist(selectedMovie.id)}
          onToggleFavorite={() => toggleFavorite(selectedMovie.id)}
          tmdbApiKey={settings.tmdbApiKey}
          allMovies={results}
          onSelectRecommended={setSelectedMovie}
        />
      )}

      {activeTrailerKey && (
        <TrailerModal videoKey={activeTrailerKey} onClose={() => setActiveTrailerKey(null)} />
      )}
    </div>
  );
}
