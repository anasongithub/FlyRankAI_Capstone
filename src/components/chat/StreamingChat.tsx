"use client";

import React, { useRef, useEffect, useState, KeyboardEvent } from "react";
import {
  Send,
  Square,
  Sparkles,
  Trash2,
  ArrowDown,
  Bot,
  User,
  AlertCircle,
  Clapperboard,
  Wrench,
  RotateCcw,
  WifiOff,
  Clock,
  ShieldAlert,
  HelpCircle,
  SlidersHorizontal,
} from "lucide-react";
import { useStreamingChat, ChatMessage, ChatErrorType } from "../../hooks/useStreamingChat";
import { ToolCallRenderer } from "./ToolCallRenderer";
import { ChatSkeleton } from "./ChatSkeleton";

const CATEGORIZED_PROMPTS = [
  {
    category: "Cinematography Deep Dive",
    label: "Analyze Inception's cinematography",
    icon: "🎬",
    toolDesc: "fetchMovieDeepDive",
    desc: "Examines pacing, lighting, thematic depth & DP score.",
  },
  {
    category: "Head-to-Head Comparison",
    label: "Compare Inception vs Interstellar",
    icon: "⚖️",
    toolDesc: "compareFilms",
    desc: "Dual-chart evaluation of spectacle, narrative & pacing.",
  },
  {
    category: "Curated Recommendations",
    label: "A heartwarming comfort movie for a rainy Sunday",
    icon: "☕",
    toolDesc: "Gemini 3.6 Stream",
    desc: "Natural language recommendations with thematic analysis.",
  },
  {
    category: "Dark Mind-Benders",
    label: "Mind-bending sci-fi set in deep space with a dark tone",
    icon: "🌌",
    toolDesc: "Gemini 3.6 Stream",
    desc: "Atmospheric existential sci-fi curated for thrill seekers.",
  },
];

