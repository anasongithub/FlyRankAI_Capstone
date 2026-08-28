"use client";

import React, { useState, useRef, useId, KeyboardEvent } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  ariaLabel?: string;
  orientation?: "horizontal" | "vertical";
  onChange?: (tabId: string) => void;
}

/**
 * W3C ARIA APG Compliant Tabs Component
 * - role="tablist" with aria-orientation & aria-label
 * - role="tab" with aria-selected, aria-controls & roving tabIndex (0 on active, -1 on others)
 * - role="tabpanel" with aria-labelledby & tabIndex="0"
 * - Full keyboard navigation:
 *    - ArrowRight / ArrowDown: next non-disabled tab
 *    - ArrowLeft / ArrowUp: previous non-disabled tab
 *    - Home: first non-disabled tab
 *    - End: last non-disabled tab
 */
export function Tabs({
  tabs,
  defaultTabId,
  ariaLabel = "Content sections",
  orientation = "horizontal",
  onChange,
}: TabsProps) {
  const baseId = useId();
  const [activeTabId, setActiveTabId] = useState<string>(
    defaultTabId || (tabs.length > 0 ? tabs[0].id : "")
  );

  const tabListRef = useRef<HTMLDivElement | null>(null);

  const activeIndex = tabs.findIndex((t) => t.id === activeTabId);
  const activeTab = tabs[activeIndex] || tabs[0];

  const handleSelectTab = (tabId: string) => {
    setActiveTabId(tabId);
    onChange?.(tabId);
  };

  const getEnabledTabs = () => tabs.filter((t) => !t.disabled);

  const focusTabByIndex = (index: number) => {
    if (!tabListRef.current) return;
    const tabButtons = tabListRef.current.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]:not([disabled])'
    );
    if (tabButtons[index]) {
      tabButtons[index].focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const enabled = getEnabledTabs();
    if (enabled.length === 0) return;

    const currentEnabledIndex = enabled.findIndex((t) => t.id === activeTabId);
    let nextIndex = -1;

    const isNext =
      (orientation === "horizontal" && e.key === "ArrowRight") ||
      (orientation === "vertical" && e.key === "ArrowDown");

    const isPrev =
      (orientation === "horizontal" && e.key === "ArrowLeft") ||
      (orientation === "vertical" && e.key === "ArrowUp");

    if (isNext) {
      e.preventDefault();
      nextIndex = (currentEnabledIndex + 1) % enabled.length;
    } else if (isPrev) {
      e.preventDefault();
      nextIndex = (currentEnabledIndex - 1 + enabled.length) % enabled.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = enabled.length - 1;
    }

    if (nextIndex !== -1) {
      const targetTab = enabled[nextIndex];
      handleSelectTab(targetTab.id);
      focusTabByIndex(nextIndex);
    }
  };

  return (
    <div
      className={`w-full flex ${
        orientation === "vertical" ? "flex-row gap-6" : "flex-col gap-4"
      }`}
    >
      {/* Tab List */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
        className={`flex ${
          orientation === "vertical"
            ? "flex-col border-r border-zinc-800 pr-2 w-48 shrink-0"
            : "flex-row border-b border-zinc-800 pb-px"
        } gap-2`}
      >
        {tabs.map((tab) => {
          const isSelected = tab.id === activeTabId;
          const tabElementId = `${baseId}-tab-${tab.id}`;
          const panelElementId = `${baseId}-panel-${tab.id}`;

          return (
            <button
              key={tab.id}
              id={tabElementId}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelElementId}
              disabled={tab.disabled}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => !tab.disabled && handleSelectTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition text-left focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                isSelected
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
              } ${tab.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panel */}
      {activeTab && (
        <div
          key={activeTab.id}
          id={`${baseId}-panel-${activeTab.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${activeTab.id}`}
          tabIndex={0}
          className="flex-1 p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-zinc-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
