"use client";

import React from "react";
import { Play, Plus, Check, Star, Info } from "lucide-react";
import { Movie } from "../types/movie";

interface HeroProps {
  movie: Movie;
  onOpenDetails: (movie: Movie) => void;
  onOpenTrailer: (videoKey: string) => void;
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
}

export default function Hero({
  movie,
  onOpenDetails,
  onOpenTrailer,
  isInWatchlist,
  onToggleWatchlist,
}: HeroProps) {
  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "";

  return (
    <div className="relative w-full h-[55vh] md:h-[70vh] flex items-end justify-start overflow-hidden bg-zinc-950 select-none">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={movie.backdropPath}
          alt={movie.title}
          className="w-full h-full object-cover object-top opacity-60 scale-102 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent" />
      </div>

      {/* Info Content Box */}
      <div className="relative z-10 w-full max-w-4xl px-4 pb-12 sm:px-6 lg:px-8 sm:pb-16 md:pb-24">
        {/* Genre Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {movie.genres.map((genre) => (
            <span
              key={genre}
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/10 text-zinc-100 border border-white/10 backdrop-blur-sm"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 drop-shadow-md">
          {movie.title}
        </h1>

        {/* Metadata */}
        <div className="flex items-center gap-4 mb-4 text-sm sm:text-base font-medium text-zinc-300">
          <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/15">
            <Star className="h-4 w-4 fill-amber-500" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
          {releaseYear && <span>{releaseYear}</span>}
          {movie.runtime && <span>{movie.runtime} min</span>}
        </div>

        {/* Overview */}
        <p className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-2xl mb-8 line-clamp-3 md:line-clamp-4 leading-relaxed font-normal">
          {movie.overview}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {movie.trailerUrl && (
            <button
              onClick={() => onOpenTrailer(movie.trailerUrl!)}
              className="flex items-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold rounded-xl bg-white hover:bg-zinc-200 text-black shadow-lg shadow-white/10 hover:shadow-white/20 transition-all active:scale-98"
            >
              <Play className="h-5 w-5 fill-black" />
              Watch Trailer
            </button>
          )}

          <button
            onClick={onToggleWatchlist}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm sm:text-base font-semibold rounded-xl border transition-all active:scale-98 ${
              isInWatchlist
                ? "bg-zinc-900/60 border-zinc-700 hover:border-zinc-600 text-amber-500"
                : "bg-black/30 border-white/20 hover:border-white/40 hover:bg-black/40 text-white"
            } backdrop-blur-md`}
          >
            {isInWatchlist ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {isInWatchlist ? "In Watchlist" : "Add Watchlist"}
          </button>

          <button
            onClick={() => onOpenDetails(movie)}
            className="flex items-center gap-2 px-5 py-3.5 text-sm sm:text-base font-semibold rounded-xl bg-zinc-800/40 border border-zinc-700/60 hover:bg-zinc-800/60 hover:border-zinc-600 text-zinc-200 transition-all backdrop-blur-md active:scale-98"
          >
            <Info className="h-5 w-5" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}
