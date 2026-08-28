"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSettings } from "./useSettings";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const STORAGE_KEY = "flymovie_chat_history";

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
   * - Re-enables the input so the user can send another message right away
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
   * Sends a message and consumes the SSE token stream
   */
  const sendMessage = useCallback(
    async (overrideText?: string) => {
      const textToSend = (overrideText ?? input).trim();
      if (!textToSend || isStreaming) return;

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

      // Set thinking state before first token arrives
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
            // First token handoff: turn off thinking indicator seamlessly
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
      } catch (err: any) {
        if (err.name === "AbortError") {
          // Stream cancelled by user via Stop button — keep partial response
          console.log("Chat stream intentionally stopped by user.");
        } else {
          console.error("Streaming error:", err);
          setError(err.message || "Failed to communicate with the streaming model.");
          // Remove empty assistant placeholder if failed before any tokens
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
    [input, isStreaming, messages, settings.geminiApiKey]
  );

  return {
    messages,
    input,
    setInput,
    sendMessage,
    stopGeneration,
    clearChat,
    isStreaming,
    isThinking,
    error,
    isLoaded,
  };
}
