import { NextRequest, NextResponse } from "next/server";
import { AI_CONFIG, resolveGeminiApiKey, getGeminiStreamUrl, MessagePart } from "@/lib/ai/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages?: MessagePart[] } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "A valid array of conversation messages is required." },
        { status: 400 }
      );
    }

    const clientKey = req.headers.get("x-gemini-key");
    const apiKey = resolveGeminiApiKey(clientKey);

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Gemini API key is not configured. Please add your key in Settings or server environment variables.",
        },
        { status: 401 }
      );
    }

    // Format previous messages for Gemini contents array
    const contents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const geminiUrl = getGeminiStreamUrl(apiKey);

    const payload = {
      systemInstruction: {
        parts: [{ text: AI_CONFIG.systemInstruction }],
      },
      contents,
      generationConfig: {
        temperature: AI_CONFIG.temperature,
        topP: AI_CONFIG.topP,
        maxOutputTokens: AI_CONFIG.maxOutputTokens,
      },
    };

    const upstreamResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      let parsedError = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        parsedError = errorJson.error?.message || errorText;
      } catch {
        // use raw text
      }
      return NextResponse.json(
        { error: `Gemini API error (${upstreamResponse.status}): ${parsedError}` },
        { status: upstreamResponse.status }
      );
    }

    if (!upstreamResponse.body) {
      return NextResponse.json(
        { error: "Upstream stream body was empty." },
        { status: 502 }
      );
    }

    // Transform upstream SSE stream to raw text token chunks for the client
    const reader = upstreamResponse.body.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let buffer = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith("data:")) {
                const dataStr = trimmed.slice(5).trim();
                if (!dataStr || dataStr === "[DONE]") continue;

                try {
                  const dataJson = JSON.parse(dataStr);
                  const candidate = dataJson.candidates?.[0];
                  const textPart = candidate?.content?.parts?.[0]?.text;

                  if (textPart) {
                    controller.enqueue(encoder.encode(textPart));
                  }
                } catch {
                  // ignore non-json SSE lines
                }
              }
            }
          }

          // Handle any residual buffer
          if (buffer.trim().startsWith("data:")) {
            const dataStr = buffer.trim().slice(5).trim();
            if (dataStr && dataStr !== "[DONE]") {
              try {
                const dataJson = JSON.parse(dataStr);
                const textPart = dataJson.candidates?.[0]?.content?.parts?.[0]?.text;
                if (textPart) {
                  controller.enqueue(encoder.encode(textPart));
                }
              } catch {
                // ignore
              }
            }
          }

          controller.close();
        } catch (err: any) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err: any) {
    console.error("Chat API handler error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during chat processing." },
      { status: 500 }
    );
  }
}
