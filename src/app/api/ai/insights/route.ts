import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, overview, genres } = body;

    if (!id || !title) {
      return NextResponse.json(
        { error: "Missing movie details (id and title required)" },
        { status: 400 }
      );
    }

    const clientGeminiKey = request.headers.get("x-gemini-key") || "";
    const geminiApiKey = clientGeminiKey.trim() || process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY || "";

    // If Gemini key is missing, return a friendly placeholder response.
    // This allows key-less users to view clean layout stats without errors.
    if (!geminiApiKey) {
      return NextResponse.json(getFallbackInsights(title));
    }

    const systemPrompt = `You are a professional film analyst.
Analyze this movie:
Title: "${title}"
Genres: ${genres?.join(", ") || "Unknown"}
Overview: "${overview || ""}"

Generate thematic insights, age advisories, and a mood-check for this movie.
Return your response strictly in the following JSON format:
{
  "contentAdvisory": "Detailed content and suitability advice (e.g. PG-13 guidelines, intensity notes, triggers)",
  "thematicMotifs": ["Motif 1", "Motif 2", "Motif 3"], // Motifs should be 1-2 words (e.g. "Sacrifice", "Isolation", "Identity")
  "vibeCheck": "A 1-sentence description of the emotional/artistic vibe of this movie."
}

Only output valid JSON. Do not include markdown wraps (like \`\`\`json).`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`;

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
      console.warn(`Gemini API failed with status ${geminiRes.status}, falling back to static generation.`);
      return NextResponse.json(getFallbackInsights(title));
    }

    const geminiData = await geminiRes.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!responseText) {
      return NextResponse.json(getFallbackInsights(title));
    }

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("JSON parsing failed");
      }
    }

    return NextResponse.json({
      contentAdvisory: parsed.contentAdvisory || "General viewing suitability.",
      thematicMotifs: parsed.thematicMotifs || ["Cinema", "Drama"],
      vibeCheck: parsed.vibeCheck || "Cinematic and engaging.",
    });

  } catch (error) {
    console.error("AI Insights Error:", error);
    // Return mock fallback on error to ensure page accessibility and stability
    const title = "the movie";
    return NextResponse.json(getFallbackInsights(title));
  }
}

// Fallback generator for offline/key-less environments (Resilience)
function getFallbackInsights(title: string) {
  return {
    contentAdvisory: "Content information is dynamically loaded when the Gemini API Key is configured in settings.",
    thematicMotifs: ["Human Condition", "Drama", "Storytelling"],
    vibeCheck: `Explore the themes and narrative structure of ${title}.`,
  };
}
