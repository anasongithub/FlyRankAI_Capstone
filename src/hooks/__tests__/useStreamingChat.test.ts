import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useStreamingChat } from "../useStreamingChat";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
});

describe("useStreamingChat Hook (FE-06 Streaming Chat)", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("should initialize with default states and empty messages", () => {
    const { result } = renderHook(() => useStreamingChat());

    expect(result.current.messages).toEqual([]);
    expect(result.current.input).toBe("");
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.isThinking).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should update input state when setInput is called", () => {
    const { result } = renderHook(() => useStreamingChat());

    act(() => {
      result.current.setInput("Recommend sci-fi films");
    });

    expect(result.current.input).toBe("Recommend sci-fi films");
  });

  it("should reset state and remove from localStorage on clearChat()", () => {
    const { result } = renderHook(() => useStreamingChat());

    act(() => {
      result.current.clearChat();
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isStreaming).toBe(false);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("flymovie_chat_history");
  });

  it("should handle stopGeneration by resetting streaming flags", () => {
    const { result } = renderHook(() => useStreamingChat());

    act(() => {
      result.current.stopGeneration();
    });

    expect(result.current.isStreaming).toBe(false);
    expect(result.current.isThinking).toBe(false);
  });

  it("should handle streaming chunks and transition from thinking to streaming", async () => {
    // Create a mock stream with two text chunks
    const mockChunks = ["Hello, ", "I am CineBot."];
    const encoder = new TextEncoder();

    const mockReadableStream = new ReadableStream({
      start(controller) {
        for (const chunk of mockChunks) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      },
    });

    (global.fetch as any).mockResolvedValue({
      ok: true,
      body: mockReadableStream,
    });

    const { result } = renderHook(() => useStreamingChat());

    act(() => {
      result.current.sendMessage("Hello CineBot");
    });

    // Initially should be streaming
    expect(result.current.isStreaming).toBe(true);

    // Wait for the stream to complete and update messages
    await waitFor(() => expect(result.current.isStreaming).toBe(false));

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0].role).toBe("user");
    expect(result.current.messages[0].content).toBe("Hello CineBot");
    expect(result.current.messages[1].role).toBe("assistant");
    expect(result.current.messages[1].content).toBe("Hello, I am CineBot.");
  });

  it("should handle server error response gracefully", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: "Gemini API key is not configured." }),
    });

    const { result } = renderHook(() => useStreamingChat());

    act(() => {
      result.current.sendMessage("Test error");
    });

    await waitFor(() => expect(result.current.isStreaming).toBe(false));

    expect(result.current.error).toBe("Gemini API key is not configured.");
  });
});
