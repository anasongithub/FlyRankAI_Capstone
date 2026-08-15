"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MovieGrid from "../components/MovieGrid";
import MovieDetailsModal from "../components/MovieDetailsModal";
import SettingsModal from "../components/SettingsModal";
import TrailerModal from "../components/TrailerModal";
import { useMovies } from "../hooks/useMovies";
import { useWatchlist } from "../hooks/useWatchlist";
import { useSettings } from "../hooks/useSettings";
import { getGenres } from "../services/movieService";
import { Movie } from "../types/movie";
import { Bookmark, Heart } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"discover" | "watchlist" | "favorites">("discover");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeTrailerKey, setActiveTrailerKey] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Custom Viewmodel / State Hooks
  const { settings, saveSettings, isLoaded: settingsLoaded } = useSettings();
  const {
    watchlist,
    favorites,
    isLoaded: watchlistLoaded,
    toggleWatchlist,
    toggleFavorite,
    isInWatchlist,
    isInFavorites,
  } = useWatchlist();

  const {
    movies,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
  } = useMovies(settings.tmdbApiKey);

  // Extract unique genres for filtering
  const genres = getGenres();

  // Filter movies for current tab
  const getTabMovies = () => {
    if (activeTab === "watchlist") {
      return movies.filter((m) => watchlist.includes(m.id));
    }
    if (activeTab === "favorites") {
      return movies.filter((m) => favorites.includes(m.id));
    }
    return movies;
  };

  const displayedMovies = getTabMovies();

  // Select a movie as featured Hero. We pick the highest rated movie in the list
  const getFeaturedMovie = (): Movie | null => {
    if (movies.length === 0) return null;
    return [...movies].sort((a, b) => b.rating - a.rating)[0];
  };

  const featuredMovie = getFeaturedMovie();

  const handleSelectRecommended = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const isDataReady = settingsLoaded && watchlistLoaded;

  return (
    <div className="min-h-screen w-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-black">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userSettings={settings}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pb-16">
        {!isDataReady ? (
          /* Loading app state */
          <div className="flex-1 flex flex-col items-center justify-center py-32">
            <div className="h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-zinc-500 text-sm font-semibold tracking-wider uppercase animate-pulse">
              Loading App Workspace...
            </p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex-1 flex flex-col items-center justify-center py-32 text-center px-4">
            <h3 className="text-xl font-bold text-rose-400 mb-2">Something went wrong</h3>
            <p className="text-zinc-500 text-sm max-w-sm mb-6">{error}</p>
            <button
              onClick={() => resetFilters()}
              className="px-5 py-2.5 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 font-semibold text-sm transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Spotlight Hero Banner (only on Discover Tab and when not searching) */}
            {activeTab === "discover" && !filters.searchQuery && featuredMovie && (
              <Hero
                movie={featuredMovie}
                onOpenDetails={setSelectedMovie}
                onOpenTrailer={setActiveTrailerKey}
                isInWatchlist={isInWatchlist(featuredMovie.id)}
                onToggleWatchlist={() => toggleWatchlist(featuredMovie.id)}
              />
            )}

            {/* Tab Headers */}
            {activeTab !== "discover" && (
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <div className="flex items-center gap-3 border-b border-zinc-800 pb-4 mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                    {activeTab === "watchlist" ? (
                      <Bookmark className="h-6 w-6 text-amber-500" />
                    ) : (
                      <Heart className="h-6 w-6 text-rose-500" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-white capitalize">
                      My {activeTab}
                    </h2>
                    <p className="text-xs text-zinc-500">
                      {displayedMovies.length} {displayedMovies.length === 1 ? "movie" : "movies"} saved
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Movie Collection Grid */}
            <MovieGrid
              movies={displayedMovies}
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
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-zinc-900 bg-zinc-950 text-center text-xs text-zinc-600 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 FlyMovie. Built for FlyRank Frontend AI Engineering track.</p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-zinc-500 font-semibold">AI Assisted Development</span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays Portal */}

      {/* Movie Details Modal */}
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
          onSelectRecommended={handleSelectRecommended}
        />
      )}

      {/* Trailer Overlay Video Player */}
      {activeTrailerKey && (
        <TrailerModal
          videoKey={activeTrailerKey}
          onClose={() => setActiveTrailerKey(null)}
        />
      )}

      {/* Profile & API Key Settings */}
      {settingsOpen && (
        <SettingsModal
          settings={settings}
          onSave={saveSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
