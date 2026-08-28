"use client";

import React from "react";
import { MovieDeepDiveResult } from "../../lib/ai/tools";
import { Film, Award, TrendingUp, Sparkles, Bookmark, Eye, Star } from "lucide-react";
import { useWatchlist } from "../../hooks/useWatchlist";

interface MovieDeepDiveCardProps {
  data: MovieDeepDiveResult;
}

export function MovieDeepDiveCard({ data }: MovieDeepDiveCardProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(data.id);

  return (
    <div className="w-full my-4 rounded-2xl bg-zinc-950/90 border border-violet-500/30 overflow-hidden shadow-xl shadow-black/40 text-zinc-200 transition duration-300 hover:border-violet-500/50">
      {/* Header Banner with Backdrop / Poster Accent */}
      <div className="p-5 bg-gradient-to-r from-violet-950/50 via-zinc-900/60 to-zinc-950 border-b border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 shrink-0 shadow-inner">
            <Film className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-extrabold text-white">{data.title}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-medium">
                {data.year}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {data.rating.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Director: <span className="text-zinc-200 font-medium">{data.director}</span> · DP:{" "}
              <span className="text-zinc-200 font-medium">{data.cinematographer}</span>
            </p>
          </div>
        </div>

        {/* Quick Add Action */}
        <button
          type="button"
          onClick={() => toggleWatchlist(data.id)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            inWatchlist
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
              : "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20"
          }`}
        >
          <Bookmark className={`h-3.5 w-3.5 ${inWatchlist ? "fill-amber-400 text-amber-400" : ""}`} />
          {inWatchlist ? "In Watchlist" : "Save to Watchlist"}
        </button>
      </div>

      {/* Body Details */}
      <div className="p-5 space-y-5">
        {/* Visual Style & Overview */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Cinematographic Signature
          </span>
          <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/80">
            {data.visualStyle}
          </p>
        </div>

        {/* Cinematic Metric Gauges */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Film Dynamics Index
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Pacing */}
            <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-400">Pacing Flow</span>
                <span className="text-violet-300">{data.pacingScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all duration-500"
                  style={{ width: `${data.pacingScore}%` }}
                />
              </div>
            </div>

            {/* Thematic Depth */}
            <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-400">Thematic Depth</span>
                <span className="text-indigo-300">{data.thematicDepthScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${data.thematicDepthScore}%` }}
                />
              </div>
            </div>

            {/* Rewatchability */}
            <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-400">Rewatch Value</span>
                <span className="text-amber-300">{data.rewatchabilityScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${data.rewatchabilityScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Thematic Tags & Box Office */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
          <div className="flex flex-wrap gap-1.5">
            {data.keyThemes.map((theme, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-900 border border-zinc-800 text-zinc-300"
              >
                #{theme}
              </span>
            ))}
          </div>

          <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-1.5 shrink-0">
            <Award className="h-3.5 w-3.5 text-amber-400" />
            <span>Box Office: {data.boxOffice.worldwideGross}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
