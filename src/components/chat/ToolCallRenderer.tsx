"use client";

import React from "react";
import { Loader2, Wrench, AlertTriangle, CheckCircle2, RotateCw } from "lucide-react";
import { MovieDeepDiveCard } from "./MovieDeepDiveCard";
import { FilmComparisonChart } from "./FilmComparisonChart";
import { WatchlistActionWidget } from "./WatchlistActionWidget";

export type ToolState = "input-streaming" | "input-available" | "output-available" | "output-error";

export interface ToolPart {
  toolCallId: string;
  toolName: string;
  state: ToolState;
  input?: any;
  output?: any;
  error?: string;
}

interface ToolCallRendererProps {
  tool: ToolPart;
  onRetry?: (toolCallId: string) => void;
}

export function ToolCallRenderer({ tool, onRetry }: ToolCallRendererProps) {
  const { toolName, state, input, output, error } = tool;

  // 1. STATE: input-streaming
  if (state === "input-streaming") {
    return (
      <div className="my-3 p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/30 text-violet-300 text-xs flex items-center gap-3 animate-pulse">
        <Loader2 className="h-4 w-4 animate-spin text-violet-400 shrink-0" />
        <div className="flex-1">
          <span className="font-bold">Formulating Tool Query:</span>{" "}
          <span className="text-zinc-400 font-mono text-[11px]">{toolName}()</span>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            CineBot is streaming structured parameters for catalog inspection...
          </p>
        </div>
      </div>
    );
  }

  // 2. STATE: input-available (executing tool)
  if (state === "input-available") {
    return (
      <div className="my-3 p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-3 animate-fade-in">
        <Wrench className="h-4 w-4 text-indigo-400 shrink-0 animate-bounce" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold">Executing Tool:</span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
              {toolName}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            {JSON.stringify(input || {})}
          </p>
        </div>
      </div>
    );
  }

  // 3. STATE: output-error
  if (state === "output-error") {
    return (
      <div className="my-3 p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-200 text-xs space-y-2 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Tool Execution Failed</span>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={() => onRetry(tool.toolCallId)}
              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-[11px] flex items-center gap-1 transition"
            >
              <RotateCw className="h-3 w-3" />
              Retry Query
            </button>
          )}
        </div>
        <p className="text-zinc-400 text-[11px] leading-relaxed">
          {error || "An unexpected error occurred while executing the tool function."}
        </p>
      </div>
    );
  }

  // 4. STATE: output-available (Generative UI Component rendering)
  if (state === "output-available" && output) {
    if (toolName === "fetchMovieDeepDive") {
      return (
        <div className="animate-fade-in">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 mb-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Film Deep Dive Loaded
          </div>
          <MovieDeepDiveCard data={output} />
        </div>
      );
    }

    if (toolName === "compareFilms") {
      return (
        <div className="animate-fade-in">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 mb-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Comparison Matrix Generated
          </div>
          <FilmComparisonChart data={output} />
        </div>
      );
    }

    if (toolName === "quickAddToWatchlist") {
      return (
        <div className="animate-fade-in">
          <WatchlistActionWidget data={output} />
        </div>
      );
    }

    // Fallback structured component if unknown tool
    return (
      <div className="my-3 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
        <span className="font-bold text-zinc-300">Tool Result: {toolName}</span>
        <pre className="mt-2 text-[11px] text-zinc-400 overflow-x-auto bg-zinc-900/60 p-3 rounded-lg">
          {JSON.stringify(output, null, 2)}
        </pre>
      </div>
    );
  }

  return null;
}
