"use client";

import React, { useState } from "react";
import { QuickAddToWatchlistInput } from "../../lib/ai/tools";
import { Bookmark, Check, Sparkles } from "lucide-react";
import { useWatchlist } from "../../hooks/useWatchlist";

interface WatchlistActionWidgetProps {
  data: QuickAddToWatchlistInput;
}

export function WatchlistActionWidget({ data }: WatchlistActionWidgetProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [confirmed, setConfirmed] = useState(isInWatchlist(data.movieId));

  const handleConfirm = () => {
    toggleWatchlist(data.movieId);
    setConfirmed(!confirmed);
  };

  return (
    <div className="w-full my-3 p-4 bg-zinc-950/90 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-black/30">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <Bookmark className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white">{data.movieTitle}</h4>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Suggested Addition
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5 leading-normal">{data.reason}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleConfirm}
        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-lg ${
          confirmed
            ? "bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 shadow-emerald-500/10"
            : "bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white shadow-amber-500/20"
        }`}
      >
        {confirmed ? (
          <>
            <Check className="h-4 w-4 text-emerald-400" />
            Added to Watchlist
          </>
        ) : (
          <>
            <Bookmark className="h-4 w-4" />
            Confirm & Save
          </>
        )}
      </button>
    </div>
  );
}
