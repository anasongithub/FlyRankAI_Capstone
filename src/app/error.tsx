"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Compass } from "lucide-react";

export default function RootErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console / telemetry
    console.error("Root error boundary caught exception:", error);
  }, [error]);

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center space-y-6 animate-fade-in">
        {/* Error Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <AlertTriangle className="w-7 h-7" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-full">
            Application Error
          </span>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Something unexpected occurred
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The application encountered an unhandled exception while rendering this page.
            We have captured the state and you can safely recover below.
          </p>
        </div>

        {/* Error Diagnostic (safe summary) */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 text-left text-xs font-mono text-zinc-400 space-y-1">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-semibold">
            Diagnostic details:
          </div>
          <div className="text-rose-300 font-medium truncate">
            {error.message || "An unknown rendering error occurred"}
          </div>
          {error.digest && (
            <div className="text-[10px] text-zinc-600">Digest: {error.digest}</div>
          )}
        </div>

        {/* Recovery Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition shadow-lg shadow-violet-500/20 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition border border-zinc-700/60"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition border border-zinc-700/60"
          >
            <Compass className="w-3.5 h-3.5" />
            CineBot
          </Link>
        </div>
      </div>
    </main>
  );
}
