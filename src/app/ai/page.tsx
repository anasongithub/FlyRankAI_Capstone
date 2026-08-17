import type { Metadata } from "next";
import { Cpu, MessageSquare, Sparkles, Search, ThumbsUp } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Assistant",
  description: "Get personalised AI-powered movie recommendations and search in natural language.",
};

const PLANNED_FEATURES = [
  {
    icon: MessageSquare,
    title: "Natural Language Search",
    description: 'Type something like "find me a tense thriller set in space" and get instant, relevant results.',
  },
  {
    icon: Sparkles,
    title: "Mood-Based Recommendations",
    description: "Tell Claude how you feel right now and it curates a shortlist of films that match your vibe.",
  },
  {
    icon: ThumbsUp,
    title: "Taste Profile",
    description: "The more you rate and save, the smarter your recommendations become over time.",
  },
  {
    icon: Search,
    title: "Deep Movie Q&A",
    description: 'Ask "What are the themes in Parasite?" or "Is Dune: Part Two appropriate for kids?" — Claude answers.',
  },
];

export default function AIPage() {
  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center text-center">

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-8">
        <Sparkles className="h-3.5 w-3.5" />
        Coming in Capstone Phase 2
      </div>

      {/* Icon */}
      <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-xl shadow-violet-500/20 mb-6">
        <Cpu className="h-10 w-10 text-white" />
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
        AI Movie Assistant
      </h1>
      <p className="text-zinc-400 text-lg max-w-xl leading-relaxed mb-14">
        Powered by the Claude API, this screen lets you search and discover movies in plain English — no filters needed.
      </p>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full text-left mb-14">
        {PLANNED_FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-violet-500/10 transition">
                <Icon className="h-4.5 w-4.5 text-zinc-400 group-hover:text-violet-400 transition" />
              </div>
              <h3 className="font-bold text-zinc-200">{title}</h3>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
          </div>
        ))}
      </div>

      {/* Placeholder chat input */}
      <div className="w-full max-w-xl relative opacity-50 cursor-not-allowed" title="Available in Phase 2">
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 pl-5">
          <MessageSquare className="h-5 w-5 text-zinc-600 shrink-0" />
          <span className="text-zinc-600 text-sm flex-1 text-left">Ask anything about movies…</span>
          <div className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-600 text-xs font-semibold">
            Send
          </div>
        </div>
        <p className="text-[11px] text-zinc-700 mt-2 text-center">
          Requires <code className="text-zinc-600">ANTHROPIC_API_KEY</code> — set in Phase 2
        </p>
      </div>

    </div>
  );
}
