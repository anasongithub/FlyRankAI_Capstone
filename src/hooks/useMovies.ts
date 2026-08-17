import { useState, useEffect } from "react";
import { Movie, FilterState } from "../types/movie";
import { getMovies } from "../services/movieService";

const DEFAULT_FILTERS: FilterState = {
  searchQuery: "",
  selectedGenre: "",
  minRating: 0,
  sortBy: "rating",
};

export function useMovies(tmdbApiKey?: string) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  useEffect(() => {
    let active = true;

    async function loadMovies() {
      setLoading(true);
      setError(null);
      try {
        const fetched = await getMovies(filters, tmdbApiKey);
        if (active) {
          setMovies(fetched);
        }
      } catch (e) {
        if (active) {
          setError(e instanceof Error ? e.message : "Failed to fetch movies");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    // Debounce live searching if typing to avoid spamming the API (optional but elegant)
    const delayDebounce = setTimeout(
      () => {
        loadMovies();
      },
      filters.searchQuery.trim().length > 0 ? 300 : 0
    );

    return () => {
      active = false;
      clearTimeout(delayDebounce);
    };
  }, [filters, tmdbApiKey]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return {
    movies,
    loading,
    error,
    filters,
    setFilters: updateFilters,
    resetFilters,
  };
}
