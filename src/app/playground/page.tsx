"use client";

import React, { useState } from "react";
import { Modal } from "../../../playground/components/Modal";
import { Tabs } from "../../../playground/components/Tabs";
import { Disclosure } from "../../../playground/components/Disclosure";

export default function PlaygroundPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"standard" | "form">("standard");

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
          Week 4 · FE-05 Assignment
        </span>
        <h1 className="text-3xl font-extrabold text-white mt-1">
          Accessible Component Fundamentals Playground
        </h1>
        <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
          Three interactive components built from scratch adhering to the W3C ARIA Authoring
          Practices Guide (APG). Fully testable via keyboard navigation.
        </p>
      </div>

      {/* Component 1: Modal Dialog */}
      <section className="p-6 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-violet-500/20 text-violet-300 text-xs font-mono">
              01
            </span>
            Modal Dialog (APG Dialog Pattern)
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Tests focus trap (<kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">Tab</kbd> /{" "}
            <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">Shift+Tab</kbd>),{" "}
            <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">Escape</kbd> dismissal, and focus restoration to the trigger button.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setModalType("standard");
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            Open Info Dialog
          </button>

          <button
            type="button"
            onClick={() => {
              setModalType("form");
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold rounded-xl transition focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            Open Interactive Form Dialog
          </button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalType === "standard" ? "Keyboard Navigation Verified" : "Feedback Submission"}
          description={
            modalType === "standard"
              ? "This dialog traps focus automatically within its boundaries."
              : "Try tabbing through all inputs. Notice focus wraps around and returns to trigger upon closing."
          }
        >
          {modalType === "standard" ? (
            <div className="space-y-4 pt-2">
              <p>
                Press <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-violet-300">Tab</kbd> to cycle between the interactive elements below. Notice that focus cannot escape to the background page.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => alert("Action confirmed!")}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-violet-400"
                >
                  Confirm Action
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-zinc-500"
                >
                  Close (Escape)
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsModalOpen(false);
              }}
              className="space-y-3 pt-2"
            >
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Comments</label>
                <textarea
                  rows={3}
                  placeholder="Provide accessibility notes..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-lg transition"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </Modal>
      </section>

      {/* Component 2: Tabs */}
      <section className="p-6 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-violet-500/20 text-violet-300 text-xs font-mono">
              02
            </span>
            Tabs (APG Tabs Pattern with Roving Tabindex)
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Focus any tab, then use{" "}
            <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">←</kbd> /{" "}
            <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">→</kbd> to navigate,{" "}
            <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">Home</kbd> for first tab, and{" "}
            <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">End</kbd> for last tab.
          </p>
        </div>

        <Tabs
          ariaLabel="Accessibility criteria sections"
          tabs={[
            {
              id: "roles",
              label: "ARIA Roles",
              content: (
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-sm">Correct Semantic Hierarchy</h3>
                  <p className="text-xs leading-relaxed text-zinc-400">
                    The parent wrapper holds <code>role=&quot;tablist&quot;</code> with explicit <code>aria-orientation</code>. Each control carries <code>role=&quot;tab&quot;</code> and is linked to its panel via <code>aria-controls</code> and <code>aria-labelledby</code>.
                  </p>
                </div>
              ),
            },
            {
              id: "roving",
              label: "Roving Tabindex",
              content: (
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-sm">Keyboard Efficiency</h3>
                  <p className="text-xs leading-relaxed text-zinc-400">
                    Only the currently active tab has <code>tabIndex=0</code>. All inactive tabs carry <code>tabIndex=-1</code>. This prevents keyboard users from having to Tab through 10+ tabs before reaching panel content.
                  </p>
                </div>
              ),
            },
            {
              id: "focus",
              label: "Focusable Panel",
              content: (
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-sm">Panel Accessibility</h3>
                  <p className="text-xs leading-relaxed text-zinc-400">
                    Each <code>role=&quot;tabpanel&quot;</code> has <code>tabIndex=0</code> so keyboard users and screen readers can easily move focus into scrollable content sections.
                  </p>
                </div>
              ),
            },
            {
              id: "disabled",
              label: "Disabled State",
              disabled: true,
              content: <p>Disabled content</p>,
            },
          ]}
        />
      </section>

      {/* Component 3: Disclosure */}
      <section className="p-6 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-violet-500/20 text-violet-300 text-xs font-mono">
              03
            </span>
            Disclosure / Accordion (APG Disclosure Pattern)
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Uses native button element with dynamic <code>aria-expanded</code> and <code>aria-controls</code> attributes. Activate with{" "}
            <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">Space</kbd> or{" "}
            <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">Enter</kbd>.
          </p>
        </div>

        <div className="space-y-3">
          <Disclosure title="Why build accessibility by hand before using component libraries?" defaultOpen={true}>
            Building components by hand exposes the subtle mechanics required by assistive technology (focus containment, roving tabindexes, semantic region linking). Without this baseline knowledge, engineers cannot properly audit or customize AI-generated code.
          </Disclosure>

          <Disclosure title="What keyboard shortcuts must a disclosure support?">
            When focus is on the disclosure button, pressing either <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">Enter</kbd> or <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">Space</kbd> toggles the visibility of the controlled content region.
          </Disclosure>

          <Disclosure title="How do screen readers know which panel belongs to which button?">
            The button specifies <code>aria-controls=&quot;panel-id&quot;</code>, and the panel specifies <code>role=&quot;region&quot;</code> and <code>aria-labelledby=&quot;button-id&quot;</code>.
          </Disclosure>
        </div>
      </section>
    </div>
  );
}
