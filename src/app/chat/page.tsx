"use client";

import React from "react";
import { StreamingChat } from "../../components/chat/StreamingChat";
import { Bot, Sparkles } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col items-center justify-center">
      {/* Header Banner */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              Streaming AI CineBot
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                FE-06
              </span>
            </h1>
            <p className="text-zinc-500 text-xs sm:text-sm">
              Live token-by-token streaming conversation with your personal film critic.
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <StreamingChat />
    </div>
  );
}
