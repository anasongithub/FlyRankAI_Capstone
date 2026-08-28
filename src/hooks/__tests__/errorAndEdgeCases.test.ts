import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
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

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("FE-08 Error States, Empty States & Edge Cases Suite", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("should ignore empty or whitespace-only input without creating phantom messages", async () => {
    const { result } = renderHook(() => useStreamingChat());

    await act(async () => {
      result.current.setInput("   ");
      await result.current.sendMessage();
    });

    expect(result.current.messages).toHaveLength(0);
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.errorInfo).toBeNull();
  });

  it("should handle pre-send network failure (sabotage simulation) and enable retry", async () => {
    const { result } = renderHook(() => useStreamingChat());

    await act(async () => {
      await result.current.sendMessage("__sabotage_network__");
    });

    expect(result.current.errorInfo).not.toBeNull();
    expect(result.current.errorInfo?.type).toBe("network");
    expect(result.current.errorInfo?.failedPrompt).toBe("__sabotage_network__");
    expect(result.current.isStreaming).toBe(false);
  });

  it("should handle 429 rate-limit error, capture error type, and retain failed prompt", async () => {
    const { result } = renderHook(() => useStreamingChat());

    await act(async () => {
      await result.current.sendMessage("__sabotage_429__");
    });

    expect(result.current.errorInfo).not.toBeNull();
    expect(result.current.errorInfo?.type).toBe("rate_limit");
    expect(result.current.errorInfo?.failedPrompt).toBe("__sabotage_429__");
    expect(result.current.isStreaming).toBe(false);
  });

  it("should handle mid-stream connection cut, preserve partial tokens, and mark message interrupted", async () => {
    // Mock fetch streaming 2 chunks then throwing
    let pullCount = 0;
    const mockStream = new ReadableStream({
      pull(controller) {
        if (pullCount === 0) {
          controller.enqueue(new TextEncoder().encode("Inception is a 2010 sci-fi"));
          pullCount++;
        } else if (pullCount === 1) {
          controller.enqueue(new TextEncoder().encode(" directed by Christopher Nolan"));
          pullCount++;
        } else {
          controller.error(new Error("Socket unexpectedly closed"));
        }
      },
    });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: mockStream,
    });

    const { result } = renderHook(() => useStreamingChat());

    await act(async () => {
      await result.current.sendMessage("Tell me about Inception");
    });

    expect(result.current.errorInfo).not.toBeNull();
    expect(result.current.errorInfo?.failedPrompt).toBe("Tell me about Inception");
    expect(result.current.isStreaming).toBe(false);

    // Assistant message with partial text is preserved and marked interrupted
    const assistantMsg = result.current.messages.find((m) => m.role === "assistant");
    expect(assistantMsg).toBeDefined();
    expect(assistantMsg?.content).toContain("Inception is a 2010 sci-fi");
    expect(assistantMsg?.isInterrupted).toBe(true);
  });

  it("should clear chat, reset error state, and remove storage on clearChat()", async () => {
    const { result } = renderHook(() => useStreamingChat());

    await act(async () => {
      await result.current.sendMessage("__sabotage_network__");
    });

    expect(result.current.errorInfo).not.toBeNull();

    await act(async () => {
      result.current.clearChat();
    });

    expect(result.current.messages).toHaveLength(0);
    expect(result.current.errorInfo).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("flymovie_chat_history_v2");
  });
});
