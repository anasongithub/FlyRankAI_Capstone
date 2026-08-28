import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useMovies } from "../useMovies";

// Mock the movieService so tests are deterministic and don't hit real APIs
vi.mock("../../services/movieService", () => ({
  getMovies: vi.fn(),
}));

import { getMovies } from "../../services/movieService";

const mockMovies = [
  {
    id: 1,
    title: "Inception",
    genre: "Sci-Fi",
    rating: 8.8,
    year: 2010,
    overview: "A thief enters dreams.",
    poster: "https://image.tmdb.org/inception.jpg",
    backdrop: "",
    runtime: 148,
    language: "en",
    voteCount: 30000,
    trailerKey: null,
  },
  {
    id: 2,
    title: "The Dark Knight",
    genre: "Action",
    rating: 9.0,
    year: 2008,
    overview: "Batman vs Joker.",
    poster: "https://image.tmdb.org/tdk.jpg",
    backdrop: "",
    runtime: 152,
    language: "en",
    voteCount: 28000,
    trailerKey: null,
  },
];

describe("useMovies Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start in loading state and load movies on mount", async () => {
    (getMovies as ReturnType<typeof vi.fn>).mockResolvedValue(mockMovies);

    const { result } = renderHook(() => useMovies());

    // Initially loading
    expect(result.current.loading).toBe(true);

    // Wait for the async fetch to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.error).toBeNull();
    expect(getMovies).toHaveBeenCalledTimes(1);
  });

  it("should set error state when the movie service throws", async () => {
    (getMovies as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Network error")
    );

    const { result } = renderHook(() => useMovies());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.movies).toEqual([]);
    expect(result.current.error).toBe("Network error");
  });

  it("should update filters and reload movies", async () => {
    (getMovies as ReturnType<typeof vi.fn>).mockResolvedValue(mockMovies);

    const { result } = renderHook(() => useMovies());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Update genre filter
    act(() => {
      result.current.setFilters({ selectedGenre: "Sci-Fi" });
    });

    expect(result.current.filters.selectedGenre).toBe("Sci-Fi");

    await waitFor(() => expect(result.current.loading).toBe(false));
    // getMovies called again after filter change
    expect(getMovies).toHaveBeenCalledTimes(2);
  });

  it("should reset filters to defaults", async () => {
    (getMovies as ReturnType<typeof vi.fn>).mockResolvedValue(mockMovies);

    const { result } = renderHook(() => useMovies());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setFilters({ selectedGenre: "Action", minRating: 7 });
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters.selectedGenre).toBe("");
    expect(result.current.filters.minRating).toBe(0);
    expect(result.current.filters.searchQuery).toBe("");
  });
});