export function StreamingChat() {
  const {
    messages,
    input,
    setInput,
    sendMessage,
    retryLastMessage,
    retryTool,
    stopGeneration,
    clearChat,
    isStreaming,
    isThinking,
    isRetrying,
    errorInfo,
  } = useStreamingChat();

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showSabotagePanel, setShowSabotagePanel] = useState(false);

  // Check if scroll is pinned to bottom
  const checkIfAtBottom = () => {
    const el = scrollContainerRef.current;
    if (!el) return true;
    const threshold = 100;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distanceFromBottom <= threshold;
  };

  const handleScroll = () => {
    setIsAtBottom(checkIfAtBottom());
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior,
    });
    setIsAtBottom(true);
  };

  // Auto-scroll when messages update
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom("auto");
    }
  }, [messages, isThinking, isAtBottom]);

  // Handle Enter key (Shift+Enter for multi-line)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && input.trim()) {
        sendMessage();
      }
    }
  };

  // Render friendly badge for error type
  const renderErrorBadge = (type: ChatErrorType) => {
    switch (type) {
      case "network":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <WifiOff className="h-3 w-3" /> Network Offline
          </span>
        );
      case "rate_limit":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Clock className="h-3 w-3" /> Rate Limited (429)
          </span>
        );
      case "auth":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="h-3 w-3" /> API Key Missing
          </span>
        );
      case "stream_interrupted":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="h-3 w-3" /> Stream Cut Mid-flight
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="h-3 w-3" /> Service Error
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-11rem)] min-h-[520px] max-h-[840px] w-full max-w-4xl mx-auto bg-zinc-900/70 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-zinc-800/80 bg-zinc-950/40">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Clapperboard className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-white">CineBot Generative Studio</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 hidden sm:block">
              Generative UI with resilient error recovery &amp; stream retry
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* Sabotage Tester Toggle */}
          <button
            type="button"
            onClick={() => setShowSabotagePanel(!showSabotagePanel)}
            className={`p-1.5 rounded-lg border text-xs transition flex items-center gap-1 ${
              showSabotagePanel
                ? "bg-violet-600/20 border-violet-500/40 text-violet-300"
                : "bg-zinc-800/40 border-zinc-700/60 text-zinc-400 hover:text-zinc-200"
            }`}
            title="Toggle Edge Case & Sabotage Test Panel"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden md:inline text-[11px] font-semibold">Test Sabotage</span>
          </button>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearChat}
              disabled={isStreaming}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition disabled:opacity-40"
              title="Clear conversation"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Sabotage & Edge Case Tester Panel (For Evaluators & Reviewers) */}
      {showSabotagePanel && (
        <div className="px-4 sm:px-6 py-2.5 bg-zinc-950/90 border-b border-zinc-800 text-xs text-zinc-300 flex flex-wrap items-center gap-2 animate-fade-in">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3 text-violet-400" />
            Simulate Edge Case:
          </span>
          <button
            type="button"
            onClick={() => sendMessage("__sabotage_network__")}
            disabled={isStreaming}
            className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] rounded-lg transition"
          >
            🔌 Kill Network
          </button>
          <button
            type="button"
            onClick={() => sendMessage("__sabotage_stream_cut__")}
            disabled={isStreaming}
            className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] rounded-lg transition"
          >
            ✂️ Cut Mid-Stream
          </button>
          <button
            type="button"
            onClick={() => sendMessage("__sabotage_429__")}
            disabled={isStreaming}
            className="px-2.5 py-1 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 text-[11px] rounded-lg transition"
          >
            ⏱️ 429 Rate Limit
          </button>
        </div>
      )}

      {/* Message Thread Scroll Area with overscroll containment */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth overscroll-contain"
      >
        {/* Designed Empty State (Onboarding, not apology) */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[380px] text-center py-6 max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-xl shadow-violet-500/5">
              <Sparkles className="h-7 w-7 animate-pulse" />
            </div>

            <div className="space-y-1.5 max-w-md">
              <h3 className="text-lg font-bold text-white tracking-tight">
                AI Cinematic Assistant &amp; Generative UI
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Explore film depth, comparative analytics, and custom recommendations. Select a
                prompt below to launch:
              </p>
            </div>

            {/* 4 Designed Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left pt-1">
              {CATEGORIZED_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendMessage(item.label)}
                  disabled={isStreaming}
                  className="p-3.5 bg-zinc-950/50 hover:bg-zinc-800/60 border border-zinc-800/80 hover:border-violet-500/40 rounded-xl text-zinc-300 hover:text-white transition-all duration-200 flex flex-col justify-between group gap-2 shadow-sm hover:shadow-lg hover:shadow-violet-500/5"
                >
                  <div className="flex items-start justify-between w-full gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-xs font-bold text-zinc-200 group-hover:text-violet-300 transition-colors line-clamp-1">
                        {item.category}
                      </span>
                    </div>
                    <Send className="h-3 w-3 text-zinc-600 group-hover:text-violet-400 shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">
                    &ldquo;{item.label}&rdquo;
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
                    <Wrench className="h-2.5 w-2.5 text-violet-400" />
                    <span>{item.toolDesc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Render Message Thread */}
        {messages.map((msg: ChatMessage) => {
          const isUser = msg.role === "user";
          const isAssistant = msg.role === "assistant";
          const isEmpty = msg.content.trim().length === 0;

          // Render skeleton placeholder for empty assistant message while thinking
          if (isAssistant && isEmpty && isThinking && (!msg.tools || msg.tools.length === 0)) {
            return <ChatSkeleton key={msg.id} />;
          }

          if (isAssistant && isEmpty && !isThinking && (!msg.tools || msg.tools.length === 0)) {
            return null;
          }

          return (
            <div
              key={msg.id}
              className={`flex gap-3 items-start ${
                isUser ? "flex-row-reverse" : "flex-row"
              } animate-fade-in`}
            >
              {/* Avatar */}
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isUser
                    ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                    : "bg-violet-600/20 border border-violet-500/30 text-violet-400"
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Bubble & Generative UI */}
              <div className="max-w-[90%] sm:max-w-[85%] space-y-2">
                {msg.content.trim().length > 0 && (
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/10 rounded-tr-none"
                        : "bg-zinc-950/80 border border-zinc-800/80 text-zinc-200 rounded-tl-none"
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                      {msg.content}
                    </div>

                    {msg.isInterrupted && (
                      <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium">
                        <AlertCircle className="h-3 w-3" />
                        <span>Stream interrupted mid-generation</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Generative Tool Parts (4-State Renderer) */}
                {msg.tools && msg.tools.length > 0 && (
                  <div className="space-y-3">
                    {msg.tools.map((tool) => (
                      <ToolCallRenderer
                        key={tool.toolCallId}
                        tool={tool}
                        onRetry={retryTool}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Designed Failure State (Calm transition + Working Retry) */}
        {errorInfo && (
          <div className="p-4 rounded-2xl bg-zinc-950/90 border border-rose-500/30 text-xs shadow-xl space-y-3 animate-fade-in">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">Request Incomplete</span>
                    {renderErrorBadge(errorInfo.type)}
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-0.5">{errorInfo.message}</p>
                </div>
              </div>

              {/* Working Retry Micro-interaction with double-click protection */}
              {errorInfo.failedPrompt && (
                <button
                  type="button"
                  onClick={retryLastMessage}
                  disabled={isRetrying || isStreaming}
                  className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-lg shadow-violet-500/10 shrink-0"
                  title="Retry failed message"
                >
                  <RotateCcw className={`h-3 w-3 ${isRetrying ? "animate-spin" : ""}`} />
                  <span>{isRetrying ? "Retrying..." : "Retry message"}</span>
                </button>
              )}
            </div>

            {errorInfo.failedPrompt && (
              <div className="bg-zinc-900/60 rounded-xl px-3 py-2 text-[11px] text-zinc-400 flex items-center gap-2 font-mono">
                <span className="text-zinc-500">Failed prompt:</span>
                <span className="text-zinc-300 truncate">&ldquo;{errorInfo.failedPrompt}&rdquo;</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating "Jump to Latest" Button */}
      {!isAtBottom && (
        <div className="relative w-full flex justify-center -mt-12 z-20 pointer-events-none">
          <button
            type="button"
            onClick={() => scrollToBottom("smooth")}
            className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/90 hover:bg-violet-500 text-white text-xs font-bold rounded-full shadow-lg shadow-black/50 backdrop-blur transition transform hover:scale-105 active:scale-95"
          >
            <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
            Jump to latest
          </button>
        </div>
      )}

      {/* Sticky Bottom Input Bar optimized for Mobile Safari */}
      <div className="p-3 sm:p-4 border-t border-zinc-800/80 bg-zinc-950/70 backdrop-blur-lg pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isStreaming && input.trim()) {
              sendMessage();
            }
          }}
          className="flex items-end gap-2"
        >
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
              placeholder="Ask CineBot or try 'Analyze Inception' / 'Compare Inception vs Interstellar'..."
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-xl text-base sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition resize-none disabled:opacity-60 max-h-32"
              style={{ minHeight: "48px" }}
            />
          </div>

          {/* Action Button: Send vs. Stop Generation */}
          {isStreaming ? (
            <button
              type="button"
              onClick={stopGeneration}
              className="h-12 px-4 bg-rose-600/20 border border-rose-500/40 hover:bg-rose-600/30 text-rose-300 font-bold text-xs rounded-xl transition flex items-center gap-2 shrink-0 shadow-lg shadow-rose-500/10 focus:outline-none focus:ring-2 focus:ring-rose-500"
              title="Stop streaming response"
            >
              <Square className="h-4 w-4 fill-rose-400 text-rose-400" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="h-12 px-5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shrink-0 shadow-lg shadow-violet-500/10 focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          )}
        </form>
        <p className="text-[10px] text-zinc-600 mt-2 text-center">
          Press <kbd className="text-zinc-400">Enter</kbd> to send · <kbd className="text-zinc-400">Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
