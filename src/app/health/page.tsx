import type { Metadata } from "next";
import { CheckCircle, XCircle, Clock, Server, Cpu, Database, Film } from "lucide-react";

export const metadata: Metadata = {
  title: "Health Check",
  description: "Live system status for the FlyMovie capstone deployment.",
};

// Revalidate every 30 seconds so preview deployments always show fresh data.
export const revalidate = 30;

// ── Types ──────────────────────────────────────────────────────────────────────
interface HealthPayload {
  status: string;
  timestamp: string;
  uptime_ms: number;
  app: string;
  version: string;
  environment: string;
  services: {
    tmdb: string;
    anthropic: string;
  };
}

interface ExternalMovie {
  id: number;
  title: string;
  year: number;
  genre: string[];
  rating: number;
}

// ── Data fetching ─────────────────────────────────────────────────────────────
async function fetchHealth(): Promise<HealthPayload | null> {
  try {
    // Build absolute URL — required for server-side fetch in Next.js.
    // Vercel sets VERCEL_URL automatically; for local dev NEXT_PUBLIC_APP_URL is used.
    const base =
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const res = await fetch(`${base}/api/health`, {
      next: { revalidate: 30 },
      headers: { "Accept": "application/json" },
    });

    if (!res.ok) return null;
    return res.json() as Promise<HealthPayload>;
  } catch {
    return null;
  }
}

async function fetchExternalMovies(): Promise<ExternalMovie[]> {
  try {
    // Free public movie API — no API key needed. Demonstrates that this Server
    // Component can fetch external data at build / request time.
    const res = await fetch(
      "https://freetestapi.com/api/v1/movies?limit=6",
      { next: { revalidate: 3600 } }, // cache for 1 hour
    );
    if (!res.ok) return [];
    return res.json() as Promise<ExternalMovie[]>;
  } catch {
    return [];
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function StatusBadge({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
      <CheckCircle className="h-3.5 w-3.5" />
      OK
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
      <XCircle className="h-3.5 w-3.5" />
      DOWN
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-zinc-800 last:border-0">
      <span className="text-zinc-500 text-sm">{label}</span>
      <span className="text-zinc-200 text-sm font-medium font-mono">{value}</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function HealthPage() {
  // Run both fetches in parallel
  const [health, externalMovies] = await Promise.all([
    fetchHealth(),
    fetchExternalMovies(),
  ]);

  const isHealthy = health?.status === "ok";
  const uptimeSeconds = health ? Math.round(health.uptime_ms / 1000) : null;

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Health Check</h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            Live deployment status · revalidates every 30 s
          </p>
        </div>
        {health ? <StatusBadge ok={isHealthy} /> : <StatusBadge ok={false} />}
      </div>

      {/* Internal API card */}
      <section className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1">
        <div className="flex items-center gap-2 mb-4">
          <Server className="h-5 w-5 text-zinc-400" />
          <h2 className="font-bold text-zinc-200">Internal API <code className="text-zinc-600 text-xs">/api/health</code></h2>
        </div>

        {health ? (
          <>
            <InfoRow label="App"         value={`${health.app} v${health.version}`} />
            <InfoRow label="Environment" value={health.environment} />
            <InfoRow label="Timestamp"   value={health.timestamp} />
            {uptimeSeconds !== null && (
              <InfoRow label="Process uptime" value={`${uptimeSeconds}s`} />
            )}
          </>
        ) : (
          <p className="text-rose-400 text-sm">
            Could not reach <code>/api/health</code>. Check that the server is running.
          </p>
        )}
      </section>

      {/* Services card */}
      {health && (
        <section className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="h-5 w-5 text-zinc-400" />
            <h2 className="font-bold text-zinc-200">Services</h2>
          </div>

          <div className="space-y-3">
            {Object.entries(health.services).map(([name, status]) => {
              const configured = status === "configured";
              return (
                <div key={name} className="flex items-start gap-3">
                  {configured
                    ? <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    : <XCircle    className="h-4 w-4 text-zinc-600   shrink-0 mt-0.5" />
                  }
                  <div>
                    <p className={`text-sm font-semibold ${configured ? "text-emerald-400" : "text-zinc-500"}`}>
                      {name.toUpperCase()}
                    </p>
                    <p className="text-xs text-zinc-600">{status}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* External data fetch card */}
      <section className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <div className="flex items-center gap-2 mb-1">
          <Database className="h-5 w-5 text-zinc-400" />
          <h2 className="font-bold text-zinc-200">External Data Fetch</h2>
        </div>
        <p className="text-xs text-zinc-600 mb-4">
          Server Component fetch to <code>freetestapi.com/api/v1/movies</code> — no API key required.
        </p>

        {externalMovies.length > 0 ? (
          <ul className="divide-y divide-zinc-800">
            {externalMovies.map((m) => (
              <li key={m.id} className="py-2.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <Film className="h-4 w-4 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{m.title}</p>
                    <p className="text-xs text-zinc-600">{m.year} · {m.genre?.join(", ")}</p>
                  </div>
                </div>
                <span className="text-amber-400 font-bold text-sm shrink-0">★ {m.rating}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-600 text-sm">
            External fetch returned no data (may be unavailable or rate-limited).
          </p>
        )}
      </section>

      {/* Timestamp footer */}
      <p className="text-center text-xs text-zinc-700 flex items-center justify-center gap-1.5">
        <Clock className="h-3.5 w-3.5" />
        Page rendered at server time · ISR revalidation every 30 s
      </p>
    </div>
  );
}
