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
  isInterrupted?: boolean;
}

export type ChatErrorType =
  | "network"
  | "stream_interrupted"
  | "rate_limit"
  | "auth"
  | "general";

export interface ChatErrorInfo {
  message: string;
  type: ChatErrorType;
  failedPrompt?: string;
  status?: number;
  timestamp: number;
}

const STORAGE_KEY = "flymovie_chat_history_v2";

export function useStreamingChat() {
  const { settings } = useSettings();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [errorInfo, setErrorInfo] = useState<ChatErrorInfo | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryLockRef = useRef(false);

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
   * - Aborts active network stream
   * - Preserves the partial message accumulated so far
   * - Marks message as interrupted
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
    setErrorInfo(null);
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
      // Sabotage check for tool errors
      if (toolInput?.movieTitle === "__sabotage_tool_error__") {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id !== msgId) return msg;
            const updatedTools = (msg.tools || []).map((t) =>
              t.toolCallId === toolCallId
                ? {
                    ...t,
                    state: "output-error" as const,
                    error: "Sabotage Test: Synthetic tool schema mismatch occurred.",
                  }
                : t
            );
            return { ...msg, tools: updatedTools };
          })
        );
        return;
      }

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
      setErrorInfo(null);

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

      setTimeout(() => {
        handleExecuteTool(toolName, toolInput, assistantMsgId, toolCallId);
      }, 400);
    },
    [isStreaming, handleExecuteTool]
  );

  /**
   * Sends a message and consumes the SSE token stream with tool call parsing & sabotage handling
   */
  const sendMessage = useCallback(
    async (overrideText?: string, isRetryCall = false) => {
      const textToSend = (overrideText ?? input).trim();
      if (!textToSend || isStreaming) return;

      // Sabotage Intent: Network offline before send
      if (textToSend === "__sabotage_network__") {
        setInput("");
        setErrorInfo({
          message: "Network unreachable. Please check your internet connection.",
          type: "network",
          failedPrompt: "__sabotage_network__",
          timestamp: Date.now(),
        });
        return;
      }

      // Smart Intent Check for Direct Tool Routing
      const lower = textToSend.toLowerCase();
      if (
        lower.startsWith("analyze ") ||
        lower.includes("deep dive on ") ||
        lower.includes("cinematography of ")
      ) {
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

      setErrorInfo(null);
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

      // If this was a retry call, remove the last failed placeholder if any
      let currentHistory = messages;
      if (isRetryCall && currentHistory.length > 0 && currentHistory[currentHistory.length - 1].role === "user") {
        // already has the user message
        setMessages([...currentHistory, placeholderAssistant]);
      } else {
        currentHistory = [...messages, userMessage];
        setMessages([...currentHistory, placeholderAssistant]);
      }

      setIsThinking(true);
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      let accumulatedText = "";

      try {
        // Sabotage Intent: 429 Rate Limit Simulation
        if (textToSend === "__sabotage_429__") {
          throw new Error("HTTP 429: Too Many Requests. Model rate limit exceeded. Please wait 10 seconds.");
        }

        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-gemini-key": settings.geminiApiKey || "",
          },
          body: JSON.stringify({
            messages: currentHistory.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const status = response.status;
          let type: ChatErrorType = "general";
          if (status === 429) type = "rate_limit";
          else if (status === 401 || status === 403) type = "auth";

          const errorObj = new Error(
            errorData.error || `Server responded with status ${response.status}`
          );
          (errorObj as any).status = status;
          (errorObj as any).type = type;
          throw errorObj;
        }

        if (!response.body) {
          throw new Error("No response body available from streaming endpoint.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let firstTokenReceived = false;
        let tokenCount = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          if (chunk) {
            tokenCount++;

            // Sabotage Intent: Mid-stream disconnect after 3 tokens
            if (textToSend === "__sabotage_stream_cut__" && tokenCount >= 3) {
              const cutError = new Error("Connection terminated mid-stream by server.");
              (cutError as any).type = "stream_interrupted";
              throw cutError;
            }

            if (!firstTokenReceived) {
              firstTokenReceived = true;
              setIsThinking(false);
            }

            accumulatedText += chunk;

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, content: accumulatedText }
                  : msg
              )
            );
          }
        }

        // Check tool call block
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

            const cleanedText = accumulatedText.replace(toolCallRegex, "").trim();

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, content: cleanedText, tools: [initialTool] }
                  : msg
              )
            );

            handleExecuteTool(parsed.toolName, parsed.input, assistantMsgId, toolCallId);
          } catch (e) {
            console.error("Failed to parse tool call JSON:", e);
          }
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Chat stream stopped by user.");
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMsgId ? { ...m, isInterrupted: true } : m))
          );
        } else {
          console.error("Streaming error:", err);

          let errorType: ChatErrorType = err.type || "general";
          if (!err.type) {
            const msg = err.message?.toLowerCase() || "";
            if (msg.includes("fetch") || msg.includes("network") || msg.includes("offline")) {
              errorType = "network";
            } else if (msg.includes("429") || msg.includes("rate limit")) {
              errorType = "rate_limit";
            } else if (msg.includes("401") || msg.includes("key") || msg.includes("auth")) {
              errorType = "auth";
            } else if (msg.includes("interrupted") || msg.includes("mid-stream")) {
              errorType = "stream_interrupted";
            }
          }

          setErrorInfo({
            message: err.message || "Failed to communicate with streaming service.",
            type: errorType,
            failedPrompt: textToSend,
            status: err.status,
            timestamp: Date.now(),
          });

          // If partial text was received, keep it from accumulatedText and mark interrupted; otherwise filter out empty placeholder
          setMessages((prev) => {
            const hasAccumulated = accumulatedText.trim().length > 0;
            if (!hasAccumulated) {
              return prev.filter((m) => m.id !== assistantMsgId);
            }
            const exists = prev.some((m) => m.id === assistantMsgId);
            if (!exists) {
              return [
                ...prev,
                {
                  id: assistantMsgId,
                  role: "assistant" as const,
                  content: accumulatedText,
                  timestamp: Date.now(),
                  isInterrupted: true,
                },
              ];
            }
            return prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: accumulatedText, isInterrupted: true }
                : m
            );
          });
        }
      } finally {
        setIsStreaming(false);
        setIsThinking(false);
        abortControllerRef.current = null;
      }
    },
    [input, isStreaming, messages, settings.geminiApiKey, handleExecuteTool, runDirectTool]
  );

  /**
   * Retry the last failed message with double-click protection
   */
  const retryLastMessage = useCallback(async () => {
    if (retryLockRef.current || isStreaming) return;
    if (!errorInfo?.failedPrompt) return;

    retryLockRef.current = true;
    setIsRetrying(true);

    const promptToRetry = errorInfo.failedPrompt;
    setErrorInfo(null);

    try {
      await sendMessage(promptToRetry, true);
    } finally {
      setTimeout(() => {
        retryLockRef.current = false;
        setIsRetrying(false);
      }, 500);
    }
  }, [errorInfo, isStreaming, sendMessage]);

  return {
    messages,
    input,
    setInput,
    sendMessage,
    retryLastMessage,
    runDirectTool,
    retryTool,
    stopGeneration,
    clearChat,
    isStreaming,
    isThinking,
    isRetrying,
    error: errorInfo?.message || null,
    errorInfo,
    isLoaded,
  };
}
