"use client";

import React, { useState } from "react";
import { Bookmark, Heart, Play, ArrowLeft } from "lucide-react";
import { useWatchlist } from "../hooks/useWatchlist";
import { Movie } from "../types/movie";
import TrailerModal from "./TrailerModal";
import Link from "next/link";

interface ActionsProps {
  movie: Movie;
}

export default function MovieDetailsActions({ movie }: ActionsProps) {
  const { toggleWatchlist, toggleFavorite, isInWatchlist, isInFavorites } = useWatchlist();
  const [playTrailer, setPlayTrailer] = useState(false);

  const inWatchlist = isInWatchlist(movie.id);
  const inFavorites = isInFavorites(movie.id);

  return (
    <div className="space-y-6">
      {/* Action Row */}
      <div className="flex flex-wrap gap-3">
        {movie.trailerUrl && (
          <button
            onClick={() => setPlayTrailer(true)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <Play className="h-4 w-4 fill-black" />
            Watch Trailer
          </button>
        )}

        <button
          onClick={() => toggleWatchlist(movie.id)}
          className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm border transition cursor-pointer ${
            inWatchlist
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
              : "bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white"
          }`}
        >
          <Bookmark className={`h-4 w-4 ${inWatchlist ? "fill-amber-400" : ""}`} />
          {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
        </button>

        <button
          onClick={() => toggleFavorite(movie.id)}
          className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm border transition cursor-pointer ${
            inFavorites
              ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
              : "bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white"
          }`}
        >
          <Heart className={`h-4 w-4 ${inFavorites ? "fill-rose-400" : ""}`} />
          {inFavorites ? "Favorited" : "Favorite"}
        </button>
      </div>

      {/* Trailer modal */}
      {playTrailer && movie.trailerUrl && (
        <TrailerModal
          videoKey={movie.trailerUrl}
          onClose={() => setPlayTrailer(false)}
        />
      )}
    </div>
  );
}
