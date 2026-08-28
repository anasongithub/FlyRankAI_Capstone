# Failure Inventory, Edge Cases & Recovery Matrix (FE-08)

**Module**: AI Streaming Chat, Error Boundaries & Generative UI  
**Phase**: Week 5 · Build & Resilience Testing  
**Evaluation Standard**: Checkpoint 1

---

## 1. Edge Case & Failure Mode Inventory

| Scenario / Failure Mode | Root Cause | System Response | User-Facing UI State | Recovery Mechanism |
|---|---|---|---|---|
| **Pre-send Network Offline** | User's device loses connection or DNS failure | Caught in `useStreamingChat` preflight check or fetch exception | Calm amber banner: *Network Offline* badge + explanation | One-click **"Retry message"** button re-submits exact prompt once connectivity returns |
| **Mid-Stream Connection Cutoff** | SSE socket closed unexpectedly / model timeout / cellular drop | Stream reader terminates prematurely; partial tokens retained | Assistant message flagged with *Stream interrupted mid-generation*; calm error card rendered | Retains all streamed text so far; provides **Retry** action to continue conversation |
| **HTTP 429 Rate Limit** | Upstream Gemini API concurrency limit hit | 429 status code returned by route handler | Orange badge: *Rate Limited (429)* | Debounced retry with backoff message |
| **Missing / Invalid API Key** | Missing or malformed Gemini token | 401/403 status code | Rose badge: *API Key Missing* | Direct link to `/settings` to enter key |
| **Empty Input Submission** | User presses Enter or clicks Send with blank input / whitespace | Client-side guard `if (!textToSend) return` | No empty or phantom messages appended | Send button disabled until valid character entered |
| **First-Run Empty State** | User opens `/chat` with no prior history | `messages.length === 0` | **Designed Onboarding Grid**: 4 categorized prompts with tool tags and capability summaries | Click any prompt card to immediately populate and stream results |
| **Slow Response / Cold Start** | Upstream LLM thinking time (> 1.5s) | `isThinking: true` active before first SSE chunk | `<ChatSkeleton />` matching real message geometry and avatar size | Prevents Cumulative Layout Shift (CLS); smooth transition into streamed tokens |
| **Malformed Tool Output** | Tool returns non-conforming schema | Handled in tool runner `try/catch` | Rose tool error card with diagnostics | Dedicated **"Retry Query"** button on that specific tool card |
| **Route Level Crash** | Uncaught runtime error in component tree | Handled by `src/app/chat/error.tsx` and `src/app/error.tsx` | Error boundary page with diagnostic details and navigation buttons | **"Reload conversation"** and **"Home"** reset buttons |

---

## 2. Reviewer Sabotage Testing Script

To verify resilience against intentional disruption, reviewers can use the interactive **"Test Sabotage"** bar in the `/chat` header or input these deterministic sabotage tokens:

1. **Kill Network**:
   - Trigger: Click `🔌 Kill Network` or submit `__sabotage_network__`.
   - Assertion: Displays *Network Offline* badge, preserves history, enables *Retry message* button.
2. **Cut Mid-Stream**:
   - Trigger: Click `✂️ Cut Mid-Stream` or submit `__sabotage_stream_cut__`.
   - Assertion: Streams initial tokens, simulates socket disconnect, marks message as *Stream interrupted mid-generation*, renders error card with working *Retry*.
3. **429 Rate Limit**:
   - Trigger: Click `⏱️ 429 Rate Limit` or submit `__sabotage_429__`.
   - Assertion: Displays *Rate Limited (429)* badge with retry micro-interaction.
4. **Malformed Tool Execution**:
   - Trigger: Submit `Analyze __sabotage_tool_error__`.
   - Assertion: Renders the 4th tool lifecycle state (`output-error`) with *Retry Query* button without crashing the chat.

---

## 3. Mobile Safari Hardening Checklist

- **Dynamic Viewport Height (`100dvh`)**: Used `h-[calc(100dvh-11rem)]` to prevent fixed viewport bottom clipping when Safari navigation bars expand/collapse.
- **Auto-Zoom Prevention**: Inputs configured with `text-base sm:text-sm` (16px base font on mobile) so iOS Safari will not zoom into textareas on focus.
- **Overscroll Containment**: Message thread styled with `overscroll-contain` to stop rubber-band elasticity from fighting the smart auto-scroll engine.
- **Safe Area Insets**: Input bar padded with `pb-[max(0.75rem,env(safe-area-inset-bottom))]` for iPhone home-indicator clearance.

---

## 4. Micro-Interaction Design Standards

- **Buttons with a Brain (Retry Micro-interaction)**:
  - Displays the exact failed prompt in quotes.
  - Implements an `isRetrying` state lock to eliminate race conditions and rapid double-clicks.
  - Smooth spinner rotation icon during retry dispatch.
- **Layout Shift Elimination**:
  - The `<ChatSkeleton />` geometry matches real assistant message padding, avatar dimensions, and line height to guarantee **0.0 CLS** during initial LLM latency.
