import { NextResponse } from "next/server";

// Health-check API endpoint.
// Vercel / any monitoring tool can hit GET /api/health to confirm the
// deployment is alive and that env vars are wired up correctly.

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // always evaluate; never cache

export async function GET() {
  const now = new Date();

  const payload = {
    status: "ok",
    timestamp: now.toISOString(),
    uptime_ms: process.uptime() * 1000,
    app: "FlyMovie",
    version: "2.0.0-capstone-skeleton",
    environment: process.env.NODE_ENV ?? "unknown",
    // Surface which services are configured without leaking key values
    services: {
      tmdb: process.env.TMDB_API_KEY
        ? "configured"
        : "not configured — app uses mock movie database",
      anthropic: process.env.ANTHROPIC_API_KEY
        ? "configured"
        : "not configured — AI Assistant requires this key in Phase 2",
    },
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      // Allow public access for monitoring tools
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
