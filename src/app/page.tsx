"use client";

import React, { useState } from "react";
import Hero from "../components/Hero";
import MovieGrid from "../components/MovieGrid";
import MovieDetailsModal from "../components/MovieDetailsModal";
import TrailerModal from "../components/TrailerModal";
import { useMovies } from "../hooks/useMovies";
import { useWatchlist } from "../hooks/useWatchlist";
import { useSettings } from "../hooks/useSettings";
import { getGenres } from "../services/movieService";
import { Movie } from "../types/movie";

export default function DiscoverPage() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeTrailerKey, setActiveTrailerKey] = useState<string | null>(null);

  const { settings, isLoaded: settingsLoaded } = useSettings();
  const {
    isLoaded: watchlistLoaded,
    toggleWatchlist,
    toggleFavorite,
    isInWatchlist,
    isInFavorites,
  } = useWatchlist();

  const { movies, loading, error, filters, setFilters, resetFilters } =
    useMovies(settings.tmdbApiKey);

  const genres = getGenres();
  const isDataReady = settingsLoaded && watchlistLoaded;

  const featuredMovie =
    movies.length > 0
      ? [...movies].sort((a, b) => b.rating - a.rating)[0]
      : null;

  return (
    <div className="flex flex-col pb-8">
      {/* ── Hero Spotlight ─────────────────────────────────────────── */}
      {isDataReady && !loading && featuredMovie && !filters.searchQuery && (
        <Hero
          movie={featuredMovie}
          onOpenDetails={setSelectedMovie}
          onOpenTrailer={setActiveTrailerKey}
          isInWatchlist={isInWatchlist(featuredMovie.id)}
          onToggleWatchlist={() => toggleWatchlist(featuredMovie.id)}
        />
      )}

      {/* ── Discover Grid ──────────────────────────────────────────── */}
      {!isDataReady ? (
        <div className="flex flex-1 items-center justify-center py-40">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
            <p className="text-zinc-500 text-sm font-semibold uppercase tracking-widest animate-pulse">
              Loading…
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center py-40 text-center px-4">
          <div>
            <p className="text-rose-400 font-bold text-lg mb-2">Something went wrong</p>
            <p className="text-zinc-500 text-sm mb-6">{error}</p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <MovieGrid
          movies={movies}
          loading={loading}
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
          genres={genres}
          onOpenDetails={setSelectedMovie}
          onOpenTrailer={setActiveTrailerKey}
          isInWatchlist={isInWatchlist}
          isInFavorites={isInFavorites}
          onToggleWatchlist={toggleWatchlist}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {/* ── Modals ─────────────────────────────────────────────────── */}
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
          allMovies={movies}
          onSelectRecommended={setSelectedMovie}
        />
      )}

      {activeTrailerKey && (
        <TrailerModal
          videoKey={activeTrailerKey}
          onClose={() => setActiveTrailerKey(null)}
        />
      )}
    </div>
  );
}
