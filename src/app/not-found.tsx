import React from "react";
import Link from "next/link";
import { Film, Home, Bot, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center space-y-6 animate-fade-in">
        {/* 404 Visual Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
          <Film className="w-8 h-8" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
            404
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Scene not found
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The reel or page you were looking for doesn&apos;t exist or has moved. Explore our AI
            curation tools or head back to the main lobby.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition shadow-lg shadow-violet-500/20"
          >
            <Home className="w-3.5 h-3.5" />
            Discover films
          </Link>
          <Link
            href="/chat"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition border border-zinc-700/60"
          >
            <Bot className="w-3.5 h-3.5" />
            Ask CineBot
          </Link>
        </div>
      </div>
    </main>
  );
}
