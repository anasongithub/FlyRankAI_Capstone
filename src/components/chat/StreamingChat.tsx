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
} from "lucide-react";
import { useStreamingChat, ChatMessage } from "../../hooks/useStreamingChat";
import { ToolCallRenderer } from "./ToolCallRenderer";

const STARTER_PROMPTS = [
  { label: "Analyze Inception's cinematography", icon: "🎬", desc: "Calls fetchMovieDeepDive tool" },
  { label: "Compare Inception vs Interstellar", icon: "⚖️", desc: "Calls compareFilms tool" },
  { label: "Deep dive on The Dark Knight", icon: "🦇", desc: "Generates film dynamics card" },
  { label: "Suggest a cozy, heartwarming comfort movie", icon: "☕", desc: "Natural language recommendation" },
];

export function StreamingChat() {
  const {
    messages,
    input,
    setInput,
    sendMessage,
    retryTool,
    stopGeneration,
    clearChat,
    isStreaming,
    isThinking,
    error,
  } = useStreamingChat();

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Check if scroll is pinned to bottom
  const checkIfAtBottom = () => {
    const el = scrollContainerRef.current;
    if (!el) return true;
    const threshold = 100; // px from bottom
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

  // Auto-scroll when messages update, but ONLY if user is already at the bottom
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom("auto");
    }
  }, [messages, isThinking, isAtBottom]);

  // Handle Enter key for sending (Shift+Enter for new lines)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && input.trim()) {
        sendMessage();
      }
    }
  };

  return (
    <div className="flex flex-col h-[78vh] max-h-[850px] w-full max-w-4xl mx-auto bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Clapperboard className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-white">CineBot Generative Studio</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Tools & Stream
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">
              Generative UI with typed Zod tools & SSE streaming
            </p>
          </div>
        </div>

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

      {/* Message Thread Scroll Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth"
      >
        {/* Empty state & Starter chips */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-10 max-w-lg mx-auto space-y-6 animate-fade-in">
            <div className="h-14 w-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Sparkles className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-zinc-100">
                AI Cinematic Consultant with Generative UI
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Ask CineBot questions or trigger server-side tools that render interactive cards,
                comparative charts, and direct watchlist actions.
              </p>
            </div>

            {/* Quick Starters */}
            <div className="w-full space-y-2 pt-2 text-left">
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest text-center">
                Suggested Prompts & Tool Invocations
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STARTER_PROMPTS.map((promptObj, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => sendMessage(promptObj.label)}
                    disabled={isStreaming}
                    className="p-3 text-left bg-zinc-950/40 hover:bg-zinc-800/50 border border-zinc-800/80 rounded-xl text-zinc-300 hover:text-white transition flex flex-col justify-between group gap-1"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold flex items-center gap-1.5">
                        <span>{promptObj.icon}</span>
                        <span className="line-clamp-1">{promptObj.label}</span>
                      </span>
                      <Send className="h-3 w-3 text-zinc-600 group-hover:text-violet-400 shrink-0 ml-2" />
                    </div>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Wrench className="h-2.5 w-2.5 text-violet-400" />
                      {promptObj.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message items */}
        {messages.map((msg: ChatMessage) => {
          const isUser = msg.role === "user";
          const isAssistant = msg.role === "assistant";
          const isEmpty = msg.content.trim().length === 0;

          // Render thinking state for empty assistant message during streaming
          if (isAssistant && isEmpty && isThinking && (!msg.tools || msg.tools.length === 0)) {
            return (
              <div key={msg.id} className="flex gap-3 items-start animate-fade-in">
                <div className="h-8 w-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl text-xs text-zinc-400 flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-violet-400 animate-ping" />
                  <span className="font-medium animate-pulse">CineBot is consulting film database...</span>
                </div>
              </div>
            );
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

              {/* Bubble & Generative UI Tools */}
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

        {/* Stream Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Floating "Jump to Latest" Button when scrolled up */}
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

      {/* Sticky Bottom Input Bar */}
      <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/60 backdrop-blur-lg">
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
              placeholder="Ask a question or try 'Analyze Inception' / 'Compare Inception vs Interstellar'..."
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none transition resize-none disabled:opacity-60 max-h-32"
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
