import type { Metadata } from "next";
import { getMovieDetails } from "../../../services/movieService";
import { Film, Star, Clock, Calendar, ArrowLeft, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import MovieDetailsActions from "../../../components/MovieDetailsActions";

// Generate dynamic metadata for dynamic movie pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetails(parseInt(id, 10), process.env.TMDB_API_KEY);
  return {
    title: movie ? `${movie.title} — Details` : "Movie Details",
    description: movie?.overview || "Cinematic movie details",
  };
}

// ── Types ──────────────────────────────────────────────────────────────────────
interface AIInsights {
  contentAdvisory: string;
  thematicMotifs: string[];
  vibeCheck: string;
}

// ── Fetch dynamic AI Insights directly on the server ──────────────────────────
async function fetchAIInsights(
  id: number,
  title: string,
  overview: string,
  genres: string[]
): Promise<AIInsights> {
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY || "";

  if (!geminiApiKey) {
    return {
      contentAdvisory: "Content advisories and age suitability guidelines are dynamically generated once the Gemini API Key is configured in settings.",
      thematicMotifs: ["Drama", "Human Condition", "Legacy"],
      vibeCheck: `An engaging exploration of ${title}'s cinematic narrative.`,
    };
  }

  try {
    const systemPrompt = `You are a professional film critic and analyst.
Analyze this movie:
Title: "${title}"
Genres: ${genres?.join(", ") || "Unknown"}
Overview: "${overview || ""}"

Generate thematic insights, age advisories, and a mood-check for this movie.
Return your response strictly in the following JSON format:
{
  "contentAdvisory": "Detailed content and suitability advice (e.g. PG-13 guidelines, intensity notes, triggers)",
  "thematicMotifs": ["Motif 1", "Motif 2", "Motif 3"],
  "vibeCheck": "A 1-sentence description of the emotional/artistic vibe of this movie."
}

Only output valid JSON. Do not include markdown wraps (like \`\`\`json).`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`;
    
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
      next: { revalidate: 86400 }, // Cache insights for 24 hours
    });

    if (!res.ok) throw new Error("Gemini request failed");

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const parsed = JSON.parse(text);

    return {
      contentAdvisory: parsed.contentAdvisory || "General viewing advice.",
      thematicMotifs: parsed.thematicMotifs || ["Cinema"],
      vibeCheck: parsed.vibeCheck || "Cinematic Vibe.",
    };
  } catch (e) {
    console.error("Failed to generate server-side AI insights:", e);
    return {
      contentAdvisory: "Insights failed to load. Ensure your Gemini API Key is valid.",
      thematicMotifs: ["Drama", "Storytelling"],
      vibeCheck: "A compelling cinematic feature.",
    };
  }
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movieId = parseInt(id, 10);

  if (isNaN(movieId)) {
    notFound();
  }

  // Fetch movie data from TMDB (or local mock fallback)
  const movie = await getMovieDetails(movieId, process.env.TMDB_API_KEY);

  if (!movie) {
    notFound();
  }

  // Fetch dynamic AI insights using Gemini
  const insights = await fetchAIInsights(
    movie.id,
    movie.title,
    movie.overview,
    movie.genres
  );

  return (
    <div className="relative min-h-screen pb-16">
      
      {/* ── Background Backdrop Overlay ─────────────────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-[60vh] -z-10 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={movie.backdropPath}
          alt=""
          className="w-full h-full object-cover opacity-20 blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm font-semibold transition group w-fit"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
          Back to Discover
        </Link>

        {/* ── Movie Summary Spotlight ────────────────────────────────────── */}
        <section className="flex flex-col md:flex-row gap-8 md:gap-12">
          
          {/* Poster Card */}
          <div className="w-64 sm:w-72 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 mx-auto md:mx-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={movie.posterPath}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details / Text */}
          <div className="flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Title & Metadata */}
              <div className="space-y-2 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 text-sm text-zinc-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="text-white font-bold">{movie.rating.toFixed(1)}</span>
                  </span>
                  <span className="text-zinc-700">•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{movie.releaseDate.split("-")[0]}</span>
                  </span>
                  {movie.runtime && (
                    <>
                      <span className="text-zinc-700">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{movie.runtime} mins</span>
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Genres Row */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {movie.genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-300"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Synopsis</h3>
                <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                  {movie.overview}
                </p>
              </div>

              {movie.director && (
                <div className="text-center md:text-left text-sm text-zinc-400">
                  <span className="font-bold text-zinc-500 uppercase tracking-wider text-xs mr-2">Director</span>
                  <span className="text-white font-medium">{movie.director}</span>
                </div>
              )}

            </div>

            {/* Interactive Actions wrapper */}
            <MovieDetailsActions movie={movie} />

          </div>
        </section>

        {/* ── Grid: Cast list & AI Insights Card ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
          
          {/* Cast members list */}
          <section className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Cast & Crew</h2>
            {movie.cast && movie.cast.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {movie.cast.map((actor) => (
                  <div
                    key={actor.id}
                    className="p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/60 flex items-center gap-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={actor.profilePath || `https://api.dicebear.com/7.x/adventurer/svg?seed=${actor.name}`}
                      alt={actor.name}
                      className="h-10 w-10 rounded-full border border-zinc-850 object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{actor.name}</p>
                      <p className="text-[10px] text-zinc-500 truncate mt-0.5">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-600 text-sm">Cast list not available.</p>
            )}
          </section>

          {/* AI Insights Card */}
          <section className="p-6 rounded-2xl bg-gradient-to-tr from-violet-500/5 to-indigo-500/5 border border-violet-500/20 space-y-5 flex flex-col justify-between shadow-lg shadow-violet-500/5">
            <div className="space-y-4">
              
              {/* Header */}
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-400 animate-pulse" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-violet-400">AI Insights</h2>
              </div>

              {/* Vibe description */}
              <div className="space-y-1.5 p-3.5 bg-violet-950/20 rounded-xl border border-violet-500/10">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-400">Vibe check</span>
                <p className="text-zinc-200 text-xs italic leading-relaxed">
                  "{insights.vibeCheck}"
                </p>
              </div>

              {/* Content advisory */}
              <div className="space-y-1.5">
                <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Content Advisory
                </span>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {insights.contentAdvisory}
                </p>
              </div>

              {/* Thematic motifs */}
              <div className="space-y-2">
                <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Thematic Motifs
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {insights.thematicMotifs.map((motif) => (
                    <span
                      key={motif}
                      className="px-2.5 py-1 rounded bg-violet-500/10 text-violet-300 border border-violet-500/10 text-[10px] font-bold"
                    >
                      {motif}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Service identifier */}
            <p className="text-[10px] text-zinc-700 font-medium pt-4 border-t border-zinc-800/80">
              Analysis provided by Google Gemini 3.6 Flash.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
