"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSettings } from "./useSettings";
import { ToolPart } from "../components/chat/ToolCallRenderer";
import {
  executeFetchMovieDeepDive,
  executeCompareFilms,
} from "../lib/ai/tools";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  tools?: ToolPart[];
}

const STORAGE_KEY = "flymovie_chat_history_v2";

export function useStreamingChat() {
  const { settings } = useSettings();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load chat history from localStorage safely after hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync messages to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages, isLoaded]);

  // Clean up any ongoing stream on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Stop generation mid-stream:
   * - Aborts the active network stream
   * - Preserves the partial message accumulated so far
   * - Resets streaming and thinking state flags immediately
   */
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setIsThinking(false);
  }, []);

  /**
   * Clears the entire chat history
   */
  const clearChat = useCallback(() => {
    stopGeneration();
    setMessages([]);
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, [stopGeneration]);

  /**
   * Executes a tool and transitions through the 4 states:
   * input-streaming -> input-available -> output-available (or output-error)
   */
  const handleExecuteTool = useCallback(
    async (toolName: string, toolInput: any, msgId: string, toolCallId: string) => {
      // 1. input-available state
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== msgId) return msg;
          const updatedTools = (msg.tools || []).map((t) =>
            t.toolCallId === toolCallId
              ? { ...t, state: "input-available" as const, input: toolInput }
              : t
          );
          return { ...msg, tools: updatedTools };
        })
      );

      try {
        let output: any = null;

        if (toolName === "fetchMovieDeepDive") {
          output = await executeFetchMovieDeepDive(toolInput, settings.tmdbApiKey);
        } else if (toolName === "compareFilms") {
          output = await executeCompareFilms(toolInput, settings.tmdbApiKey);
        } else if (toolName === "quickAddToWatchlist") {
          output = toolInput;
        } else {
          throw new Error(`Unrecognized tool name: '${toolName}'`);
        }

        // 2. output-available state
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id !== msgId) return msg;
            const updatedTools = (msg.tools || []).map((t) =>
              t.toolCallId === toolCallId
                ? { ...t, state: "output-available" as const, output }
                : t
            );
            return { ...msg, tools: updatedTools };
          })
        );
      } catch (err: any) {
        // 3. output-error state
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id !== msgId) return msg;
            const updatedTools = (msg.tools || []).map((t) =>
              t.toolCallId === toolCallId
                ? {
                    ...t,
                    state: "output-error" as const,
                    error: err.message || "Failed to execute tool query",
                  }
                : t
            );
            return { ...msg, tools: updatedTools };
          })
        );
      }
    },
    [settings.tmdbApiKey]
  );

  /**
   * Retry a failed tool call
   */
  const retryTool = useCallback(
    (toolCallId: string) => {
      for (const msg of messages) {
        const foundTool = (msg.tools || []).find((t) => t.toolCallId === toolCallId);
        if (foundTool && foundTool.input) {
          handleExecuteTool(foundTool.toolName, foundTool.input, msg.id, toolCallId);
          break;
        }
      }
    },
    [messages, handleExecuteTool]
  );

  /**
   * Helper to trigger manual tool demo directly (e.g. from starter chips)
   */
  const runDirectTool = useCallback(
    async (toolName: string, toolInput: any, promptText: string) => {
      if (isStreaming) return;
      setError(null);

      const userMsgId = `user-${Date.now()}`;
      const userMessage: ChatMessage = {
        id: userMsgId,
        role: "user",
        content: promptText,
        timestamp: Date.now(),
      };

      const toolCallId = `tool-${Date.now()}`;
      const initialTool: ToolPart = {
        toolCallId,
        toolName,
        state: "input-streaming",
        input: toolInput,
      };

      const assistantMsgId = `assistant-${Date.now()}`;
      const assistantMessage: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: `I've triggered the **${toolName}** generative tool for your request. Here are the structured results:`,
        timestamp: Date.now(),
        tools: [initialTool],
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);

      // Execute tool
      setTimeout(() => {
        handleExecuteTool(toolName, toolInput, assistantMsgId, toolCallId);
      }, 400);
    },
    [isStreaming, handleExecuteTool]
  );

  /**
   * Sends a message and consumes the SSE token stream with tool call parsing
   */
  const sendMessage = useCallback(
    async (overrideText?: string) => {
      const textToSend = (overrideText ?? input).trim();
      if (!textToSend || isStreaming) return;

      // Smart Intent Check for Direct Tool Routing
      const lower = textToSend.toLowerCase();
      if (lower.startsWith("analyze ") || lower.includes("deep dive on ") || lower.includes("cinematography of ")) {
        const movieName = textToSend
          .replace(/analyze\s+/i, "")
          .replace(/deep\s+dive\s+on\s+/i, "")
          .replace(/cinematography\s+of\s+/i, "")
          .replace(/['"]+/g, "")
          .trim();
        if (movieName) {
          setInput("");
          return runDirectTool("fetchMovieDeepDive", { movieTitle: movieName }, textToSend);
        }
      }

      if (lower.includes(" vs ") || lower.includes("compare ")) {
        const match = textToSend.match(/(?:compare\s+)?(.+?)\s+vs\s+(.+)/i);
        if (match && match[1] && match[2]) {
          setInput("");
          return runDirectTool(
            "compareFilms",
            { filmA: match[1].trim(), filmB: match[2].trim() },
            textToSend
          );
        }
      }

      setError(null);
      setInput("");

      const userMsgId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const userMessage: ChatMessage = {
        id: userMsgId,
        role: "user",
        content: textToSend,
        timestamp: Date.now(),
      };

      const assistantMsgId = `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const placeholderAssistant: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };

      const newHistory = [...messages, userMessage];
      setMessages([...newHistory, placeholderAssistant]);

      setIsThinking(true);
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-gemini-key": settings.geminiApiKey || "",
          },
          body: JSON.stringify({
            messages: newHistory.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Server responded with status ${response.status}`
          );
        }

        if (!response.body) {
          throw new Error("No response body available from streaming endpoint.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = "";
        let firstTokenReceived = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          if (chunk) {
            if (!firstTokenReceived) {
              firstTokenReceived = true;
              setIsThinking(false);
            }

            accumulatedText += chunk;

            // Stream token into current assistant message
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, content: accumulatedText }
                  : msg
              )
            );
          }
        }

        // Check if accumulated response contains a ```tool_call block
        const toolCallRegex = /```tool_call\s*([\s\S]*?)\s*```/;
        const match = accumulatedText.match(toolCallRegex);

        if (match && match[1]) {
          try {
            const parsed = JSON.parse(match[1]);
            const toolCallId = `tool-${Date.now()}`;
            const initialTool: ToolPart = {
              toolCallId,
              toolName: parsed.toolName,
              state: "input-streaming",
              input: parsed.input,
            };

            // Remove the raw tool_call markdown block from the visible chat text
            const cleanedText = accumulatedText.replace(toolCallRegex, "").trim();

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, content: cleanedText, tools: [initialTool] }
                  : msg
              )
            );

            // Execute the tool and transition state to output-available
            handleExecuteTool(parsed.toolName, parsed.input, assistantMsgId, toolCallId);
          } catch (e) {
            console.error("Failed to parse tool call JSON:", e);
          }
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Chat stream stopped by user.");
        } else {
          console.error("Streaming error:", err);
          setError(err.message || "Failed to communicate with the streaming model.");
          setMessages((prev) =>
            prev.filter((m) => m.id !== assistantMsgId || m.content.length > 0)
          );
        }
      } finally {
        setIsStreaming(false);
        setIsThinking(false);
        abortControllerRef.current = null;
      }
    },
    [input, isStreaming, messages, settings.geminiApiKey, handleExecuteTool, runDirectTool]
  );

  return {
    messages,
    input,
    setInput,
    sendMessage,
    runDirectTool,
    retryTool,
    stopGeneration,
    clearChat,
    isStreaming,
    isThinking,
    error,
    isLoaded,
  };
}
