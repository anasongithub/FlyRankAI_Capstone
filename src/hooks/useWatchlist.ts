import { useState, useEffect } from "react";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        try {
          const storedWatchlist = localStorage.getItem("flymovie_watchlist");
          const storedFavorites = localStorage.getItem("flymovie_favorites");
          if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist));
          if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
        } catch (e) {
          console.error("Failed to parse watchlist/favorites from localStorage", e);
        } finally {
          setIsLoaded(true);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleWatchlist = (id: number) => {
    setWatchlist((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (typeof window !== "undefined") {
        localStorage.setItem("flymovie_watchlist", JSON.stringify(next));
      }
      return next;
    });
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (typeof window !== "undefined") {
        localStorage.setItem("flymovie_favorites", JSON.stringify(next));
      }
      return next;
    });
  };

  const isInWatchlist = (id: number) => watchlist.includes(id);
  const isInFavorites = (id: number) => favorites.includes(id);

  return {
    watchlist,
    favorites,
    isLoaded,
    toggleWatchlist,
    toggleFavorite,
    isInWatchlist,
    isInFavorites,
  };
}
