import { NextResponse } from "next/server";
import { Movie } from "../../../../types/movie";
// Import mock movies as a fallback dataset
import { getMovies } from "../../../../services/movieService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt query parameter" },
        { status: 400 }
      );
    }

    // Resolve API keys in order of precedence:
    // 1. Client-supplied headers (passed securely from settings UI)
    // 2. Server-side environment variables (.env.local / Vercel secrets)
    const clientGeminiKey = request.headers.get("x-gemini-key") || "";
    const clientTmdbKey   = request.headers.get("x-tmdb-key") || "";

    const geminiApiKey = clientGeminiKey.trim() || process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY || "";
    const tmdbApiKey   = clientTmdbKey.trim()   || process.env.TMDB_API_KEY || "";

    if (!geminiApiKey) {
      return NextResponse.json(
        { error: "Gemini API Key is missing. Add it in Settings to enable AI recommendations." },
        { status: 400 }
      );
    }

    // 1. Gather candidate movies to recommend from
    let candidates: Movie[] = [];
    try {
      // getMovies will call TMDB if tmdbApiKey is configured, or return local mocks
      candidates = await getMovies({ searchQuery: "", selectedGenre: "", minRating: 0, sortBy: "rating" }, tmdbApiKey);
    } catch (e) {
      console.error("Failed to fetch candidate movies:", e);
      // fallback to basic empty getMovies request which uses mock db
      candidates = await getMovies({ searchQuery: "", selectedGenre: "", minRating: 0, sortBy: "rating" });
    }

    if (!candidates || candidates.length === 0) {
      return NextResponse.json({ recommendations: [] });
    }

    // Map candidates to a compact layout to reduce token usage
    const compactCandidates = candidates.map(m => ({
      id: m.id,
      title: m.title,
      overview: m.overview.substring(0, 140) + "...",
      genres: m.genres,
      rating: m.rating,
      releaseDate: m.releaseDate,
    }));

    // 2. Query Gemini LLM to find the best matches
    const systemPrompt = `You are FlyMovie's AI Movie Recommender.
Analyze the user's request: "${prompt}".
Filter the candidate list below and choose the top 5 movies that best match the query.
For each selection, write a custom "reason" (max 2 sentences) describing why this movie matches the user's specific request or mood.

Return your response strictly in the following JSON format:
{
  "recommendations": [
    {
      "id": 12345, // Number. Must match the exact candidate ID
      "reason": "This is a custom match explanation directed to the user."
    }
  ]
}

Candidates:
${JSON.stringify(compactCandidates, null, 2)}

Only output valid JSON. Do not include markdown wraps (like \`\`\`json).`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      throw new Error(`Gemini API error: ${geminiRes.status} - ${errorText}`);
    }

    const geminiData = await geminiRes.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!responseText) {
      throw new Error("Empty response from Gemini API");
    }

    // Parse the structured recommendations
    let parsed: { recommendations: { id: number; reason: string }[] };
    try {
      parsed = JSON.parse(responseText);
    } catch {
      // Handle edge case where json wraps or text prefixes remain
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse Gemini output as JSON");
      }
    }

    // 3. Assemble full Movie data with custom AI reason
    const matchedList = (parsed.recommendations || [])
      .map(rec => {
        const fullMovie = candidates.find(c => c.id === rec.id);
        if (!fullMovie) return null;
        return {
          ...fullMovie,
          aiReason: rec.reason,
        };
      })
      .filter((m): m is Movie & { aiReason: string } => m !== null);

    return NextResponse.json({ recommendations: matchedList }, {
      headers: { "Cache-Control": "no-store" }
    });

  } catch (error: any) {
    console.error("AI Recommendation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process AI recommendations" },
      { status: 500 }
    );
  }
}
