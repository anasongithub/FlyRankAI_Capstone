"use client";

import { Heart } from "lucide-react";
import { useWatchlist } from "../../hooks/useWatchlist";
import { useMovies } from "../../hooks/useMovies";
import { useSettings } from "../../hooks/useSettings";
import { useState } from "react";
import { Movie } from "../../types/movie";
import MovieCard from "../../components/MovieCard";
import TrailerModal from "../../components/TrailerModal";
import MovieDetailsModal from "../../components/MovieDetailsModal";

export default function FavoritesPage() {
  const { settings } = useSettings();
  const { favorites, isInWatchlist, isInFavorites, toggleWatchlist, toggleFavorite } = useWatchlist();
  const { movies, loading } = useMovies(settings.tmdbApiKey);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeTrailerKey, setActiveTrailerKey] = useState<string | null>(null);

  const likedMovies = movies.filter((m) => favorites.includes(m.id));

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-5 border-b border-zinc-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20">
          <Heart className="h-6 w-6 text-rose-500" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">My Favorites</h1>
          <p className="text-zinc-500 text-sm">
            {loading ? "Loading…" : `${likedMovies.length} movie${likedMovies.length !== 1 ? "s" : ""} liked`}
          </p>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] skeleton rounded-xl" />
          ))}
        </div>
      )}

      {!loading && likedMovies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="h-20 w-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5 animate-bounce-slow">
            <Heart className="h-9 w-9 text-zinc-600" />
          </div>
          <h2 className="text-xl font-bold text-zinc-300 mb-2">No favorites yet</h2>
          <p className="text-zinc-500 text-sm max-w-sm">
            Hit the heart icon on any movie in Discover or your Watchlist to mark it as a favorite.
          </p>
        </div>
      )}

      {!loading && likedMovies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {likedMovies.map((movie) => (
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
