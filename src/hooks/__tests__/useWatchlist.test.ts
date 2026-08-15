import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWatchlist } from "../useWatchlist";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
});

describe("useWatchlist Hook", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("should initialize with empty watchlist and favorites", async () => {
    const { result } = renderHook(() => useWatchlist());

    // Wait for the useEffect to fire (since it's deferred with setTimeout) inside act
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(result.current.watchlist).toEqual([]);
    expect(result.current.favorites).toEqual([]);
    expect(result.current.isLoaded).toBe(true);
  });

  it("should toggle items in and out of the watchlist", async () => {
    const { result } = renderHook(() => useWatchlist());

    // Wait for initial load inside act
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    // Toggle watchlist ID 101 ON
    act(() => {
      result.current.toggleWatchlist(101);
    });

    expect(result.current.watchlist).toEqual([101]);
    expect(result.current.isInWatchlist(101)).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "flymovie_watchlist",
      JSON.stringify([101])
    );

    // Toggle watchlist ID 101 OFF
    act(() => {
      result.current.toggleWatchlist(101);
    });

    expect(result.current.watchlist).toEqual([]);
    expect(result.current.isInWatchlist(101)).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "flymovie_watchlist",
      JSON.stringify([])
    );
  });

  it("should toggle items in and out of favorites", async () => {
    const { result } = renderHook(() => useWatchlist());

    // Wait for initial load inside act
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    // Toggle favorite ID 202 ON
    act(() => {
      result.current.toggleFavorite(202);
    });

    expect(result.current.favorites).toEqual([202]);
    expect(result.current.isInFavorites(202)).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "flymovie_favorites",
      JSON.stringify([202])
    );

    // Toggle favorite ID 202 OFF
    act(() => {
      result.current.toggleFavorite(202);
    });

    expect(result.current.favorites).toEqual([]);
    expect(result.current.isInFavorites(202)).toBe(false);
  });
});
