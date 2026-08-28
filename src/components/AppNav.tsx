"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Bookmark, Heart, Cpu, Settings, MessageSquareText, Layers } from "lucide-react";
import { useSettings } from "../hooks/useSettings";

const NAV_ITEMS = [
  { href: "/",           label: "Discover",   icon: Film },
  { href: "/chat",       label: "Live Chat",  icon: MessageSquareText },
  { href: "/ai",         label: "Assistant",  icon: Cpu },
  { href: "/watchlist",  label: "Watchlist",  icon: Bookmark },
  { href: "/favorites",  label: "Favorites",  icon: Heart },
  { href: "/playground", label: "A11y Lab",   icon: Layers },
] as const;

export default function AppNav() {
  const pathname  = usePathname();
  const { settings } = useSettings();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 shadow-lg shadow-amber-500/20">
            <Film className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
            Fly<span className="text-amber-500">Movie</span>
          </span>
        </Link>

        {/* Primary navigation */}
        <nav className="flex space-x-0.5 bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/50">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  active
                    ? href === "/favorites"
                      ? "bg-zinc-800 text-rose-400 shadow"
                      : "bg-zinc-800 text-white shadow"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings / user profile */}
        <Link
          href="/settings"
          className={`flex items-center gap-2.5 rounded-xl border bg-zinc-900/40 p-1.5 pr-3 text-sm transition hover:bg-zinc-900 hover:text-white ${
            pathname === "/settings"
              ? "border-amber-500/50 text-white"
              : "border-zinc-800 text-zinc-300 hover:border-zinc-700"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={settings.avatarUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix"}
            alt="User avatar"
            className="h-7 w-7 rounded-lg border border-zinc-700 object-cover"
          />
          <span className="hidden max-w-[90px] truncate font-medium md:block text-zinc-200">
            {settings.displayName}
          </span>
          <Settings className="h-4 w-4 text-zinc-400" />
        </Link>

      </div>
    </header>
  );
}
