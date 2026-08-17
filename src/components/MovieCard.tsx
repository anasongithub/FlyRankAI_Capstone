"use client";

import React from "react";
import { Star, Heart, Bookmark, Play } from "lucide-react";
import { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onOpenDetails: (movie: Movie) => void;
  onOpenTrailer?: (videoKey: string) => void;
  isInWatchlist: boolean;
  isInFavorites: boolean;
  onToggleWatchlist: () => void;
  onToggleFavorite: () => void;
}

export default function MovieCard({
  movie,
  onOpenDetails,
  onOpenTrailer,
  isInWatchlist,
  isInFavorites,
  onToggleWatchlist,
  onToggleFavorite,
}: MovieCardProps) {
  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "";

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-sm transition-all duration-300 hover:scale-103 hover:border-zinc-700 hover:bg-zinc-900/60 shadow-lg hover:shadow-2xl">
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden cursor-pointer" onClick={() => onOpenDetails(movie)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={movie.posterPath}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Floating Actions: Rating and Quick Save */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
          {/* Rating */}
          <div className="flex items-center gap-1 bg-black/75 px-2 py-0.5 rounded-lg border border-white/10 text-xs font-semibold text-amber-400 backdrop-blur-md">
            <Star className="h-3 w-3 fill-amber-400" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>

          {/* Quick Actions (Hover visible or top right) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className={`p-1.5 rounded-lg border backdrop-blur-md transition-all ${
                isInFavorites
                  ? "bg-rose-500 border-rose-500 text-white"
                  : "bg-black/70 border-white/10 text-zinc-400 hover:text-rose-400 hover:bg-black/80"
              }`}
              aria-label={isInFavorites ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart className={`h-3.5 w-3.5 ${isInFavorites ? "fill-white" : ""}`} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist();
              }}
              className={`p-1.5 rounded-lg border backdrop-blur-md transition-all ${
                isInWatchlist
                  ? "bg-amber-500 border-amber-500 text-black"
                  : "bg-black/70 border-white/10 text-zinc-400 hover:text-amber-400 hover:bg-black/80"
              }`}
              aria-label={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isInWatchlist ? "fill-black" : ""}`} />
            </button>
          </div>
        </div>

        {/* Hover Cinematic Action Mask */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
          {movie.trailerUrl && onOpenTrailer && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenTrailer(movie.trailerUrl!);
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow hover:bg-zinc-200 transition-all hover:scale-108 active:scale-95"
            >
              <Play className="h-5 w-5 fill-black pl-0.5" />
            </button>
          )}
          <button
            onClick={() => onOpenDetails(movie)}
            className="px-3.5 py-1.5 rounded-lg border border-white/30 text-xs font-semibold text-white bg-black/40 hover:bg-black/60 hover:border-white/60 transition-all"
          >
            More Details
          </button>
        </div>
      </div>

      {/* Info Info Area */}
      <div className="flex flex-col flex-1 p-3 cursor-pointer" onClick={() => onOpenDetails(movie)}>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-semibold uppercase text-zinc-500 tracking-wider truncate">
            {movie.genres.slice(0, 2).join(" • ")}
          </span>
          {releaseYear && <span className="text-xs font-medium text-zinc-500">{releaseYear}</span>}
        </div>
        <h3 className="font-bold text-zinc-100 text-sm group-hover:text-amber-500 line-clamp-1 transition-colors leading-tight">
          {movie.title}
        </h3>
      </div>
    </div>
  );
}
