"use client";

import { Bookmark, Film } from "lucide-react";
import { useWatchlist } from "../../hooks/useWatchlist";
import { useMovies } from "../../hooks/useMovies";
import { useSettings } from "../../hooks/useSettings";
import { useState } from "react";
import { Movie } from "../../types/movie";
import MovieCard from "../../components/MovieCard";
import TrailerModal from "../../components/TrailerModal";
import MovieDetailsModal from "../../components/MovieDetailsModal";

export default function WatchlistPage() {
  const { settings } = useSettings();
  const { watchlist, isInWatchlist, isInFavorites, toggleWatchlist, toggleFavorite } = useWatchlist();
  const { movies, loading } = useMovies(settings.tmdbApiKey);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeTrailerKey, setActiveTrailerKey] = useState<string | null>(null);

  const savedMovies = movies.filter((m) => watchlist.includes(m.id));

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-5 border-b border-zinc-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
          <Bookmark className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">My Watchlist</h1>
          <p className="text-zinc-500 text-sm">
            {loading ? "Loading…" : `${savedMovies.length} movie${savedMovies.length !== 1 ? "s" : ""} saved`}
          </p>
        </div>
      </div>

      {/* Skeleton while loading */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] skeleton rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && savedMovies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="h-20 w-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5 animate-bounce-slow">
            <Bookmark className="h-9 w-9 text-zinc-600" />
          </div>
          <h2 className="text-xl font-bold text-zinc-300 mb-2">Your watchlist is empty</h2>
          <p className="text-zinc-500 text-sm max-w-sm">
            Browse the Discover tab and hit the bookmark icon on any movie to save it here.
          </p>
        </div>
      )}

      {/* Movie grid */}
      {!loading && savedMovies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {savedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onOpenDetails={setSelectedMovie}
              onOpenTrailer={setActiveTrailerKey}
              isInWatchlist={isInWatchlist(movie.id)}
              isInFavorites={isInFavorites(movie.id)}
              onToggleWatchlist={() => toggleWatchlist(movie.id)}
              onToggleFavorite={() => toggleFavorite(movie.id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
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
        <TrailerModal videoKey={activeTrailerKey} onClose={() => setActiveTrailerKey(null)} />
      )}
    </div>
  );
}
