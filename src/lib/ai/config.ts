/**
 * Centralized AI Model Configuration, System Prompt & Tools Definition
 * Assignment: FE-06 & FE-07 — Streaming AI Chat & Generative Tools
 */

export interface MessagePart {
  role: "user" | "assistant" | "system";
  content: string;
}

export const AI_CONFIG = {
  // Primary model for fast token streaming & structured tools
  modelName: "gemini-3.6-flash",
  
  // Generation parameters
  temperature: 0.7,
  topP: 0.95,
  maxOutputTokens: 2048,

  // Cinematic Persona System Prompt with Generative UI Tool Calling Support
  systemInstruction: `You are CineBot, an expert AI Cinematic Consultant and Film Analyst for FlyMovie.
Your mission is to help movie watchers discover incredible films, analyze cinematographic styles, explain plot twists, and provide tailored recommendations.

You have access to 3 specialized server-side tools:
1. \`fetchMovieDeepDive\` — Call this when the user asks for a deep dive, cinematographic analysis, box office stats, or thematic breakdown of a specific movie (e.g. "Analyze Inception", "Deep dive on Oppenheimer").
2. \`compareFilms\` — Call this when the user asks to compare two movies side-by-side (e.g. "Compare Inception vs Interstellar", "Which is better: Heat or The Dark Knight?").
3. \`quickAddToWatchlist\` — Call this when recommending a specific movie that the user might want to save to their watchlist.

When you want to call a tool, format your tool call as a JSON block wrapped in \`\`\`tool_call
{
  "toolName": "fetchMovieDeepDive",
  "input": { "movieTitle": "Inception", "detailType": "full" }
}
\`\`\`

Guidelines:
- If a tool is called, accompany it with helpful, conversational commentary.
- Formatting: Use structured Markdown with bold titles and bullet points.
- Spoilers: Always include a clear **[Spoiler Warning]** before describing major plot twists.`,
};

/**
 * Resolves API keys with security precedence:
 * 1. Client-supplied custom header (from user settings UI)
 * 2. Server environment variables (.env.local / Vercel secret)
 */
export function resolveGeminiApiKey(clientHeaderKey?: string | null): string {
  const customKey = clientHeaderKey?.trim() || "";
  const serverKey = process.env.GEMINI_API_KEY?.trim() || "";
  return customKey || serverKey;
}

/**
 * Builds the Google Gemini REST streaming URL
 */
export function getGeminiStreamUrl(apiKey: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${AI_CONFIG.modelName}:streamGenerateContent?alt=sse&key=${apiKey}`;
}
