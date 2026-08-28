"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { MessageSquareOff, RefreshCw, Home, Sparkles } from "lucide-react";

export default function ChatErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Chat error boundary caught exception:", error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 flex-1 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center space-y-6 animate-fade-in">
        {/* Error Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <MessageSquareOff className="w-7 h-7" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full">
            Chat Stream Disrupted
          </span>
          <h1 className="text-xl font-bold text-white tracking-tight">
            CineBot encountered an error
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The AI conversation session experienced a render interruption. Your saved messages
            are safely cached in your browser.
          </p>
        </div>

        {/* Diagnostic info */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 text-left text-xs font-mono text-zinc-400 space-y-1">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-semibold">
            Details:
          </div>
          <div className="text-amber-300 font-medium truncate">
            {error.message || "Failed to load chat stream session"}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition shadow-lg shadow-violet-500/20 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reload conversation
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition border border-zinc-700/60"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
