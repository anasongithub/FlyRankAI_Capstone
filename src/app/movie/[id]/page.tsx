import type { Metadata } from "next";
import { Film, Star, Clock, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Movie Details",
  description: "Full details, cast, and AI-powered analysis for this movie.",
};

// In Phase 2 this will accept `params.id` and fetch real movie data from TMDB or the mock DB.
// For the skeleton: render a routed placeholder that proves the dynamic segment resolves.
export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-200 text-sm font-medium transition mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Discover
      </Link>

      {/* Skeleton header */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Poster */}
        <div className="w-full md:w-56 shrink-0 aspect-[2/3] skeleton rounded-2xl" />

        {/* Meta */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest w-fit">
            <Film className="h-3.5 w-3.5" />
            Movie ID: {id}
          </div>

          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-8 w-64 skeleton rounded-lg" />
            <div className="h-5 w-40 skeleton rounded-lg" />
          </div>

          {/* Stats row skeleton */}
          <div className="flex flex-wrap gap-4">
            {[Star, Clock, Calendar].map((Icon, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-zinc-700" />
                <div className="h-4 w-16 skeleton rounded" />
              </div>
            ))}
          </div>

          {/* Overview skeleton */}
          <div className="space-y-2 mt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-4 skeleton rounded ${i === 3 ? "w-2/3" : "w-full"}`} />
            ))}
          </div>

          {/* Placeholder note */}
          <p className="text-xs text-zinc-700 mt-4 font-medium">
            Full movie data loads here in Phase 2 — powered by TMDB API or the mock DB.
          </p>
        </div>
      </div>

      {/* Cast & crew skeleton */}
      <section className="mb-10">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-600 mb-4">Cast & Crew</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
              <div className="h-14 w-14 skeleton rounded-full" />
              <div className="h-3 w-12 skeleton rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* AI Analysis placeholder */}
      <section className="p-5 rounded-2xl bg-violet-500/5 border border-violet-500/20">
        <h2 className="text-sm font-bold uppercase tracking-widest text-violet-400 mb-2">AI Analysis</h2>
        <p className="text-zinc-500 text-sm">
          Claude will provide thematic analysis, mood ratings, and personalised recommendations here in Phase 2.
        </p>
      </section>
    </div>
  );
}
