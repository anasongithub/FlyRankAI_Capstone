"use client";

import React, { useState, useId } from "react";

export interface DisclosureProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: (nextOpen: boolean) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

/**
 * W3C ARIA APG Compliant Disclosure Component
 * - <button> trigger with aria-expanded & aria-controls
 * - Container with role="region" & aria-labelledby matching the trigger button
 * - Native keyboard support (Space / Enter on button)
 * - Controlled and Uncontrolled modes
 */
export function Disclosure({
  title,
  children,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
  disabled = false,
  icon,
}: DisclosureProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalOpen;

  const buttonId = useId();
  const panelId = useId();

  const handleToggle = () => {
    if (disabled) return;
    const nextState = !isOpen;
    if (!isControlled) {
      setInternalOpen(nextState);
    }
    onToggle?.(nextState);
  };

  return (
    <div className="w-full border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/40 transition">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          disabled={disabled}
          onClick={handleToggle}
          className={`w-full flex items-center justify-between p-4 text-left font-semibold text-sm transition focus:outline-none focus:ring-2 focus:ring-violet-500 ${
            isOpen ? "text-violet-300 bg-zinc-800/40" : "text-zinc-300 hover:text-white hover:bg-zinc-800/20"
          } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          <span className="flex items-center gap-2.5">
            {icon}
            {title}
          </span>
          <svg
            className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-violet-400" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className={`p-4 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/80 bg-zinc-950/40 ${
          !isOpen ? "hidden" : "block"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
