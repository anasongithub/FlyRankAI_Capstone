"use client";

import React from "react";
import { Film, Heart, Bookmark, Settings, User } from "lucide-react";
import { UserSettings } from "../types/movie";

interface NavbarProps {
  activeTab: "discover" | "watchlist" | "favorites";
  setActiveTab: (tab: "discover" | "watchlist" | "favorites") => void;
  userSettings: UserSettings;
  onOpenSettings: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  userSettings,
  onOpenSettings,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("discover")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-500/20">
            <Film className="h-5.5 w-5.5" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent sm:block">
            Fly<span className="text-amber-500">Movie</span>
          </span>
        </div>

        {/* Center: Tabs */}
        <nav className="flex space-x-1 bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/50">
          <button
            onClick={() => setActiveTab("discover")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === "discover"
                ? "bg-zinc-800 text-white shadow"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
            }`}
          >
            <Film className="h-4 w-4" />
            <span className="hidden sm:inline">Discover</span>
          </button>
          <button
            onClick={() => setActiveTab("watchlist")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === "watchlist"
                ? "bg-zinc-800 text-white shadow"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Watchlist</span>
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === "favorites"
                ? "bg-zinc-800 text-rose-400 shadow"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
            }`}
          >
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Favorites</span>
          </button>
        </nav>

        {/* Right: User Settings */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-1.5 pr-3 text-sm text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
          >
            {userSettings.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userSettings.avatarUrl}
                alt="Avatar"
                className="h-7.5 w-7.5 rounded-lg border border-zinc-700 object-cover"
              />
            ) : (
              <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
                <User className="h-4 w-4" />
              </div>
            )}
            <span className="hidden max-w-[100px] truncate font-medium md:block text-zinc-200">
              {userSettings.displayName}
            </span>
            <Settings className="h-4 w-4 text-zinc-400 transition group-hover:text-zinc-200" />
          </button>
        </div>
      </div>
    </header>
  );
}
