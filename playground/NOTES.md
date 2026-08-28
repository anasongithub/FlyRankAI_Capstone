# Architectural Review: Custom Accessible Components vs. shadcn/ui (Radix UI Primitives)

**Assignment**: FE-05 — Accessible Component Fundamentals  
**Track**: Frontend AI Engineering (Week 4)  
**Author**: Muhammad Anas  

---

## 1. Executive Summary

In this drill, we engineered three core interactive UI widgets (**Modal Dialog**, **Tabs**, and **Disclosure**) from scratch in React 19 + TypeScript, strictly implementing the [W3C ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/) specifications:
- **Modal Dialog**: Focus trapping, `Escape` key dismissal, focus restoration on unmount, `role="dialog"`, and `aria-modal="true"`.
- **Tabs**: Roving `tabIndex` (`0` for selected, `-1` for unselected), `ArrowLeft`/`ArrowRight`/`Home`/`End` keyboard navigation, `role="tablist"`, `role="tab"`, and `role="tabpanel"`.
- **Disclosure**: Dynamic `aria-expanded` and `aria-controls` bindings with native keyboard triggering.

After completing the scratch implementation, we inspected the internal source code of **shadcn/ui** and its underlying headless primitive library, **Radix UI** (`@radix-ui/react-dialog`, `@radix-ui/react-tabs`, `@radix-ui/react-accordion`).

This document outlines **critical architectural gaps** that exist between hand-rolled ARIA components and production-grade headless primitives.

---

## 2. Deep-Dive Gap Analysis: Custom vs. shadcn/ui (Radix UI)

### 🔴 Gap 1: Background Inertness & `aria-hidden` Tree Mutation (Dialog)
* **Our Custom Version**: Uses `aria-modal="true"` on the dialog wrapper and traps the `Tab` key via a `keydown` event listener.
* **What shadcn / Radix UI handles**:
  * While `aria-modal="true"` is the modern standard, legacy assistive technologies (and certain mobile screen reader virtual cursors) can still bypass keyboard focus traps and read underlying DOM elements.
  * Radix UI uses an internal utility (`aria-hidden` / `inert` manager) that walks the entire DOM tree outside the modal portal and dynamically injects `aria-hidden="true"` (or the HTML `inert` attribute) on all sibling root elements. When the dialog unmounts, it cleanly restores the previous attribute state.
* **Why it matters**: Guarantees that screen reader virtual navigation (VoiceOver rotor / swipe gestures) cannot bleed into background content behind the modal.

---

### 🔴 Gap 2: Scrollbar Width Compensation & Layout Shift (Dialog)
* **Our Custom Version**: Sets `document.body.style.overflow = "hidden"` on open and resets it on close.
* **What shadcn / Radix UI handles**:
  * On desktop operating systems with visible scrollbars (Windows, Linux, macOS with explicit scrollbar settings), removing `overflow` causes the scrollbar to disappear, causing an abrupt 15–17px layout shift (content jumps to the right).
  * Radix UI measures the browser's exact scrollbar width via `window.innerWidth - document.documentElement.clientWidth` and dynamically injects a compensatory `padding-right` onto `document.body` along with CSS variables (`--removed-body-scroll-bar-size`).
* **Why it matters**: Eliminates visual jank and jarring layout shifts during modal mount and unmount transitions.

---

### 🔴 Gap 3: Pointer Events & Outside Click / Drag Distinctions (Dialog)
* **Our Custom Version**: Listens for a standard `click` event on the overlay backdrop (`e.target === e.currentTarget`).
* **What shadcn / Radix UI handles**:
  * A classic UX flaw in scratch modals occurs when a user clicks and drags text inside the modal, releasing the mouse cursor *outside* the modal boundary onto the backdrop. A simple `click` or `mouseup` handler treats this as an "outside click" and unintentionally closes the dialog, losing the user's input.
  * Radix UI splits outside interaction detection into `onPointerDownOutside` and `onInteractOutside`, tracking where the pointer gesture originated (`pointerdown`) versus where it terminated.
* **Why it matters**: Prevents accidental modal closure when selecting text or interacting with input fields near dialog edges.

---

### 🔴 Gap 4: Nested Dialogs & Focus Scope Stacking (Dialog)
* **Our Custom Version**: Uses a single `previousFocusRef` to save the active element before opening.
* **What shadcn / Radix UI handles**:
  * If a user opens a confirmation dialog *on top* of an existing settings dialog (nested modals), our scratch implementation's single ref would overwrite the top-level trigger, breaking focus return when unwinding multiple dialog layers.
  * Radix UI uses a hierarchical `FocusScope` stack. Each dialog registers itself in a focus manager context. When the child dialog closes, focus returns to the parent dialog's active element; when the parent dialog closes, focus returns to the original page trigger.
