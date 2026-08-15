"use client";

import React from "react";
import { Search, RotateCcw, SlidersHorizontal, ArrowUpDown, Star } from "lucide-react";
import { Movie, FilterState } from "../types/movie";
import MovieCard from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
  loading: boolean;
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  genres: string[];
  onOpenDetails: (movie: Movie) => void;
  onOpenTrailer?: (videoKey: string) => void;
  isInWatchlist: (id: number) => boolean;
  isInFavorites: (id: number) => boolean;
  onToggleWatchlist: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

export default function MovieGrid({
  movies,
  loading,
  filters,
  setFilters,
  resetFilters,
  genres,
  onOpenDetails,
  onOpenTrailer,
  isInWatchlist,
  isInFavorites,
  onToggleWatchlist,
  onToggleFavorite,
}: MovieGridProps) {
  // Available sort options
  const sortOptions = [
    { value: "rating", label: "Top Rated" },
    { value: "releaseDate", label: "Release Date" },
    { value: "title", label: "Title (A-Z)" },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filtering Control Bar */}
      <div className="flex flex-col gap-4 mb-8 bg-zinc-900/30 p-5 rounded-2xl border border-zinc-800/80 backdrop-blur-sm">
        {/* Row 1: Search & Sort */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search bar */}
          <div className="relative flex-1 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 transition-colors group-focus-within:text-amber-500" />
            <input
              type="text"
              id="search-input"
              value={filters.searchQuery}
              onChange={(e) => setFilters({ searchQuery: e.target.value })}
              placeholder="Search movies by title, director, overview..."
              className="w-full bg-zinc-950/70 text-zinc-100 pl-11 pr-4 py-3 rounded-xl border border-zinc-800 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/20 text-sm placeholder:text-zinc-500 transition-all"
            />
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              <ArrowUpDown className="h-4 w-4" />
              <span>Sort By:</span>
            </div>
            <select
              id="sort-select"
              value={filters.sortBy}
              onChange={(e) => setFilters({ sortBy: e.target.value as FilterState["sortBy"] })}
              className="bg-zinc-950/70 border border-zinc-800 text-zinc-200 text-sm font-medium py-2.5 pl-3 pr-8 rounded-xl focus:outline-none focus:border-amber-500/80 transition-colors cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Genre Pills & Rating Slider */}
        <div className="flex flex-col lg:flex-row gap-5 items-stretch lg:items-center justify-between border-t border-zinc-800/50 pt-4 mt-1">
          {/* Genre list pills */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filter by Genre
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setFilters({ selectedGenre: "" })}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  filters.selectedGenre === ""
                    ? "bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/10"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                }`}
              >
                All Genres
              </button>
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setFilters({ selectedGenre: genre })}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    filters.selectedGenre === genre
                      ? "bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/10"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Rating filter & Reset button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5">
            {/* Rating selector buttons */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5" /> Minimum Rating
              </span>
              <div className="flex bg-zinc-950/70 border border-zinc-800 p-0.5 rounded-xl">
                {[0, 7.5, 8.0, 8.5].map((val) => (
                  <button
                    key={val}
                    onClick={() => setFilters({ minRating: val })}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      filters.minRating === val
                        ? "bg-zinc-800 text-amber-500"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {val === 0 ? "All" : `${val.toFixed(1)}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset button */}
            <button
              onClick={resetFilters}
              className="flex items-center justify-center gap-2 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 bg-zinc-950/20 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-all self-end sm:self-auto h-[38px] mt-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-xl border border-zinc-800/60 bg-zinc-900/20 aspect-[2/3] overflow-hidden animate-pulse"
            >
              <div className="w-full h-full bg-zinc-800" />
              <div className="p-3 bg-zinc-900/30 flex flex-col gap-2">
                <div className="h-3 w-1/3 bg-zinc-800 rounded" />
                <div className="h-4 w-3/4 bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : movies.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-zinc-800/40 bg-zinc-900/10">
          <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-zinc-900 text-zinc-600 border border-zinc-800 mb-4 animate-bounce-slow">
            <Search className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold text-zinc-300 mb-1">No movies found</h3>
          <p className="text-zinc-500 text-sm max-w-xs mb-6">
            We couldn&apos;t find any movies matching your search parameters. Try adjusting your query or filters.
          </p>
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/15 transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Movie Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onOpenDetails={onOpenDetails}
              onOpenTrailer={onOpenTrailer}
              isInWatchlist={isInWatchlist(movie.id)}
              isInFavorites={isInFavorites(movie.id)}
              onToggleWatchlist={() => onToggleWatchlist(movie.id)}
              onToggleFavorite={() => onToggleFavorite(movie.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
