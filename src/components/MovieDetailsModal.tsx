"use client";

import React, { useEffect, useState } from "react";
import { X, Star, Heart, Bookmark, Play, Clock, Film, Calendar } from "lucide-react";
import { Movie } from "../types/movie";
import { getMovieDetails } from "../services/movieService";

interface MovieDetailsModalProps {
  movie: Movie;
  onClose: () => void;
  onOpenTrailer: (videoKey: string) => void;
  isInWatchlist: boolean;
  isInFavorites: boolean;
  onToggleWatchlist: () => void;
  onToggleFavorite: () => void;
  tmdbApiKey?: string;
  allMovies: Movie[]; // To compute recommendations locally if needed
  onSelectRecommended: (movie: Movie) => void;
}

export default function MovieDetailsModal({
  movie: initialMovie,
  onClose,
  onOpenTrailer,
  isInWatchlist,
  isInFavorites,
  onToggleWatchlist,
  onToggleFavorite,
  tmdbApiKey,
  allMovies,
  onSelectRecommended,
}: MovieDetailsModalProps) {
  const [movie, setMovie] = useState<Movie>(initialMovie);
  const [loading, setLoading] = useState(true);

  // Fetch full details (cast, runtime, trailer url, director) if it's missing or if tmdb is active
  useEffect(() => {
    let active = true;
    async function loadDetails() {
      setLoading(true);
      try {
        const details = await getMovieDetails(initialMovie.id, tmdbApiKey);
        if (active && details) {
          setMovie(details);
        }
      } catch (err) {
        console.error("Failed to load movie details", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDetails();
    return () => {
      active = false;
    };
  }, [initialMovie, tmdbApiKey]);

  // Format runtime: e.g. 148 -> 2h 28m
  const formatRuntime = (mins?: number) => {
    if (!mins) return "";
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return hrs > 0 ? `${hrs}h ${remainingMins}m` : `${remainingMins}m`;
  };

  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "";

  // Get locally computed similar movies based on genres overlap
  const getRecommendations = () => {
    return allMovies
      .filter((m) => m.id !== movie.id) // Exclude current movie
      .map((m) => {
        // Count overlapping genres
        const overlap = m.genres.filter((g) => movie.genres.includes(g)).length;
        return { movie: m, overlap };
      })
      .filter((item) => item.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap)
      .slice(0, 4)
      .map((item) => item.movie);
  };

  const recommendations = getRecommendations();

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden my-8 animate-fade-in-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 border border-white/10 text-zinc-400 hover:text-white transition-all hover:scale-105 active:scale-95"
          aria-label="Close details"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Hero Section (Backdrop image with title overlay) */}
        <div className="relative h-[250px] sm:h-[350px] w-full flex items-end">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={movie.backdropPath}
              alt={movie.title}
              className="w-full h-full object-cover object-top opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-905 via-zinc-900/30 to-transparent" />
          </div>

          {/* Banner Details Overlay */}
          <div className="relative z-10 p-6 sm:p-8 w-full">
            <div className="flex flex-wrap gap-2 mb-2">
              {movie.genres.map((g) => (
                <span key={g} className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-white/10 text-zinc-200 border border-white/10">
                  {g}
                </span>
              ))}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              {movie.title}
            </h2>
          </div>
        </div>

        {/* Modal Info Area */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 bg-zinc-900">
          
          {/* Left Column: Metadata & Actions */}
          <div className="flex flex-col gap-6">
            {/* Poster */}
            <div className="hidden md:block aspect-[2/3] w-full rounded-xl overflow-hidden border border-zinc-800 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm font-medium text-zinc-300">
              <div className="flex items-center gap-2 bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-800">
                <Star className="h-4.5 w-4.5 fill-amber-500 text-amber-500" />
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Rating</div>
                  <div className="text-zinc-200">{movie.rating.toFixed(1)} / 10</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-800">
                <Clock className="h-4.5 w-4.5 text-zinc-400" />
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Runtime</div>
                  <div className="text-zinc-200">{formatRuntime(movie.runtime) || "N/A"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-800">
                <Calendar className="h-4.5 w-4.5 text-zinc-400" />
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Released</div>
                  <div className="text-zinc-200">{releaseYear || "N/A"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-800">
                <Film className="h-4.5 w-4.5 text-zinc-400" />
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Director</div>
                  <div className="text-zinc-200 truncate max-w-[100px]">{movie.director || "Unknown"}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Buttons */}
            <div className="flex flex-col gap-2">
              {movie.trailerUrl && (
                <button
                  onClick={() => onOpenTrailer(movie.trailerUrl!)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm shadow hover:shadow-lg transition-all active:scale-98"
                >
                  <Play className="h-4 w-4 fill-black" />
                  Watch Trailer
                </button>
              )}
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onToggleWatchlist}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    isInWatchlist
                      ? "bg-amber-500 border-amber-500 text-black hover:bg-amber-600"
                      : "bg-zinc-800/40 border-zinc-700 hover:border-zinc-600 text-zinc-200"
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                  {isInWatchlist ? "Saved" : "Watchlist"}
                </button>

                <button
                  onClick={onToggleFavorite}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    isInFavorites
                      ? "bg-rose-500 border-rose-500 text-white hover:bg-rose-600"
                      : "bg-zinc-800/40 border-zinc-700 hover:border-zinc-600 text-zinc-200"
                  }`}
                >
                  <Heart className="h-4 w-4" />
                  {isInFavorites ? "Liked" : "Favorite"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Cast list & Detailed information */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Overview */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Overview</h3>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-normal">
                {movie.overview}
              </p>
            </div>

            {/* Cast section */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Cast Members</h3>
              {loading ? (
                <div className="flex gap-4">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="flex flex-col items-center w-16 animate-pulse">
                      <div className="h-16 w-16 bg-zinc-800 rounded-full mb-1" />
                      <div className="h-2 w-10 bg-zinc-800 rounded mb-1" />
                      <div className="h-2 w-7 bg-zinc-800 rounded" />
                    </div>
                  ))}
                </div>
              ) : !movie.cast || movie.cast.length === 0 ? (
                <p className="text-zinc-500 text-xs">Cast details not available.</p>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {movie.cast.map((actor) => (
                    <div key={actor.id} className="flex flex-col items-center text-center">
                      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden border border-zinc-800 bg-zinc-950 mb-1.5 shadow">
                        {actor.profilePath ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={actor.profilePath}
                            alt={actor.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-zinc-500 bg-zinc-800 text-xs">
                            {actor.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-zinc-200 text-xs font-bold line-clamp-1 w-full leading-tight">
                        {actor.name}
                      </span>
                      <span className="text-[10px] text-zinc-500 line-clamp-1 w-full">
                        {actor.character}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommendations / Similar Movies */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">You May Also Like</h3>
              {recommendations.length === 0 ? (
                <p className="text-zinc-500 text-xs">No recommendations found.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => onSelectRecommended(rec)}
                      className="group cursor-pointer bg-zinc-950/40 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition"
                    >
                      <div className="aspect-[16/10] overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={rec.backdropPath}
                          alt={rec.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-1 left-1.5 bg-black/80 text-[10px] text-amber-500 px-1 py-0.5 rounded border border-white/5 font-bold flex items-center gap-0.5">
                          <Star className="h-2.5 w-2.5 fill-amber-500" />
                          {rec.rating.toFixed(1)}
                        </div>
                      </div>
                      <div className="p-2 truncate text-zinc-300 group-hover:text-amber-500 text-xs font-bold transition">
                        {rec.title}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
