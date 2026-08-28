"use client";

import React from "react";
import { Bot } from "lucide-react";

export function ChatSkeleton() {
  return (
    <div
      aria-label="CineBot is thinking"
      role="status"
      className="flex gap-3 items-start animate-fade-in"
    >
      {/* Bot Avatar Skeleton */}
      <div className="h-8 w-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 mt-0.5 animate-pulse">
        <Bot className="h-4 w-4" />
      </div>

      {/* Message Bubble Skeleton matching exact real message padding and layout */}
      <div className="max-w-[90%] sm:max-w-[85%] w-full bg-zinc-950/80 border border-zinc-800/80 rounded-2xl rounded-tl-none p-4 space-y-3 shadow-lg">
        {/* Header pulse indicator */}
        <div className="flex items-center gap-2 pb-1 border-b border-zinc-800/50">
          <span className="h-2 w-2 rounded-full bg-violet-400 animate-ping" />
          <span className="text-xs font-semibold text-zinc-400 animate-pulse">
            CineBot is analyzing cinematic records...
          </span>
        </div>

        {/* Content line placeholders sized to eliminate CLS */}
        <div className="space-y-2 pt-1">
          <div className="h-3.5 bg-zinc-800/70 rounded-md w-11/12 animate-pulse" />
          <div className="h-3.5 bg-zinc-800/50 rounded-md w-4/5 animate-pulse" />
          <div className="h-3.5 bg-zinc-800/40 rounded-md w-2/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
