/**
 * Centralized AI Model Configuration & System Prompt
 * Assignment: FE-06 — Streaming AI Chat Interface
 * 
 * This module consolidates:
 * - Model endpoints and parameters (Gemini 3.6 Flash / Claude fallback)
 * - Persona and system instruction
 * - Token limits and generation parameters
 * - Server-side key resolution logic
 */

export interface MessagePart {
  role: "user" | "assistant" | "system";
  content: string;
}

export const AI_CONFIG = {
  // Primary model for fast, low-latency token streaming
  modelName: "gemini-3.6-flash",
  
  // Generation parameters
  temperature: 0.7,
  topP: 0.95,
  maxOutputTokens: 2048,

  // Cinematic Persona System Prompt
  systemInstruction: `You are CineBot, an expert AI Cinematic Consultant and Film Analyst for FlyMovie.
Your mission is to help movie watchers discover incredible films, analyze cinematographic styles, explain complex plot twists, discuss director motifs, and give tailored recommendations based on mood, vibe, and pacing.

Guidelines:
- Tone: Passionate, knowledgeable, articulate, and engaging (like a top-tier film critic who loves cinema).
- Formatting: Use structured Markdown with bold titles, bullet points, and short readable paragraphs.
- Specificity: Mention release years, directors, lead actors, and distinct thematic elements when recommending films.
- Conciseness: Keep responses punchy and avoid filler so streaming tokens read smoothly.
- Spoilers: Always include a clear **[Spoiler Warning]** before describing major plot twists.`,
};

/**
 * Resolves API keys with security precedence:
 * 1. Client-supplied custom header (if user inputted personal key in settings)
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