* **Why it matters**: Essential for multi-step workflows, nested alerts, and popover menus inside modal windows.

---

### 🔴 Gap 5: Compound Component Composition vs. Monolithic Props (Tabs)
* **Our Custom Version**: Renders via a monolithic `tabs={[{ id, label, content }]}` config array.
* **What shadcn / Radix UI handles**:
  * shadcn uses React Context to provide a declarative, compound API:
    ```tsx
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account Details</TabsContent>
      <TabsContent value="password">Password Form</TabsContent>
    </Tabs>
    ```
  * This allows complete styling freedom (e.g., placing custom buttons, icons, or badges inside `TabsList` or positioning `TabsContent` in entirely separate DOM containers).
* **Why it matters**: In real-world enterprise applications, tabs frequently require decoupled layouts that a fixed JSON config prop cannot accommodate.

---

### 🔴 Gap 6: Bidirectional / RTL Keyboard Navigation (Tabs)
* **Our Custom Version**: Hardcodes `ArrowRight` to increment index and `ArrowLeft` to decrement index.
* **What shadcn / Radix UI handles**:
  * In Right-to-Left (RTL) locales (such as Arabic or Hebrew with `dir="rtl"`), the visual ordering of tabs is mirrored. Pressing `ArrowRight` should move to the *previous* visual tab, and `ArrowLeft` should move to the *next* tab.
  * Radix detects the document/container reading direction and flips arrow navigation automatically.
* **Why it matters**: Critical for internationalization (i18n) and global accessibility compliance.

---

### 🔴 Gap 7: Dynamic Height Animation via CSS Custom Properties (Disclosure / Accordion)
* **Our Custom Version**: Toggles the HTML `hidden` attribute and conditionally applies `display: none` / `block`.
* **What shadcn / Radix UI handles**:
  * CSS cannot smoothly animate `height: auto`.
  * Radix UI measures the DOM element's `scrollHeight` in a `useLayoutEffect` and exposes CSS variables (`--radix-accordion-content-height` and `--radix-accordion-content-width`). shadcn's Tailwind plugin uses these variables to power smooth keyframe accordion animations (`accordion-down`, `accordion-up`).
* **Why it matters**: Delivers 60fps micro-animations without compromising DOM accessibility or requiring hardcoded pixel heights.

---

## 3. Comparative Summary Matrix

| Feature / Requirement | Hand-Rolled W3C Implementation | shadcn/ui (Radix UI) |
|---|---|---|
| **W3C Semantic ARIA Roles** | ✅ Full compliance (`dialog`, `tablist`, `tab`, `tabpanel`, `region`) | ✅ Full compliance |
| **Keyboard Navigation (Tab, Escape, Arrows)** | ✅ Implemented & verified | ✅ Implemented & verified |
| **Focus Trapping & Restoration** | ✅ Single-level focus trap & return | ✅ Hierarchical `FocusScope` stack |
| **Background Tree Inertness** | ⚠️ `aria-modal="true"` only | ✅ Dynamic `aria-hidden` / `inert` tree walk |
| **Scrollbar Layout Shift Fix** | ❌ `overflow: hidden` causes 15px jump | ✅ Dynamic padding-right compensation |
| **Drag vs. Click Outside Precision** | ❌ Basic overlay click handler | ✅ `onPointerDownOutside` gesture tracking |
| **RTL (Right-to-Left) Localization** | ❌ Hardcoded LTR arrow keys | ✅ Dynamic `dir="rtl"` keyboard reversal |
| **Architecture & Extensibility** | ⚠️ Monolithic config props | ✅ Composable Compound Component pattern |
| **Exit Animations** | ❌ Immediate unmount | ✅ Coordinated unmounting via `Presence` state |

---

## 4. Key Takeaways for AI-Assisted Frontend Engineering

1. **Why hand-coding first is necessary**: AI coding models can quickly generate markup that *looks* accessible (e.g. slapping `role="dialog"` on a `<div>`), but they consistently omit edge-case mechanics: focus restoration after unmount, scrollbar jump compensation, and pointer gesture distinctions.
2. **When to use custom vs. libraries**:
   - For basic lightweight widgets without complex nesting, building from scratch avoids heavy dependencies.
   - For production enterprise apps, using unstyled primitives like **Radix UI** / **shadcn/ui** provides battle-tested accessibility edge-case handling while giving engineering teams 100% control over design systems and CSS styling.
